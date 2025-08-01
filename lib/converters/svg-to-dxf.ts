/**
 * SVG to DXF Converter Implementation
 * 
 * This module provides SVG to DXF (Drawing Exchange Format) conversion.
 * DXF is a CAD data file format developed by Autodesk for enabling
 * data interoperability between AutoCAD and other programs.
 * 
 * Uses browser-specific implementation when running in browser environment.
 */
import type { 
  ConversionHandler, 
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
 * Extended conversion options for SVG to DXF
 */
interface SvgToDxfOptions extends ConversionOptions {
  /** DXF version (default: 'AC1015' for AutoCAD 2000) */
  version?: string
  /** Units for the DXF file (default: 'mm') */
  units?: 'mm' | 'cm' | 'in' | 'ft'
  /** Preserve layers from SVG groups (default: false) */
  preserveLayers?: boolean
}
/**
 * Validates that the input is an SVG
 */
function validateSvgInput(input: Buffer | string): string {
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
 * SVG element representation for parsing
 */
interface SvgElement {
  type: 'line' | 'circle' | 'rect' | 'path' | 'ellipse' | 'polyline' | 'polygon'
  attributes: Record<string, string>
}
/**
 * Parse SVG string and extract basic elements
 */
function parseSvgElements(svgContent: string): SvgElement[] {
  const elements: SvgElement[] = []
  // Extract viewBox and dimensions for coordinate mapping
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 100, 100]
  // Parse line elements
  const lineRegex = /<line[^>]*>/g
  let match
  while ((match = lineRegex.exec(svgContent)) !== null) {
    const attrs: Record<string, string> = {}
    const attrRegex = /(\w+)="([^"]*)"/g
    let attrMatch
    while ((attrMatch = attrRegex.exec(match[0])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }
    elements.push({ type: 'line', attributes: attrs })
  }
  // Parse circle elements
  const circleRegex = /<circle[^>]*>/g
  while ((match = circleRegex.exec(svgContent)) !== null) {
    const attrs: Record<string, string> = {}
    const attrRegex = /(\w+)="([^"]*)"/g
    let attrMatch
    while ((attrMatch = attrRegex.exec(match[0])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }
    elements.push({ type: 'circle', attributes: attrs })
  }
  // Parse rect elements
  const rectRegex = /<rect[^>]*>/g
  while ((match = rectRegex.exec(svgContent)) !== null) {
    const attrs: Record<string, string> = {}
    const attrRegex = /(\w+)="([^"]*)"/g
    let attrMatch
    while ((attrMatch = attrRegex.exec(match[0])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }
    elements.push({ type: 'rect', attributes: attrs })
  }
  // Parse polyline elements
  const polylineRegex = /<polyline[^>]*>/g
  while ((match = polylineRegex.exec(svgContent)) !== null) {
    const attrs: Record<string, string> = {}
    const attrRegex = /(\w+)="([^"]*)"/g
    let attrMatch
    while ((attrMatch = attrRegex.exec(match[0])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }
    elements.push({ type: 'polyline', attributes: attrs })
  }
  // Parse simple path elements (only M, L, Z commands for now)
  const pathRegex = /<path[^>]*d="([^"]*)"/g
  while ((match = pathRegex.exec(svgContent)) !== null) {
    const attrs: Record<string, string> = { d: match[1] }
    const attrRegex = /(\w+)="([^"]*)"/g
    let attrMatch
    const fullMatch = svgContent.substring(svgContent.lastIndexOf('<path', match.index), match.index + match[0].length)
    while ((attrMatch = attrRegex.exec(fullMatch)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }
    elements.push({ type: 'path', attributes: attrs })
  }
  return elements
}
/**
 * Convert SVG elements to DXF entities
 */
