"use client"

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Only load critical providers immediately
const AuthProvider = dynamic(() => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })))
const ToastProvider = dynamic(() => import('@/components/ui/toast').then(mod => ({ default: mod.ToastProvider })))

// Lazy load non-critical providers
const CreditProvider = dynamic(() => import('@/contexts/CreditContext').then(mod => ({ default: mod.CreditProvider })), { ssr: false })
const ThemeProvider = dynamic(() => import('next-themes').then(mod => ({ default: mod.ThemeProvider })), { ssr: false })

export function ProvidersLite({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={children}>
            <CreditProvider>
              {children}
            </CreditProvider>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </Suspense>
  )
}