/**
 * TTF to SVG Converter Implementation
 * 
 * This module provides TrueType Font to SVG conversion using opentype.js.
 * Extracts font glyphs and converts them to SVG paths for use in graphics.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult,
  ImageFormat,
  Converter
} from './types'
import { 
  ConversionError, 
  FileValidationError,
  UnsupportedFormatError 
} from './errors'
import { LazyLoadedConverter } from './base-converter'

/**
 * Extended conversion options for TTF to SVG
 */
interface TtfToSvgOptions extends ConversionOptions {
  /** Text to render (default: full alphabet + numbers) */
  text?: string
  /** Font size in pixels (default: 72) */
  fontSize?: number
  /** Include all glyphs (default: false) */
  allGlyphs?: boolean
  /** Glyph spacing (default: 10) */
  spacing?: number
  /** Fill color for paths (default: black) */
  fillColor?: string
  /** Stroke color (default: none) */
  strokeColor?: string
  /** Stroke width (default: 0) */
  strokeWidth?: number
  /** Output individual glyphs (default: false) */
  individualGlyphs?: boolean
  /** Output format (default: 'paths') */
  outputFormat?: 'font' | 'paths' | 'icons'
}

/**
 * TTF to SVG converter using opentype.js
 */
class TtfToSvgConverter extends LazyLoadedConverter {
  name = 'TTF to SVG'
  from: ImageFormat = 'ttf'
  to: ImageFormat = 'svg'
  description = 'Convert TrueType fonts to SVG paths for graphics and web use'
  
  private opentype: any = null
  
  /**
   * Load opentype.js library dynamically
   */
  protected async loadLibraries(): Promise<void> {
    try {
      const opentypeModule = await import('opentype.js')
      this.opentype = opentypeModule.default || opentypeModule
    } catch (error) {
      throw new ConversionError(
        'Failed to load opentype.js library',
        'LIBRARY_LOAD_FAILED'
      )
    }
  }
  
