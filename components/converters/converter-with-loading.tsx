"use client"

import { Suspense } from "react"
import { ConverterSkeleton } from "@/components/ui/loading"
import { ErrorBoundary, ConverterErrorFallback } from "@/components/ui/error-boundary"

interface ConverterWithLoadingProps {
  children: React.ReactNode
}

export function ConverterWithLoading({ children }: ConverterWithLoadingProps) {
  return (
    <ErrorBoundary fallback={ConverterErrorFallback}>
      <Suspense fallback={<ConverterSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}