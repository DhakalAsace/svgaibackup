"use client"

import { useEffect } from 'react'

// Type definitions for Web Vitals
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number
}

export function PerformanceHints() {
  useEffect(() => {
    // Add performance hints
    if ('PerformanceObserver' in window && process.env.NODE_ENV === 'development') {
      // Observe LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          // Only log in development
          if (process.env.NODE_ENV === 'development') {
            console.info('LCP:', lastEntry.startTime)
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP observer not supported
      }

      // Observe FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as FirstInputEntry[]
          entries.forEach((entry) => {
            if (process.env.NODE_ENV === 'development' && 'processingStart' in entry) {
              console.info('FID:', entry.processingStart - entry.startTime)
            }
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID observer not supported
      }

      // Observe CLS
      try {
        let clsValue = 0
        const clsEntries: LayoutShiftEntry[] = []
        
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as LayoutShiftEntry[]
          entries.forEach((entry) => {
            if ('hadRecentInput' in entry && !entry.hadRecentInput && 'value' in entry) {
              clsEntries.push(entry)
              clsValue += entry.value
              if (process.env.NODE_ENV === 'development') {
                console.info('CLS:', clsValue)
              }
            }
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS observer not supported
      }
    }

    // Prefetch critical resources after page load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        // Prefetch converter page if likely to be visited
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = '/convert'
        document.head.appendChild(link)
        
        // Preconnect to CDNs
        const preconnect = document.createElement('link')
        preconnect.rel = 'preconnect'
        preconnect.href = 'https://cdn.jsdelivr.net'
        document.head.appendChild(preconnect)
      })
    }
  }, [])

  return null
}