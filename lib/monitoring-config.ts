/**
 * Monitoring Configuration
 * Centralized configuration for monitoring converters based on traffic
 */

import { getISRConfigBySearchVolume, COMPLEX_CONVERTERS } from './isr-config'
import { converterConfigs } from '@/app/convert/converter-config'

export interface MonitoringProfile {
  converterSlug: string
  searchVolume: number
  priority: 'high' | 'medium' | 'low'
  isComplex: boolean
  metrics: {
    webVitals: boolean
    conversionRate: boolean
    errorRate: boolean
    responseTime: boolean
    availability: boolean
    // Additional metrics for complex/high-traffic converters
    detailedLogging?: boolean
    realUserMonitoring?: boolean
    syntheticMonitoring?: boolean
  }
  alerts: {
    channels: string[]
    thresholds: {
      errorRate: number      // percentage
      responseTime: number   // milliseconds
      availability: number   // percentage
      conversionFailure: number // percentage
    }
    escalation: {
      delay: number // seconds before escalation
      channels: string[]
    }
  }
  dashboard: {
    refreshInterval: number // seconds
    retentionDays: number
    customCharts: string[]
  }
}

/**
 * Get monitoring profile for a converter
 */
export function getMonitoringProfile(converterSlug: string): MonitoringProfile | null {
  const converter = converterConfigs.find(c => c.urlSlug === converterSlug)
  if (!converter) return null
  
  const isrConfig = getISRConfigBySearchVolume(converter.searchVolume)
  const isComplex = COMPLEX_CONVERTERS.includes(converterSlug)
  
  // Base configuration for all converters
  const baseProfile: MonitoringProfile = {
    converterSlug,
    searchVolume: converter.searchVolume,
    priority: isrConfig.priority,
    isComplex,
    metrics: {
      webVitals: true,
      conversionRate: true,
      errorRate: true,
      responseTime: true,
      availability: true,
    },
    alerts: {
      channels: ['email'],
      thresholds: {
        errorRate: 10,        // 10% error rate
        responseTime: 3000,   // 3 seconds
        availability: 95,     // 95% uptime
        conversionFailure: 20 // 20% failure rate
      },
      escalation: {
        delay: 900, // 15 minutes
        channels: ['email']
      }
    },
    dashboard: {
      refreshInterval: 300,  // 5 minutes
      retentionDays: 30,
      customCharts: ['conversion-funnel', 'error-breakdown']
    }
  }
  
  // Enhance monitoring for high-traffic converters
  if (isrConfig.priority === 'high') {
    baseProfile.metrics.detailedLogging = true
    baseProfile.metrics.realUserMonitoring = true
    baseProfile.metrics.syntheticMonitoring = true
    
    baseProfile.alerts.channels = ['email', 'slack', 'pagerduty']
    baseProfile.alerts.thresholds = {
      errorRate: 1,          // 1% error rate
      responseTime: 1000,    // 1 second
      availability: 99.9,    // 99.9% uptime
      conversionFailure: 5   // 5% failure rate
    }
    baseProfile.alerts.escalation = {
      delay: 60, // 1 minute
      channels: ['slack', 'pagerduty', 'phone']
    }
    
    baseProfile.dashboard.refreshInterval = 60    // 1 minute
    baseProfile.dashboard.retentionDays = 90
    baseProfile.dashboard.customCharts.push(
      'real-time-traffic',
      'geographic-distribution',
      'browser-performance',
      'conversion-by-file-size'
    )
  }
  
  // Enhance monitoring for medium-traffic converters
  else if (isrConfig.priority === 'medium') {
    baseProfile.metrics.realUserMonitoring = true
    
    baseProfile.alerts.channels = ['email', 'slack']
    baseProfile.alerts.thresholds = {
      errorRate: 5,          // 5% error rate
      responseTime: 2000,    // 2 seconds
      availability: 99,      // 99% uptime
      conversionFailure: 10  // 10% failure rate
    }
    baseProfile.alerts.escalation = {
      delay: 300, // 5 minutes
      channels: ['slack']
    }
    
    baseProfile.dashboard.refreshInterval = 180   // 3 minutes
    baseProfile.dashboard.retentionDays = 60
  }
  
  // Additional monitoring for complex converters
  if (isComplex) {
    baseProfile.metrics.detailedLogging = true
    baseProfile.dashboard.customCharts.push(
      'memory-usage',
      'cpu-usage',
      'conversion-time-distribution'
    )
    
    // Stricter thresholds for complex converters
    baseProfile.alerts.thresholds.responseTime = Math.min(
      baseProfile.alerts.thresholds.responseTime,
      5000 // Max 5 seconds for complex conversions
    )
  }
  
  return baseProfile
}

