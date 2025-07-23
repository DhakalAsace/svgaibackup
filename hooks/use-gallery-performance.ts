"use client"
import { useEffect, useRef } from "react"
interface PerformanceMetrics {
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  timeToInteractive?: number
  totalLoadTime?: number
  imagesLoaded?: number
  svgsLoaded?: number
}
export function useGalleryPerformance() {
  const metricsRef = useRef<PerformanceMetrics>({})
  const startTimeRef = useRef<number>(Date.now())
  useEffect(() => {
    // Track performance metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "paint") {
          if (entry.name === "first-contentful-paint") {
            metricsRef.current.firstContentfulPaint = entry.startTime
          }
        } else if (entry.entryType === "largest-contentful-paint") {
          metricsRef.current.largestContentfulPaint = entry.startTime
        }
      }
    })
    try {
      observer.observe({ entryTypes: ["paint", "largest-contentful-paint"] })
    } catch (e) {
      // Performance Observer not supported
    }
    // Track when page becomes interactive
    const trackInteractive = () => {
      metricsRef.current.timeToInteractive = Date.now() - startTimeRef.current
    }
    if (document.readyState === "complete") {
      trackInteractive()
    } else {
      window.addEventListener("load", trackInteractive)
    }
    // Track total load time
    const trackLoadComplete = () => {
      metricsRef.current.totalLoadTime = Date.now() - startTimeRef.current
      // Count loaded images and SVGs
      const images = document.querySelectorAll("img")
      const svgs = document.querySelectorAll("svg")
      metricsRef.current.imagesLoaded = images.length
      metricsRef.current.svgsLoaded = svgs.length
      // Log metrics in development
      if (process.env.NODE_ENV === "development") {
        }
      // Send metrics to analytics (if available)
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "gallery_performance", {
          event_category: "performance",
          value: Math.round(metricsRef.current.largestContentfulPaint || 0),
          ...metricsRef.current,
        })
      }
    }
    // Give time for lazy loading to complete
    setTimeout(trackLoadComplete, 5000)
    return () => {
      observer.disconnect()
      window.removeEventListener("load", trackInteractive)
    }
  }, [])
  return metricsRef.current
}