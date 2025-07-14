/**
 * Browser-safe image tracing utilities
 * 
 * Provides optimized settings and helpers for running imagetracerjs
 * in the browser without freezing the UI
 */

import type { ConversionOptions } from './types'

export interface ImageTracerOptions {
  numberofcolors?: number
  colorquantcycles?: number
  pathomit?: number
  blurradius?: number
  blurdelta?: number
  strokewidth?: number
  linethereshold?: number
  quadthreshold?: number
  rightangleenhance?: boolean
  viewbox?: boolean
  desc?: boolean
  lcpr?: number
  qcpr?: number
}

/**
 * Get optimized trace options based on image size and quality settings
 */
export function getOptimizedTraceOptions(
  imageSize: { width: number; height: number },
  options: ConversionOptions & ImageTracerOptions
): ImageTracerOptions {
  const pixels = imageSize.width * imageSize.height
  
  // For very large images, use more aggressive optimization
  const isLargeImage = pixels > 1000000 // > 1MP
  const isVeryLargeImage = pixels > 4000000 // > 4MP
  
  // Quality level (1-100, where 100 is highest quality)
  const quality = options.quality || 50
  
  // Base options optimized for performance
  let traceOptions: ImageTracerOptions = {
    // Reduce colors for faster processing
    numberofcolors: isVeryLargeImage ? 4 : isLargeImage ? 6 : 8,
    // Reduce color quantization cycles
    colorquantcycles: isLargeImage ? 1 : 2,
    // Increase path omission for simpler paths
    pathomit: isVeryLargeImage ? 20 : isLargeImage ? 15 : 12,
    // Disable blur for large images
    blurradius: isLargeImage ? 0 : (options.blurradius || 0),
    blurdelta: options.blurdelta || 20,
    strokewidth: options.strokewidth || 1,
    linethereshold: options.linethreshold || 10,
    quadthreshold: options.quadthreshold || 10,
    rightangleenhance: !isLargeImage && (options.rightangleenhance !== false),
    // Disable extra output options
    viewbox: false,
    desc: false,
    lcpr: 0,
    qcpr: 0,
  }
  
  // Apply quality adjustments
  if (quality > 70) {
    // High quality mode
    traceOptions.numberofcolors = Math.min(16, (traceOptions.numberofcolors || 8) * 2)
    traceOptions.colorquantcycles = Math.min(3, (traceOptions.colorquantcycles || 2) + 1)
    traceOptions.pathomit = Math.max(8, (traceOptions.pathomit || 12) - 4)
  } else if (quality < 30) {
    // Fast mode
    traceOptions.numberofcolors = Math.max(2, (traceOptions.numberofcolors || 8) / 2)
    traceOptions.pathomit = Math.min(30, (traceOptions.pathomit || 12) + 8)
  }
  
  // Override with user options if provided
  return {
    ...traceOptions,
    ...Object.fromEntries(
      Object.entries(options).filter(([key]) => 
        key in traceOptions && options[key as keyof typeof options] !== undefined
      )
    )
  }
}

/**
 * Validate image dimensions and throw error if too large
 */
export function validateImageSize(
  width: number,
  height: number,
  maxPixels: number = 16000000 // 16MP default
): void {
  const pixels = width * height
  
  if (pixels > maxPixels) {
    const maxDimension = Math.sqrt(maxPixels)
    throw new Error(
      `Image is too large (${width}x${height} = ${(pixels / 1000000).toFixed(1)}MP). ` +
      `Maximum supported size is ${(maxPixels / 1000000).toFixed(0)}MP ` +
      `(approximately ${Math.floor(maxDimension)}x${Math.floor(maxDimension)}). ` +
      `Please resize your image before converting.`
    )
  }
}

/**
 * Get image dimensions from a data URL
 */
export async function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = dataUrl
  })
}

/**
 * Convert using imagetracerjs with automatic optimization
 */
export async function traceImageOptimized(
  ImageTracer: any,
  dataUrl: string,
  options: ConversionOptions & ImageTracerOptions,
  reportProgress?: (progress: number) => void
): Promise<string> {
  // Get image dimensions
  const dimensions = await getImageDimensions(dataUrl)
  
  // Validate size
  validateImageSize(dimensions.width, dimensions.height)
  
  // Get optimized options
  const traceOptions = getOptimizedTraceOptions(dimensions, options)
  
  // Report progress
  reportProgress?.(0.5)
  
  return new Promise((resolve, reject) => {
    // Use setTimeout to prevent blocking
    setTimeout(() => {
      try {
        ImageTracer.imageToSVG(
          dataUrl,
          (svgString: string) => {
            reportProgress?.(0.9)
            resolve(svgString)
          },
          traceOptions
        )
      } catch (error) {
        reject(error)
      }
    }, 10) // Small delay to allow UI updates
  })
}