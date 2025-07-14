/**
 * HEIC to SVG Converter Implementation
 * 
 * This module provides HEIC to SVG conversion using heic2any library
 * for decoding and imagetracerjs for vectorization. Supports browser-based
 * conversion with fallback strategies for compatibility.
 */

import { LazyLoadedConverter } from './base-converter'
import type { 
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
  detectFileTypeFromBuffer
} from './validation'
import { traceImageOptimized, type ImageTracerOptions } from './browser-tracing-utils'

/**
 * Extended conversion options for HEIC to SVG
 */
interface HeicToSvgOptions extends ConversionOptions, ImageTracerOptions {
  /** Quality level (1-100, default: 50) */
  quality?: number
  /** Maximum image size in pixels (default: 16000000 = 16MP) */
  maxPixels?: number
  /** Quality for intermediate JPEG conversion (0-1) */
  jpegQuality?: number
}

/**
 * HEIC to SVG Converter using heic2any and imagetracerjs (works in browser)
 */
class HeicToSvgConverter extends LazyLoadedConverter {
  name = 'HEIC to SVG'
  from: ImageFormat = 'heic'
  to: ImageFormat = 'svg'
  description = 'Convert HEIC images to scalable vector graphics. HEIC support requires a modern browser.'
  isClientSide = true // Works in browser!
  
  private heic2any: any = null
  private ImageTracer: any = null

  /**
   * Load the required libraries
   */
  protected async loadLibraries(): Promise<void> {
    // Load both heic2any and imagetracerjs
    const [heic2anyModule, ImageTracerModule] = await Promise.all([
      import('heic2any'),
      import('imagetracerjs')
    ])
    
    this.heic2any = heic2anyModule.default || heic2anyModule
    this.ImageTracer = ImageTracerModule.default || ImageTracerModule
  }

  /**
   * Perform the conversion with loaded libraries
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: HeicToSvgOptions
  ): Promise<ConversionResult> {
    try {
      // Validate input is HEIC
      this.validateHeicInput(input)

      // Report initial progress
      this.reportProgress(options, 0.1)

      // Convert HEIC to intermediate format (JPEG)
      const intermediateBuffer = await this.heicToIntermediate(input, options)
      
      // Report progress after HEIC decoding
      this.reportProgress(options, 0.2)

      // Convert buffer to base64 data URL
      const base64 = intermediateBuffer.toString('base64')
      const dataUrl = `data:image/jpeg;base64,${base64}`

      // Convert using optimized tracing
      const svg = await traceImageOptimized(
        this.ImageTracer,
        dataUrl,
        options,
        (progress) => this.reportProgress(options, 0.2 + progress * 0.7)
      )

      // Apply any post-processing
      let finalSvg = svg
      if (options.width || options.height) {
        finalSvg = this.resizeSvg(svg, options.width, options.height, options.preserveAspectRatio)
      }

      // Report progress
      this.reportProgress(options, 0.95)

      // Extract metadata
      const metadata = this.extractSvgMetadata(finalSvg)

      return this.createSuccessResult(
        finalSvg,
        'image/svg+xml',
        {
          ...metadata,
          method: 'imagetracerjs',
          quality: options.quality || 50
        }
      )
    } catch (error) {
      if (error instanceof ConversionError) {
        throw error
      }
      
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new ConversionError(
        `HEIC to SVG conversion failed: ${message}`,
        'HEIC_TO_SVG_FAILED'
      )
    }
  }

  /**
   * Validates that the input is a HEIC image
   */
  private validateHeicInput(buffer: Buffer): void {
    // HEIC files typically start with 'ftyp' box at offset 4
    // and contain 'heic', 'heix', 'hevc', or 'hevx' brand
    if (buffer.length < 12) {
      throw new FileValidationError('File too small to be a valid HEIC')
    }
    
    const ftyp = buffer.toString('ascii', 4, 8)
    if (ftyp !== 'ftyp') {
      throw new UnsupportedFormatError(
        'unknown',
        ['heic'],
        'File does not appear to be a valid HEIC/HEIF format'
      )
    }
    
    // Check for HEIC brand identifiers
    const brand = buffer.toString('ascii', 8, 12)
    const validBrands = ['heic', 'heix', 'hevc', 'hevx', 'mif1']
    if (!validBrands.includes(brand)) {
      throw new UnsupportedFormatError(
        brand,
        ['heic'],
        `Invalid HEIC brand: ${brand}. Expected one of: ${validBrands.join(', ')}`
      )
    }
  }

