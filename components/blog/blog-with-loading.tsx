"use client"

import { Suspense } from "react"
import { BlogPostSkeleton, CardSkeleton } from "@/components/ui/loading"
import { ErrorBoundary, DefaultErrorFallback } from "@/components/ui/error-boundary"

interface BlogWithLoadingProps {
  children: React.ReactNode
  variant?: "list" | "post"
}

export function BlogWithLoading({ children, variant = "post" }: BlogWithLoadingProps) {
  const LoadingSkeleton = variant === "post" ? BlogPostSkeleton : BlogListSkeleton
  
  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      <Suspense fallback={<LoadingSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} hasImage />
      ))}
    </div>
  )
}