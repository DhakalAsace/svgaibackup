/**
 * SVG to WMF Converter Implementation
 * 
 * This module provides SVG to WMF (Windows Metafile) conversion using CloudConvert API.
 * WMF is a 16-bit Windows metafile format that stores GDI commands.
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
 * Convert SVG to WMF using CloudConvert API
 */
export const svgToWmfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    // Basic SVG validation
    validateSvgFile(input)

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
      'wmf',
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

    return {
      success: true,
      data: result.data,
      mimeType: 'image/x-wmf',
      metadata: {
        format: 'wmf',
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
        `SVG to WMF conversion failed: ${error.message}`,
        'SVG_TO_WMF_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to WMF conversion',
      'SVG_TO_WMF_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to WMF conversion wrapper
 */
export async function convertSvgToWmfClient(
  file: File,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Read file as text for SVG
  const text = await file.text()
  
  // Use the main handler
  return svgToWmfHandler(text, options)
}

/**
 * Server-side SVG to WMF conversion wrapper
 */
export async function convertSvgToWmfServer(
  buffer: Buffer,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return svgToWmfHandler(buffer, options)
}

/**
 * SVG to WMF converter configuration
 */
export const svgToWmfConverter = {
  name: 'SVG to WMF',
  from: 'svg' as ImageFormat,
  to: 'wmf' as ImageFormat,
  handler: svgToWmfHandler,
  isClientSide: false,
  description: 'Convert SVG files to Windows Metafile format using CloudConvert'
}