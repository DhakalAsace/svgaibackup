import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getConverterBySlug } from '@/app/convert/converter-config'
import { getTrafficCategory } from '@/lib/converter-traffic-groups'

// This API route can be called to revalidate specific converter pages
// based on their traffic patterns
export async function POST(request: NextRequest) {
  try {
    const { converterSlug, secret } = await request.json()
    
    // Verify secret token for security
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }
    
    const converter = getConverterBySlug(converterSlug)
    if (!converter) {
      return NextResponse.json({ error: 'Converter not found' }, { status: 404 })
    }
    
    // Revalidate the specific converter path
    revalidatePath(`/convert/${converterSlug}`)
    
    // Also revalidate by tag for more granular control
    const category = getTrafficCategory(converter.searchVolume)
    revalidateTag(`converter-${category}`)
    revalidateTag(`converter-${converterSlug}`)
    
    return NextResponse.json({ 
      revalidated: true, 
      path: `/convert/${converterSlug}`,
      category,
      message: `Revalidated converter: ${converterSlug}`
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to revalidate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check revalidation status
export async function GET(request: NextRequest) {
  const converterSlug = request.nextUrl.searchParams.get('converter')
  
  if (!converterSlug) {
    return NextResponse.json({ error: 'Converter slug required' }, { status: 400 })
  }
  
  const converter = getConverterBySlug(converterSlug)
  if (!converter) {
    return NextResponse.json({ error: 'Converter not found' }, { status: 404 })
  }
  
  const category = getTrafficCategory(converter.searchVolume)
  const revalidateTime = category === 'high' ? 900 : category === 'medium' ? 1800 : 3600
  
  return NextResponse.json({
    converter: converterSlug,
    category,
    searchVolume: converter.searchVolume,
    revalidateSeconds: revalidateTime,
    revalidateMinutes: revalidateTime / 60,
    nextRevalidation: new Date(Date.now() + revalidateTime * 1000).toISOString()
  })
}