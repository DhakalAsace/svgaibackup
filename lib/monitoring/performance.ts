/**
 * Performance Monitoring System
 * Tracks and analyzes performance metrics across all services
 */

import { createClient } from '@/lib/supabase'
import { checkThreshold } from '@/lib/analytics-alerts'
import { PERFORMANCE_CONFIG, getServiceConfig } from './config'
import { track } from '@vercel/analytics'

export interface PerformanceMetric {
  service: string
  metric: string
  value: number
  unit: 'ms' | 'MB' | 'percentage' | 'count'
  metadata?: Record<string, any>
  timestamp: Date
}

export interface PerformanceReport {
  service: string
  period: string
  metrics: {
    [key: string]: {
      p50: number
      p95: number
      p99: number
      avg: number
      min: number
      max: number
      count: number
    }
  }
  violations: Array<{
    metric: string
    threshold: number
    actual: number
    percentile: 'p50' | 'p95' | 'p99'
  }>
}

/**
 * Performance tracker for monitoring execution times and resource usage
 */
export class PerformanceTracker {
  private service: string
  private operation: string
  private startTime: number
  private marks: Map<string, number> = new Map()
  private metadata: Record<string, any> = {}

  constructor(service: string, operation: string) {
    this.service = service
    this.operation = operation
    this.startTime = performance.now()
  }

  /**
   * Mark a specific point in the operation
   */
  mark(name: string) {
    this.marks.set(name, performance.now())
  }

  /**
   * Add metadata to the performance tracking
   */
  addMetadata(key: string, value: any) {
    this.metadata[key] = value
  }

  /**
   * Complete tracking and record metrics
   */
  async complete(success: boolean = true) {
    const endTime = performance.now()
    const duration = endTime - this.startTime

    // Calculate mark durations
    const markDurations: Record<string, number> = {}
    let lastTime = this.startTime
    
    for (const [markName, markTime] of this.marks) {
      markDurations[markName] = markTime - lastTime
      lastTime = markTime
    }

    // Record main metric
    await this.recordMetric('execution_time', duration, 'ms', {
      operation: this.operation,
      success,
      marks: markDurations,
      ...this.metadata
    })

    // Check performance thresholds
    const config = getServiceConfig(this.service)
    if (config?.performanceThresholds) {
      const threshold = config.performanceThresholds.find(
        t => t.metric === this.operation + '_time'
      )
      
      if (threshold && duration > threshold.p95) {
        checkThreshold(this.service, 'slow_operation', duration, {
          operation: this.operation,
          threshold: threshold.p95
        })
      }
    }

    return {
      duration,
      marks: markDurations,
      success
    }
  }

  /**
   * Record a performance metric
   */
  private async recordMetric(
    metric: string,
    value: number,
    unit: PerformanceMetric['unit'],
    metadata?: Record<string, any>
  ) {
    const supabase = createClient()

    try {
      await supabase.from('monitoring_metrics').insert({
        tool: this.service,
        metric,
        value,
        metadata: {
          unit,
          ...metadata
        }
      })

      // Track in analytics for real-time monitoring
      track('performance_metric', {
        service: this.service,
        metric,
        value,
        unit,
        ...metadata
      })

    } catch (error) {
      console.error('Failed to record performance metric:', error)
    }
  }
}

/**
 * Track Web Vitals metrics
 */
