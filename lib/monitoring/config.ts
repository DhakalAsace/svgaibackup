/**
 * Comprehensive Monitoring Configuration
 * Defines thresholds, alerts, and monitoring rules for all services
 */

import { AlertThreshold } from '@/lib/analytics-alerts'

export interface MonitoringEndpoint {
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  expectedStatus: number[]
  timeout: number
  checkInterval: number // minutes
}

export interface PerformanceThreshold {
  metric: string
  p50: number // 50th percentile
  p95: number // 95th percentile
  p99: number // 99th percentile
}

export interface ServiceMonitoringConfig {
  service: string
  endpoints?: MonitoringEndpoint[]
  performanceThresholds?: PerformanceThreshold[]
  alertThresholds: AlertThreshold[]
  healthCheckInterval: number // minutes
  memoryLimit?: number // MB
  errorRateLimit?: number // percentage
}

// Comprehensive monitoring configuration for all services
export const MONITORING_CONFIG: ServiceMonitoringConfig[] = [
  // Converter Services
  {
    service: 'png-to-svg',
    endpoints: [
      {
        name: 'PNG to SVG Converter',
        url: '/api/convert/png-to-svg',
        method: 'POST',
        expectedStatus: [200, 201],
        timeout: 30000,
        checkInterval: 15
      }
    ],
    performanceThresholds: [
      { metric: 'conversion_time', p50: 2000, p95: 5000, p99: 10000 },
      { metric: 'file_processing_time', p50: 1000, p95: 3000, p99: 5000 }
    ],
    alertThresholds: [
      { metric: 'error_rate', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'error_rate', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'conversion_time', threshold: 10000, comparison: 'above', severity: 'warning' },
      { metric: 'conversion_time', threshold: 20000, comparison: 'above', severity: 'critical' },
      { metric: 'memory_usage', threshold: 512, comparison: 'above', severity: 'warning' }
    ],
    healthCheckInterval: 10,
    memoryLimit: 1024,
    errorRateLimit: 5
  },
  {
    service: 'svg-to-png',
    endpoints: [
      {
        name: 'SVG to PNG Converter',
        url: '/api/convert/svg-to-png',
        method: 'POST',
        expectedStatus: [200, 201],
        timeout: 20000,
        checkInterval: 15
      }
    ],
    performanceThresholds: [
      { metric: 'conversion_time', p50: 1000, p95: 3000, p99: 5000 },
      { metric: 'render_time', p50: 500, p95: 1500, p99: 3000 }
    ],
    alertThresholds: [
      { metric: 'error_rate', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'error_rate', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'conversion_time', threshold: 5000, comparison: 'above', severity: 'warning' },
      { metric: 'conversion_time', threshold: 10000, comparison: 'above', severity: 'critical' }
    ],
    healthCheckInterval: 10,
    memoryLimit: 512,
    errorRateLimit: 5
  },
  {
    service: 'jpg-to-svg',
    endpoints: [
      {
        name: 'JPG to SVG Converter',
        url: '/api/convert/jpg-to-svg',
        method: 'POST',
        expectedStatus: [200, 201],
        timeout: 30000,
        checkInterval: 15
      }
    ],
    performanceThresholds: [
      { metric: 'conversion_time', p50: 2000, p95: 5000, p99: 10000 },
      { metric: 'processing_time', p50: 1500, p95: 4000, p99: 8000 }
    ],
    alertThresholds: [
      { metric: 'error_rate', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'error_rate', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'conversion_time', threshold: 10000, comparison: 'above', severity: 'warning' },
      { metric: 'conversion_time', threshold: 20000, comparison: 'above', severity: 'critical' }
    ],
    healthCheckInterval: 10,
    memoryLimit: 1024,
    errorRateLimit: 5
  },

  // Gallery Services
  {
    service: 'gallery-data',
    endpoints: [
      {
        name: 'Gallery API',
        url: '/api/gallery/heart',
        method: 'GET',
        expectedStatus: [200],
        timeout: 5000,
        checkInterval: 30
      }
    ],
    performanceThresholds: [
      { metric: 'response_time', p50: 200, p95: 500, p99: 1000 },
      { metric: 'data_fetch_time', p50: 100, p95: 300, p99: 500 }
    ],
    alertThresholds: [
      { metric: 'error_rate', threshold: 2, comparison: 'above', severity: 'warning' },
      { metric: 'error_rate', threshold: 5, comparison: 'above', severity: 'error' },
      { metric: 'response_time', threshold: 1000, comparison: 'above', severity: 'warning' },
      { metric: 'response_time', threshold: 3000, comparison: 'above', severity: 'critical' }
    ],
    healthCheckInterval: 30,
    errorRateLimit: 2
  },

  // Database Services
  {
    service: 'database',
    performanceThresholds: [
      { metric: 'query_time', p50: 50, p95: 200, p99: 500 },
      { metric: 'connection_time', p50: 10, p95: 50, p99: 100 }
    ],
    alertThresholds: [
      { metric: 'connection_pool_usage', threshold: 80, comparison: 'above', severity: 'warning' },
      { metric: 'connection_pool_usage', threshold: 95, comparison: 'above', severity: 'critical' },
      { metric: 'query_time', threshold: 1000, comparison: 'above', severity: 'warning' },
      { metric: 'query_time', threshold: 3000, comparison: 'above', severity: 'critical' },
      { metric: 'connection_failures', threshold: 5, comparison: 'above', severity: 'error' }
    ],
    healthCheckInterval: 5,
    errorRateLimit: 1
  },

  // External API Integrations
  {
    service: 'replicate-api',
    endpoints: [
      {
        name: 'Replicate Health',
        url: 'https://api.replicate.com/v1/models',
        method: 'GET',
        expectedStatus: [200, 401], // 401 is expected without auth
        timeout: 10000,
        checkInterval: 60
      }
    ],
    performanceThresholds: [
      { metric: 'api_response_time', p50: 500, p95: 2000, p99: 5000 },
      { metric: 'generation_time', p50: 5000, p95: 15000, p99: 30000 }
    ],
    alertThresholds: [
      { metric: 'api_error_rate', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'api_error_rate', threshold: 10, comparison: 'above', severity: 'critical' },
      { metric: 'api_response_time', threshold: 5000, comparison: 'above', severity: 'warning' },
      { metric: 'api_response_time', threshold: 10000, comparison: 'above', severity: 'critical' },
      { metric: 'rate_limit_hits', threshold: 50, comparison: 'above', severity: 'warning' }
    ],
    healthCheckInterval: 60,
    errorRateLimit: 5
  },
  {
    service: 'supabase',
    endpoints: [
      {
        name: 'Supabase Health',
        url: process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/',
        method: 'GET',
        expectedStatus: [200, 401],
        timeout: 5000,
        checkInterval: 30
      }
    ],
    performanceThresholds: [
      { metric: 'auth_time', p50: 100, p95: 300, p99: 500 },
      { metric: 'db_query_time', p50: 50, p95: 200, p99: 500 }
    ],
    alertThresholds: [
      { metric: 'auth_failures', threshold: 10, comparison: 'above', severity: 'warning' },
      { metric: 'auth_failures', threshold: 50, comparison: 'above', severity: 'critical' },
      { metric: 'db_error_rate', threshold: 2, comparison: 'above', severity: 'warning' },
      { metric: 'db_error_rate', threshold: 5, comparison: 'above', severity: 'error' }
    ],
    healthCheckInterval: 30,
    errorRateLimit: 2
  },

  // File Processing
  {
    service: 'file-upload',
    performanceThresholds: [
      { metric: 'upload_time', p50: 1000, p95: 3000, p99: 5000 },
      { metric: 'validation_time', p50: 50, p95: 200, p99: 500 }
    ],
    alertThresholds: [
      { metric: 'upload_failures', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'upload_failures', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'file_size_exceeded', threshold: 20, comparison: 'above', severity: 'warning' },
      { metric: 'invalid_file_type', threshold: 50, comparison: 'above', severity: 'warning' }
    ],
    healthCheckInterval: 15,
    memoryLimit: 2048,
    errorRateLimit: 5
  },

  // AI Generation Services
  {
    service: 'ai-generation',
    performanceThresholds: [
      { metric: 'generation_time', p50: 3000, p95: 10000, p99: 20000 },
      { metric: 'prompt_processing_time', p50: 100, p95: 300, p99: 500 }
    ],
    alertThresholds: [
      { metric: 'generation_failures', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'generation_failures', threshold: 10, comparison: 'above', severity: 'critical' },
      { metric: 'credit_failures', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'generation_time', threshold: 30000, comparison: 'above', severity: 'warning' },
      { metric: 'generation_time', threshold: 60000, comparison: 'above', severity: 'critical' }
    ],
    healthCheckInterval: 10,
    errorRateLimit: 5
  },

  // Animation Tool
  {
    service: 'svg-animation',
    performanceThresholds: [
      { metric: 'render_time', p50: 500, p95: 2000, p99: 5000 },
      { metric: 'animation_complexity', p50: 50, p95: 150, p99: 300 }
    ],
    alertThresholds: [
      { metric: 'render_failures', threshold: 5, comparison: 'above', severity: 'warning' },
      { metric: 'render_failures', threshold: 10, comparison: 'above', severity: 'error' },
      { metric: 'memory_usage', threshold: 512, comparison: 'above', severity: 'warning' },
      { metric: 'memory_usage', threshold: 1024, comparison: 'above', severity: 'critical' },
      { metric: 'browser_crashes', threshold: 1, comparison: 'above', severity: 'critical' }
    ],
    healthCheckInterval: 15,
    memoryLimit: 1024,
    errorRateLimit: 5
  }
]

