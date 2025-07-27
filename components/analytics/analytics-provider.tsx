'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useAuth } from '@/contexts/AuthContext'

interface AnalyticsContextType {
  userId?: string
  userType: 'free' | 'paid' | 'trial'
  isInitialized: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  userType: 'free',
  isInitialized: false,
})

export const useAnalyticsContext = () => useContext(AnalyticsContext)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Determine user type (for now, all users are free)
  const userType = 'free'
  
  // Initialize analytics with user context
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      setIsInitialized(true)
    }
  }, [user, userType, isInitialized])
  
  return (
    <AnalyticsContext.Provider value={{ userId: user?.id, userType, isInitialized }}>
      <Analytics />
      <SpeedInsights />
      {children}
    </AnalyticsContext.Provider>
  )
}