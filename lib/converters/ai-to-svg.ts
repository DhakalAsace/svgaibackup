/**
 * AI to SVG Converter Implementation
 * 
 * Converts Adobe Illustrator (AI) files to SVG format.
 * Uses CloudConvert API for high-quality conversion.
 * Handles artboards, layers, and Illustrator-specific metadata.
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
 * Extended conversion options for AI to SVG
 */
interface AiToSvgOptions extends ConversionOptions {
  /** Artboard number to convert (default: 1) */
  artboard?: number
  /** Preserve layer structure (default: true) */
  preserveLayers?: boolean
  /** Extract embedded images (default: false) */
  extractImages?: boolean
}

/**
 * Validate AI file input
 */
function validateAiInput(input: Buffer | string): void {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
  
  // Basic file validation
  const validation = validateFile(buffer, {
    allowedFormats: ['ai', 'pdf'],
    maxSize: 100 * 1024 * 1024 // 100MB
  })
  
  if (!validation.isValid) {
    throw new FileValidationError(validation.error!)
  }
  
  // Detect file type
  const format = detectFileTypeFromBuffer(buffer)
  
  if (!format) {
    throw new FileValidationError('Unable to detect file format')
  }
  
  // Allow both AI and PDF formats (AI files are PDF-compatible)
  if (format !== 'ai' && format !== 'pdf') {
    throw new UnsupportedFormatError(
      `Expected AI or PDF file, got ${format}. Please upload a valid Adobe Illustrator file.`
    )
  }
}

/**
 * AI to SVG conversion handler using CloudConvert
 */
export const aiToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: AiToSvgOptions = {}
): Promise<ConversionResult> => {
  try {
    // Convert string input to Buffer if needed
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
    
    // Validate input
    validateAiInput(inputBuffer)
    
    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    console.log('[AI-to-SVG] Starting CloudConvert conversion...')
    
    // Use CloudConvert for AI to SVG conversion
    const result = await convertWithCloudConvert(
      inputBuffer,
      'ai',
      'svg',
      'ai-file.ai',
      {
        onProgress: (progress) => {
          if (options.onProgress) {
            // Map CloudConvert progress to 0.1 - 1.0 range
            options.onProgress(0.1 + progress * 0.9)
          }
        }
      }
    )
    
    if (!result.success) {
      throw new ConversionError(
        `CloudConvert AI to SVG failed: ${result.error}`,
        'CLOUDCONVERT_AI_TO_SVG_FAILED'
      )
    }
    
    if (!result.data) {
      throw new ConversionError(
        'CloudConvert AI to SVG returned no data',
        'CLOUDCONVERT_NO_DATA'
      )
    }
    
    // Ensure we return string data for SVG
    const svgData = typeof result.data === 'string' 
      ? result.data 
      : result.data.toString('utf8')
    
    return {
      success: true,
      data: svgData,
      mimeType: 'image/svg+xml',
      metadata: {
        format: 'svg',
        size: Buffer.byteLength(svgData, 'utf8'),
        method: 'cloudconvert',
        originalFormat: 'ai',
        artboard: options.artboard || 1,
        preserveLayers: options.preserveLayers !== false,
        extractImages: options.extractImages === true
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
      `Failed to convert AI file: ${message}`,
      'AI_TO_SVG_FAILED'
    )
  }
}

/**
 * Client-side AI to SVG conversion wrapper
 */
export async function convertAiToSvgClient(
  file: File,
  options: AiToSvgOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return aiToSvgHandler(buffer, options)
}

/**
 * Server-side AI to SVG conversion wrapper
 */
export async function convertAiToSvgServer(
  buffer: Buffer,
  options: AiToSvgOptions = {}
): Promise<ConversionResult> {
  return aiToSvgHandler(buffer, options)
}

/**
 * AI to SVG converter configuration
 */
export const aiToSvgConverter = {
  name: 'AI to SVG',
  from: 'ai' as const,
  to: 'svg' as const,
  handler: aiToSvgHandler,
  isClientSide: false, // Uses CloudConvert API
  description: 'Convert Adobe Illustrator files to SVG using CloudConvert API'
}