// Alert notification channels configuration
export const NOTIFICATION_CHANNELS = {
  email: {
    enabled: process.env.MONITORING_EMAIL_ENABLED === 'true',
    recipients: process.env.MONITORING_EMAIL_RECIPIENTS?.split(',') || [],
    sender: process.env.MONITORING_EMAIL_SENDER || 'alerts@svgai.org'
  },
  slack: {
    enabled: process.env.SLACK_WEBHOOK_URL !== undefined,
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    channel: process.env.SLACK_ALERT_CHANNEL || '#alerts',
    username: 'SVG AI Monitor'
  },
  webhook: {
    enabled: process.env.MONITORING_WEBHOOK_URL !== undefined,
    url: process.env.MONITORING_WEBHOOK_URL,
    headers: {
      'Authorization': `Bearer ${process.env.MONITORING_WEBHOOK_TOKEN}`,
      'Content-Type': 'application/json'
    }
  },
  pagerduty: {
    enabled: process.env.PAGERDUTY_INTEGRATION_KEY !== undefined,
    integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY,
    severityMapping: {
      warning: 'warning',
      error: 'error',
      critical: 'critical'
    }
  }
}

// Synthetic monitoring paths
export const SYNTHETIC_CHECKS = [
  {
    name: 'Homepage',
    path: '/',
    expectedStatus: 200,
    expectedContent: 'AI-Powered SVG Generation'
  },
  {
    name: 'PNG to SVG Converter',
    path: '/convert/png-to-svg',
    expectedStatus: 200,
    expectedContent: 'Convert PNG to SVG'
  },
  {
    name: 'Gallery - Heart SVGs',
    path: '/gallery/heart',
    expectedStatus: 200,
    expectedContent: 'Heart SVG'
  },
  {
    name: 'AI Icon Generator',
    path: '/ai-icon-generator',
    expectedStatus: 200,
    expectedContent: 'Generate Icons'
  },
  {
    name: 'Animation Tool',
    path: '/animate',
    expectedStatus: 200,
    expectedContent: 'SVG Animation'
  }
]

