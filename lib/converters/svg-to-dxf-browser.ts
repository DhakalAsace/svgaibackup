/**
 * Browser-specific SVG to DXF Converter Implementation
 * 
 * This module provides client-side SVG to DXF conversion using dxf-writer library.
 * Converts SVG elements to DXF entities for CAD applications.
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
import { loadDxfWriter } from './lazy-loader'

/**
 * Extended conversion options for SVG to DXF
 */
export interface SvgToDxfOptions extends ConversionOptions {
  /** DXF version (default: 'AC1015' for AutoCAD 2000) */
  version?: string
  /** Units for the DXF file */
  units?: 'mm' | 'cm' | 'in' | 'ft'
  /** Preserve layers from SVG groups */
  preserveLayers?: boolean
  /** Decimal precision for coordinates */
  precision?: number
}

/**
 * SVG element interface for parsing
 */
interface ParsedSvgElement {
  type: 'line' | 'circle' | 'rect' | 'path' | 'ellipse' | 'polyline' | 'polygon' | 'text'
  element: SVGElement
  transform?: DOMMatrix
  style?: CSSStyleDeclaration
  layer?: string
}

/**
 * SVG to DXF Converter using dxf-writer (browser implementation)
 */
class SvgToDxfBrowserConverter extends LazyLoadedConverter {
  name = 'SVG to DXF'
  from: ImageFormat = 'svg'
  to: ImageFormat = 'dxf'
  description = 'Convert SVG files to DXF (Drawing Exchange Format) for CAD applications'
  isClientSide = true

  private DxfWriter: any = null

  /**
   * Load the dxf-writer library
   */
  protected async loadLibraries(): Promise<void> {
    const dxfWriterModule = await loadDxfWriter()
    this.DxfWriter = dxfWriterModule.default || dxfWriterModule
  }

  /**
   * Perform the actual conversion after libraries are loaded
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: SvgToDxfOptions = {}
  ): Promise<ConversionResult> {
    try {
      // Convert buffer to string
      const svgString = input.toString('utf8')
      
      // Validate SVG
      if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
        throw new FileValidationError('Invalid SVG: Missing SVG tag')
      }

      // Report progress: parsing SVG
      this.reportProgress(options, 0.4)

      // Parse SVG using browser DOM
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')
      
      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror')
      if (parserError) {
        throw new ConversionError(
          'Failed to parse SVG: ' + parserError.textContent,
          'SVG_PARSE_ERROR'
        )
      }

      const svgElement = svgDoc.documentElement as unknown as SVGSVGElement
      if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
        throw new ConversionError(
          'Invalid SVG document structure',
          'SVG_INVALID_STRUCTURE'
        )
      }

      // Extract elements
      const elements = this.extractSvgElements(svgElement, options.preserveLayers)
      
      if (elements.length === 0) {
        throw new ConversionError(
          'No convertible elements found in SVG',
          'SVG_NO_ELEMENTS'
        )
      }

      // Report progress: converting to DXF
      this.reportProgress(options, 0.6)

      // Create DXF document
      const dxf = new this.DxfWriter()

      // Set units
      if (options.units) {
        dxf.setUnits(options.units)
      }

      // Get SVG dimensions and viewBox
      const viewBox = svgElement.viewBox.baseVal
      const width = viewBox.width || svgElement.width.baseVal.value || 100
      const height = viewBox.height || svgElement.height.baseVal.value || 100

      // Convert elements to DXF entities
      let convertedCount = 0
      for (const element of elements) {
        this.convertElementToDxf(dxf, element, height, options)
        convertedCount++
        
        // Report progress during conversion
        const progress = 0.6 + (0.3 * (convertedCount / elements.length))
        this.reportProgress(options, progress)
      }

      // Generate DXF string
      const dxfContent = dxf.toDxfString()
      const dxfBuffer = Buffer.from(dxfContent, 'utf8')

      return this.createSuccessResult(dxfBuffer, 'application/dxf', {
        elementCount: elements.length,
        units: options.units || 'Millimeters',
        dimensions: { width, height }
      })

    } catch (error) {
      if (error instanceof FileValidationError || 
          error instanceof ConversionError) {
        throw error
      }
      
      throw new ConversionError(
        `SVG to DXF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SVG_TO_DXF_FAILED'
      )
    }
  }

  /**
   * Extract SVG elements recursively
   */
  private extractSvgElements(
    element: Element,
    preserveLayers: boolean = false,
    parentTransform?: DOMMatrix,
    currentLayer?: string
  ): ParsedSvgElement[] {
    const elements: ParsedSvgElement[] = []

    // Get current transform
    let transform = parentTransform || new DOMMatrix()
    if (element instanceof SVGGraphicsElement && element.transform) {
      const elementTransform = element.transform.baseVal.consolidate()
      if (elementTransform) {
        transform = transform.multiply(elementTransform.matrix)
      }
    }

    // Handle groups for layers
    if (element.tagName === 'g' && preserveLayers) {
      const layerName = element.id || element.getAttribute('inkscape:label') || `layer_${Date.now()}`
      currentLayer = layerName
    }

    // Process supported elements
    const tagName = element.tagName.toLowerCase()
    const supportedTags = ['line', 'circle', 'rect', 'path', 'ellipse', 'polyline', 'polygon', 'text']
    
    if (supportedTags.includes(tagName)) {
      elements.push({
        type: tagName as any,
        element: element as SVGElement,
        transform,
        style: window.getComputedStyle(element),
        layer: currentLayer
      })
    }

    // Process children
    for (const child of element.children) {
      elements.push(...this.extractSvgElements(child, preserveLayers, transform, currentLayer))
    }

    return elements
  }

