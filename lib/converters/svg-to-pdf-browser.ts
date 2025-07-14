/**
 * SVG to PDF Converter - Browser Implementation
 * 
 * This module provides SVG to PDF conversion using jsPDF for browser environments.
 * Supports customization options including page size, orientation, and margins.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult 
} from './types'
import { 
  ConversionError, 
  FileValidationError 
} from './errors'

/**
 * Extended conversion options for SVG to PDF
 */
interface SvgToPdfOptions extends ConversionOptions {
  /** Page orientation ('portrait' or 'landscape', default: 'portrait') */
  orientation?: 'portrait' | 'landscape'
  /** Page format ('a4', 'letter', 'legal', etc., default: 'a4') */
  pageFormat?: string
  /** PDF quality (0-1, default: 0.95) */
  quality?: number
  /** Progress callback for tracking conversion progress */
  onProgress?: (progress: number) => void
  /** Margins in mm (default: 10) */
  margin?: number
  /** Scale factor for SVG rendering (default: 1) */
  scale?: number
}

/**
 * Validates that the input is an SVG
 */
function validateSvgInput(input: Buffer | string): string {
  // If string, check if it's valid SVG
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
      throw new FileValidationError('Invalid SVG: Missing SVG tag')
    }
    return trimmed
  }
  
  // If buffer, convert to string
  const svgString = Buffer.from(input).toString('utf-8').trim()
  if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG: Missing SVG tag')
  }
  
  return svgString
}

/**
 * Get SVG dimensions from string
 */
function getSvgDimensions(svgString: string): { width: number; height: number } {
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = svgDoc.documentElement as unknown as SVGSVGElement
  
  // Check for parse errors
  if (svgElement.tagName === 'parsererror') {
    throw new FileValidationError('Invalid SVG: Parse error')
  }
  
  // Get SVG dimensions
  let width = parseInt(svgElement.getAttribute('width') || '0')
  let height = parseInt(svgElement.getAttribute('height') || '0')
  
  // If no dimensions, try viewBox
  if (!width || !height) {
    const viewBox = svgElement.getAttribute('viewBox')
    if (viewBox) {
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
      width = width || vbWidth
      height = height || vbHeight
    }
  }
  
  // Default dimensions if still not found
  if (!width || !height) {
    width = width || 800
    height = height || 600
  }
  
  return { width, height }
}

/**
 * Convert SVG to canvas for PDF embedding
 */
async function svgToCanvas(svgString: string, targetWidth: number, targetHeight: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new ConversionError('Failed to create canvas context'))
      return
    }
    
    // Create SVG blob URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    const img = new Image()
    
    img.onload = () => {
      try {
        // Clear canvas with white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, targetWidth, targetHeight)
        
        // Draw SVG image to canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        
        URL.revokeObjectURL(svgUrl)
        resolve(canvas)
      } catch (error) {
        URL.revokeObjectURL(svgUrl)
        reject(error)
      }
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      reject(new ConversionError('Failed to load SVG image'))
    }
    
    img.crossOrigin = 'anonymous'
    img.src = svgUrl
  })
}

/**
 * Browser-based SVG to PDF converter using jsPDF
 */
export const svgToPdfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToPdfOptions = {}
): Promise<ConversionResult> => {
  try {
    // Validate and get SVG string
    const svgString = validateSvgInput(input)
    
    if (options.onProgress) {
      options.onProgress(0.1)
    }
    
    // Dynamically import jsPDF
    const { jsPDF } = await import('jspdf')
    
    // Get SVG dimensions
    const svgDimensions = getSvgDimensions(svgString)
    
    // Set up PDF options
    const orientation = options.orientation || 'portrait'
    const pageFormat = options.pageFormat || 'a4'
    const margin = options.margin || 10
    const scale = options.scale || 1
    
    if (options.onProgress) {
      options.onProgress(0.3)
    }
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageFormat
    })
    
    // Get page dimensions in mm
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate content area (minus margins)
    const contentWidth = pageWidth - (margin * 2)
    const contentHeight = pageHeight - (margin * 2)
    
    // Calculate scaling to fit content in page
    const scaleX = contentWidth / svgDimensions.width
    const scaleY = contentHeight / svgDimensions.height
    const finalScale = Math.min(scaleX, scaleY) * scale
    
    // Calculate final dimensions in mm
    const finalWidth = svgDimensions.width * finalScale
    const finalHeight = svgDimensions.height * finalScale
    
    // Calculate canvas size for good quality (higher resolution)
    const canvasScale = 2 // 2x for better quality
    const canvasWidth = Math.round(finalWidth * canvasScale * 3.78) // Convert mm to pixels (96 DPI)
    const canvasHeight = Math.round(finalHeight * canvasScale * 3.78)
    
    if (options.onProgress) {
      options.onProgress(0.5)
    }
    
    // Convert SVG to canvas
    const canvas = await svgToCanvas(svgString, canvasWidth, canvasHeight)
    
    if (options.onProgress) {
      options.onProgress(0.7)
    }
    
    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', options.quality || 0.95)
    
    // Center the image on the page
    const x = margin + (contentWidth - finalWidth) / 2
    const y = margin + (contentHeight - finalHeight) / 2
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
    
    if (options.onProgress) {
      options.onProgress(0.9)
    }
    
    // Generate PDF as array buffer
    const pdfBuffer = pdf.output('arraybuffer')
    const buffer = Buffer.from(pdfBuffer)
    
    if (options.onProgress) {
      options.onProgress(1)
    }
    
    return {
      success: true,
      data: buffer,
      mimeType: 'application/pdf',
      metadata: {
        width: Math.round(finalWidth),
        height: Math.round(finalHeight),
        format: 'pdf',
        size: buffer.length,
        pageFormat: pageFormat,
        orientation,
        originalFormat: 'svg',
        scale: finalScale
      }
    }
    
  } catch (error) {
    if (error instanceof ConversionError || 
        error instanceof FileValidationError) {
      throw error
    }
    
    throw new ConversionError(
      `SVG to PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'SVG_TO_PDF_FAILED'
    )
  }
}