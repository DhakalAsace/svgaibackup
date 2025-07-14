/**
 * SVG to STL Converter Implementation
 * 
 * This module provides SVG to STL (Stereolithography) conversion.
 * STL is a file format native to stereolithography CAD software
 * and widely used for 3D printing.
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
import { detectFileTypeFromBuffer } from './validation'
import { BaseConverter } from './base-converter'

/**
 * Extended conversion options for SVG to STL
 */
interface SvgToStlOptions extends ConversionOptions {
  /** Extrusion depth in mm (default: 10) */
  extrusionDepth?: number
  /** Output format type (default: 'binary') */
  outputFormat?: 'ascii' | 'binary'
  /** Resolution for curve approximation (default: 0.1) */
  resolution?: number
  /** Units (default: 'mm') */
  units?: 'mm' | 'cm' | 'in'
}

/**
 * Point type for 2D coordinates
 */
interface Point2D {
  x: number
  y: number
}

/**
 * Triangle type for STL output
 */
interface Triangle {
  vertices: [Point3D, Point3D, Point3D]
  normal: Point3D
}

/**
 * Point type for 3D coordinates
 */
interface Point3D {
  x: number
  y: number
  z: number
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
 * Parse simple SVG path commands to points
 * Supports M (move), L (line), and basic curves
 */
function parseSvgPath(pathData: string): Point2D[] {
  const points: Point2D[] = []
  const commands = pathData.match(/[MLCQZmlcqz][^MLCQZmlcqz]*/g) || []
  
  let currentX = 0
  let currentY = 0
  
  for (const command of commands) {
    const type = command[0]
    const coords = command.slice(1).trim().split(/[\s,]+/).map(Number)
    
    switch (type.toUpperCase()) {
      case 'M': // Move to
        currentX = coords[0]
        currentY = coords[1]
        points.push({ x: currentX, y: currentY })
        break
        
      case 'L': // Line to
        currentX = coords[0]
        currentY = coords[1]
        points.push({ x: currentX, y: currentY })
        break
        
      case 'C': // Cubic bezier (simplified to line segments)
        // For simplicity, we'll just take the end point
        currentX = coords[4]
        currentY = coords[5]
        points.push({ x: currentX, y: currentY })
        break
        
      case 'Z': // Close path
        if (points.length > 0) {
          points.push({ x: points[0].x, y: points[0].y })
        }
        break
    }
  }
  
  return points
}

/**
 * Extract all paths from SVG
 */
function extractSvgPaths(svgString: string): string[] {
  const paths: string[] = []
  const pathRegex = /<path[^>]*d="([^"]+)"[^>]*>/g
  let match
  
  while ((match = pathRegex.exec(svgString)) !== null) {
    paths.push(match[1])
  }
  
  return paths
}

/**
 * Create triangulated mesh from 2D points with extrusion
 */
function extrudePathToTriangles(points: Point2D[], depth: number): Triangle[] {
  const triangles: Triangle[] = []
  
  if (points.length < 3) return triangles
  
  // Create top and bottom faces
  const topPoints = points.map(p => ({ x: p.x, y: p.y, z: 0 }))
  const bottomPoints = points.map(p => ({ x: p.x, y: p.y, z: depth }))
  
  // Simple triangulation of top face (fan triangulation from first vertex)
  for (let i = 1; i < topPoints.length - 1; i++) {
    triangles.push({
      vertices: [topPoints[0], topPoints[i], topPoints[i + 1]],
      normal: { x: 0, y: 0, z: -1 }
    })
  }
  
  // Bottom face (reversed winding)
  for (let i = 1; i < bottomPoints.length - 1; i++) {
    triangles.push({
      vertices: [bottomPoints[0], bottomPoints[i + 1], bottomPoints[i]],
      normal: { x: 0, y: 0, z: 1 }
    })
  }
  
  // Side walls
  for (let i = 0; i < points.length - 1; i++) {
    const j = (i + 1) % points.length
    
    // Two triangles for each side face
    triangles.push({
      vertices: [topPoints[i], bottomPoints[i], topPoints[j]],
      normal: calculateNormal(topPoints[i], bottomPoints[i], topPoints[j])
    })
    
    triangles.push({
      vertices: [topPoints[j], bottomPoints[i], bottomPoints[j]],
      normal: calculateNormal(topPoints[j], bottomPoints[i], bottomPoints[j])
    })
  }
  
  return triangles
}

/**
 * Calculate normal vector for a triangle
 */
function calculateNormal(v1: Point3D, v2: Point3D, v3: Point3D): Point3D {
  // Calculate vectors
  const a = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z }
  const b = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z }
  
  // Cross product
  const normal = {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  }
  
  // Normalize
  const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z)
  if (length > 0) {
    normal.x /= length
    normal.y /= length
    normal.z /= length
  }
  
  return normal
}

/**
 * Convert triangles to ASCII STL format
 */
