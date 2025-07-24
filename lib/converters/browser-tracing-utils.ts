/**
 * Browser-safe image tracing utilities
 * 
 * Provides optimized settings and helpers for running imagetracerjs
 * in the browser without freezing the UI using Web Workers
 */

import type { ConversionOptions } from './types'
import { imageTracerWorkerManager } from './image-tracer-worker-manager'

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
  const isExtremelyLarge = pixels > 10000000 // > 10MP
  
  // Quality level (1-100, where 100 is highest quality)
  const quality = options.quality || 50
  
  // Base options optimized for performance
  const traceOptions: ImageTracerOptions = {
    // Reduce colors for faster processing - more aggressive for larger images
    numberofcolors: isExtremelyLarge ? 3 : isVeryLargeImage ? 4 : isLargeImage ? 6 : 8,
    // Reduce color quantization cycles - single pass for large images
    colorquantcycles: isLargeImage ? 1 : 2,
    // Increase path omission for simpler paths - more aggressive simplification
    pathomit: isExtremelyLarge ? 30 : isVeryLargeImage ? 20 : isLargeImage ? 15 : 12,
    // Disable blur for large images to save processing time
    blurradius: isLargeImage ? 0 : (options.blurradius || 0),
    blurdelta: options.blurdelta || 20,
    strokewidth: options.strokewidth || 1,
    // Increase thresholds for larger images to simplify processing
    linethereshold: isLargeImage ? (options.linethreshold || 15) : (options.linethreshold || 10),
    quadthreshold: isLargeImage ? (options.quadthreshold || 15) : (options.quadthreshold || 10),
    rightangleenhance: !isLargeImage && (options.rightangleenhance !== false),
    // Disable extra output options to save processing
    viewbox: false,
    desc: false,
    lcpr: 0,
    qcpr: 0,
  }
  
  // Apply quality adjustments (but cap them for very large images)
  if (quality > 70 && !isVeryLargeImage) {
    // High quality mode (only for smaller images)
    traceOptions.numberofcolors = Math.min(16, (traceOptions.numberofcolors || 8) * 2)
    traceOptions.colorquantcycles = Math.min(3, (traceOptions.colorquantcycles || 2) + 1)
    traceOptions.pathomit = Math.max(8, (traceOptions.pathomit || 12) - 4)
  } else if (quality < 30 || isExtremelyLarge) {
    // Fast mode (force for extremely large images)
    traceOptions.numberofcolors = Math.max(2, (traceOptions.numberofcolors || 8) / 2)
    traceOptions.pathomit = Math.min(40, (traceOptions.pathomit || 12) + 10)
  }
  
  // Override with user options if provided (but still cap for performance)
  const userOptions = Object.fromEntries(
    Object.entries(options).filter(([key]) => 
      key in traceOptions && options[key as keyof typeof options] !== undefined
    )
  )
  
  // Apply caps for large images even with user overrides
  const result = { ...traceOptions, ...userOptions }
  if (isVeryLargeImage) {
    result.numberofcolors = Math.min(result.numberofcolors || 8, 8)
    result.colorquantcycles = Math.min(result.colorquantcycles || 1, 1)
  }
  
  return result
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
 * Downscale image if it's too large for efficient processing
 */
export async function downscaleImageIfNeeded(
  dataUrl: string,
  maxPixels: number = 4000000 // 4MP max for efficient processing
): Promise<string> {
  const dimensions = await getImageDimensions(dataUrl)
  const currentPixels = dimensions.width * dimensions.height
  
  // If image is within limits, return as-is
  if (currentPixels <= maxPixels) {
    return dataUrl
  }
  
  // Calculate scale factor to fit within max pixels
  const scaleFactor = Math.sqrt(maxPixels / currentPixels)
  const newWidth = Math.floor(dimensions.width * scaleFactor)
  const newHeight = Math.floor(dimensions.height * scaleFactor)
  
  console.info(`Downscaling image from ${dimensions.width}x${dimensions.height} to ${newWidth}x${newHeight} for processing`)
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Use high-quality scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Draw scaled image
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Convert back to data URL
      const scaledDataUrl = canvas.toDataURL('image/jpeg', 0.92)
      resolve(scaledDataUrl)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image for scaling'))
    }
    
    img.src = dataUrl
  })
}

/**
 * Fallback function for main thread processing when Web Worker fails
 */
async function traceImageMainThread(
  ImageTracer: any,
  dataUrl: string,
  traceOptions: ImageTracerOptions,
  reportProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    reportProgress?.(0.7)
    
    try {
      const startTime = Date.now()
      
      ImageTracer.imageToSVG(
        dataUrl,
        (svgString: string) => {
          const processingTime = Date.now() - startTime
          console.info(`Image conversion completed in ${processingTime}ms (Main Thread - Fallback)`)
          
          reportProgress?.(1.0)
          resolve(svgString)
        },
        traceOptions
      )
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Convert using imagetracerjs with Web Worker for non-blocking processing
 */
export async function traceImageOptimized(
  ImageTracer: any,
  dataUrl: string,
  options: ConversionOptions & ImageTracerOptions,
  reportProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Get image dimensions
    const originalDimensions = await getImageDimensions(dataUrl)
    reportProgress?.(0.1)
    
    // Validate original size
    validateImageSize(originalDimensions.width, originalDimensions.height)
    
    // Downscale if too large for efficient processing
    const processedDataUrl = await downscaleImageIfNeeded(dataUrl, 4000000) // 4MP max
    const finalDimensions = await getImageDimensions(processedDataUrl)
    reportProgress?.(0.2)
    
    // Get optimized options based on final dimensions
    const traceOptions = getOptimizedTraceOptions(finalDimensions, options)
    
    // Try Web Worker first (non-blocking)
    if (imageTracerWorkerManager.isWorkerSupported()) {
      try {
        console.info('Attempting Web Worker processing...')
        reportProgress?.(0.3)
        
        const result = await imageTracerWorkerManager.traceImage(
          processedDataUrl,
          traceOptions,
          (workerProgress) => {
            // Map worker progress to our range (0.3 to 0.9)
            reportProgress?.(0.3 + workerProgress * 0.6)
          }
        )
        
        reportProgress?.(1.0)
        return result
        
      } catch (workerError) {
        const errorMessage = workerError instanceof Error ? workerError.message : 'Web Worker failed'
        console.warn('Web Worker failed, falling back to main thread:', errorMessage)
        reportProgress?.(0.5)
      }
    } else {
      console.info('Web Workers not supported, using main thread')
      reportProgress?.(0.5)
    }
    
    // Fallback to main thread processing
    console.info('Using main thread processing (fallback)')
    return await traceImageMainThread(ImageTracer, processedDataUrl, traceOptions, reportProgress)
    
  } catch (error) {
    console.error('Image tracing failed:', error)
    throw error
  }
}