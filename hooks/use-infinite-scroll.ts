"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  hasMore: boolean
  onLoadMore: () => void
}

export function useInfiniteScroll({
  threshold = 0.1,
  rootMargin = "100px",
  hasMore,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      await onLoadMore()
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, onLoadMore])

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, threshold, rootMargin, handleLoadMore])

  return {
    loadMoreRef,
    isLoading,
  }
}