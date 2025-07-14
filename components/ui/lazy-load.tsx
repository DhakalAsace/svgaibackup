"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number | number[]
  className?: string
}

export function LazyLoad({
  children,
  fallback = <div className="h-96" />,
  rootMargin = "100px",
  threshold = 0.1,
  className,
}: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [rootMargin, threshold])
  
  return (
    <div ref={ref} className={cn("min-h-[1px]", className)}>
      {isInView ? children : fallback}
    </div>
  )
}