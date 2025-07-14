/**
 * A/B Testing Utilities
 */

import { ABTestConfig, ABTestVariant, UserContext } from './index'
import { abTestManager } from './index'

// QA Testing utilities
export class ABTestingQA {
  /**
   * Force a specific variant for testing
   */
  static forceVariant(testId: string, variantId: string) {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams(window.location.search)
    params.set(`ab_force_${testId}`, variantId)
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }

  /**
   * Enable debug mode
   */
  static enableDebugMode() {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams(window.location.search)
    params.set('ab_debug', 'true')
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }

  /**
   * Preview a specific variant
   */
  static previewVariant(variantId: string) {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams(window.location.search)
    params.set('ab_preview', variantId)
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }

  /**
   * Clear all A/B testing parameters
   */
  static clearTestingParams() {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams(window.location.search)
    
    // Remove all A/B testing params
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('ab_')) {
        params.delete(key)
      }
    })
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
      
    window.history.replaceState({}, '', newUrl)
  }

  /**
   * Get forced variant from URL
   */
  static getForcedVariant(testId: string): string | null {
    if (typeof window === 'undefined') return null
    
    const params = new URLSearchParams(window.location.search)
    return params.get(`ab_force_${testId}`)
  }
}

// GDPR Compliance utilities
export class ABTestingPrivacy {
  private static CONSENT_KEY = 'ab_testing_consent'
  private static OPTED_OUT_KEY = 'ab_testing_opted_out'

  /**
   * Check if user has consented to A/B testing
   */
  static hasConsent(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.CONSENT_KEY) === 'true'
  }

  /**
   * Set user consent
   */
  static setConsent(consent: boolean) {
    if (typeof window === 'undefined') return
    
    if (consent) {
      localStorage.setItem(this.CONSENT_KEY, 'true')
      localStorage.removeItem(this.OPTED_OUT_KEY)
    } else {
      localStorage.removeItem(this.CONSENT_KEY)
      localStorage.setItem(this.OPTED_OUT_KEY, 'true')
    }
  }

  /**
   * Check if user has opted out
   */
  static hasOptedOut(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.OPTED_OUT_KEY) === 'true'
  }

  /**
   * Clear all A/B testing data
   */
  static clearAllData() {
    if (typeof window === 'undefined') return
    
    // Clear localStorage
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('ab_')) {
        localStorage.removeItem(key)
      }
    })
    
    // Clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage)
    sessionKeys.forEach(key => {
      if (key.startsWith('ab_')) {
        sessionStorage.removeItem(key)
      }
    })
  }

  /**
   * Get privacy-safe user context
   */
  static getSafeUserContext(context: UserContext): UserContext {
    if (!this.hasConsent()) {
      // Return minimal context without PII
      return {
        sessionId: context.sessionId,
        device: context.device,
        // Exclude user ID and properties
      }
    }
    return context
  }
}

// Performance monitoring
export class ABTestingPerformance {
  private static marks: Map<string, number> = new Map()

  /**
   * Mark start of variant rendering
   */
  static markVariantStart(testId: string, variantId: string) {
    const key = `${testId}_${variantId}_start`
    this.marks.set(key, performance.now())
  }

  /**
   * Mark end of variant rendering
   */
  static markVariantEnd(testId: string, variantId: string) {
    const startKey = `${testId}_${variantId}_start`
    const start = this.marks.get(startKey)
    
    if (start) {
      const duration = performance.now() - start
      this.marks.delete(startKey)
      
      // Track performance metric
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.trackPerformance('variant_render_time', {
          test_id: testId,
          variant_id: variantId,
          duration_ms: duration,
        })
      }
      
      return duration
    }
    
    return null
  }

  /**
   * Check if variant loading is impacting performance
   */
  static checkPerformanceImpact(threshold: number = 100): boolean {
    const entries = performance.getEntriesByType('measure')
    const abEntries = entries.filter(e => e.name.startsWith('ab_'))
    
    return abEntries.some(e => e.duration > threshold)
  }
}

