/**
 * DXF to SVG Converter Implementation
 * 
 * This module provides DXF (Drawing Exchange Format) to SVG conversion.
 * DXF is a CAD file format developed by Autodesk for data interoperability
 * between AutoCAD and other programs.
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
/**
 * Extended conversion options for DXF to SVG
 */
interface DxfToSvgOptions extends ConversionOptions {
  /** Scale factor for the output (default: 1) */
  scale?: number
  /** Stroke width for lines (default: 1) */
  strokeWidth?: number
  /** Default color for elements (default: black) */
  defaultColor?: string
  /** Convert curves to polylines (default: false) */
  curvesToPolylines?: boolean
}
/**
 * Simple DXF entity representation
 */
interface DxfEntity {
  type: string
  points?: Array<{x: number, y: number}>
  center?: {x: number, y: number}
  radius?: number
  startAngle?: number
  endAngle?: number
  color?: string
  layer?: string
  // SPLINE specific
  controlPoints?: Array<{x: number, y: number}>
  knots?: number[]
  weights?: number[]
  degree?: number
  // TEXT specific
  text?: string
  height?: number
  rotation?: number
  alignmentH?: number // Horizontal alignment (0=left, 1=center, 2=right)
  alignmentV?: number // Vertical alignment (0=baseline, 1=bottom, 2=middle, 3=top)
  style?: string // font style
  widthFactor?: number // text width scaling
  // HATCH specific
  hatchPattern?: string
  solid?: boolean
}
/**
 * Parse DXF file content
 */
function parseDxf(content: string): DxfEntity[] {
  const lines = content.split(/\r?\n/)
  const entities: DxfEntity[] = []
  let i = 0
  // Debug: collect all entity types found
  const foundEntityTypes = new Set<string>()
  // Find ENTITIES section
  while (i < lines.length && lines[i].trim() !== 'ENTITIES') {
    i++
  }
  if (i >= lines.length) {
    throw new FileValidationError('Invalid DXF: No ENTITIES section found')
  }
  i++ // Skip ENTITIES line
  while (i < lines.length && lines[i].trim() !== 'ENDSEC') {
    // Check if this line is a code
    if (lines[i] && lines[i + 1]) {
      const code = parseInt(lines[i].trim())
      const value = lines[i + 1].trim()
      if (code === 0 && value !== 'ENDSEC') {
        // Entity type
        const entityType = value
        foundEntityTypes.add(entityType)
        try {
          let entity: DxfEntity | null = null
          switch (entityType) {
            case 'LINE':
              entity = parseLine(lines, i)
              break
            case 'CIRCLE':
              entity = parseCircle(lines, i)
              break
            case 'ARC':
              entity = parseArc(lines, i)
              break
            case 'POLYLINE':
            case 'LWPOLYLINE':
              entity = parsePolyline(lines, i)
              break
            case 'SPLINE':
              entity = parseSpline(lines, i)
              break
            case 'TEXT':
            case 'MTEXT':
              entity = parseText(lines, i)
              break
            case 'HATCH':
              entity = parseHatch(lines, i)
              break
            // Skip unsupported but don't error
            default:
              // Continue parsing even if entity type is unsupported
              break
          }
          if (entity) {
            entities.push(entity)
          }
        } catch (error) {
          // Continue parsing even if individual entity fails
          }
        // Skip to next entity by finding the next code 0
        i += 2
        while (i < lines.length - 1) {
          if (parseInt(lines[i].trim()) === 0) {
            break
          }
          i += 2
        }
        continue
      }
    }
    i += 2
  }
  // Enhanced error reporting
  if (entities.length === 0) {
    const entityTypesFound = Array.from(foundEntityTypes).join(', ')
    throw new ConversionError(
      `No drawable entities found in DXF file. Found entity types: ${entityTypesFound || 'none'}. Supported types: LINE, CIRCLE, ARC, POLYLINE, LWPOLYLINE, SPLINE, TEXT, MTEXT, HATCH`,
      'DXF_NO_SUPPORTED_ENTITIES'
    )
  }
  return entities
}
/**
 * Parse LINE entity
 */
function parseLine(lines: string[], startIndex: number): DxfEntity {
  const entity: DxfEntity = { type: 'LINE', points: [] }
  let i = startIndex + 2
  let x1 = 0, y1 = 0, x2 = 0, y2 = 0
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    if (code === 0) break // Next entity
    const value = parseFloat(lines[i + 1])
    switch (code) {
      case 10: x1 = value; break
      case 20: y1 = value; break
      case 11: x2 = value; break
      case 21: y2 = value; break
    }
    i += 2
  }
  entity.points = [
    { x: x1, y: y1 },
    { x: x2, y: y2 }
  ]
  return entity
}
/**
 * Parse CIRCLE entity
 */
