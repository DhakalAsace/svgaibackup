/**
 * STL to SVG Converter Implementation
 * 
 * This module provides STL (STereoLithography) to SVG conversion.
 * STL is a 3D file format, so we project it to 2D for SVG output.
 * Supports both ASCII and binary STL formats.
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
import { BaseConverter } from './base-converter'

/**
 * Extended conversion options for STL to SVG
 */
interface StlToSvgOptions extends ConversionOptions {
  /** Projection type (default: 'orthographic') */
  projection?: 'orthographic' | 'perspective'
  /** View angle (default: 'front') */
  view?: 'front' | 'top' | 'side' | 'isometric'
  /** Scale factor (default: auto) */
  scale?: number
  /** Show wireframe (default: true) */
  wireframe?: boolean
  /** Fill polygons (default: false) */
  fill?: boolean
  /** Stroke width (default: 1) */
  strokeWidth?: number
  /** Rotation angles in degrees */
  rotation?: { x?: number; y?: number; z?: number }
}

/**
 * 3D vertex type
 */
interface Vertex {
  x: number
  y: number
  z: number
}

/**
 * Triangle face type
 */
interface Face {
  vertices: [Vertex, Vertex, Vertex]
  normal: Vertex
}

/**
 * Parse ASCII STL format
 */
function parseAsciiStl(content: string): Face[] {
  const faces: Face[] = []
  const lines = content.split(/\r?\n/)
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i].trim()
    
    if (line.startsWith('facet normal')) {
      const normalParts = line.split(/\s+/)
      const normal: Vertex = {
        x: parseFloat(normalParts[2]),
        y: parseFloat(normalParts[3]),
        z: parseFloat(normalParts[4])
      }
      
      const vertices: Vertex[] = []
      i += 2 // Skip 'outer loop'
      
      for (let j = 0; j < 3; j++) {
        const vertexLine = lines[i + j].trim()
        const vertexParts = vertexLine.split(/\s+/)
        vertices.push({
          x: parseFloat(vertexParts[1]),
          y: parseFloat(vertexParts[2]),
          z: parseFloat(vertexParts[3])
        })
      }
      
      faces.push({
        normal,
        vertices: vertices as [Vertex, Vertex, Vertex]
      })
      
      i += 5 // Skip to next facet
    } else {
      i++
    }
  }
  
  return faces
}

/**
 * Parse binary STL format
 */
function parseBinaryStl(buffer: Buffer): Face[] {
  const faces: Face[] = []
  
  // Skip 80-byte header
  let offset = 80
  
  // Read number of triangles
  const triangleCount = buffer.readUInt32LE(offset)
  offset += 4
  
  for (let i = 0; i < triangleCount; i++) {
    // Read normal vector (3 floats)
    const normal: Vertex = {
      x: buffer.readFloatLE(offset),
      y: buffer.readFloatLE(offset + 4),
      z: buffer.readFloatLE(offset + 8)
    }
    offset += 12
    
    // Read 3 vertices (3 floats each)
    const vertices: Vertex[] = []
    for (let j = 0; j < 3; j++) {
      vertices.push({
        x: buffer.readFloatLE(offset),
        y: buffer.readFloatLE(offset + 4),
        z: buffer.readFloatLE(offset + 8)
      })
      offset += 12
    }
    
    faces.push({
      normal,
      vertices: vertices as [Vertex, Vertex, Vertex]
    })
    
    // Skip attribute byte count
    offset += 2
  }
  
  return faces
}

/**
 * Apply rotation to a vertex
 */
