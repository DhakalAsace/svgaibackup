/**
 * SVG to ICO Converter Implementation
 * 
 * This module provides SVG to ICO conversion by generating a proper ICO file
 * with multiple icon sizes from an SVG. Uses Canvas API for rasterization and
 * supports proper transparency handling.
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
 * Standard ICO sizes to generate
 */
const STANDARD_ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]

/**
 * Extended conversion options for SVG to ICO
 */
interface SvgToIcoOptions extends ConversionOptions {
  /** Specific sizes to include in the ICO (default: standard sizes) */
  sizes?: number[]
  /** Background color for non-transparent areas (default: transparent) */
  backgroundColor?: string
  /** Whether to include 256x256 size (default: true) */
  includeLarge?: boolean
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is an SVG file
 */
function validateSvgInput(buffer: Buffer): void {
  const format = detectFileTypeFromBuffer(buffer)
  
  if (!format) {
    throw new FileValidationError('Unable to detect file format')
  }
  
  if (format !== 'svg') {
    throw new UnsupportedFormatError(
      format,
      ['svg'],
      `Expected SVG format but received ${format}`
    )
  }
}

/**
 * Creates ICO header
 */
function createIcoHeader(imageCount: number): Buffer {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // Reserved
  header.writeUInt16LE(1, 2) // Type (1 = ICO)
  header.writeUInt16LE(imageCount, 4) // Number of images
  return header
}

/**
 * Creates ICO directory entry
 */
function createIcoDirectoryEntry(
  width: number,
  height: number,
  imageData: Buffer,
  offset: number
): Buffer {
  const entry = Buffer.alloc(16)
  
  // Width and height (0 = 256)
  entry.writeUInt8(width === 256 ? 0 : width, 0)
  entry.writeUInt8(height === 256 ? 0 : height, 1)
  
  // Color palette (0 = no palette)
  entry.writeUInt8(0, 2)
  
  // Reserved
  entry.writeUInt8(0, 3)
  
  // Color planes (1 for ICO)
  entry.writeUInt16LE(1, 4)
  
  // Bits per pixel (32 for RGBA)
  entry.writeUInt16LE(32, 6)
  
  // Image data size
  entry.writeUInt32LE(imageData.length, 8)
  
  // Offset to image data
  entry.writeUInt32LE(offset, 12)
  
  return entry
}

/**
 * Converts SVG to ImageData at specified size using Canvas API
 */
async function svgToImageData(
  svgBuffer: Buffer, 
  size: number,
  backgroundColor?: string
): Promise<ImageData> {
  try {
    // Create an image element from SVG
    const svgString = svgBuffer.toString('utf8')
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        try {
          // Create canvas with target size
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')!
          
          // Set background if specified
          if (backgroundColor) {
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, size, size)
          }
          
          // Calculate scaling to fit SVG into canvas while maintaining aspect ratio
          const scale = Math.min(size / img.width, size / img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (size - scaledWidth) / 2
          const y = (size - scaledHeight) / 2
          
          // Draw the SVG image
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, size, size)
          
          // Clean up
          URL.revokeObjectURL(svgUrl)
          
          resolve(imageData)
        } catch (error) {
          URL.revokeObjectURL(svgUrl)
          reject(error)
        }
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(svgUrl)
        reject(new Error('Failed to load SVG image'))
      }
      
      img.src = svgUrl
    })
  } catch (error) {
    throw new ConversionError(
      `Failed to convert SVG to ImageData at size ${size}x${size}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'SVG_TO_IMAGEDATA_FAILED'
    )
  }
}

/**
 * Converts ImageData to BMP format for ICO
 */
function imageDataToBmp(imageData: ImageData): Buffer {
  try {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data

    // Create BMP data (DIB format without file header)
    const dibHeaderSize = 40
    const imageSize = width * height * 4
    const dibSize = dibHeaderSize + imageSize
    const dibBuffer = Buffer.alloc(dibSize)

    // DIB header
    dibBuffer.writeUInt32LE(dibHeaderSize, 0) // Header size
    dibBuffer.writeInt32LE(width, 4) // Width
    dibBuffer.writeInt32LE(height * 2, 8) // Height (doubled for AND mask)
    dibBuffer.writeUInt16LE(1, 12) // Planes
    dibBuffer.writeUInt16LE(32, 14) // Bits per pixel
    dibBuffer.writeUInt32LE(0, 16) // Compression (0 = none)
    dibBuffer.writeUInt32LE(imageSize, 20) // Image size
    dibBuffer.writeInt32LE(0, 24) // X pixels per meter
    dibBuffer.writeInt32LE(0, 28) // Y pixels per meter
    dibBuffer.writeUInt32LE(0, 32) // Colors used
    dibBuffer.writeUInt32LE(0, 36) // Important colors

    // Convert RGBA to BGRA and flip vertically (BMP is bottom-up)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcOffset = ((height - 1 - y) * width + x) * 4
        const dstOffset = dibHeaderSize + (y * width + x) * 4
        
        // RGBA to BGRA
        dibBuffer[dstOffset] = data[srcOffset + 2] // B
        dibBuffer[dstOffset + 1] = data[srcOffset + 1] // G
        dibBuffer[dstOffset + 2] = data[srcOffset] // R
        dibBuffer[dstOffset + 3] = data[srcOffset + 3] // A
      }
    }

    return dibBuffer
  } catch (error) {
    throw new ConversionError(
      `Failed to convert ImageData to BMP: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'IMAGEDATA_TO_BMP_FAILED'
    )
  }
}

