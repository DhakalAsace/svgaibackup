/**
 * WebP to SVG Converter Implementation
 * 
 * This module provides WebP to SVG conversion using CloudConvert API.
 * Since CloudConvert doesn't support WebP → SVG directly, we use a
 * WebP → PNG → SVG conversion chain.
 */

import type { 
  ConversionOptions, 
  ConversionResult,
  ConversionHandler,
  ImageFormat 
} from './types'
import { 
  ConversionError, 
  FileValidationError
} from './errors'
import { detectFileTypeFromBuffer } from './validation'
import { pngToSvgHandler } from './png-to-svg'

/**
 * Extended conversion options for WebP to SVG
 */
interface WebpToSvgOptions extends ConversionOptions {
  /** Quality level (1-100, default: 50) */
  quality?: number
  /** Maximum image size in pixels (default: 16000000 = 16MP) */
  maxPixels?: number
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * WebP to SVG conversion using CloudConvert API (WebP → PNG → SVG chain)
 * Implements the ConversionHandler interface
 */
async function performWebpToSvgConversion(
  input: Buffer | string,
  options: WebpToSvgOptions
): Promise<ConversionResult> {
  try {
    // Convert string input to Buffer if needed
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
    
    // Validate input is WebP
    const detectedFormat = detectFileTypeFromBuffer(inputBuffer)
    
    if (detectedFormat !== 'webp') {
      throw new FileValidationError(
        `Expected WebP file but detected ${detectedFormat || 'unknown'} format`
      )
    }

    // Report initial progress
    options.onProgress?.(0.1)

    // Note: CloudConvert doesn't support WebP → SVG directly
    // For now, we'll implement a client-side approach using Canvas API
    // First convert WebP to canvas, then use existing PNG → SVG tracing
    
    const pngBuffer = await convertWebpToPngCanvas(inputBuffer)
    
    // Report progress after WebP → PNG
    options.onProgress?.(0.5)

    const pngResult = {
      success: true,
      data: pngBuffer,
      mimeType: 'image/png',
      metadata: { method: 'canvas-api' }
    }

    if (!pngResult.success || !pngResult.data) {
      throw new ConversionError(
        'Failed to convert WebP to PNG in intermediate step',
        'WEBP_TO_PNG_FAILED'
      )
    }

    // Report progress after WebP → PNG
    options.onProgress?.(0.5)

    // Step 2: Convert PNG → SVG using existing converter
    const svgOptions = {
      ...options,
      onProgress: (progress: number) => {
        // Map to 0.5 - 1.0 range for PNG → SVG conversion
        const adjustedProgress = 0.5 + (progress * 0.5)
        options.onProgress?.(adjustedProgress)
      }
    }

    const svgResult = await pngToSvgHandler(pngResult.data, svgOptions)

    if (!svgResult.success) {
      throw new ConversionError(
        `Failed to convert PNG to SVG in intermediate step: ${svgResult.error}`,
        'PNG_TO_SVG_FAILED'
      )
    }

    // Update metadata to reflect the full conversion chain
    return {
      ...svgResult,
      metadata: {
        ...svgResult.metadata,
        method: 'cloudconvert-chain',
        conversionChain: 'webp → png → svg',
        originalFormat: 'webp'
      }
    }

  } catch (error) {
    if (error instanceof ConversionError || error instanceof FileValidationError) {
      throw error
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    throw new ConversionError(
      `WebP to SVG conversion failed: ${message}`,
      'WEBP_TO_SVG_FAILED'
    )
  }
}

// Export the main handler for direct use
export const webpToSvgHandler = performWebpToSvgConversion

// Client-side wrapper
export async function convertWebpToSvgClient(
  file: File,
  options: WebpToSvgOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return webpToSvgHandler(buffer, options)
}

// Server-side wrapper
export async function convertWebpToSvgServer(
  buffer: Buffer,
  options: WebpToSvgOptions = {}
): Promise<ConversionResult> {
  return webpToSvgHandler(buffer, options)
}

/**
 * Convert WebP to PNG using Canvas API
 */
async function convertWebpToPngCanvas(input: Buffer): Promise<Buffer> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new ConversionError(
      'WebP to PNG conversion requires a browser environment',
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
          // Set canvas dimensions to match image
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight

          // Draw the WebP image
          ctx.drawImage(img, 0, 0)

          // Convert to PNG
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new ConversionError('Failed to create PNG blob', 'PNG_CREATION_FAILED'))
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
              reject(new ConversionError('Failed to read PNG blob', 'PNG_READ_FAILED'))
            }
            reader.readAsArrayBuffer(blob)
          }, 'image/png')

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          reject(new ConversionError(`Canvas drawing failed: ${errorMessage}`, 'CANVAS_ERROR'))
        }
      }

      img.onerror = () => {
        reject(new ConversionError('Failed to load WebP image', 'WEBP_LOAD_FAILED'))
      }

      // Load WebP as data URL
      const webpBlob = new Blob([input], { type: 'image/webp' })
      const url = URL.createObjectURL(webpBlob)
      img.src = url

      // Clean up URL after some time
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      reject(new ConversionError(`WebP to PNG setup failed: ${errorMessage}`, 'SETUP_ERROR'))
    }
  })
}

// Export converter object for use in routing
export const webpToSvgConverter = {
  name: 'WebP to SVG',
  from: 'webp' as const,
  to: 'svg' as const,
  handler: webpToSvgHandler,
  isClientSide: true,
  description: 'Convert WebP images to SVG using Canvas API and Potrace vectorization'
}