function rotateVertex(vertex: Vertex, rotation: { x?: number; y?: number; z?: number }): Vertex {
  let { x, y, z } = vertex
  
  // Rotate around X axis
  if (rotation.x) {
    const rad = rotation.x * Math.PI / 180
    const newY = y * Math.cos(rad) - z * Math.sin(rad)
    const newZ = y * Math.sin(rad) + z * Math.cos(rad)
    y = newY
    z = newZ
  }
  
  // Rotate around Y axis
  if (rotation.y) {
    const rad = rotation.y * Math.PI / 180
    const newX = x * Math.cos(rad) + z * Math.sin(rad)
    const newZ = -x * Math.sin(rad) + z * Math.cos(rad)
    x = newX
    z = newZ
  }
  
  // Rotate around Z axis
  if (rotation.z) {
    const rad = rotation.z * Math.PI / 180
    const newX = x * Math.cos(rad) - y * Math.sin(rad)
    const newY = x * Math.sin(rad) + y * Math.cos(rad)
    x = newX
    y = newY
  }
  
  return { x, y, z }
}

/**
 * Project 3D coordinates to 2D based on view
 */
function projectTo2D(vertex: Vertex, view: string): { x: number; y: number } {
  switch (view) {
    case 'front':
      return { x: vertex.x, y: -vertex.y }
    case 'top':
      return { x: vertex.x, y: -vertex.z }
    case 'side':
      return { x: vertex.z, y: -vertex.y }
    case 'isometric':
      // Simple isometric projection
      const angle = Math.PI / 6 // 30 degrees
      return {
        x: (vertex.x - vertex.z) * Math.cos(angle),
        y: -vertex.y + (vertex.x + vertex.z) * Math.sin(angle) * 0.5
      }
    default:
      return { x: vertex.x, y: -vertex.y }
  }
}

/**
 * Convert STL faces to SVG
 */
