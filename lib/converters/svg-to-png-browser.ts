/**
 * SVG to PNG Converter - Browser Implementation
 * 
 * This module provides SVG to PNG conversion using Canvas API for browser environments.
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
 * Extended conversion options for SVG to PNG
 */
interface SvgToPngOptions extends ConversionOptions {
  /** DPI for rasterization (default: 96) */
  dpi?: number
  /** PNG quality (0-1, default: 0.9) */
  quality?: number
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
 * Converts data URL to Blob
 */
function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',')
  const mimeMatch = parts[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const bstr = atob(parts[1])
  const n = bstr.length
  const u8arr = new Uint8Array(n)
  
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }
  
  return new Blob([u8arr], { type: mime })
}

/**
 * Browser-based SVG to PNG converter using Canvas API
 */
export const svgToPngHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToPngOptions = {}
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
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new ConversionError('Failed to create canvas context')
    }
    
    // Set background if specified
    if (options.background && options.background !== 'transparent') {
      ctx.fillStyle = options.background
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }
    
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
            options.onProgress(0.8)
          }
          
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
                  mimeType: 'image/png',
                  metadata: {
                    width: canvasWidth,
                    height: canvasHeight,
                    format: 'png',
                    size: buffer.length,
                    dpi,
                    originalFormat: 'svg',
                    background: options.background || 'transparent'
                  }
                })
              }).catch(reject)
            },
            'image/png',
            options.quality || 0.9
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
      `SVG to PNG conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}