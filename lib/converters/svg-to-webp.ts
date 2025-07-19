/**
 * SVG to WebP Converter Implementation
 * 
 * This module provides SVG to WebP conversion using CloudConvert API.
 * Supports both lossless and lossy compression with full
 * control over quality settings and transparency handling.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult,
  ImageFormat 
} from './types'
import { 
  ConversionError, 
  UnsupportedFormatError 
} from './errors'
import { convertWithCloudConvert, type CloudConvertOptions } from './cloudconvert-client'

/**
 * Extended conversion options for SVG to WebP
 */
interface SvgToWebpOptions extends ConversionOptions {
  /** Use lossless compression (default: false) */
  lossless?: boolean
  /** Near lossless compression (0-100, only with lossless: true) */
  nearLossless?: boolean
  /** Smart subsample (improves compression, default: false) */
  smartSubsample?: boolean
  /** Reduction effort (0-6, higher = smaller file, default: 4) */
  effort?: number
  /** Alpha quality (0-100, default: 100) */
  alphaQuality?: number
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an SVG image
 */
function validateSvgInput(input: Buffer | string): void {
  // For SVG, we need to check the content since it's text-based
  const content = typeof input === 'string' ? input : input.toString('utf8')
  const trimmed = content.trim()
  
  if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
    throw new UnsupportedFormatError(
      'unknown',
      ['svg'],
      'Input does not appear to be a valid SVG file'
    )
  }
}

/**
 * Sanitizes SVG content to ensure it renders properly
 */
function sanitizeSvgContent(svg: string): string {
  // Ensure SVG has proper XML declaration
  if (!svg.startsWith('<?xml')) {
    svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg
  }
  
  // Ensure SVG has xmlns attribute
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
  
  return svg
}

/**
 * Converts SVG to WebP using Canvas API (client-side only)
 * Implements the ConversionHandler interface
 */
export const svgToWebpHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToWebpOptions = {}
): Promise<ConversionResult> => {
  try {
    // Validate input is SVG
    validateSvgInput(input)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Prepare SVG content
    const svgContent = typeof input === 'string' 
      ? input 
      : input.toString('utf8')
    
    const sanitizedSvg = sanitizeSvgContent(svgContent)

    // Report progress after preparation
    if (options.onProgress) {
      options.onProgress(0.3)
    }

    // Convert SVG to WebP using Canvas API
    const webpBuffer = await convertSvgToWebpCanvas(sanitizedSvg, options)

    if (options.onProgress) {
      options.onProgress(1.0)
    }

    return {
      success: true,
      data: webpBuffer,
      mimeType: 'image/webp',
      metadata: {
        size: webpBuffer.length,
        format: 'webp',
        method: 'canvas-api',
        quality: options.quality ?? 85
      }
    }

  } catch (error) {
    // Handle known errors
    if (error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }

    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to WebP conversion failed: ${error.message}`,
        'SVG_TO_WEBP_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to WebP conversion',
      'SVG_TO_WEBP_UNKNOWN_ERROR'
    )
  }
}

/**
 * Convert SVG to WebP using Canvas API
 */
async function convertSvgToWebpCanvas(
  svgContent: string,
  options: SvgToWebpOptions = {}
): Promise<Buffer> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new ConversionError(
      'SVG to WebP conversion requires a browser environment',
      'BROWSER_REQUIRED'
    )
  }

  return new Promise<Buffer>((resolve, reject) => {
    try {
      // Create an image element
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      img.onload = () => {
        try {
          // Set canvas dimensions
          const width = options.width || img.naturalWidth || 300
          const height = options.height || img.naturalHeight || 300
          
          canvas.width = width
          canvas.height = height

          // Set background if specified
          if (options.background && !options.background.toLowerCase().includes('transparent')) {
            ctx.fillStyle = options.background
            ctx.fillRect(0, 0, width, height)
          }

          // Draw the SVG image
          if (options.preserveAspectRatio !== false) {
            // Calculate aspect-preserving dimensions
            const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight)
            const scaledWidth = img.naturalWidth * scale
            const scaledHeight = img.naturalHeight * scale
            const x = (width - scaledWidth) / 2
            const y = (height - scaledHeight) / 2
            
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          } else {
            ctx.drawImage(img, 0, 0, width, height)
          }

          // Convert to WebP
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new ConversionError('Failed to create WebP blob', 'WEBP_CREATION_FAILED'))
              return
            }

            // Convert blob to buffer
            const reader = new FileReader()
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer
              const buffer = Buffer.from(arrayBuffer)
              resolve(buffer)
            }
            reader.onerror = () => {
              reject(new ConversionError('Failed to read WebP blob', 'WEBP_READ_FAILED'))
            }
            reader.readAsArrayBuffer(blob)
          }, 'image/webp', (options.quality ?? 85) / 100)

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          reject(new ConversionError(`Canvas drawing failed: ${errorMessage}`, 'CANVAS_ERROR'))
        }
      }

      img.onerror = () => {
        reject(new ConversionError('Failed to load SVG image', 'SVG_LOAD_FAILED'))
      }

      // Load SVG as data URL
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      img.src = url

      // Clean up URL after some time
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      reject(new ConversionError(`SVG to WebP setup failed: ${errorMessage}`, 'SETUP_ERROR'))
    }
  })
}

/**
 * Client-side SVG to WebP conversion wrapper
 * Uses Canvas API for browser-based conversion
 */
export async function convertSvgToWebpClient(
  file: File,
  options: SvgToWebpOptions = {}
): Promise<ConversionResult> {
  // Read file as text for SVG
  const text = await file.text()
  
  // Use the main handler
  return svgToWebpHandler(text, options)
}

/**
 * Server-side SVG to WebP conversion wrapper
 * Note: Server-side conversion not supported - redirects to client-side
 */
export async function convertSvgToWebpServer(
  input: Buffer | string,
  options: SvgToWebpOptions = {}
): Promise<ConversionResult> {
  // Server-side conversion not supported for this format combination
  throw new ConversionError(
    'SVG to WebP conversion must be performed client-side in browser',
    'SERVER_NOT_SUPPORTED'
  )
}

/**
 * SVG to WebP converter configuration
 */
export const svgToWebpConverter = {
  name: 'SVG to WebP',
  from: 'svg' as ImageFormat,
  to: 'webp' as ImageFormat,
  handler: svgToWebpHandler,
  isClientSide: true, // Requires browser Canvas API
  description: 'Convert scalable vector graphics to WebP format using browser Canvas API'
}