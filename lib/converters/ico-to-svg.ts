/**
 * ICO to SVG Converter Implementation
 * 
 * This module provides ICO to SVG conversion using imagetracerjs for client-side
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
 * Extended conversion options for ICO to SVG
 */
interface IcoToSvgOptions extends ConversionOptions, ImageTracerOptions {
  /** Quality level (1-100, default: 50) */
  quality?: number
  /** Maximum image size in pixels (default: 16000000 = 16MP) */
  maxPixels?: number
  /** Preferred icon size to extract (default: largest available) */
  preferredSize?: number
}

/**
 * ICO file header structure
 */
interface IcoHeader {
  reserved: number
  type: number
  count: number
}

/**
 * ICO directory entry structure
 */
interface IcoDirectoryEntry {
  width: number
  height: number
  colorCount: number
  reserved: number
  planes: number
  bitCount: number
  size: number
  offset: number
}

/**
 * ICO to SVG Converter using imagetracerjs (works in browser)
 */
class IcoToSvgConverter extends LazyLoadedConverter {
  name = 'ICO to SVG'
  from: ImageFormat = 'ico'
  to: ImageFormat = 'svg'
  description = 'Convert ICO icon files to scalable vector graphics with transparency support'
  isClientSide = true // Works in browser!
  
  private ImageTracer: any = null

  /**
   * Load the appropriate library based on environment
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
    options: IcoToSvgOptions
  ): Promise<ConversionResult> {
    try {
      // Validate input is ICO
      const detectedFormat = detectFileTypeFromBuffer(input)
      if (detectedFormat !== 'ico') {
        throw new FileValidationError(
          `Expected ICO file but detected ${detectedFormat || 'unknown'} format`
        )
      }

      // Report initial progress
      this.reportProgress(options, 0.1)

      // Parse ICO structure and extract best icon
      const iconBuffer = await this.extractBestIcon(input, options.preferredSize)
      
      // Report progress after extraction
      this.reportProgress(options, 0.2)

      // Convert icon buffer to data URL
      let dataUrl: string
      if (iconBuffer.length >= 8 && 
          iconBuffer[0] === 0x89 && 
          iconBuffer[1] === 0x50 && 
          iconBuffer[2] === 0x4E && 
          iconBuffer[3] === 0x47) {
        // PNG format
        const base64 = iconBuffer.toString('base64')
        dataUrl = `data:image/png;base64,${base64}`
      } else {
        // BMP format
        const base64 = iconBuffer.toString('base64')
        dataUrl = `data:image/bmp;base64,${base64}`
      }

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
        `ICO to SVG conversion failed: ${message}`,
        'ICO_TO_SVG_FAILED'
      )
    }
  }

  /**
   * Parses ICO header from buffer
   */
  private parseIcoHeader(buffer: Buffer): IcoHeader {
    if (buffer.length < 6) {
      throw new ConversionError('Invalid ICO file: too small', 'ICO_INVALID_HEADER')
    }

    return {
      reserved: buffer.readUInt16LE(0),
      type: buffer.readUInt16LE(2),
      count: buffer.readUInt16LE(4)
    }
  }

  /**
   * Parses ICO directory entries
   */
  private parseIcoDirectory(buffer: Buffer, count: number): IcoDirectoryEntry[] {
    const entries: IcoDirectoryEntry[] = []
    const entrySize = 16
    const headerSize = 6

    for (let i = 0; i < count; i++) {
      const offset = headerSize + (i * entrySize)
      
      if (offset + entrySize > buffer.length) {
        throw new ConversionError('Invalid ICO file: corrupted directory', 'ICO_INVALID_DIRECTORY')
      }

      const width = buffer.readUInt8(offset) || 256
      const height = buffer.readUInt8(offset + 1) || 256
      
      entries.push({
        width,
        height,
        colorCount: buffer.readUInt8(offset + 2),
        reserved: buffer.readUInt8(offset + 3),
        planes: buffer.readUInt16LE(offset + 4),
        bitCount: buffer.readUInt16LE(offset + 6),
        size: buffer.readUInt32LE(offset + 8),
        offset: buffer.readUInt32LE(offset + 12)
      })
    }

    return entries
  }

  /**
   * Selects the best icon from available entries
   */
  private selectBestIcon(
    entries: IcoDirectoryEntry[], 
    preferredSize?: number
  ): IcoDirectoryEntry {
    if (preferredSize) {
      // Try to find exact match
      const exactMatch = entries.find(e => e.width === preferredSize)
      if (exactMatch) return exactMatch
      
      // Find closest size
      const sorted = [...entries].sort((a, b) => {
        const aDiff = Math.abs(a.width - preferredSize)
        const bDiff = Math.abs(b.width - preferredSize)
        return aDiff - bDiff
      })
      return sorted[0]
    }

    // Select largest icon by default
    return entries.reduce((best, current) => 
      current.width * current.height > best.width * best.height ? current : best
    )
  }

  /**
   * Extracts the best icon from the ICO file
   */
  private async extractBestIcon(buffer: Buffer, preferredSize?: number): Promise<Buffer> {
    // Parse ICO structure
    const header = this.parseIcoHeader(buffer)
    
    if (header.type !== 1) {
      throw new ConversionError('Invalid ICO file: wrong type', 'ICO_INVALID_TYPE')
    }

    if (header.count === 0) {
      throw new ConversionError('Invalid ICO file: no icons found', 'ICO_NO_ICONS')
    }

    // Parse directory entries
    const entries = this.parseIcoDirectory(buffer, header.count)

    // Select best icon
    const selectedEntry = this.selectBestIcon(entries, preferredSize)

    // Extract icon data
    if (selectedEntry.offset + selectedEntry.size > buffer.length) {
      throw new ConversionError('Invalid ICO file: data out of bounds', 'ICO_INVALID_DATA')
    }

    const iconData = buffer.subarray(selectedEntry.offset, selectedEntry.offset + selectedEntry.size)
    
    // Check if it's PNG data (starts with PNG signature)
    const isPng = iconData.length >= 8 && 
      iconData[0] === 0x89 && 
      iconData[1] === 0x50 && 
      iconData[2] === 0x4E && 
      iconData[3] === 0x47

    if (isPng) {
      // Already PNG format, can use directly
      return iconData
    }

    // Otherwise, it's BMP format - convert it to PNG format for imagetracerjs
    // Create proper BMP header
    const bmpHeaderSize = 14
    const totalSize = bmpHeaderSize + iconData.length
    const bmpBuffer = Buffer.alloc(totalSize)
    
    // BMP file header
    bmpBuffer.write('BM', 0)
    bmpBuffer.writeUInt32LE(totalSize, 2)
    bmpBuffer.writeUInt32LE(0, 6)
    bmpBuffer.writeUInt32LE(bmpHeaderSize + 40, 10) // Offset to pixel data
    
    // Copy the rest of the data
    iconData.copy(bmpBuffer, bmpHeaderSize)
    
    return bmpBuffer
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
export const icoToSvgConverter = new IcoToSvgConverter()

// Export the handler for direct use
export const icoToSvgHandler = icoToSvgConverter.handler

// Client-side wrapper
export async function convertIcoToSvgClient(
  file: File,
  options: IcoToSvgOptions = {}
): Promise<ConversionResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return icoToSvgHandler(buffer, options)
}

// Server-side wrapper
export async function convertIcoToSvgServer(
  buffer: Buffer,
  options: IcoToSvgOptions = {}
): Promise<ConversionResult> {
  return icoToSvgHandler(buffer, options)
}