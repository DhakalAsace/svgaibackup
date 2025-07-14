/**
 * Conversion Rate Tracking
 * Tracks user conversion events and funnel metrics
 */

import { track } from '@vercel/analytics'
import { getConverterBySlug } from '@/app/convert/converter-config'

export interface ConversionEvent {
  converter: string
  step: 'page_view' | 'file_selected' | 'conversion_started' | 'conversion_completed' | 'download_started' | 'download_completed'
  success: boolean
  metadata?: {
    fileSize?: number
    fileType?: string
    conversionTime?: number
    errorMessage?: string
    outputFormat?: string
    outputSize?: number
  }
}

/**
 * Track conversion funnel events
 */
export function trackConversionEvent(event: ConversionEvent) {
  const converter = getConverterBySlug(event.converter)
  if (!converter) return
  
  // Track with Vercel Analytics
  track(`converter_${event.step}`, {
    converter: event.converter,
    searchVolume: converter.searchVolume,
    priority: converter.priority,
    success: event.success,
    ...event.metadata,
  })
  
  // Track funnel progression
  if (event.step === 'conversion_completed' && event.success) {
    trackConversionSuccess(event.converter, event.metadata)
  }
}

/**
 * Track successful conversion with detailed metrics
 */
function trackConversionSuccess(converterSlug: string, metadata?: any) {
  const converter = getConverterBySlug(converterSlug)
  if (!converter) return
  
  // Calculate compression ratio if applicable
  const compressionRatio = metadata?.fileSize && metadata?.outputSize
    ? (metadata.outputSize / metadata.fileSize).toFixed(2)
    : undefined
  
  track('conversion_success', {
    converter: converterSlug,
    searchVolume: converter.searchVolume,
    fromFormat: converter.fromFormat,
    toFormat: converter.toFormat,
    conversionTime: metadata?.conversionTime || 0,
    inputSize: metadata?.fileSize || 0,
    outputSize: metadata?.outputSize || 0,
    compressionRatio: compressionRatio || '0',
  })
}

/**
 * Track conversion errors
 */
export function trackConversionError(
  converterSlug: string,
  error: string,
  metadata?: {
    fileSize?: number
    fileType?: string
    step?: string
  }
) {
  const converter = getConverterBySlug(converterSlug)
  if (!converter) return
  
  track('conversion_error', {
    converter: converterSlug,
    searchVolume: converter.searchVolume,
    error,
    ...metadata,
  })
}

/**
 * Get conversion funnel metrics for a converter
 */
export interface ConversionFunnelMetrics {
  pageViews: number
  fileSelections: number
  conversionsStarted: number
  conversionsCompleted: number
  downloads: number
  conversionRate: number
  dropoffRates: {
    viewToSelect: number
    selectToStart: number
    startToComplete: number
    completeToDownload: number
  }
}

/**
 * Calculate conversion rates from event counts
 */
export function calculateConversionRates(events: {
  pageViews: number
  fileSelections: number
  conversionsStarted: number
  conversionsCompleted: number
  downloads: number
}): ConversionFunnelMetrics {
  const metrics: ConversionFunnelMetrics = {
    ...events,
    conversionRate: events.pageViews > 0 
      ? (events.conversionsCompleted / events.pageViews) * 100 
      : 0,
    dropoffRates: {
      viewToSelect: events.pageViews > 0 
        ? ((events.pageViews - events.fileSelections) / events.pageViews) * 100 
        : 0,
      selectToStart: events.fileSelections > 0 
        ? ((events.fileSelections - events.conversionsStarted) / events.fileSelections) * 100 
        : 0,
      startToComplete: events.conversionsStarted > 0 
        ? ((events.conversionsStarted - events.conversionsCompleted) / events.conversionsStarted) * 100 
        : 0,
      completeToDownload: events.conversionsCompleted > 0 
        ? ((events.conversionsCompleted - events.downloads) / events.conversionsCompleted) * 100 
        : 0,
    }
  }
  
  return metrics
}

/**
 * Track user journey through converter
 */
export class ConversionTracker {
  private sessionId: string
  private converterSlug: string
  private startTime: number
  private events: ConversionEvent[] = []
  
  constructor(converterSlug: string) {
    this.converterSlug = converterSlug
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    
    // Track initial page view
    this.trackEvent('page_view', true)
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  trackEvent(step: ConversionEvent['step'], success: boolean, metadata?: any) {
    const event: ConversionEvent = {
      converter: this.converterSlug,
      step,
      success,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        sessionDuration: Date.now() - this.startTime,
      }
    }
    
    this.events.push(event)
    trackConversionEvent(event)
  }
  
