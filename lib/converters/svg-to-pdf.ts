/**
 * SVG to PDF Converter Implementation
 * 
 * This module provides SVG to PDF conversion using jsPDF (browser)
 * or puppeteer (server). Supports various customization options including
 * page size, orientation, and quality settings.
 */

import type { 
  ConversionHandler, 
  ConversionOptions, 
  ConversionResult 
} from './types'
import { 
  ConversionError, 
  FileValidationError,
  UnsupportedFormatError 
} from './errors'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

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
  
  // If buffer, convert to string and validate
  const svgString = Buffer.from(input).toString('utf-8').trim()
  if (!svgString.includes('<svg') && !svgString.includes('<?xml')) {
    throw new FileValidationError('Invalid SVG: Missing SVG tag')
  }
  
  return svgString
}

/**
 * Converts SVG to PDF using either jsPDF (browser) or puppeteer (server)
 * Implements the ConversionHandler interface
 */
export const svgToPdfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToPdfOptions = {}
): Promise<ConversionResult> => {
  // Use browser implementation if in browser environment
  if (isBrowser) {
    const { svgToPdfHandler: browserHandler } = await import('./svg-to-pdf-browser')
    return browserHandler(input, options)
  }
  
  try {
    // Server-side implementation (placeholder - would need puppeteer or similar)
    throw new ConversionError(
      'Server-side SVG to PDF conversion not implemented. Use client-side conversion.',
      'SVG_TO_PDF_SERVER_NOT_IMPLEMENTED'
    )
    
  } catch (error) {
    // Handle known errors
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError ||
        error instanceof ConversionError) {
      throw error
    }
    
    // Handle non-Error objects
    throw new ConversionError(
      'An unexpected error occurred during SVG to PDF conversion',
      'SVG_TO_PDF_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to PDF conversion wrapper
 * This function can be used in browser environments
 */
export async function convertSvgToPdfClient(
  input: File | string,
  options: SvgToPdfOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    // Read file as text for SVG
    const text = await input.text()
    return svgToPdfHandler(text, options)
  }
  
  // Direct string input
  return svgToPdfHandler(input, options)
}

/**
 * SVG to PDF converter configuration
 */
export const svgToPdfConverter = {
  name: 'SVG to PDF',
  from: 'svg' as const,
  to: 'pdf' as const,
  handler: svgToPdfHandler,
  isClientSide: true,
  description: 'Convert scalable vector graphics to PDF documents with customizable page size and orientation'
}