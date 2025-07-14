/**
 * Funnel Optimization Tracking
 * Tracks user journey from free tools to premium AI generation
 */

import { track } from '@vercel/analytics'
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from './supabase'

export interface FunnelStep {
  step: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface UserJourney {
  sessionId: string
  userId?: string
  startTime: Date
  steps: FunnelStep[]
  currentTool?: string
  referrer?: string
  device?: string
  browser?: string
}

export interface FunnelMetrics {
  totalSessions: number
  uniqueUsers: number
  conversions: number
  conversionRate: number
  avgTimeToConversion: number
  dropoffByStep: Record<string, number>
  topPaths: string[][]
  ctaPerformance: Record<string, {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
  }>
}

// User journey tracking
class UserJourneyTracker {
  private journey: UserJourney
  private supabase = createBrowserClient()

  constructor(sessionId: string, userId?: string) {
    this.journey = {
      sessionId,
      userId,
      startTime: new Date(),
      steps: [],
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      device: this.getDeviceType(),
      browser: this.getBrowserInfo()
    }
    
    this.trackStep('session_start')
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getBrowserInfo(): string {
    if (typeof navigator === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'chrome'
    if (userAgent.includes('Safari')) return 'safari'
    if (userAgent.includes('Firefox')) return 'firefox'
    if (userAgent.includes('Edge')) return 'edge'
    return 'other'
  }

  trackStep(step: string, metadata?: Record<string, any>) {
    const funnelStep: FunnelStep = {
      step,
      timestamp: new Date(),
      metadata
    }
    
    this.journey.steps.push(funnelStep)
    
    // Track in analytics
    track('funnel_step', {
      step,
      tool: this.journey.currentTool || 'unknown',
      session_id: this.journey.sessionId,
      step_number: this.journey.steps.length,
      ...(metadata || {})
    })
  }

  setCurrentTool(tool: string) {
    this.journey.currentTool = tool
    this.trackStep('tool_switched', { tool })
  }

  async trackConversion(toFeature: string, value?: number) {
    this.trackStep('conversion', { 
      to_feature: toFeature, 
      value,
      journey_duration: Date.now() - this.journey.startTime.getTime()
    })
    
    // Store conversion in database
    await this.supabase
      .from('funnel_conversions')
      .insert({
        session_id: this.journey.sessionId,
        user_id: this.journey.userId,
        from_tool: this.journey.currentTool,
        to_feature: toFeature,
        journey_steps: this.journey.steps.map(s => s.step),
        journey_duration: Date.now() - this.journey.startTime.getTime(),
        device: this.journey.device,
        browser: this.journey.browser,
        referrer: this.journey.referrer,
        metadata: { value }
      })
  }

  getJourneySummary() {
    return {
      ...this.journey,
      duration: Date.now() - this.journey.startTime.getTime(),
      stepCount: this.journey.steps.length,
      hasConverted: this.journey.steps.some(s => s.step === 'conversion')
    }
  }
}

// CTA tracking with A/B testing
export interface CTAVariant {
  id: string
  text: string
  style: 'primary' | 'secondary' | 'ghost' | 'link'
  size: 'sm' | 'md' | 'lg'
  icon?: boolean
  position?: 'inline' | 'floating' | 'modal'
}

export class CTATracker {
  private variant: CTAVariant
  private testName: string
  private impressions = 0
  private clicks = 0

  constructor(testName: string, variants: CTAVariant[]) {
    this.testName = testName
    // Select variant based on session ID for consistency
    const sessionId = this.getSessionId()
    const variantIndex = this.hashCode(sessionId) % variants.length
    this.variant = variants[variantIndex]
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('funnel_session_id')
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('funnel_session_id', sessionId)
    }
    return sessionId
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  trackImpression(location: string) {
    this.impressions++
    
    track('cta_impression', {
      test_name: this.testName,
      variant: this.variant.id,
      location
    })
  }

  trackClick(location: string) {
    this.clicks++
    const ctr = this.clicks / this.impressions
    
    track('cta_click', {
      test_name: this.testName,
      variant: this.variant.id,
      location,
      ctr,
      impressions: this.impressions
    })
  }

  getVariant(): CTAVariant {
    return this.variant
  }

  getMetrics() {
    return {
      variant: this.variant.id,
      impressions: this.impressions,
      clicks: this.clicks,
      ctr: this.impressions > 0 ? this.clicks / this.impressions : 0
    }
  }
}

// Funnel analytics
export async function getFunnelMetrics(
  tool: string,
  timeRange: '24h' | '7d' | '30d' = '7d'
): Promise<FunnelMetrics> {
  const supabase = createServerClient()
  
  // Calculate time range
  const startDate = new Date()
  switch (timeRange) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24)
      break
    case '7d':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
  }
  
