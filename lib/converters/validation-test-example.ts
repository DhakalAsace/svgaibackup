/**
 * Validation Test Example
 * 
 * This file demonstrates how to use the enhanced validation system
 * for the 40 converter types with comprehensive error handling.
 */

import { 
  validateFile, 
  validateConversionParams,
  isConversionSupported,
  detectFileTypeFromBuffer 
} from './validation'
import { 
  FileValidationError,
  FileSizeError,
  UnsupportedFormatError,
  CorruptedFileError,
  DimensionError,
  InvalidParameterError,
  SecurityError,
  ConverterError,
  createDetailedErrorResponse,
  getUserFriendlyError
} from './errors'
import type { ImageFormat, ConversionOptions } from './types'

/**
 * Example: Validate a file before conversion
 */
export async function validateFileBeforeConversion(
  file: File | Buffer,
  targetFormat: ImageFormat
): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Validate the input file
    const validation = validateFile(file, {
      targetFormat
    })
    
    if (!validation.isValid) {
      return { 
        success: false, 
        error: validation.error 
      }
    }
    
    // Step 2: Check if conversion is supported
    const sourceFormat = validation.format!
    const conversionCheck = isConversionSupported(sourceFormat, targetFormat)
    
    if (!conversionCheck.supported) {
      return { 
        success: false, 
        error: conversionCheck.reason 
      }
    }
    
    return { success: true }
  } catch (error) {
    // Handle any unexpected errors
    return { 
      success: false, 
      error: getUserFriendlyError(error) 
    }
  }
}

/**
 * Example: Validate conversion parameters
 */
export function validateConversionOptions(
  options: ConversionOptions,
  fromFormat: ImageFormat,
  toFormat: ImageFormat
): { success: boolean; error?: string } {
  const validation = validateConversionParams(options, fromFormat, toFormat)
  
  if (!validation.isValid) {
    return { 
      success: false, 
      error: validation.error 
    }
  }
  
  return { success: true }
}

/**
 * Example: Handle different error types with user-friendly messages
 */
export function handleConversionError(error: unknown): string {
  if (error instanceof FileSizeError) {
    return `Your file is too large (${(error.size / 1024 / 1024).toFixed(1)}MB). 
            The maximum size allowed is ${(error.maxSize / 1024 / 1024).toFixed(1)}MB. 
            Try compressing your file or using a lower resolution.`
  }
  
  if (error instanceof DimensionError) {
    return `Your image is too large (${error.width}x${error.height} pixels). 
            The maximum dimensions allowed are ${error.maxWidth}x${error.maxHeight} pixels. 
            Please resize your image and try again.`
  }
  
  if (error instanceof SecurityError) {
    return `Security warning: ${error.message} 
            For your safety, we cannot process files containing scripts or external references.`
  }
  
  if (error instanceof CorruptedFileError) {
    return `Your file appears to be damaged or incomplete. 
            Try opening it in its original application and re-saving it, 
            or use a different file.`
  }
  
  if (error instanceof UnsupportedFormatError) {
    const supportedFormats = error.supportedFormats?.join(', ') || 'various formats'
    return `The format "${error.format}" is not supported for this conversion. 
            We support: ${supportedFormats}. 
            Try converting your file to one of these formats first.`
  }
  
  // Fallback to generic user-friendly error
  return getUserFriendlyError(error)
}

/**
 * Example: Format-specific validation messages
 */
export const FORMAT_SPECIFIC_TIPS: Record<ImageFormat, string> = {
  png: 'PNG files work best for images with transparency or sharp edges.',
  jpg: 'JPEG files are ideal for photographs but don\'t support transparency.',
  jpeg: 'JPEG files are ideal for photographs but don\'t support transparency.',
  gif: 'GIF files support animation but are limited to 256 colors.',
  webp: 'WebP provides excellent compression for both photos and graphics.',
  bmp: 'BMP files are uncompressed and may be very large.',
  svg: 'SVG files are vector graphics that scale perfectly at any size.',
  pdf: 'PDF files may contain multiple pages. Only the first page will be converted.',
  ico: 'ICO files are limited to 256x256 pixels for compatibility.',
  tiff: 'TIFF files support multiple layers and high color depth.',
  eps: 'EPS files are PostScript graphics suitable for print design.',
  ai: 'AI files are Adobe Illustrator\'s native format with rich vector features.',
  dxf: 'DXF files are CAD drawings that contain precise geometric data.',
  stl: 'STL files contain 3D model data commonly used for 3D printing.',
  avif: 'AVIF provides excellent compression with modern browser support.',
  cdr: 'CDR files are CorelDRAW\'s native vector graphics format.',
  mp4: 'MP4 files are video format that can be converted to animated sequences.',
  html: 'HTML can be rendered and converted to visual formats.',
  ttf: 'TTF font files contain vector glyph data that can be extracted.',
  emf: 'EMF files are Windows Enhanced Metafiles with vector and raster data.',
  wmf: 'WMF files are Windows Metafiles, an older vector graphics format.'
}

/**
 * Example: Validate and provide format-specific advice
 */
export function validateWithAdvice(
  file: File | Buffer,
  targetFormat: ImageFormat
): { 
  valid: boolean; 
  error?: string; 
  advice?: string 
} {
  const validation = validateFile(file)
  
  if (!validation.isValid) {
    return { 
      valid: false, 
      error: validation.error 
    }
  }
  
  const sourceFormat = validation.format!
  const conversionCheck = isConversionSupported(sourceFormat, targetFormat)
  
  if (!conversionCheck.supported) {
    return { 
      valid: false, 
      error: conversionCheck.reason 
    }
  }
  
  // Provide format-specific advice
  const advice = FORMAT_SPECIFIC_TIPS[sourceFormat]
  
  return { 
    valid: true, 
    advice 
  }
}

/**
 * Example: Comprehensive error response for API
 */
export function createApiErrorResponse(error: unknown): {
  success: false
  error: string
  code: string
  statusCode: number
  userMessage: string
  technicalDetails?: any
} {
  const errorResponse = createDetailedErrorResponse(error)
  
  return {
    success: false,
    error: errorResponse.error,
    code: errorResponse.code,
    statusCode: error instanceof ConverterError ? (error as any).statusCode : 500,
    userMessage: getUserFriendlyError(error),
    technicalDetails: process.env.NODE_ENV === 'development' ? {
      stack: error instanceof Error ? error.stack : undefined,
      details: errorResponse.details
    } : undefined
  }
}