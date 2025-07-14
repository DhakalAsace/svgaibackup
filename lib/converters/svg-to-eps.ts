/**
 * SVG to EPS Converter Implementation
 * 
 * Converts SVG files to Encapsulated PostScript (EPS) format.
 * Parses SVG elements and translates them to PostScript commands.
 * Supports basic shapes, paths, text, and styling.
 */

import { BaseConverter } from './base-converter'
import type { 
  ConversionOptions, 
  ConversionResult,
  ImageFormat
} from './types'
import { 
  ConversionError,
  CorruptedFileError
} from './errors'

/**
 * Extended conversion options for SVG to EPS
 */
interface SvgToEpsOptions extends ConversionOptions {
  /** PostScript level (default: 3) */
  psLevel?: 1 | 2 | 3
  /** Color mode (default: 'rgb') */
  colorMode?: 'rgb' | 'cmyk' | 'grayscale'
  /** Embed fonts (default: false) */
  embedFonts?: boolean
}

/**
 * SVG to EPS Converter
 * Extends BaseConverter for standard error handling and progress tracking
 */
class SVGToEPSConverter extends BaseConverter {
  name = 'SVG to EPS'
  from: ImageFormat = 'svg'
  to: ImageFormat = 'eps'
  description = 'Convert SVG files to Encapsulated PostScript format for print and design workflows'

