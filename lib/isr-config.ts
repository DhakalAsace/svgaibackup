/**
 * ISR (Incremental Static Regeneration) configuration based on traffic volumes
 * Implements task 2.8 requirements for traffic-based revalidation
 * 
 * Now using route groups for per-page revalidation:
 * - /convert/(high-traffic)/[converter] - 900s (15 min)
 * - /convert/(medium-traffic)/[converter] - 1800s (30 min)
 * - /convert/(low-traffic)/[converter] - 3600s (60 min)
 */

export interface ISRConfig {
  revalidate: number // seconds
  priority: 'high' | 'medium' | 'low'
  alertThreshold?: {
    lcp: number // milliseconds
    fid: number // milliseconds  
    cls: number // cumulative layout shift score
  }
}

/**
 * Get ISR configuration based on search volume
 * - Top converters (>10k searches): 900s (15 min) revalidation
 * - Medium traffic (1k-10k): 1800s (30 min) revalidation
 * - Low traffic (<1k): 3600s (60 min) revalidation
 */
export function getISRConfigBySearchVolume(searchVolume: number): ISRConfig {
  if (searchVolume >= 10000) {
    return {
      revalidate: 900, // 15 minutes
      priority: 'high',
      alertThreshold: {
        lcp: 1500, // 1.5s - stricter for high traffic
        fid: 100,  // 100ms
        cls: 0.05  // 0.05 - stricter for high traffic
      }
    }
  } else if (searchVolume >= 1000) {
    return {
      revalidate: 1800, // 30 minutes
      priority: 'medium',
      alertThreshold: {
        lcp: 2000, // 2s
        fid: 150,  // 150ms
        cls: 0.1   // 0.1
      }
    }
  } else {
    return {
      revalidate: 3600, // 60 minutes
      priority: 'low',
      alertThreshold: {
        lcp: 2500, // 2.5s - Google's threshold
        fid: 200,  // 200ms - Google's threshold
        cls: 0.1   // 0.1 - Google's threshold
      }
    }
  }
}

/**
 * Special monitoring configuration for complex converters
 * These require additional performance tracking due to their complexity
 */
export const COMPLEX_CONVERTERS = [
  'svg-to-mp4',     // Video conversion
  'svg-to-stl',     // 3D format
  'stl-to-svg',     // 3D format
  'eps-to-svg',     // Complex vector format
  'ai-to-svg',      // Adobe Illustrator
  'dxf-to-svg',     // CAD format
  'svg-to-dxf',     // CAD format
]

/**
 * Get monitoring configuration for a converter
 */
export function getMonitoringConfig(converterSlug: string, searchVolume: number) {
  const isComplex = COMPLEX_CONVERTERS.includes(converterSlug)
  const isrConfig = getISRConfigBySearchVolume(searchVolume)
  
  return {
    ...isrConfig,
    requiresSpecialMonitoring: isComplex,
    monitoringInterval: isComplex ? 300 : 900, // Check every 5 or 15 minutes
    metrics: {
      coreWebVitals: true,
      conversionRate: true,
      errorRate: true,
      loadTime: true,
      // Additional metrics for complex converters
      ...(isComplex && {
        memoryUsage: true,
        cpuUsage: true,
        conversionTime: true,
      })
    }
  }
}

/**
 * Performance budgets based on search volume
 * Higher traffic pages get stricter budgets
 */
export function getPerformanceBudget(searchVolume: number) {
  const priority = searchVolume >= 10000 ? 'high' : searchVolume >= 1000 ? 'medium' : 'low'
  
  const budgets = {
    high: {
      javascript: 200 * 1024,  // 200KB
      css: 50 * 1024,         // 50KB
      images: 500 * 1024,     // 500KB
      total: 1024 * 1024,     // 1MB
    },
    medium: {
      javascript: 300 * 1024,  // 300KB
      css: 75 * 1024,         // 75KB
      images: 750 * 1024,     // 750KB
      total: 1.5 * 1024 * 1024, // 1.5MB
    },
    low: {
      javascript: 400 * 1024,  // 400KB
      css: 100 * 1024,        // 100KB
      images: 1024 * 1024,    // 1MB
      total: 2 * 1024 * 1024, // 2MB
    }
  }
  
  return budgets[priority]
}

/**
 * Alert configuration for different priority levels
 * Higher priority pages get more aggressive alerting
 */
export function getAlertConfig(priority: 'high' | 'medium' | 'low') {
  return {
    high: {
      errorRateThreshold: 0.01,    // 1% error rate
      responseTimeThreshold: 1000,  // 1s
      alertChannels: ['email', 'slack', 'pagerduty'],
      alertDelay: 60,              // Alert after 1 minute
    },
    medium: {
      errorRateThreshold: 0.05,    // 5% error rate
      responseTimeThreshold: 2000,  // 2s
      alertChannels: ['email', 'slack'],
      alertDelay: 300,             // Alert after 5 minutes
    },
    low: {
      errorRateThreshold: 0.1,     // 10% error rate
      responseTimeThreshold: 3000,  // 3s
      alertChannels: ['email'],
      alertDelay: 900,             // Alert after 15 minutes
    }
  }[priority]
}