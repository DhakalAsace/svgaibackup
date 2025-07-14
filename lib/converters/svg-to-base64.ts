/**
 * SVG to Base64 Converter Implementation
 * 
 * This module provides SVG to base64 data URI conversion.
 * Useful for embedding SVGs directly in HTML, CSS, or JavaScript
 * without external file dependencies.
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
import { svgOptimizerHandler } from './svg-optimizer'

/**
 * Extended conversion options for SVG to Base64
 */
interface SvgToBase64Options extends ConversionOptions {
  /** Optimize SVG before encoding (default: true) */
  optimize?: boolean
  /** Optimization level if optimize is true (0-3, default: 2) */
  optimizationLevel?: 0 | 1 | 2 | 3
  /** Encoding format (default: 'base64') */
  encoding?: 'base64' | 'base64url'
  /** Include data URI prefix (default: true) */
  includePrefix?: boolean
  /** Use URL encoding instead of base64 (default: false) */
  urlEncode?: boolean
}

/**
 * Validates that the input is an SVG
 */
function validateSvgInput(input: Buffer | string): string {
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
      throw new FileValidationError('Invalid SVG: Missing SVG tag')
    }
    return trimmed
  }
  
  const format = detectFileTypeFromBuffer(input)
  
  if (format !== 'svg') {
    throw new UnsupportedFormatError(
      format || 'unknown',
      ['svg'],
      `Expected SVG format but received ${format || 'unknown format'}`
    )
  }
  
  return input.toString('utf8')
}

/**
 * URL encodes SVG for data URI (alternative to base64)
 */
function urlEncodeSvg(svg: string): string {
  // Remove unnecessary whitespace
  const minified = svg
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
  
  // URL encode with optimizations for SVG
  return encodeURIComponent(minified)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
    .replace(/%20/g, ' ') // Spaces are safe in data URIs
    .replace(/%3D/g, '=') // = is safe
    .replace(/%3A/g, ':') // : is safe
    .replace(/%2F/g, '/') // / is safe
    .replace(/%23/g, '#') // # is safe
    .replace(/%3B/g, ';') // ; is safe
    .replace(/%2C/g, ',') // , is safe
}

/**
 * Converts SVG to Base64 data URI
 * Implements the ConversionHandler interface
 */
export const svgToBase64Handler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToBase64Options = {}
): Promise<ConversionResult> => {
  try {
    let svgString = validateSvgInput(input)
    
    // Optionally optimize SVG first
    if (options.optimize !== false) {
      const optimizationResult = await svgOptimizerHandler(svgString, {
        level: options.optimizationLevel ?? 2,
        pretty: false // Always minify for base64
      })
      
      if (optimizationResult.success && optimizationResult.data) {
        svgString = optimizationResult.data as string
      }
    }
    
    let encoded: string
    let mimeType = 'image/svg+xml'
    
    if (options.urlEncode) {
      // URL encoding (often smaller for SVGs)
      encoded = urlEncodeSvg(svgString)
      if (options.includePrefix !== false) {
        encoded = `data:${mimeType},${encoded}`
      }
    } else {
      // Base64 encoding
      const buffer = Buffer.from(svgString, 'utf8')
      const encoding = options.encoding || 'base64'
      encoded = buffer.toString(encoding as BufferEncoding)
      
      if (options.includePrefix !== false) {
        encoded = `data:${mimeType};${encoding},${encoded}`
      }
    }
    
    // Calculate sizes
    const originalSize = Buffer.byteLength(svgString, 'utf8')
    const encodedSize = Buffer.byteLength(encoded, 'utf8')
    const overhead = ((encodedSize - originalSize) / originalSize * 100).toFixed(2)
    
    return {
      success: true,
      data: encoded,
      mimeType: 'text/plain', // The output is a text string
      metadata: {
        format: 'base64',
        size: encodedSize
      }
    }
    
  } catch (error) {
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError) {
      throw error
    }
    
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to Base64 conversion failed: ${error.message}`,
        'SVG_TO_BASE64_FAILED'
      )
    }
    
    throw new ConversionError(
      'An unexpected error occurred during SVG to Base64 conversion',
      'SVG_TO_BASE64_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to Base64 conversion wrapper
 */
export async function convertSvgToBase64Client(
  input: File | string,
  options: SvgToBase64Options = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const text = await input.text()
    return svgToBase64Handler(text, options)
  }
  
  return svgToBase64Handler(input, options)
}

/**
 * Server-side SVG to Base64 conversion wrapper
 */
export async function convertSvgToBase64Server(
  input: Buffer | string,
  options: SvgToBase64Options = {}
): Promise<ConversionResult> {
  return svgToBase64Handler(input, options)
}

/**
 * Extract SVG from base64 data URI
 */
export function extractSvgFromBase64(dataUri: string): string | null {
  try {
    if (!dataUri.startsWith('data:image/svg+xml')) {
      return null
    }
    
    if (dataUri.includes(';base64,')) {
      // Base64 encoded
      const base64Data = dataUri.split(';base64,')[1]
      return Buffer.from(base64Data, 'base64').toString('utf8')
    } else if (dataUri.includes(',')) {
      // URL encoded
      const urlData = dataUri.split(',')[1]
      return decodeURIComponent(urlData)
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Get data URI statistics
 */
export function getDataUriStats(dataUri: string): {
  encoding?: string
  size?: number
  isOptimized?: boolean
} {
  const stats: any = {}
  
  if (dataUri.includes(';base64,')) {
    stats.encoding = 'base64'
  } else if (dataUri.includes('data:image/svg+xml,')) {
    stats.encoding = 'url'
  }
  
  stats.size = Buffer.byteLength(dataUri, 'utf8')
  
  // Check for optimization indicators
  const hasComments = dataUri.includes('<!--')
  const hasExtraSpaces = dataUri.includes('  ') || dataUri.includes('\n')
  stats.isOptimized = !hasComments && !hasExtraSpaces
  
  return stats
}

/**
 * SVG to Base64 converter configuration
 */
export const svgToBase64Converter = {
  name: 'SVG to Base64',
  from: 'svg' as ImageFormat,
  to: 'svg' as ImageFormat, // Output is still SVG, just encoded
  handler: svgToBase64Handler,
  isClientSide: true,
  description: 'Convert SVG files to base64 data URIs for inline embedding in HTML, CSS, or JavaScript'
}