function trianglesToAsciiStl(triangles: Triangle[]): string {
  let stl = 'solid svg_extrusion\n'
  
  for (const triangle of triangles) {
    stl += `  facet normal ${triangle.normal.x} ${triangle.normal.y} ${triangle.normal.z}\n`
    stl += '    outer loop\n'
    for (const vertex of triangle.vertices) {
      stl += `      vertex ${vertex.x} ${vertex.y} ${vertex.z}\n`
    }
    stl += '    endloop\n'
    stl += '  endfacet\n'
  }
  
  stl += 'endsolid svg_extrusion\n'
  return stl
}

/**
 * Convert triangles to binary STL format
 */
function trianglesToBinaryStl(triangles: Triangle[]): Buffer {
  const header = Buffer.alloc(80)
  header.write('SVG to STL conversion by SVG AI', 0, 'utf8')
  
  const triangleCount = Buffer.alloc(4)
  triangleCount.writeUInt32LE(triangles.length, 0)
  
  const triangleBuffers: Buffer[] = []
  
  for (const triangle of triangles) {
    const triangleBuffer = Buffer.alloc(50)
    let offset = 0
    
    // Normal vector (12 bytes)
    triangleBuffer.writeFloatLE(triangle.normal.x, offset)
    triangleBuffer.writeFloatLE(triangle.normal.y, offset + 4)
    triangleBuffer.writeFloatLE(triangle.normal.z, offset + 8)
    offset += 12
    
    // Vertices (36 bytes)
    for (const vertex of triangle.vertices) {
      triangleBuffer.writeFloatLE(vertex.x, offset)
      triangleBuffer.writeFloatLE(vertex.y, offset + 4)
      triangleBuffer.writeFloatLE(vertex.z, offset + 8)
      offset += 12
    }
    
    // Attribute byte count (2 bytes)
    triangleBuffer.writeUInt16LE(0, offset)
    
    triangleBuffers.push(triangleBuffer)
  }
  
  return Buffer.concat([header, triangleCount, ...triangleBuffers])
}

/**
 * SVG to STL Converter Class
 * Extends BaseConverter with SVG to STL functionality
 */
export class SvgToStlConverter extends BaseConverter {
  name = 'SVG to STL'
  from = 'svg' as ImageFormat
  to = 'stl' as ImageFormat
  description = 'Convert SVG files to STL (Stereolithography) format for 3D printing'

  /**
   * Performs the actual SVG to STL conversion
   */
  protected async performConversion(
    input: Buffer,
    options: SvgToStlOptions = {}
  ): Promise<ConversionResult> {
    const svgString = validateSvgInput(input)
    
    // Extract paths from SVG
    const paths = extractSvgPaths(svgString)
    
    if (paths.length === 0) {
      throw new ConversionError(
        'No paths found in SVG file',
        'SVG_NO_PATHS'
      )
    }
    
    // Report progress after parsing
    this.reportProgress(options, 0.3)
    
    // Convert paths to triangles
    const depth = options.extrusionDepth || 10
    const allTriangles: Triangle[] = []
    
    for (const pathData of paths) {
      const points = parseSvgPath(pathData)
      if (points.length >= 3) {
        const triangles = extrudePathToTriangles(points, depth)
        allTriangles.push(...triangles)
      }
    }
    
    if (allTriangles.length === 0) {
      throw new ConversionError(
        'Could not generate 3D geometry from SVG paths',
        'SVG_TO_STL_NO_GEOMETRY'
      )
    }
    
    // Report progress after triangulation
    this.reportProgress(options, 0.7)
    
    // Convert to STL format
    const format = options.outputFormat || 'binary'
    let stlData: Buffer
    
    if (format === 'ascii') {
      const asciiStl = trianglesToAsciiStl(allTriangles)
      stlData = Buffer.from(asciiStl, 'utf8')
    } else {
      stlData = trianglesToBinaryStl(allTriangles)
    }
    
    // Report progress before completion
    this.reportProgress(options, 0.9)
    
    return this.createSuccessResult(
      stlData,
      'model/stl',
      {
        triangleCount: allTriangles.length,
        extrusionDepth: depth,
        outputFormat: format
      }
    )
  }
}

/**
 * Create singleton instance
 */
const svgToStlConverterInstance = new SvgToStlConverter()

/**
 * Export the handler for backward compatibility
 */
export const svgToStlHandler = svgToStlConverterInstance.handler

/**
 * Client-side SVG to STL conversion wrapper
 */
export async function convertSvgToStlClient(
  input: File | string,
  options: SvgToStlOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const text = await input.text()
    return svgToStlHandler(text, options)
  }
  
  return svgToStlHandler(input, options)
}

/**
 * Server-side SVG to STL conversion wrapper
 */
export async function convertSvgToStlServer(
  input: Buffer | string,
  options: SvgToStlOptions = {}
): Promise<ConversionResult> {
  return svgToStlHandler(input, options)
}

/**
 * SVG to STL converter configuration for registry
 */
export const svgToStlConverter: Converter = {
  name: svgToStlConverterInstance.name,
  from: svgToStlConverterInstance.from,
  to: svgToStlConverterInstance.to,
  handler: svgToStlHandler,
  isClientSide: true, // Can run client-side
  description: svgToStlConverterInstance.description
}