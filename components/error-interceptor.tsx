'use client'

import { useEffect } from 'react'

export function ErrorInterceptor() {
  useEffect(() => {
    // Intercept all errors
    const originalError = window.console.error
    window.console.error = (...args) => {
      console.log('[ERROR-INTERCEPTOR] Console error caught:', ...args)
      
      // Check if it's the sharp error
      const errorString = args.join(' ')
      if (errorString.includes('sharp is not defined')) {
        console.log('[ERROR-INTERCEPTOR] SHARP ERROR DETECTED!')
        console.log('[ERROR-INTERCEPTOR] Stack trace:')
        console.trace()
        
        // Try to get the error object
        const errorObj = args.find(arg => arg instanceof Error)
        if (errorObj) {
          console.log('[ERROR-INTERCEPTOR] Error object:', errorObj)
          console.log('[ERROR-INTERCEPTOR] Error stack:', errorObj.stack)
        }
      }
      
      // Call original console.error
      originalError.apply(console, args)
    }
    
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.log('[ERROR-INTERCEPTOR] Global error event:', event)
      if (event.message.includes('sharp is not defined')) {
        console.log('[ERROR-INTERCEPTOR] SHARP ERROR in global handler!')
        console.log('[ERROR-INTERCEPTOR] Error:', event.error)
        console.log('[ERROR-INTERCEPTOR] Filename:', event.filename)
        console.log('[ERROR-INTERCEPTOR] Line:', event.lineno)
        console.log('[ERROR-INTERCEPTOR] Column:', event.colno)
        console.log('[ERROR-INTERCEPTOR] Stack:', event.error?.stack)
      }
    }
    
    // Unhandled promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.log('[ERROR-INTERCEPTOR] Unhandled promise rejection:', event)
      const reasonString = String(event.reason)
      if (reasonString.includes('sharp is not defined')) {
        console.log('[ERROR-INTERCEPTOR] SHARP ERROR in promise rejection!')
        console.log('[ERROR-INTERCEPTOR] Reason:', event.reason)
        if (event.reason instanceof Error) {
          console.log('[ERROR-INTERCEPTOR] Stack:', event.reason.stack)
        }
      }
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    
    // Log that interceptor is active
    console.log('[ERROR-INTERCEPTOR] Error interceptor activated')
    
    return () => {
      window.console.error = originalError
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])
  
  return null
}