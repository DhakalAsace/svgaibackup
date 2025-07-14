/**
 * Monitoring System - Main Export
 * Provides a unified interface for all monitoring functionality
 */

// Re-export configuration
export * from './config'

// Re-export health checks
export {
  checkAllServices,
  checkDatabaseHealth,
  checkExternalAPIs,
  calculateUptime,
  getHealthSummary,
  runSyntheticChecks,
  type HealthCheckResult,
  type ServiceHealth
} from './health-checks'

// Re-export performance monitoring
export {
  PerformanceTracker,
  trackWebVitals,
  monitorMemoryUsage,
  trackDatabaseQuery,
  trackAPIResponse,
  generatePerformanceReport,
  trackConverterPerformance,
  initializeRUM,
  type PerformanceMetric,
  type PerformanceReport
} from './performance'

// Re-export alerts
export {
  sendAlert,
  retryFailedAlerts,
  getAlertStats,
  acknowledgeAlert,
  type AlertNotification,
  type AlertStats
} from './alerts'

// Re-export error tracking
export {
  initializeSentry,
  captureError,
  createErrorBoundaryConfig,
  getErrorStats,
  resolveErrorGroup,
  ignoreErrorGroup,
  type ErrorEvent,
  type ErrorGroup
} from './error-tracking'

// Unified monitoring interface
export class MonitoringSystem {
  private static instance: MonitoringSystem
  private initialized = false

  private constructor() {}

  static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem()
    }
    return MonitoringSystem.instance
  }

  /**
   * Initialize all monitoring systems
   */
  async initialize() {
    if (this.initialized) return

    try {
      // Initialize Sentry for error tracking
      const { initializeSentry } = await import('./error-tracking')
      initializeSentry()

      // Initialize Real User Monitoring
      if (typeof window !== 'undefined') {
        const { initializeRUM } = await import('./performance')
        initializeRUM()
      }

      // Set up periodic health checks (server-side only)
      if (typeof window === 'undefined') {
        this.startPeriodicChecks()
      }

      this.initialized = true
      console.log('Monitoring system initialized')

    } catch (error) {
      console.error('Failed to initialize monitoring:', error)
    }
  }

  /**
   * Start periodic health checks
   */
  private startPeriodicChecks() {
    // Run health checks every 5 minutes
    setInterval(async () => {
      try {
        const { checkAllServices, checkDatabaseHealth } = await import('./health-checks')
        await Promise.all([
          checkAllServices(),
          checkDatabaseHealth()
        ])
      } catch (error) {
        console.error('Periodic health check failed:', error)
      }
    }, 5 * 60 * 1000)

    // Retry failed alerts every 15 minutes
    setInterval(async () => {
      try {
        const { retryFailedAlerts } = await import('./alerts')
        await retryFailedAlerts()
      } catch (error) {
        console.error('Alert retry failed:', error)
      }
    }, 15 * 60 * 1000)
  }

  /**
   * Track a custom metric
   */
  async trackMetric(
    service: string,
    metric: string,
    value: number,
    metadata?: Record<string, any>
  ) {
    const { PerformanceTracker } = await import('./performance')
    const tracker = new PerformanceTracker(service, metric)
    
    if (metadata) {
      Object.entries(metadata).forEach(([key, val]) => {
        tracker.addMetadata(key, val)
      })
    }

    await tracker.complete(true)
  }

  /**
   * Get current system health
   */
  async getHealth() {
    const { getHealthSummary } = await import('./health-checks')
    return getHealthSummary()
  }

  /**
   * Capture and track an error
   */
  async logError(
    error: Error | string,
    service: string,
    context?: Record<string, any>
  ) {
    const { captureError } = await import('./error-tracking')
    await captureError(error, service, context)
  }
}

// Export singleton instance
export const monitoring = MonitoringSystem.getInstance()

// Convenience functions for common operations
export async function trackConversion(
  converter: string,
  success: boolean,
  duration: number,
  metadata?: Record<string, any>
) {
  const { trackConverterPerformance } = await import('./performance')
  await trackConverterPerformance(converter, {
    totalTime: duration,
    success,
    ...metadata
  })
}

export async function checkServiceHealth(service: string) {
  const { checkAllServices } = await import('./health-checks')
  const services = await checkAllServices()
  return services.find(s => s.service === service)
}

export async function getPerformanceStats(service: string, hours = 24) {
  const { generatePerformanceReport } = await import('./performance')
  return generatePerformanceReport(service, hours)
}