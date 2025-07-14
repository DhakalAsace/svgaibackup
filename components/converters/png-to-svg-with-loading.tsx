"use client"

import dynamic from "next/dynamic"
import { ConverterSkeleton } from "@/components/ui/loading"
import { ErrorBoundary, ConverterErrorFallback } from "@/components/ui/error-boundary"

// Dynamically import the converter with loading state
const PngToSvgConverter = dynamic(
  () => import("./png-to-svg-specific").then(mod => ({ default: mod.default })),
  {
    loading: () => <ConverterSkeleton />,
    ssr: false // Disable SSR for client-side converters
  }
)

export default function PngToSvgWithLoading() {
  return (
    <ErrorBoundary fallback={ConverterErrorFallback}>
      <PngToSvgConverter />
    </ErrorBoundary>
  )
}