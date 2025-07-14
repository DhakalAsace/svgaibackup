/**
 * Alert Configuration System
 * Defines alert thresholds and channels based on search volume importance
 */

import { getISRConfigBySearchVolume } from './isr-config'
import { converterConfigs } from '@/app/convert/converter-config'

export interface AlertThresholds {
  // Performance thresholds
  webVitals: {
    lcp: number      // milliseconds
    inp: number      // milliseconds
    cls: number      // score
    fcp: number      // milliseconds
    ttfb: number     // milliseconds
  }
  
  // Conversion thresholds
  conversion: {
    errorRate: number         // percentage
    conversionRate: number    // minimum expected percentage
    dropoffRate: number       // maximum acceptable dropoff percentage
  }
  
  // Availability thresholds
  availability: {
    uptime: number           // percentage
    responseTime: number     // milliseconds
    timeout: number          // milliseconds
  }
  
  // Traffic thresholds
  traffic: {
    minDailyViews: number    // minimum expected daily views
    minConversions: number   // minimum daily conversions
  }
}

export interface AlertConfig {
  converterSlug: string
  searchVolume: number
  priority: 'high' | 'medium' | 'low'
  thresholds: AlertThresholds
  channels: AlertChannel[]
  escalation: EscalationPolicy
  schedule: AlertSchedule
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'sms'
  config: Record<string, any>
  severity: ('critical' | 'warning' | 'info')[]
}

export interface EscalationPolicy {
  levels: EscalationLevel[]
  repeatInterval: number // minutes before re-alerting
}

export interface EscalationLevel {
  afterMinutes: number
  channels: string[]
  message?: string
}

export interface AlertSchedule {
  checkInterval: number      // minutes between checks
  quietHours?: {
    start: number           // hour (0-23)
    end: number             // hour (0-23)
    timezone: string
  }
  maintenanceWindows?: {
    dayOfWeek: number       // 0-6 (Sunday-Saturday)
    startHour: number
    endHour: number
  }[]
}

/**
 * Get alert configuration for a converter based on search volume
 */
export function getAlertConfig(converterSlug: string): AlertConfig | null {
  const converter = converterConfigs.find(c => c.urlSlug === converterSlug)
  if (!converter) return null
  
  const isrConfig = getISRConfigBySearchVolume(converter.searchVolume)
  const priority = isrConfig.priority
  
  // Base configuration
  const config: AlertConfig = {
    converterSlug,
    searchVolume: converter.searchVolume,
    priority,
    thresholds: getThresholdsByPriority(priority),
    channels: getChannelsByPriority(priority),
    escalation: getEscalationPolicy(priority),
    schedule: getAlertSchedule(priority),
  }
  
  return config
}

/**
 * Get thresholds based on converter priority
 */
function getThresholdsByPriority(priority: 'high' | 'medium' | 'low'): AlertThresholds {
  const thresholds = {
    high: {
      webVitals: {
        lcp: 1500,     // 1.5s (stricter than Google's 2.5s)
        inp: 100,      // 100ms (stricter than Google's 200ms)
        cls: 0.05,     // 0.05 (stricter than Google's 0.1)
        fcp: 1000,     // 1s
        ttfb: 500,     // 500ms
      },
      conversion: {
        errorRate: 1,          // 1% max error rate
        conversionRate: 60,    // 60% minimum conversion rate
        dropoffRate: 20,       // 20% max dropoff
      },
      availability: {
        uptime: 99.9,          // 99.9% uptime
        responseTime: 1000,    // 1s response time
        timeout: 5000,         // 5s timeout
      },
      traffic: {
        minDailyViews: 1000,   // Based on search volume
        minConversions: 600,   // 60% of views
      }
    },
    medium: {
      webVitals: {
        lcp: 2000,     // 2s
        inp: 150,      // 150ms
        cls: 0.1,      // 0.1 (Google's threshold)
        fcp: 1500,     // 1.5s
        ttfb: 800,     // 800ms
      },
      conversion: {
        errorRate: 5,          // 5% max error rate
        conversionRate: 50,    // 50% minimum conversion rate
        dropoffRate: 30,       // 30% max dropoff
      },
      availability: {
        uptime: 99,            // 99% uptime
        responseTime: 2000,    // 2s response time
        timeout: 10000,        // 10s timeout
      },
      traffic: {
        minDailyViews: 100,    // Lower expectations
        minConversions: 50,    // 50% of views
      }
    },
    low: {
      webVitals: {
        lcp: 2500,     // 2.5s (Google's threshold)
        inp: 200,      // 200ms (Google's threshold)
        cls: 0.1,      // 0.1
        fcp: 2000,     // 2s
        ttfb: 1000,    // 1s
      },
      conversion: {
        errorRate: 10,         // 10% max error rate
        conversionRate: 40,    // 40% minimum conversion rate
        dropoffRate: 40,       // 40% max dropoff
      },
      availability: {
        uptime: 95,            // 95% uptime
        responseTime: 3000,    // 3s response time
        timeout: 15000,        // 15s timeout
      },
      traffic: {
        minDailyViews: 10,     // Minimal traffic expected
        minConversions: 4,     // 40% of views
      }
    }
  }
  
  return thresholds[priority]
}

/**
 * Get alert channels based on priority
 */