function svgToDxfEntities(elements: SvgElement[]): string {
  let entities = ''
  const colorIndex = 7 // Default white color in DXF
  elements.forEach(element => {
    switch (element.type) {
      case 'line': {
        const x1 = parseFloat(element.attributes.x1 || '0')
        const y1 = parseFloat(element.attributes.y1 || '0')
        const x2 = parseFloat(element.attributes.x2 || '0')
        const y2 = parseFloat(element.attributes.y2 || '0')
        entities += `0
LINE
8
0
62
${colorIndex}
10
${x1.toFixed(6)}
20
${y1.toFixed(6)}
30
0.0
11
${x2.toFixed(6)}
21
${y2.toFixed(6)}
31
0.0
`
        break
      }
      case 'circle': {
        const cx = parseFloat(element.attributes.cx || '0')
        const cy = parseFloat(element.attributes.cy || '0')
        const r = parseFloat(element.attributes.r || '0')
        entities += `0
CIRCLE
8
0
62
${colorIndex}
10
${cx.toFixed(6)}
20
${cy.toFixed(6)}
30
0.0
40
${r.toFixed(6)}
`
        break
      }
      case 'rect': {
        const x = parseFloat(element.attributes.x || '0')
        const y = parseFloat(element.attributes.y || '0')
        const width = parseFloat(element.attributes.width || '0')
        const height = parseFloat(element.attributes.height || '0')
        // Convert rectangle to 4 lines
        entities += `0
LINE
8
0
62
${colorIndex}
10
${x.toFixed(6)}
20
${y.toFixed(6)}
30
0.0
11
${(x + width).toFixed(6)}
21
${y.toFixed(6)}
31
0.0
0
LINE
8
0
62
${colorIndex}
10
${(x + width).toFixed(6)}
20
${y.toFixed(6)}
30
0.0
11
${(x + width).toFixed(6)}
21
${(y + height).toFixed(6)}
31
0.0
0
LINE
8
0
62
${colorIndex}
10
${(x + width).toFixed(6)}
20
${(y + height).toFixed(6)}
30
0.0
11
${x.toFixed(6)}
21
${(y + height).toFixed(6)}
31
0.0
0
LINE
8
0
62
${colorIndex}
10
${x.toFixed(6)}
20
${(y + height).toFixed(6)}
30
0.0
11
${x.toFixed(6)}
21
${y.toFixed(6)}
31
0.0
`
        break
      }
      case 'polyline': {
        const points = element.attributes.points
        if (points) {
          const coords = points.trim().split(/\s+/).map(p => p.split(',').map(Number))
          // Create LWPOLYLINE entity
          entities += `0
LWPOLYLINE
8
0
62
${colorIndex}
90
${coords.length}
70
0
`
          coords.forEach(([x, y]) => {
            entities += `10
${x.toFixed(6)}
20
${y.toFixed(6)}
`
          })
        }
        break
      }
      case 'path': {
        const d = element.attributes.d
        if (d) {
          // Simple path parsing - only handles M (move) and L (line) commands
          const commands = d.match(/[MLZ][^MLZ]*/g) || []
          let currentX = 0, currentY = 0
          let firstX = 0, firstY = 0
          commands.forEach((cmd, index) => {
            const type = cmd[0]
            const coords = cmd.substring(1).trim().split(/[\s,]+/).map(Number)
            switch (type) {
              case 'M': // Move to
                currentX = coords[0]
                currentY = coords[1]
                if (index === 0) {
                  firstX = currentX
                  firstY = currentY
                }
                break
              case 'L': // Line to
                if (coords.length >= 2) {
                  entities += `0
LINE
8
0
62
${colorIndex}
10
${currentX.toFixed(6)}
20
${currentY.toFixed(6)}
30
0.0
11
${coords[0].toFixed(6)}
21
${coords[1].toFixed(6)}
31
0.0
`
                  currentX = coords[0]
                  currentY = coords[1]
                }
                break
              case 'Z': // Close path
                entities += `0
LINE
8
0
62
${colorIndex}
10
${currentX.toFixed(6)}
20
${currentY.toFixed(6)}
30
0.0
11
${firstX.toFixed(6)}
21
${firstY.toFixed(6)}
31
0.0
`
                break
            }
          })
        }
        break
      }
    }
  })
  return entities
}
/**
 * Generate complete DXF file content
 */
function generateDxfContent(elements: SvgElement[], options: SvgToDxfOptions): string {
  const version = options.version || 'AC1015'
  const entities = svgToDxfEntities(elements)
  // Calculate bounds from elements
  const minX = 0, minY = 0, maxX = 100, maxY = 100
  // Basic DXF file structure
  const dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
${version}
9
$EXTMIN
10
${minX.toFixed(6)}
20
${minY.toFixed(6)}
30
0.0
9
$EXTMAX
10
${maxX.toFixed(6)}
20
${maxY.toFixed(6)}
30
0.0
9
$LUNITS
70
2
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
ENTITIES
${entities}0
ENDSEC
0
EOF`
  return dxfContent
}
/**
 * Converts SVG to DXF
 * Implements the ConversionHandler interface
 */
export const svgToDxfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToDxfOptions = {}
): Promise<ConversionResult> => {
  try {
    const svgString = validateSvgInput(input)
    // Parse SVG elements
    const elements = parseSvgElements(svgString)
    if (elements.length === 0) {
      throw new ConversionError(
        'No convertible elements found in SVG file',
        'SVG_NO_ELEMENTS'
      )
    }
    // Generate DXF content
    const dxfContent = generateDxfContent(elements, options)
    const dxfBuffer = Buffer.from(dxfContent, 'utf8')
    return {
      success: true,
      data: dxfBuffer,
      mimeType: 'application/dxf',
      metadata: {
        format: 'dxf',
        size: dxfBuffer.length,
        elementCount: elements.length
      }
    }
  } catch (error) {
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to DXF conversion failed: ${error.message}`,
        'SVG_TO_DXF_FAILED'
      )
    }
    throw new ConversionError(
      'An unexpected error occurred during SVG to DXF conversion',
      'SVG_TO_DXF_UNKNOWN_ERROR'
    )
  }
}
/**
 * Client-side SVG to DXF conversion wrapper
 */
export async function convertSvgToDxfClient(
  input: File | string,
  options: SvgToDxfOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const text = await input.text()
    return svgToDxfHandler(text, options)
  }
  return svgToDxfHandler(input, options)
}
/**
 * Server-side SVG to DXF conversion wrapper
 */
export async function convertSvgToDxfServer(
  input: Buffer | string,
  options: SvgToDxfOptions = {}
): Promise<ConversionResult> {
  return svgToDxfHandler(input, options)
}
// Use browser implementation when available
let actualHandler: ConversionHandler = svgToDxfHandler
// Override with browser implementation if in browser environment
if (typeof window !== 'undefined') {
  import('./svg-to-dxf-browser').then(module => {
    actualHandler = module.svgToDxfBrowserConverter.handler
  }).catch(() => {
    // Fall back to basic implementation if browser module fails to load
    })
}
/**
 * SVG to DXF converter configuration
 */
export const svgToDxfConverter = {
  name: 'SVG to DXF',
  from: 'svg' as ImageFormat,
  to: 'dxf' as ImageFormat,
  handler: (input: Buffer | string, options: ConversionOptions) => actualHandler(input, options),
  isClientSide: true, // Can run client-side
  description: 'Convert SVG files to DXF (Drawing Exchange Format) for CAD applications'
}