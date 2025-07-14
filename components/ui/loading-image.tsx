"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { ImageSkeleton } from "@/components/ui/loading"

interface LoadingImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  aspectRatio?: "square" | "video" | "portrait" | string
  fallback?: string
}

export function LoadingImage({
  src,
  alt,
  className,
  aspectRatio = "square",
  fallback = "/placeholder-image.svg",
  ...props
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <ImageSkeleton
          className="absolute inset-0"
          aspectRatio={aspectRatio}
        />
      )}
      
      <Image
        {...props}
        src={error ? fallback : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading && "opacity-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
      />
    </div>
  )
}