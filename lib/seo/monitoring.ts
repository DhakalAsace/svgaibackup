// Core Web Vitals tracking
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }

    // Log to monitoring service
    const body = {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // Send to monitoring endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/monitoring/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(console.error)
    }
  }
}

// 404 tracking
export function track404Error(pathname: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_not_found', {
      event_category: 'Error',
      event_label: pathname,
      page_path: pathname,
    })
  }

  // Log to monitoring
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/monitoring/404', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }),
    }).catch(console.error)
  }
}

// Conversion tracking
export function trackConversion(type: string, details?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      event_category: 'Conversion',
      event_label: type,
      ...details
    })
  }
}

// Search tracking
export function trackSearch(query: string, resultsCount: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount
    })
  }
}

// Tool usage tracking
export function trackToolUsage(toolName: string, action: string, details?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'Tool Usage',
      event_label: toolName,
      ...details
    })
  }
}

// Performance monitoring thresholds
export const performanceThresholds = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }  // Time to First Byte
}

// Get performance rating
export function getPerformanceRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = performanceThresholds[metric as keyof typeof performanceThresholds]
  if (!threshold) return 'poor'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}