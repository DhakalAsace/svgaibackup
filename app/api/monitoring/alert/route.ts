import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { AlertData } from '@/lib/analytics-alerts'

export async function POST(request: NextRequest) {
  try {
    const alert: AlertData = await request.json()
    
    // Log alert to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Monitoring Alert]', alert)
    }
    
    // Store alert in database
    const supabase = createClient()
    const { error } = await supabase
      .from('monitoring_alerts')
      .insert({
        tool: alert.tool,
        metric: alert.metric,
        severity: alert.severity,
        message: alert.message,
        context: {
          value: alert.value,
          threshold: alert.threshold,
          metadata: alert.metadata
        },
        created_at: alert.timestamp
      })
    
    if (error) {
      console.error('Failed to store alert:', error)
    }
    
    // In production, you might also:
    // - Send to external monitoring service (Datadog, New Relic, etc.)
    // - Trigger PagerDuty alerts for critical issues
    // - Send Slack notifications
    // - Email team members
    
    // Example Slack webhook (if configured)
    if (process.env.SLACK_WEBHOOK_URL && alert.severity !== 'warning') {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 ${alert.severity.toUpperCase()} Alert: ${alert.tool}`,
          attachments: [{
            color: alert.severity === 'critical' ? 'danger' : 'warning',
            fields: [
              {
                title: 'Metric',
                value: alert.metric,
                short: true
              },
              {
                title: 'Value',
                value: `${alert.value} (threshold: ${alert.threshold})`,
                short: true
              },
              {
                title: 'Message',
                value: alert.message,
                short: false
              }
            ],
            footer: 'SVG AI Monitoring',
            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
          }]
        })
      }).catch(err => console.error('Failed to send Slack alert:', err))
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Alert endpoint error:', error)
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    )
  }
}