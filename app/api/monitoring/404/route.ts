import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { pathname, referrer, timestamp } = await request.json()

    // Store 404 error in database for monitoring
    const { error } = await supabase
      .from('error_logs')
      .insert({
        error_type: '404',
        path: pathname,
        referrer,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        timestamp
      })

    if (error) {
      console.error('Error logging 404:', error)
    }

    // Check if this is a frequent 404 and might need a redirect
    const { data: errorCount } = await supabase
      .from('error_logs')
      .select('count')
      .eq('path', pathname)
      .eq('error_type', '404')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (errorCount && errorCount[0]?.count > 10) {
      // Alert admin about frequent 404
      console.warn(`Frequent 404 detected: ${pathname} (${errorCount[0].count} times in last 7 days)`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in 404 monitoring:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}