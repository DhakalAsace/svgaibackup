import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const format = formData.get('format') as string
    const quality = formData.get('quality') as string
    const fps = formData.get('fps') as string
    const duration = formData.get('duration') as string

    if (!file || file.type !== 'image/svg+xml') {
      return NextResponse.json(
        { error: 'Invalid SVG file' },
        { status: 400 }
      )
    }

    // Calculate credit cost
    const creditCosts = {
      standard: 2,
      hd: 3,
      '4k': 5,
    }
    const creditCost = creditCosts[quality as keyof typeof creditCosts] || 3

    // Check user credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    if (profile.credits < creditCost) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // In a real implementation, you would:
    // 1. Process the SVG file using a service like FFmpeg or a cloud API
    // 2. Convert it to MP4/GIF based on the settings
    // 3. Store the result temporarily
    // 4. Deduct credits from the user
    // 5. Return the video file

    // For now, we'll simulate the conversion
    const svgContent = await file.text()
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Deduct credits
    const { error: creditError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - creditCost })
      .eq('id', user.id)

    if (creditError) {
      console.error('Failed to deduct credits:', creditError)
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      )
    }

    // Log the conversion
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -creditCost,
      type: 'svg_to_video',
      description: `SVG to ${format.toUpperCase()} conversion (${quality})`,
    })

    // In production, you would return the actual video file
    // For demo, we'll return a success message
    // The actual video binary would be returned like this:
    // return new NextResponse(videoBuffer, {
    //   headers: {
    //     'Content-Type': format === 'mp4' ? 'video/mp4' : 'image/gif',
    //     'Content-Disposition': `attachment; filename="converted.${format}"`,
    //   },
    // })

    // Demo response - in production this would be the actual video file
    const demoVideoData = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70])
    
    return new NextResponse(demoVideoData, {
      headers: {
        'Content-Type': format === 'mp4' ? 'video/mp4' : 'image/gif',
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    })

  } catch (error) {
    console.error('SVG to video conversion error:', error)
    return NextResponse.json(
      { error: 'Conversion failed' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}