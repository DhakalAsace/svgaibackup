/**
 * Advanced Alert System
 * Manages alert notifications across multiple channels
 */

import { createClient } from '@/lib/supabase'
import { NOTIFICATION_CHANNELS, getActiveNotificationChannels } from './config'
import { AlertData } from '@/lib/analytics-alerts'

export interface AlertNotification {
  id: string
  alert: AlertData
  channels: string[]
  status: 'pending' | 'sent' | 'failed'
  attempts: number
  lastAttempt?: Date
  error?: string
}

export interface AlertStats {
  total: number
  byChannel: Record<string, number>
  bySeverity: Record<string, number>
  failureRate: number
}

/**
 * Send alert through email channel
 */
async function sendEmailAlert(alert: AlertData): Promise<boolean> {
  const config = NOTIFICATION_CHANNELS.email
  if (!config.enabled || !config.recipients.length) return false

  try {
    // In production, integrate with email service (SendGrid, SES, etc.)
    const response = await fetch('/api/monitoring/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: config.recipients,
        from: config.sender,
        subject: `[${alert.severity.toUpperCase()}] ${alert.tool} Alert`,
        html: formatEmailAlert(alert)
      })
    })

    return response.ok

  } catch (error) {
    console.error('Failed to send email alert:', error)
    return false
  }
}

/**
 * Send alert through Slack channel
 */
async function sendSlackAlert(alert: AlertData): Promise<boolean> {
  const config = NOTIFICATION_CHANNELS.slack
  if (!config.enabled || !config.webhookUrl) return false

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: config.channel,
        username: config.username,
        icon_emoji: getSlackEmoji(alert.severity),
        attachments: [{
          color: getSlackColor(alert.severity),
          title: `${alert.severity.toUpperCase()}: ${alert.tool}`,
          text: alert.message,
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
            }
          ],
          footer: 'SVG AI Monitoring',
          ts: Math.floor(Date.now() / 1000)
        }]
      })
    })

    return response.ok

  } catch (error) {
    console.error('Failed to send Slack alert:', error)
    return false
  }
}

/**
 * Send alert through webhook
 */
async function sendWebhookAlert(alert: AlertData): Promise<boolean> {
  const config = NOTIFICATION_CHANNELS.webhook
  if (!config.enabled || !config.url) return false

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        alert,
        timestamp: alert.timestamp,
        service: 'svg-ai-monitoring'
      })
    })

    return response.ok

  } catch (error) {
    console.error('Failed to send webhook alert:', error)
    return false
  }
}

/**
 * Send alert through PagerDuty
 */
async function sendPagerDutyAlert(alert: AlertData): Promise<boolean> {
  const config = NOTIFICATION_CHANNELS.pagerduty
  if (!config.enabled || !config.integrationKey) return false

  // Only send critical alerts to PagerDuty
  if (alert.severity !== 'critical') return true

  try {
    const response = await fetch('https://events.pagerduty.com/v2/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routing_key: config.integrationKey,
        event_action: 'trigger',
        dedup_key: `${alert.tool}-${alert.metric}`,
        payload: {
          summary: alert.message,
          severity: config.severityMapping[alert.severity],
          source: 'svg-ai-monitoring',
          component: alert.tool,
          custom_details: {
            metric: alert.metric,
            value: alert.value,
            threshold: alert.threshold,
            metadata: alert.metadata
          }
        }
      })
    })

    return response.ok

  } catch (error) {
    console.error('Failed to send PagerDuty alert:', error)
    return false
  }
}

/**
 * Send alert through all configured channels
 */
export async function sendAlert(alert: AlertData): Promise<AlertNotification> {
  const notification: AlertNotification = {
    id: crypto.randomUUID(),
    alert,
    channels: getActiveNotificationChannels().map(c => c.name),
    status: 'pending',
    attempts: 0
  }

  const results: Record<string, boolean> = {}

  // Send through all channels
  if (NOTIFICATION_CHANNELS.email.enabled) {
    results.email = await sendEmailAlert(alert)
  }
  
  if (NOTIFICATION_CHANNELS.slack.enabled) {
    results.slack = await sendSlackAlert(alert)
  }
  
  if (NOTIFICATION_CHANNELS.webhook.enabled) {
    results.webhook = await sendWebhookAlert(alert)
  }
  
  if (NOTIFICATION_CHANNELS.pagerduty.enabled) {
    results.pagerduty = await sendPagerDutyAlert(alert)
  }

  // Update notification status
  const successCount = Object.values(results).filter(r => r).length
  notification.status = successCount > 0 ? 'sent' : 'failed'
  notification.attempts = 1
  notification.lastAttempt = new Date()

  // Record to database
  await recordAlertNotification(notification, results)

  return notification
}

/**
 * Record alert notification to database
 */
async function recordAlertNotification(
  notification: AlertNotification,
  channelResults: Record<string, boolean>
) {
  const supabase = createClient()

  try {
    await supabase.from('monitoring_alerts').insert({
      tool: notification.alert.tool,
      metric: notification.alert.metric,
      value: notification.alert.value,
      threshold: notification.alert.threshold,
      severity: notification.alert.severity,
      message: notification.alert.message,
      metadata: {
        ...notification.alert.metadata,
        notification_id: notification.id,
        channels: channelResults,
        attempts: notification.attempts
      }
    })

  } catch (error) {
    console.error('Failed to record alert notification:', error)
  }
}

