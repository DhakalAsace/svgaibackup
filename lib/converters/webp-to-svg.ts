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
import { convertWithCloudConvert, type CloudConvertOptions } from './cloudconvert-client'
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
  input: Buffer,
  options: WebpToSvgOptions
): Promise<ConversionResult> {
  try {
    // Validate input is WebP
    const detectedFormat = detectFileTypeFromBuffer(input)
    
    if (detectedFormat !== 'webp') {
      throw new FileValidationError(
        `Expected WebP file but detected ${detectedFormat || 'unknown'} format`
      )
    }

    // Report initial progress
    options.onProgress?.(0.1)

    // Step 1: Convert WebP → PNG using CloudConvert
    const cloudConvertOptions: CloudConvertOptions = {
      onProgress: (progress) => {
        // Map to 0.1 - 0.5 range for WebP → PNG conversion
        const adjustedProgress = 0.1 + (progress * 0.4)
        options.onProgress?.(adjustedProgress)
      }
    }

    const pngResult = await convertWithCloudConvert(
      input,
      'webp',
      'png',
      'webp-input.webp',
      cloudConvertOptions
    )

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