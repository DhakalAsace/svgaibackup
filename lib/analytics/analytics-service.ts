/**
 * Unified Analytics Service
 * Uses Vercel Analytics for tracking
 */

import { track as vercelTrack } from '@vercel/analytics'
import {
  TRACKING_EVENTS,
  CUSTOM_DIMENSIONS,
  validateEventParameters,
  DEBUG_CONFIG,
  SERVER_TRACKING_CONFIG,
} from './tracking-config'
import { createLogger } from '@/lib/logger'

const logger = createLogger('analytics')

export interface AnalyticsUser {
  id?: string
  type: 'free' | 'paid' | 'trial'
  email?: string
  createdAt?: Date
  properties?: Record<string, any>
}

export interface AnalyticsContext {
  user?: AnalyticsUser
  session?: {
    id: string
    startTime: Date
    referrer?: string
    device?: string
    browser?: string
  }
  page?: {
    path: string
    title: string
    category: string
  }
}

class AnalyticsService {
  private context: AnalyticsContext = {}
  private eventQueue: Array<{ event: string; properties: any; timestamp: Date }> = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startFlushInterval()
  }

  // Initialize analytics with context
  initialize(context: Partial<AnalyticsContext>) {
    this.context = { ...this.context, ...context }
  }

  // Track event across all platforms
  track(eventName: string, properties?: Record<string, any>) {
    // Validate event
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.showEventValidation) {
      const validation = validateEventParameters(eventName, properties || {})
      if (!validation.valid) {
        logger.warn(`[Analytics] Invalid event parameters for ${eventName}:`, validation.errors)
      }
    }

    // Add to queue for batch processing
    this.eventQueue.push({
      event: eventName,
      properties: {
        ...properties,
        ...this.getDefaultProperties(),
      },
      timestamp: new Date(),
    })

    // Process immediately if critical event
    if (SERVER_TRACKING_CONFIG.criticalEvents.includes(eventName)) {
      this.flush()
    }

    // Debug logging
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.consoleOutput) {
      console.log('[Analytics] Event tracked:', eventName, properties)
    }
  }

  // Track page view
  trackPageView(path: string, properties?: Record<string, any>) {
    const pageProperties = {
      path,
      title: document.title,
      referrer: document.referrer,
      ...properties,
    }

    // Vercel Analytics
    vercelTrack('pageview', pageProperties)

    // Update context
    this.context.page = {
      path,
      title: document.title,
      category: this.getPageCategory(path),
    }
  }

  // Track converter events
  trackConverter(
    action: keyof typeof TRACKING_EVENTS.converter,
    converterType: string,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.converter[action]
    this.track(event.name, {
      converter_type: converterType,
      ...properties,
    })
  }

  // Track gallery events
  trackGallery(
    action: keyof typeof TRACKING_EVENTS.gallery,
    galleryTheme: string,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.gallery[action]
    this.track(event.name, {
      gallery_theme: galleryTheme,
      ...properties,
    })
  }

  // Track tool usage
  trackTool(
    action: keyof typeof TRACKING_EVENTS.tools,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.tools[action]
    this.track(event.name, properties)
  }

  // Track premium features
  trackPremium(
    action: keyof typeof TRACKING_EVENTS.premium,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.premium[action]
    this.track(event.name, properties)
    
    // Track revenue if applicable
    if (action === 'creditsPurchased' && properties?.price) {
      this.trackRevenue(properties.price, {
        product: 'credits',
        quantity: properties.credits,
      })
    }
  }

  // Track learn page engagement
  trackLearn(
    action: keyof typeof TRACKING_EVENTS.learn,
    topic: string,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.learn[action]
    this.track(event.name, {
      topic,
      ...properties,
    })
  }

  // Track user engagement
  trackEngagement(
    action: keyof typeof TRACKING_EVENTS.engagement,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.engagement[action]
    this.track(event.name, properties)
  }

  // Track conversion funnel
  trackFunnel(
    action: keyof typeof TRACKING_EVENTS.funnel,
    funnelName: string,
    properties?: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.funnel[action]
    this.track(event.name, {
      funnel_name: funnelName,
      ...properties,
    })
  }

  // Track performance metrics
  trackPerformance(
    metric: keyof typeof TRACKING_EVENTS.performance,
    properties: Record<string, any>
  ) {
    const event = TRACKING_EVENTS.performance[metric]
    this.track(event.name, properties)
  }

  // Track errors
  trackError(
    errorType: string,
    errorMessage: string,
    properties?: Record<string, any>
  ) {
    const errorProperties = {
      error_type: errorType,
      error_message: errorMessage,
      stack_trace: properties?.stack,
      ...properties,
    }

    vercelTrack('error', errorProperties)
  }

  // Track A/B test
  trackABTest(
    testName: string,
    variant: string,
    action: string,
    properties?: Record<string, any>
  ) {
    vercelTrack('ab_test', {
      test_name: testName,
      variant,
      action,
      ...properties,
    })
  }

  // Track revenue
  trackRevenue(amount: number, properties?: Record<string, any>) {
    // Track in Vercel
    vercelTrack('revenue', {
      amount,
      currency: 'USD',
      ...properties,
    })
  }


  // Get default properties for all events
  private getDefaultProperties(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      session_id: this.context.session?.id,
      user_id: this.context.user?.id,
      user_type: this.context.user?.type,
      page_path: this.context.page?.path,
      page_category: this.context.page?.category,
      referrer: this.context.session?.referrer,
      device: this.context.session?.device,
      browser: this.context.session?.browser,
    }
  }

  // Determine page category from path
  private getPageCategory(path: string): string {
    if (path.startsWith('/convert/')) return 'converter'
    if (path.startsWith('/gallery/')) return 'gallery'
    if (path.startsWith('/learn/')) return 'learn'
    if (path.startsWith('/tools/')) return 'tool'
    if (path === '/pricing') return 'pricing'
    if (path === '/') return 'home'
    return 'other'
  }

  // Flush event queue
  private flush() {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    // Process each event
    events.forEach(({ event, properties }) => {
      // Vercel Analytics
      vercelTrack(event, properties)
    })
  }

  // Get category for event name
  private getCategoryForEvent(eventName: string): string {
    for (const [category, events] of Object.entries(TRACKING_EVENTS)) {
      if (Object.values(events).some(e => e.name === eventName)) {
        return category
      }
    }
    return 'unknown'
  }

  // Start flush interval
  private startFlushInterval() {
    this.flushInterval = setInterval(() => {
      this.flush()
    }, 5000) // Flush every 5 seconds
  }

  // Clean up
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

// Export singleton instance
export const analytics = new AnalyticsService()

// Export convenience functions
export const {
  initialize,
  track,
  trackPageView,
  trackConverter,
  trackGallery,
  trackTool,
  trackPremium,
  trackLearn,
  trackEngagement,
  trackFunnel,
  trackPerformance,
  trackError,
  trackABTest,
  trackRevenue,
} = analytics