/**
 * HTML to SVG Converter Implementation
 * 
 * This module provides HTML to SVG conversion using html2canvas.
 * Converts HTML elements and styles into SVG format,
 * useful for creating visual representations of web content.
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
  FileValidationError 
} from './errors'
import { LazyLoadedConverter } from './base-converter'

/**
 * Extended conversion options for HTML to SVG
 */
interface HtmlToSvgOptions extends ConversionOptions {
  /** Include CSS styles (default: true) */
  includeStyles?: boolean
  /** Convert text to paths (default: false) */
  textToPaths?: boolean
  /** Embed images as data URIs (default: true) */
  embedImages?: boolean
  /** Viewport width for rendering (default: 800) */
  viewportWidth?: number
  /** Viewport height for rendering (default: 600) */
  viewportHeight?: number
  /** Scale for high DPI rendering (default: 2) */
  scale?: number
  /** Background color (default: white) */
  backgroundColor?: string
  /** Use foreign object for embedding (default: false) */
  useForeignObject?: boolean
  /** Logging enabled (default: false) */
  logging?: boolean
}

/**
 * HTML to SVG converter using html2canvas
 */
class HtmlToSvgConverter extends LazyLoadedConverter {
  name = 'HTML to SVG'
  from: ImageFormat = 'html'
  to: ImageFormat = 'svg'
  description = 'Convert HTML content to SVG format using advanced DOM rendering'
  
  private html2canvas: any = null
  
  /**
   * Load html2canvas library dynamically
   */
  protected async loadLibraries(): Promise<void> {
    try {
      // Only import on client side
      if (typeof window !== 'undefined') {
        const html2canvasModule = await import('html2canvas')
        this.html2canvas = html2canvasModule.default
      } else {
        throw new Error('HTML to SVG conversion requires a browser environment')
      }
    } catch (error) {
      throw new ConversionError(
        'Failed to load html2canvas library',
        'LIBRARY_LOAD_FAILED'
      )
    }
  }
  
  /**
   * Validates that the input is HTML
   */
  private validateHtmlInput(input: Buffer | string): string {
    const htmlString = typeof input === 'string' ? input : input.toString('utf8')
    const trimmed = htmlString.trim()
    
    // Basic HTML validation
    if (!trimmed.includes('<') || !trimmed.includes('>')) {
      throw new FileValidationError('Invalid HTML: Missing HTML tags')
    }
    
    return trimmed
  }
  
  /**
   * Create a temporary container for HTML content
   */
  private createHtmlContainer(htmlContent: string, options: HtmlToSvgOptions): HTMLElement {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    container.style.width = `${options.viewportWidth || 800}px`
    container.style.height = `${options.viewportHeight || 600}px`
    container.style.overflow = 'hidden'
    container.style.backgroundColor = options.backgroundColor || 'white'
    
    // Create wrapper with proper HTML structure
    const wrapper = document.createElement('div')
    wrapper.innerHTML = htmlContent
    container.appendChild(wrapper)
    
    document.body.appendChild(container)
    return container
  }
  
  /**
   * Convert canvas to SVG
   */
  private canvasToSvg(canvas: HTMLCanvasElement, options: HtmlToSvgOptions): string {
    const width = canvas.width
    const height = canvas.height
    
    // Get canvas as data URL
    const dataUrl = canvas.toDataURL('image/png')
    
    // Create SVG with embedded image
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" 
      width="${width}" 
      height="${height}" 
      viewBox="0 0 ${width} ${height}">
      <defs>
        <style>
          @namespace svg url(http://www.w3.org/2000/svg);
        </style>
      </defs>
      <image 
        x="0" 
        y="0" 
        width="${width}" 
        height="${height}" 
        href="${dataUrl}" 
        preserveAspectRatio="none"/>
    </svg>`
    
    return svg
  }
  
  /**
   * Perform the conversion after libraries are loaded
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: HtmlToSvgOptions
  ): Promise<ConversionResult> {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new ConversionError(
        'HTML to SVG conversion requires a browser environment',
        'BROWSER_REQUIRED'
      )
    }
    
    const htmlString = this.validateHtmlInput(input)
    const viewportWidth = options.width || options.viewportWidth || 800
    const viewportHeight = options.height || options.viewportHeight || 600
    const scale = options.scale || 2
    
    let container: HTMLElement | null = null
    
    try {
      // Create container with HTML content
      container = this.createHtmlContainer(htmlString, options)
      
      // Report progress
      this.reportProgress(options, 0.5)
      
      // Configure html2canvas options
      const h2cOptions = {
        scale: scale,
        width: viewportWidth,
        height: viewportHeight,
        backgroundColor: options.backgroundColor || '#ffffff',
        logging: options.logging || false,
        useCORS: true,
        allowTaint: options.embedImages !== false,
        foreignObjectRendering: options.useForeignObject || false
      }
      
      // Render HTML to canvas
      const canvas = await this.html2canvas(container, h2cOptions)
      
      // Report progress
      this.reportProgress(options, 0.8)
      
      // Convert canvas to SVG
      const svgContent = this.canvasToSvg(canvas, options)
      const svgBuffer = Buffer.from(svgContent, 'utf8')
      
      // Clean up
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      
      return this.createSuccessResult(svgBuffer, 'image/svg+xml', {
        width: canvas.width,
        height: canvas.height,
        scale: scale
      })
      
    } catch (error) {
      // Clean up on error
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      
      if (error instanceof Error) {
        throw new ConversionError(
          `HTML to SVG conversion failed: ${error.message}`,
          'HTML_TO_SVG_FAILED'
        )
      }
      
      throw new ConversionError(
        'An unexpected error occurred during HTML to SVG conversion',
        'HTML_TO_SVG_UNKNOWN_ERROR'
      )
    }
  }
}

// Create singleton instance
const htmlToSvgConverter = new HtmlToSvgConverter()

/**
 * HTML to SVG conversion handler
 */
export const htmlToSvgHandler: ConversionHandler = htmlToSvgConverter.handler

/**
 * Client-side HTML to SVG conversion wrapper
 */
export async function convertHtmlToSvgClient(
  input: File | string,
  options: HtmlToSvgOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const text = await input.text()
    return htmlToSvgHandler(text, options)
  }
  
  return htmlToSvgHandler(input, options)
}

/**
 * Server-side HTML to SVG conversion wrapper
 * Note: This requires a browser environment and won't work in Node.js
 */
export async function convertHtmlToSvgServer(
  input: Buffer | string,
  options: HtmlToSvgOptions = {}
): Promise<ConversionResult> {
  // Server-side rendering would require a headless browser
  throw new ConversionError(
    'HTML to SVG conversion requires a browser environment',
    'BROWSER_REQUIRED'
  )
}

/**
 * HTML to SVG converter configuration
 */
export const htmlToSvgConverterInstance: Converter = {
  name: 'HTML to SVG',
  from: 'html' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: htmlToSvgHandler,
  isClientSide: true,
  description: 'Convert HTML content to SVG format using advanced DOM rendering'
}

// Export for backward compatibility
export { htmlToSvgConverterInstance as htmlToSvgConverter }