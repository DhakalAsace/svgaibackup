/**
 * Hook for funnel tracking in components
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import { 
  getJourneyTracker,
  trackToolVisit,
  trackFeatureDiscovery,
  trackUpgradeIntent,
  trackPremiumConversion,
  CTATracker,
  CTAVariant,
  getFunnelMetrics,
  FunnelMetrics
} from '@/lib/funnel-tracking'

interface UseFunnelTrackingOptions {
  tool: string
  userId?: string
}

export function useFunnelTracking({ tool, userId }: UseFunnelTrackingOptions) {
  const pathname = usePathname()
  const trackerInitialized = useRef(false)

  useEffect(() => {
    if (!trackerInitialized.current) {
      // Initialize journey tracking for this session
      const tracker = getJourneyTracker(userId)
      if (tracker) {
        trackToolVisit(tool)
        trackerInitialized.current = true
      }
    }
  }, [tool, userId])

  // Track page changes within the tool
  useEffect(() => {
    if (trackerInitialized.current) {
      const tracker = getJourneyTracker()
      tracker?.trackStep('page_view', { path: pathname })
    }
  }, [pathname])

  const trackFeature = useCallback((feature: string, metadata?: Record<string, any>) => {
    trackFeatureDiscovery(feature)
    const tracker = getJourneyTracker()
    tracker?.trackStep('feature_used', { feature, ...metadata })
  }, [])

  const trackError = useCallback((error: string, metadata?: Record<string, any>) => {
    const tracker = getJourneyTracker()
    tracker?.trackStep('error_occurred', { error, ...metadata })
  }, [])

  const trackUpgrade = useCallback((feature: string, trigger: string) => {
    trackUpgradeIntent(feature, trigger)
  }, [])

  const trackConversion = useCallback(async (feature: string, value: number) => {
    await trackPremiumConversion(feature, value)
  }, [])

  return {
    trackFeature,
    trackError,
    trackUpgrade,
    trackConversion
  }
}

// Hook for CTA A/B testing
interface UseCTATestingOptions {
  testName: string
  variants: CTAVariant[]
  location: string
}

export function useCTATesting({ testName, variants, location }: UseCTATestingOptions) {
  const trackerRef = useRef<CTATracker | null>(null)
  const impressionTracked = useRef(false)

  useEffect(() => {
    // Initialize CTA tracker
    if (!trackerRef.current) {
      trackerRef.current = new CTATracker(testName, variants)
    }
  }, [testName, variants])

  // Track impression when component mounts
  useEffect(() => {
    if (!impressionTracked.current && trackerRef.current) {
      trackerRef.current.trackImpression(location)
      impressionTracked.current = true
    }
  }, [location])

  const trackClick = useCallback(() => {
    trackerRef.current?.trackClick(location)
  }, [location])

  const variant = trackerRef.current?.getVariant() || variants[0]

  return {
    variant,
    trackClick,
    metrics: trackerRef.current?.getMetrics()
  }
}

// Hook for monitoring funnel performance
interface UseFunnelMetricsOptions {
  tool: string
  timeRange?: '24h' | '7d' | '30d'
  refreshInterval?: number // milliseconds
}

export function useFunnelMetrics({ 
  tool, 
  timeRange = '7d',
  refreshInterval = 60000 // 1 minute
}: UseFunnelMetricsOptions) {
  const [metrics, setMetrics] = useState<FunnelMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getFunnelMetrics(tool, timeRange)
      setMetrics(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [tool, timeRange])

  useEffect(() => {
    fetchMetrics()

    // Set up refresh interval
    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchMetrics, refreshInterval])

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics
  }
}

// Hook for tracking specific conversion goals
interface ConversionGoal {
  id: string
  name: string
  value: number
  conditions: {
    requiredSteps?: string[]
    minDuration?: number
    maxDuration?: number
  }
}

export function useConversionGoals(goals: ConversionGoal[]) {
  const completedGoals = useRef<Set<string>>(new Set())

  const checkGoals = useCallback(() => {
    const tracker = getJourneyTracker()
    if (!tracker) return

    const journey = tracker.getJourneySummary()
    const completedSteps = journey.steps.map(s => s.step)

    goals.forEach(goal => {
      // Skip if already completed
      if (completedGoals.current.has(goal.id)) return

      // Check required steps
      if (goal.conditions.requiredSteps) {
        const hasAllSteps = goal.conditions.requiredSteps.every(
          step => completedSteps.includes(step)
        )
        if (!hasAllSteps) return
      }

      // Check duration constraints
      if (goal.conditions.minDuration && journey.duration < goal.conditions.minDuration) {
        return
      }
      if (goal.conditions.maxDuration && journey.duration > goal.conditions.maxDuration) {
        return
      }

      // Goal completed!
      completedGoals.current.add(goal.id)
      tracker.trackStep('goal_completed', {
        goal_id: goal.id,
        goal_name: goal.name,
        goal_value: goal.value
      })
    })
  }, [goals])

  // Check goals whenever significant events occur
  useEffect(() => {
    const interval = setInterval(checkGoals, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [checkGoals])

  return {
    checkGoals,
    completedGoals: Array.from(completedGoals.current)
  }
}