/**
 * Converts ImageData to PNG format
 */
async function imageDataToPng(imageData: ImageData): Promise<Buffer> {
  try {
    // Create a canvas from the ImageData
    const canvas = document.createElement('canvas')
    canvas.width = imageData.width
    canvas.height = imageData.height
    const ctx = canvas.getContext('2d')!
    
    // Put the image data on the canvas
    ctx.putImageData(imageData, 0, 0)
    
    // Convert canvas to blob and then to buffer
    return new Promise<Buffer>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'))
          return
        }
        
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            resolve(Buffer.from(reader.result))
          } else {
            reject(new Error('Failed to read PNG blob as ArrayBuffer'))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read PNG blob'))
        reader.readAsArrayBuffer(blob)
      }, 'image/png')
    })
  } catch (error) {
    throw new ConversionError(
      `Failed to convert ImageData to PNG: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'IMAGEDATA_TO_PNG_FAILED'
    )
  }
}

/**
 * Converts SVG buffer to ICO format
 * Implements the ConversionHandler interface
 */
export const svgToIcoHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToIcoOptions = {}
): Promise<ConversionResult> => {
  try {
    // Ensure we have a Buffer to work with
    const buffer = typeof input === 'string' 
      ? Buffer.from(input, 'utf8') 
      : input

    // Validate input is SVG
    validateSvgInput(buffer)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Determine sizes to generate
    let sizes = options.sizes || STANDARD_ICO_SIZES
    
    // Filter out 256 if not wanted
    if (options.includeLarge === false) {
      sizes = sizes.filter(size => size !== 256)
    }

    // Ensure sizes are valid
    sizes = sizes.filter(size => size > 0 && size <= 256)
    
    if (sizes.length === 0) {
      throw new ConversionError('No valid sizes specified for ICO generation', 'ICO_NO_SIZES')
    }

    // Sort sizes for consistent output
    sizes.sort((a, b) => a - b)

    // Generate ImageData for each size
    const imageDataList: { size: number; imageData: ImageData }[] = []
    const progressPerSize = 0.7 / sizes.length

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i]
      
      // Report progress
      if (options.onProgress) {
        options.onProgress(0.1 + (i * progressPerSize))
      }

      const imageData = await svgToImageData(buffer, size, options.backgroundColor)
      imageDataList.push({ size, imageData })
    }

    // Report progress
    if (options.onProgress) {
      options.onProgress(0.8)
    }

    // Calculate offsets
    const headerSize = 6
    const directorySize = 16 * imageDataList.length
    let currentOffset = headerSize + directorySize

    // Create directory entries and convert ImageData to appropriate format
    const directoryEntries: Buffer[] = []
    const imageBuffers: Buffer[] = []

    for (const { size, imageData } of imageDataList) {
      // For sizes 256x256 and above, use PNG format directly in ICO
      const isPngFormat = size >= 256
      
      let imageBuffer: Buffer
      if (isPngFormat) {
        // Use PNG format directly
        imageBuffer = await imageDataToPng(imageData)
      } else {
        // Convert to BMP format for smaller sizes
        imageBuffer = imageDataToBmp(imageData)
      }

      directoryEntries.push(createIcoDirectoryEntry(size, size, imageBuffer, currentOffset))
      imageBuffers.push(imageBuffer)
      currentOffset += imageBuffer.length
    }

    // Report progress
    if (options.onProgress) {
      options.onProgress(0.9)
    }

    // Combine all parts into final ICO
    const icoBuffer = Buffer.concat([
      createIcoHeader(imageDataList.length),
      ...directoryEntries,
      ...imageBuffers
    ])

    // Report completion
    if (options.onProgress) {
      options.onProgress(1)
    }

    return {
      success: true,
      data: icoBuffer,
      mimeType: 'image/x-icon',
      metadata: {
        format: 'ico',
        size: icoBuffer.length,
        width: sizes[sizes.length - 1], // Largest size
        height: sizes[sizes.length - 1]
      }
    }

  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }

    // Wrap unknown errors
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to ICO conversion failed: ${error.message}`,
        'SVG_TO_ICO_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to ICO conversion',
      'SVG_TO_ICO_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to ICO conversion wrapper
 */
export async function convertSvgToIcoClient(
  file: File,
  options: SvgToIcoOptions = {}
): Promise<ConversionResult> {
  const text = await file.text()
  return svgToIcoHandler(text, options)
}

/**
 * Server-side SVG to ICO conversion wrapper
 */
export async function convertSvgToIcoServer(
  buffer: Buffer,
  options: SvgToIcoOptions = {}
): Promise<ConversionResult> {
  return svgToIcoHandler(buffer, options)
}

/**
 * SVG to ICO converter configuration
 */
export const svgToIcoConverter = {
  name: 'SVG to ICO',
  from: 'svg' as ImageFormat,
  to: 'ico' as ImageFormat,
  handler: svgToIcoHandler,
  isClientSide: true,
  description: 'Convert SVG files to ICO format with multiple icon sizes and transparency support'
}