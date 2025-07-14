/**
 * WMF to SVG Converter Implementation
 * 
 * This module provides WMF (Windows Metafile) to SVG conversion using CloudConvert API.
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
 * Basic WMF file validation
 */
function validateWmfFile(buffer: Buffer): void {
  if (buffer.length < 18) {
    throw new FileValidationError('File too small to be a valid WMF file')
  }

  // Check WMF header signature
  const magic = buffer.readUInt16LE(0)
  const type = buffer.readUInt16LE(2)
  
  // WMF files start with a metafile header
  // Magic number should be 0x0001 (META_DISKMETAFILE) or 0x0002 (META_MEMORYMETAFILE)
  if (magic !== 0x0001 && magic !== 0x0002) {
    throw new FileValidationError('Invalid WMF file magic number')
  }

  // Header size should be 9 words (18 bytes)
  const headerSize = buffer.readUInt16LE(4)
  if (headerSize !== 9) {
    throw new FileValidationError('Invalid WMF header size')
  }
}

/**
 * Convert WMF buffer to SVG using CloudConvert API
 */
export const wmfToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    // Ensure we have a Buffer to work with
    const buffer = typeof input === 'string' 
      ? Buffer.from(input, 'base64') 
      : input

    // Basic WMF validation
    validateWmfFile(buffer)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Convert using CloudConvert API
    const result = await convertWithCloudConvert(
      buffer,
      'wmf',
      'svg',
      'input.wmf',
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
        `WMF to SVG conversion failed: ${error.message}`,
        'WMF_TO_SVG_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during WMF to SVG conversion',
      'WMF_TO_SVG_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side WMF to SVG conversion wrapper
 */
export async function convertWmfToSvgClient(
  file: File,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // Use the main handler
  return wmfToSvgHandler(buffer, options)
}

/**
 * Server-side WMF to SVG conversion wrapper
 */
export async function convertWmfToSvgServer(
  buffer: Buffer,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return wmfToSvgHandler(buffer, options)
}

/**
 * WMF to SVG converter configuration
 */
export const wmfToSvgConverter = {
  name: 'WMF to SVG',
  from: 'wmf' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: wmfToSvgHandler,
  isClientSide: false,
  description: 'Convert Windows Metafile (WMF) to scalable vector graphics using CloudConvert'
}