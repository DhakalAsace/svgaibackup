'use client'

import { useEffect } from 'react'

export function ErrorInterceptor() {
  useEffect(() => {
    // Intercept console errors to suppress non-critical warnings
    const originalError = window.console.error
    const originalWarn = window.console.warn
    
    window.console.error = (...args) => {
      const errorString = args.join(' ')
      
      // Suppress known non-critical errors
      if (
        errorString.includes('sharp is not defined') ||
        errorString.includes('ResizeObserver loop') ||
        errorString.includes('Non-Error promise rejection') ||
        errorString.includes('Failed to load resource: the server responded with a status of 404')
      ) {
        return
      }
      
      // Call original console.error for other errors
      originalError.apply(console, args)
    }
    
    window.console.warn = (...args) => {
      const warnString = args.join(' ')
      
      // Suppress specific warnings
      if (
        warnString.includes('Duplicate atom key') ||
        warnString.includes('Extra attributes from the server')
      ) {
        return
      }
      
      originalWarn.apply(console, args)
    }
    
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      const message = event.message || ''
      
      if (
        message.includes('sharp is not defined') ||
        message.includes('ResizeObserver loop') ||
        message.includes('Script error')
      ) {
        event.preventDefault()
        return
      }
    }
    
    // Unhandled promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reasonString = String(event.reason)
      
      if (
        reasonString.includes('sharp is not defined') ||
        reasonString.includes('Network request failed')
      ) {
        event.preventDefault()
        return
      }
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    
    return () => {
      window.console.error = originalError
      window.console.warn = originalWarn
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])
  
  return null
}