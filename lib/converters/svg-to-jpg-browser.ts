/**
 * SVG to JPG Converter - Browser Implementation
 * 
 * This module provides SVG to JPG conversion using Canvas API for browser environments.
 * Supports customization options including dimensions, background color, and quality.
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
 * Extended conversion options for SVG to JPG
 */
interface SvgToJpgOptions extends ConversionOptions {
  /** JPEG quality (0-100, default: 85) */
  quality?: number
  /** Background color (default: white, as JPEG doesn't support transparency) */
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
 * Browser-based SVG to JPG converter using Canvas API
 */
export const svgToJpgBrowserHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToJpgOptions = {}
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
    
    if (options.onProgress) {
      options.onProgress(0.3)
    }
    
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new ConversionError('Failed to create canvas context')
    }
    
    // JPEG doesn't support transparency, always set background
    // Default to white if not specified
    const backgroundColor = options.background || '#ffffff'
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    
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
            options.onProgress(0.8)
          }
          
          // Convert quality from 0-100 to 0-1 range
          const normalizedQuality = Math.min(100, Math.max(0, options.quality ?? 85)) / 100
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(svgUrl)
              
              if (!blob) {
                reject(new ConversionError('Failed to convert canvas to blob'))
                return
              }
              
              if (options.onProgress) {
                options.onProgress(1)
              }
              
              // Convert blob to buffer
              blob.arrayBuffer().then(arrayBuffer => {
                const buffer = Buffer.from(arrayBuffer)
                
                resolve({
                  success: true,
                  data: buffer,
                  mimeType: 'image/jpeg',
                  metadata: {
                    width,
                    height,
                    format: 'jpg',
                    size: buffer.length,
                    originalFormat: 'svg',
                    background: backgroundColor,
                    quality: options.quality ?? 85
                  }
                })
              }).catch(reject)
            },
            'image/jpeg',
            normalizedQuality
          )
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
      `SVG to JPG conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Export as default for consistency with other browser converters
 */
export default svgToJpgBrowserHandler