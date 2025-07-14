"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface VirtualizedGalleryProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemsPerRow?: number
  rowHeight: number
  gap?: number
  className?: string
  overscan?: number
}

export default function VirtualizedGallery<T>({
  items,
  renderItem,
  itemsPerRow = 4,
  rowHeight,
  gap = 24,
  className,
  overscan = 3,
}: VirtualizedGalleryProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Calculate derived values
  const totalRows = Math.ceil(items.length / itemsPerRow)
  const totalHeight = totalRows * rowHeight + (totalRows - 1) * gap

  // Calculate visible range
  const startRow = Math.max(0, Math.floor(scrollTop / (rowHeight + gap)) - overscan)
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / (rowHeight + gap)) + overscan
  )

  // Get items for visible rows
  const visibleItems: { item: T; index: number; row: number; col: number }[] = []
  for (let row = startRow; row < endRow; row++) {
    for (let col = 0; col < itemsPerRow; col++) {
      const index = row * itemsPerRow + col
      if (index < items.length) {
        visibleItems.push({
          item: items[index],
          index,
          row,
          col,
        })
      }
    }
  }

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop)
    }
  }, [])

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ height: "100%" }}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
      >
        {/* Virtual spacer to maintain scrollbar */}
        <div style={{ height: totalHeight, position: "relative" }}>
          {/* Render visible items */}
          {visibleItems.map(({ item, index, row, col }) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: row * (rowHeight + gap),
                left: `${(100 / itemsPerRow) * col}%`,
                width: `${100 / itemsPerRow}%`,
                height: rowHeight,
                paddingRight: col < itemsPerRow - 1 ? gap : 0,
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}