import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  sizes
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  // Default blur data URL for SVG placeholders
  const defaultBlurDataURL = blurDataURL || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
  
  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        aspectRatio: `${width} / ${height}`,
        maxWidth: width,
        width: '100%'
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoadingComplete={() => {
          setIsLoading(false)
          onLoad?.()
        }}
        sizes={sizes || `(max-width: ${width}px) 100vw, ${width}px`}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          inset: 0,
          objectFit: 'contain',
          color: 'transparent'
        }}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      )}
    </div>
  )
}