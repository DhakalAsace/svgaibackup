/**
 * Server-side Analytics Tracking
 * For critical events and API endpoint tracking
 */

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase'
import { TRACKING_EVENTS, SERVER_TRACKING_CONFIG } from './tracking-config'

export interface ServerEventContext {
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  referer?: string
  endpoint?: string
  method?: string
}

// Get context from request headers
export async function getServerContext(request?: Request): Promise<ServerEventContext> {
  const headersList = await headers()
  
  return {
    ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
    userAgent: headersList.get('user-agent') || undefined,
    referer: headersList.get('referer') || undefined,
    endpoint: request?.url ? new URL(request.url).pathname : undefined,
    method: request?.method,
  }
}

// Track server-side event
export async function trackServerEvent(
  eventName: string,
  properties: Record<string, any>,
  context: ServerEventContext
) {
  if (!SERVER_TRACKING_CONFIG.enabled) return

  const timestamp = new Date()
  const enrichedProperties = {
    ...properties,
    ...context,
    timestamp: timestamp.toISOString(),
    environment: process.env.NODE_ENV,
  }

  // Store in database for analytics
  const supabase = createClient()
  await supabase.from('analytics_events').insert({
    event_name: eventName,
    user_id: context.userId,
    session_id: context.sessionId,
    properties: enrichedProperties,
    created_at: timestamp.toISOString(),
  })

  // Log critical events
  if (SERVER_TRACKING_CONFIG.criticalEvents.includes(eventName)) {
    console.log(`[Critical Event] ${eventName}:`, enrichedProperties)
  }
}

// Track API endpoint usage
export async function trackAPIUsage(
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  context: ServerEventContext,
  metadata?: Record<string, any>
) {
  await trackServerEvent('api_request', {
    endpoint,
    method,
    status_code: statusCode,
    response_time: responseTime,
    success: statusCode >= 200 && statusCode < 300,
    ...metadata,
  }, context)
}

// Track conversion completion server-side
export async function trackServerConversion(
  userId: string,
  conversionType: string,
  value: number,
  metadata?: Record<string, any>
) {
  const context: ServerEventContext = { userId }
  
  await trackServerEvent('conversion_completed', {
    conversion_type: conversionType,
    value,
    ...metadata,
  }, context)

  // Also track revenue if applicable
  if (value > 0) {
    await trackServerEvent('revenue', {
      amount: value,
      source: conversionType,
      ...metadata,
    }, context)
  }
}

// Track user signup server-side
export async function trackServerSignup(
  userId: string,
  method: string,
  metadata?: Record<string, any>
) {
  const context: ServerEventContext = { userId }
  
  await trackServerEvent('user_signup', {
    signup_method: method,
    ...metadata,
  }, context)
}

// Track subscription changes
export async function trackSubscriptionChange(
  userId: string,
  action: 'created' | 'updated' | 'cancelled',
  plan: string,
  value?: number,
  metadata?: Record<string, any>
) {
  const context: ServerEventContext = { userId }
  
  await trackServerEvent(`subscription_${action}`, {
    plan,
    value,
    ...metadata,
  }, context)
}

// Track credit usage
export async function trackCreditUsage(
  userId: string,
  feature: string,
  creditsUsed: number,
  creditsRemaining: number,
  metadata?: Record<string, any>
) {
  const context: ServerEventContext = { userId }
  
  await trackServerEvent('credits_used', {
    feature,
    credits_used: creditsUsed,
    credits_remaining: creditsRemaining,
    ...metadata,
  }, context)
}

// Batch process analytics events
export async function processAnalyticsBatch() {
  const supabase = createClient()
  
  // Get unprocessed events
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(100)
  
  if (error || !events) return
  
  // Process events in batches
  for (const event of events) {
    try {
      // Mark as processed
      await supabase
        .from('analytics_events')
        .update({ processed: true })
        .eq('id', event.id)
    } catch (error) {
      console.error('Failed to process analytics event:', error)
    }
  }
}

// Middleware for tracking API routes
export function createAnalyticsMiddleware() {
  return async function analyticsMiddleware(
    request: Request,
    context: ServerEventContext,
    next: () => Promise<Response>
  ): Promise<Response> {
    const startTime = Date.now()
    
    try {
      const response = await next()
      const responseTime = Date.now() - startTime
      
      // Track API usage
      await trackAPIUsage(
        context.endpoint || 'unknown',
        context.method || 'GET',
        response.status,
        responseTime,
        context
      )
      
      return response
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      // Track error
      await trackAPIUsage(
        context.endpoint || 'unknown',
        context.method || 'GET',
        500,
        responseTime,
        context,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      )
      
      throw error
    }
  }
}

// Clean up on shutdown
export function shutdownServerAnalytics() {
  // Cleanup logic removed - no external services to shut down
}