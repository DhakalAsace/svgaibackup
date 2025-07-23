import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import * as fal from '@fal-ai/serverless-client'

// Configure fal client
fal.config({
  credentials: process.env.FAL_API_KEY || ''
})

// Fixed settings
const VIDEO_SETTINGS = {
  duration: 5,
  creditCost: 6  // Updated for Kling 2.1 pricing
}

// Retention days based on subscription
const RETENTION_DAYS = {
  free: 7,
  starter: 7,
  pro: 30
}

export async function POST(request: NextRequest) {
  let tempFileName: string | null = null

  try {
    // Get authenticated user
    const supabase = await createRouteClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in to use this feature' }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const prompt = formData.get('prompt') as string

    // Validate inputs
    if (!file || file.type !== 'image/svg+xml') {
      return NextResponse.json({ error: 'Please upload a valid SVG file' }, { status: 400 })
    }

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: 'Please describe how you want the video to animate' }, { status: 400 })
    }

    // Check FAL API key
    if (!process.env.FAL_API_KEY) {
      return NextResponse.json(
        { error: 'Video generation service not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Check user credits BEFORE processing
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('lifetime_credits_granted, lifetime_credits_used, monthly_credits, monthly_credits_used, subscription_status, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const isSubscribed = profile.subscription_status === 'active'
    const availableCredits = isSubscribed 
      ? (profile.monthly_credits ?? 0) - (profile.monthly_credits_used ?? 0)
      : (profile.lifetime_credits_granted ?? 6) - (profile.lifetime_credits_used ?? 0)

    if (availableCredits < VIDEO_SETTINGS.creditCost) {
      return NextResponse.json(
        { error: `Insufficient credits. You need ${VIDEO_SETTINGS.creditCost} credits.` },
        { status: 402 }
      )
    }

    // Convert SVG to PNG
    const svgContent = await file.text()
    const sharp = (await import('sharp')).default
    let pngBuffer: Buffer

    try {
      pngBuffer = await sharp(Buffer.from(svgContent))
        .png({ quality: 95 })
        .resize(1024, 1024, { 
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer()
    } catch (error) {
      console.error('SVG conversion error:', error)
      return NextResponse.json({ error: 'Failed to process SVG file. Please ensure it is a valid SVG.' }, { status: 400 })
    }

    // Create temp directory path (Supabase will create it if it doesn't exist)
    const timestamp = Date.now()
    tempFileName = `temp/${user.id}/${timestamp}.png`

    const { error: uploadError } = await supabase.storage
      .from('generated-svgs')
      .upload(tempFileName, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('[SVG-to-Video] Upload error details:', {
        error: uploadError,
        errorMessage: uploadError.message,
        errorStatusCode: (uploadError as any).statusCode,
        bucketName: 'generated-svgs',
        fileName: tempFileName
      })

      // If bucket not found, provide helpful message
      if (uploadError.message?.includes('Bucket not found')) {
        throw new Error('Storage bucket "generated-svgs" not found. Please create it in Supabase dashboard.')
      }

      throw new Error(`Failed to prepare image: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-svgs')
      .getPublicUrl(tempFileName)

    // Generate video with Kling 2.1
    const result = await fal.subscribe('fal-ai/kling-video/v2.1/standard/image-to-video', {
      input: {
        prompt: prompt,
        image_url: publicUrl,
        duration: "5",  // Kling expects string format
        negative_prompt: "blur, distort, low quality, static image",
        cfg_scale: 0.5
      }
    })

    const typedResult = result as { video?: { url?: string } }

    if (!typedResult.video?.url) {
      console.error('[SVG-to-Video] No video URL in result:', typedResult)
      throw new Error('Video generation failed - no video URL returned')
    }

    // Fetch generated video
    const videoResponse = await fetch(typedResult.video.url)
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch generated video')
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())

    // Determine retention period
    const tier = profile.subscription_tier || 'free'
    const retentionDays = RETENTION_DAYS[tier as keyof typeof RETENTION_DAYS] || 7
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + retentionDays)

    // Save video to permanent storage
    const videoFileName = `videos/${user.id}/${Date.now()}-ai-video.mp4`
    const { error: videoUploadError } = await supabase.storage
      .from('generated-svgs')
      .upload(videoFileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (videoUploadError) {
      console.error('Failed to save video:', videoUploadError)
      throw new Error('Failed to save video')
    }

    // Get video URL
    const { data: { publicUrl: videoUrl } } = supabase.storage
      .from('generated-svgs')
      .getPublicUrl(videoFileName)

    // Save video metadata to database
    const { error: dbError } = await supabase
      .from('generated_videos')
      .insert({
        user_id: user.id,
        prompt: prompt,
        video_url: videoUrl,
        storage_path: videoFileName,
        duration: VIDEO_SETTINGS.duration,
        resolution: '1080p',  // Kling 2.1 outputs high quality
        credits_used: VIDEO_SETTINGS.creditCost,
        expires_at: expiresAt.toISOString(),
        metadata: {
          model: 'kling-2.1-standard',
          original_svg: file.name
        }
      })

    if (dbError) {
      console.error('Failed to save video metadata:', dbError)
      // Continue - video was generated successfully
    }

    // NOW deduct credits after successful generation and storage
    if (isSubscribed) {
      await supabase
        .from('profiles')
        .update({ monthly_credits_used: (profile.monthly_credits_used ?? 0) + VIDEO_SETTINGS.creditCost })
        .eq('id', user.id)
    } else {
      await supabase
        .from('profiles')
        .update({ lifetime_credits_used: (profile.lifetime_credits_used ?? 0) + VIDEO_SETTINGS.creditCost })
        .eq('id', user.id)
    }

    // Clean up temp file
    if (tempFileName) {
      await supabase.storage
        .from('generated-svgs')
        .remove([tempFileName])
        .catch(() => {}) // Ignore cleanup errors
    }

    // Return video
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="ai-video-${Date.now()}.mp4"`,
        'X-Video-URL': videoUrl,
        'X-Expires-At': expiresAt.toISOString(),
        'Cache-Control': 'no-store'
      },
    })

  } catch (error) {
    // Clean up temp file on error
    if (tempFileName) {
      const supabase = await createRouteClient()
      await supabase.storage
        .from('generated-svgs')
        .remove([tempFileName])
        .catch(() => {})
    }

    console.error('Video generation error:', error)

    // Return user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Video service temporarily unavailable' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Video generation failed. Please try again.' },
      { status: 500 }
    )
  }
}