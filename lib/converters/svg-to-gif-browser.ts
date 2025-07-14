/**
 * SVG to GIF Converter - Browser Implementation
 * 
 * This module provides SVG to GIF conversion using gif.js for browser environments.
 * Supports static SVG conversion and animated SVG with CSS/SMIL animations.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult 
} from './types'
import { 
  ConversionError, 
  FileValidationError 
} from './errors'
import { 
  getGifConfig, 
  calculateFrameSettings, 
  validateWorkerAvailability 
} from './gif-config'
import {
  parseCssAnimations,
  parseSmilAnimations,
  calculateFrameSequence,
  getOptimalFrameRate,
  applyTimingFunction,
  type ParsedAnimation,
  type FrameData
} from './svg-animation-parser'
import { renderSvgFrame } from './svg-frame-renderer'

// Dynamic import type for gif.js
type GIFEncoder = any; // gif.js doesn't have proper types

/**
 * Extended conversion options for SVG to GIF
 */
interface SvgToGifOptions extends ConversionOptions {
  /** Number of frames for animations (default: calculated based on duration) */
  frames?: number
  /** Frame delay in milliseconds (default: calculated for smooth animation) */
  frameDelay?: number
  /** Frame rate in fps (default: calculated based on animation complexity) */
  frameRate?: number
  /** Animation duration in seconds (default: 2) */
  duration?: number
  /** Number of colors in palette (2-256, default: 256) */
  colors?: number
  /** Dithering (default: false) */
  dither?: boolean
  /** Progress callback */
  onProgress?: (progress: number) => void
  /** Number of worker threads (default: auto-detected) */
  workers?: number
  /** Target file size in bytes (helps optimize quality) */
  targetFileSize?: number
  /** Quality preset: 'high', 'medium', 'low', 'animation' */
  qualityPreset?: 'high' | 'medium' | 'low' | 'animation'
}

/**
 * Validates SVG input
 */
function validateSvgInput(input: string | Buffer): string {
  const svgString = typeof input === 'string' ? input : input.toString('utf-8')
  
  if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG content')
  }
  
  return svgString
}


/**
 * Renders SVG to canvas
 */
async function renderSvgToCanvas(
  svgString: string, 
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new ConversionError('Failed to get canvas context', 'CANVAS_CONTEXT_ERROR')
  }
  
  // Create blob from SVG string
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  try {
    // Create image element
    const img = new Image()
    img.width = width
    img.height = height
    
    // Wait for image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load SVG'))
      img.src = url
    })
    
    // Clear canvas and draw image
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Browser-side SVG to GIF conversion handler
 */
export const svgToGifHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> => {
  try {
    // Validate input
    const svgString = validateSvgInput(input)
    
    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    // Parse animations using advanced parser
    const cssAnimations = parseCssAnimations(svgString)
    const smilAnimations = parseSmilAnimations(svgString)
    const allAnimations = [...cssAnimations, ...smilAnimations]
    
    const hasAnimation = allAnimations.length > 0
    
    // Calculate total animation duration
    let maxEndTime = 0
    allAnimations.forEach(anim => {
      const endTime = anim.delay + anim.duration * (anim.iterations === 'infinite' ? 1 : anim.iterations)
      maxEndTime = Math.max(maxEndTime, endTime)
    })
    
    const animationDuration = options.duration || maxEndTime || 2 // default 2 seconds
    
    // Determine dimensions
    const width = options.width || 800
    const height = options.height || 600
    
    // Calculate optimal frame settings
    const optimalFrameRate = hasAnimation ? getOptimalFrameRate(allAnimations) : 1
    const frameSettings = hasAnimation 
      ? calculateFrameSettings(animationDuration, options.targetFileSize)
      : { frameCount: 1, frameDelay: 0, quality: 10 }
    
    // Use optimal frame rate if not specified
    const frameRate = options.frameRate || optimalFrameRate
    const frameCount = options.frames || Math.ceil(animationDuration * frameRate)
    const frameDelay = options.frameDelay || Math.round(1000 / frameRate)
    
    // Dynamically import gif.js
    const GIF = (await import('gif.js')).default
    
    // Get configuration
    const gifConfig = getGifConfig(
      options.qualityPreset || (hasAnimation ? 'animation' : 'medium'),
      {
        workers: options.workers,
        quality: options.quality || 10,
        dither: options.dither ? 'FloydSteinberg' : false
      }
    )
    
    // Calculate frame sequence
    const frameSequence = hasAnimation 
      ? calculateFrameSequence(allAnimations, animationDuration, frameRate)
      : [{ index: 0, timestamp: 0, svg: svgString, activeAnimations: [] }]
    
    // Report progress
    if (options.onProgress) {
      options.onProgress(0.2)
    }
    
    // Validate worker availability
    const workerAvailable = await validateWorkerAvailability(gifConfig.workerScript)
    if (!workerAvailable) {
      console.warn('GIF worker not available, using single-threaded mode')
      gifConfig.workers = 0
    }
    
    // Create GIF encoder
    const gif = new GIF({
      ...gifConfig,
      width: width,
      height: height,
      transparent: options.background === 'transparent' ? null : undefined
    })
    
    // Create canvas for rendering
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    
    // Render frames
    for (let i = 0; i < frameSequence.length; i++) {
      const frame = frameSequence[i]
      const progress = i / frameSequence.length
      
      // Render frame with animations applied
      const frameSvg = hasAnimation 
        ? renderSvgFrame(svgString, allAnimations, frame.timestamp)
        : svgString
      
      // Render SVG to canvas
      await renderSvgToCanvas(frameSvg, canvas, width, height)
      
      // Add frame to GIF
      gif.addFrame(canvas, { delay: frameDelay, copy: true })
      
      // Report progress
      if (options.onProgress) {
        options.onProgress(0.2 + (0.6 * progress))
      }
    }
    
    // Render GIF
    return new Promise((resolve, reject) => {
      (gif as any).on('finished', (blob: any) => {
        // Convert blob to buffer
        blob.arrayBuffer().then((buffer: ArrayBuffer) => {
          const uint8Array = new Uint8Array(buffer)
          
          // Report completion
          if (options.onProgress) {
            options.onProgress(1)
          }
          
          resolve({
            success: true,
            data: Buffer.from(uint8Array),
            mimeType: 'image/gif',
            metadata: {
              width: width,
              height: height,
              format: 'gif',
              size: uint8Array.length,
              frames: frameCount,
              duration: animationDuration
            }
          })
        }).catch((error: any) => {
          reject(new ConversionError(
            `Failed to convert blob to buffer: ${error.message}`,
            'BLOB_CONVERSION_ERROR'
          ))
        })
      })
      
      (gif as any).on('error', (error: any) => {
        reject(new ConversionError(
          `GIF encoding failed: ${error?.message || 'Unknown error'}`,
          'GIF_ENCODING_ERROR'
        ))
      })
      
      // Start rendering
      gif.render()
    })
    
  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof ConversionError) {
      throw error
    }
    
    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to GIF conversion failed: ${error.message}`,
        'SVG_TO_GIF_FAILED'
      )
    }
    
    throw new ConversionError(
      'An unexpected error occurred during SVG to GIF conversion',
      'SVG_TO_GIF_UNKNOWN_ERROR'
    )
  }
}