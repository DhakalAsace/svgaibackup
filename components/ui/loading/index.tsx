"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

// Spinner variations
export function Spinner({ className, size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  }
  
  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  )
}

// Loading overlay with spinner
export function LoadingOverlay({ 
  message, 
  fullScreen = false 
}: { 
  message?: string; 
  fullScreen?: boolean 
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
      fullScreen ? "fixed inset-0 z-50" : "absolute inset-0"
    )}>
      <Spinner size="lg" />
      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}

// Progress indicator
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full bg-muted rounded-full overflow-hidden", className)}>
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// Shimmer effect component
export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

// Converter UI Skeleton
export function ConverterSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      {/* Upload area skeleton */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
        <Skeleton className="h-12 w-12 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
      
      {/* Options skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      
      {/* Convert button skeleton */}
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

// Gallery Grid Skeleton
export function GalleryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

// Blog Post Skeleton
export function BlogPostSkeleton() {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Hero image */}
      <Skeleton className="h-64 w-full rounded-lg" />
      
      {/* Title and meta */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full my-6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </article>
  )
}

// Navigation Menu Skeleton
export function NavMenuSkeleton() {
  return (
    <nav className="flex items-center space-x-8">
      <Skeleton className="h-8 w-24" />
      <div className="hidden md:flex items-center space-x-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </nav>
  )
}

// Image Loading Skeleton with fade-in
export function ImageSkeleton({ 
  className,
  aspectRatio = "square"
}: { 
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | string;
}) {
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video", 
    portrait: "aspect-[3/4]"
  }
  
  return (
    <div className={cn(
      "relative overflow-hidden bg-muted rounded-lg",
      typeof aspectRatio === "string" && aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
      className
    )}>
      <Shimmer className="absolute inset-0" />
    </div>
  )
}

// Table Loading Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-12 m-2" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-10 m-2" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Card Loading Skeleton
export function CardSkeleton({ 
  hasImage = true,
  hasActions = false 
}: { 
  hasImage?: boolean;
  hasActions?: boolean;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      {hasImage && <Skeleton className="h-48 w-full rounded-md" />}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      {hasActions && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  )
}

// Form Loading Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

// Dashboard Stats Skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  )
}