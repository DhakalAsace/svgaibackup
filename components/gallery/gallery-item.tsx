"use client"

import Link from "next/link"
import { Download, Heart, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import LazySVG from "@/components/lazy-svg"
import { useState } from "react"
import styles from "@/app/gallery/gallery.module.css"

interface GalleryItemProps {
  item: {
    id: string
    filename: string
    title: string
    description: string
    svgPath: string
    tags: string[]
    downloads: number
    likes: number
    isNew: boolean
    featured?: boolean
  }
  onClick: () => void
}

export default function GalleryItem({ item, onClick }: GalleryItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 cursor-pointer h-full ${styles.galleryCard}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      aria-label={`View ${item.title}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* SVG Preview Section */}
        <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted/30 transition-all duration-300 group-hover:from-muted/70 group-hover:to-muted/40">
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            {item.featured && (
              <Badge className="text-xs px-2 py-0.5 bg-primary/90 text-white border-0">
                Featured
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <button
            className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition-all duration-300 ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
            onClick={handleLike}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`h-5 w-5 transition-all ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* SVG Display */}
          <div className="p-8 h-full flex items-center justify-center">
            <LazySVG 
              src={item.svgPath}
              className="h-full w-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              priority={item.featured}
            />
          </div>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex">
                <Button
                  size="sm"
                  className="w-full gap-2 bg-primary/90 backdrop-blur-sm hover:bg-primary"
                  onClick={async (e) => {
                    e.stopPropagation()
                    // Download the SVG
                    try {
                      const response = await fetch(item.svgPath)
                      const svgContent = await response.text()
                      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = item.filename
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    } catch (error) {
                      console.error('Download failed:', error)
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5">
          <h3 className="mb-2 font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {item.downloads.toLocaleString()} downloads
            </span>
          </div>

          {/* Mobile Action Buttons (visible on small screens) */}
          <div className="mt-4 flex sm:hidden">
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={async (e) => {
                e.stopPropagation()
                // Download the SVG
                try {
                  const response = await fetch(item.svgPath)
                  const svgContent = await response.text()
                  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = item.filename
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                } catch (error) {
                  console.error('Download failed:', error)
                }
              }}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}