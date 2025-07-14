/**
 * Enhanced Error Handler with Retry Mechanisms and Fallback Strategies
 * 
 * Provides comprehensive error handling utilities for converter operations
 * including retry logic, fallback conversions, and error recovery.
 */

import { 
  ConversionError, 
  FileValidationError,
  FileSizeError,
  UnsupportedFormatError,
  SecurityError,
  CorruptedFileError,
  DimensionError,
  InvalidParameterError,
  ConverterError,
  handleConverterError,
  createDetailedErrorResponse
} from './errors'
import type { ConversionOptions, ConversionResult, ImageFormat } from './types'

/**
 * Retry configuration for converter operations
 */
export interface RetryConfig {
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryableErrors?: Array<new (...args: any[]) => Error>
  onRetry?: (attempt: number, error: Error) => void
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableErrors: [ConversionError, CorruptedFileError],
  onRetry: () => {}
}

/**
 * Fallback strategy configuration
 */
export interface FallbackStrategy {
  type: 'alternative-converter' | 'quality-reduction' | 'dimension-reduction' | 'format-change'
  execute: (input: Buffer, options: ConversionOptions) => Promise<ConversionResult>
  condition?: (error: Error) => boolean
}

/**
 * Execute operation with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: Error | null = null
  let delay = finalConfig.initialDelay
  
  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Check if error is retryable
      const isRetryable = finalConfig.retryableErrors.some(
        ErrorClass => error instanceof ErrorClass
      )
      
      if (!isRetryable || attempt === finalConfig.maxAttempts) {
        throw error
      }
      
      // Call retry callback
      finalConfig.onRetry(attempt, lastError)
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay))
      delay = Math.min(delay * finalConfig.backoffFactor, finalConfig.maxDelay)
    }
  }
  
  throw lastError || new Error('Retry failed')
}

/**
 * Execute operation with fallback strategies
 */
export async function withFallback(
  primaryOperation: () => Promise<ConversionResult>,
  fallbackStrategies: FallbackStrategy[],
  input: Buffer,
  options: ConversionOptions
): Promise<ConversionResult> {
  try {
    return await primaryOperation()
  } catch (primaryError) {
    // Try each fallback strategy
    for (const strategy of fallbackStrategies) {
      // Check if strategy condition is met
      if (strategy.condition && !strategy.condition(primaryError as Error)) {
        continue
      }
      
      try {
        console.log(`Attempting fallback strategy: ${strategy.type}`)
        return await strategy.execute(input, options)
      } catch (fallbackError) {
        console.warn(`Fallback strategy ${strategy.type} failed:`, fallbackError)
        // Continue to next strategy
      }
    }
    
    // All strategies failed, throw original error
    throw primaryError
  }
}

/**
 * Common fallback strategies for converters
 */
export const COMMON_FALLBACK_STRATEGIES = {
  /**
   * Reduce quality for size-related errors
   */
  qualityReduction: (
    converter: (input: Buffer, options: ConversionOptions) => Promise<ConversionResult>
  ): FallbackStrategy => ({
    type: 'quality-reduction',
    condition: (error) => error instanceof FileSizeError || error instanceof DimensionError,
    execute: async (input, options) => {
      const reducedOptions = {
        ...options,
        quality: Math.max(50, (options.quality || 85) - 25)
      }
      return converter(input, reducedOptions)
    }
  }),
  
  /**
   * Reduce dimensions for size-related errors
   */
  dimensionReduction: (
    converter: (input: Buffer, options: ConversionOptions) => Promise<ConversionResult>
  ): FallbackStrategy => ({
    type: 'dimension-reduction',
    condition: (error) => error instanceof DimensionError,
    execute: async (input, options) => {
      const scale = 0.75
      const reducedOptions = {
        ...options,
        width: options.width ? Math.floor(options.width * scale) : undefined,
        height: options.height ? Math.floor(options.height * scale) : undefined
      }
      return converter(input, reducedOptions)
    }
  }),
  
  /**
   * Try alternative output format
   */
  formatChange: (
    alternativeFormat: ImageFormat,
    converter: (input: Buffer, options: ConversionOptions) => Promise<ConversionResult>
  ): FallbackStrategy => ({
    type: 'format-change',
    condition: (error) => error instanceof UnsupportedFormatError,
    execute: async (input, options) => {
      const altOptions = {
        ...options,
        format: alternativeFormat
      }
      return converter(input, altOptions)
    }
  })
}

/**
 * Error recovery utilities
 */
export class ErrorRecovery {
  /**
   * Attempt to repair corrupted file data
   */
  static async repairCorruptedFile(
    buffer: Buffer,
    format: ImageFormat
  ): Promise<Buffer | null> {
    try {
      switch (format) {
        case 'png':
          return this.repairPNG(buffer)
        case 'jpg':
        case 'jpeg':
          return this.repairJPEG(buffer)
        case 'svg':
          return this.repairSVG(buffer)
        default:
          return null
      }
    } catch {
      return null
    }
  }
  
