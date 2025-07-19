/**
 * AVIF to SVG Converter Implementation
 * 
 * Converts AVIF images to SVG format using a two-step process:
 * 1. AVIF → PNG (via CloudConvert API - consumes credits)
 * 2. PNG → SVG (via server-side vectorization)
 * 
 * This approach ensures we use CloudConvert API (consuming credits) while
 * providing reliable AVIF to SVG conversion functionality.
 */

import type { 
  ConversionHandler,
  ConversionOptions, 
  ConversionResult,
  ImageFormat
} from './types'
import { 
  ConversionError,
  UnsupportedFormatError,
  CorruptedFileError,
  FileValidationError
} from './errors'
import { validateFile, detectFileTypeFromBuffer } from './validation'
import { convertWithCloudConvert } from './cloudconvert-client'

/**
 * Extended conversion options for AVIF to SVG
 */
interface AvifToSvgOptions extends ConversionOptions {
  /** Vectorization threshold (0-255, default: 128) */
  threshold?: number
  /** Turn policy for path generation */
  turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority'
  /** Optimize paths (default: true) */
  optimizePaths?: boolean
}

/**
 * Validate AVIF file input
 */
function validateAvifInput(input: Buffer | string): void {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
  
  // Basic file validation
  const validation = validateFile(buffer, {
    allowedFormats: ['avif'],
    maxSize: 100 * 1024 * 1024 // 100MB
  })
  
  if (!validation.isValid) {
    throw new FileValidationError(validation.error!)
  }
  
  // Detect file type
  const format = detectFileTypeFromBuffer(buffer)
  
  if (!format) {
    throw new FileValidationError('Unable to detect file format')
  }
  
  // Ensure it's actually an AVIF file
  if (format !== 'avif') {
    throw new UnsupportedFormatError(
      format,
      ['avif'],
      `Expected AVIF file, got ${format}. Please upload a valid AVIF image.`
    )
  }
}

/**
 * Convert PNG buffer to SVG using server-side vectorization
 * This avoids the Potrace browser compatibility issues
 */
async function vectorizePngToSvg(
  pngBuffer: Buffer, 
  options: AvifToSvgOptions = {}
): Promise<string> {
  // Import sharp for server-side image processing
  const sharp = (await import('sharp')).default
  
  try {
    // Convert to a format suitable for vectorization
    const { data, info } = await sharp(pngBuffer)
      .png()
      .raw()
      .toBuffer({ resolveWithObject: true })
    
    // Use potrace for vectorization (server-side, avoiding browser issues)
    const potrace = (await import('potrace')).default
    
    return new Promise((resolve, reject) => {
      const params = {
        threshold: options.threshold || 128,
        turnPolicy: options.turnPolicy || 'minority',
        optTolerance: 0.2,
        alphaMax: 1.0,
        optCurve: options.optimizePaths !== false
      }
      
      // Potrace expects the raw pixel data buffer directly
      potrace.trace(data, params, (err: Error | null, svg?: string) => {
        if (err) {
          console.error('[AVIF-to-SVG] Potrace error:', err)
          reject(new ConversionError(
            `Vectorization failed: ${err.message || 'Unknown potrace error'}`,
            'VECTORIZATION_FAILED'
          ))
        } else if (svg) {
          resolve(svg)
        } else {
          reject(new ConversionError(
            'Potrace returned no SVG data',
            'VECTORIZATION_NO_OUTPUT'
          ))
        }
      })
    })
    
  } catch (error) {
    console.error('[AVIF-to-SVG] Sharp/Potrace error:', error)
    throw new ConversionError(
      `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'IMAGE_PROCESSING_FAILED'
    )
  }
}

/**
 * AVIF to SVG conversion handler using CloudConvert + vectorization
 */
export const avifToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: AvifToSvgOptions = {}
): Promise<ConversionResult> => {
  try {
    // Convert string input to Buffer if needed
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
    
    // Validate input
    validateAvifInput(inputBuffer)
    
    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    console.log('[AVIF-to-SVG] Starting two-step conversion: AVIF → PNG → SVG')
    console.log('[AVIF-to-SVG] Step 1: Converting AVIF to PNG via CloudConvert...')
    
    // Step 1: Convert AVIF to PNG using CloudConvert (consumes credits)
    const pngResult = await convertWithCloudConvert(
      inputBuffer,
      'avif',
      'png',
      'image.avif',
      {
        onProgress: (progress) => {
          if (options.onProgress) {
            // Map Step 1 progress to 0.1 - 0.6 range
            options.onProgress(0.1 + progress * 0.5)
          }
        }
      }
    )
    
    if (!pngResult.success || !pngResult.data) {
      throw new ConversionError(
        `CloudConvert AVIF to PNG failed: ${pngResult.error || 'No data returned'}`,
        'CLOUDCONVERT_AVIF_TO_PNG_FAILED'
      )
    }
    
    console.log('[AVIF-to-SVG] Step 1 completed. PNG size:', pngResult.data.length)
    
    // Progress update
    if (options.onProgress) {
      options.onProgress(0.6)
    }
    
    console.log('[AVIF-to-SVG] Step 2: Vectorizing PNG to SVG...')
    
    // Step 2: Vectorize PNG to SVG using server-side tools
    const pngBuffer = typeof pngResult.data === 'string' 
      ? Buffer.from(pngResult.data, 'base64')
      : pngResult.data
      
    const svgData = await vectorizePngToSvg(pngBuffer, options)
    
    console.log('[AVIF-to-SVG] Step 2 completed. SVG size:', svgData.length)
    
    // Final progress
    if (options.onProgress) {
      options.onProgress(1.0)
    }
    
    return {
      success: true,
      data: svgData,
      mimeType: 'image/svg+xml',
      metadata: {
        format: 'svg',
        size: Buffer.byteLength(svgData, 'utf8'),
        method: 'cloudconvert+vectorization',
        originalFormat: 'avif',
        conversionSteps: [
          'AVIF → PNG (CloudConvert)',
          'PNG → SVG (Server vectorization)'
        ],
        threshold: options.threshold || 128,
        turnPolicy: options.turnPolicy || 'minority',
        optimizePaths: options.optimizePaths !== false
      }
    }
    
  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }
    
    // Handle unknown errors
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new ConversionError(
      `Failed to convert AVIF file: ${message}`,
      'AVIF_TO_SVG_FAILED'
    )
  }
}

/**
 * Client-side AVIF to SVG conversion wrapper
 */
export async function convertAvifToSvgClient(
  file: File,
  options: AvifToSvgOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return avifToSvgHandler(buffer, options)
}

/**
 * Server-side AVIF to SVG conversion wrapper
 */
export async function convertAvifToSvgServer(
  buffer: Buffer,
  options: AvifToSvgOptions = {}
): Promise<ConversionResult> {
  return avifToSvgHandler(buffer, options)
}

/**
 * AVIF to SVG converter configuration
 */
export const avifToSvgConverter = {
  name: 'AVIF to SVG',
  from: 'avif' as const,
  to: 'svg' as const,
  handler: avifToSvgHandler,
  isClientSide: false, // Uses CloudConvert API + server-side vectorization
  description: 'Convert AVIF images to SVG using CloudConvert API + vectorization'
}