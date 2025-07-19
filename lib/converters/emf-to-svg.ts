/**
 * EMF to SVG Converter Implementation
 * 
 * This module provides EMF (Enhanced Metafile) to SVG conversion using CloudConvert API.
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
 * Basic EMF file validation
 */
function validateEmfFile(buffer: Buffer): void {
  if (buffer.length < 88) {
    throw new FileValidationError('File too small to be a valid EMF file')
  }

  // Check EMF signature
  const signature = buffer.readUInt32LE(40)
  if (signature !== 0x464D4520) { // ' EMF' in little-endian
    throw new FileValidationError('Invalid EMF file signature')
  }

  // Check record type
  const recordType = buffer.readUInt32LE(0)
  if (recordType !== 0x00000001) { // EMR_HEADER
    throw new FileValidationError('Invalid EMF header record type')
  }
}

/**
 * Convert EMF buffer to SVG using CloudConvert API
 */
export const emfToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    // Ensure we have a Buffer to work with
    const buffer = typeof input === 'string' 
      ? Buffer.from(input, 'base64') 
      : input

    // Skip client-side EMF validation - let CloudConvert handle file validation
    // validateEmfFile(buffer)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Convert using CloudConvert API
    const result = await convertWithCloudConvert(
      buffer,
      'emf',
      'svg',
      'input.emf',
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
        'CloudConvert EMF to SVG returned no data',
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
        `EMF to SVG conversion failed: ${error.message}`,
        'EMF_TO_SVG_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during EMF to SVG conversion',
      'EMF_TO_SVG_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side EMF to SVG conversion wrapper
 */
export async function convertEmfToSvgClient(
  file: File,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // Use the main handler
  return emfToSvgHandler(buffer, options)
}

/**
 * Server-side EMF to SVG conversion wrapper
 */
export async function convertEmfToSvgServer(
  buffer: Buffer,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return emfToSvgHandler(buffer, options)
}

/**
 * EMF to SVG converter configuration
 */
export const emfToSvgConverter = {
  name: 'EMF to SVG',
  from: 'emf' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: emfToSvgHandler,
  isClientSide: false,
  description: 'Convert Windows Enhanced Metafile (EMF) to scalable vector graphics using CloudConvert'
}