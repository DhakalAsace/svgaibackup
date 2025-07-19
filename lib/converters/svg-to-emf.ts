/**
 * SVG to EMF Converter Implementation
 * 
 * This module provides SVG to EMF (Enhanced Metafile) conversion using CloudConvert API.
 * EMF is a 32-bit Windows metafile format that stores GDI commands.
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
import { convertWithCloudConvert } from './cloudconvert-client'

/**
 * Basic SVG file validation
 */
function validateSvgFile(input: Buffer | string): void {
  const svgContent = typeof input === 'string' ? input : input.toString('utf8')
  
  if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
    throw new FileValidationError('Invalid SVG content - missing SVG tags')
  }
}

/**
 * Convert SVG to EMF using CloudConvert API
 */
export const svgToEmfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    // Skip client-side SVG validation - let CloudConvert handle file validation
    // validateSvgFile(input)

    // Ensure we have a Buffer to work with
    const buffer = typeof input === 'string' 
      ? Buffer.from(input, 'utf8') 
      : input

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Convert using CloudConvert API
    const result = await convertWithCloudConvert(
      buffer,
      'svg',
      'emf',
      'input.svg',
      {
        width: options.width,
        height: options.height,
        preserveAspectRatio: options.preserveAspectRatio,
        onProgress: (progress) => {
          // Map CloudConvert progress to 0.1-1.0 range (0.1 already reported)
          if (options.onProgress) {
            options.onProgress(0.1 + (progress * 0.9))
          }
        }
      }
    )

    if (!result.data) {
      throw new ConversionError(
        'CloudConvert SVG to EMF returned no data',
        'CLOUDCONVERT_NO_DATA'
      )
    }

    return {
      success: true,
      data: result.data,
      mimeType: 'image/x-emf',
      metadata: {
        format: 'emf',
        size: result.data.length,
        method: 'cloudconvert'
      }
    }

  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }

    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to EMF conversion failed: ${error.message}`,
        'SVG_TO_EMF_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to EMF conversion',
      'SVG_TO_EMF_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to EMF conversion wrapper
 */
export async function convertSvgToEmfClient(
  file: File,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Read file as text for SVG
  const text = await file.text()
  
  // Use the main handler
  return svgToEmfHandler(text, options)
}

/**
 * Server-side SVG to EMF conversion wrapper
 */
export async function convertSvgToEmfServer(
  buffer: Buffer,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return svgToEmfHandler(buffer, options)
}

/**
 * SVG to EMF converter configuration
 */
export const svgToEmfConverter = {
  name: 'SVG to EMF',
  from: 'svg' as ImageFormat,
  to: 'emf' as ImageFormat,
  handler: svgToEmfHandler,
  isClientSide: false,
  description: 'Convert SVG files to Windows Enhanced Metafile format using CloudConvert'
}