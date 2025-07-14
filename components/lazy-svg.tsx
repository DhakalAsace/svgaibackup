"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LazySVGProps {
  src?: string
  content?: string
  className?: string
  placeholderClassName?: string
  onLoad?: (content: string) => void
  onError?: (error: Error) => void
  priority?: boolean
  placeholder?: React.ReactNode
}

export default function LazySVG({
  src,
  content: providedContent,
  className,
  placeholderClassName,
  onLoad,
  onError,
  priority = false,
  placeholder,
}: LazySVGProps) {
  const [isLoading, setIsLoading] = useState(!providedContent)
  const [isInView, setIsInView] = useState(false)
  const [svgContent, setSvgContent] = useState(providedContent || "")
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Set up intersection observer
  useEffect(() => {
    if (priority || providedContent) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.01,
        rootMargin: "100px",
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority, providedContent])

  // Load SVG content when in view
  useEffect(() => {
    if (!isInView || !src || svgContent) return

    let cancelled = false

    const loadSVG = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(src)
        
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.status}`)
        }

        const text = await response.text()
        
        if (!cancelled) {
          setSvgContent(text)
          setIsLoading(false)
          onLoad?.(text)
        }
      } catch (error) {
        if (!cancelled) {
          setHasError(true)
          setIsLoading(false)
          onError?.(error as Error)
        }
      }
    }

    loadSVG()

    return () => {
      cancelled = true
    }
  }, [isInView, src, svgContent, onLoad, onError])

  // Render placeholder
  if (!isInView || isLoading) {
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {placeholder || (
          <Skeleton className={cn("w-full h-full", placeholderClassName)} />
        )}
      </div>
    )
  }

  // Render error state
  if (hasError) {
    return (
      <div 
        ref={containerRef} 
        className={cn(
          "relative flex items-center justify-center bg-muted/20 rounded",
          className
        )}
      >
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    )
  }

  // Render SVG content
  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      role="img"
      aria-label="SVG image"
    />
  )
}