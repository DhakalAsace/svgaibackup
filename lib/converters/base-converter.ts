/**
 * Base Converter Abstract Class
 * 
 * Provides foundational infrastructure for all client-side converters.
 * Implements the ConversionHandler interface with common functionality
 * including validation, error handling, progress tracking, and analytics.
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
  handleConverterError,
  getUserFriendlyError
} from './errors'
import { 
  validateFile,
  detectFileTypeFromBuffer,
  isConversionSupported,
  validateConversionParams
} from './validation'

/**
 * Abstract base class for all converters
 * Provides common functionality and enforces converter contract
 */
export abstract class BaseConverter implements Converter {
  abstract name: string
  abstract from: ImageFormat
  abstract to: ImageFormat
  abstract description?: string
  
  // All converters are client-side for free operation
  readonly isClientSide: boolean = true
  readonly isPremium: boolean = false
  
  /**
   * Abstract method that derived classes must implement
   * This contains the actual conversion logic
   */
  protected abstract performConversion(
    input: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult>
  
  /**
   * Main conversion handler implementing ConversionHandler interface
   * Provides validation, error handling, and progress tracking
   */
  get handler(): ConversionHandler {
    // Use bind to ensure 'this' context is preserved and overrides work
    return this.handleConversion.bind(this)
  }
  
  /**
   * The actual conversion handler method
   */
  protected async handleConversion(
    input: Buffer | string,
    options: ConversionOptions = {}
  ): Promise<ConversionResult> {
    let startTime: number | undefined
    let inputSize: number | undefined
    
    try {
      // Normalize input to Buffer
      const buffer = this.normalizeInput(input)
      inputSize = buffer.length
      
      // Track conversion start
      startTime = Date.now()
      await this.trackConversionStart(inputSize, options)
      
      // Initial validation - this will call the overridden method in derived classes
      await this.validateInput(buffer, options)
      
      // Report initial progress
      this.reportProgress(options, 0.1)
      await this.trackConversionProgress(0.1)
      
      // Perform the conversion
      const result = await this.performConversion(buffer, options)
      
      // Final progress
      this.reportProgress(options, 1)
      await this.trackConversionProgress(1)
      
      // Track analytics with input size
      await this.trackConversionComplete(true, result, undefined, inputSize)
      
      return result
      
    } catch (error) {
      // Track failed conversion with input size
      await this.trackConversionComplete(false, null, error, inputSize)
      
      // Re-throw known errors
      if (error instanceof ConversionError || 
          error instanceof FileValidationError) {
        throw error
      }
      
      // Wrap unknown errors
      throw new ConversionError(
        getUserFriendlyError(error),
        `${this.from.toUpperCase()}_TO_${this.to.toUpperCase()}_FAILED`
      )
    }
  }
  
  /**
   * Normalize input to Buffer format
   */
  protected normalizeInput(input: Buffer | string): Buffer {
    if (typeof input === 'string') {
      // Assume base64 encoded string
      return Buffer.from(input, 'base64')
    }
    return input
  }
  
  /**
   * Validate input buffer and conversion parameters
   */
  protected async validateInput(
    buffer: Buffer,
    options: ConversionOptions
  ): Promise<void> {
    console.log(`[BaseConverter.validateInput] Called for ${this.from} to ${this.to}`)
    console.log(`[BaseConverter.validateInput] Allowed formats: [${this.from}]`)
    
    // Validate file format and size
    const validation = validateFile(buffer, {
      allowedFormats: [this.from],
      targetFormat: this.to
    })
    
    console.log('[BaseConverter.validateInput] Validation result:', validation)
    
    if (!validation.isValid) {
      console.error('[BaseConverter.validateInput] Validation failed:', validation.error)
      throw new FileValidationError(validation.error!)
    }
    
    // Check if conversion is supported
    const conversionSupport = isConversionSupported(this.from, this.to)
    if (!conversionSupport.supported) {
      throw new ConversionError(
        conversionSupport.reason!,
        'UNSUPPORTED_CONVERSION'
      )
    }
    
    // Validate conversion parameters
    const paramValidation = validateConversionParams(options, this.from, this.to)
    if (!paramValidation.isValid) {
      throw new ConversionError(
        paramValidation.error!,
        'INVALID_PARAMETERS'
      )
    }
  }
  
  /**
   * Report conversion progress
   */
  protected reportProgress(
    options: ConversionOptions,
    progress: number
  ): void {
    if (options.onProgress && typeof options.onProgress === 'function') {
      try {
        options.onProgress(Math.min(1, Math.max(0, progress)))
      } catch (error) {
        // Ignore progress callback errors
        console.warn('Progress callback error:', error)
      }
    }
  }
  
  /**
   * Track conversion start
   */
  protected async trackConversionStart(
    fileSize: number,
    options?: ConversionOptions
  ): Promise<void> {
    try {
      const { trackConversionStart } = await import('./analytics')
      trackConversionStart(this.name, this.from, this.to, fileSize, options)
    } catch {
      // Never let analytics errors affect conversion
    }
  }
  
  /**
   * Track conversion progress
   */
  protected async trackConversionProgress(progress: number): Promise<void> {
    try {
      const { trackConversionProgress } = await import('./analytics')
      trackConversionProgress(this.name, this.from, this.to, progress)
    } catch {
      // Never let analytics errors affect conversion
    }
  }
  
  /**
   * Track conversion completion
   */
  protected async trackConversionComplete(
    success: boolean,
    result: ConversionResult | null,
    error?: unknown,
    inputSize?: number
  ): Promise<void> {
    try {
      // Import analytics dynamically to avoid circular dependencies
      const { trackConversionComplete } = await import('./analytics')
      
      // Track the conversion completion with input size
      trackConversionComplete(
        this.name,
        this.from,
        this.to,
        success,
        result,
        error
      )
      
      // Log in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Conversion tracked:', {
          converter: this.name,
          from: this.from,
          to: this.to,
          success,
          inputSize,
          outputSize: result?.metadata?.size,
          error: error ? handleConverterError(error) : undefined
        })
      }
    } catch {
      // Never let analytics errors affect conversion
    }
  }
  
  /**
   * Track library loading (for LazyLoadedConverter)
   */
  protected async trackLibraryLoad(
    library: string,
    loadTime: number,
    success: boolean,
    error?: string
  ): Promise<void> {
    try {
      const { trackLibraryLoad } = await import('./analytics')
      trackLibraryLoad(this.name, library, loadTime, success, error)
    } catch {
      // Never let analytics errors affect conversion
    }
  }
  
  /**
   * Helper method to create a successful result
   */
  protected createSuccessResult(
    data: Buffer | string,
    mimeType: string,
    metadata?: Record<string, any>
  ): ConversionResult {
    return {
      success: true,
      data,
      mimeType,
      metadata: {
        format: this.to,
        size: typeof data === 'string' 
          ? Buffer.byteLength(data, 'utf8')
          : data.length,
        ...metadata
      }
    }
  }
  
  /**
   * Helper method to get MIME type for output format
   */
  protected getOutputMimeType(): string {
    const mimeTypes: Record<ImageFormat, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      ico: 'image/x-icon',
      tiff: 'image/tiff',
      eps: 'application/postscript',
      ai: 'application/illustrator',
      dxf: 'application/dxf',
      stl: 'model/stl',
      avif: 'image/avif',
      cdr: 'application/x-coreldraw',
      mp4: 'video/mp4',
      html: 'text/html',
      ttf: 'font/ttf',
      heic: 'image/heic',
      emf: 'image/x-emf',
      wmf: 'image/x-wmf'
    }
    
    return mimeTypes[this.to] || 'application/octet-stream'
  }
}

