/**
 * Comprehensive A/B Testing Framework
 * Supports experiments, feature flags, and gradual rollouts
 */
import { createBrowserClient } from '@/lib/supabase'
import { analytics } from '@/lib/analytics/analytics-service'
// Types
export interface ABTestVariant {
  id: string
  name: string
  weight: number // 0-100 percentage
  isControl?: boolean
  properties?: Record<string, any>
}
export interface ABTestConfig {
  id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  variants: ABTestVariant[]
  targetingRules?: TargetingRule[]
  successMetrics: SuccessMetric[]
  startDate?: Date
  endDate?: Date
  minimumSampleSize?: number
  confidenceLevel?: number // Default 95%
  trafficAllocation?: number // 0-100 percentage of traffic
  winnerSelectionMode?: 'manual' | 'automatic'
  metadata?: Record<string, any>
}
export interface TargetingRule {
  type: 'user_property' | 'device' | 'location' | 'custom'
  property: string
  operator: 'equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than'
  value: any
}
export interface SuccessMetric {
  id: string
  name: string
  type: 'conversion' | 'engagement' | 'revenue' | 'custom'
  eventName: string
  goalValue?: number
  higherIsBetter?: boolean // Default true
}
export interface ABTestResult {
  testId: string
  variantId: string
  variantName: string
  userId?: string
  sessionId: string
  assignedAt: Date
  converted?: boolean
  conversionValue?: number
  metadata?: Record<string, any>
}
export interface VariantStats {
  variantId: string
  variantName: string
  participants: number
  conversions: number
  conversionRate: number
  averageValue: number
  confidence?: number
  isWinner?: boolean
  uplift?: number // Percentage uplift vs control
}
// User context for targeting
export interface UserContext {
  userId?: string
  sessionId: string
  properties?: Record<string, any>
  device?: {
    type: 'mobile' | 'tablet' | 'desktop'
    os?: string
    browser?: string
  }
  location?: {
    country?: string
    region?: string
    city?: string
  }
}
// Statistical calculations
class StatisticalCalculator {
  /**
   * Calculate Z-score for two proportions
   */
  static calculateZScore(
    controlRate: number,
    variantRate: number,
    controlSize: number,
    variantSize: number
  ): number {
    const pooledProbability = 
      (controlRate * controlSize + variantRate * variantSize) / 
      (controlSize + variantSize)
    const standardError = Math.sqrt(
      pooledProbability * (1 - pooledProbability) * 
      (1 / controlSize + 1 / variantSize)
    )
    return (variantRate - controlRate) / standardError
  }
  /**
   * Calculate confidence level from Z-score
   */
  static getConfidenceLevel(zScore: number): number {
    const zAbs = Math.abs(zScore)
    // Simplified normal CDF approximation
    if (zAbs >= 2.58) return 99
    if (zAbs >= 1.96) return 95
    if (zAbs >= 1.64) return 90
    if (zAbs >= 1.28) return 80
    return Math.round(50 + zAbs * 20)
  }
  /**
   * Check if result is statistically significant
   */
  static isSignificant(
    controlStats: VariantStats,
    variantStats: VariantStats,
    confidenceLevel: number = 95
  ): boolean {
    const zScore = this.calculateZScore(
      controlStats.conversionRate,
      variantStats.conversionRate,
      controlStats.participants,
      variantStats.participants
    )
    const confidence = this.getConfidenceLevel(zScore)
    return confidence >= confidenceLevel
  }
  /**
   * Calculate minimum sample size needed
   */
  static calculateSampleSize(
    baselineRate: number,
    minimumDetectableEffect: number,
    confidenceLevel: number = 95,
    power: number = 80
  ): number {
    // Z-scores for confidence and power
    const zAlpha = confidenceLevel >= 99 ? 2.58 : confidenceLevel >= 95 ? 1.96 : 1.64
    const zBeta = power >= 90 ? 1.28 : power >= 80 ? 0.84 : 0.52
    const p1 = baselineRate
    const p2 = baselineRate * (1 + minimumDetectableEffect)
    const pooledP = (p1 + p2) / 2
    const sampleSize = 
      2 * Math.pow(zAlpha + zBeta, 2) * pooledP * (1 - pooledP) / 
      Math.pow(p2 - p1, 2)
    return Math.ceil(sampleSize)
  }
}
// A/B Test Manager
export class ABTestManager {
  private static instance: ABTestManager
  private tests: Map<string, ABTestConfig> = new Map()
  private results: Map<string, ABTestResult[]> = new Map()
  private userAssignments: Map<string, Map<string, string>> = new Map()
  private constructor() {
    this.loadTests()
  }
  static getInstance(): ABTestManager {
    if (!this.instance) {
      this.instance = new ABTestManager()
    }
    return this.instance
  }
  /**
   * Load test configurations from storage
   */
  private async loadTests() {
    if (typeof window === 'undefined') return
    try {
      // Load from localStorage for now, can be replaced with API call
      const stored = localStorage.getItem('ab_tests')
      if (stored) {
        const tests = JSON.parse(stored)
        tests.forEach((test: ABTestConfig) => {
          this.tests.set(test.id, test)
        })
      }
      // Load user assignments
      const assignments = localStorage.getItem('ab_test_assignments')
      if (assignments) {
        const parsed = JSON.parse(assignments)
        Object.entries(parsed).forEach(([userId, tests]) => {
          this.userAssignments.set(userId, new Map(Object.entries(tests as any)))
        })
      }
    } catch (error) {
      }
  }
  /**
   * Save tests to storage
   */
  private saveTests() {
    if (typeof window === 'undefined') return
    try {
      const tests = Array.from(this.tests.values())
      localStorage.setItem('ab_tests', JSON.stringify(tests))
      // Save assignments
      const assignments: Record<string, Record<string, string>> = {}
      this.userAssignments.forEach((tests, userId) => {
        assignments[userId] = Object.fromEntries(tests)
      })
      localStorage.setItem('ab_test_assignments', JSON.stringify(assignments))
    } catch (error) {
      }
  }
  /**
   * Create or update a test
   */
  createTest(config: ABTestConfig): void {
    // Validate variants weights sum to 100
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error('Variant weights must sum to 100')
    }
    // Ensure one control variant
    const hasControl = config.variants.some(v => v.isControl)
    if (!hasControl && config.variants.length > 0) {
      config.variants[0].isControl = true
    }
    this.tests.set(config.id, config)
    this.saveTests()
  }
  /**
   * Get variant assignment for user
   */
  getVariant(testId: string, context: UserContext): ABTestVariant | null {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'active') return null
    // Check if test is within date range
    if (test.startDate && new Date() < test.startDate) return null
    if (test.endDate && new Date() > test.endDate) return null
    // Check targeting rules
    if (!this.matchesTargeting(test, context)) return null
    // Check traffic allocation
    if (test.trafficAllocation && test.trafficAllocation < 100) {
      const inTest = this.hashUserId(context.userId || context.sessionId, testId + '_traffic') < test.trafficAllocation
      if (!inTest) return null
    }
    // Check for existing assignment
    const userId = context.userId || context.sessionId
    const userTests = this.userAssignments.get(userId)
    if (userTests?.has(testId)) {
      const variantId = userTests.get(testId)!
      return test.variants.find(v => v.id === variantId) || null
    }
    // Assign variant based on weights
    const variant = this.assignVariant(test, userId)
    if (variant) {
      // Store assignment
      if (!this.userAssignments.has(userId)) {
        this.userAssignments.set(userId, new Map())
      }
      this.userAssignments.get(userId)!.set(testId, variant.id)
      this.saveTests()
      // Track assignment
      this.trackAssignment(test, variant, context)
    }
    return variant
  }
  /**
   * Check if user matches targeting rules
   */
  private matchesTargeting(test: ABTestConfig, context: UserContext): boolean {
    if (!test.targetingRules || test.targetingRules.length === 0) return true
    return test.targetingRules.every(rule => {
      let value: any
      switch (rule.type) {
        case 'user_property':
          value = context.properties?.[rule.property]
          break
        case 'device':
          value = context.device?.[rule.property as keyof typeof context.device]
          break
        case 'location':
          value = context.location?.[rule.property as keyof typeof context.location]
          break
        default:
          return false
      }
      switch (rule.operator) {
        case 'equals':
          return value === rule.value
        case 'contains':
          return String(value).includes(String(rule.value))
        case 'in':
          return Array.isArray(rule.value) && rule.value.includes(value)
        case 'not_in':
          return Array.isArray(rule.value) && !rule.value.includes(value)
        case 'greater_than':
          return Number(value) > Number(rule.value)
        case 'less_than':
          return Number(value) < Number(rule.value)
        default:
          return false
      }
    })
  }
  /**
   * Assign variant based on weights
   */
  private assignVariant(test: ABTestConfig, userId: string): ABTestVariant | null {
    const hash = this.hashUserId(userId, test.id)
    let cumulative = 0
    for (const variant of test.variants) {
      cumulative += variant.weight
      if (hash < cumulative) {
        return variant
      }
    }
    return test.variants[test.variants.length - 1] || null
  }
  /**
   * Hash user ID to get consistent random number 0-100
   */
  private hashUserId(userId: string, salt: string): number {
    // Use a simple hash function for browser compatibility
    let hash = 0
    const str = userId + salt
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100
  }
  /**
   * Track variant assignment
   */
  private trackAssignment(test: ABTestConfig, variant: ABTestVariant, context: UserContext) {
    analytics.trackABTest(test.id, variant.id, 'assigned', {
      test_name: test.name,
      variant_name: variant.name,
      user_id: context.userId,
      session_id: context.sessionId,
      ...variant.properties,
    })
    // Store result
    const result: ABTestResult = {
      testId: test.id,
      variantId: variant.id,
      variantName: variant.name,
      userId: context.userId,
      sessionId: context.sessionId,
      assignedAt: new Date(),
      metadata: context.properties,
    }
    if (!this.results.has(test.id)) {
      this.results.set(test.id, [])
    }
    this.results.get(test.id)!.push(result)
  }
  /**
   * Track conversion for a test
   */
  trackConversion(
    testId: string,
    metricId: string,
    context: UserContext,
    value?: number
  ): void {
    const test = this.tests.get(testId)
    if (!test) return
    const userId = context.userId || context.sessionId
    const userTests = this.userAssignments.get(userId)
    const variantId = userTests?.get(testId)
    if (!variantId) return
    const variant = test.variants.find(v => v.id === variantId)
    if (!variant) return
    const metric = test.successMetrics.find(m => m.id === metricId)
    if (!metric) return
    // Track conversion
    analytics.trackABTest(test.id, variant.id, 'converted', {
      test_name: test.name,
      variant_name: variant.name,
      metric_id: metricId,
      metric_name: metric.name,
      conversion_value: value,
      user_id: context.userId,
      session_id: context.sessionId,
    })
    // Update results
    const results = this.results.get(testId) || []
    const result = results.find(
      r => r.userId === userId || r.sessionId === context.sessionId
    )
    if (result) {
      result.converted = true
      result.conversionValue = value
    }
  }
  /**
   * Get test statistics
   */
  getTestStats(testId: string): VariantStats[] {
    const test = this.tests.get(testId)
    if (!test) return []
    const results = this.results.get(testId) || []
    const stats: VariantStats[] = []
    for (const variant of test.variants) {
      const variantResults = results.filter(r => r.variantId === variant.id)
      const conversions = variantResults.filter(r => r.converted).length
      const totalValue = variantResults
        .filter(r => r.converted)
        .reduce((sum, r) => sum + (r.conversionValue || 0), 0)
      const variantStat: VariantStats = {
        variantId: variant.id,
        variantName: variant.name,
        participants: variantResults.length,
        conversions,
        conversionRate: variantResults.length > 0 ? conversions / variantResults.length : 0,
        averageValue: conversions > 0 ? totalValue / conversions : 0,
      }
      stats.push(variantStat)
    }
    // Calculate statistical significance
    const control = stats.find(s => {
      const variant = test.variants.find(v => v.id === s.variantId)
      return variant?.isControl
    })
    if (control) {
      for (const stat of stats) {
        if (stat.variantId === control.variantId) continue
        const isSignificant = StatisticalCalculator.isSignificant(
          control,
          stat,
          test.confidenceLevel || 95
        )
        if (isSignificant) {
          stat.confidence = test.confidenceLevel || 95
          stat.uplift = ((stat.conversionRate - control.conversionRate) / control.conversionRate) * 100
        }
      }
    }
    // Determine winner if automatic mode
    if (test.winnerSelectionMode === 'automatic' && test.minimumSampleSize) {
      const hasEnoughData = stats.every(s => s.participants >= (test.minimumSampleSize || 0))
      if (hasEnoughData) {
        const significantVariants = stats
          .filter(s => s.confidence && s.confidence >= (test.confidenceLevel || 95))
          .sort((a, b) => (b.uplift || 0) - (a.uplift || 0))
        if (significantVariants.length > 0) {
          significantVariants[0].isWinner = true
        }
      }
    }
    return stats
  }
  /**
   * Complete a test
   */
  completeTest(testId: string, winnerId?: string): void {
    const test = this.tests.get(testId)
    if (!test) return
    test.status = 'completed'
    test.endDate = new Date()
    if (winnerId) {
      const winner = test.variants.find(v => v.id === winnerId)
      if (winner) {
        test.metadata = {
          ...test.metadata,
          winnerId,
          winnerName: winner.name,
          completedAt: new Date().toISOString(),
        }
      }
    }
    this.saveTests()
    // Track completion
    analytics.track('ab_test_completed', {
      test_id: testId,
      test_name: test.name,
      winner_id: winnerId,
      duration_days: test.startDate 
        ? Math.floor((new Date().getTime() - test.startDate.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    })
  }
  /**
   * Get all tests
   */
  getAllTests(): ABTestConfig[] {
    return Array.from(this.tests.values())
  }
  /**
   * Get active tests
   */
  getActiveTests(): ABTestConfig[] {
    return this.getAllTests().filter(t => t.status === 'active')
  }
  /**
   * Update test status
   */
  updateTestStatus(testId: string, status: ABTestConfig['status']): void {
    const test = this.tests.get(testId)
    if (!test) return
    test.status = status
    if (status === 'active' && !test.startDate) {
      test.startDate = new Date()
    }
    this.saveTests()
  }
  /**
   * Clear test data (for testing)
   */
  clearTestData(testId: string): void {
    this.results.delete(testId)
    this.userAssignments.forEach(assignments => {
      assignments.delete(testId)
    })
    this.saveTests()
  }
  /**
   * Calculate sample size for test
   */
  calculateSampleSize(
    baselineRate: number,
    minimumEffect: number,
    confidenceLevel: number = 95
  ): number {
    return StatisticalCalculator.calculateSampleSize(
      baselineRate,
      minimumEffect,
      confidenceLevel
    )
  }
}
// Singleton instance
export const abTestManager = ABTestManager.getInstance()
// Feature flags using A/B testing framework
export class FeatureFlags {
  /**
   * Check if feature is enabled for user
   */
  static isEnabled(featureName: string, context: UserContext): boolean {
    // Create a simple A/B test for feature flag
    const test: ABTestConfig = {
      id: `feature_${featureName}`,
      name: `Feature Flag: ${featureName}`,
      status: 'active',
      variants: [
        { id: 'off', name: 'Off', weight: 50, isControl: true },
        { id: 'on', name: 'On', weight: 50 },
      ],
      successMetrics: [],
    }
    const variant = abTestManager.getVariant(test.id, context)
    return variant?.id === 'on'
  }
  /**
   * Get feature value with variants
   */
  static getValue<T>(
    featureName: string,
    values: Record<string, T>,
    context: UserContext
  ): T | null {
    const variants = Object.entries(values).map(([key, value], index) => ({
      id: key,
      name: key,
      weight: 100 / Object.keys(values).length,
      isControl: index === 0,
      properties: { value },
    }))
    const test: ABTestConfig = {
      id: `feature_value_${featureName}`,
      name: `Feature Value: ${featureName}`,
      status: 'active',
      variants,
      successMetrics: [],
    }
    const variant = abTestManager.getVariant(test.id, context)
    return variant?.properties?.value || null
  }
}
// Gradual rollout helper
export class GradualRollout {
  /**
   * Check if user is in rollout percentage
   */
  static isEnabled(
    rolloutName: string,
    percentage: number,
    userId?: string
  ): boolean {
    // Use same hash function as ABTestManager for consistency
    let hash = 0
    const str = (userId || 'anonymous') + rolloutName
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    const hashValue = Math.abs(hash) % 100
    return hashValue < percentage
  }
  /**
   * Create rollout test
   */
  static createRolloutTest(
    name: string,
    percentage: number,
    targetingRules?: TargetingRule[]
  ): ABTestConfig {
    return {
      id: `rollout_${name}`,
      name: `Gradual Rollout: ${name}`,
      status: 'active',
      variants: [
        { id: 'excluded', name: 'Excluded', weight: 100 - percentage, isControl: true },
        { id: 'included', name: 'Included', weight: percentage },
      ],
      targetingRules,
      successMetrics: [],
      trafficAllocation: 100,
    }
  }
}