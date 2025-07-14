/**
 * AI to SVG Converter Implementation
 * 
 * Converts Adobe Illustrator (AI) files to SVG format.
 * AI files are PDF-compatible, so we use PDF.js for conversion.
 * Handles artboards, layers, and Illustrator-specific metadata.
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
  CorruptedFileError,
  FileValidationError
} from './errors'
import { validateFile, isConversionSupported, validateConversionParams } from './validation'

/**
 * Extended conversion options for AI to SVG
 */
interface AiToSvgOptions extends ConversionOptions {
  /** Artboard number to convert (default: 1) */
  artboard?: number
  /** Preserve layer structure (default: true) */
  preserveLayers?: boolean
  /** Extract embedded images (default: false) */
  extractImages?: boolean
}

/**
 * AI to SVG Converter
 * Extends LazyLoadedConverter to handle dynamic library loading
 */
class AIToSVGConverter extends LazyLoadedConverter {
  name = 'AI to SVG'
  from: ImageFormat = 'ai'
  to: ImageFormat = 'svg'
  description = 'Convert Adobe Illustrator files to scalable vector graphics'

  private pdfjs: any = null

  /**
   * Override validation to allow both AI and PDF formats
   */
  protected async validateInput(
    buffer: Buffer,
    options: ConversionOptions
  ): Promise<void> {
    console.log('[AI-to-SVG] Starting validation...')
    console.log('[AI-to-SVG] Buffer size:', buffer.length)
    
    const header = buffer.toString('utf8', 0, Math.min(500, buffer.length))
    console.log('[AI-to-SVG] File header preview:', header.substring(0, 200))
    
    // AI files are PDF-based, so we need to accept both formats
    console.log('[AI-to-SVG] Calling validateFile with allowedFormats:', ['ai', 'pdf'])
    const validation = validateFile(buffer, {
      allowedFormats: ['ai', 'pdf'],
      targetFormat: this.to
    })
    
    console.log('[AI-to-SVG] Validation result:', validation)
    
    if (!validation.isValid) {
      console.error('[AI-to-SVG] Validation failed:', validation.error)
      // For AI files, be more permissive if it's at least a PDF
      if (header.includes('%PDF')) {
        console.log('[AI-to-SVG] File is PDF format, allowing as potential AI file')
      } else {
        throw new FileValidationError(validation.error || 'Invalid AI file format')
      }
    }
    
    // Check if conversion is supported
    const conversionSupport = isConversionSupported(this.from, this.to)
    if (!conversionSupport.supported) {
      throw new ConversionError(
        conversionSupport.reason!,
        'UNSUPPORTED_CONVERSION'
      )
    }
    
    // Validate conversion parameters
    const paramValidation = validateConversionParams(options, this.from, this.to)
    if (!paramValidation.isValid) {
      throw new ConversionError(
        paramValidation.error!,
        'INVALID_PARAMETERS'
      )
    }
    
    console.log('[AI-to-SVG] Validation passed!')
  }

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
    options: AiToSvgOptions
  ): Promise<ConversionResult> {
    try {
      // Validate AI file header
      this.validateAIFile(input)

      // Load PDF document
      const loadingTask = this.pdfjs.getDocument({
        data: input,
        disableFontFace: true,
        cMapUrl: '/cmaps/',
        cMapPacked: true
      })

      const pdf = await loadingTask.promise
      
      // Get the specified artboard (AI files can have multiple artboards)
      const pageNum = options.artboard || 1
      const pageCount = pdf.numPages
      
      if (pageNum > pageCount) {
        throw new ConversionError(
          `Artboard ${pageNum} not found. This file has ${pageCount} artboard(s).`,
          'ARTBOARD_NOT_FOUND'
        )
      }

      const page = await pdf.getPage(pageNum)

      // Get viewport
      const viewport = page.getViewport({ scale: 1.0 })
      const width = viewport.width
      const height = viewport.height

      // Create SVG with AI metadata
      let svg = this.createSVGHeader(width, height)

      // Add AI-specific metadata
      svg += this.addAIMetadata(pdf, pageNum)

      // Get page operators
      const operatorList = await page.getOperatorList()
      
      // Try to use SVGGraphics if available
      try {
        if (this.pdfjs.SVGGraphics) {
          const svgGfx = new this.pdfjs.SVGGraphics(page.commonObjs, page.objs)
          svgGfx.embedFonts = false
          
          const svgElement = await svgGfx.getSVG(operatorList, viewport)
          const innerSVG = svgElement.innerHTML || svgElement.outerHTML || ''
          
          if (innerSVG.trim()) {
            svg += this.processSVGContent(innerSVG, options)
          } else {
            // If SVGGraphics didn't produce content, fall back to manual conversion
            svg += this.convertOperatorsToSVG(operatorList, viewport)
          }
        } else {
          // Fallback to manual conversion
          svg += this.convertOperatorsToSVG(operatorList, viewport)
        }
      } catch (svgError) {
        console.warn('SVGGraphics conversion failed, using fallback:', svgError)
        // Fallback to manual conversion
        svg += this.convertOperatorsToSVG(operatorList, viewport)
      }

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
          artboard: pageNum,
          totalArtboards: pageCount,
          method: 'pdf-based-conversion'
        }
      )
    } catch (error) {
      if (error instanceof ConversionError) {
        throw error
      }
      throw new ConversionError(
        `Failed to convert AI file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AI_CONVERSION_FAILED'
      )
    }
  }

  /**
   * Validate that the input is an AI file
   */
  private validateAIFile(buffer: Buffer): void {
    const header = buffer.toString('utf8', 0, Math.min(2048, buffer.length))
    
    // AI files are PDF-based, check for PDF header
    if (!header.includes('%PDF') && !header.includes('%!PS')) {
      throw new CorruptedFileError('Invalid AI file: Missing PDF/PostScript header')
    }
    
    // Look for Adobe Illustrator markers (more lenient check)
    // Some AI files might not have all markers, so check for any AI indicators
    const hasAIMarkers = header.includes('%%Creator: Adobe Illustrator') || 
                        header.includes('%%AI') ||
                        header.includes('/Creator (Adobe Illustrator)') ||
                        header.toLowerCase().includes('adobe illustrator') ||
                        header.includes('%%For: (Adobe Illustrator)') ||
                        header.includes('AI9_') ||
                        header.includes('Illustrator') ||
                        header.includes('%%Title:') && header.includes('.ai')
    
    // If this file was explicitly identified as AI format by the validation system,
    // be more lenient and allow it even without clear AI markers
    // (some AI files might be missing metadata, and some PDF files might actually be AI files)
    if (!hasAIMarkers) {
      console.warn('AI file validation: No clear AI markers found, but proceeding with PDF processing (file may be AI-compatible)')
    }
  }

  /**
   * Create SVG header with proper namespace
   */
  private createSVGHeader(width: number, height: number): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" 
     height="${height}" 
     viewBox="0 0 ${width} ${height}">\n`
  }

  /**
   * Add AI-specific metadata to SVG
   */
  private addAIMetadata(pdf: any, artboard: number): string {
    let metadata = '  <metadata>\n'
    metadata += '    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n'
    metadata += '      <rdf:Description rdf:about="">\n'
    metadata += '        <dc:format xmlns:dc="http://purl.org/dc/elements/1.1/">image/svg+xml</dc:format>\n'
    metadata += '        <dc:type xmlns:dc="http://purl.org/dc/elements/1.1/" rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>\n'
    metadata += `        <dc:source xmlns:dc="http://purl.org/dc/elements/1.1/">Adobe Illustrator (artboard ${artboard})</dc:source>\n`
    
    // Extract AI-specific metadata from PDF info
    try {
      if (pdf.fingerprints && pdf.fingerprints.length > 0) {
        metadata += `        <dc:identifier xmlns:dc="http://purl.org/dc/elements/1.1/">${pdf.fingerprints[0]}</dc:identifier>\n`
      }
      
      // Add PDF version info
      if (pdf._pdfInfo && pdf._pdfInfo.PDFFormatVersion) {
        metadata += `        <xmp:CreatorTool xmlns:xmp="http://ns.adobe.com/xap/1.0/">Adobe Illustrator (PDF ${pdf._pdfInfo.PDFFormatVersion})</xmp:CreatorTool>\n`
      }
      
      // Add creation date if available
      const currentDate = new Date().toISOString()
      metadata += `        <xmp:CreateDate xmlns:xmp="http://ns.adobe.com/xap/1.0/">${currentDate}</xmp:CreateDate>\n`
      metadata += `        <xmp:ModifyDate xmlns:xmp="http://ns.adobe.com/xap/1.0/">${currentDate}</xmp:ModifyDate>\n`
      
      // Add artboard information
      metadata += `        <illustrator:artboardIndex xmlns:illustrator="http://ns.adobe.com/illustrator/1.0/">${artboard}</illustrator:artboardIndex>\n`
      
    } catch (metadataError) {
      console.warn('Error extracting AI metadata:', metadataError)
    }
    
    metadata += '      </rdf:Description>\n'
    metadata += '    </rdf:RDF>\n'
    metadata += '  </metadata>\n'
    return metadata
  }

  /**
   * Process SVG content with AI-specific handling
   */
  private processSVGContent(svgContent: string, options: AiToSvgOptions): string {
    let processed = svgContent

    // Clean up any invalid characters or malformed XML
    processed = this.sanitizeSVGContent(processed)

    // Preserve layer structure if requested
    if (options.preserveLayers) {
      // Wrap content in groups to simulate layers and preserve structure
      processed = `  <g id="artboard-content" data-ai-layer="main">\n${processed}\n  </g>`
    }

    // Process AI-specific elements
    processed = this.processAIElements(processed)

    return processed
  }

  /**
   * Sanitize SVG content for safe embedding
   */
  private sanitizeSVGContent(content: string): string {
    // Remove any potentially harmful content while preserving valid SVG
    return content
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .trim()
  }

  /**
   * Process AI-specific elements and enhance them for SVG
   */
  private processAIElements(content: string): string {
    let processed = content

    // Convert any remaining PDF-specific attributes to SVG equivalents
    processed = processed
      .replace(/fill-opacity=/g, 'opacity=')
      .replace(/stroke-opacity=/g, 'stroke-opacity=')

    // Add AI-specific class names for styling
    processed = processed.replace(/<g([^>]*)>/g, '<g$1 class="ai-group">')
    processed = processed.replace(/<path([^>]*)>/g, '<path$1 class="ai-path">')

    return processed
  }

  /**
   * Convert PDF operators to SVG (fallback method)
   */
  private convertOperatorsToSVG(operatorList: any, viewport: any): string {
    let svg = ''
    const ops = operatorList.fnArray
    const args = operatorList.argsArray
    
    let currentPath = ''
    let currentColor = '#000000'
    let currentFillColor = '#000000'
    let currentStrokeWidth = 1
    let currentOpacity = 1
    let transformMatrix = [1, 0, 0, 1, 0, 0] // identity matrix
    
    // Safely access OPS constants
    const OPS = this.pdfjs.OPS || {}
    
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i]
      const arg = args[i]
      
      try {
        switch (op) {
          case OPS.beginPath:
            currentPath = 'M '
            break
            
          case OPS.moveTo:
            if (arg && arg.length >= 2) {
              currentPath += `${arg[0]} ${viewport.height - arg[1]} `
            }
            break
            
          case OPS.lineTo:
            if (arg && arg.length >= 2) {
              currentPath += `L ${arg[0]} ${viewport.height - arg[1]} `
            }
            break
            
          case OPS.curveTo:
            if (arg && arg.length >= 6) {
              currentPath += `C ${arg[0]} ${viewport.height - arg[1]}, ${arg[2]} ${viewport.height - arg[3]}, ${arg[4]} ${viewport.height - arg[5]} `
            }
            break
            
          case OPS.curveTo2:
            if (arg && arg.length >= 4) {
              currentPath += `Q ${arg[0]} ${viewport.height - arg[1]}, ${arg[2]} ${viewport.height - arg[3]} `
            }
            break
            
          case OPS.curveTo3:
            // Handle v operator (curve with first control point = current point)
            if (arg && arg.length >= 4) {
              currentPath += `S ${arg[0]} ${viewport.height - arg[1]}, ${arg[2]} ${viewport.height - arg[3]} `
            }
            break
            
          case OPS.closePath:
            currentPath += 'Z '
            break
            
          case OPS.stroke:
            if (currentPath.trim()) {
              svg += `  <path d="${currentPath.trim()}" fill="none" stroke="${currentColor}" stroke-width="${currentStrokeWidth}" opacity="${currentOpacity}"/>\n`
              currentPath = ''
            }
            break
            
          case OPS.fill:
          case OPS.eoFill:
            if (currentPath.trim()) {
              const fillRule = op === OPS.eoFill ? 'evenodd' : 'nonzero'
              svg += `  <path d="${currentPath.trim()}" fill="${currentFillColor}" stroke="none" opacity="${currentOpacity}" fill-rule="${fillRule}"/>\n`
              currentPath = ''
            }
            break
            
          case OPS.fillStroke:
          case OPS.eoFillStroke:
            if (currentPath.trim()) {
              const fillRule = op === OPS.eoFillStroke ? 'evenodd' : 'nonzero'
              svg += `  <path d="${currentPath.trim()}" fill="${currentFillColor}" stroke="${currentColor}" stroke-width="${currentStrokeWidth}" opacity="${currentOpacity}" fill-rule="${fillRule}"/>\n`
              currentPath = ''
            }
            break
          
          case OPS.setStrokeRGBColor:
            if (arg && arg.length >= 3) {
              const r = Math.round(Math.max(0, Math.min(255, arg[0] * 255)))
              const g = Math.round(Math.max(0, Math.min(255, arg[1] * 255)))
              const b = Math.round(Math.max(0, Math.min(255, arg[2] * 255)))
              currentColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            }
            break
            
          case OPS.setFillRGBColor:
            if (arg && arg.length >= 3) {
              const r = Math.round(Math.max(0, Math.min(255, arg[0] * 255)))
              const g = Math.round(Math.max(0, Math.min(255, arg[1] * 255)))
              const b = Math.round(Math.max(0, Math.min(255, arg[2] * 255)))
              currentFillColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            }
            break
            
          case OPS.setLineWidth:
            if (arg && arg.length > 0 && typeof arg[0] === 'number') {
              currentStrokeWidth = Math.max(0.1, arg[0])
            }
            break
            
          case OPS.setGState:
            // Handle graphics state (including opacity)
            if (arg && arg[0]) {
              const gState = arg[0]
              if (gState && typeof gState.ca === 'number') {
                currentOpacity = Math.max(0, Math.min(1, gState.ca))
              }
            }
            break
            
          case OPS.transform:
            // Handle coordinate transformations
            if (arg && arg.length >= 6) {
              transformMatrix = arg.slice(0, 6)
            }
            break
            
          // Ignore unsupported operations
          default:
            // Skip unsupported operations silently
            break
        }
      } catch (operatorError) {
        console.warn(`Error processing PDF operator ${op}:`, operatorError)
        // Continue processing other operators
      }
    }
    
    // If there's an unfinished path, try to render it
    if (currentPath.trim()) {
      svg += `  <path d="${currentPath.trim()}" fill="none" stroke="${currentColor}" stroke-width="${currentStrokeWidth}" opacity="${currentOpacity}"/>\n`
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
export const aiToSvgConverter = new AIToSVGConverter()

// Export the handler for direct use
export const aiToSvgHandler = aiToSvgConverter.handler