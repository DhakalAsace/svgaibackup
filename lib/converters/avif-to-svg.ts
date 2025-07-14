/**
 * AVIF to SVG Converter Implementation
 * 
 * This module provides AVIF to SVG conversion using:
 * 1. Direct browser AVIF support + potrace (primary method)
 * 2. CloudConvert AVIF → PNG → client-side PNG to SVG (fallback)
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
import { detectAvifDecodeSupport, getAvifSupportMessage } from './avif-browser-support'
import { convertWithCloudConvert } from './cloudconvert-client'

/**
 * Extended conversion options for AVIF to SVG
 */
interface AvifToSvgOptions extends ConversionOptions {
  /** Potrace threshold (0-255, default: 128) */
  threshold?: number
  /** Potrace turnpolicy (default: 'minority') */
  turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority'
  /** Potrace optimization tolerance (default: 0.2) */
  optTolerance?: number
  /** Potrace curve optimization (default: true) */
  optCurve?: boolean
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an AVIF file
 */
function validateAvifInput(input: Buffer | string | File): void {
  if (input instanceof File) {
    if (!input.type.includes('avif') && !input.name.toLowerCase().endsWith('.avif')) {
      throw new UnsupportedFormatError(
        input.type || 'unknown',
        ['avif'],
        'File does not appear to be AVIF format'
      )
    }
  } else if (typeof input === 'string') {
    // For string input, assume it's base64 or data URL
    if (!input.includes('avif') && !input.includes('data:image/avif')) {
      throw new UnsupportedFormatError(
        'string',
        ['avif'],
        'String input does not appear to be AVIF format'
      )
    }
  } else {
    // Check AVIF file signature for Buffer
    const header = input.subarray(0, 20)
    const hasAvifSignature = header.includes(Buffer.from('avif', 'ascii'))
    
    if (!hasAvifSignature) {
      throw new UnsupportedFormatError(
        'unknown',
        ['avif'],
        'Buffer does not contain AVIF file signature'
      )
    }
  }
}

/**
 * Loads AVIF image to canvas
 */
async function loadAvifToCanvas(
  input: Buffer | string,
  options: AvifToSvgOptions
): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
  
  // Create image URL from input
  let imageUrl: string
  let cleanup: () => void
  
  if (typeof input === 'string') {
    // Assume string is data URL or base64
    if (input.startsWith('data:')) {
      imageUrl = input
      cleanup = () => {}
    } else {
      // Base64 string
      imageUrl = `data:image/avif;base64,${input}`
      cleanup = () => {}
    }
  } else {
    const blob = new Blob([input], { type: 'image/avif' })
    imageUrl = URL.createObjectURL(blob)
    cleanup = () => URL.revokeObjectURL(imageUrl)
  }
  
  try {
    const img = new Image()
    
    // Wait for image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new ConversionError(
        'Failed to load AVIF image. Your browser may not support AVIF format.',
        'AVIF_LOAD_ERROR'
      ))
      
      // Set timeout to avoid hanging
      setTimeout(() => {
        reject(new ConversionError(
          'AVIF image loading timed out. Check browser compatibility.',
          'AVIF_LOAD_TIMEOUT'
        ))
      }, 10000)
      
      img.src = imageUrl
    })
    
    // Create canvas with image dimensions
    const canvas = document.createElement('canvas')
    canvas.width = options.width || img.naturalWidth
    canvas.height = options.height || img.naturalHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new ConversionError('Failed to create canvas context', 'CANVAS_CONTEXT_ERROR')
    }
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    
    return { canvas, ctx }
    
  } finally {
    cleanup()
  }
}

/**
 * CloudConvert fallback for AVIF to SVG conversion
 */