/**
 * Retry failed alert notifications
 */
export async function retryFailedAlerts(maxAge: number = 3600000): Promise<number> {
  const supabase = createClient()
  const since = new Date(Date.now() - maxAge)

  try {
    const { data: failedAlerts, error } = await supabase
      .from('monitoring_alerts')
      .select('*')
      .eq('acknowledged', false)
      .gte('created_at', since.toISOString())
      .filter('metadata->notification_id', 'not.is', null)
      .filter('metadata->attempts', 'lt', 3)

    if (error || !failedAlerts) {
      console.error('Failed to fetch failed alerts:', error)
      return 0
    }

    let retryCount = 0

    for (const alertRecord of failedAlerts) {
      // Extract value and threshold from context
      const context = alertRecord.context as Record<string, any>
      const alert: AlertData = {
        tool: alertRecord.tool,
        metric: alertRecord.metric,
        value: context?.value || 0,
        threshold: context?.threshold || 0,
        severity: alertRecord.severity as 'warning' | 'critical' | 'error',
        message: alertRecord.message,
        timestamp: alertRecord.created_at,
        metadata: context
      }

      const notification = await sendAlert(alert)
      
      if (notification.status === 'sent') {
        retryCount++
      }
    }

    return retryCount

  } catch (error) {
    console.error('Failed to retry alerts:', error)
    return 0
  }
}

/**
 * Format email alert HTML
 */
function formatEmailAlert(alert: AlertData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: ${getSeverityColor(alert.severity)}; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">${alert.severity.toUpperCase()} Alert</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f5f5f5;">
        <h2 style="margin-top: 0;">Service: ${alert.tool}</h2>
        <p style="font-size: 16px; line-height: 1.5;">${alert.message}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              <strong>Metric:</strong>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              ${alert.metric}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              <strong>Current Value:</strong>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              ${alert.value}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              <strong>Threshold:</strong>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              ${alert.threshold}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              <strong>Time:</strong>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: white;">
              ${alert.timestamp.toLocaleString()}
            </td>
          </tr>
        </table>
        
        ${alert.metadata ? `
          <div style="margin-top: 20px; padding: 15px; background-color: white; border: 1px solid #ddd;">
            <h3 style="margin-top: 0;">Additional Details:</h3>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">
${JSON.stringify(alert.metadata, null, 2)}
            </pre>
          </div>
        ` : ''}
        
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://svgai.org/dashboard/monitoring" 
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            View Dashboard
          </a>
        </div>
      </div>
      
      <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
        SVG AI Monitoring System | <a href="https://svgai.org">svgai.org</a>
      </div>
    </div>
  `
}

/**
 * Get severity color
 */
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#dc3545'
    case 'error': return '#fd7e14'
    case 'warning': return '#ffc107'
    default: return '#6c757d'
  }
}

/**
 * Get Slack color for severity
 */
function getSlackColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'danger'
    case 'error': return 'warning'
    case 'warning': return 'warning'
    default: return '#cccccc'
  }
}

/**
 * Get Slack emoji for severity
 */
function getSlackEmoji(severity: string): string {
  switch (severity) {
    case 'critical': return ':rotating_light:'
    case 'error': return ':x:'
    case 'warning': return ':warning:'
    default: return ':information_source:'
  }
}

/**
 * Get alert statistics
 */
export async function getAlertStats(hours: number = 24): Promise<AlertStats> {
  const supabase = createClient()
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  try {
    const { data: alerts, error } = await supabase
      .from('monitoring_alerts')
      .select('severity, context')
      .gte('created_at', since.toISOString())

    if (error || !alerts) {
      throw error || new Error('No alerts found')
    }

    const stats: AlertStats = {
      total: alerts.length,
      byChannel: {},
      bySeverity: {},
      failureRate: 0
    }

    let failedCount = 0

    for (const alert of alerts) {
      // Count by severity
      stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1

      // Count by channel
      const context = alert.context as Record<string, any>
      const channels = context?.channels || {}
      for (const [channel, success] of Object.entries(channels)) {
        stats.byChannel[channel] = (stats.byChannel[channel] || 0) + 1
        if (!success) failedCount++
      }
    }

    stats.failureRate = stats.total > 0 ? (failedCount / stats.total) * 100 : 0

    return stats

  } catch (error) {
    console.error('Failed to get alert stats:', error)
    return {
      total: 0,
      byChannel: {},
      bySeverity: {},
      failureRate: 0
    }
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    // Get the current alert to preserve existing context
    const { data: alert } = await supabase
      .from('monitoring_alerts')
      .select('context')
      .eq('id', alertId)
      .single()
    
    const currentContext = (alert?.context || {}) as Record<string, any>
    
    const { error } = await supabase
      .from('monitoring_alerts')
      .update({
        context: {
          ...currentContext,
          acknowledged: true,
          acknowledged_by: userId,
          acknowledged_at: new Date().toISOString()
        }
      })
      .eq('id', alertId)

    return !error

  } catch (error) {
    console.error('Failed to acknowledge alert:', error)
    return false
  }
}