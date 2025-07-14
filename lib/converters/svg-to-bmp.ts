/**
 * SVG to BMP Converter Implementation
 * 
 * This module provides SVG to BMP conversion using the sharp library.
 * Supports various BMP bit depths and conversion options.
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

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Extended conversion options for SVG to BMP
 */
interface SvgToBmpOptions extends ConversionOptions {
  /** BMP bit depth (1, 4, 8, 16, 24, 32) - default: 24 */
  bitDepth?: 1 | 4 | 8 | 16 | 24 | 32
  /** DPI for rasterization (default: 96) */
  density?: number
  /** Whether to apply compression (RLE for 4 and 8-bit) */
  compression?: boolean
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an SVG image
 */
function validateSvgInput(input: Buffer | string): void {
  if (typeof input === 'string') {
    // Check if it's a base64 string or raw SVG
    const isBase64 = /^data:image\/svg\+xml;base64,/.test(input) || 
                     /^[A-Za-z0-9+/]+=*$/.test(input)
    
    if (!isBase64 && !input.includes('<svg')) {
      throw new UnsupportedFormatError(
        undefined,
        ['svg'],
        'Input does not appear to be valid SVG content'
      )
    }
  } else {
    const format = detectFileTypeFromBuffer(input)
    
    if (!format) {
      // Check if it's SVG by content
      const textStart = input.toString('utf8', 0, Math.min(1000, input.length))
      if (!textStart.includes('<svg') && !textStart.includes('<?xml')) {
        throw new FileValidationError('Unable to detect file format')
      }
    } else if (format !== 'svg') {
      throw new UnsupportedFormatError(
        format,
        ['svg'],
        `Expected SVG format but received ${format}`
      )
    }
  }
}

/**
 * Maps bit depth to sharp BMP options
 */
function getBmpOptions(bitDepth: number): { channels?: 1 | 3 | 4; depth?: 'uchar' } {
  switch (bitDepth) {
    case 1:
    case 4:
    case 8:
      // Grayscale for lower bit depths
      return { channels: 1, depth: 'uchar' }
    case 16:
      // 16-bit typically uses RGB565 format
      return { channels: 3, depth: 'uchar' }
    case 24:
      // Standard RGB
      return { channels: 3, depth: 'uchar' }
    case 32:
      // RGBA with alpha channel
      return { channels: 4, depth: 'uchar' }
    default:
      return { channels: 3, depth: 'uchar' }
  }
}

/**
 * Converts SVG to BMP using either Canvas API (browser) or sharp (server)
 * Implements the ConversionHandler interface
 */
export const svgToBmpHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToBmpOptions = {}
): Promise<ConversionResult> => {
  // Use browser implementation if in browser environment
  if (isBrowser) {
    const { svgToBmpHandler: browserHandler } = await import('./svg-to-bmp-browser')
    return browserHandler(input, options)
  }
  
  try {
    // Server-side implementation using sharp
    const sharp = await import('sharp').then(m => m.default)
    
    // Validate input is SVG
    validateSvgInput(input)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Prepare the input buffer
    let svgBuffer: Buffer
    if (typeof input === 'string') {
      // Handle base64 encoded SVG
      if (input.startsWith('data:image/svg+xml;base64,')) {
        const base64Data = input.replace('data:image/svg+xml;base64,', '')
        svgBuffer = Buffer.from(base64Data, 'base64')
      } else if (/^[A-Za-z0-9+/]+=*$/.test(input)) {
        // Plain base64 string
        svgBuffer = Buffer.from(input, 'base64')
      } else {
        // Raw SVG string
        svgBuffer = Buffer.from(input, 'utf8')
      }
    } else {
      svgBuffer = input
    }

    // Report progress after input preparation
    if (options.onProgress) {
      options.onProgress(0.3)
    }

    // Configure sharp for SVG to BMP conversion
    const bitDepth = options.bitDepth || 24
    const bmpOptions = getBmpOptions(bitDepth)
    const density = options.density || 96

    // Create sharp instance with SVG input
    let sharpInstance = sharp(svgBuffer, {
      density: density
    })

    // Apply dimensions if specified
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize({
        width: options.width,
        height: options.height,
        fit: options.preserveAspectRatio ? 'inside' : 'fill',
        background: options.background || { r: 255, g: 255, b: 255, alpha: 1 }
      })
    }

    // Report progress before format conversion
    if (options.onProgress) {
      options.onProgress(0.6)
    }

    // Apply color channel conversion based on bit depth
    if (bmpOptions.channels === 1) {
      sharpInstance = sharpInstance.grayscale()
    } else if (bmpOptions.channels === 3) {
      sharpInstance = sharpInstance.removeAlpha()
    }

    // Convert to BMP format
    // Note: Sharp doesn't have direct BMP output, so we convert to raw bitmap
    // and add BMP headers manually
    const rawData = await sharpInstance
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Report progress after conversion
    if (options.onProgress) {
      options.onProgress(0.8)
    }

    // Create BMP file with proper headers
    const bmpBuffer = createBmpFromRaw(
      rawData.data,
      rawData.info.width,
      rawData.info.height,
      bitDepth
    )

    // Report completion
    if (options.onProgress) {
      options.onProgress(1)
    }

    return {
      success: true,
      data: bmpBuffer,
      mimeType: 'image/bmp',
      metadata: {
        width: rawData.info.width,
        height: rawData.info.height,
        format: 'bmp',
        size: bmpBuffer.length
      }
    }

  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError) {
      throw error
    }

    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to BMP conversion failed: ${error.message}`,
        'SVG_TO_BMP_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to BMP conversion',
      'SVG_TO_BMP_UNKNOWN_ERROR'
    )
  }
}

/**
 * Creates a BMP file from raw pixel data
 */
function createBmpFromRaw(
  pixelData: Buffer,
  width: number,
  height: number,
  bitDepth: number
): Buffer {
  // Calculate row size with padding to 4-byte boundary
  const bytesPerPixel = bitDepth / 8
  const rowSize = Math.ceil((width * bitDepth) / 32) * 4
  const pixelDataSize = rowSize * height
  
  // BMP file header (14 bytes)
  const fileHeaderSize = 14
  // BMP info header (40 bytes for BITMAPINFOHEADER)
  const infoHeaderSize = 40
  // Color table size (for indexed colors)
  const colorTableSize = bitDepth <= 8 ? (1 << bitDepth) * 4 : 0
  
  const headerSize = fileHeaderSize + infoHeaderSize + colorTableSize
  const fileSize = headerSize + pixelDataSize
  
  // Create buffer for entire BMP file
  const bmp = Buffer.alloc(fileSize)
  
  // File header
  bmp.write('BM', 0) // Signature
  bmp.writeUInt32LE(fileSize, 2) // File size
  bmp.writeUInt32LE(0, 6) // Reserved
  bmp.writeUInt32LE(headerSize, 10) // Pixel data offset
  
  // Info header (BITMAPINFOHEADER)
  bmp.writeUInt32LE(infoHeaderSize, 14) // Header size
  bmp.writeInt32LE(width, 18) // Width
  bmp.writeInt32LE(-height, 22) // Height (negative for top-down)
  bmp.writeUInt16LE(1, 26) // Planes
  bmp.writeUInt16LE(bitDepth, 28) // Bit depth
  bmp.writeUInt32LE(0, 30) // Compression (0 = none)
  bmp.writeUInt32LE(pixelDataSize, 34) // Image size
  bmp.writeInt32LE(2835, 38) // X pixels per meter (72 DPI)
  bmp.writeInt32LE(2835, 42) // Y pixels per meter (72 DPI)
  bmp.writeUInt32LE(colorTableSize / 4, 46) // Colors used
  bmp.writeUInt32LE(colorTableSize / 4, 50) // Important colors
  
  // Color table for indexed colors
  if (bitDepth <= 8) {
    const colors = 1 << bitDepth
    for (let i = 0; i < colors; i++) {
      const gray = Math.floor((i * 255) / (colors - 1))
      const offset = 54 + i * 4
      bmp.writeUInt8(gray, offset) // Blue
      bmp.writeUInt8(gray, offset + 1) // Green
      bmp.writeUInt8(gray, offset + 2) // Red
      bmp.writeUInt8(0, offset + 3) // Reserved
    }
  }
  
  // Copy pixel data with proper row padding
  let srcOffset = 0
  let dstOffset = headerSize
  
  for (let y = 0; y < height; y++) {
    const rowBytes = width * bytesPerPixel
    
    // Copy pixel data for this row
    pixelData.copy(bmp, dstOffset, srcOffset, srcOffset + rowBytes)
    
    // Add padding bytes if needed
    const padding = rowSize - rowBytes
    if (padding > 0) {
      bmp.fill(0, dstOffset + rowBytes, dstOffset + rowSize)
    }
    
    srcOffset += rowBytes
    dstOffset += rowSize
  }
  
  return bmp
}

/**
 * Client-side SVG to BMP conversion wrapper
 * This function can be used in browser environments
 */
export async function convertSvgToBmpClient(
  input: File | string,
  options: SvgToBmpOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    // Read file as text for SVG
    const text = await input.text()
    return svgToBmpHandler(text, options)
  }
  
  // Direct string input
  return svgToBmpHandler(input, options)
}

/**
 * Server-side SVG to BMP conversion wrapper
 * This function is optimized for server environments
 */
export async function convertSvgToBmpServer(
  input: Buffer | string,
  options: SvgToBmpOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return svgToBmpHandler(input, options)
}

/**
 * SVG to BMP converter configuration
 */
export const svgToBmpConverter = {
  name: 'SVG to BMP',
  from: 'svg' as ImageFormat,
  to: 'bmp' as ImageFormat,
  handler: svgToBmpHandler,
  isClientSide: true, // Now supports client-side via Canvas API
  description: 'Convert scalable vector graphics to BMP bitmap format with configurable bit depth'
}