  trackFileSelected(fileSize: number, fileType: string) {
    this.trackEvent('file_selected', true, { fileSize, fileType })
  }
  
  trackConversionStarted() {
    this.trackEvent('conversion_started', true)
  }
  
  trackConversionCompleted(success: boolean, metadata?: any) {
    this.trackEvent('conversion_completed', success, {
      ...metadata,
      conversionTime: Date.now() - this.startTime,
    })
  }
  
  trackDownload(success: boolean = true) {
    this.trackEvent('download_completed', success)
  }
  
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      converter: this.converterSlug,
      duration: Date.now() - this.startTime,
      events: this.events,
      funnel: {
        hasSelectedFile: this.events.some(e => e.step === 'file_selected'),
        hasStartedConversion: this.events.some(e => e.step === 'conversion_started'),
        hasCompletedConversion: this.events.some(e => e.step === 'conversion_completed' && e.success),
        hasDownloaded: this.events.some(e => e.step === 'download_completed'),
      }
    }
  }
}

/**
 * A/B testing support for converter variations
 */
export function trackABTestVariant(
  converterSlug: string,
  testName: string,
  variant: string,
  outcome: 'conversion' | 'bounce' | 'error'
) {
  track('ab_test_result', {
    converter: converterSlug,
    testName,
    variant,
    outcome,
  })
}

/**
 * Track converter performance metrics
 */
export function trackPerformanceMetric(
  converterSlug: string,
  metric: 'load_time' | 'conversion_time' | 'download_time',
  value: number
) {
  const converter = getConverterBySlug(converterSlug)
  if (!converter) return
  
  track('performance_metric', {
    converter: converterSlug,
    searchVolume: converter.searchVolume,
    metric,
    value,
    isHighTraffic: converter.searchVolume >= 10000,
  })
}

/**
 * Premium Tool CTA Tracking
 * Track conversion from free tools to premium tools
 */

export interface PremiumCTAEvent {
  converterType: string
  ctaPlacement: 'inline' | 'section' | 'sidebar' | 'final'
  ctaVariant: 'upgrade' | 'explore' | 'video-cta'
  targetTool: 'ai-generator' | 'icon-generator' | 'svg-to-video' | 'animation-tool'
  action: 'view' | 'click' | 'convert'
}

/**
 * Track premium CTA interactions
 */
export function trackPremiumCTA(event: PremiumCTAEvent) {
  const converter = getConverterBySlug(event.converterType)
  
  track('premium_cta_interaction', {
    converter: event.converterType,
    searchVolume: converter?.searchVolume || 0,
    priority: converter?.priority || 'unknown',
    ctaPlacement: event.ctaPlacement,
    ctaVariant: event.ctaVariant,
    targetTool: event.targetTool,
    action: event.action,
    isHighTraffic: (converter?.searchVolume || 0) >= 10000,
  })
}

/**
 * Track conversion funnel from free to premium tools
 */
export function trackPremiumConversionFunnel(
  stage: 'converter_used' | 'cta_viewed' | 'cta_clicked' | 'premium_page_viewed' | 'premium_tool_used',
  converterType: string,
  targetTool: PremiumCTAEvent['targetTool'],
  additionalData?: Record<string, any>
) {
  const converter = getConverterBySlug(converterType)
  
  track('premium_conversion_funnel', {
    stage,
    converter: converterType,
    searchVolume: converter?.searchVolume || 0,
    targetTool,
    priority: converter?.priority || 'unknown',
    isHighTraffic: (converter?.searchVolume || 0) >= 10000,
    ...additionalData
  })
}

/**
 * Calculate premium conversion rates
 */
export interface PremiumConversionMetrics {
  converterUsers: number
  ctaViews: number
  ctaClicks: number
  premiumPageViews: number
  premiumToolUsage: number
  conversionRates: {
    ctaViewRate: number      // CTA views / converter users
    ctaClickRate: number     // CTA clicks / CTA views
    pageConversionRate: number // Premium page views / CTA clicks
    toolConversionRate: number // Tool usage / Premium page views
    overallConversionRate: number // Tool usage / converter users
  }
}

/**
 * A/B test premium CTA variants
 */
export function trackPremiumCTAABTest(
  converterType: string,
  testName: string,
  variant: string,
  outcome: 'view' | 'click' | 'convert' | 'bounce'
) {
  const converter = getConverterBySlug(converterType)
  
  track('premium_cta_ab_test', {
    converter: converterType,
    searchVolume: converter?.searchVolume || 0,
    testName,
    variant,
    outcome,
    isHighTraffic: (converter?.searchVolume || 0) >= 10000,
  })
}