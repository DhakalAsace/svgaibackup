import { createClient } from '@/lib/supabase'
import { checkThreshold, AlertData } from '@/lib/analytics-alerts'
import { track } from '@vercel/analytics'

export async function checkWebhookHealth() {
  const supabase = createClient()
  
  // Query recent webhook events
  const { data: events, error } = await supabase
    .from('webhook_events')
    .select('*')
    .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
    .order('created_at', { ascending: false })
  
  if (error || !events) {
    console.error('Failed to fetch webhook events:', error)
    return
  }
  
  const failureRate = calculateFailureRate(events)
  
  // Check threshold and send alert if needed
  checkThreshold('webhooks', 'failure_rate', failureRate * 100, {
    totalEvents: events.length,
    failedEvents: events.filter((e: any) => e.status === 'failed').length
  })
  
  // Track in analytics
  const avgProcessingTime = events.length > 0 
    ? events.reduce((sum: number, e: any) => sum + (e.processing_time || 0), 0) / events.length
    : 0
  
  track('webhook_performance', {
    metric: 'processing_time',
    value: avgProcessingTime,
    total_events: events.length
  })
}

export async function checkPaymentHealth() {
  const supabase = createClient()
  
  // Query payment audit log for checkout statistics
  const { data: checkouts, error } = await supabase
    .from('payment_audit_log')
    .select('*')
    .in('event_type', ['checkout_started', 'checkout_completed'])
    .gte('created_at', new Date(Date.now() - 86400000).toISOString()) // Last 24 hours
  
  if (error || !checkouts) {
    console.error('Failed to fetch payment stats:', error)
    return
  }
  
  const started = checkouts.filter((c: any) => c.event_type === 'checkout_started').length
  const completed = checkouts.filter((c: any) => c.event_type === 'checkout_completed').length
  const completionRate = started > 0 ? (completed / started) * 100 : 0
  
  // Check threshold
  checkThreshold('payments', 'checkout_completion_rate', completionRate, {
    checkoutsStarted: started,
    checkoutsCompleted: completed
  })
  
  // Track in analytics
  track('payment_health', {
    checkouts_started: started,
    checkouts_completed: completed,
    completion_rate: completionRate
  })
}

export async function checkToolPerformance() {
  const supabase = createClient()
  
  // Query monitoring metrics for tool performance
  const { data: metrics, error } = await supabase
    .from('monitoring_metrics')
    .select('tool, metric, value')
    .gte('created_at', new Date(Date.now() - 3600000).toISOString())
  
  if (error || !metrics) {
    console.error('Failed to fetch monitoring metrics:', error)
    return
  }
  
  // Group metrics by tool
  const toolMetrics = metrics.reduce((acc: Record<string, Record<string, number[]>>, m: any) => {
    if (!acc[m.tool]) acc[m.tool] = {}
    if (!acc[m.tool][m.metric]) acc[m.tool][m.metric] = []
    acc[m.tool][m.metric].push(m.value)
    return acc
  }, {} as Record<string, Record<string, number[]>>)
  
  // Check thresholds for each tool
  Object.entries(toolMetrics).forEach(([tool, metrics]) => {
    Object.entries(metrics).forEach(([metric, values]: [string, number[]]) => {
      const avgValue = values.reduce((sum: number, v: number) => sum + v, 0) / values.length
      checkThreshold(tool, metric, avgValue, {
        sampleSize: values.length,
        minValue: Math.min(...values),
        maxValue: Math.max(...values)
      })
    })
  })
}

// Helper functions
function calculateFailureRate(events: any[]): number {
  if (events.length === 0) return 0
  const failures = events.filter((e: any) => e.status === 'failed').length
  return failures / events.length
}

export async function sendAlert(alert: AlertData) {
  // This is now handled by the analytics-alerts system
  // but we can add additional custom handling here if needed
  
  // Send critical alerts to external monitoring
  if (alert.severity === 'critical') {
    // Send to PagerDuty, Datadog, etc.
    console.error('CRITICAL ALERT:', alert)
  }
}

// Scheduled monitoring checks
export async function runHealthChecks() {
  try {
    await Promise.all([
      checkWebhookHealth(),
      checkPaymentHealth(),
      checkToolPerformance()
    ])
  } catch (error) {
    console.error('Health check failed:', error)
    
    // Track health check failures
    track('error', {
      category: 'monitoring',
      error_type: 'health_check_failed',
      error_message: error?.toString() || 'Unknown error'
    })
  }
}