/**
 * SVG to JPG Converter Implementation
 * 
 * This module provides SVG to JPG conversion using Canvas API in browsers
 * and sharp library on servers. Automatically detects the environment.
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
import { detectFileTypeFromBuffer } from './validation'

/**
 * Extended conversion options for SVG to JPG
 */
interface SvgToJpgOptions extends ConversionOptions {
  /** JPEG quality (1-100, default: 85) */
  quality?: number
  /** Background color (default: white, as JPEG doesn't support transparency) */
  background?: string
  /** Progressive JPEG encoding (default: true) */
  progressive?: boolean
  /** Chroma subsampling (default: '4:2:0') */
  chromaSubsampling?: '4:4:4' | '4:2:2' | '4:2:0'
}

/**
 * SVG to JPG Converter with automatic environment detection
 */
class SvgToJpgConverter extends LazyLoadedConverter {
  name = 'SVG to JPG'
  from: ImageFormat = 'svg'
  to: ImageFormat = 'jpg'
  description = 'Convert SVG vector graphics to JPG images'
  isClientSide = true
  
  private browserHandler: any = null
  private serverHandler: any = null

  /**
   * Load the appropriate library based on environment
   */
  protected async loadLibraries(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Browser environment - use canvas
      const browserModule = await import('./svg-to-jpg-browser')
      this.browserHandler = browserModule.svgToJpgBrowserHandler
    } else {
      // Server environment - use sharp
      const sharp = await import('sharp')
      this.serverHandler = sharp.default
    }
  }

  /**
   * Perform the conversion with loaded libraries
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: SvgToJpgOptions
  ): Promise<ConversionResult> {
    // Use browser handler if available
    if (this.browserHandler) {
      return this.browserHandler(input, options)
    }

    // Server-side implementation using sharp
    if (!this.serverHandler) {
      throw new ConversionError(
        'No conversion handler available',
        'NO_HANDLER'
      )
    }

    const sharp = this.serverHandler
    const svgString = this.validateSvgInput(input)
    const { svg: processedSvg, width, height } = this.processSvgDimensions(svgString, options)
    const svgBuffer = Buffer.from(processedSvg, 'utf8')
    
    // JPG doesn't support transparency, ensure background
    const background = options.background || '#ffffff'
    const quality = Math.min(100, Math.max(1, options.quality ?? 85))
    
    let sharpInstance = sharp(svgBuffer, { density: 96 })
    
    // Always flatten with background for JPEG
    sharpInstance = sharpInstance.flatten({ background })
    
    if ((options.width || options.height) && options.preserveAspectRatio !== false) {
      sharpInstance = sharpInstance.resize(
        options.width || null,
        options.height || null,
        {
          fit: 'inside',
          withoutEnlargement: false
        }
      )
    }
    
    const jpgBuffer = await sharpInstance
      .jpeg({
        quality,
        progressive: options.progressive ?? true,
        chromaSubsampling: options.chromaSubsampling || '4:2:0',
      })
      .toBuffer()
    
    // Get metadata
    const metadata = await sharp(jpgBuffer).metadata()
    
    return this.createSuccessResult(
      jpgBuffer,
      'image/jpeg',
      {
        width: metadata.width,
        height: metadata.height,
        quality
      }
    )
  }

  /**
   * Validates that the input is an SVG
   */
  private validateSvgInput(input: Buffer | string): string {
    if (typeof input === 'string') {
      const trimmed = input.trim()
      if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
        throw new FileValidationError('Invalid SVG: Missing SVG tag')
      }
      return trimmed
    }
    
    const format = detectFileTypeFromBuffer(input)
    
    if (format !== 'svg') {
      throw new UnsupportedFormatError(
        format || 'unknown',
        ['svg'],
        `Expected SVG format but received ${format || 'unknown format'}`
      )
    }
    
    return input.toString('utf8')
  }

  /**
   * Processes SVG string to ensure proper dimensions
   */
  private processSvgDimensions(svg: string, options: SvgToJpgOptions): { svg: string; width?: number; height?: number } {
    let width: number | undefined
    let height: number | undefined
    
    const widthMatch = svg.match(/width="([^"]+)"/)
    const heightMatch = svg.match(/height="([^"]+)"/)
    const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
    
    if (widthMatch) {
      const w = parseFloat(widthMatch[1])
      if (!isNaN(w)) width = w
    }
    
    if (heightMatch) {
      const h = parseFloat(heightMatch[1])
      if (!isNaN(h)) height = h
    }
    
    if (!width && !height && viewBoxMatch) {
      const [, , vbWidth, vbHeight] = viewBoxMatch[1].split(' ').map(parseFloat)
      if (!isNaN(vbWidth) && !isNaN(vbHeight)) {
        width = vbWidth
        height = vbHeight
      }
    }
    
    // Use provided dimensions or defaults
    width = options.width || width || 512
    height = options.height || height || 512
    
    let processedSvg = svg
    if (!widthMatch) {
      processedSvg = processedSvg.replace('<svg', `<svg width="${width}"`)
    } else {
      processedSvg = processedSvg.replace(widthMatch[0], `width="${width}"`)
    }
    
    if (!heightMatch) {
      processedSvg = processedSvg.replace('<svg', `<svg height="${height}"`)
    } else {
      processedSvg = processedSvg.replace(heightMatch[0], `height="${height}"`)
    }
    
    return { svg: processedSvg, width, height }
  }
}

// Create and export the converter instance
export const svgToJpgConverter = new SvgToJpgConverter()

// Export the handler for direct use
export const svgToJpgHandler = svgToJpgConverter.handler

// Export converter info for registry
export const svgToJpgInfo = {
  name: 'SVG to JPG',
  from: 'svg' as ImageFormat,
  to: 'jpg' as ImageFormat,
  handler: svgToJpgHandler,
  isClientSide: true,
  description: 'Convert SVG vector graphics to JPG images with customizable quality and background color'
}