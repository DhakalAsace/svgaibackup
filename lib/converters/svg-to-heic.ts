/**
 * SVG to HEIC Converter Implementation
 * 
 * This module provides SVG to HEIC conversion functionality.
 * Note: HEIC encoding is not supported in browsers, so this converter
 * provides a fallback approach through intermediate formats.
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
import { 
  detectFileTypeFromBuffer, 
  validateFile
} from './validation'

/**
 * Extended conversion options for SVG to HEIC
 */
interface SvgToHeicOptions extends ConversionOptions {
  /** Output dimensions */
  width?: number
  height?: number
  /** Background color for transparent areas */
  background?: string
  /** DPI for rasterization (default: 150) */
  dpi?: number
  /** Quality for intermediate format (0-100) */
  quality?: number
  /** Progress callback */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an SVG
 */
function validateSvgInput(content: string): void {
  // Check for SVG tag
  if (!content.includes('<svg') || !content.includes('</svg>')) {
    throw new FileValidationError('Invalid SVG: missing SVG tags')
  }
  
  // Basic validation for malformed SVG
  const svgMatch = content.match(/<svg[^>]*>/i)
  if (!svgMatch) {
    throw new FileValidationError('Invalid SVG: malformed SVG tag')
  }
}

/**
 * Rasterizes SVG to canvas
 */
async function svgToCanvas(
  svgContent: string, 
  options: SvgToHeicOptions
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new ConversionError('Failed to create canvas context', 'CANVAS_CONTEXT_FAILED'))
      return
    }
    
    img.onload = () => {
      // Set canvas dimensions
      const scale = (options.dpi || 150) / 96 // Convert DPI to scale
      const width = options.width || img.width * scale
      const height = options.height || img.height * scale
      
      canvas.width = width
      canvas.height = height
      
      // Fill background if specified
      if (options.background && options.background !== 'transparent') {
        ctx.fillStyle = options.background
        ctx.fillRect(0, 0, width, height)
      }
      
      // Draw SVG
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas)
    }
    
    img.onerror = () => {
      reject(new ConversionError('Failed to load SVG image', 'SVG_LOAD_FAILED'))
    }
    
    // Create blob URL from SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    img.src = url
  })
}

/**
 * Converts SVG to HEIC
 * Note: Since direct HEIC encoding is not available in browsers,
 * this implementation returns a JPEG with HEIC metadata
 */
export const svgToHeicHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToHeicOptions = {}
): Promise<ConversionResult> => {
  try {
    // Ensure we have a string to work with
    const svgContent = typeof input === 'string' 
      ? input 
      : input.toString('utf8')

    // Validate SVG
    validateSvgInput(svgContent)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Check browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new ConversionError(
        'SVG to HEIC conversion requires a browser environment',
        'BROWSER_REQUIRED'
      )
    }

    // Report progress
    if (options.onProgress) {
      options.onProgress(0.3)
    }

    // Rasterize SVG to canvas
    const canvas = await svgToCanvas(svgContent, options)

    // Report progress
    if (options.onProgress) {
      options.onProgress(0.6)
    }

    // Convert canvas to blob
    // Note: Using JPEG as fallback since HEIC encoding is not available
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new ConversionError('Failed to create image blob', 'BLOB_CREATION_FAILED'))
          }
        },
        'image/jpeg',
        (options.quality || 90) / 100
      )
    })

    // Report progress
    if (options.onProgress) {
      options.onProgress(0.9)
    }

    // Convert blob to buffer
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Report completion
    if (options.onProgress) {
      options.onProgress(1)
    }

    return {
      success: true,
      data: buffer,
      mimeType: 'image/jpeg', // Fallback to JPEG
      metadata: {
        format: 'jpeg', // Note: Actually JPEG, not HEIC
        width: canvas.width,
        height: canvas.height,
        size: buffer.length,
        premiumFeature: true,
        upgradeUrl: '/pricing',
        note: 'Direct HEIC encoding is not supported in browsers. This creates a high-quality JPEG instead.'
      }
    }

  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof ConversionError) {
      throw error
    }

    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to HEIC conversion failed: ${error.message}`,
        'SVG_TO_HEIC_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to HEIC conversion',
      'SVG_TO_HEIC_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to HEIC conversion wrapper
 */
export async function convertSvgToHeicClient(
  svgContent: string,
  options: SvgToHeicOptions = {}
): Promise<ConversionResult> {
  // Use the main handler
  return svgToHeicHandler(svgContent, options)
}

/**
 * SVG to HEIC converter configuration
 */
export const svgToHeicConverter = {
  name: 'SVG to HEIC',
  from: 'svg' as ImageFormat,
  to: 'heic' as ImageFormat,
  handler: svgToHeicHandler,
  isClientSide: true,
  isPremium: true,
  description: 'Convert SVG to HEIC format. Note: Creates high-quality JPEG as HEIC encoding is not available in browsers.'
}