  /**
   * Attempt to repair PNG file
   */
  private static repairPNG(buffer: Buffer): Buffer | null {
    // Check for PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    if (!buffer.slice(0, 8).equals(signature)) {
      // Add missing signature
      return Buffer.concat([signature, buffer])
    }
    
    // Check for IEND chunk
    const iendChunk = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82])
    if (!buffer.includes(iendChunk)) {
      // Add missing IEND chunk
      return Buffer.concat([buffer, iendChunk])
    }
    
    return buffer
  }
  
  /**
   * Attempt to repair JPEG file
   */
  private static repairJPEG(buffer: Buffer): Buffer | null {
    // Check for JPEG start marker
    if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
      // Add missing start marker
      const startMarker = Buffer.from([0xFF, 0xD8])
      buffer = Buffer.concat([startMarker, buffer])
    }
    
    // Check for JPEG end marker
    const lastTwo = buffer.slice(-2)
    if (lastTwo[0] !== 0xFF || lastTwo[1] !== 0xD9) {
      // Add missing end marker
      const endMarker = Buffer.from([0xFF, 0xD9])
      buffer = Buffer.concat([buffer, endMarker])
    }
    
    return buffer
  }
  
  /**
   * Attempt to repair SVG file
   */
  private static repairSVG(buffer: Buffer): Buffer | null {
    let content = buffer.toString('utf8')
    
    // Fix common SVG issues
    if (!content.includes('<svg')) {
      content = '<svg xmlns="http://www.w3.org/2000/svg">' + content
    }
    
    if (!content.includes('</svg>')) {
      content = content + '</svg>'
    }
    
    // Fix unclosed tags
    const openTags = content.match(/<(\w+)(?:\s[^>]*)?>/g) || []
    const closeTags = content.match(/<\/(\w+)>/g) || []
    
    const openTagCounts: Record<string, number> = {}
    const closeTagCounts: Record<string, number> = {}
    
    openTags.forEach(tag => {
      const tagName = tag.match(/<(\w+)/)?.[1]
      if (tagName && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
        openTagCounts[tagName] = (openTagCounts[tagName] || 0) + 1
      }
    })
    
    closeTags.forEach(tag => {
      const tagName = tag.match(/<\/(\w+)/)?.[1]
      if (tagName) {
        closeTagCounts[tagName] = (closeTagCounts[tagName] || 0) + 1
      }
    })
    
    // Add missing closing tags
    for (const [tagName, openCount] of Object.entries(openTagCounts)) {
      const closeCount = closeTagCounts[tagName] || 0
      if (openCount > closeCount) {
        const missingCount = openCount - closeCount
        for (let i = 0; i < missingCount; i++) {
          content = content.replace('</svg>', `</${tagName}></svg>`)
        }
      }
    }
    
    return Buffer.from(content, 'utf8')
  }
}

/**
 * Create error handler with retry and fallback
 */
export function createResilientConverter(
  converter: (input: Buffer, options: ConversionOptions) => Promise<ConversionResult>,
  config?: {
    retry?: RetryConfig
    fallbacks?: FallbackStrategy[]
    errorHandler?: (error: Error) => void
  }
): (input: Buffer, options: ConversionOptions) => Promise<ConversionResult> {
  return async (input: Buffer, options: ConversionOptions) => {
    const operation = async () => {
      if (config?.fallbacks && config.fallbacks.length > 0) {
        return withFallback(
          () => converter(input, options),
          config.fallbacks,
          input,
          options
        )
      }
      return converter(input, options)
    }
    
    try {
      if (config?.retry) {
        return await withRetry(operation, config.retry)
      }
      return await operation()
    } catch (error) {
      if (config?.errorHandler) {
        config.errorHandler(error as Error)
      }
      throw error
    }
  }
}

/**
 * Error logging and reporting utilities
 */
export class ErrorLogger {
  private static errors: Array<{
    timestamp: Date
    error: Error
    context?: any
  }> = []
  
  static log(error: Error, context?: any): void {
    this.errors.push({
      timestamp: new Date(),
      error,
      context
    })
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Converter Error:', error, context)
    }
  }
  
  static getErrors(): typeof ErrorLogger.errors {
    return [...this.errors]
  }
  
  static clearErrors(): void {
    this.errors = []
  }
  
  static generateReport(): string {
    const errorCounts: Record<string, number> = {}
    
    this.errors.forEach(({ error }) => {
      const key = error.constructor.name
      errorCounts[key] = (errorCounts[key] || 0) + 1
    })
    
    return JSON.stringify({
      totalErrors: this.errors.length,
      errorTypes: errorCounts,
      recentErrors: this.errors.slice(-10).map(({ timestamp, error }) => ({
        timestamp,
        type: error.constructor.name,
        message: error.message
      }))
    }, null, 2)
  }
}