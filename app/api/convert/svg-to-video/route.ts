import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import * as fal from '@fal-ai/serverless-client'
import { executeWithCredits } from '@/lib/credit-operations'
import { createLogger } from '@/lib/logger'
import { handleAPIError, extractErrorDetails } from '@/lib/api-error-handler'

// Initialize logger
const logger = createLogger('api:svg-to-video');

// Configure fal client
fal.config({
  credentials: process.env.FAL_API_KEY || ''
})

// Initialize Supabase admin client for credit operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  { auth: { persistSession: false } }
);

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

// Helper function that contains all the video generation logic
async function performVideoGeneration(
  file: File,
  prompt: string,
  user: any,
  profile: any,
  supabase: any
) {
  let tempFileName: string | null = null;

  try {
    // Convert SVG to PNG
    const svgContent = await file.text();
    const sharp = (await import('sharp')).default;
    let pngBuffer: Buffer;

    try {
      pngBuffer = await sharp(Buffer.from(svgContent))
        .png({ quality: 95 })
        .resize(1024, 1024, { 
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer();
    } catch (error) {
      logger.error('SVG conversion error:', error);
      throw new Error('Failed to process SVG file. Please ensure it is a valid SVG.');
    }

    // Create temp directory path
    const timestamp = Date.now();
    tempFileName = `temp/${user.id}/${timestamp}.png`;

    const { error: uploadError } = await supabase.storage
      .from('generated-svgs')
      .upload(tempFileName, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      logger.error('[SVG-to-Video] Upload error details:', {
        error: uploadError,
        errorMessage: uploadError.message,
        bucketName: 'generated-svgs',
        fileName: tempFileName
      });

      if (uploadError.message?.includes('Bucket not found')) {
        throw new Error('Storage bucket "generated-svgs" not found. Please create it in Supabase dashboard.');
      }

      throw new Error(`Failed to prepare image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-svgs')
      .getPublicUrl(tempFileName);

    // Generate video with Kling 2.1
    let result;
    try {
      result = await fal.subscribe('fal-ai/kling-video/v2.1/standard/image-to-video', {
        input: {
          prompt: prompt,
          image_url: publicUrl,
          duration: "5",  // Kling expects string format
          negative_prompt: "blur, distort, low quality, static image",
          cfg_scale: 0.5
        }
      });
    } catch (falError) {
      // Handle Fal AI API errors
      const errorDetails = extractErrorDetails(falError);
      const apiError = handleAPIError(falError);
      
      logger.error('Fal AI API error', { 
        error: errorDetails,
        statusCode: apiError.statusCode
      });
      
      throw new Error(apiError.userMessage);
    }

    const typedResult = result as { video?: { url?: string } };

    if (!typedResult.video?.url) {
      logger.error('[SVG-to-Video] No video URL in result:', typedResult);
      throw new Error('Video generation failed - no video URL returned');
    }

    // Fetch generated video
    const videoResponse = await fetch(typedResult.video.url);
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch generated video');
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

    // Determine retention period
    const tier = profile.subscription_tier || 'free';
    const retentionDays = RETENTION_DAYS[tier as keyof typeof RETENTION_DAYS] || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);

    // Save video to permanent storage
    const videoFileName = `videos/${user.id}/${Date.now()}-ai-video.mp4`;
    const { error: videoUploadError } = await supabase.storage
      .from('generated-svgs')
      .upload(videoFileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '31536000', // 1 year cache
        upsert: false
      });

    if (videoUploadError) {
      logger.error('Failed to save video:', videoUploadError);
      throw new Error('Failed to save video');
    }

    // Get video URL
    const { data: { publicUrl: videoUrl } } = supabase.storage
      .from('generated-svgs')
      .getPublicUrl(videoFileName);

    // Save video metadata to database
    const { error: dbError } = await supabase
      .from('generated_videos')
      .insert({
        user_id: user.id,
        prompt: prompt,
        video_url: videoUrl,
        storage_path: videoFileName,
        duration: VIDEO_SETTINGS.duration,
        resolution: '1080p',
        credits_used: VIDEO_SETTINGS.creditCost,
        expires_at: expiresAt.toISOString(),
        metadata: {
          model: 'kling-2.1-standard',
          original_svg: file.name
        }
      });

    if (dbError) {
      logger.error('Failed to save video metadata:', dbError);
      // Continue - video was generated successfully
    }

    // Clean up temp file
    if (tempFileName) {
      await supabase.storage
        .from('generated-svgs')
        .remove([tempFileName])
        .catch(() => {}); // Ignore cleanup errors
    }

    return {
      videoBuffer,
      videoUrl,
      expiresAt
    };
  } catch (error) {
    // Clean up temp file on error
    if (tempFileName) {
      await supabase.storage
        .from('generated-svgs')
        .remove([tempFileName])
        .catch(() => {});
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
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

    // Get user profile for retention period calculation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Execute video generation with automatic credit handling
    const result = await executeWithCredits({
      operation: async () => {
        return await performVideoGeneration(file, prompt, user, profile, supabase);
      },
      userId: user.id,
      identifier: user.id,
      identifierType: 'user_id',
      generationType: 'video',
      supabaseAdmin: supabaseAdmin as any
    });

    if (!result.success) {
      logger.error('Video generation failed', { error: result.error });
      return NextResponse.json(
        { error: result.error || 'Video generation failed' },
        { status: 500 }
      );
    }

    // Extract results
    const { videoBuffer, videoUrl, expiresAt } = result.data!;

    // Return video
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="ai-video-${Date.now()}.mp4"`,
        'X-Video-URL': videoUrl,
        'X-Expires-At': expiresAt.toISOString(),
        'Cache-Control': 'no-store'
      },
    });

  } catch (error) {
    // Error handling - credits are automatically refunded by executeWithCredits
    logger.error('Video generation error:', error);

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