  /**
   * Converts HEIC to intermediate format (JPEG) using heic2any
   */
  private async heicToIntermediate(
    buffer: Buffer, 
    options: HeicToSvgOptions
  ): Promise<Buffer> {
    if (!this.heic2any) {
      throw new ConversionError(
        'HEIC conversion libraries not loaded',
        'HEIC_LIBS_NOT_LOADED'
      )
    }
    
    try {
      // Convert Buffer to Blob for heic2any
      const blob = new Blob([buffer], { type: 'image/heic' })
      
      // Convert HEIC to JPEG (better for tracing)
      const convertedBlob = await this.heic2any({
        blob,
        toType: 'image/jpeg',
        quality: options.jpegQuality || 0.92
      })
      
      // Convert Blob back to Buffer
      const arrayBuffer = await convertedBlob.arrayBuffer()
      return Buffer.from(arrayBuffer)
      
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific heic2any errors
        if (error.message.includes('not supported')) {
          throw new ConversionError(
            'HEIC format is not supported in this browser. Please use Chrome, Firefox, or Safari.',
            'BROWSER_NOT_SUPPORTED'
          )
        }
        throw new ConversionError(
          `HEIC decoding failed: ${error.message}`,
          'HEIC_DECODE_FAILED'
        )
      }
      throw error
    }
  }


  /**
   * Resize SVG to specific dimensions
   */
  private resizeSvg(
    svg: string, 
    targetWidth?: number, 
    targetHeight?: number,
    preserveAspectRatio: boolean = true
  ): string {
    // Extract current dimensions from viewBox or width/height
    let width = 0, height = 0
    
    // Try viewBox first
    const viewBoxMatch = svg.match(/viewBox="0 0 (\d+\.?\d*) (\d+\.?\d*)"/)
    if (viewBoxMatch) {
      width = parseFloat(viewBoxMatch[1])
      height = parseFloat(viewBoxMatch[2])
    } else {
      // Fall back to width/height attributes
      const widthMatch = svg.match(/width="(\d+\.?\d*)"/)
      const heightMatch = svg.match(/height="(\d+\.?\d*)"/)
      
      if (widthMatch) width = parseFloat(widthMatch[1])
      if (heightMatch) height = parseFloat(heightMatch[1])
    }
    
    if (!width || !height) return svg
    
    // Calculate new dimensions
    let newWidth = targetWidth || width
    let newHeight = targetHeight || height
    
    if (preserveAspectRatio) {
      const aspectRatio = width / height
      
      if (targetWidth && !targetHeight) {
        newHeight = Math.round(targetWidth / aspectRatio)
      } else if (!targetWidth && targetHeight) {
        newWidth = Math.round(targetHeight * aspectRatio)
      } else if (targetWidth && targetHeight) {
        const scaleX = targetWidth / width
        const scaleY = targetHeight / height
        const scale = Math.min(scaleX, scaleY)
        
        newWidth = Math.round(width * scale)
        newHeight = Math.round(height * scale)
      }
    }
    
    // Update SVG dimensions
    const svgWithNewDimensions = svg
      .replace(/width="[^"]*"/, `width="${newWidth}"`)
      .replace(/height="[^"]*"/, `height="${newHeight}"`)
    
    // If no width/height attributes, add them
    if (!svg.includes('width=')) {
      const svgTagEnd = svg.indexOf('>')
      const beforeEnd = svg.slice(0, svgTagEnd)
      const afterEnd = svg.slice(svgTagEnd)
      return `${beforeEnd} width="${newWidth}" height="${newHeight}"${afterEnd}`
    }
    
    return svgWithNewDimensions
  }

  /**
   * Extract metadata from SVG string
   */
  private extractSvgMetadata(svg: string): { width?: number; height?: number } {
    const metadata: { width?: number; height?: number } = {}
    
    // Try viewBox first
    const viewBoxMatch = svg.match(/viewBox="0 0 (\d+\.?\d*) (\d+\.?\d*)"/)
    if (viewBoxMatch) {
      metadata.width = parseFloat(viewBoxMatch[1])
      metadata.height = parseFloat(viewBoxMatch[2])
    } else {
      // Fall back to width/height attributes
      const widthMatch = svg.match(/width="(\d+\.?\d*)"/)
      const heightMatch = svg.match(/height="(\d+\.?\d*)"/)
      
      if (widthMatch) metadata.width = parseFloat(widthMatch[1])
      if (heightMatch) metadata.height = parseFloat(heightMatch[1])
    }
    
    return metadata
  }
}

// Create and export the converter instance
export const heicToSvgConverter = new HeicToSvgConverter()

// Export the handler for direct use
export const heicToSvgHandler = heicToSvgConverter.handler

// Client-side wrapper
export async function convertHeicToSvgClient(
  file: File,
  options: HeicToSvgOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return heicToSvgHandler(buffer, options)
}