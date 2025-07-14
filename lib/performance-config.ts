/**
 * Performance configuration and optimization settings
 */

export const PERFORMANCE_CONFIG = {
  // Core Web Vitals targets
  webVitals: {
    LCP: 2500,  // Largest Contentful Paint < 2.5s
    INP: 200,   // Interaction to Next Paint < 200ms  
    CLS: 0.1,   // Cumulative Layout Shift < 0.1
    FCP: 1800,  // First Contentful Paint < 1.8s
    TTFB: 800,  // Time to First Byte < 800ms
  },
  
  // Image optimization settings
  images: {
    // Lazy load images below the fold
    lazyBoundary: '200px',
    // Device sizes for responsive images
    deviceSizes: [640, 768, 1024, 1280, 1536],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Formats to use
    formats: ['image/avif', 'image/webp'],
    // Quality settings
    quality: 75,
    // Minimum cache TTL
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Font optimization
  fonts: {
    // Use font-display: swap for all fonts
    display: 'swap',
    // Preconnect to font providers
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
  },
  
  // JavaScript optimization
  javascript: {
    // Code splitting threshold
    splitChunksSize: 30000, // 30KB
    // Prefetch critical chunks
    prefetchChunks: [
      'framework',
      'main',
      'pages/_app',
    ],
  },
  
  // CSS optimization
  css: {
    // Critical CSS size limit
    criticalSize: 14000, // 14KB
    // Inline critical CSS
    inlineCritical: true,
    // Remove unused CSS
    purge: true,
  },
  
  // Resource hints
  resourceHints: {
    // DNS prefetch for external domains
    dnsPrefetch: [
      'https://vitals.vercel-insights.com',
      'https://va.vercel-scripts.com',
      'https://svgai.supabase.co',
      'https://replicate.com',
    ],
    // Preconnect for critical domains
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://svgai.supabase.co',
    ],
    // Preload critical resources
    preload: [
      { href: '/laurel.svg', as: 'image', type: 'image/svg+xml' },
      { href: '/star.svg', as: 'image', type: 'image/svg+xml' },
    ],
  },
  
  // Monitoring and alerts
  monitoring: {
    // Enable real user monitoring
    rum: true,
    // Sample rate for performance data
    sampleRate: 0.1, // 10%
    // Alert thresholds
    alerts: {
      LCP: { warning: 2500, critical: 4000 },
      INP: { warning: 200, critical: 500 },
      CLS: { warning: 0.1, critical: 0.25 },
    },
  },
  
  // Caching strategies
  caching: {
    // Static assets
    static: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    // API responses
    api: {
      maxAge: 0,
      sMaxAge: 60,
      staleWhileRevalidate: 86400,
    },
    // HTML pages
    html: {
      maxAge: 0,
      sMaxAge: 3600, // 1 hour
      staleWhileRevalidate: 86400,
    },
  },
}

/**
 * Get performance budget for a specific metric
 */
export function getPerformanceBudget(metric: keyof typeof PERFORMANCE_CONFIG.webVitals) {
  return PERFORMANCE_CONFIG.webVitals[metric]
}

/**
 * Check if a metric value exceeds the budget
 */
export function exceedsPerformanceBudget(
  metric: keyof typeof PERFORMANCE_CONFIG.webVitals,
  value: number
): boolean {
  const budget = getPerformanceBudget(metric)
  return value > budget
}

/**
 * Get alert level for a metric value
 */
export function getAlertLevel(
  metric: 'LCP' | 'INP' | 'CLS',
  value: number
): 'good' | 'warning' | 'critical' {
  const thresholds = PERFORMANCE_CONFIG.monitoring.alerts[metric]
  
  if (value <= PERFORMANCE_CONFIG.webVitals[metric]) {
    return 'good'
  } else if (value <= thresholds.warning) {
    return 'warning'
  } else {
    return 'critical'
  }
}

/**
 * Format cache control header based on resource type
 */
export function getCacheControlHeader(type: 'static' | 'api' | 'html'): string {
  const config = PERFORMANCE_CONFIG.caching[type]
  const parts = []
  
  if (config.maxAge === 0) {
    parts.push('no-cache')
  } else {
    parts.push(`max-age=${config.maxAge}`)
  }
  
  if ('sMaxAge' in config && config.sMaxAge) {
    parts.push(`s-maxage=${config.sMaxAge}`)
  }
  
  if ('staleWhileRevalidate' in config && config.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
  }
  
  if ('immutable' in config && config.immutable) {
    parts.push('immutable')
  }
  
  return parts.join(', ')
}