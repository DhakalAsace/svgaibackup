/**
 * SVG to WebP Converter - Browser Implementation
 * 
 * This module provides SVG to WebP conversion using Canvas API for browser environments.
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
import { 
  isWebPSupported, 
  checkBrowserCompatibility,
  createFallbackMessage,
  getBrowserInfo
} from './browser-utils'
/**
 * Extended conversion options for SVG to WebP
 */
interface SvgToWebpOptions extends ConversionOptions {
  /** WebP quality (0-1, default: 0.85) */
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
 * Browser-based SVG to WebP converter using Canvas API
 */
export const svgToWebpHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToWebpOptions = {}
): Promise<ConversionResult> => {
  try {
    // Check browser compatibility
    const compatibility = checkBrowserCompatibility()
    if (!compatibility.compatible) {
      throw new ConversionError(
        compatibility.issues.join(' '),
        'BROWSER_NOT_SUPPORTED'
      )
    }
    // Log warnings if any
    if (compatibility.warnings.length > 0) {
      compatibility.warnings.forEach(warning => {
        // Warning logged silently
      })
    }
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
    // Set background if specified
    if (options.background && options.background !== 'transparent') {
      ctx.fillStyle = options.background
      ctx.fillRect(0, 0, width, height)
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
          if (options.preserveAspectRatio !== false && (options.width || options.height)) {
            // Calculate scaling to fit while preserving aspect ratio
            const scale = Math.min(
              width / img.width,
              height / img.height
            )
            const scaledWidth = img.width * scale
            const scaledHeight = img.height * scale
            const x = (width - scaledWidth) / 2
            const y = (height - scaledHeight) / 2
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          } else {
            ctx.drawImage(img, 0, 0, width, height)
          }
          if (options.onProgress) {
            options.onProgress(0.8)
          }
          // Check if browser supports WebP
          const webpSupported = isWebPSupported()
          if (!webpSupported) {
            // Fallback to PNG with warning
            // Convert to PNG instead
            canvas.toBlob(
              (blob) => {
                URL.revokeObjectURL(svgUrl)
                if (!blob) {
                  reject(new ConversionError('Failed to convert canvas to PNG blob'))
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
                      width,
                      height,
                      format: 'png',
                      size: buffer.length,
                      originalFormat: 'svg',
                      background: options.background || 'transparent',
                      fallback: true,
                      fallbackReason: 'WebP not supported in this browser'
                    },
                    warning: 'WebP format is not supported in your browser. The image was converted to PNG format instead.'
                  })
                }).catch(reject)
              },
              'image/png',
              options.quality || 0.85
            )
            return
          }
          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(svgUrl)
              if (!blob) {
                reject(new ConversionError('Failed to convert canvas to WebP blob'))
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
                  mimeType: 'image/webp',
                  metadata: {
                    width,
                    height,
                    format: 'webp',
                    size: buffer.length,
                    originalFormat: 'svg',
                    background: options.background || 'transparent'
                  }
                })
              }).catch(reject)
            },
            'image/webp',
            options.quality || 0.85
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
      `SVG to WebP conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}