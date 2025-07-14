/**
 * Error Tracking System
 * Captures, groups, and analyzes application errors
 */

import { createClient } from '@/lib/supabase'
import { ERROR_TRACKING } from './config'
import { sendAlert } from './alerts'
import { AlertData } from '@/lib/analytics-alerts'

export interface ErrorEvent {
  id: string
  service: string
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  fingerprint: string
  context: {
    url?: string
    userId?: string
    sessionId?: string
    browser?: string
    os?: string
    timestamp: string
  }
  metadata?: Record<string, any>
  count: number
  firstSeen: string
  lastSeen: string
}

export interface ErrorGroup {
  fingerprint: string
  service: string
  message: string
  level: 'error' | 'warning' | 'info'
  count: number
  userCount: number
  firstSeen: string
  lastSeen: string
  status: 'new' | 'resolved' | 'ignored'
  events: ErrorEvent[]
}

/**
 * Initialize Sentry error tracking
 */
export function initializeSentry() {
  if (!ERROR_TRACKING.sentry.enabled || typeof window === 'undefined') return

  // Dynamic import to avoid SSR issues
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: ERROR_TRACKING.sentry.dsn || '',
      environment: ERROR_TRACKING.sentry.environment,
      tracesSampleRate: ERROR_TRACKING.sentry.tracesSampleRate,
      beforeSend: ERROR_TRACKING.sentry.beforeSend
    })

    // Set initial user context
    Sentry.withScope((scope: any) => {
      scope.setTag('service', 'svg-ai')
      
      // Add user context if available
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId')
        if (userId) {
          scope.setUser({ id: userId })
        }
      }
    })
  }).catch(err => {
    console.error('Failed to initialize Sentry:', err)
  })
}

/**
 * Capture and track an error
 */
export async function captureError(
  error: Error | string,
  service: string,
  context?: Partial<ErrorEvent['context']>,
  metadata?: Record<string, any>
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack : undefined
  const fingerprint = generateFingerprint(errorMessage, errorStack)

  const errorEvent: Omit<ErrorEvent, 'id' | 'count' | 'firstSeen' | 'lastSeen'> = {
    service,
    level: 'error',
    message: errorMessage,
    stack: errorStack,
    fingerprint,
    context: {
      timestamp: new Date().toISOString(),
      ...context,
      // Add browser info if in browser
      ...(typeof window !== 'undefined' ? {
        url: window.location.href,
        browser: navigator.userAgent,
        sessionId: getSessionId()
      } : {})
    },
    metadata
  }

  // Send to Sentry if enabled
  if (ERROR_TRACKING.sentry.enabled && typeof window !== 'undefined') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.withScope((scope: any) => {
        scope.setTag('service', service)
        scope.setContext('metadata', metadata || {})
        Sentry.captureException(error)
      })
    }).catch(err => {
      console.error('Failed to send to Sentry:', err)
    })
  }

  // Store in our database
  await storeError(errorEvent)

  // Check if this error group needs alerting
  await checkErrorThresholds(service, fingerprint)
}

/**
 * Store error in database
 */
async function storeError(errorEvent: Omit<ErrorEvent, 'id' | 'count' | 'firstSeen' | 'lastSeen'>) {
  const supabase = createClient()

  try {
    // Check if error group exists
    const { data: existingGroup } = await supabase
      .from('error_groups')
      .select('id, count')
      .eq('fingerprint', errorEvent.fingerprint)
      .single()

    if (existingGroup) {
      // Update existing group
      await supabase
        .from('error_groups')
        .update({
          count: existingGroup.count + 1,
          last_seen: new Date().toISOString(),
          last_message: errorEvent.message
        })
        .eq('id', existingGroup.id)
    } else {
      // Create new error group
      await supabase
        .from('error_groups')
        .insert({
          fingerprint: errorEvent.fingerprint,
          service: errorEvent.service,
          level: errorEvent.level,
          message: errorEvent.message,
          count: 1,
          status: 'new',
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString()
        })
    }

    // Store individual error event
    await supabase
      .from('error_events')
      .insert({
        fingerprint: errorEvent.fingerprint,
        service: errorEvent.service,
        level: errorEvent.level,
        message: errorEvent.message,
        stack: errorEvent.stack,
        context: errorEvent.context,
        metadata: errorEvent.metadata
      })

  } catch (err) {
    console.error('Failed to store error:', err)
  }
}

