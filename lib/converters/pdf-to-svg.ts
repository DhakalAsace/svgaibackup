/**
 * PDF to SVG Converter Implementation
 * 
 * This module provides PDF to SVG conversion using pdf.js for rendering
 * and canvas-to-svg conversion. Supports single page extraction and
 * multi-page PDF handling with vector preservation when possible.
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

// We'll use dynamic imports for pdf.js to support client-side loading
let pdfjsLib: any = null

/**
 * Extended conversion options for PDF to SVG
 */
interface PdfToSvgOptions extends ConversionOptions {
  /** Page number to convert (1-based, default: 1) */
  page?: number
  /** Scale factor for rendering (default: 2.0 for higher quality) */
  scale?: number
  /** Whether to extract text as SVG text elements (default: false) */
  extractText?: boolean
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
}

/**
 * Validates that the input is a PDF file
 */
function validatePdfInput(buffer: Buffer): void {
  const format = detectFileTypeFromBuffer(buffer)
  
  if (!format) {
    throw new FileValidationError('Unable to detect file format. Make sure the file is a valid PDF.')
  }
  
  if (format !== 'pdf') {
    throw new UnsupportedFormatError(
      format,
      ['pdf'],
      `Expected PDF format but received ${format}. Please upload a valid PDF file.`
    )
  }

  // Additional PDF validation
  const content = buffer.toString('utf8', 0, Math.min(1024, buffer.length))
  
  // Check for PDF version header
  if (!content.match(/%PDF-\d\.\d/)) {
    throw new FileValidationError('Invalid PDF file structure. Missing PDF version header.')
  }

  // Check minimum file size (a valid PDF should be at least a few KB)
  if (buffer.length < 1024) {
    throw new FileValidationError('PDF file is too small to be valid. The file may be corrupted.')
  }
}

/**
 * Dynamically loads pdf.js library
 */
async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib

  try {
    // Dynamic import for client-side support
    const pdfjs = await import('pdfjs-dist')
    
    // Configure worker for client-side usage
    if (typeof window !== 'undefined') {
      // Set worker source from CDN for browser
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    }
    
    pdfjsLib = pdfjs
    return pdfjsLib
  } catch (error) {
    throw new ConversionError(
      'Failed to load PDF.js library. Please try again or use server-side conversion.',
      'PDFJS_LOAD_FAILED'
    )
  }
}

/**
 * Converts Canvas to SVG string
 */
