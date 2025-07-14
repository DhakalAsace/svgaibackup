/**
 * SVG to BMP Converter - Browser Implementation
 * 
 * This module provides SVG to BMP conversion using Canvas API for browser environments.
 * Creates BMP files with proper headers and pixel data formatting.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult 
} from './types'
import { 
  ConversionError, 
  FileValidationError 
} from './errors'

/**
 * Extended conversion options for SVG to BMP
 */
interface SvgToBmpOptions extends ConversionOptions {
  /** BMP bit depth (24 or 32) - default: 24 */
  bitDepth?: 24 | 32
  /** DPI for rasterization (default: 96) */
  dpi?: number
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an SVG
 */
function validateSvgInput(input: Buffer | string): string {
  // If string, check if it's valid SVG
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
      throw new FileValidationError('Invalid SVG: Missing SVG tag')
    }
    return trimmed
  }
  
  // If buffer, convert to string
  const svgString = Buffer.from(input).toString('utf-8').trim()
  if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG: Missing SVG tag')
  }
  
  return svgString
}

/**
 * Creates a BMP file from canvas image data
 */
function createBmpFromImageData(
  imageData: ImageData,
  bitDepth: number = 24
): ArrayBuffer {
  const width = imageData.width
  const height = imageData.height
  const pixels = imageData.data
  
  // BMP uses bottom-up pixel order and requires row padding to 4-byte boundary
  const bytesPerPixel = bitDepth / 8
  const rowSize = Math.ceil((width * bytesPerPixel) / 4) * 4
  const pixelDataSize = rowSize * height
  
  // BMP file header (14 bytes)
  const fileHeaderSize = 14
  // BMP info header (40 bytes for BITMAPINFOHEADER)
  const infoHeaderSize = 40
  
  const headerSize = fileHeaderSize + infoHeaderSize
  const fileSize = headerSize + pixelDataSize
  
  // Create ArrayBuffer for entire BMP file
  const buffer = new ArrayBuffer(fileSize)
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  
  // File header
  // Signature "BM"
  view.setUint8(0, 0x42)
  view.setUint8(1, 0x4D)
  // File size
  view.setUint32(2, fileSize, true)
  // Reserved
  view.setUint32(6, 0, true)
  // Pixel data offset
  view.setUint32(10, headerSize, true)
  
  // Info header (BITMAPINFOHEADER)
  // Header size
  view.setUint32(14, infoHeaderSize, true)
  // Width
  view.setInt32(18, width, true)
  // Height (positive for bottom-up)
  view.setInt32(22, height, true)
  // Planes
  view.setUint16(26, 1, true)
  // Bit depth
  view.setUint16(28, bitDepth, true)
  // Compression (0 = none)
  view.setUint32(30, 0, true)
  // Image size
  view.setUint32(34, pixelDataSize, true)
  // X pixels per meter (96 DPI = 3780 ppm)
  view.setInt32(38, 3780, true)
  // Y pixels per meter
  view.setInt32(42, 3780, true)
  // Colors used
  view.setUint32(46, 0, true)
  // Important colors
  view.setUint32(50, 0, true)
  
  // Write pixel data (bottom-up)
  let offset = headerSize
  
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      
      if (bitDepth === 24) {
        // BMP uses BGR order
        bytes[offset++] = pixels[i + 2] // Blue
        bytes[offset++] = pixels[i + 1] // Green
        bytes[offset++] = pixels[i]     // Red
      } else if (bitDepth === 32) {
        // BGRA order
        bytes[offset++] = pixels[i + 2] // Blue
        bytes[offset++] = pixels[i + 1] // Green
        bytes[offset++] = pixels[i]     // Red
        bytes[offset++] = pixels[i + 3] // Alpha
      }
    }
    
    // Add padding to reach 4-byte boundary
    const padding = rowSize - (width * bytesPerPixel)
    for (let p = 0; p < padding; p++) {
      bytes[offset++] = 0
    }
  }
  
  return buffer
}

/**
 * Browser-based SVG to BMP converter using Canvas API
 */
export const svgToBmpHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToBmpOptions = {}
): Promise<ConversionResult> => {
  try {
    // Validate and get SVG string
    const svgString = validateSvgInput(input)
    
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    // Parse SVG to get dimensions
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')
    const svgElement = svgDoc.documentElement as unknown as SVGSVGElement
    
    // Check for parse errors
    if (svgElement.tagName === 'parsererror') {
      throw new FileValidationError('Invalid SVG: Parse error')
    }
    
    // Get SVG dimensions
    let width = options.width || parseInt(svgElement.getAttribute('width') || '0')
    let height = options.height || parseInt(svgElement.getAttribute('height') || '0')
    
    // If no dimensions, try viewBox
    if (!width || !height) {
      const viewBox = svgElement.getAttribute('viewBox')
      if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
        width = width || vbWidth
        height = height || vbHeight
      }
    }
    
    // Default dimensions if still not found
    if (!width || !height) {
      width = width || 800
      height = height || 600
    }
    
    // Apply DPI scaling
    const dpi = options.dpi || 96
    const scale = dpi / 96
    const canvasWidth = Math.round(width * scale)
    const canvasHeight = Math.round(height * scale)
    
    if (options.onProgress) {
      options.onProgress(0.3)
    }
    
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      throw new ConversionError('Failed to create canvas context')
    }
    
    // Set white background by default (BMP doesn't support transparency well)
    ctx.fillStyle = options.background || '#FFFFFF'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Scale context for DPI
    if (scale !== 1) {
      ctx.scale(scale, scale)
    }
    
    if (options.onProgress) {
      options.onProgress(0.5)
    }
    
    // Convert SVG to blob URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = async () => {
        try {
          // Draw image to canvas
          ctx.drawImage(img, 0, 0, width, height)
          
          if (options.onProgress) {
            options.onProgress(0.7)
          }
          
          // Get image data from canvas
          const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
          
          // Create BMP from image data
          const bitDepth = options.bitDepth || 24
          const bmpArrayBuffer = createBmpFromImageData(imageData, bitDepth)
          const bmpBuffer = Buffer.from(bmpArrayBuffer)
          
          if (options.onProgress) {
            options.onProgress(1)
          }
          
          URL.revokeObjectURL(svgUrl)
          
          resolve({
            success: true,
            data: bmpBuffer,
            mimeType: 'image/bmp',
            metadata: {
              width: canvasWidth,
              height: canvasHeight,
              format: 'bmp',
              size: bmpBuffer.length,
              bitDepth,
              dpi,
              originalFormat: 'svg'
            }
          })
        } catch (error) {
          URL.revokeObjectURL(svgUrl)
          reject(error)
        }
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(svgUrl)
        reject(new ConversionError('Failed to load SVG image'))
      }
      
      // Set crossOrigin to handle CORS
      img.crossOrigin = 'anonymous'
      img.src = svgUrl
    })
  } catch (error) {
    if (error instanceof ConversionError || 
        error instanceof FileValidationError) {
      throw error
    }
    
    throw new ConversionError(
      `SVG to BMP conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}