/**
 * Base class for converters that need to load external libraries
 * Extends BaseConverter with lazy loading capabilities
 */
export abstract class LazyLoadedConverter extends BaseConverter {
  private libraryLoaded: boolean = false
  private loadingPromise: Promise<void> | null = null
  
  /**
   * Abstract method to load required libraries
   * Derived classes implement this with dynamic imports
   */
  protected abstract loadLibraries(): Promise<void>
  
  /**
   * Ensure libraries are loaded before conversion
   */
  protected async ensureLibrariesLoaded(): Promise<void> {
    if (this.libraryLoaded) return
    
    // If already loading, wait for it
    if (this.loadingPromise) {
      await this.loadingPromise
      return
    }
    
    // Track library loading start time
    const loadStartTime = Date.now()
    
    // Start loading
    this.loadingPromise = this.loadLibraries()
      .then(async () => {
        this.libraryLoaded = true
        const loadTime = Date.now() - loadStartTime
        
        // Track successful library load
        await this.trackLibraryLoad('main', loadTime, true)
      })
      .catch(async (error) => {
        this.loadingPromise = null
        const loadTime = Date.now() - loadStartTime
        
        // Track failed library load
        await this.trackLibraryLoad('main', loadTime, false, error.message)
        
        throw new ConversionError(
          `Failed to load required libraries for ${this.name}: ${error.message}`,
          'LIBRARY_LOAD_FAILED'
        )
      })
    
    await this.loadingPromise
  }
  
  /**
   * Override performConversion to ensure libraries are loaded
   */
  protected async performConversion(
    input: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    // Ensure libraries are loaded
    await this.ensureLibrariesLoaded()
    
    // Report progress after library load
    this.reportProgress(options, 0.3)
    await this.trackConversionProgress(0.3)
    
    // Call the actual conversion implementation
    const result = await this.performConversionWithLibraries(input, options)
    
    // Track progress at 90% before final processing
    this.reportProgress(options, 0.9)
    await this.trackConversionProgress(0.9)
    
    return result
  }
  
  /**
   * Abstract method for conversion logic after libraries are loaded
   */
  protected abstract performConversionWithLibraries(
    input: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult>
}