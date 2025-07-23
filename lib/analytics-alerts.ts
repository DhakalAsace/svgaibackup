/**
 * Analytics Alert System
 * Monitors tool usage and performance, sending alerts when thresholds are exceeded
 */
import { track } from '@vercel/analytics'
export interface AlertThreshold {
  metric: string
  threshold: number
  comparison: 'above' | 'below'
  severity: 'warning' | 'error' | 'critical'
}
export interface AlertConfig {
  tool: string
  thresholds: AlertThreshold[]
  channels: ('console' | 'email' | 'slack' | 'webhook')[]
  cooldown: number // minutes between alerts
}
// Alert configurations for each tool
export const ALERT_CONFIGS: AlertConfig[] = [
  {
    tool: 'svg-editor',
    thresholds: [
      { metric: 'error_rate', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'error_rate', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'session_duration', threshold: 600, comparison: 'above', severity: 'warning' },
      { metric: 'conversion_rate', threshold: 5, comparison: 'below', severity: 'warning' }
    ],
    channels: ['console', 'webhook'],
    cooldown: 15
  },
  {
    tool: 'svg-optimizer',
    thresholds: [
      { metric: 'processing_time', threshold: 5000, comparison: 'above', severity: 'warning' },
      { metric: 'processing_time', threshold: 10000, comparison: 'above', severity: 'error' },
      { metric: 'optimization_failure_rate', threshold: 5, comparison: 'above', severity: 'error' },
      { metric: 'file_size_reduction', threshold: 10, comparison: 'below', severity: 'warning' }
    ],
    channels: ['console', 'webhook'],
    cooldown: 10
  },
  {
    tool: 'svg-to-video',
    thresholds: [
      { metric: 'credit_usage', threshold: 10, comparison: 'above', severity: 'warning' },
      { metric: 'conversion_failure_rate', threshold: 5, comparison: 'above', severity: 'error' },
      { metric: 'processing_time', threshold: 30000, comparison: 'above', severity: 'critical' },
      { metric: 'api_error_rate', threshold: 1, comparison: 'above', severity: 'critical' }
    ],
    channels: ['console', 'email', 'slack'],
    cooldown: 5
  },
  {
    tool: 'svg-animation',
    thresholds: [
      { metric: 'complexity_score', threshold: 100, comparison: 'above', severity: 'warning' },
      { metric: 'render_time', threshold: 2000, comparison: 'above', severity: 'warning' },
      { metric: 'memory_usage', threshold: 100, comparison: 'above', severity: 'error' }
    ],
    channels: ['console'],
    cooldown: 20
  }
]
// Track recent alerts to prevent spam
const recentAlerts = new Map<string, number>()
export interface AlertData {
  tool: string
  metric: string
  value: number
  threshold: number
  severity: 'warning' | 'error' | 'critical'
  message: string
  timestamp: string
  metadata?: Record<string, any>
}
/**
 * Check if a metric exceeds its threshold
 */
export function checkThreshold(
  tool: string,
  metric: string,
  value: number,
  metadata?: Record<string, any>
): AlertData | null {
  const config = ALERT_CONFIGS.find(c => c.tool === tool)
  if (!config) return null
  const threshold = config.thresholds.find(t => t.metric === metric)
  if (!threshold) return null
  const exceeds = threshold.comparison === 'above' 
    ? value > threshold.threshold 
    : value < threshold.threshold
  if (!exceeds) return null
  // Check cooldown
  const alertKey = `${tool}_${metric}`
  const lastAlert = recentAlerts.get(alertKey)
  const now = Date.now()
  if (lastAlert && now - lastAlert < config.cooldown * 60 * 1000) {
    return null // Still in cooldown
  }
  recentAlerts.set(alertKey, now)
  const alert: AlertData = {
    tool,
    metric,
    value,
    threshold: threshold.threshold,
    severity: threshold.severity,
    message: `${tool} ${metric} is ${value} (threshold: ${threshold.comparison} ${threshold.threshold})`,
    timestamp: new Date().toISOString(),
    metadata
  }
  // Send alert through configured channels
  sendAlert(alert, config.channels)
  return alert
}
/**
 * Send alert through configured channels
 */