function parseCircle(lines: string[], startIndex: number): DxfEntity {
  const entity: DxfEntity = { type: 'CIRCLE' }
  let i = startIndex + 2
  let cx = 0, cy = 0, radius = 0
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    if (code === 0) break
    const value = parseFloat(lines[i + 1])
    switch (code) {
      case 10: cx = value; break
      case 20: cy = value; break
      case 40: radius = value; break
    }
    i += 2
  }
  entity.center = { x: cx, y: cy }
  entity.radius = radius
  return entity
}
/**
 * Parse ARC entity
 */
function parseArc(lines: string[], startIndex: number): DxfEntity {
  const entity: DxfEntity = { type: 'ARC' }
  let i = startIndex + 2
  let cx = 0, cy = 0, radius = 0, startAngle = 0, endAngle = 0
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    const value = parseFloat(lines[i + 1])
    if (code === 0) break
    switch (code) {
      case 10: cx = value; break
      case 20: cy = value; break
      case 40: radius = value; break
      case 50: startAngle = value; break
      case 51: endAngle = value; break
    }
    i += 2
  }
  entity.center = { x: cx, y: cy }
  entity.radius = radius
  entity.startAngle = startAngle
  entity.endAngle = endAngle
  return entity
}
/**
 * Parse POLYLINE entity
 */
function parsePolyline(lines: string[], startIndex: number): DxfEntity {
  const entity: DxfEntity = { type: 'POLYLINE', points: [] }
  let i = startIndex + 2
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    const value = lines[i + 1]
    if (code === 0) {
      if (value.trim() === 'VERTEX') {
        // Parse vertex
        const vertex = parseVertex(lines, i)
        entity.points!.push(vertex)
      } else if (value.trim() === 'SEQEND') {
        break
      }
    }
    i += 2
  }
  return entity
}
/**
 * Parse VERTEX
 */
function parseVertex(lines: string[], startIndex: number): {x: number, y: number} {
  let i = startIndex + 2
  let x = 0, y = 0
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    const value = parseFloat(lines[i + 1])
    if (code === 0) break
    switch (code) {
      case 10: x = value; break
      case 20: y = value; break
    }
    i += 2
  }
  return { x, y }
}
/**
 * Parse SPLINE entity
 */
function parseSpline(lines: string[], startIndex: number): DxfEntity {
  const entity: DxfEntity = { 
    type: 'SPLINE', 
    controlPoints: [],
    knots: [],
    weights: [],
    degree: 3 // Default cubic
  }
  let i = startIndex + 2
  let numControlPoints = 0
  let numKnots = 0
  // First pass: get metadata
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    const value = lines[i + 1]
    if (code === 0) break // Next entity
    switch (code) {
      case 71: // Degree
        entity.degree = parseInt(value)
        break
      case 72: // Number of knots
        numKnots = parseInt(value)
        break
      case 73: // Number of control points
        numControlPoints = parseInt(value)
        break
    }
    i += 2
  }
  // Second pass: collect control points and knots
  i = startIndex + 2
  let controlPointIndex = 0
  let knotIndex = 0
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    const value = parseFloat(lines[i + 1])
    if (code === 0) break
    switch (code) {
      case 10: // Control point X
        if (!entity.controlPoints![controlPointIndex]) {
          entity.controlPoints![controlPointIndex] = { x: 0, y: 0 }
        }
        entity.controlPoints![controlPointIndex].x = value
        break
      case 20: // Control point Y
        if (!entity.controlPoints![controlPointIndex]) {
          entity.controlPoints![controlPointIndex] = { x: 0, y: 0 }
        }
        entity.controlPoints![controlPointIndex].y = value
        controlPointIndex++
        break
      case 40: // Knot value
        entity.knots![knotIndex] = value
        knotIndex++
        break
      case 41: // Weight (if present)
        if (!entity.weights) entity.weights = []
        entity.weights.push(value)
        break
    }
    i += 2
  }
  return entity
}
/**
 * Parse TEXT/MTEXT entity
 */