  /**
   * Convert a single SVG element to DXF entity
   */
  private convertElementToDxf(
    dxf: any,
    element: ParsedSvgElement,
    svgHeight: number,
    options: SvgToDxfOptions
  ): void {
    const precision = options.precision || 6

    // Set layer if preserving layers
    if (options.preserveLayers && element.layer) {
      dxf.addLayer(element.layer, this.DxfWriter.ACI.WHITE, 'CONTINUOUS')
      dxf.setActiveLayer(element.layer)
    }

    // Apply transform to coordinates
    const transformPoint = (x: number, y: number): [number, number] => {
      // SVG to DXF coordinate transformation (flip Y axis)
      y = svgHeight - y

      if (element.transform) {
        const point = new DOMPoint(x, y)
        const transformed = point.matrixTransform(element.transform)
        return [
          parseFloat(transformed.x.toFixed(precision)),
          parseFloat(transformed.y.toFixed(precision))
        ]
      }
      return [
        parseFloat(x.toFixed(precision)),
        parseFloat(y.toFixed(precision))
      ]
    }

    switch (element.type) {
      case 'line': {
        const line = element.element as SVGLineElement
        const [x1, y1] = transformPoint(line.x1.baseVal.value, line.y1.baseVal.value)
        const [x2, y2] = transformPoint(line.x2.baseVal.value, line.y2.baseVal.value)
        dxf.drawLine(x1, y1, x2, y2)
        break
      }

      case 'circle': {
        const circle = element.element as SVGCircleElement
        const [cx, cy] = transformPoint(circle.cx.baseVal.value, circle.cy.baseVal.value)
        const radius = circle.r.baseVal.value
        dxf.drawCircle(cx, cy, radius)
        break
      }

      case 'rect': {
        const rect = element.element as SVGRectElement
        const x = rect.x.baseVal.value
        const y = rect.y.baseVal.value
        const width = rect.width.baseVal.value
        const height = rect.height.baseVal.value

        // Convert to polyline (closed rectangle)
        const points = [
          transformPoint(x, y),
          transformPoint(x + width, y),
          transformPoint(x + width, y + height),
          transformPoint(x, y + height)
        ]
        
        dxf.drawPolyline(points, true) // true = closed
        break
      }

      case 'ellipse': {
        const ellipse = element.element as SVGEllipseElement
        const [cx, cy] = transformPoint(ellipse.cx.baseVal.value, ellipse.cy.baseVal.value)
        const rx = ellipse.rx.baseVal.value
        const ry = ellipse.ry.baseVal.value

        if (rx === ry) {
          // It's a circle
          dxf.drawCircle(cx, cy, rx)
        } else {
          // Approximate ellipse with polyline
          const points: [number, number][] = []
          const segments = 64
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI
            const x = cx + rx * Math.cos(angle)
            const y = cy + ry * Math.sin(angle)
            points.push(transformPoint(x, y))
          }
          dxf.drawPolyline(points, true)
        }
        break
      }

      case 'polyline':
      case 'polygon': {
        const poly = element.element as SVGPolylineElement | SVGPolygonElement
        const points: [number, number][] = []
        
        for (let i = 0; i < poly.points.numberOfItems; i++) {
          const point = poly.points.getItem(i)
          points.push(transformPoint(point.x, point.y))
        }

        const closed = element.type === 'polygon'
        dxf.drawPolyline(points, closed)
        break
      }

      case 'path': {
        const path = element.element as SVGPathElement
        const pathData = path.getAttribute('d')
        if (!pathData) break

        // Convert path to polyline points
        const points = this.pathToPolyline(path, transformPoint)
        if (points.length > 0) {
          // Check if path is closed
          const closed = pathData.includes('Z') || pathData.includes('z')
          dxf.drawPolyline(points, closed)
        }
        break
      }

      case 'text': {
        const text = element.element as SVGTextElement
        const content = text.textContent || ''
        const [x, y] = transformPoint(
          text.x.baseVal.getItem(0)?.value || 0,
          text.y.baseVal.getItem(0)?.value || 0
        )
        const fontSize = parseFloat(element.style?.fontSize || '12')
        
        dxf.drawText(x, y, fontSize, 0, content)
        break
      }
    }
  }

  /**
   * Convert SVG path to polyline points
   */
  private pathToPolyline(
    path: SVGPathElement,
    transformPoint: (x: number, y: number) => [number, number]
  ): [number, number][] {
    const points: [number, number][] = []
    const length = path.getTotalLength()
    
    // Sample points along the path
    const segments = Math.max(100, Math.ceil(length / 5)) // More segments for longer paths
    
    for (let i = 0; i <= segments; i++) {
      const distance = (i / segments) * length
      const point = path.getPointAtLength(distance)
      points.push(transformPoint(point.x, point.y))
    }

    return points
  }
}

// Export singleton instance
export const svgToDxfBrowserConverter = new SvgToDxfBrowserConverter()

/**
 * Browser-specific conversion function
 */
export async function convertSvgToDxfBrowser(
  input: File | Blob | ArrayBuffer | string,
  options: SvgToDxfOptions = {}
): Promise<ConversionResult> {
  let buffer: Buffer

  if (input instanceof File || input instanceof Blob) {
    const arrayBuffer = await input.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  } else if (input instanceof ArrayBuffer) {
    buffer = Buffer.from(input)
  } else if (typeof input === 'string') {
    buffer = Buffer.from(input, 'utf8')
  } else {
    throw new ConversionError(
      'Invalid input type. Expected File, Blob, ArrayBuffer, or string.',
      'INVALID_INPUT_TYPE'
    )
  }

  return svgToDxfBrowserConverter.handler(buffer, options)
}