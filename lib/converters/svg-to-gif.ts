/**
 * SVG to GIF Converter Implementation
 * 
 * This module provides SVG to GIF conversion using sharp library.
 * Creates a single frame GIF from SVG content, preserving transparency
 * when possible.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult,
  ImageFormat 
} from './types'
import { 
  ConversionError, 
  FileValidationError,
  UnsupportedFormatError 
} from './errors'
import { detectFileTypeFromBuffer } from './validation'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Extended conversion options for SVG to GIF
 */
interface SvgToGifOptions extends ConversionOptions {
  /** DPI for rasterization (default: 96) */
  density?: number
  /** Whether to preserve transparency (default: true) */
  transparent?: boolean
  /** Number of colors in palette (2-256, default: 256) */
  colors?: number
  /** Dithering algorithm (default: none) */
  dither?: boolean
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an SVG
 */
function validateSvgInput(input: Buffer | string): string {
  let svgContent: string
  
  if (typeof input === 'string') {
    svgContent = input
  } else {
    // Try to detect if buffer contains SVG
    const format = detectFileTypeFromBuffer(input)
    if (format && format !== 'svg') {
      throw new UnsupportedFormatError(
        format,
        ['svg'],
        `Expected SVG format but received ${format}`
      )
    }
    
    // Convert buffer to string
    svgContent = input.toString('utf8')
  }
  
  // Basic SVG validation
  if (!svgContent.includes('<svg') && !svgContent.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG content')
  }
  
  return svgContent
}

/**
 * Prepares SVG for sharp processing
 */
function prepareSvgForSharp(svgContent: string): Buffer {
  // Ensure SVG has proper XML declaration if missing
  if (!svgContent.startsWith('<?xml')) {
    svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgContent
  }
  
  return Buffer.from(svgContent, 'utf8')
}

/**
 * Converts SVG to GIF using either gif.js (browser) or sharp (server)
 * Implements the ConversionHandler interface
 */
export const svgToGifHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> => {
  // Use browser implementation if in browser environment
  if (isBrowser) {
    const { svgToGifHandler: browserHandler } = await import('./svg-to-gif-browser')
    return browserHandler(input, options)
  }
  
  try {
    // Server-side implementation using sharp
    const sharp = await import('sharp').then(m => m.default)
    
    // Validate and prepare SVG
    const svgContent = validateSvgInput(input)
    const svgBuffer = prepareSvgForSharp(svgContent)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Create sharp instance with SVG input
    let pipeline = sharp(svgBuffer, {
      density: options.density || 96
    })

    // Report progress after initialization
    if (options.onProgress) {
      options.onProgress(0.3)
    }

    // Apply dimensions if specified
    if (options.width || options.height) {
      pipeline = pipeline.resize({
        width: options.width,
        height: options.height,
        fit: options.preserveAspectRatio ? 'inside' : 'fill',
        background: options.background || { r: 0, g: 0, b: 0, alpha: 0 }
      })
    }

    // Report progress before conversion
    if (options.onProgress) {
      options.onProgress(0.6)
    }

    // Configure GIF output options
    const gifOptions: any = {
      colors: options.colors || 256,
      dither: options.dither ? 1.0 : 0
    }

    // If not transparent, flatten with background
    if (options.transparent === false && options.background) {
      pipeline = pipeline.flatten({
        background: options.background
      })
    }

    // Convert to GIF
    const gifBuffer = await pipeline
      .gif(gifOptions)
      .toBuffer({ resolveWithObject: true })

    // Report completion
    if (options.onProgress) {
      options.onProgress(1)
    }

    return {
      success: true,
      data: gifBuffer.data,
      mimeType: 'image/gif',
      metadata: {
        width: gifBuffer.info.width,
        height: gifBuffer.info.height,
        format: 'gif',
        size: gifBuffer.info.size
      }
    }

  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError) {
      throw error
    }

    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to GIF conversion failed: ${error.message}`,
        'SVG_TO_GIF_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to GIF conversion',
      'SVG_TO_GIF_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to GIF conversion wrapper
 * Uses gif.js for browser-based conversion
 */
export async function convertSvgToGifClient(
  svgContent: string,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> {
  return svgToGifHandler(svgContent, options)
}

/**
 * Server-side SVG to GIF conversion wrapper
 * This function is optimized for server environments
 */
export async function convertSvgToGifServer(
  input: Buffer | string,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return svgToGifHandler(input, options)
}

/**
 * SVG to GIF converter configuration
 */
export const svgToGifConverter = {
  name: 'SVG to GIF',
  from: 'svg' as ImageFormat,
  to: 'gif' as ImageFormat,
  handler: svgToGifHandler,
  isClientSide: true, // Now supports client-side with gif.js
  description: 'Convert scalable vector graphics to GIF format with support for animations'
}