  /**
   * Perform the actual conversion
   */
  protected async performConversion(
    input: Buffer,
    options: SvgToEpsOptions
  ): Promise<ConversionResult> {
    try {
      // Convert buffer to string
      const svgString = input.toString('utf8').trim()
      
      // Validate SVG
      if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
        throw new CorruptedFileError('Invalid SVG: Missing SVG tag')
      }

      // Parse SVG
      const svgData = this.parseSVG(svgString)
      
      // Report progress
      this.reportProgress(options, 0.5)

      // Generate EPS
      const epsContent = this.generateEPS(svgData, options)
      
      // Report completion
      this.reportProgress(options, 0.9)

      return this.createSuccessResult(
        epsContent,
        'application/postscript',
        {
          width: svgData.width,
          height: svgData.height,
          elementCount: svgData.elements.length
        }
      )
    } catch (error) {
      if (error instanceof CorruptedFileError) {
        throw error
      }
      throw new ConversionError(
        `Failed to convert SVG to EPS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SVG_TO_EPS_FAILED'
      )
    }
  }

  /**
   * Parse SVG content to extract structure
   */
  private parseSVG(svg: string): SVGData {
    // Extract dimensions
    const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
    const widthMatch = svg.match(/width="([^"]+)"/)
    const heightMatch = svg.match(/height="([^"]+)"/)
    
    let width = 100, height = 100, viewBox = '0 0 100 100'
    
    if (viewBoxMatch) {
      viewBox = viewBoxMatch[1]
      const parts = viewBox.split(/\s+/).map(Number)
      width = parts[2] - parts[0]
      height = parts[3] - parts[1]
    }
    
    if (widthMatch) width = this.parseUnit(widthMatch[1])
    if (heightMatch) height = this.parseUnit(heightMatch[1])

    // Parse elements (simplified)
    const elements = this.parseSVGElements(svg)

    return {
      width,
      height,
      viewBox,
      elements
    }
  }

  /**
   * Parse SVG elements
   */
  private parseSVGElements(svg: string): SVGElement[] {
    const elements: SVGElement[] = []
    
    // Parse paths
    const pathMatches = svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)
    for (const match of Array.from(pathMatches)) {
      const attrs = this.parseAttributes(match[0])
      elements.push({
        type: 'path',
        d: match[1],
        fill: attrs.fill || 'black',
        stroke: attrs.stroke || 'none',
        strokeWidth: attrs['stroke-width'] || '1',
        transform: attrs.transform || ''
      } as SVGElement)
    }

    // Parse rectangles
    const rectMatches = svg.matchAll(/<rect[^>]*>/g)
    for (const match of Array.from(rectMatches)) {
      const attrs = this.parseAttributes(match[0])
      elements.push({
        type: 'rect',
        x: parseFloat(attrs.x || '0'),
        y: parseFloat(attrs.y || '0'),
        width: parseFloat(attrs.width || '0'),
        height: parseFloat(attrs.height || '0'),
        fill: attrs.fill || 'black',
        stroke: attrs.stroke || 'none',
        strokeWidth: attrs['stroke-width'] || '1',
        transform: attrs.transform || ''
      })
    }

    // Parse circles
    const circleMatches = svg.matchAll(/<circle[^>]*>/g)
    for (const match of Array.from(circleMatches)) {
      const attrs = this.parseAttributes(match[0])
      elements.push({
        type: 'circle',
        cx: parseFloat(attrs.cx || '0'),
        cy: parseFloat(attrs.cy || '0'),
        r: parseFloat(attrs.r || '0'),
        fill: attrs.fill || 'black',
        stroke: attrs.stroke || 'none',
        strokeWidth: attrs['stroke-width'] || '1',
        transform: attrs.transform || ''
      })
    }

    // Parse text
    const textMatches = svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)
    for (const match of Array.from(textMatches)) {
      const attrs = this.parseAttributes(match[0])
      elements.push({
        type: 'text',
        x: parseFloat(attrs.x || '0'),
        y: parseFloat(attrs.y || '0'),
        text: match[1],
        fontSize: attrs['font-size'] || '12',
        fontFamily: attrs['font-family'] || 'Helvetica',
        fill: attrs.fill || 'black',
        transform: attrs.transform || ''
      })
    }

    return elements
  }

  /**
   * Parse attributes from an element string
   */
  private parseAttributes(elementStr: string): Record<string, string> {
    const attrs: Record<string, string> = {}
    const attrMatches = elementStr.matchAll(/(\w+(?:-\w+)?)="([^"]+)"/g)
    for (const match of Array.from(attrMatches)) {
      attrs[match[1]] = match[2]
    }
    return attrs
  }

  /**
   * Parse unit values
   */
  private parseUnit(value: string): number {
    const num = parseFloat(value)
    if (value.endsWith('px')) return num
    if (value.endsWith('pt')) return num * 1.25
    if (value.endsWith('mm')) return num * 3.543307
    if (value.endsWith('cm')) return num * 35.43307
    if (value.endsWith('in')) return num * 90
    return num
  }

  /**
   * Generate EPS content from parsed SVG
   */
  private generateEPS(svgData: SVGData, options: SvgToEpsOptions): string {
    const psLevel = options.psLevel || 3
    const date = new Date().toISOString()
    
    let eps = `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: SVG to EPS Converter
%%Title: Converted SVG
%%CreationDate: ${date}
%%BoundingBox: 0 0 ${Math.ceil(svgData.width)} ${Math.ceil(svgData.height)}
%%LanguageLevel: ${psLevel}
%%Pages: 1
%%EndComments

%%BeginProlog
% Define procedures for SVG-like operations
/m {moveto} def
/l {lineto} def
/c {curveto} def
/cp {closepath} def
/f {fill} def
/s {stroke} def
/gs {gsave} def
/gr {grestore} def
/rgb {setrgbcolor} def
/w {setlinewidth} def
/sf {selectfont} def

% SVG path command procedures
/M {moveto} def
/L {lineto} def
/C {curveto} def
/Z {closepath} def
/H {exch dup 3 1 roll exch lineto} def
/V {exch dup 3 1 roll lineto} def
%%EndProlog

%%Page: 1 1
gsave

% Set coordinate system (flip Y axis for SVG compatibility)
0 ${svgData.height} translate
1 -1 scale

`

    // Process each element
    for (const element of svgData.elements) {
      eps += this.elementToPS(element, svgData.height) + '\n'
    }

    eps += `
grestore
showpage
%%EOF`

    return eps
  }

  /**
   * Convert SVG element to PostScript
   */
  private elementToPS(element: SVGElement, pageHeight: number): string {
    let ps = 'gsave\n'
    
    // Apply transform if present
    if (element.transform) {
      ps += this.transformToPS(element.transform) + '\n'
    }

    // Set colors
    const fillColor = this.colorToPS(element.fill || 'black')
    const strokeColor = this.colorToPS(element.stroke || 'none')
    
    switch (element.type) {
      case 'path':
        ps += this.pathToPS(element.d!, fillColor, strokeColor, element.strokeWidth || '1')
        break
        
      case 'rect':
        ps += `${fillColor}\n`
        ps += `${element.x} ${element.y} ${element.width} ${element.height} rectfill\n`
        if (element.stroke !== 'none') {
          ps += `${strokeColor}\n`
          ps += `${element.strokeWidth} w\n`
          ps += `${element.x} ${element.y} ${element.width} ${element.height} rectstroke\n`
        }
        break
        
      case 'circle':
        ps += `newpath\n`
        ps += `${element.cx} ${element.cy} ${element.r} 0 360 arc\n`
        if (element.fill !== 'none') {
          ps += `${fillColor}\n`
          ps += `fill\n`
        }
        if (element.stroke !== 'none') {
          ps += `${strokeColor}\n`
          ps += `${element.strokeWidth} w\n`
          ps += `stroke\n`
        }
        break
        
      case 'text':
        ps += `${fillColor}\n`
        ps += `/${element.fontFamily || 'Helvetica'} findfont\n`
        ps += `${element.fontSize || '12'} scalefont setfont\n`
        ps += `${element.x} ${element.y} moveto\n`
        ps += `(${this.escapePS(element.text || '')}) show\n`
        break
    }
    
    ps += 'grestore'
    return ps
  }

  /**
   * Convert SVG path to PostScript
   */
  private pathToPS(d: string, fill: string, stroke: string, strokeWidth: string): string {
    let ps = 'newpath\n'
    
    // Simple path parser (handles basic commands)
    const commands = d.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || []
    
    for (const cmd of commands) {
      const type = cmd[0]
      const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number)
      
      switch (type.toUpperCase()) {
        case 'M':
          ps += `${nums[0]} ${nums[1]} m\n`
          break
        case 'L':
          ps += `${nums[0]} ${nums[1]} l\n`
          break
        case 'H':
          ps += `${nums[0]} currentpoint exch pop l\n`
          break
        case 'V':
          ps += `currentpoint pop ${nums[0]} l\n`
          break
        case 'C':
          ps += `${nums[0]} ${nums[1]} ${nums[2]} ${nums[3]} ${nums[4]} ${nums[5]} c\n`
          break
        case 'Z':
          ps += 'cp\n'
          break
      }
    }
    
    if (fill !== 'none') {
      ps += `${fill}\n`
      ps += 'f\n'
    }
    
    if (stroke !== 'none') {
      ps += `${stroke}\n`
      ps += `${strokeWidth} w\n`
      ps += 's\n'
    }
    
    return ps
  }

  /**
   * Convert color to PostScript RGB
   */
  private colorToPS(color: string): string {
    if (color === 'none' || color === 'transparent') return ''
    
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16) / 255
      const g = parseInt(hex.slice(2, 4), 16) / 255
      const b = parseInt(hex.slice(4, 6), 16) / 255
      return `${r} ${g} ${b} rgb`
    }
    
    // Handle named colors (simplified)
    const namedColors: Record<string, [number, number, number]> = {
      black: [0, 0, 0],
      white: [1, 1, 1],
      red: [1, 0, 0],
      green: [0, 1, 0],
      blue: [0, 0, 1],
      yellow: [1, 1, 0],
      cyan: [0, 1, 1],
      magenta: [1, 0, 1]
    }
    
    if (namedColors[color]) {
      const [r, g, b] = namedColors[color]
      return `${r} ${g} ${b} rgb`
    }
    
    // Default to black
    return '0 0 0 rgb'
  }

  /**
   * Convert SVG transform to PostScript
   */
  private transformToPS(transform: string): string {
    // Simple transform parser (handles basic transforms)
    if (transform.includes('translate')) {
      const match = transform.match(/translate\(([^)]+)\)/)
      if (match) {
        const [x, y = '0'] = match[1].split(/[\s,]+/)
        return `${x} ${y} translate`
      }
    }
    
    if (transform.includes('scale')) {
      const match = transform.match(/scale\(([^)]+)\)/)
      if (match) {
        const [sx, sy = sx] = match[1].split(/[\s,]+/)
        return `${sx} ${sy} scale`
      }
    }
    
    if (transform.includes('rotate')) {
      const match = transform.match(/rotate\(([^)]+)\)/)
      if (match) {
        const angle = parseFloat(match[1])
        return `${angle} rotate`
      }
    }
    
    return ''
  }

  /**
   * Escape special characters for PostScript strings
   */
  private escapePS(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
  }
}

// Type definitions for parsed SVG data
interface SVGData {
  width: number
  height: number
  viewBox: string
  elements: SVGElement[]
}

interface SVGElement {
  type: 'path' | 'rect' | 'circle' | 'text'
  fill?: string
  stroke?: string
  strokeWidth?: string
  transform?: string
  // Path specific
  d?: string
  // Rect specific
  x?: number
  y?: number
  width?: number
  height?: number
  // Circle specific
  cx?: number
  cy?: number
  r?: number
  // Text specific
  text?: string
  fontSize?: string
  fontFamily?: string
}

// Export the converter instance
export const svgToEpsConverter = new SVGToEPSConverter()

// Export the handler for direct use
export const svgToEpsHandler = svgToEpsConverter.handler