// Error tracking configuration
export const ERROR_TRACKING = {
  sentry: {
    enabled: process.env.NEXT_PUBLIC_SENTRY_DSN !== undefined,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend: (event: any) => {
      // Filter out non-critical errors
      if (event.level === 'log' || event.level === 'debug') {
        return null
      }
      return event
    }
  },
  customErrorBoundaries: {
    converters: true,
    galleries: true,
    aiGeneration: true,
    animation: true
  }
}

// Performance monitoring settings
export const PERFORMANCE_CONFIG = {
  webVitals: {
    enabled: true,
    thresholds: {
      FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
      LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
      FID: { good: 100, poor: 300 },   // First Input Delay
      CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
      TTFB: { good: 800, poor: 1800 }  // Time to First Byte
    }
  },
  resourceTiming: {
    enabled: true,
    sampleRate: 0.1 // Sample 10% of page loads
  },
  userTiming: {
    enabled: true,
    marks: [
      'converter-start',
      'converter-upload',
      'converter-process',
      'converter-complete',
      'ai-generation-start',
      'ai-generation-complete'
    ]
  }
}

// Get monitoring configuration for a specific service
export function getServiceConfig(service: string): ServiceMonitoringConfig | undefined {
  return MONITORING_CONFIG.find(config => config.service === service)
}

// Get all services that need endpoint monitoring
export function getServicesWithEndpoints(): ServiceMonitoringConfig[] {
  return MONITORING_CONFIG.filter(config => config.endpoints && config.endpoints.length > 0)
}

// Get notification channel configuration
export function getActiveNotificationChannels() {
  return Object.entries(NOTIFICATION_CHANNELS)
    .filter(([_, config]) => config.enabled)
    .map(([name, config]) => ({ name, ...config }))
}