  /**
   * Parse TTF font buffer
   */
  private async parseFont(buffer: Buffer): Promise<any> {
    try {
      // Convert Buffer to ArrayBuffer for opentype.js
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      )
      
      // Parse the font
      const font = this.opentype.parse(arrayBuffer)
      
      if (!font || !font.glyphs) {
        throw new Error('Invalid font file or no glyphs found')
      }
      
      return font
    } catch (error) {
      throw new FileValidationError(
        `Invalid TTF file: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
  
  /**
   * Get default text for rendering
   */
  private getDefaultText(): string {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }
  
  /**
   * Convert font glyphs to SVG
   */
  private createSvgFromFont(font: any, options: TtfToSvgOptions): string {
    const fontSize = options.fontSize || 72
    const spacing = options.spacing || 10
    const fillColor = options.fillColor || '#000000'
    const strokeColor = options.strokeColor || 'none'
    const strokeWidth = options.strokeWidth || 0
    const outputFormat = options.outputFormat || 'paths'
    
    let svgContent = ''
    let currentX = spacing
    let currentY = fontSize
    let maxX = 0
    let maxY = fontSize + spacing
    
    if (outputFormat === 'font') {
      // SVG font format (deprecated but still useful for some applications)
      const unitsPerEm = font.unitsPerEm
      const ascent = font.ascender
      const descent = font.descender
      
      svgContent = `<defs>
    <font id="${font.names.fontFamily?.en || 'converted-font'}" horiz-adv-x="${unitsPerEm}">
      <font-face 
        font-family="${font.names.fontFamily?.en || 'ConvertedFont'}" 
        units-per-em="${unitsPerEm}" 
        ascent="${ascent}" 
        descent="${descent}"/>
      <missing-glyph horiz-adv-x="${unitsPerEm / 2}"/>`
      
      // Add glyphs
      for (let i = 0; i < font.glyphs.length && i < 100; i++) {
        const glyph = font.glyphs.get(i)
        if (!glyph.unicode) continue
        
        const path = glyph.getPath(0, 0, unitsPerEm)
        const pathData = path.toPathData(2)
        
        if (pathData) {
          svgContent += `
      <glyph unicode="${String.fromCharCode(glyph.unicode)}" horiz-adv-x="${glyph.advanceWidth}" d="${pathData}"/>`
        }
      }
      
      svgContent += `
    </font>
  </defs>`
      
      maxX = 800
      maxY = 200
    } else if (options.allGlyphs) {
      // Export all glyphs in the font
      const glyphsPerRow = 20
      let glyphCount = 0
      
      for (let i = 0; i < font.glyphs.length; i++) {
        const glyph = font.glyphs.get(i)
        if (!glyph.unicode) continue
        
        const path = glyph.getPath(currentX, currentY, fontSize)
        const pathData = path.toPathData(2)
        
        if (pathData) {
          svgContent += `<g id="glyph-${i}">\n`
          svgContent += `  <path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>\n`
          svgContent += `</g>\n`
          
          const advance = glyph.advanceWidth * fontSize / font.unitsPerEm
          currentX += advance + spacing
          maxX = Math.max(maxX, currentX)
          
          glyphCount++
          if (glyphCount % glyphsPerRow === 0) {
            currentX = spacing
            currentY += fontSize + spacing
            maxY = currentY + spacing
          }
        }
      }
    } else {
      // Render specific text
      const text = options.text || this.getDefaultText()
      const glyphsPerRow = 30
      let charCount = 0
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const glyph = font.charToGlyph(char)
        
        if (glyph && glyph.index !== 0) {
          const path = glyph.getPath(currentX, currentY, fontSize)
          const pathData = path.toPathData(2)
          
          if (pathData) {
            svgContent += `<g id="char-${char.charCodeAt(0)}">\n`
            svgContent += `  <path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>\n`
            if (options.individualGlyphs) {
              svgContent += `  <text x="${currentX}" y="${currentY + fontSize + 15}" font-size="12" fill="#666">${char}</text>\n`
            }
            svgContent += `</g>\n`
            
            const advance = glyph.advanceWidth * fontSize / font.unitsPerEm
            currentX += advance + spacing
            maxX = Math.max(maxX, currentX)
            
            charCount++
            if (charCount % glyphsPerRow === 0) {
              currentX = spacing
              currentY += fontSize + spacing + (options.individualGlyphs ? 20 : 0)
              maxY = currentY + spacing
            }
          }
        }
      }
    }
    
    // Create complete SVG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${maxX + spacing}" 
     height="${maxY}" 
     viewBox="0 0 ${maxX + spacing} ${maxY}">
  <metadata>
    <fontInfo>
      <fontFamily>${font.names.fontFamily?.en || 'Unknown'}</fontFamily>
      <fontSubfamily>${font.names.fontSubfamily?.en || 'Regular'}</fontSubfamily>
      <designer>${font.names.designer?.en || 'Unknown'}</designer>
      <copyright>${font.names.copyright?.en || ''}</copyright>
      <unitsPerEm>${font.unitsPerEm}</unitsPerEm>
      <ascender>${font.ascender}</ascender>
      <descender>${font.descender}</descender>
    </fontInfo>
  </metadata>
  <rect width="${maxX + spacing}" height="${maxY}" fill="white"/>
  ${svgContent}
</svg>`
    
    return svg
  }
  
  /**
   * Perform the conversion after libraries are loaded
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: TtfToSvgOptions
  ): Promise<ConversionResult> {
    try {
      // Parse the font
      const font = await this.parseFont(input)
      
      // Report progress
      this.reportProgress(options, 0.5)
      
      // Create SVG from font
      const svgContent = this.createSvgFromFont(font, options)
      const svgBuffer = Buffer.from(svgContent, 'utf8')
      
      // Report progress
      this.reportProgress(options, 0.9)
      
      // Extract metadata
      const metadata = {
        fontFamily: font.names.fontFamily?.en || 'Unknown',
        fontSubfamily: font.names.fontSubfamily?.en || 'Regular',
        glyphCount: font.glyphs.length,
        unitsPerEm: font.unitsPerEm,
        created: font.tables?.head?.created
      }
      
      return this.createSuccessResult(svgBuffer, 'image/svg+xml', metadata)
      
    } catch (error) {
      if (error instanceof FileValidationError) {
        throw error
      }
      
      if (error instanceof Error) {
        throw new ConversionError(
          `TTF to SVG conversion failed: ${error.message}`,
          'TTF_TO_SVG_FAILED'
        )
      }
      
      throw new ConversionError(
        'An unexpected error occurred during TTF to SVG conversion',
        'TTF_TO_SVG_UNKNOWN_ERROR'
      )
    }
  }
}

// Create singleton instance
const ttfToSvgConverter = new TtfToSvgConverter()

/**
 * TTF to SVG conversion handler
 */
export const ttfToSvgHandler: ConversionHandler = ttfToSvgConverter.handler

/**
 * Client-side TTF to SVG conversion wrapper
 */
export async function convertTtfToSvgClient(
  input: File | Buffer,
  options: TtfToSvgOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const buffer = Buffer.from(await input.arrayBuffer())
    return ttfToSvgHandler(buffer, options)
  }
  
  return ttfToSvgHandler(input, options)
}

/**
 * Server-side TTF to SVG conversion wrapper
 */
export async function convertTtfToSvgServer(
  input: Buffer | string,
  options: TtfToSvgOptions = {}
): Promise<ConversionResult> {
  return ttfToSvgHandler(input, options)
}

/**
 * TTF to SVG converter configuration
 */
export const ttfToSvgConverterInstance: Converter = {
  name: 'TTF to SVG',
  from: 'ttf' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: ttfToSvgHandler,
  isClientSide: true,
  description: 'Convert TrueType fonts to SVG paths for graphics and web use'
}

// Export for backward compatibility
export { ttfToSvgConverterInstance as ttfToSvgConverter }