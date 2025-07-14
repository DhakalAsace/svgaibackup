/**
 * SVG to AVIF Converter Implementation
 * 
 * This module provides SVG to AVIF conversion using Canvas API with browser
 * support detection and fallback. AVIF (AV1 Image File Format) is a modern 
 * image format with excellent compression and quality characteristics.
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
import { detectAvifEncodeSupport, getAvifSupportMessage } from './avif-browser-support'

/**
 * Extended conversion options for SVG to AVIF
 */
interface SvgToAvifOptions extends ConversionOptions {
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
  /** DPI for rasterization (default: 96) */
  dpi?: number
}

/**
 * Validates that the input is an SVG
 */
function validateSvgInput(input: Buffer | string | File): string {
  if (input instanceof File) {
    if (!input.type.includes('svg') && !input.name.toLowerCase().endsWith('.svg')) {
      throw new UnsupportedFormatError(
        input.type || 'unknown',
        ['svg'],
        'File does not appear to be SVG format'
      )
    }
    // Will be processed as text in the main handler
    return ''
  }
  
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
      throw new FileValidationError('Invalid SVG: Missing SVG tag')
    }
    return trimmed
  }
  
  // For Buffer, convert to string and validate
  const svgString = input.toString('utf8').trim()
  if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG: Missing SVG tag')
  }
  
  return svgString
}

/**
 * Loads SVG to canvas for AVIF conversion
 */
async function loadSvgToCanvas(
  svgString: string, 
  options: SvgToAvifOptions
): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
  
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
  
  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new ConversionError('Failed to create canvas context')
  }
  
  // Set background if specified
  if (options.background) {
    ctx.fillStyle = options.background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }
  
  // Scale context for DPI
  if (scale !== 1) {
    ctx.scale(scale, scale)
  }
  
  // Convert SVG to blob URL
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)
  
  try {
    // Load and draw SVG
    const img = new Image()
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
        resolve()
      }
      
      img.onerror = () => {
        reject(new ConversionError('Failed to load SVG image'))
      }
      
      // Set timeout to avoid hanging
      setTimeout(() => {
        reject(new ConversionError('SVG image loading timed out'))
      }, 10000)
      
      // Set crossOrigin to handle CORS
      img.crossOrigin = 'anonymous'
      img.src = svgUrl
    })
    
    return { canvas, ctx }
    
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

/**
 * Converts SVG to AVIF using Canvas API with browser support detection
 * Implements the ConversionHandler interface
 */
export const svgToAvifHandler: ConversionHandler = async (
  input: Buffer | string | File,
  options: SvgToAvifOptions = {}
): Promise<ConversionResult> => {
  try {
    // Check browser AVIF encoding support first
    const canEncode = await detectAvifEncodeSupport()
    if (!canEncode) {
      const supportMessage = await getAvifSupportMessage()
      throw new UnsupportedFormatError(
        'avif',
        ['avif'],
        `${supportMessage.message} ${supportMessage.recommendation}`
      )
    }
    
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    // Get SVG string
    let svgString: string
    if (input instanceof File) {
      svgString = await input.text()
    } else {
      svgString = validateSvgInput(input)
    }
    
    if (options.onProgress) {
      options.onProgress(0.2)
    }
    
    // Load SVG to canvas
    const { canvas, ctx } = await loadSvgToCanvas(svgString, options)
    
    if (options.onProgress) {
      options.onProgress(0.6)
    }
    
    // Convert canvas to AVIF blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new ConversionError(
              'Failed to create AVIF blob from canvas',
              'AVIF_BLOB_CREATION_FAILED'
            ))
            return
          }
          
          try {
            if (options.onProgress) {
              options.onProgress(0.9)
            }
            
            // Convert blob to buffer
            const arrayBuffer = await blob.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            
            if (options.onProgress) {
              options.onProgress(1)
            }
            
            resolve({
              success: true,
              data: buffer,
              mimeType: 'image/avif',
              metadata: {
                width: canvas.width,
                height: canvas.height,
                format: 'avif',
                size: buffer.length,
                originalFormat: 'svg',
                quality: options.quality || 0.9
              }
            })
          } catch (error) {
            reject(new ConversionError(
              `Failed to process AVIF blob: ${error instanceof Error ? error.message : 'Unknown error'}`,
              'AVIF_BLOB_PROCESSING_FAILED'
            ))
          }
        },
        'image/avif',
        options.quality || 0.9
      )
      
      // Set timeout to avoid hanging
      setTimeout(() => {
        reject(new ConversionError(
          'AVIF conversion timed out. This may indicate limited browser support.',
          'AVIF_CONVERSION_TIMEOUT'
        ))
      }, 30000)
    })
    
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
        `SVG to AVIF conversion failed: ${error.message}`,
        'SVG_TO_AVIF_FAILED'
      )
    }
    
    throw new ConversionError(
      'An unexpected error occurred during SVG to AVIF conversion',
      'SVG_TO_AVIF_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to AVIF conversion wrapper
 */
export async function convertSvgToAvifClient(
  input: File | string,
  options: SvgToAvifOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const content = await input.text()
    return svgToAvifHandler(content, options)
  }
  return svgToAvifHandler(input, options)
}

/**
 * SVG to AVIF converter configuration
 */
export const svgToAvifConverter = {
  name: 'SVG to AVIF',
  from: 'svg' as ImageFormat,
  to: 'avif' as ImageFormat,
  handler: svgToAvifHandler,
  isClientSide: true,
  requiresBrowserSupport: 'AVIF encoding',
  description: 'Convert SVG files to AVIF format using browser Canvas API (Chrome 85+, Firefox 93+)'
}