function parseText(lines: string[], startIndex: number): DxfEntity {
  const entityType = lines[startIndex + 1].trim()
  const entity: DxfEntity = { type: entityType, points: [] }
  let i = startIndex + 2
  let x = 0, y = 0, height = 10, rotation = 0
  let text = ''
  let alignmentH = 0, alignmentV = 0
  let style = 'Standard'
  let widthFactor = 1.0
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    if (code === 0) break
    const value = lines[i + 1].trim()
    switch (code) {
      case 10: x = parseFloat(value); break
      case 20: y = parseFloat(value); break
      case 40: height = parseFloat(value); break
      case 50: rotation = parseFloat(value); break
      case 1: text = value; break // Text content
      case 3: text += value; break // Additional text content (for MTEXT)
      case 7: style = value; break // Text style name
      case 41: widthFactor = parseFloat(value); break // Text width factor
      case 71: alignmentH = parseInt(value); break // Horizontal alignment
      case 72: alignmentV = parseInt(value); break // Vertical alignment
      case 11: // Alignment point X (if different from insertion point)
        // For aligned text, use this as the actual position
        break
      case 21: // Alignment point Y
        break
    }
    i += 2
  }
  // Process MTEXT formatting codes
  if (entityType === 'MTEXT') {
    text = processMTextFormatting(text)
  }
  entity.points = [{ x, y }]
  entity.text = text
  entity.height = height
  entity.rotation = rotation
  entity.alignmentH = alignmentH
  entity.alignmentV = alignmentV
  entity.style = style
  entity.widthFactor = widthFactor
  return entity
}
/**
 * Process MTEXT formatting codes and convert to basic HTML-like formatting
 */
function processMTextFormatting(text: string): string {
  if (!text) return ''
  // Remove or convert common MTEXT formatting codes
  let processed = text
    // Remove control codes
    .replace(/\\P/g, '\n') // Paragraph break
    .replace(/\\p/g, '\n') // Line break
    .replace(/\\~/g, '') // Non-breaking space
    .replace(/\\{/g, '{') // Literal brace
    .replace(/\\}/g, '}') // Literal brace
    .replace(/\\\\/g, '\\') // Literal backslash
    // Font and style codes (simplified)
    .replace(/\\f[^;]*;/g, '') // Font face
    .replace(/\\[hH][^;]*;/g, '') // Height
    .replace(/\\[wW][^;]*;/g, '') // Width factor
    .replace(/\\[qQ][^;]*;/g, '') // Oblique angle
    .replace(/\\[cC]\d+;/g, '') // Color
    // Text formatting
    .replace(/\\[lL]/g, '') // Underline on
    .replace(/\\[lL]/g, '') // Underline off
    .replace(/\\[oO]/g, '') // Overline
    .replace(/\\[kK]/g, '') // Strike-through
    // Remove remaining formatting codes
    .replace(/\\[^;]*;/g, '')
    .replace(/[{}]/g, '') // Remove remaining braces
  return processed.trim()
}
/**
 * Parse HATCH entity (simplified)
 */
function parseHatch(lines: string[], startIndex: number): DxfEntity {
  const entity: DxfEntity = { type: 'HATCH', points: [] }
  let i = startIndex + 2
  let solid = false
  let pattern = ''
  while (i < lines.length - 1) {
    const code = parseInt(lines[i])
    const value = lines[i + 1]
    if (code === 0) break
    switch (code) {
      case 2: // Pattern name
        pattern = value.trim()
        if (pattern === 'SOLID') solid = true
        break
      case 70: // Solid fill flag
        solid = parseInt(value) === 1
        break
    }
    i += 2
  }
  entity.hatchPattern = pattern
  entity.solid = solid
  return entity
}
/**
 * Convert SPLINE control points to SVG Bezier path
 * Simplified implementation using cubic bezier approximation
 */
function splineToBezierPath(controlPoints: Array<{x: number, y: number}>, knots?: number[], degree: number = 3): string {
  if (controlPoints.length < 2) return ''
  // Simple implementation: convert to cubic bezier curves
  // For more accuracy, this would need proper NURBS evaluation
  let path = `M ${controlPoints[0].x} ${controlPoints[0].y}`
  if (controlPoints.length === 2) {
    // Linear case
    path += ` L ${controlPoints[1].x} ${controlPoints[1].y}`
  } else if (controlPoints.length === 3) {
    // Quadratic case - convert to cubic
    const p0 = controlPoints[0]
    const p1 = controlPoints[1] 
    const p2 = controlPoints[2]
    // Convert quadratic to cubic bezier
    const cp1 = {
      x: p0.x + (2/3) * (p1.x - p0.x),
      y: p0.y + (2/3) * (p1.y - p0.y)
    }
    const cp2 = {
      x: p2.x + (2/3) * (p1.x - p2.x),
      y: p2.y + (2/3) * (p1.y - p2.y)
    }
    path += ` C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p2.x} ${p2.y}`
  } else {
    // Multiple points - create smooth curve through all points
    for (let i = 0; i < controlPoints.length - 1; i += 3) {
      const p0 = controlPoints[i]
      const p1 = controlPoints[Math.min(i + 1, controlPoints.length - 1)]
      const p2 = controlPoints[Math.min(i + 2, controlPoints.length - 1)]
      const p3 = controlPoints[Math.min(i + 3, controlPoints.length - 1)]
      if (i + 3 < controlPoints.length) {
        // Full cubic bezier segment
        path += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`
      } else {
        // Last segment - use remaining points
        if (i + 2 < controlPoints.length) {
          path += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p2.x} ${p2.y}`
        } else if (i + 1 < controlPoints.length) {
          path += ` L ${p1.x} ${p1.y}`
        }
      }
    }
  }
  return path
}
/**
 * Convert DXF entities to SVG elements
 */