/**
 * Get all converters grouped by monitoring priority
 */
export function getConvertersByMonitoringPriority() {
  const grouped = {
    high: [] as MonitoringProfile[],
    medium: [] as MonitoringProfile[],
    low: [] as MonitoringProfile[]
  }
  
  converterConfigs.forEach(converter => {
    const profile = getMonitoringProfile(converter.urlSlug)
    if (profile) {
      grouped[profile.priority].push(profile)
    }
  })
  
  // Sort by search volume within each group
  Object.keys(grouped).forEach(priority => {
    grouped[priority as keyof typeof grouped].sort((a, b) => 
      b.searchVolume - a.searchVolume
    )
  })
  
  return grouped
}

/**
 * Get monitoring dashboard configuration
 */
export function getMonitoringDashboardConfig() {
  const convertersByPriority = getConvertersByMonitoringPriority()
  
  return {
    overview: {
      criticalConverters: convertersByPriority.high.map(p => ({
        slug: p.converterSlug,
        searchVolume: p.searchVolume,
        dashboardUrl: `/admin/monitoring/${p.converterSlug}`
      })),
      totalMonitored: converterConfigs.length,
      byPriority: {
        high: convertersByPriority.high.length,
        medium: convertersByPriority.medium.length,
        low: convertersByPriority.low.length
      }
    },
    alerts: {
      aggregation: {
        // Combine alerts for low-traffic converters
        lowTrafficGrouping: true,
        groupingThreshold: 1000, // Group converters with <1k searches
      },
      globalThresholds: {
        // Site-wide thresholds
        totalErrorRate: 5,      // 5% across all converters
        p95ResponseTime: 2000,  // 2s for 95th percentile
        totalAvailability: 99   // 99% overall uptime
      }
    },
    reporting: {
      daily: ['high', 'medium'],     // Daily reports for high/medium
      weekly: ['low'],               // Weekly for low traffic
      monthly: ['all'],              // Monthly summary for all
      customReports: [
        {
          name: 'High Traffic Performance',
          converters: convertersByPriority.high.map(p => p.converterSlug),
          metrics: ['webVitals', 'conversionRate', 'errorRate'],
          frequency: 'daily'
        },
        {
          name: 'Complex Converter Health',
          converters: COMPLEX_CONVERTERS,
          metrics: ['responseTime', 'conversionFailure', 'memory-usage'],
          frequency: 'daily'
        }
      ]
    }
  }
}

/**
 * Get recommended monitoring setup for Vercel
 */
export function getVercelMonitoringSetup() {
  return {
    analytics: {
      // Vercel Analytics configuration
      webVitals: true,
      customEvents: [
        'conversion-started',
        'conversion-completed',
        'conversion-failed',
        'file-upload',
        'file-download'
      ]
    },
    speedInsights: {
      // Speed Insights configuration  
      routes: converterConfigs.map(c => `/convert/${c.urlSlug}`),
      sampleRate: {
        // Higher sample rate for high-traffic pages
        high: 1.0,    // 100% sampling
        medium: 0.5,  // 50% sampling
        low: 0.1      // 10% sampling
      }
    },
    logs: {
      // Log drain configuration
      retentionDays: {
        high: 30,
        medium: 14,
        low: 7
      },
      structured: true,
      includeMetadata: true
    },
    functions: {
      // Function monitoring
      maxDuration: {
        '/api/convert/*': 30,    // 30s for conversion APIs
        '/api/revalidate/*': 10, // 10s for revalidation
        default: 10              // 10s default
      }
    }
  }
}