  // Query funnel data
  const { data: conversions } = await supabase
    .from('funnel_conversions')
    .select('*')
    .eq('from_tool', tool)
    .gte('created_at', startDate.toISOString())
  
  const { data: sessions } = await supabase
    .from('monitoring_metrics')
    .select('session_id, user_id')
    .eq('tool', tool)
    .eq('metric', 'session_start')
    .gte('created_at', startDate.toISOString())
  
  // Calculate metrics
  const totalSessions = sessions?.length || 0
  const uniqueUsers = new Set(sessions?.map((s: any) => s.user_id).filter(Boolean)).size
  const conversionCount = conversions?.length || 0
  const conversionRate = totalSessions > 0 ? conversionCount / totalSessions : 0
  
  // Calculate average time to conversion
  const conversionTimes = conversions?.map((c: any) => c.journey_duration) || []
  const avgTimeToConversion = conversionTimes.length > 0
    ? conversionTimes.reduce((sum: number, time: number) => sum + time, 0) / conversionTimes.length
    : 0
  
  // Calculate drop-off by step
  const dropoffByStep: Record<string, number> = {}
  // This would need more complex analysis of journey steps
  
  // Get top conversion paths
  const topPaths = conversions
    ?.map((c: any) => c.journey_steps)
    .sort((a: any, b: any) => b.length - a.length)
    .slice(0, 5) || []
  
  // Mock CTA performance data - in production, this would come from real tracking
  const ctaPerformance = {
    'floating-cta': {
      impressions: 1000,
      clicks: 120,
      ctr: 0.12,
      conversions: 45
    },
    'inline-cta': {
      impressions: 2500,
      clicks: 200,
      ctr: 0.08,
      conversions: 60
    },
    'error-prompt': {
      impressions: 300,
      clicks: 90,
      ctr: 0.30,
      conversions: 35
    }
  }
  
  return {
    totalSessions,
    uniqueUsers,
    conversions: conversionCount,
    conversionRate,
    avgTimeToConversion,
    dropoffByStep,
    topPaths,
    ctaPerformance
  }
}

// Path analysis
export async function analyzeUserPaths(
  tool: string,
  limit: number = 10
): Promise<Array<{
  path: string[]
  count: number
  conversionRate: number
  avgDuration: number
}>> {
  const supabase = createServerClient()
  
  const { data: journeys } = await supabase
    .from('funnel_conversions')
    .select('journey_steps, journey_duration, to_feature')
    .eq('from_tool', tool)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (!journeys) return []
  
  // Group by path
  const pathMap = new Map<string, {
    count: number
    conversions: number
    totalDuration: number
  }>()
  
  journeys.forEach((journey: any) => {
    const pathKey = journey.journey_steps.join(' → ')
    const existing = pathMap.get(pathKey) || {
      count: 0,
      conversions: 0,
      totalDuration: 0
    }
    
    existing.count++
    if (journey.to_feature) existing.conversions++
    existing.totalDuration += journey.journey_duration
    
    pathMap.set(pathKey, existing)
  })
  
  // Convert to array and sort by count
  return Array.from(pathMap.entries())
    .map(([path, data]) => ({
      path: path.split(' → '),
      count: data.count,
      conversionRate: data.conversions / data.count,
      avgDuration: data.totalDuration / data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// Create journey tracker singleton
let journeyTracker: UserJourneyTracker | null = null

export function getJourneyTracker(userId?: string): UserJourneyTracker {
  if (!journeyTracker && typeof window !== 'undefined') {
    const sessionId = sessionStorage.getItem('funnel_session_id') || 
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('funnel_session_id', sessionId)
    journeyTracker = new UserJourneyTracker(sessionId, userId)
  }
  return journeyTracker!
}

// Conversion tracking helpers
export function trackToolVisit(tool: string) {
  const tracker = getJourneyTracker()
  tracker?.setCurrentTool(tool)
  tracker?.trackStep('tool_visited', { tool })
}

export function trackFeatureDiscovery(feature: string) {
  const tracker = getJourneyTracker()
  tracker?.trackStep('feature_discovered', { feature })
}

export function trackUpgradeIntent(feature: string, trigger: string) {
  const tracker = getJourneyTracker()
  tracker?.trackStep('upgrade_intent', { feature, trigger })
}

export async function trackPremiumConversion(feature: string, value: number) {
  const tracker = getJourneyTracker()
  await tracker?.trackConversion(feature, value)
}