/**
 * Generate fingerprint for error grouping
 */
function generateFingerprint(message: string, stack?: string): string {
  // Remove dynamic parts from error message
  let normalized = message
    .replace(/[0-9]+/g, 'N') // Replace numbers
    .replace(/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi, 'UUID') // Replace UUIDs
    .replace(/https?:\/\/[^\s]+/g, 'URL') // Replace URLs

  // If we have a stack, use the first meaningful line
  if (stack) {
    const lines = stack.split('\n')
    const meaningfulLine = lines.find(line => 
      line.includes('at ') && 
      !line.includes('node_modules') &&
      !line.includes('webpack')
    )
    
    if (meaningfulLine) {
      normalized += '|' + meaningfulLine.trim()
    }
  }

  // Create a simple hash
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

/**
 * Check if error rate exceeds thresholds
 */
async function checkErrorThresholds(service: string, fingerprint: string) {
  const supabase = createClient()
  
  try {
    // Get error counts for the last hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    
    const { data: recentErrors, error } = await supabase
      .from('error_events')
      .select('id')
      .eq('service', service)
      .eq('fingerprint', fingerprint)
      .gte('created_at', oneHourAgo)

    if (error || !recentErrors) return

    const errorCount = recentErrors.length

    // Alert if error spike detected
    if (errorCount > 10) {
      const alert: AlertData = {
        tool: service,
        metric: 'error_spike',
        value: errorCount,
        threshold: 10,
        severity: errorCount > 50 ? 'critical' : errorCount > 25 ? 'error' : 'warning',
        message: `Error spike detected: ${errorCount} occurrences in the last hour`,
        timestamp: new Date().toISOString(),
        metadata: {
          fingerprint,
          errorType: 'recurring_error'
        }
      }

      await sendAlert(alert)
    }

  } catch (err) {
    console.error('Failed to check error thresholds:', err)
  }
}

/**
 * Get session ID for error context
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  
  let sessionId = sessionStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('sessionId', sessionId)
  }
  
  return sessionId
}

/**
 * Create error boundary configuration
 * Note: The actual React component should be created in a .tsx file
 */
export function createErrorBoundaryConfig(service: string) {
  return {
    service,
    onError: (error: Error, errorInfo: any) => {
      captureError(error, service, {
        url: window?.location?.href
      }, {
        componentStack: errorInfo?.componentStack
      })
    }
  }
}

/**
 * Get error statistics for a service
 */
export async function getErrorStats(
  service: string,
  hours: number = 24
): Promise<{
  totalErrors: number
  uniqueErrors: number
  affectedUsers: number
  errorRate: number
  topErrors: Array<{
    message: string
    count: number
    lastSeen: Date
  }>
}> {
  const supabase = createClient()
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  try {
    // Get error groups
    const { data: errorGroups, error } = await supabase
      .from('error_groups')
      .select('*')
      .eq('service', service)
      .gte('last_seen', since.toISOString())
      .order('count', { ascending: false })
      .limit(10)

    if (error || !errorGroups) {
      throw error || new Error('No error data found')
    }

    // Get total error count
    const totalErrors = errorGroups.reduce((sum, group) => sum + group.count, 0)
    
    // Get unique user count (simplified - in production, track properly)
    const affectedUsers = Math.floor(totalErrors * 0.3) // Estimate 30% unique users

    return {
      totalErrors,
      uniqueErrors: errorGroups.length,
      affectedUsers,
      errorRate: totalErrors / hours,
      topErrors: errorGroups.map(group => ({
        message: group.message,
        count: group.count,
        lastSeen: new Date(group.last_seen)
      }))
    }

  } catch (error) {
    console.error('Failed to get error stats:', error)
    return {
      totalErrors: 0,
      uniqueErrors: 0,
      affectedUsers: 0,
      errorRate: 0,
      topErrors: []
    }
  }
}

/**
 * Mark error group as resolved
 */
export async function resolveErrorGroup(fingerprint: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('error_groups')
      .update({ status: 'resolved' })
      .eq('fingerprint', fingerprint)

    return !error

  } catch (error) {
    console.error('Failed to resolve error group:', error)
    return false
  }
}

/**
 * Ignore error group
 */
export async function ignoreErrorGroup(fingerprint: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('error_groups')
      .update({ status: 'ignored' })
      .eq('fingerprint', fingerprint)

    return !error

  } catch (error) {
    console.error('Failed to ignore error group:', error)
    return false
  }
}