import { NextRequest, NextResponse } from 'next/server'
import { getAlertConfig, shouldSendAlert, getAlertMessage } from '@/lib/alert-config'
import { converterConfigs } from '@/app/convert/converter-config'

/**
 * POST /api/monitoring/check-alerts
 * Checks alert thresholds and triggers alerts if needed
 * This would typically be called by a cron job
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const converterSlug = searchParams.get('converter')
    const dryRun = searchParams.get('dryRun') === 'true'
    
    const alertsTriggered = []
    const convertersToCheck = converterSlug 
      ? converterConfigs.filter(c => c.urlSlug === converterSlug)
      : converterConfigs.filter(c => c.isSupported) // Only check supported converters
    
    for (const converter of convertersToCheck) {
      const alertConfig = getAlertConfig(converter.urlSlug)
      if (!alertConfig) continue
      
      // Check if we should send alerts based on schedule
      if (!shouldSendAlert(alertConfig)) {
        continue
      }
      
      // In production, fetch actual metrics from your monitoring system
      const metrics = await fetchConverterMetrics(converter.urlSlug)
      
      // Check thresholds
      const violations = checkThresholds(alertConfig, metrics)
      
      if (violations.length > 0) {
        for (const violation of violations) {
          const alert = {
            converter: converter.urlSlug,
            priority: alertConfig.priority,
            type: violation.type,
            severity: violation.severity,
            message: getAlertMessage(alertConfig, violation.type, violation.metrics),
            channels: getChannelsForSeverity(alertConfig, violation.severity),
            timestamp: new Date().toISOString(),
          }
          
          if (!dryRun) {
            // In production, send actual alerts
            await sendAlert(alert)
          }
          
          alertsTriggered.push(alert)
        }
      }
    }
    
    return NextResponse.json({
      checked: convertersToCheck.length,
      alertsTriggered: alertsTriggered.length,
      alerts: alertsTriggered,
      dryRun,
    })
    
  } catch (error) {
    console.error('Alert checking error:', error)
    return NextResponse.json(
      { error: 'Failed to check alerts' },
      { status: 500 }
    )
  }
}

/**
 * Fetch converter metrics (mock implementation)
 * In production, fetch from your monitoring system
 */
async function fetchConverterMetrics(converterSlug: string) {
  // Mock metrics for demonstration
  return {
    webVitals: {
      lcp: Math.random() * 3000,
      inp: Math.random() * 300,
      cls: Math.random() * 0.2,
      fcp: Math.random() * 2000,
      ttfb: Math.random() * 1500,
    },
    conversion: {
      errorRate: Math.random() * 15,
      conversionRate: Math.random() * 80,
      dropoffRate: Math.random() * 50,
    },
    availability: {
      uptime: 95 + Math.random() * 5,
      responseTime: Math.random() * 3000,
    },
    traffic: {
      dailyViews: Math.floor(Math.random() * 2000),
      dailyConversions: Math.floor(Math.random() * 1500),
    }
  }
}

/**
 * Check if metrics violate thresholds
 */
function checkThresholds(config: any, metrics: any) {
  const violations = []
  const { thresholds } = config
  
  // Check Web Vitals
  if (metrics.webVitals.lcp > thresholds.webVitals.lcp) {
    violations.push({
      type: 'webVitalsThresholdExceeded',
      severity: 'warning',
      metrics: { 
        lcp: `${metrics.webVitals.lcp.toFixed(0)}ms (threshold: ${thresholds.webVitals.lcp}ms)`
      }
    })
  }
  
  if (metrics.webVitals.inp > thresholds.webVitals.inp) {
    violations.push({
      type: 'webVitalsThresholdExceeded',
      severity: 'warning',
      metrics: { 
        inp: `${metrics.webVitals.inp.toFixed(0)}ms (threshold: ${thresholds.webVitals.inp}ms)`
      }
    })
  }
  
  // Check conversion metrics
  if (metrics.conversion.errorRate > thresholds.conversion.errorRate) {
    violations.push({
      type: 'highErrorRate',
      severity: 'critical',
      metrics: {
        errorRate: metrics.conversion.errorRate.toFixed(1),
        topError: 'File format not supported', // Mock error
      }
    })
  }
  
  if (metrics.conversion.conversionRate < thresholds.conversion.conversionRate) {
    violations.push({
      type: 'conversionRateDropped',
      severity: 'warning',
      metrics: {
        currentRate: metrics.conversion.conversionRate.toFixed(1),
        expectedRate: thresholds.conversion.conversionRate,
        dropPercentage: (
          thresholds.conversion.conversionRate - metrics.conversion.conversionRate
        ).toFixed(1),
      }
    })
  }
  
  // Check availability
  if (metrics.availability.uptime < thresholds.availability.uptime) {
    violations.push({
      type: 'lowAvailability',
      severity: 'critical',
      metrics: {
        uptime: `${metrics.availability.uptime.toFixed(2)}%`,
        threshold: `${thresholds.availability.uptime}%`,
      }
    })
  }
  
  return violations
}

/**
 * Get channels to notify based on severity
 */
function getChannelsForSeverity(config: any, severity: string) {
  return config.channels
    .filter((channel: any) => channel.severity.includes(severity))
    .map((channel: any) => channel.type)
}

/**
 * Send alert (mock implementation)
 * In production, integrate with your alert services
 */
async function sendAlert(alert: any) {
  console.log('Sending alert:', alert)
  
  // In production, implement actual alert sending:
  // - Email via SendGrid/SES
  // - Slack via webhook
  // - PagerDuty via API
  // - SMS via Twilio
  
  return Promise.resolve()
}