function entitiesToSvg(entities: DxfEntity[], options: DxfToSvgOptions): string {
  const scale = options.scale || 1
  const strokeWidth = options.strokeWidth || 1
  const defaultColor = options.defaultColor || '#000000'
  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  entities.forEach(entity => {
    if (entity.points) {
      entity.points.forEach(point => {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
      })
    }
    if (entity.center) {
      minX = Math.min(minX, entity.center.x - (entity.radius || 0))
      minY = Math.min(minY, entity.center.y - (entity.radius || 0))
      maxX = Math.max(maxX, entity.center.x + (entity.radius || 0))
      maxY = Math.max(maxY, entity.center.y + (entity.radius || 0))
    }
    if (entity.controlPoints) {
      entity.controlPoints.forEach(point => {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
      })
    }
  })
  const width = (maxX - minX) * scale
  const height = (maxY - minY) * scale
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${width}" 
     height="${height}" 
     viewBox="${minX * scale} ${minY * scale} ${width} ${height}">
  <g transform="scale(${scale})">
`
  entities.forEach(entity => {
    const color = entity.color || defaultColor
    switch (entity.type) {
      case 'LINE':
        if (entity.points && entity.points.length >= 2) {
          svg += `    <line x1="${entity.points[0].x}" y1="${entity.points[0].y}" 
          x2="${entity.points[1].x}" y2="${entity.points[1].y}" 
          stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>\n`
        }
        break
      case 'CIRCLE':
        if (entity.center && entity.radius) {
          svg += `    <circle cx="${entity.center.x}" cy="${entity.center.y}" 
          r="${entity.radius}" 
          stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>\n`
        }
        break
      case 'ARC':
        if (entity.center && entity.radius && 
            entity.startAngle !== undefined && entity.endAngle !== undefined) {
          const start = entity.startAngle * Math.PI / 180
          const end = entity.endAngle * Math.PI / 180
          const x1 = entity.center.x + entity.radius * Math.cos(start)
          const y1 = entity.center.y + entity.radius * Math.sin(start)
          const x2 = entity.center.x + entity.radius * Math.cos(end)
          const y2 = entity.center.y + entity.radius * Math.sin(end)
          const largeArc = Math.abs(end - start) > Math.PI ? 1 : 0
          svg += `    <path d="M ${x1} ${y1} A ${entity.radius} ${entity.radius} 0 ${largeArc} 1 ${x2} ${y2}" 
          stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>\n`
        }
        break
      case 'POLYLINE':
        if (entity.points && entity.points.length > 0) {
          let path = `M ${entity.points[0].x} ${entity.points[0].y}`
          for (let i = 1; i < entity.points.length; i++) {
            path += ` L ${entity.points[i].x} ${entity.points[i].y}`
          }
          svg += `    <path d="${path}" 
          stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>\n`
        }
        break
      case 'SPLINE':
        if (entity.controlPoints && entity.controlPoints.length > 1) {
          const path = splineToBezierPath(entity.controlPoints, entity.knots, entity.degree || 3)
          svg += `    <path d="${path}" 
          stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>\n`
        }
        break
      case 'TEXT':
      case 'MTEXT':
        if (entity.points && entity.points.length > 0 && entity.text) {
          const x = entity.points[0].x
          const y = entity.points[0].y
          const fontSize = entity.height || 10
          const rotation = entity.rotation || 0
          const widthFactor = entity.widthFactor || 1.0
          // Determine text anchor based on horizontal alignment
          let textAnchor = 'start'
          if (entity.alignmentH === 1) textAnchor = 'middle'
          else if (entity.alignmentH === 2) textAnchor = 'end'
          // Determine dominant baseline based on vertical alignment
          let dominantBaseline = 'alphabetic'
          if (entity.alignmentV === 1) dominantBaseline = 'text-bottom'
          else if (entity.alignmentV === 2) dominantBaseline = 'middle'
          else if (entity.alignmentV === 3) dominantBaseline = 'text-top'
          // Build transform string
          let transforms = []
          if (rotation !== 0) {
            transforms.push(`rotate(${rotation} ${x} ${y})`)
          }
          if (widthFactor !== 1.0) {
            transforms.push(`scale(${widthFactor} 1)`)
          }
          const transform = transforms.length > 0 ? ` transform="${transforms.join(' ')}"` : ''
          // Handle multiline text (for MTEXT)
          const lines = entity.text.split('\n')
          if (lines.length === 1) {
            // Single line
            svg += `    <text x="${x}" y="${y}" font-size="${fontSize}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}"${transform} 
            fill="${color}">${entity.text}</text>\n`
          } else {
            // Multiple lines
            const lineHeight = fontSize * 1.2 // Standard line height
            svg += `    <g${transform}>\n`
            lines.forEach((line, index) => {
              const lineY = y + (index * lineHeight)
              svg += `      <text x="${x}" y="${lineY}" font-size="${fontSize}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}" 
              fill="${color}">${line}</text>\n`
            })
            svg += `    </g>\n`
          }
        }
        break
      case 'HATCH':
        if (entity.solid) {
          // For now, just render as a simple filled shape
          // In a full implementation, this would handle complex boundary paths
          svg += `    <!-- HATCH entity (${entity.hatchPattern || 'SOLID'}) - simplified rendering -->\n`
        }
        break
    }
  })
  svg += `  </g>
</svg>`
  return svg
}
/**
 * Validates that the input is a DXF file
 */
function validateDxfInput(input: Buffer | string): string {
  const content = typeof input === 'string' 
    ? input 
    : input.toString('utf8')
  // Check for DXF header
  if (!content.includes('0\nSECTION') && !content.includes('0\r\nSECTION')) {
    throw new FileValidationError('Invalid DXF: Missing SECTION marker')
  }
  if (!content.includes('ENTITIES')) {
    throw new FileValidationError('Invalid DXF: Missing ENTITIES section')
  }
  return content
}
/**
 * Converts DXF to SVG
 * Implements the ConversionHandler interface
 */
export const dxfToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: DxfToSvgOptions = {}
): Promise<ConversionResult> => {
  try {
    // Validate and get DXF content
    const dxfContent = validateDxfInput(input)
    // Parse DXF entities
    const entities = parseDxf(dxfContent)
    if (entities.length === 0) {
      throw new ConversionError(
        'No drawable entities found in DXF file',
        'DXF_NO_ENTITIES'
      )
    }
    // Convert to SVG
    const svgString = entitiesToSvg(entities, options)
    const svgBuffer = Buffer.from(svgString, 'utf8')
    // Extract dimensions from generated SVG
    const widthMatch = svgString.match(/width="([^"]+)"/)
    const heightMatch = svgString.match(/height="([^"]+)"/)
    return {
      success: true,
      data: svgBuffer,
      mimeType: 'image/svg+xml',
      metadata: {
        format: 'svg',
        size: svgBuffer.length,
        width: widthMatch ? parseFloat(widthMatch[1]) : undefined,
        height: heightMatch ? parseFloat(heightMatch[1]) : undefined
      }
    }
  } catch (error) {
    if (error instanceof FileValidationError || 
        error instanceof ConversionError) {
      throw error
    }
    if (error instanceof Error) {
      throw new ConversionError(
        `DXF to SVG conversion failed: ${error.message}`,
        'DXF_TO_SVG_FAILED'
      )
    }
    throw new ConversionError(
      'An unexpected error occurred during DXF to SVG conversion',
      'DXF_TO_SVG_UNKNOWN_ERROR'
    )
  }
}
/**
 * Client-side DXF to SVG conversion wrapper
 */
export async function convertDxfToSvgClient(
  file: File,
  options: DxfToSvgOptions = {}
): Promise<ConversionResult> {
  const text = await file.text()
  return dxfToSvgHandler(text, options)
}
/**
 * Server-side DXF to SVG conversion wrapper
 */
export async function convertDxfToSvgServer(
  input: Buffer | string,
  options: DxfToSvgOptions = {}
): Promise<ConversionResult> {
  return dxfToSvgHandler(input, options)
}
/**
 * DXF to SVG converter configuration
 */
export const dxfToSvgConverter = {
  name: 'DXF to SVG',
  from: 'dxf' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: dxfToSvgHandler,
  isClientSide: true, // Can run client-side
  description: 'Convert AutoCAD DXF (Drawing Exchange Format) files to scalable vector graphics (SVG)'
}