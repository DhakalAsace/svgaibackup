/**
 * SVG to TIFF Converter - Browser Implementation
 * 
 * This module provides SVG to TIFF conversion using Canvas API and UTIF.js
 * for browser environments. Since TIFF is rarely needed in browsers,
 * this provides a basic implementation.
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

/**
 * Extended conversion options for SVG to TIFF
 */
interface SvgToTiffOptions extends ConversionOptions {
  /** DPI for rasterization (default: 300 for TIFF) */
  dpi?: number
  /** Background color (default: white) */
  background?: string
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
 * Browser-based SVG to TIFF converter using Canvas API and UTIF
 */
export const svgToTiffBrowserHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToTiffOptions = {}
): Promise<ConversionResult> => {
  try {
    // Dynamically import UTIF
    const UTIF = await import('utif').then(m => m.default || m)
    
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
    
    // Apply DPI scaling (higher DPI for TIFF)
    const dpi = options.dpi || 300
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
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new ConversionError('Failed to create canvas context')
    }
    
    // Set background
    const backgroundColor = options.background || '#ffffff'
    ctx.fillStyle = backgroundColor
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
          const rgba = new Uint8Array(imageData.data)
          
          // Create TIFF using UTIF
          const tiffs = [{
            width: canvasWidth,
            height: canvasHeight,
            data: rgba
          }]
          
          // Encode to TIFF
          const tiffBuffer = UTIF.encodeImage(rgba, canvasWidth, canvasHeight)
          
          URL.revokeObjectURL(svgUrl)
          
          if (options.onProgress) {
            options.onProgress(1)
          }
          
          resolve({
            success: true,
            data: Buffer.from(tiffBuffer),
            mimeType: 'image/tiff',
            metadata: {
              width: canvasWidth,
              height: canvasHeight,
              format: 'tiff',
              size: tiffBuffer.byteLength,
              dpi,
              originalFormat: 'svg',
              background: backgroundColor
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
        error instanceof FileValidationError ||
        error instanceof UnsupportedFormatError) {
      throw error
    }
    
    throw new ConversionError(
      `SVG to TIFF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Export as default for consistency with other browser converters
 */
export default svgToTiffBrowserHandler