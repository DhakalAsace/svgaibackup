'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { ConversionTracker, trackConversionError, trackPerformanceMetric } from '@/lib/conversion-tracking'

export function useConversionTracking() {
  const pathname = usePathname()
  const trackerRef = useRef<ConversionTracker | null>(null)
  
  // Extract converter slug from pathname
  const converterSlug = pathname.match(/\/convert\/([^\/]+)/)?.[1]
  
  useEffect(() => {
    if (converterSlug) {
      // Create new tracker for this converter
      trackerRef.current = new ConversionTracker(converterSlug)
      
      // Track page load time
      if (typeof window !== 'undefined' && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        if (loadTime > 0) {
          trackPerformanceMetric(converterSlug, 'load_time', loadTime)
        }
      }
    }
    
    return () => {
      // Clean up tracker on unmount
      trackerRef.current = null
    }
  }, [converterSlug])
  
  const trackFileSelected = useCallback((file: File) => {
    if (!trackerRef.current) return
    
    trackerRef.current.trackFileSelected(file.size, file.type)
  }, [])
  
  const trackConversionStarted = useCallback(() => {
    if (!trackerRef.current) return
    
    trackerRef.current.trackConversionStarted()
  }, [])
  
  const trackConversionCompleted = useCallback((
    success: boolean,
    outputSize?: number,
    conversionTime?: number
  ) => {
    if (!trackerRef.current || !converterSlug) return
    
    trackerRef.current.trackConversionCompleted(success, {
      outputSize,
      conversionTime,
    })
    
    // Track conversion time as performance metric
    if (success && conversionTime) {
      trackPerformanceMetric(converterSlug, 'conversion_time', conversionTime)
    }
  }, [converterSlug])
  
  const trackDownload = useCallback(() => {
    if (!trackerRef.current) return
    
    trackerRef.current.trackDownload()
  }, [])
  
  const trackError = useCallback((error: string, metadata?: any) => {
    if (!converterSlug) return
    
    trackConversionError(converterSlug, error, metadata)
  }, [converterSlug])
  
  const getSessionSummary = useCallback(() => {
    return trackerRef.current?.getSessionSummary()
  }, [])
  
  return {
    trackFileSelected,
    trackConversionStarted,
    trackConversionCompleted,
    trackDownload,
    trackError,
    getSessionSummary,
    isTracking: !!trackerRef.current,
  }
}

/**
 * Hook for tracking download performance
 */
export function useDownloadTracking(converterSlug?: string) {
  const startTimeRef = useRef<number>(0)
  
  const startDownload = useCallback(() => {
    startTimeRef.current = Date.now()
  }, [])
  
  const completeDownload = useCallback((success: boolean = true) => {
    if (!converterSlug || !startTimeRef.current) return
    
    const downloadTime = Date.now() - startTimeRef.current
    trackPerformanceMetric(converterSlug, 'download_time', downloadTime)
    startTimeRef.current = 0
  }, [converterSlug])
  
  return {
    startDownload,
    completeDownload,
  }
}