// Test validation utilities
export class ABTestValidator {
  /**
   * Validate test configuration
   */
  static validateTest(test: ABTestConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate variants
    if (!test.variants || test.variants.length < 2) {
      errors.push('Test must have at least 2 variants')
    }

    // Validate weights
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors.push(`Variant weights must sum to 100 (current: ${totalWeight})`)
    }

    // Validate control variant
    const controlCount = test.variants.filter(v => v.isControl).length
    if (controlCount === 0) {
      errors.push('Test must have a control variant')
    } else if (controlCount > 1) {
      errors.push('Test can only have one control variant')
    }

    // Validate success metrics
    if (!test.successMetrics || test.successMetrics.length === 0) {
      errors.push('Test must have at least one success metric')
    }

    // Validate dates
    if (test.startDate && test.endDate && test.startDate >= test.endDate) {
      errors.push('End date must be after start date')
    }

    // Validate traffic allocation
    if (test.trafficAllocation !== undefined && 
        (test.trafficAllocation < 0 || test.trafficAllocation > 100)) {
      errors.push('Traffic allocation must be between 0 and 100')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate variant assignment consistency
   */
  static validateAssignment(
    userId: string,
    testId: string,
    expectedVariant: string,
    actualVariant: string | null
  ): boolean {
    return expectedVariant === actualVariant
  }
}

// URL utilities
export class ABTestingURL {
  /**
   * Add variant info to URL for tracking
   */
  static addVariantToURL(url: string, testId: string, variantId: string): string {
    const urlObj = new URL(url, window.location.origin)
    urlObj.searchParams.set(`utm_ab_test`, testId)
    urlObj.searchParams.set(`utm_ab_variant`, variantId)
    return urlObj.toString()
  }

  /**
   * Extract variant info from URL
   */
  static getVariantFromURL(): { testId: string; variantId: string } | null {
    if (typeof window === 'undefined') return null
    
    const params = new URLSearchParams(window.location.search)
    const testId = params.get('utm_ab_test')
    const variantId = params.get('utm_ab_variant')
    
    if (testId && variantId) {
      return { testId, variantId }
    }
    
    return null
  }
}

// Emergency kill switch
export class ABTestingKillSwitch {
  private static KILL_SWITCH_KEY = 'ab_testing_kill_switch'

  /**
   * Activate kill switch to disable all tests
   */
  static activate(reason: string) {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.KILL_SWITCH_KEY, JSON.stringify({
      activated: true,
      reason,
      timestamp: new Date().toISOString(),
    }))
    
    // Log to monitoring
    console.error('[A/B Testing] Kill switch activated:', reason)
  }

  /**
   * Deactivate kill switch
   */
  static deactivate() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.KILL_SWITCH_KEY)
  }

  /**
   * Check if kill switch is active
   */
  static isActive(): boolean {
    if (typeof window === 'undefined') return false
    
    const data = localStorage.getItem(this.KILL_SWITCH_KEY)
    if (!data) return false
    
    try {
      const parsed = JSON.parse(data)
      return parsed.activated === true
    } catch {
      return false
    }
  }
}

// Export utilities
export function exportTestResults(testId: string): string {
  const test = abTestManager.getAllTests().find(t => t.id === testId)
  const stats = abTestManager.getTestStats(testId)
  
  if (!test) {
    throw new Error(`Test ${testId} not found`)
  }
  
  const csv = [
    ['Test Name', test.name],
    ['Test ID', test.id],
    ['Status', test.status],
    ['Start Date', test.startDate?.toISOString() || 'N/A'],
    ['End Date', test.endDate?.toISOString() || 'N/A'],
    [],
    ['Variant', 'Participants', 'Conversions', 'Conversion Rate', 'Confidence', 'Uplift'],
    ...stats.map((s: any) => [
      s.variantName,
      s.participants,
      s.conversions,
      `${(s.conversionRate * 100).toFixed(2)}%`,
      s.confidence ? `${s.confidence}%` : 'N/A',
      s.uplift !== undefined ? `${s.uplift.toFixed(2)}%` : 'N/A',
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}