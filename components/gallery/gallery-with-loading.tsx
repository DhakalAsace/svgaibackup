"use client"

import { Suspense } from "react"
import { GalleryGridSkeleton } from "@/components/ui/loading"
import { ErrorBoundary, GalleryErrorFallback } from "@/components/ui/error-boundary"

interface GalleryWithLoadingProps {
  children: React.ReactNode
  itemCount?: number
}

export function GalleryWithLoading({ children, itemCount = 12 }: GalleryWithLoadingProps) {
  return (
    <ErrorBoundary fallback={GalleryErrorFallback}>
      <Suspense fallback={<GalleryGridSkeleton count={itemCount} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}