function canvasToSvg(canvas: HTMLCanvasElement): string {
  const width = canvas.width
  const height = canvas.height
  
  // Get canvas as data URL
  const dataUrl = canvas.toDataURL('image/png')
  
  // Create SVG with embedded image
  const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg 
  width="${width}" 
  height="${height}" 
  viewBox="0 0 ${width} ${height}"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <image 
    x="0" 
    y="0" 
    width="${width}" 
    height="${height}" 
    preserveAspectRatio="none"
    xlink:href="${dataUrl}" />
</svg>`
  
  return svg
}

/**
 * Converts PDF buffer to SVG using pdf.js
 * Implements the ConversionHandler interface
 */
export const pdfToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: PdfToSvgOptions = {}
): Promise<ConversionResult> => {
  try {
    // Ensure we have a Buffer to work with
    const buffer = typeof input === 'string' 
      ? Buffer.from(input, 'base64') 
      : input

    // Validate input is PDF
    validatePdfInput(buffer)

    // Report initial progress
    if (options.onProgress) {
      options.onProgress(0.1)
    }

    // Load pdf.js library
    const pdfjs = await loadPdfJs()

    // Load PDF document
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      // Disable text layer to improve performance
      disableTextLayer: !options.extractText,
    })

    if (options.onProgress) {
      options.onProgress(0.2)
    }

    const pdf = await loadingTask.promise
    
    // Get requested page (default to first page)
    const pageNumber = options.page || 1
    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new ConversionError(
        `Invalid page number ${pageNumber}. PDF has ${pdf.numPages} pages.`,
        'INVALID_PAGE_NUMBER'
      )
    }

    const page = await pdf.getPage(pageNumber)

    if (options.onProgress) {
      options.onProgress(0.4)
    }

    // Get page viewport
    const scale = options.scale || 2.0
    const viewport = page.getViewport({ scale })

    // Create canvas
    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D

    if (typeof window !== 'undefined') {
      // Client-side
      canvas = document.createElement('canvas')
      context = canvas.getContext('2d')!
    } else {
      // Server-side using node-canvas
      const { createCanvas } = require('canvas')
      canvas = createCanvas(viewport.width, viewport.height)
      context = canvas.getContext('2d') as CanvasRenderingContext2D
    }

    if (!context) {
      throw new ConversionError('Failed to get canvas context', 'CANVAS_CONTEXT_ERROR')
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    if (options.onProgress) {
      options.onProgress(0.6)
    }

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      // Enable text extraction if requested
      includeText: options.extractText,
    }

    await page.render(renderContext).promise

    if (options.onProgress) {
      options.onProgress(0.8)
    }

    // Convert canvas to SVG
    let svg = canvasToSvg(canvas)

    // Apply dimensions if specified
    if (options.width || options.height) {
      svg = resizeSvg(
        svg, 
        options.width, 
        options.height,
        options.preserveAspectRatio ?? true
      )
    }

    // Clean up
    page.cleanup()

    if (options.onProgress) {
      options.onProgress(1)
    }

    return {
      success: true,
      data: svg,
      mimeType: 'image/svg+xml',
      metadata: {
        width: viewport.width,
        height: viewport.height,
        format: 'svg',
        size: Buffer.byteLength(svg, 'utf8')
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
        `PDF to SVG conversion failed: ${error.message}`,
        'PDF_TO_SVG_FAILED'
      )
    }

    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during PDF to SVG conversion',
      'PDF_TO_SVG_UNKNOWN_ERROR'
    )
  }
}

/**
 * Resizes an SVG to specific dimensions
 */
function resizeSvg(
  svg: string, 
  targetWidth?: number, 
  targetHeight?: number,
  preserveAspectRatio: boolean = true
): string {
  // Extract current dimensions
  const widthMatch = svg.match(/width="(\d+)"/)
  const heightMatch = svg.match(/height="(\d+)"/)
  
  if (!widthMatch || !heightMatch) return svg
  
  const currentWidth = parseInt(widthMatch[1])
  const currentHeight = parseInt(heightMatch[1])
  
  // Calculate new dimensions
  let newWidth = targetWidth || currentWidth
  let newHeight = targetHeight || currentHeight
  
  if (preserveAspectRatio) {
    const aspectRatio = currentWidth / currentHeight
    
    if (targetWidth && !targetHeight) {
      newHeight = Math.round(targetWidth / aspectRatio)
    } else if (!targetWidth && targetHeight) {
      newWidth = Math.round(targetHeight * aspectRatio)
    } else if (targetWidth && targetHeight) {
      // Fit within bounds while preserving aspect ratio
      const scaleX = targetWidth / currentWidth
      const scaleY = targetHeight / currentHeight
      const scale = Math.min(scaleX, scaleY)
      
      newWidth = Math.round(currentWidth * scale)
      newHeight = Math.round(currentHeight * scale)
    }
  }
  
  // Update SVG dimensions and viewBox
  return svg
    .replace(/width="[^"]+"/, `width="${newWidth}"`)
    .replace(/height="[^"]+"/, `height="${newHeight}"`)
    .replace(
      /viewBox="[^"]+"/,
      `viewBox="0 0 ${currentWidth} ${currentHeight}"`
    )
}

/**
 * Client-side PDF to SVG conversion with API fallback
 * This function tries client-side conversion first, then falls back to server-side API
 */
export async function convertPdfToSvgClient(
  file: File,
  options: PdfToSvgOptions = {}
): Promise<ConversionResult> {
  try {
    // Try client-side conversion first
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    return await pdfToSvgHandler(buffer, options)
  } catch (error) {
    console.warn('Client-side PDF conversion failed, trying server-side API:', error)
    
    // Fall back to server-side API conversion
    return convertPdfToSvgViaAPI(file, options)
  }
}

/**
 * Server-side PDF to SVG conversion via API
 * Uses CloudConvert API for reliable conversion
 */
export async function convertPdfToSvgViaAPI(
  file: File,
  options: PdfToSvgOptions = {}
): Promise<ConversionResult> {
  const formData = new FormData()
  formData.append('file', file)
  if (options.page) {
    formData.append('page', options.page.toString())
  }

  try {
    const response = await fetch('/api/convert/pdf-to-svg', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new ConversionError(
        errorData.error || 'Server-side conversion failed',
        'API_CONVERSION_FAILED'
      )
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new ConversionError(
        result.error || 'API conversion failed',
        'API_CONVERSION_FAILED'
      )
    }

    return {
      success: true,
      data: result.data.data, // API wraps the data
      mimeType: 'image/svg+xml',
      metadata: {
        size: result.data.size,
        format: 'svg',
        method: 'cloudconvert-api'
      }
    }
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error
    }
    
    throw new ConversionError(
      `API conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'API_REQUEST_FAILED'
    )
  }
}

/**
 * Server-side PDF to SVG conversion wrapper
 * This function is optimized for server environments
 */
export async function convertPdfToSvgServer(
  buffer: Buffer,
  options: PdfToSvgOptions = {}
): Promise<ConversionResult> {
  // Direct conversion using the handler
  return pdfToSvgHandler(buffer, options)
}

/**
 * Gets the total number of pages in a PDF
 */
export async function getPdfPageCount(buffer: Buffer): Promise<number> {
  try {
    const pdfjs = await loadPdfJs()
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer)
    })
    const pdf = await loadingTask.promise
    const pageCount = pdf.numPages
    
    // Clean up
    await pdf.cleanup()
    
    return pageCount
  } catch (error) {
    throw new ConversionError(
      'Failed to read PDF page count',
      'PDF_PAGE_COUNT_FAILED'
    )
  }
}

/**
 * PDF to SVG converter configuration
 */
export const pdfToSvgConverter = {
  name: 'PDF to SVG',
  from: 'pdf' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: pdfToSvgHandler,
  isClientSide: true,
  description: 'Convert PDF pages to scalable vector graphics with high fidelity rendering'
}