/**
 * Analytics module for tracking converter usage and performance
 * All client-side analytics for privacy
 */

import type { ConversionOptions, ConversionResult, ImageFormat } from './types'

interface ConversionEvent {
  converter: string
  from: ImageFormat
  to: ImageFormat
  timestamp: number
  sessionId: string
}

interface ConversionStartEvent extends ConversionEvent {
  fileSize: number
  options?: ConversionOptions
}

interface ConversionProgressEvent extends ConversionEvent {
  progress: number
}

interface ConversionCompleteEvent extends ConversionEvent {
  success: boolean
  duration: number
  inputSize?: number
  outputSize?: number
  error?: string
}

interface LibraryLoadEvent {
  converter: string
  library: string
  loadTime: number
  success: boolean
  error?: string
  timestamp: number
}

// Generate a session ID for tracking conversion flows
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server'
  
  const sessionKey = 'converter-session-id'
  let sessionId = sessionStorage.getItem(sessionKey)
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem(sessionKey, sessionId)
  }
  
  return sessionId
}

// Track conversion start
export function trackConversionStart(
  converter: string,
  from: ImageFormat,
  to: ImageFormat,
  fileSize: number,
  options?: ConversionOptions
): void {
  try {
    if (typeof window === 'undefined') return
    
    const event: ConversionStartEvent = {
      converter,
      from,
      to,
      fileSize,
      options,
      timestamp: Date.now(),
      sessionId: getSessionId()
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Conversion started:', event)
    }
    
    // Store in session storage for tracking
    const key = `conversion-${event.sessionId}-${event.timestamp}`
    sessionStorage.setItem(key, JSON.stringify(event))
    
  } catch (error) {
    // Never throw from analytics
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Error tracking conversion start:', error)
    }
  }
}

// Track conversion progress
export function trackConversionProgress(
  converter: string,
  from: ImageFormat,
  to: ImageFormat,
  progress: number
): void {
  try {
    if (typeof window === 'undefined') return
    
    const event: ConversionProgressEvent = {
      converter,
      from,
      to,
      progress,
      timestamp: Date.now(),
      sessionId: getSessionId()
    }
    
    // Only log significant progress in development
    if (process.env.NODE_ENV === 'development' && (progress === 0.5 || progress === 1)) {
      console.log('[Analytics] Conversion progress:', event)
    }
    
  } catch (error) {
    // Never throw from analytics
  }
}

// Track conversion completion
export function trackConversionComplete(
  converter: string,
  from: ImageFormat,
  to: ImageFormat,
  success: boolean,
  result: ConversionResult | null,
  error?: unknown
): void {
  try {
    if (typeof window === 'undefined') return
    
    const sessionId = getSessionId()
    const now = Date.now()
    
    // Find the start event
    let startTime = now
    let inputSize: number | undefined
    
    // Search for start event in session storage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key?.startsWith(`conversion-${sessionId}-`)) {
        try {
          const event = JSON.parse(sessionStorage.getItem(key) || '{}') as ConversionStartEvent
          if (event.converter === converter && event.from === from && event.to === to) {
            startTime = event.timestamp
            inputSize = event.fileSize
            // Clean up the start event
            sessionStorage.removeItem(key)
            break
          }
        } catch {
          // Invalid event, ignore
        }
      }
    }
    
    const event: ConversionCompleteEvent = {
      converter,
      from,
      to,
      success,
      duration: now - startTime,
      inputSize,
      outputSize: result?.metadata?.size,
      error: error ? String(error) : undefined,
      timestamp: now,
      sessionId
    }
    
    // Log completion in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Conversion complete:', event)
    }
    
    // Store summary in local storage for statistics
    try {
      const statsKey = 'converter-stats'
      const stats = JSON.parse(localStorage.getItem(statsKey) || '{}')
      
      const converterKey = `${from}-to-${to}`
      if (!stats[converterKey]) {
        stats[converterKey] = {
          total: 0,
          successful: 0,
          failed: 0,
          totalDuration: 0,
          totalInputSize: 0,
          totalOutputSize: 0
        }
      }
      
      stats[converterKey].total++
      if (success) {
        stats[converterKey].successful++
      } else {
        stats[converterKey].failed++
      }
      stats[converterKey].totalDuration += event.duration
      if (inputSize) stats[converterKey].totalInputSize += inputSize
      if (event.outputSize) stats[converterKey].totalOutputSize += event.outputSize
      
      localStorage.setItem(statsKey, JSON.stringify(stats))
    } catch {
      // Ignore stats errors
    }
    
  } catch (error) {
    // Never throw from analytics
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Error tracking conversion complete:', error)
    }
  }
}

// Track library loading
export function trackLibraryLoad(
  converter: string,
  library: string,
  loadTime: number,
  success: boolean,
  error?: string
): void {
  try {
    if (typeof window === 'undefined') return
    
    const event: LibraryLoadEvent = {
      converter,
      library,
      loadTime,
      success,
      error,
      timestamp: Date.now()
    }
    
    // Log library loads in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Library load:', event)
    }
    
    // Store library load stats
    try {
      const statsKey = 'library-load-stats'
      const stats = JSON.parse(localStorage.getItem(statsKey) || '{}')
      
      const libKey = `${converter}-${library}`
      if (!stats[libKey]) {
        stats[libKey] = {
          loads: 0,
          successful: 0,
          failed: 0,
          totalLoadTime: 0,
          avgLoadTime: 0
        }
      }
      
      stats[libKey].loads++
      if (success) {
        stats[libKey].successful++
      } else {
        stats[libKey].failed++
      }
      stats[libKey].totalLoadTime += loadTime
      stats[libKey].avgLoadTime = stats[libKey].totalLoadTime / stats[libKey].loads
      
      localStorage.setItem(statsKey, JSON.stringify(stats))
    } catch {
      // Ignore stats errors
    }
    
  } catch (error) {
    // Never throw from analytics
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Error tracking library load:', error)
    }
  }
}

// Get converter statistics
export function getConverterStats() {
  try {
    if (typeof window === 'undefined') return null
    
    const stats = JSON.parse(localStorage.getItem('converter-stats') || '{}')
    const libStats = JSON.parse(localStorage.getItem('library-load-stats') || '{}')
    
    return {
      converters: stats,
      libraries: libStats
    }
  } catch {
    return null
  }
}

// Clear analytics data (for privacy)
export function clearAnalytics(): void {
  try {
    if (typeof window === 'undefined') return
    
    // Clear session storage
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key?.startsWith('conversion-')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
    
    // Clear local storage stats
    localStorage.removeItem('converter-stats')
    localStorage.removeItem('library-load-stats')
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Error clearing analytics:', error)
    }
  }
}