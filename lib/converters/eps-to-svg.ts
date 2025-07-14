/**
 * EPS to SVG Converter Implementation
 * 
 * Converts Encapsulated PostScript (EPS) files to SVG format.
 * Supports both PDF-compatible EPS files (using PDF.js) and
 * pure PostScript EPS files with basic parsing.
 */

import { LazyLoadedConverter } from './base-converter'
import { loadPdfjs } from './lazy-loader'
import type { 
  ConversionOptions, 
  ConversionResult,
  ImageFormat
} from './types'
import { 
  ConversionError,
  UnsupportedFormatError,
  CorruptedFileError
} from './errors'

/**
 * EPS to SVG Converter
 * Extends LazyLoadedConverter to handle dynamic library loading
 */
class EPSToSVGConverter extends LazyLoadedConverter {
  name = 'EPS to SVG'
  from: ImageFormat = 'eps'
  to: ImageFormat = 'svg'
  description = 'Convert Encapsulated PostScript files to scalable vector graphics'

  private pdfjs: any = null

  /**
   * Load required libraries (PDF.js)
   */
  protected async loadLibraries(): Promise<void> {
    this.pdfjs = await loadPdfjs()
  }

  /**
   * Perform the actual conversion after libraries are loaded
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    // Check if this is a PDF-compatible EPS
    if (this.isPdfCompatibleEPS(input)) {
      return await this.convertPdfCompatibleEPS(input, options)
    } else {
      return await this.convertPureEPS(input, options)
    }
  }

  /**
   * Check if the EPS file is PDF-compatible
   */
  private isPdfCompatibleEPS(buffer: Buffer): boolean {
    const header = buffer.toString('utf8', 0, Math.min(1024, buffer.length))
    return header.includes('%PDF-') || header.includes('%%Creator: Adobe')
  }