async function convertAvifToSvgViaCloudConvert(
  input: Buffer,
  options: AvifToSvgOptions
): Promise<ConversionResult> {
  try {
    // Step 1: Convert AVIF to PNG using CloudConvert
    if (options.onProgress) options.onProgress(0.1)
    
    const pngResult = await convertWithCloudConvert(
      input,
      'avif',
      'png',
      'input.avif',
      {
        width: options.width,
        height: options.height,
        preserveAspectRatio: options.preserveAspectRatio,
        onProgress: (progress) => {
          if (options.onProgress) {
            options.onProgress(0.1 + progress * 0.4) // 0.1 to 0.5
          }
        }
      }
    )
    
    if (!pngResult.success) {
      throw new ConversionError(
        `CloudConvert AVIF to PNG failed: ${pngResult.error}`,
        'CLOUDCONVERT_AVIF_TO_PNG_FAILED'
      )
    }
    
    // Step 2: Convert PNG to SVG using existing client-side converter
    if (options.onProgress) options.onProgress(0.5)
    
    const { pngToSvgHandler } = await import('./png-to-svg')
    const svgResult = await pngToSvgHandler(pngResult.data, {
      ...options,
      onProgress: (progress) => {
        if (options.onProgress) {
          options.onProgress(0.5 + progress * 0.5) // 0.5 to 1.0
        }
      }
    })
    
    if (!svgResult.success) {
      throw new ConversionError(
        `PNG to SVG conversion failed: ${svgResult.error}`,
        'PNG_TO_SVG_FAILED'
      )
    }
    
    return {
      ...svgResult,
      metadata: {
        ...svgResult.metadata,
        originalFormat: 'avif',
        method: 'cloudconvert-chain',
        intermediateFormat: 'png'
      }
    }
    
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error
    }
    
    throw new ConversionError(
      `CloudConvert AVIF to SVG chain failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CLOUDCONVERT_CHAIN_FAILED'
    )
  }
}

/**
 * Converts AVIF to SVG using browser support or CloudConvert fallback
 * Implements the ConversionHandler interface
 */
export const avifToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: AvifToSvgOptions = {}
): Promise<ConversionResult> => {
  // Convert input to Buffer if needed
  let inputBuffer: Buffer
  if (typeof input === 'string') {
    if (input.startsWith('data:')) {
      // Extract base64 from data URL
      const base64Data = input.split(',')[1]
      inputBuffer = Buffer.from(base64Data, 'base64')
    } else {
      // Assume it's base64
      inputBuffer = Buffer.from(input, 'base64')
    }
  } else {
    inputBuffer = input
  }
  
  try {
    // Validate input
    validateAvifInput(inputBuffer)
    
    // Try browser-based conversion first if available
    const canDecode = await detectAvifDecodeSupport()
    
    if (canDecode) {
      try {
        if (options.onProgress) options.onProgress(0.1)
        
        // Load AVIF to canvas
        const { canvas, ctx } = await loadAvifToCanvas(inputBuffer, options)
        
        if (options.onProgress) options.onProgress(0.3)
        
        // Get image data from canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        if (options.onProgress) options.onProgress(0.5)
        
        // Dynamically import potrace
        const potrace = await import('potrace').then(m => m.default || m)
        
        // Convert to grayscale for potrace
        const grayscaleData = new Uint8Array(canvas.width * canvas.height)
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i]
          const g = imageData.data[i + 1]
          const b = imageData.data[i + 2]
          // Standard grayscale conversion
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
          grayscaleData[i / 4] = gray
        }
        
        if (options.onProgress) options.onProgress(0.7)
        
        // Configure potrace options
        const potraceOptions = {
          threshold: options.threshold || 128,
          optTolerance: options.optTolerance || 0.2,
          turnPolicy: options.turnPolicy || 'minority',
          optCurve: options.optCurve !== false
        }
        
        // Convert to SVG using potrace
        return new Promise((resolve, reject) => {
          potrace.trace(Buffer.from(grayscaleData), potraceOptions, (err: Error | null, svg?: string) => {
            if (err) {
              reject(new ConversionError(
                `Potrace conversion failed: ${err.message}`,
                'POTRACE_ERROR'
              ))
              return
            }
            
            if (!svg) {
              reject(new ConversionError(
                'Potrace conversion failed: No SVG output generated',
                'POTRACE_ERROR'
              ))
              return
            }
            
            if (options.onProgress) {
              options.onProgress(1)
            }
            
            resolve({
              success: true,
              data: Buffer.from(svg, 'utf-8'),
              mimeType: 'image/svg+xml',
              metadata: {
                width: canvas.width,
                height: canvas.height,
                format: 'svg',
                size: Buffer.byteLength(svg, 'utf-8'),
                originalFormat: 'avif',
                method: 'browser-native',
                potraceOptions
              }
            })
          })
        })
        
      } catch (browserError) {
        console.warn('Browser AVIF conversion failed, falling back to CloudConvert:', browserError)
        // Fall through to CloudConvert
      }
    }
    
    // Fallback to CloudConvert chain: AVIF → PNG → SVG
    console.log('Using CloudConvert chain for AVIF to SVG conversion')
    return await convertAvifToSvgViaCloudConvert(inputBuffer, options)
    
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
        `AVIF to SVG conversion failed: ${error.message}`,
        'AVIF_TO_SVG_FAILED'
      )
    }
    
    throw new ConversionError(
      'An unexpected error occurred during AVIF to SVG conversion',
      'AVIF_TO_SVG_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side AVIF to SVG conversion wrapper
 */
export async function convertAvifToSvgClient(
  input: File,
  options: AvifToSvgOptions = {}
): Promise<ConversionResult> {
  // Convert File to Buffer for the handler
  const arrayBuffer = await input.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return avifToSvgHandler(buffer, options)
}

/**
 * AVIF to SVG converter configuration
 */
export const avifToSvgConverter = {
  name: 'AVIF to SVG',
  from: 'avif' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: avifToSvgHandler,
  isClientSide: true,
  requiresBrowserSupport: 'AVIF decoding',
  description: 'Convert AVIF images to SVG vector format using browser AVIF support and potrace vectorization'
}