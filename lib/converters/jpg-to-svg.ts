/**
 * JPG to SVG Converter Implementation
 * 
 * Converts JPEG images to SVG using imagetracerjs for browser compatibility
 * with optimizations to prevent UI freezing
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
 * Extended conversion options for JPG to SVG
 */
interface JpgToSvgOptions extends ConversionOptions, ImageTracerOptions {
  /** Quality level (1-100, default: 50) */
  quality?: number
  /** Maximum image size in pixels (default: 16000000 = 16MP) */
  maxPixels?: number
}

/**
 * JPG to SVG Converter using imagetracerjs (works in browser)
 */
class JpgToSvgConverter extends LazyLoadedConverter {
  name = 'JPG to SVG'
  from: ImageFormat = 'jpg'
  to: ImageFormat = 'svg'
  description = 'Convert JPEG images to scalable vector graphics'
  isClientSide = true // Works in browser!
  
  private ImageTracer: any = null

  /**
   * Load the appropriate library
   */
  protected async loadLibraries(): Promise<void> {
    // Use imagetracerjs which works in both browser and Node.js
    const ImageTracerModule = await import('imagetracerjs')
    this.ImageTracer = ImageTracerModule.default || ImageTracerModule
  }

  /**
   * Perform the conversion with loaded libraries
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: JpgToSvgOptions
  ): Promise<ConversionResult> {
    try {
      // Validate input is JPG
      const detectedFormat = detectFileTypeFromBuffer(input)
      if (detectedFormat !== 'jpg' && detectedFormat !== 'jpeg') {
        throw new FileValidationError(
          `Expected JPG file but detected ${detectedFormat || 'unknown'} format`
        )
      }

      // Report initial progress
      this.reportProgress(options, 0.1)

      // Convert buffer to base64 data URL
      const base64 = input.toString('base64')
      const dataUrl = `data:image/jpeg;base64,${base64}`
      
      // Report progress after data preparation
      this.reportProgress(options, 0.2)

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
        `JPG to SVG conversion failed: ${message}`,
        'JPG_TO_SVG_FAILED'
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
export const jpgToSvgConverter = new JpgToSvgConverter()

// Export the handler for direct use
export const jpgToSvgHandler = jpgToSvgConverter.handler

// Create alias for JPEG
export const jpegToSvgConverter = jpgToSvgConverter
export const jpegToSvgHandler = jpgToSvgHandler