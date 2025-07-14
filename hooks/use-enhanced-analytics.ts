/**
 * Enhanced Analytics Hook
 * Unified tracking with Vercel Analytics
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics/analytics-service'
import { getJourneyTracker, CTATracker } from '@/lib/funnel-tracking'
import { ConversionTracker } from '@/lib/conversion-tracking'
import { DEBUG_CONFIG } from '@/lib/analytics/tracking-config'

interface UseEnhancedAnalyticsOptions {
  tool?: string
  category?: string
  userId?: string
  userType?: 'free' | 'paid' | 'trial'
  debug?: boolean
}

export function useEnhancedAnalytics(options: UseEnhancedAnalyticsOptions = {}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)
  const sessionStartTime = useRef<number>(Date.now())
  const pageViewTime = useRef<number>(Date.now())
  
  // Initialize analytics on mount
  useEffect(() => {
    const sessionStart = sessionStartTime.current
    
    if (!isInitialized) {
      analytics.initialize({
        user: options.userId ? {
          id: options.userId,
          type: options.userType || 'free',
        } : undefined,
        page: {
          path: pathname,
          title: document.title,
          category: options.category || getPageCategory(pathname),
        },
      })
      
      setIsInitialized(true)
      
      // Track session start
      analytics.trackEngagement('sessionStarted', {
        entry_page: pathname,
        referrer: document.referrer,
        device_type: getDeviceType(),
        browser: getBrowserInfo(),
      })
    }
    
    return () => {
      // Track session end on unmount
      const sessionDuration = Date.now() - sessionStart
      analytics.trackEngagement('sessionEnded', {
        duration: sessionDuration,
        exit_page: pathname,
      })
    }
  }, [isInitialized, pathname, options.userId, options.userType, options.category])
  
  // Track page views
  useEffect(() => {
    pageViewTime.current = Date.now()
    analytics.trackPageView(pathname, {
      search_params: Object.fromEntries(searchParams?.entries() || []),
      category: options.category || getPageCategory(pathname),
    })
    
    // Track page exit time
    return () => {
      const timeOnPage = Date.now() - pageViewTime.current
      analytics.track('page_exit', {
        path: pathname,
        time_on_page: timeOnPage,
      })
    }
  }, [pathname, searchParams, options.category])
  
  // Track click events
  const trackClick = useCallback((
    elementId: string,
    elementType: string,
    metadata?: Record<string, any>
  ) => {
    analytics.track('element_click', {
      element_id: elementId,
      element_type: elementType,
      page_path: pathname,
      ...metadata,
    })
  }, [pathname])
  
  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage
        
        // Track milestones
        if ([25, 50, 75, 90, 100].includes(scrollPercentage)) {
          analytics.track('scroll_depth', {
            depth: scrollPercentage,
            page_path: pathname,
            time_to_scroll: Date.now() - pageViewTime.current,
          })
        }
      }
    }
    
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    return () => window.removeEventListener('scroll', trackScrollDepth)
  }, [pathname])
  
  // Track form interactions
  const trackFormInteraction = useCallback((
    formId: string,
    action: 'start' | 'field_focus' | 'field_blur' | 'submit' | 'error',
    fieldName?: string,
    metadata?: Record<string, any>
  ) => {
    analytics.track('form_interaction', {
      form_id: formId,
      action,
      field_name: fieldName,
      page_path: pathname,
      ...metadata,
    })
  }, [pathname])
  
  // Track media interactions
  const trackMediaInteraction = useCallback((
    mediaId: string,
    mediaType: 'image' | 'video' | 'audio',
    action: 'play' | 'pause' | 'complete' | 'error',
    metadata?: Record<string, any>
  ) => {
    analytics.track('media_interaction', {
      media_id: mediaId,
      media_type: mediaType,
      action,
      page_path: pathname,
      ...metadata,
    })
  }, [pathname])
  
  // Track search
  const trackSearch = useCallback((
    searchQuery: string,
    searchScope: string,
    resultsCount: number,
    metadata?: Record<string, any>
  ) => {
    analytics.track('search_performed', {
      search_query: searchQuery,
      search_scope: searchScope,
      results_count: resultsCount,
      page_path: pathname,
      ...metadata,
    })
  }, [pathname])
  
  // Track CTA performance
  const createCTATracker = useCallback((
    testName: string,
    variants: Array<{
      id: string
      text: string
      style: 'primary' | 'secondary' | 'ghost' | 'link'
      size: 'sm' | 'md' | 'lg'
    }>
  ) => {
    return new CTATracker(testName, variants)
  }, [])
  
  // Track conversion events
  const createConversionTracker = useCallback((converterSlug: string) => {
    return new ConversionTracker(converterSlug)
  }, [])
  
  // Track journey milestones
  const trackJourneyMilestone = useCallback((
    milestone: string,
    metadata?: Record<string, any>
  ) => {
    const tracker = getJourneyTracker(options.userId)
    tracker.trackStep(milestone, metadata)
  }, [options.userId])
  
  // Track feature discovery
  const trackFeatureDiscovery = useCallback((
    feature: string,
    metadata?: Record<string, any>
  ) => {
    analytics.track('feature_discovered', {
      feature,
      page_path: pathname,
      user_journey_stage: getUserJourneyStage(),
      ...metadata,
    })
    
    // Track feature discovery
    if (options.userId) {
      analytics.track('feature_discovered', {
        feature,
        user_id: options.userId
      })
    }
  }, [pathname, options.userId])
  
  // Track errors with context
  const trackError = useCallback((
    error: Error | string,
    errorContext?: Record<string, any>
  ) => {
    const errorMessage = error instanceof Error ? error.message : error
    const stackTrace = error instanceof Error ? error.stack : undefined
    
    analytics.trackError(
      errorContext?.type || 'javascript_error',
      errorMessage,
      {
        stack_trace: stackTrace,
        page_path: pathname,
        user_agent: navigator.userAgent,
        ...errorContext,
      }
    )
  }, [pathname])
  
  // Track performance metrics
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Track Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          analytics.trackPerformance('webVitals', {
            metric_name: 'LCP',
            value: entry.startTime,
            rating: getLCPRating(entry.startTime),
            page_type: options.category || getPageCategory(pathname),
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    
    return () => observer.disconnect()
  }, [pathname, options.category])
  
  // Debug mode
  useEffect(() => {
    if (options.debug || DEBUG_CONFIG.enabled) {
      (window as any).__analytics = {
        analytics,
        trackEvent: (name: string, props?: any) => analytics.track(name, props),
      }
      
      console.log('[Analytics] Debug mode enabled. Access via window.__analytics')
    }
  }, [options.debug])
  
  return {
    // Core tracking
    track: analytics.track,
    trackPageView: analytics.trackPageView,
    trackError,
    
    // Specific tracking methods
    trackClick,
    trackFormInteraction,
    trackMediaInteraction,
    trackSearch,
    trackFeatureDiscovery,
    trackJourneyMilestone,
    
    // Converter tracking
    trackConverter: analytics.trackConverter,
    createConversionTracker,
    
    // Tool tracking
    trackTool: analytics.trackTool,
    
    // Premium tracking
    trackPremium: analytics.trackPremium,
    
    // Learn page tracking
    trackLearn: analytics.trackLearn,
    
    // Engagement tracking
    trackEngagement: analytics.trackEngagement,
    
    // Funnel tracking
    trackFunnel: analytics.trackFunnel,
    
    // A/B testing
    trackABTest: analytics.trackABTest,
    createCTATracker,
    
    // Revenue tracking
    trackRevenue: analytics.trackRevenue,
  }
}

// Helper functions
function getPageCategory(path: string): string {
  if (path.startsWith('/convert/')) return 'converter'
  if (path.startsWith('/gallery/')) return 'gallery'
  if (path.startsWith('/learn/')) return 'learn'
  if (path.startsWith('/tools/')) return 'tool'
  if (path === '/pricing') return 'pricing'
  if (path === '/') return 'home'
  return 'other'
}

function getDeviceType(): string {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function getBrowserInfo(): string {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) return 'chrome'
  if (userAgent.includes('Safari')) return 'safari'
  if (userAgent.includes('Firefox')) return 'firefox'
  if (userAgent.includes('Edge')) return 'edge'
  return 'other'
}

function getUserJourneyStage(): string {
  // Simple heuristic based on user behavior
  const hasUsedConverter = localStorage.getItem('has_used_converter')
  const hasCreatedAccount = localStorage.getItem('user_id')
  const hasPurchased = localStorage.getItem('has_purchased')
  
  if (hasPurchased) return 'retention'
  if (hasCreatedAccount) return 'decision'
  if (hasUsedConverter) return 'consideration'
  return 'awareness'
}

function getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 2500) return 'good'
  if (value <= 4000) return 'needs-improvement'
  return 'poor'
}