/**
 * TIFF to SVG Converter Implementation
 * 
 * This module provides TIFF to SVG conversion using imagetracerjs for client-side
 * and potrace for server-side (when available).
 */

import { LazyLoadedConverter } from './base-converter'
import type { 
  ConversionOptions, 
  ConversionResult,
  ImageFormat 
} from './types'
import { 
  ConversionError, 
  FileValidationError
} from './errors'
import { detectFileTypeFromBuffer } from './validation'
import { traceImageOptimized, type ImageTracerOptions } from './browser-tracing-utils'

/**
 * Extended conversion options for TIFF to SVG
 */
interface TiffToSvgOptions extends ConversionOptions, ImageTracerOptions {
  /** Quality level (1-100, default: 50) */
  quality?: number
  /** Maximum image size in pixels (default: 16000000 = 16MP) */
  maxPixels?: number
  /** Page number to convert for multi-page TIFF (0-indexed, default: 0) */
  page?: number
}

/**
 * TIFF to SVG Converter using imagetracerjs (works in browser)
 */
class TiffToSvgConverter extends LazyLoadedConverter {
  name = 'TIFF to SVG'
  from: ImageFormat = 'tiff'
  to: ImageFormat = 'svg'
  description = 'Convert TIFF images including multi-page files to scalable vector graphics'
  isClientSide = true // Works in browser!
  
  private ImageTracer: any = null
  private utif: any = null

  /**
   * Load the appropriate library based on environment
   */
  protected async loadLibraries(): Promise<void> {
    // Use imagetracerjs which works in both browser and Node.js
    const ImageTracerModule = await import('imagetracerjs')
    this.ImageTracer = ImageTracerModule.default || ImageTracerModule
    
    // Use UTIF for TIFF decoding in browser
    const utifModule = await import('utif')
    this.utif = utifModule.default || utifModule
  }

  /**
   * Perform the conversion with loaded libraries
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: TiffToSvgOptions
  ): Promise<ConversionResult> {
    try {
      // Validate input is TIFF
      const detectedFormat = detectFileTypeFromBuffer(input)
      if (detectedFormat !== 'tiff') {
        throw new FileValidationError(
          `Expected TIFF file but detected ${detectedFormat || 'unknown'} format`
        )
      }

      // Report initial progress
      this.reportProgress(options, 0.1)

      // Decode TIFF and extract the requested page
      const pngBuffer = await this.extractTiffPage(input, options.page || 0)
      
      // Report progress after extraction
      this.reportProgress(options, 0.2)

      // Convert buffer to base64 data URL
      const base64 = pngBuffer.toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`

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
        `TIFF to SVG conversion failed: ${message}`,
        'TIFF_TO_SVG_FAILED'
      )
    }
  }

  /**
   * Extract a specific page from a multi-page TIFF and convert to PNG for processing
   */
  private async extractTiffPage(buffer: Buffer, page: number = 0): Promise<Buffer> {
    try {
      // Decode TIFF using UTIF
      const ifds = this.utif.decode(buffer)
      
      if (!ifds || ifds.length === 0) {
        throw new ConversionError('Invalid TIFF file: no pages found', 'TIFF_NO_PAGES')
      }
      
      if (page >= ifds.length) {
        throw new ConversionError(
          `Page ${page} does not exist. TIFF has ${ifds.length} page(s) (0-indexed)`,
          'INVALID_PAGE_NUMBER'
        )
      }
      
      // Decode the specific page
      const ifd = ifds[page]
      this.utif.decodeImage(buffer, ifd)
      
      const width = ifd.width
      const height = ifd.height
      
      // Convert to RGBA if needed
      const rgba = this.utif.toRGBA8(ifd)
      
      // Create canvas and convert to PNG
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Browser environment
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          throw new ConversionError('Failed to create canvas context')
        }
        
        // Create ImageData from RGBA array
        const imageData = new ImageData(new Uint8ClampedArray(rgba), width, height)
        ctx.putImageData(imageData, 0, 0)
        
        // Convert to PNG buffer
        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new ConversionError('Failed to convert canvas to blob'))
                return
              }
              
              blob.arrayBuffer().then(arrayBuffer => {
                resolve(Buffer.from(arrayBuffer))
              }).catch(reject)
            },
            'image/png',
            1.0
          )
        })
      } else {
        // Node.js environment - create a simple PNG-like buffer
        // In production, you'd use a proper PNG encoder here
        throw new ConversionError('TIFF conversion requires browser environment', 'BROWSER_REQUIRED')
      }
    } catch (error) {
      if (error instanceof ConversionError) {
        throw error
      }
      
      if (error instanceof Error) {
        throw new ConversionError(
          `Failed to extract TIFF page: ${error.message}`,
          'TIFF_EXTRACTION_FAILED'
        )
      }
      
      throw new ConversionError(
        'Failed to process TIFF file',
        'TIFF_PROCESSING_FAILED'
      )
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
        // Fit within bounds while preserving aspect ratio
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
export const tiffToSvgConverter = new TiffToSvgConverter()

// Export the handler for direct use
export const tiffToSvgHandler = tiffToSvgConverter.handler

// Client-side wrapper
export async function convertTiffToSvgClient(
  file: File,
  options: TiffToSvgOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return tiffToSvgHandler(buffer, options)
}

// Server-side wrapper
export async function convertTiffToSvgServer(
  buffer: Buffer,
  options: TiffToSvgOptions = {}
): Promise<ConversionResult> {
  return tiffToSvgHandler(buffer, options)
}