export async function trackWebVitals(metrics: {
  FCP?: number
  LCP?: number
  FID?: number
  CLS?: number
  TTFB?: number
  url: string
}) {
  const supabase = createClient()
  const { thresholds } = PERFORMANCE_CONFIG.webVitals

  for (const [metric, value] of Object.entries(metrics)) {
    if (metric === 'url' || value === undefined) continue

    // Ensure value is a number
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numericValue)) continue

    const threshold = thresholds[metric as keyof typeof thresholds]
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (threshold) {
      if (numericValue > threshold.poor) {
        rating = 'poor'
      } else if (numericValue > threshold.good) {
        rating = 'needs-improvement'
      }
    }

    try {
      await supabase.from('monitoring_metrics').insert({
        tool: 'web-vitals',
        metric: metric.toLowerCase(),
        value: numericValue,
        metadata: {
          url: metrics.url,
          rating,
          unit: metric === 'CLS' ? 'score' : 'ms'
        }
      })

      // Alert on poor performance
      if (rating === 'poor') {
        checkThreshold('web-vitals', metric.toLowerCase(), numericValue, {
          url: metrics.url,
          threshold: threshold?.poor
        })
      }

    } catch (error) {
      console.error(`Failed to track ${metric}:`, error)
    }
  }
}

/**
 * Monitor memory usage
 */
export async function monitorMemoryUsage(service: string) {
  if (typeof window === 'undefined') return

  // Use Performance API if available
  if ('memory' in performance) {
    const memory = (performance as any).memory
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
    const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)

    const supabase = createClient()
    
    try {
      await supabase.from('monitoring_metrics').insert({
        tool: service,
        metric: 'memory_usage',
        value: usedMB,
        metadata: {
          unit: 'MB',
          total: totalMB,
          limit: limitMB,
          percentage: (usedMB / limitMB) * 100
        }
      })

      // Check memory threshold
      const config = getServiceConfig(service)
      if (config?.memoryLimit && usedMB > config.memoryLimit) {
        checkThreshold(service, 'memory_usage', usedMB, {
          limit: config.memoryLimit,
          percentage: (usedMB / config.memoryLimit) * 100
        })
      }

    } catch (error) {
      console.error('Failed to monitor memory usage:', error)
    }
  }
}

/**
 * Track database query performance
 */
export async function trackDatabaseQuery(
  operation: string,
  duration: number,
  rowCount?: number,
  error?: string
) {
  const supabase = createClient()

  try {
    await supabase.from('monitoring_metrics').insert({
      tool: 'database',
      metric: 'query_time',
      value: duration,
      metadata: {
        unit: 'ms',
        operation,
        rowCount,
        error,
        success: !error
      }
    })

    // Alert on slow queries
    if (duration > 1000) {
      checkThreshold('database', 'query_time', duration, {
        operation,
        rowCount
      })
    }

  } catch (err) {
    console.error('Failed to track database query:', err)
  }
}

/**
 * Track API response times
 */
export async function trackAPIResponse(
  endpoint: string,
  method: string,
  statusCode: number,
  duration: number,
  error?: string
) {
  const supabase = createClient()

  try {
    await supabase.from('monitoring_metrics').insert({
      tool: 'api',
      metric: 'response_time',
      value: duration,
      metadata: {
        unit: 'ms',
        endpoint,
        method,
        statusCode,
        error,
        success: statusCode >= 200 && statusCode < 300
      }
    })

    // Track error rates
    if (statusCode >= 500) {
      checkThreshold('api', 'server_errors', 1, {
        endpoint,
        statusCode,
        error
      })
    }

  } catch (err) {
    console.error('Failed to track API response:', err)
  }
}

/**
 * Calculate performance percentiles for a metric
 */
async function calculatePercentiles(
  values: number[]
): Promise<{ p50: number; p95: number; p99: number }> {
  if (values.length === 0) {
    return { p50: 0, p95: 0, p99: 0 }
  }

  const sorted = values.sort((a, b) => a - b)
  const p50Index = Math.floor(sorted.length * 0.5)
  const p95Index = Math.floor(sorted.length * 0.95)
  const p99Index = Math.floor(sorted.length * 0.99)

  return {
    p50: sorted[p50Index] || 0,
    p95: sorted[p95Index] || sorted[sorted.length - 1],
    p99: sorted[p99Index] || sorted[sorted.length - 1]
  }
}

/**
 * Generate performance report for a service
 */