function getChannelsByPriority(priority: 'high' | 'medium' | 'low'): AlertChannel[] {
  const channels = {
    high: [
      {
        type: 'email' as const,
        config: { 
          to: ['engineering@svgai.org', 'oncall@svgai.org'],
          replyTo: 'alerts@svgai.org'
        },
        severity: ['critical', 'warning', 'info'] as ('critical' | 'warning' | 'info')[]
      },
      {
        type: 'slack' as const,
        config: { 
          channel: '#alerts-critical',
          mentions: ['@oncall', '@engineering']
        },
        severity: ['critical', 'warning'] as ('critical' | 'warning' | 'info')[]
      },
      {
        type: 'pagerduty' as const,
        config: { 
          serviceKey: process.env.PAGERDUTY_SERVICE_KEY,
          urgency: 'high'
        },
        severity: ['critical'] as ('critical' | 'warning' | 'info')[]
      }
    ],
    medium: [
      {
        type: 'email' as const,
        config: { 
          to: ['engineering@svgai.org'],
          replyTo: 'alerts@svgai.org'
        },
        severity: ['critical', 'warning'] as ('critical' | 'warning' | 'info')[]
      },
      {
        type: 'slack' as const,
        config: { 
          channel: '#alerts-general',
          mentions: ['@engineering']
        },
        severity: ['critical'] as ('critical' | 'warning' | 'info')[]
      }
    ],
    low: [
      {
        type: 'email' as const,
        config: { 
          to: ['engineering@svgai.org'],
          replyTo: 'alerts@svgai.org',
          digest: true // Send daily digest instead of immediate
        },
        severity: ['critical'] as ('critical' | 'warning' | 'info')[]
      }
    ]
  }
  
  return channels[priority]
}

/**
 * Get escalation policy based on priority
 */
function getEscalationPolicy(priority: 'high' | 'medium' | 'low'): EscalationPolicy {
  const policies = {
    high: {
      levels: [
        {
          afterMinutes: 0,
          channels: ['email', 'slack'],
          message: 'Initial alert'
        },
        {
          afterMinutes: 5,
          channels: ['pagerduty'],
          message: 'Escalating to on-call'
        },
        {
          afterMinutes: 15,
          channels: ['sms'],
          message: 'Critical: Requires immediate attention'
        }
      ],
      repeatInterval: 30 // Re-alert every 30 minutes if not resolved
    },
    medium: {
      levels: [
        {
          afterMinutes: 0,
          channels: ['email'],
          message: 'Initial alert'
        },
        {
          afterMinutes: 15,
          channels: ['slack'],
          message: 'Escalating to Slack'
        }
      ],
      repeatInterval: 60 // Re-alert every hour
    },
    low: {
      levels: [
        {
          afterMinutes: 0,
          channels: ['email'],
          message: 'Low priority alert'
        }
      ],
      repeatInterval: 240 // Re-alert every 4 hours
    }
  }
  
  return policies[priority]
}

/**
 * Get alert schedule based on priority
 */
function getAlertSchedule(priority: 'high' | 'medium' | 'low'): AlertSchedule {
  const schedules = {
    high: {
      checkInterval: 1, // Check every minute
      // No quiet hours for critical converters
    },
    medium: {
      checkInterval: 5, // Check every 5 minutes
      quietHours: {
        start: 22,    // 10 PM
        end: 8,       // 8 AM
        timezone: 'America/Los_Angeles'
      }
    },
    low: {
      checkInterval: 15, // Check every 15 minutes
      quietHours: {
        start: 18,    // 6 PM
        end: 9,       // 9 AM
        timezone: 'America/Los_Angeles'
      },
      maintenanceWindows: [
        {
          dayOfWeek: 0, // Sunday
          startHour: 2,
          endHour: 6
        }
      ]
    }
  }
  
  return schedules[priority]
}

/**
 * Check if alert should be sent based on schedule
 */
export function shouldSendAlert(config: AlertConfig, now: Date = new Date()): boolean {
  const { schedule } = config
  
  // Check quiet hours
  if (schedule.quietHours) {
    const hour = now.getHours()
    const { start, end } = schedule.quietHours
    
    if (start > end) {
      // Crosses midnight
      if (hour >= start || hour < end) return false
    } else {
      if (hour >= start && hour < end) return false
    }
  }
  
  // Check maintenance windows
  if (schedule.maintenanceWindows) {
    const dayOfWeek = now.getDay()
    const hour = now.getHours()
    
    for (const window of schedule.maintenanceWindows) {
      if (window.dayOfWeek === dayOfWeek && 
          hour >= window.startHour && 
          hour < window.endHour) {
        return false
      }
    }
  }
  
  return true
}

/**
 * Get alert message template
 */
export function getAlertMessage(
  config: AlertConfig,
  alertType: string,
  metrics: Record<string, any>
): string {
  const templates = {
    webVitalsThresholdExceeded: `
🚨 Performance Alert: ${config.converterSlug}
Priority: ${config.priority.toUpperCase()}
Search Volume: ${config.searchVolume.toLocaleString()}/month

Metrics exceeded thresholds:
${Object.entries(metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Dashboard: https://vercel.com/analytics?path=/convert/${config.converterSlug}
    `,
    conversionRateDropped: `
📉 Conversion Rate Alert: ${config.converterSlug}
Priority: ${config.priority.toUpperCase()}

Current Rate: ${metrics.currentRate}%
Expected: ${metrics.expectedRate}%
Drop: ${metrics.dropPercentage}%

View Details: https://svgai.org/admin/analytics/${config.converterSlug}
    `,
    highErrorRate: `
❌ High Error Rate: ${config.converterSlug}
Priority: ${config.priority.toUpperCase()}

Error Rate: ${metrics.errorRate}%
Threshold: ${config.thresholds.conversion.errorRate}%
Most Common Error: ${metrics.topError}

Investigate: https://svgai.org/admin/monitoring/${config.converterSlug}
    `
  }
  
  return templates[alertType as keyof typeof templates] || `Alert: ${alertType} for ${config.converterSlug}`
}