  /**
   * Convert PDF-compatible EPS using PDF.js
   */
  private async convertPdfCompatibleEPS(
    buffer: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    try {
      // Load PDF document
      const loadingTask = this.pdfjs.getDocument({
        data: buffer,
        disableFontFace: true,
        cMapUrl: '/cmaps/',
        cMapPacked: true
      })

      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1) // EPS files typically have one page

      // Get viewport
      const viewport = page.getViewport({ scale: 1.0 })
      const width = viewport.width
      const height = viewport.height

      // Create SVG
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`

      // Get page operators
      const operatorList = await page.getOperatorList()
      const svgGfx = new this.pdfjs.SVGGraphics(page.commonObjs, page.objs)
      
      // Configure SVG graphics
      svgGfx.embedFonts = false
      
      // Convert to SVG
      const svgElement = await svgGfx.getSVG(operatorList, viewport)
      
      // Extract inner content
      const innerSVG = svgElement.innerHTML || this.convertOperatorsToSVG(operatorList, viewport)
      svg += innerSVG
      svg += '\n</svg>'

      // Apply dimensions if specified
      if (options.width || options.height) {
        svg = this.resizeSVG(svg, options.width, options.height, options.preserveAspectRatio)
      }

      // Report completion
      this.reportProgress(options, 0.95)

      return this.createSuccessResult(
        svg,
        'image/svg+xml',
        {
          width,
          height,
          method: 'pdf-compatible'
        }
      )
    } catch (error) {
      throw new ConversionError(
        `Failed to convert PDF-compatible EPS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PDF_EPS_CONVERSION_FAILED'
      )
    }
  }

  /**
   * Convert pure EPS files with basic PostScript parsing
   */
  private async convertPureEPS(
    buffer: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    try {
      const epsContent = buffer.toString('utf8')
      
      // Extract bounding box
      const boundingBox = this.extractBoundingBox(epsContent)
      if (!boundingBox) {
        throw new CorruptedFileError('EPS file missing BoundingBox')
      }

      const width = boundingBox.width
      const height = boundingBox.height

      // Create SVG
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`
      
      // Parse PostScript commands
      const paths = this.parsePostScriptCommands(epsContent, boundingBox)
      svg += paths.join('\n')
      svg += '\n</svg>'

      // Apply dimensions if specified
      if (options.width || options.height) {
        svg = this.resizeSVG(svg, options.width, options.height, options.preserveAspectRatio)
      }

      // Report completion
      this.reportProgress(options, 0.95)

      return this.createSuccessResult(
        svg,
        'image/svg+xml',
        {
          width,
          height,
          method: 'postscript-parser'
        }
      )
    } catch (error) {
      if (error instanceof CorruptedFileError) {
        throw error
      }
      throw new ConversionError(
        `Failed to convert pure EPS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PURE_EPS_CONVERSION_FAILED'
      )
    }
  }

  /**
   * Extract bounding box from EPS content
   */
  private extractBoundingBox(content: string): { x: number, y: number, width: number, height: number } | null {
    const match = content.match(/%%BoundingBox:\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/)
    if (!match) return null

    const [, x1, y1, x2, y2] = match.map(Number)
    return {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    }
  }

  /**
   * Parse basic PostScript commands to SVG paths
   */
  private parsePostScriptCommands(content: string, boundingBox: any): string[] {
    const paths: string[] = []
    const lines = content.split('\n')
    
    let currentPath = ''
    let currentColor = '#000000'
    let inPath = false
    let lineWidth = 1

    for (const line of lines) {
      const trimmed = line.trim()
      
      // Skip comments and headers
      if (trimmed.startsWith('%') || trimmed === '') continue
      
      // Parse commands
      const parts = trimmed.split(/\s+/)
      const command = parts[parts.length - 1]
      
      switch (command) {
        case 'newpath':
          currentPath = 'M '
          inPath = true
          break
          
        case 'moveto':
          if (parts.length >= 3) {
            const x = parseFloat(parts[0])
            const y = boundingBox.height - parseFloat(parts[1]) // Flip Y coordinate
            currentPath += `${x} ${y} `
          }
          break
          
        case 'lineto':
          if (parts.length >= 3) {
            const x = parseFloat(parts[0])
            const y = boundingBox.height - parseFloat(parts[1])
            currentPath += `L ${x} ${y} `
          }
          break
          
        case 'curveto':
          if (parts.length >= 7) {
            const x1 = parseFloat(parts[0])
            const y1 = boundingBox.height - parseFloat(parts[1])
            const x2 = parseFloat(parts[2])
            const y2 = boundingBox.height - parseFloat(parts[3])
            const x3 = parseFloat(parts[4])
            const y3 = boundingBox.height - parseFloat(parts[5])
            currentPath += `C ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3} `
          }
          break
          
        case 'closepath':
          currentPath += 'Z '
          break
          
        case 'stroke':
          if (inPath && currentPath) {
            paths.push(`<path d="${currentPath}" fill="none" stroke="${currentColor}" stroke-width="${lineWidth}"/>`)
            currentPath = ''
            inPath = false
          }
          break
          
        case 'fill':
          if (inPath && currentPath) {
            paths.push(`<path d="${currentPath}" fill="${currentColor}" stroke="none"/>`)
            currentPath = ''
            inPath = false
          }
          break
          
        case 'setrgbcolor':
          if (parts.length >= 4) {
            const r = Math.round(parseFloat(parts[0]) * 255)
            const g = Math.round(parseFloat(parts[1]) * 255)
            const b = Math.round(parseFloat(parts[2]) * 255)
            currentColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          }
          break
          
        case 'setcmykcolor':
          if (parts.length >= 5) {
            // Convert CMYK to RGB
            const c = parseFloat(parts[0])
            const m = parseFloat(parts[1])
            const y = parseFloat(parts[2])
            const k = parseFloat(parts[3])
            
            const r = Math.round(255 * (1 - c) * (1 - k))
            const g = Math.round(255 * (1 - m) * (1 - k))
            const b = Math.round(255 * (1 - y) * (1 - k))
            
            currentColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          }
          break
          
        case 'setlinewidth':
          if (parts.length >= 2) {
            lineWidth = parseFloat(parts[0])
          }
          break
      }
    }

    return paths
  }

  /**
   * Fallback method to convert PDF operators to SVG
   */
  private convertOperatorsToSVG(operatorList: any, viewport: any): string {
    let svg = ''
    const ops = operatorList.fnArray
    const args = operatorList.argsArray
    
    let currentPath = ''
    let currentColor = '#000000'
    
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i]
      const arg = args[i]
      
      switch (op) {
        case this.pdfjs.OPS.beginPath:
          currentPath = 'M '
          break
        case this.pdfjs.OPS.moveTo:
          currentPath += `${arg[0]} ${viewport.height - arg[1]} `
          break
        case this.pdfjs.OPS.lineTo:
          currentPath += `L ${arg[0]} ${viewport.height - arg[1]} `
          break
        case this.pdfjs.OPS.curveTo:
          currentPath += `C ${arg[0]} ${viewport.height - arg[1]}, ${arg[2]} ${viewport.height - arg[3]}, ${arg[4]} ${viewport.height - arg[5]} `
          break
        case this.pdfjs.OPS.closePath:
          currentPath += 'Z '
          break
        case this.pdfjs.OPS.stroke:
          if (currentPath) {
            svg += `<path d="${currentPath}" fill="none" stroke="${currentColor}" stroke-width="1"/>\n`
            currentPath = ''
          }
          break
        case this.pdfjs.OPS.fill:
          if (currentPath) {
            svg += `<path d="${currentPath}" fill="${currentColor}" stroke="none"/>\n`
            currentPath = ''
          }
          break
      }
    }
    
    return svg
  }

  /**
   * Resize SVG to specified dimensions
   */
  private resizeSVG(
    svg: string,
    targetWidth?: number,
    targetHeight?: number,
    preserveAspectRatio: boolean = true
  ): string {
    const widthMatch = svg.match(/width="([\d.]+)"/)
    const heightMatch = svg.match(/height="([\d.]+)"/)
    
    if (!widthMatch || !heightMatch) return svg
    
    const currentWidth = parseFloat(widthMatch[1])
    const currentHeight = parseFloat(heightMatch[1])
    
    let newWidth = targetWidth || currentWidth
    let newHeight = targetHeight || currentHeight
    
    if (preserveAspectRatio) {
      const aspectRatio = currentWidth / currentHeight
      
      if (targetWidth && !targetHeight) {
        newHeight = Math.round(targetWidth / aspectRatio)
      } else if (!targetWidth && targetHeight) {
        newWidth = Math.round(targetHeight * aspectRatio)
      } else if (targetWidth && targetHeight) {
        const scaleX = targetWidth / currentWidth
        const scaleY = targetHeight / currentHeight
        const scale = Math.min(scaleX, scaleY)
        
        newWidth = Math.round(currentWidth * scale)
        newHeight = Math.round(currentHeight * scale)
      }
    }
    
    return svg
      .replace(/width="[\d.]+"/, `width="${newWidth}"`)
      .replace(/height="[\d.]+"/, `height="${newHeight}"`)
  }
}

// Export the converter instance
export const epsToSvgConverter = new EPSToSVGConverter()

// Export the handler for direct use
export const epsToSvgHandler = epsToSvgConverter.handler