export async function generatePerformanceReport(
  service: string,
  hours: number = 24
): Promise<PerformanceReport> {
  const supabase = createClient()
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  try {
    const { data, error } = await supabase
      .from('monitoring_metrics')
      .select('metric, value, metadata')
      .eq('tool', service)
      .gte('created_at', since.toISOString())

    if (error || !data) {
      throw error || new Error('No data found')
    }

    // Group metrics by type
    const metricGroups: Record<string, number[]> = {}
    
    for (const record of data) {
      if (!metricGroups[record.metric]) {
        metricGroups[record.metric] = []
      }
      metricGroups[record.metric].push(record.value)
    }

    // Calculate statistics for each metric
    const metrics: PerformanceReport['metrics'] = {}
    const violations: PerformanceReport['violations'] = []

    for (const [metric, values] of Object.entries(metricGroups)) {
      const percentiles = await calculatePercentiles(values)
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      
      metrics[metric] = {
        ...percentiles,
        avg,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      }

      // Check for threshold violations
      const config = getServiceConfig(service)
      const threshold = config?.performanceThresholds?.find(t => t.metric === metric)
      
      if (threshold) {
        if (percentiles.p50 > threshold.p50) {
          violations.push({
            metric,
            threshold: threshold.p50,
            actual: percentiles.p50,
            percentile: 'p50'
          })
        }
        if (percentiles.p95 > threshold.p95) {
          violations.push({
            metric,
            threshold: threshold.p95,
            actual: percentiles.p95,
            percentile: 'p95'
          })
        }
        if (percentiles.p99 > threshold.p99) {
          violations.push({
            metric,
            threshold: threshold.p99,
            actual: percentiles.p99,
            percentile: 'p99'
          })
        }
      }
    }

    return {
      service,
      period: `${hours} hours`,
      metrics,
      violations
    }

  } catch (error) {
    console.error('Failed to generate performance report:', error)
    return {
      service,
      period: `${hours} hours`,
      metrics: {},
      violations: []
    }
  }
}

/**
 * Track converter performance
 */
export async function trackConverterPerformance(
  converter: string,
  metrics: {
    uploadTime?: number
    processingTime?: number
    downloadTime?: number
    totalTime: number
    fileSize?: number
    outputSize?: number
    success: boolean
    error?: string
  }
) {
  const tracker = new PerformanceTracker(`converter-${converter}`, 'conversion')
  
  if (metrics.uploadTime) {
    tracker.addMetadata('uploadTime', metrics.uploadTime)
  }
  if (metrics.processingTime) {
    tracker.addMetadata('processingTime', metrics.processingTime)
  }
  if (metrics.downloadTime) {
    tracker.addMetadata('downloadTime', metrics.downloadTime)
  }
  if (metrics.fileSize && metrics.outputSize) {
    tracker.addMetadata('compressionRatio', metrics.outputSize / metrics.fileSize)
  }
  
  tracker.addMetadata('error', metrics.error)
  
  await tracker.complete(metrics.success)
}

/**
 * Real User Monitoring (RUM) data collection
 */
export function initializeRUM() {
  if (typeof window === 'undefined') return

  // Track page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      trackWebVitals({
        FCP: navigation.responseEnd - navigation.fetchStart,
        TTFB: navigation.responseStart - navigation.fetchStart,
        url: window.location.pathname
      })
    }
  })

  // Track resource loading
  if (PERFORMANCE_CONFIG.resourceTiming.enabled && Math.random() < PERFORMANCE_CONFIG.resourceTiming.sampleRate) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming
          
          // Track slow resources
          if (resource.duration > 1000) {
            track('slow_resource', {
              name: resource.name,
              duration: resource.duration,
              type: resource.initiatorType,
              size: resource.transferSize
            })
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }

  // Monitor memory periodically
  setInterval(() => {
    monitorMemoryUsage('browser')
  }, 60000) // Every minute
}