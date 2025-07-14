/**
 * SVG to HTML Converter Implementation
 * 
 * This module provides SVG to HTML conversion.
 * Converts SVG elements into HTML with various embedding options.
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
 * Extended conversion options for SVG to HTML
 */
interface SvgToHtmlOptions extends ConversionOptions {
  /** Embedding method (default: 'inline') */
  embedMethod?: 'inline' | 'img' | 'object' | 'embed' | 'iframe'
  /** Include full HTML document (default: false) */
  fullDocument?: boolean
  /** Add CSS styles (default: true) */
  includeStyles?: boolean
  /** Make SVG responsive (default: true) */
  responsive?: boolean
  /** Add accessibility attributes (default: true) */
  accessible?: boolean
  /** CSS class names to add */
  className?: string
  /** ID attribute */
  id?: string
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
 * Generate CSS for responsive SVG
 */
function generateResponsiveStyles(id?: string, className?: string): string {
  const selector = id ? `#${id}` : className ? `.${className}` : '.svg-container'
  return `
    <style>
      ${selector} {
        max-width: 100%;
        height: auto;
      }
      ${selector} svg {
        max-width: 100%;
        height: auto;
        display: block;
      }
      ${selector}.svg-responsive {
        position: relative;
        width: 100%;
        padding-bottom: 75%; /* 4:3 aspect ratio */
        height: 0;
        overflow: hidden;
      }
      ${selector}.svg-responsive svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>`
}

/**
 * Converts SVG to HTML with various embedding options
 */
export const svgToHtmlHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToHtmlOptions = {}
): Promise<ConversionResult> => {
  try {
    const svgString = validateSvgInput(input)
    
    const {
      embedMethod = 'inline',
      fullDocument = false,
      includeStyles = true,
      responsive = true,
      accessible = true,
      className = 'svg-container',
      id
    } = options
    
    // Clean SVG and add accessibility attributes if needed
    let processedSvg = svgString
    if (accessible && !svgString.includes('role=')) {
      processedSvg = svgString.replace('<svg', '<svg role="img"')
    }
    
    // Extract title for accessibility
    const titleMatch = svgString.match(/<title>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1] : 'SVG Image'
    
    // Generate HTML based on embed method
    let htmlContent = ''
    
    switch (embedMethod) {
      case 'inline':
        htmlContent = `<div${id ? ` id="${id}"` : ''} class="${className}${responsive ? ' svg-responsive' : ''}">
  ${processedSvg}
</div>`
        break
        
      case 'img':
        // Convert to data URI for img tag
        const dataUri = `data:image/svg+xml;base64,${Buffer.from(processedSvg).toString('base64')}`
        htmlContent = `<img${id ? ` id="${id}"` : ''} 
  class="${className}" 
  src="${dataUri}" 
  alt="${title}"${responsive ? ' style="max-width: 100%; height: auto;"' : ''} />`
        break
        
      case 'object':
        htmlContent = `<object${id ? ` id="${id}"` : ''} 
  class="${className}" 
  type="image/svg+xml" 
  data="image.svg"${responsive ? ' style="max-width: 100%; height: auto;"' : ''}>
  ${processedSvg}
</object>`
        break
        
      case 'embed':
        htmlContent = `<embed${id ? ` id="${id}"` : ''} 
  class="${className}" 
  type="image/svg+xml" 
  src="image.svg"${responsive ? ' style="max-width: 100%; height: auto;"' : ''} />`
        break
        
      case 'iframe':
        htmlContent = `<iframe${id ? ` id="${id}"` : ''} 
  class="${className}" 
  src="image.svg" 
  title="${title}"${responsive ? ' style="max-width: 100%; height: auto; border: none;"' : ''}>
</iframe>`
        break
    }
    
    // Generate full HTML document if requested
    if (fullDocument) {
      const styles = includeStyles ? generateResponsiveStyles(id, className) : ''
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>${styles}
</head>
<body>
    ${htmlContent}
</body>
</html>`
    } else if (includeStyles && embedMethod === 'inline') {
      // Add minimal styles for inline method
      htmlContent = generateResponsiveStyles(id, className) + '\n' + htmlContent
    }
    
    const htmlBuffer = Buffer.from(htmlContent, 'utf8')
    
    return {
      success: true,
      data: htmlBuffer,
      mimeType: 'text/html',
      metadata: {
        format: 'html',
        size: htmlBuffer.length,
        embedMethod: embedMethod
      }
    }
    
  } catch (error) {
    if (error instanceof FileValidationError || 
        error instanceof UnsupportedFormatError) {
      throw error
    }
    
    if (error instanceof Error) {
      throw new ConversionError(
        `SVG to HTML conversion failed: ${error.message}`,
        'SVG_TO_HTML_FAILED'
      )
    }
    
    throw new ConversionError(
      'An unexpected error occurred during SVG to HTML conversion',
      'SVG_TO_HTML_UNKNOWN_ERROR'
    )
  }
}

/**
 * Client-side SVG to HTML conversion wrapper
 */
export async function convertSvgToHtmlClient(
  input: File | string,
  options: SvgToHtmlOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const text = await input.text()
    return svgToHtmlHandler(text, options)
  }
  
  return svgToHtmlHandler(input, options)
}

/**
 * Server-side SVG to HTML conversion wrapper
 */
export async function convertSvgToHtmlServer(
  input: Buffer | string,
  options: SvgToHtmlOptions = {}
): Promise<ConversionResult> {
  return svgToHtmlHandler(input, options)
}

/**
 * SVG to HTML converter configuration
 */
export const svgToHtmlConverter = {
  name: 'SVG to HTML',
  from: 'svg' as ImageFormat,
  to: 'html' as ImageFormat,
  handler: svgToHtmlHandler,
  isClientSide: true,
  description: 'Convert SVG files to HTML with various embedding methods and responsive options'
}