function sendAlert(alert: AlertData, channels: string[]) {
  channels.forEach(channel => {
    switch (channel) {
      case 'console':
        console[alert.severity === 'critical' ? 'error' : 'warn'](
          `[ALERT] ${alert.severity.toUpperCase()}: ${alert.message}`,
          alert
        )
        break
      case 'email':
        // In production, integrate with email service
        break
      case 'slack':
        // In production, integrate with Slack webhook
        break
      case 'webhook':
        // Send to monitoring service
        fetch('/api/monitoring/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert)
        }).catch(err => {
          // Error handled silently
        })
        break
    }
  })
  // Track alert in analytics
  track('monitoring_alert', {
    tool: alert.tool,
    metric: alert.metric,
    severity: alert.severity,
    value: alert.value,
    threshold: alert.threshold,
    ...alert.metadata
  })
}
/**
 * Monitor tool performance and usage
 */
export class ToolMonitor {
  private tool: string
  private metrics: Map<string, number[]> = new Map()
  private startTime: number
  constructor(tool: string) {
    this.tool = tool
    this.startTime = Date.now()
  }
  recordMetric(metric: string, value: number, metadata?: Record<string, any>) {
    // Store metric value
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, [])
    }
    this.metrics.get(metric)!.push(value)
    // Check threshold
    checkThreshold(this.tool, metric, value, metadata)
  }
  recordError(errorType: string, errorMessage: string) {
    this.recordMetric('error_count', 1, { errorType, errorMessage })
    // Calculate error rate
    const sessionDuration = (Date.now() - this.startTime) / 1000
    const errorCount = this.metrics.get('error_count')?.length || 0
    const errorRate = (errorCount / Math.max(sessionDuration, 1)) * 100
    checkThreshold(this.tool, 'error_rate', errorRate)
  }
  recordPerformance(metric: 'load_time' | 'processing_time' | 'render_time', value: number) {
    this.recordMetric(metric, value)
  }
  recordConversion(success: boolean) {
    this.recordMetric('conversion', success ? 1 : 0)
    // Calculate conversion rate
    const conversions = this.metrics.get('conversion') || []
    const successCount = conversions.filter(v => v === 1).length
    const conversionRate = (successCount / conversions.length) * 100
    checkThreshold(this.tool, 'conversion_rate', conversionRate)
  }
  getAverageMetric(metric: string): number {
    const values = this.metrics.get(metric) || []
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }
  getSummary() {
    const summary: Record<string, any> = {
      tool: this.tool,
      sessionDuration: (Date.now() - this.startTime) / 1000,
      metrics: {}
    }
    this.metrics.forEach((values, metric) => {
      summary.metrics[metric] = {
        count: values.length,
        average: this.getAverageMetric(metric),
        min: Math.min(...values),
        max: Math.max(...values)
      }
    })
    return summary
  }
}
/**
 * Create a monitor for a specific tool
 */
export function createToolMonitor(tool: string): ToolMonitor {
  return new ToolMonitor(tool)
}
/**
 * Batch check multiple metrics
 */
export function checkMetrics(tool: string, metrics: Record<string, number>): AlertData[] {
  const alerts: AlertData[] = []
  Object.entries(metrics).forEach(([metric, value]) => {
    const alert = checkThreshold(tool, metric, value)
    if (alert) alerts.push(alert)
  })
  return alerts
}
/**
 * Get alert history for a tool
 */
export function getAlertHistory(tool: string, limit: number = 10): AlertData[] {
  // In production, this would fetch from a database
  // For now, return empty array
  return []
}
/**
 * Clear alert cooldowns (useful for testing)
 */
export function clearAlertCooldowns() {
  recentAlerts.clear()
}