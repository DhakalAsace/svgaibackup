/**
 * Image to SVG Converter Implementation
 * 
 * This module provides a generic interface for converting various image formats
 * to SVG. It delegates to specific converters based on the input format and
 * provides a unified API for all image to SVG conversions.
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
import { detectFileTypeFromBuffer, validateFile } from './validation'
import { pngToSvgHandler } from './png-to-svg'

/**
 * Extended conversion options for image to SVG
 */
interface ImageToSvgOptions extends ConversionOptions {
  /** Tracing algorithm (default: 'potrace') */
  algorithm?: 'potrace' | 'imagetracerjs'
  /** Color mode for tracing */
  colorMode?: 'color' | 'grayscale' | 'monochrome'
  /** Number of colors for color mode (default: 16) */
  colors?: number
  /** Threshold for black/white conversion (0-255, default: 128) */
  threshold?: number
  /** Path optimization level (0-3, default: 2) */
  optimize?: number
}

/**
 * Map of supported input formats to their handlers
 */
const FORMAT_HANDLERS: Partial<Record<ImageFormat, ConversionHandler>> = {
  png: pngToSvgHandler,
  jpg: pngToSvgHandler, // JPG uses same handler as PNG
  jpeg: pngToSvgHandler,
  gif: pngToSvgHandler,
  webp: pngToSvgHandler,
  bmp: pngToSvgHandler,
}

/**
 * Supported formats for image to SVG conversion
 */
const SUPPORTED_FORMATS: ImageFormat[] = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']

/**
 * Detects the format of the input image
 */
function detectImageFormat(input: Buffer | string | File): ImageFormat | null {
  if (input instanceof File) {
    // Try to get format from MIME type
    const mimeType = input.type.toLowerCase()
    if (mimeType.includes('png')) return 'png'
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg'
    if (mimeType.includes('gif')) return 'gif'
    if (mimeType.includes('webp')) return 'webp'
    if (mimeType.includes('bmp')) return 'bmp'
    
    // Try to get format from filename
    const ext = input.name.split('.').pop()?.toLowerCase()
    if (ext && SUPPORTED_FORMATS.includes(ext as ImageFormat)) {
      return ext as ImageFormat
    }
  }
  
  if (typeof input === 'string') {
    // String input is not an image format
    return null
  }
  
  // Buffer input - detect from file signature
  return detectFileTypeFromBuffer(input as Buffer)
}

/**
 * Generic image to SVG converter
 * Implements the ConversionHandler interface
 */
export const imageToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ImageToSvgOptions = {}
): Promise<ConversionResult> => {
  try {
    // Detect input format
    const format = detectImageFormat(input)
    
    if (!format) {
      throw new UnsupportedFormatError(
        undefined,
        SUPPORTED_FORMATS,
        'Unable to detect image format. Supported formats: PNG, JPG, GIF, WebP, BMP'
      )
    }
    
    if (!SUPPORTED_FORMATS.includes(format)) {
      throw new UnsupportedFormatError(
        format,
        SUPPORTED_FORMATS,
        `Format '${format}' is not supported for SVG conversion`
      )
    }
    
    // Get the appropriate handler
    const handler = FORMAT_HANDLERS[format]
    
    if (!handler) {
      throw new ConversionError(
        `No handler available for ${format} to SVG conversion`,
        'HANDLER_NOT_FOUND'
      )
    }
    
    // Delegate to specific handler
    return await handler(input, options)
    
  } catch (error) {
    if (error instanceof UnsupportedFormatError || 
        error instanceof ConversionError) {
      throw error
    }
    
    if (error instanceof Error) {
      throw new ConversionError(
        `Image to SVG conversion failed: ${error.message}`,
        'IMAGE_TO_SVG_FAILED'
      )
    }
    
    throw new ConversionError(
      'An unexpected error occurred during image to SVG conversion',
      'IMAGE_TO_SVG_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side image to SVG conversion wrapper
 */
export async function convertImageToSvgClient(
  input: File | Buffer,
  options: ImageToSvgOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    // Validate file
    const validation = validateFile(input, { 
      allowedFormats: SUPPORTED_FORMATS 
    })
    
    if (!validation.isValid) {
      throw new ConversionError(validation.error || 'Invalid file', 'VALIDATION_FAILED')
    }
    
    // Read file as buffer
    const buffer = Buffer.from(await input.arrayBuffer())
    return imageToSvgHandler(buffer, options)
  }
  
  return imageToSvgHandler(input, options)
}

/**
 * Server-side image to SVG conversion wrapper
 */
export async function convertImageToSvgServer(
  input: Buffer,
  options: ImageToSvgOptions = {}
): Promise<ConversionResult> {
  // Validate buffer
  const validation = validateFile(input, { 
    allowedFormats: SUPPORTED_FORMATS 
  })
  
  if (!validation.isValid) {
    throw new ConversionError(validation.error || 'Invalid file', 'VALIDATION_FAILED')
  }
  
  return imageToSvgHandler(input, options)
}

/**
 * Get supported input formats for image to SVG conversion
 */
export function getSupportedImageFormats(): ImageFormat[] {
  return [...SUPPORTED_FORMATS]
}

/**
 * Check if a format is supported for image to SVG conversion
 */
export function isFormatSupported(format: string): boolean {
  return SUPPORTED_FORMATS.includes(format.toLowerCase() as ImageFormat)
}

/**
 * Image to SVG converter configuration
 */
export const imageToSvgConverter = {
  name: 'Image to SVG',
  from: 'png' as ImageFormat, // Generic, accepts multiple formats
  to: 'svg' as ImageFormat,
  handler: imageToSvgHandler,
  isClientSide: true,
  description: 'Convert raster images (PNG, JPG, GIF, WebP, BMP) to scalable vector graphics using advanced tracing algorithms'
}