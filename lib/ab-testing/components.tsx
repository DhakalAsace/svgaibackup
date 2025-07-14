/**
 * React Components for A/B Testing
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { abTestManager, ABTestVariant, UserContext, FeatureFlags, GradualRollout } from './index'
import { usePathname } from 'next/navigation'

// A/B Test Context
interface ABTestContextValue {
  userContext: UserContext
  getVariant: (testId: string) => ABTestVariant | null
  trackConversion: (testId: string, metricId: string, value?: number) => void
  isFeatureEnabled: (featureName: string) => boolean
  getFeatureValue: <T>(featureName: string, values: Record<string, T>) => T | null
  isInRollout: (rolloutName: string, percentage: number) => boolean
}

const ABTestContext = createContext<ABTestContextValue | null>(null)

// A/B Test Provider
interface ABTestProviderProps {
  children: React.ReactNode
  userId?: string
  userProperties?: Record<string, any>
  device?: UserContext['device']
  location?: UserContext['location']
}

export function ABTestProvider({
  children,
  userId,
  userProperties,
  device,
  location,
}: ABTestProviderProps) {
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return ''
    
    let id = sessionStorage.getItem('ab_session_id')
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('ab_session_id', id)
    }
    return id
  })

  const userContext: UserContext = {
    userId,
    sessionId,
    properties: userProperties,
    device,
    location,
  }

  const getVariant = (testId: string) => {
    return abTestManager.getVariant(testId, userContext)
  }

  const trackConversion = (testId: string, metricId: string, value?: number) => {
    abTestManager.trackConversion(testId, metricId, userContext, value)
  }

  const isFeatureEnabled = (featureName: string) => {
    return FeatureFlags.isEnabled(featureName, userContext)
  }

  const getFeatureValue = <T,>(featureName: string, values: Record<string, T>) => {
    return FeatureFlags.getValue(featureName, values, userContext)
  }

  const isInRollout = (rolloutName: string, percentage: number) => {
    return GradualRollout.isEnabled(rolloutName, percentage, userId)
  }

  const value: ABTestContextValue = {
    userContext,
    getVariant,
    trackConversion,
    isFeatureEnabled,
    getFeatureValue,
    isInRollout,
  }

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  )
}

// useABTest hook
export function useABTest(testId: string) {
  const context = useContext(ABTestContext)
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider')
  }

  const [variant, setVariant] = useState<ABTestVariant | null>(null)

  useEffect(() => {
    const v = context.getVariant(testId)
    setVariant(v)
  }, [testId, context])

  const trackConversion = (metricId: string, value?: number) => {
    context.trackConversion(testId, metricId, value)
  }

  return {
    variant,
    isLoading: variant === null,
    trackConversion,
  }
}

// useFeatureFlag hook
export function useFeatureFlag(featureName: string) {
  const context = useContext(ABTestContext)
  if (!context) {
    throw new Error('useFeatureFlag must be used within ABTestProvider')
  }

  return context.isFeatureEnabled(featureName)
}

// useFeatureValue hook
export function useFeatureValue<T>(
  featureName: string,
  values: Record<string, T>
): T | null {
  const context = useContext(ABTestContext)
  if (!context) {
    throw new Error('useFeatureValue must be used within ABTestProvider')
  }

  return context.getFeatureValue(featureName, values)
}

// useRollout hook
export function useRollout(rolloutName: string, percentage: number) {
  const context = useContext(ABTestContext)
  if (!context) {
    throw new Error('useRollout must be used within ABTestProvider')
  }

  return context.isInRollout(rolloutName, percentage)
}

// A/B Test Component
interface ABTestProps {
  testId: string
  children: (variant: ABTestVariant | null) => React.ReactNode
  fallback?: React.ReactNode
}

export function ABTest({ testId, children, fallback }: ABTestProps) {
  const { variant, isLoading } = useABTest(testId)

  if (isLoading && fallback) {
    return <>{fallback}</>
  }

  return <>{children(variant)}</>
}

// Variant Component
interface VariantProps {
  testId: string
  variantId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Variant({ testId, variantId, children, fallback }: VariantProps) {
  const { variant } = useABTest(testId)

  if (variant?.id === variantId) {
    return <>{children}</>
  }

  return <>{fallback || null}</>
}

// Feature Flag Component
interface FeatureFlagProps {
  flag: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlag({ flag, children, fallback }: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(flag)

  return <>{isEnabled ? children : (fallback || null)}</>
}

// Rollout Component
interface RolloutProps {
  name: string
  percentage: number
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Rollout({ name, percentage, children, fallback }: RolloutProps) {
  const isEnabled = useRollout(name, percentage)

  return <>{isEnabled ? children : (fallback || null)}</>
}

// Conversion Tracking Component
interface ConversionTrackerProps {
  testId: string
  metricId: string
  value?: number
  children: React.ReactNode
  trigger?: 'click' | 'view' | 'submit'
}

export function ConversionTracker({
  testId,
  metricId,
  value,
  children,
  trigger = 'click',
}: ConversionTrackerProps) {
  const { trackConversion } = useABTest(testId)
  const pathname = usePathname()

  useEffect(() => {
    if (trigger === 'view') {
      trackConversion(metricId, value)
    }
  }, [trigger, metricId, value, trackConversion, pathname])

  const handleClick = () => {
    if (trigger === 'click') {
      trackConversion(metricId, value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (trigger === 'submit') {
      trackConversion(metricId, value)
    }
  }

  if (React.isValidElement(children)) {
    const props: any = {}
    
    if (trigger === 'click') props.onClick = handleClick
    if (trigger === 'submit') props.onSubmit = handleSubmit

    return React.cloneElement(children, props)
  }

  return <>{children}</>
}

// Multi-variant Test Component
interface MultiVariantTestProps {
  testId: string
  children: Record<string, React.ReactNode>
  fallback?: React.ReactNode
}

export function MultiVariantTest({ testId, children, fallback }: MultiVariantTestProps) {
  const { variant } = useABTest(testId)

  if (!variant) {
    return <>{fallback || null}</>
  }

  return <>{children[variant.id] || fallback || null}</>
}

// Test Preview Component (for QA)
interface TestPreviewProps {
  children: React.ReactNode
}

export function TestPreview({ children }: TestPreviewProps) {
  const [previewVariant, setPreviewVariant] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const variant = params.get('ab_preview')
      setPreviewVariant(variant)
    }
  }, [])

  if (!previewVariant) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 bg-yellow-500 text-black px-2 py-1 text-xs z-50">
        A/B Preview: {previewVariant}
      </div>
      {children}
    </div>
  )
}

// Experiment Debugger Component
interface ExperimentDebuggerProps {
  show?: boolean
}

export function ExperimentDebugger({ show = false }: ExperimentDebuggerProps) {
  const context = useContext(ABTestContext)
  const [isVisible, setIsVisible] = useState(show)
  const [experiments, setExperiments] = useState<Array<{ test: string; variant: string }>>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('ab_debug') === 'true') {
        setIsVisible(true)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible && context) {
      // Get all active experiments for this user
      const activeTests = abTestManager.getActiveTests()
      const userExperiments = activeTests.map(test => {
        const variant = context.getVariant(test.id)
        return {
          test: test.name,
          variant: variant?.name || 'Not assigned',
        }
      })
      setExperiments(userExperiments)
    }
  }, [isVisible, context])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">A/B Test Debug</h3>
      <div className="text-sm space-y-1">
        <div>User ID: {context?.userContext.userId || 'Anonymous'}</div>
        <div>Session ID: {context?.userContext.sessionId}</div>
        <hr className="my-2 border-gray-600" />
        <div className="font-semibold">Active Experiments:</div>
        {experiments.map((exp, i) => (
          <div key={i} className="pl-2">
            {exp.test}: <span className="text-green-400">{exp.variant}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="mt-2 text-xs underline"
      >
        Close
      </button>
    </div>
  )
}