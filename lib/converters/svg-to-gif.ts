/**
 * SVG to GIF Converter Implementation
 * 
 * Converts SVG files to GIF format using CloudConvert API.
 * Supports quality control, resolution management, and animation preservation.
 * Uses ImageMagick engine through CloudConvert for high-quality conversion.
 */

import type { 
  ConversionHandler,
  ConversionOptions, 
  ConversionResult,
  ImageFormat
} from './types'
import { 
  ConversionError,
  UnsupportedFormatError,
  CorruptedFileError,
  FileValidationError
} from './errors'
import { validateFile, detectFileTypeFromBuffer } from './validation'
import { convertWithCloudConvert } from './cloudconvert-client'

/**
 * Extended conversion options for SVG to GIF
 */
interface SvgToGifOptions extends ConversionOptions {
  /** DPI for rasterization (default: 150) */
  density?: number
  /** Whether to preserve transparency (default: true) */
  transparent?: boolean
  /** Number of colors in palette (2-256, default: 256) */
  colors?: number
  /** Dithering algorithm (default: false) */
  dither?: boolean
  /** Fit method for resizing */
  fit?: 'scale' | 'crop' | 'pad' | 'fill'
  /** Strip metadata (default: true) */
  strip?: boolean
}

/**
 * Validate SVG file input
 */
function validateSvgInput(input: Buffer | string): void {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'utf-8') : input
  
  // Basic file validation
  const validation = validateFile(buffer, {
    allowedFormats: ['svg'],
    maxSize: 50 * 1024 * 1024 // 50MB for SVG files
  })
  
  if (!validation.isValid) {
    throw new FileValidationError(validation.error!)
  }
  
  // Detect file type
  const content = buffer.toString('utf-8')
  
  // Check for SVG content markers
  if (!content.includes('<svg') && !content.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG content - missing SVG tags')
  }
  
  // Basic SVG structure validation
  if (!content.includes('<svg') || !content.includes('</svg>')) {
    throw new UnsupportedFormatError(
      'unknown',
      ['svg'],
      'File does not appear to be a valid SVG document'
    )
  }
}

/**
 * SVG to GIF conversion handler using CloudConvert
 */
export const svgToGifHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> => {
  try {
    // Convert string input to Buffer if needed
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'utf-8') : input
    
    // Validate input
    validateSvgInput(inputBuffer)
    
    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    console.log('[SVG-to-GIF] Starting CloudConvert conversion...')
    
    // Prepare CloudConvert options
    const cloudConvertOptions = {
      onProgress: (progress: number) => {
        if (options.onProgress) {
          // Map CloudConvert progress to 0.1 - 1.0 range
          options.onProgress(0.1 + progress * 0.9)
        }
      },
      // CloudConvert-specific parameters for SVG to GIF
      conversionParams: {
        quality: options.quality || 85,
        fit: options.fit || 'scale',
        density: options.density || 150,
        strip: options.strip !== false,
        ...(options.width && { width: options.width }),
        ...(options.height && { height: options.height }),
        ...(options.colors && { colors: Math.min(Math.max(options.colors, 2), 256) }),
        ...(options.dither !== undefined && { dither: options.dither }),
        ...(options.transparent !== undefined && { transparent: options.transparent })
      }
    }
    
    // Use CloudConvert for SVG to GIF conversion
    const result = await convertWithCloudConvert(
      inputBuffer,
      'svg',
      'gif',
      'image.svg',
      cloudConvertOptions
    )
    
    if (!result.success) {
      throw new ConversionError(
        `CloudConvert SVG to GIF failed: ${result.error}`,
        'CLOUDCONVERT_SVG_TO_GIF_FAILED'
      )
    }
    
    if (!result.data) {
      throw new ConversionError(
        'CloudConvert SVG to GIF returned no data',
        'CLOUDCONVERT_NO_DATA'
      )
    }
    
    // Ensure we return Buffer data for GIF
    const gifData = typeof result.data === 'string' 
      ? Buffer.from(result.data, 'base64')
      : result.data
    
    console.log('[SVG-to-GIF] CloudConvert conversion completed:', {
      inputSize: inputBuffer.length,
      outputSize: gifData.length,
      quality: options.quality || 85,
      density: options.density || 150
    })
    
    return {
      success: true,
      data: gifData,
      mimeType: 'image/gif',
      metadata: {
        format: 'gif',
        size: gifData.length,
        method: 'cloudconvert',
        originalFormat: 'svg',
        engine: 'imagemagick',
        quality: options.quality || 85,
        density: options.density || 150,
        colors: options.colors || 256,
        fit: options.fit || 'scale',
        transparent: options.transparent !== false,
        animated: false // Single frame from SVG
      }
    }
    
  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }
    
    // Handle unknown errors
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new ConversionError(
      `Failed to convert SVG file: ${message}`,
      'SVG_TO_GIF_FAILED'
    )
  }
}

/**
 * Client-side SVG to GIF conversion wrapper
 */
export async function convertSvgToGifClient(
  file: File,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return svgToGifHandler(buffer, options)
}

/**
 * Server-side SVG to GIF conversion wrapper
 */
export async function convertSvgToGifServer(
  buffer: Buffer,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> {
  return svgToGifHandler(buffer, options)
}

/**
 * SVG to GIF converter configuration
 */
export const svgToGifConverter = {
  name: 'SVG to GIF',
  from: 'svg' as const,
  to: 'gif' as const,
  handler: svgToGifHandler,
  isClientSide: false, // Uses CloudConvert API
  description: 'Convert SVG images to GIF format using CloudConvert API with ImageMagick engine'
}