/**
 * Unified Analytics Hook
 * Uses Vercel Analytics for tracking
 */

import { useCallback, useMemo } from 'react'
import { track as vercelTrack } from '@vercel/analytics'
import { ConversionTracker } from '@/lib/conversion-tracking'

interface ToolAnalytics {
  // Core tracking methods
  trackEvent: (action: string, metadata?: Record<string, any>) => void
  trackError: (errorType: string, errorMessage: string, metadata?: Record<string, any>) => void
  trackPerformance: (metric: 'load_time' | 'processing_time' | 'export_time', value: number) => void
  trackFeature: (feature: string, metadata?: Record<string, any>) => void
  trackEngagement: (action: 'session_started' | 'session_ended' | 'cta_shown' | 'cta_clicked' | 'cta_dismissed', duration?: number) => void
  trackUpgrade: (toFeature: string, ctaLocation: string) => void
  
  // Session tracking
  startSession: () => void
  endSession: (duration: number) => void
  
  // Conversion tracking
  conversionTracker?: ConversionTracker
}

export function useAnalytics(
  tool: 'svg-editor' | 'svg-optimizer' | 'svg-to-video' | 'svg-animation'
): ToolAnalytics {
  // Track events with Vercel
  const trackEvent = useCallback((action: string, metadata?: Record<string, any>) => {
    // Vercel Analytics
    vercelTrack(`${tool}_${action}`, metadata)
  }, [tool])

  // Track errors
  const trackError = useCallback((
    errorType: string,
    errorMessage: string,
    metadata?: Record<string, any>
  ) => {
    vercelTrack(`${tool}_error`, {
      error_type: errorType,
      error_message: errorMessage,
      ...metadata,
    })
  }, [tool])

  // Track performance metrics
  const trackPerformance = useCallback((
    metric: 'load_time' | 'processing_time' | 'export_time',
    value: number
  ) => {
    vercelTrack(`${tool}_performance`, {
      metric,
      value: Math.round(value),
    })
  }, [tool])

  // Track feature usage
  const trackFeature = useCallback((feature: string, metadata?: Record<string, any>) => {
    vercelTrack(`${tool}_feature`, {
      feature,
      ...metadata,
    })
  }, [tool])

  // Track user engagement
  const trackEngagement = useCallback((
    action: 'session_started' | 'session_ended' | 'cta_shown' | 'cta_clicked' | 'cta_dismissed',
    duration?: number,
    metadata?: Record<string, any>
  ) => {
    vercelTrack(`${tool}_engagement`, {
      action,
      duration: duration || 0,
      ...metadata
    })
  }, [tool])

  // Track upgrade conversions
  const trackUpgrade = useCallback((toFeature: string, ctaLocation: string) => {
    vercelTrack('upgrade_conversion', {
      from_tool: tool,
      to_feature: toFeature,
      cta_location: ctaLocation,
    })
  }, [tool])

  // Session management
  const startSession = useCallback(() => {
    trackEngagement('session_started')
  }, [trackEngagement])

  const endSession = useCallback((duration: number) => {
    trackEngagement('session_ended', duration)
  }, [trackEngagement])

  return {
    trackEvent,
    trackError,
    trackPerformance,
    trackFeature,
    trackEngagement,
    trackUpgrade,
    startSession,
    endSession,
  }
}

// Hook for converter-specific analytics
export function useConverterAnalytics(converterSlug: string) {
  const conversionTracker = useMemo(() => new ConversionTracker(converterSlug), [converterSlug])
  
  const trackFileSelected = useCallback((fileSize: number, fileType: string) => {
    conversionTracker.trackFileSelected(fileSize, fileType)
    vercelTrack(`${converterSlug}_file_selected`, { fileSize, fileType })
  }, [converterSlug, conversionTracker])

  const trackConversionStarted = useCallback(() => {
    conversionTracker.trackConversionStarted()
    vercelTrack(`${converterSlug}_conversion_started`)
  }, [converterSlug, conversionTracker])

  const trackConversionCompleted = useCallback((
    success: boolean,
    metadata?: { conversionTime?: number; outputSize?: number }
  ) => {
    conversionTracker.trackConversionCompleted(success, metadata)
    vercelTrack(`${converterSlug}_conversion_completed`, { success, ...metadata })
  }, [converterSlug, conversionTracker])

  const trackDownload = useCallback((success: boolean = true) => {
    conversionTracker.trackDownload(success)
    vercelTrack(`${converterSlug}_download`, { success })
  }, [converterSlug, conversionTracker])

  return {
    conversionTracker,
    trackFileSelected,
    trackConversionStarted,
    trackConversionCompleted,
    trackDownload,
  }
}

// Hook for premium tool analytics
export function usePremiumToolAnalytics(
  tool: 'svg-to-video' | 'svg-to-gif'
) {
  const trackPremiumUsage = useCallback((
    credits: number,
    success: boolean,
    metadata?: Record<string, any>
  ) => {
    vercelTrack('premium_tool_usage', {
      tool,
      credits,
      success,
      ...metadata,
    })
  }, [tool])

  const trackCreditPurchase = useCallback((
    amount: number,
    packageName: string
  ) => {
    vercelTrack('credit_purchase', {
      amount,
      package: packageName,
      from_tool: tool,
    })
  }, [tool])

  return {
    trackPremiumUsage,
    trackCreditPurchase,
  }
}

// A/B testing analytics
export function useABTestAnalytics(testName: string, variant: string) {
  const trackTestEvent = useCallback((action: string, metadata?: Record<string, any>) => {
    vercelTrack('ab_test', {
      test_name: testName,
      variant,
      action,
      ...metadata,
    })
  }, [testName, variant])

  return { trackTestEvent }
}