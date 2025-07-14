import { NextRequest, NextResponse } from 'next/server'
import { runHealthChecks } from '@/lib/monitoring'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Verify this is called by Vercel Cron or authorized service
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // In production, verify the request is authorized
    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
    
    // Run all health checks
    await runHealthChecks()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checks: [
        'webhook_health',
        'payment_health',
        'tool_performance'
      ]
    })
  } catch (error) {
    console.error('Health check endpoint error:', error)
    return NextResponse.json(
      { error: 'Health check failed', details: error?.toString() },
      { status: 500 }
    )
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request)
}