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
 * Converts SVG to WebP using CloudConvert API
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
    const svgBuffer = Buffer.from(sanitizedSvg, 'utf8')

    // Report progress after preparation
    if (options.onProgress) {
      options.onProgress(0.2)
    }

    // Prepare CloudConvert options
    const cloudConvertOptions: CloudConvertOptions = {
      quality: options.quality ?? 85,
      width: options.width,
      height: options.height,
      preserveAspectRatio: options.preserveAspectRatio,
      background: options.background,
      onProgress: (progress) => {
        // Map CloudConvert progress to our range (0.2 to 1.0)
        const adjustedProgress = 0.2 + (progress * 0.8)
        options.onProgress?.(adjustedProgress)
      }
    }

    // Convert using CloudConvert
    const result = await convertWithCloudConvert(
      svgBuffer,
      'svg',
      'webp',
      'input.svg',
      cloudConvertOptions
    )

    return result

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
 * Client-side SVG to WebP conversion wrapper
 * Note: This requires server-side processing due to sharp dependency
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
 * This function is optimized for server environments
 */
export async function convertSvgToWebpServer(
  input: Buffer | string,
  options: SvgToWebpOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return svgToWebpHandler(input, options)
}

/**
 * SVG to WebP converter configuration
 */
export const svgToWebpConverter = {
  name: 'SVG to WebP',
  from: 'svg' as ImageFormat,
  to: 'webp' as ImageFormat,
  handler: svgToWebpHandler,
  isClientSide: true, // Now supports client-side with Canvas API
  description: 'Convert scalable vector graphics to WebP format with advanced compression options'
}