"use client"

import { useEffect } from 'react'

export function PerformanceHints() {
  useEffect(() => {
    // Add performance hints
    if ('PerformanceObserver' in window) {
      // Observe LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log('LCP:', lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP observer not supported
      }

      // Observe FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID observer not supported
      }

      // Observe CLS
      try {
        let clsValue = 0
        let clsEntries = []
        
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsEntries.push(entry)
              clsValue += entry.value
              console.log('CLS:', clsValue)
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