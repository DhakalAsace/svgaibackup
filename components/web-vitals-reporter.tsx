'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { reportWebVitals, trackConverterPageView } from '@/lib/performance-monitoring'
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
import { createLogger } from '@/lib/logger'

const logger = createLogger('web-vitals')

export function WebVitalsReporter() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Track page view for converter pages
    const converterMatch = pathname.match(/\/convert\/([^\/]+)/)
    if (converterMatch) {
      const converterSlug = converterMatch[1]
      
      // Try to get converter config if available
      try {
        // Dynamic import to avoid build errors if converter config doesn't exist
        import('@/app/convert/converter-config').then(({ getConverterBySlug }) => {
          const converter = getConverterBySlug(converterSlug)
          if (converter) {
            trackConverterPageView(converterSlug, converter.searchVolume)
          }
        }).catch(() => {
          // Converter config not available, track with default search volume
          trackConverterPageView(converterSlug, 1000)
        })
      } catch {
        // Fallback tracking
        trackConverterPageView(converterSlug, 1000)
      }
    }
  }, [pathname])
  
  useEffect(() => {
    // Report Web Vitals using the web-vitals library
    const sendToAnalytics = (metric: any) => {
      // Convert to our expected format
      const webVitalMetric = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      }
      
      // Send to our performance monitoring
      reportWebVitals(webVitalMetric)
      
      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development') {
        const thresholds = {
          LCP: 2500,
          INP: 200,
          CLS: 0.1,
          FCP: 1800,
          TTFB: 800,
        }
        
        const threshold = thresholds[metric.name as keyof typeof thresholds]
        if (threshold && metric.value > threshold) {
          logger.warn(`⚠️ ${metric.name} exceeded threshold: ${metric.value}ms > ${threshold}ms`)
        }
      }
    }
    
    // Measure all Core Web Vitals
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }, [])
  
  return null
}