function facesToSvg(faces: Face[], options: StlToSvgOptions): string {
  const view = options.view || 'front'
  const strokeWidth = options.strokeWidth || 1
  const wireframe = options.wireframe !== false
  const fill = options.fill || false
  
  // Apply rotation if specified
  if (options.rotation) {
    faces = faces.map(face => ({
      normal: rotateVertex(face.normal, options.rotation!),
      vertices: face.vertices.map(v => rotateVertex(v, options.rotation!)) as [Vertex, Vertex, Vertex]
    }))
  }
  
  // Project all vertices to 2D
  const projectedFaces = faces.map(face => ({
    vertices: face.vertices.map(v => projectTo2D(v, view)),
    normal: face.normal
  }))
  
  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  
  projectedFaces.forEach(face => {
    face.vertices.forEach(vertex => {
      minX = Math.min(minX, vertex.x)
      minY = Math.min(minY, vertex.y)
      maxX = Math.max(maxX, vertex.x)
      maxY = Math.max(maxY, vertex.y)
    })
  })
  
  // Calculate scale if not provided
  const scale = options.scale || Math.min(500 / (maxX - minX), 500 / (maxY - minY))
  
  const width = (maxX - minX) * scale
  const height = (maxY - minY) * scale
  
  // Sort faces by depth (painter's algorithm) for better rendering
  if (view === 'isometric') {
    projectedFaces.sort((a, b) => {
      const aZ = faces[projectedFaces.indexOf(a)].vertices.reduce((sum, v) => sum + v.z, 0) / 3
      const bZ = faces[projectedFaces.indexOf(b)].vertices.reduce((sum, v) => sum + v.z, 0) / 3
      return aZ - bZ
    })
  }
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${width}" 
     height="${height}" 
     viewBox="0 0 ${width} ${height}">
  <g transform="translate(${-minX * scale}, ${-minY * scale}) scale(${scale})">
`
  
  projectedFaces.forEach((face, index) => {
    const pathData = `M ${face.vertices[0].x} ${face.vertices[0].y} ` +
                    `L ${face.vertices[1].x} ${face.vertices[1].y} ` +
                    `L ${face.vertices[2].x} ${face.vertices[2].y} Z`
    
    // Calculate shading based on face normal (simple lighting)
    let fillColor = '#cccccc'
    if (fill) {
      const normalZ = faces[index].normal.z
      const brightness = Math.max(0.3, Math.min(1, (normalZ + 1) / 2))
      const gray = Math.floor(brightness * 255)
      fillColor = `rgb(${gray}, ${gray}, ${gray})`
    }
    
    svg += `    <path d="${pathData}" `
    
    if (fill) {
      svg += `fill="${fillColor}" `
    } else {
      svg += `fill="none" `
    }
    
    if (wireframe) {
      svg += `stroke="#000000" stroke-width="${strokeWidth}" `
    }
    
    svg += `/>\n`
  })
  
  svg += `  </g>
</svg>`
  
  return svg
}

/**
 * Validates STL input
 */
function validateStlInput(input: Buffer | string): { content: string | Buffer; isBinary: boolean } {
  if (typeof input === 'string') {
    // ASCII STL
    if (!input.includes('solid') && !input.includes('facet')) {
      throw new FileValidationError('Invalid STL: Missing STL markers')
    }
    return { content: input, isBinary: false }
  }
  
  // Check if binary STL
  if (input.length < 84) {
    throw new FileValidationError('Invalid STL: File too small')
  }
  
  // Binary STL files don't start with "solid" in ASCII
  const header = input.slice(0, 5).toString('ascii')
  if (header === 'solid') {
    // Might be ASCII STL
    const fullContent = input.toString('utf8')
    if (fullContent.includes('facet') && fullContent.includes('vertex')) {
      return { content: fullContent, isBinary: false }
    }
  }
  
  // Assume binary
  return { content: input, isBinary: true }
}

/**
 * STL to SVG Converter Class
 * Extends BaseConverter with STL-specific functionality
 */
export class StlToSvgConverter extends BaseConverter {
  name = 'STL to SVG'
  from = 'stl' as ImageFormat
  to = 'svg' as ImageFormat
  description = 'Convert 3D STL (STereoLithography) files to 2D SVG projections with customizable views'

  /**
   * Performs the actual STL to SVG conversion
   */
  protected async performConversion(
    input: Buffer,
    options: StlToSvgOptions = {}
  ): Promise<ConversionResult> {
    // Validate input
    const { content, isBinary } = validateStlInput(input)
    
    // Parse STL
    let faces: Face[]
    if (isBinary) {
      faces = parseBinaryStl(content as Buffer)
    } else {
      faces = parseAsciiStl(content as string)
    }
    
    if (faces.length === 0) {
      throw new ConversionError(
        'No faces found in STL file',
        'STL_NO_FACES'
      )
    }
    
    // Report progress after parsing
    this.reportProgress(options, 0.5)
    
    // Convert to SVG
    const svgString = facesToSvg(faces, options)
    const svgBuffer = Buffer.from(svgString, 'utf8')
    
    // Extract dimensions
    const widthMatch = svgString.match(/width="([^"]+)"/)
    const heightMatch = svgString.match(/height="([^"]+)"/)
    
    // Report progress before completion
    this.reportProgress(options, 0.9)
    
    return this.createSuccessResult(
      svgBuffer,
      'image/svg+xml',
      {
        width: widthMatch ? parseFloat(widthMatch[1]) : undefined,
        height: heightMatch ? parseFloat(heightMatch[1]) : undefined,
        faceCount: faces.length
      }
    )
  }
}

/**
 * Create singleton instance
 */
const stlToSvgConverterInstance = new StlToSvgConverter()

/**
 * Export the handler for backward compatibility
 */
export const stlToSvgHandler = stlToSvgConverterInstance.handler

/**
 * Client-side STL to SVG conversion wrapper
 */
export async function convertStlToSvgClient(
  file: File,
  options: StlToSvgOptions = {}
): Promise<ConversionResult> {
  const buffer = await file.arrayBuffer()
  return stlToSvgHandler(Buffer.from(buffer), options)
}

/**
 * Server-side STL to SVG conversion wrapper
 */
export async function convertStlToSvgServer(
  input: Buffer | string,
  options: StlToSvgOptions = {}
): Promise<ConversionResult> {
  return stlToSvgHandler(input, options)
}

/**
 * STL to SVG converter configuration for registry
 */
export const stlToSvgConverter: Converter = {
  name: stlToSvgConverterInstance.name,
  from: stlToSvgConverterInstance.from,
  to: stlToSvgConverterInstance.to,
  handler: stlToSvgHandler,
  isClientSide: true,
  description: stlToSvgConverterInstance.description
}