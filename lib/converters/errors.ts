/**
 * Converter Error Classes and Utilities
 * 
 * This module provides specialized error handling for the image converter system.
 * It includes custom error classes for different conversion scenarios and
 * standardized error handling utilities.
 */

import type { ImageFormat } from './types'

/**
 * Base converter error class with error code support
 */
export abstract class ConverterError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Error thrown when file validation fails
 */
export class FileValidationError extends ConverterError {
  constructor(message: string, code: string = 'FILE_VALIDATION_FAILED') {
    super(message, code, 400)
  }
}

/**
 * Error thrown during the conversion process
 */
export class ConversionError extends ConverterError {
  constructor(message: string, code: string = 'CONVERSION_FAILED') {
    super(message, code, 500)
  }
}

/**
 * Error thrown when an unsupported format is used
 */
export class UnsupportedFormatError extends ConverterError {
  public readonly format?: string
  public readonly supportedFormats?: ImageFormat[]

  constructor(
    format?: string,
    supportedFormats?: ImageFormat[],
    message?: string
  ) {
    const defaultMessage = format
      ? `Format '${format}' is not supported`
      : 'Unsupported file format'
    
    super(message || defaultMessage, 'UNSUPPORTED_FORMAT', 400)
    this.format = format
    this.supportedFormats = supportedFormats
  }
}

/**
 * Error thrown when file size exceeds limits
 */
export class FileSizeError extends ConverterError {
  public readonly size: number
  public readonly maxSize: number

  constructor(size: number, maxSize: number) {
    const sizeInMB = (size / 1024 / 1024).toFixed(2)
    const maxSizeInMB = (maxSize / 1024 / 1024).toFixed(2)
    const message = `File size (${sizeInMB}MB) exceeds maximum allowed size (${maxSizeInMB}MB)`
    
    super(message, 'FILE_SIZE_EXCEEDED', 413)
    this.size = size
    this.maxSize = maxSize
  }
}

/**
 * Error response structure for converter errors
 */
export interface ConverterErrorResponse {
  success: false
  error: string
  code: string
  details?: {
    format?: string
    supportedFormats?: ImageFormat[]
    size?: number
    maxSize?: number
  }
}

/**
 * Success response structure for converter operations
 */
export interface ConverterSuccessResponse<T = any> {
  success: true
  data: T
}

/**
 * Unified converter response type
 */
export type ConverterResponse<T = any> = ConverterSuccessResponse<T> | ConverterErrorResponse

/**
 * Error handler utility for converter operations
 * Returns standardized error responses based on error type
 * 
 * @param error - The error to handle
 * @returns Standardized error response with appropriate details
 */
export function handleConverterError(error: unknown): ConverterErrorResponse {
  // Handle known converter errors
  if (error instanceof ConverterError) {
    const response: ConverterErrorResponse = {
      success: false,
      error: error.message,
      code: error.code
    }

    // Add specific error details based on error type
    if (error instanceof UnsupportedFormatError) {
      response.details = {
        format: error.format,
        supportedFormats: error.supportedFormats
      }
    } else if (error instanceof FileSizeError) {
      response.details = {
        size: error.size,
        maxSize: error.maxSize
      }
    }

    return response
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: 'UNKNOWN_ERROR'
    }
  }

  // Handle unknown errors
  return {
    success: false,
    error: 'An unexpected error occurred during conversion',
    code: 'UNKNOWN_ERROR'
  }
}

/**
 * Creates a success response for converter operations
 * 
 * @param data - The data to include in the response
 * @returns Standardized success response
 */
export function createConverterSuccessResponse<T>(data: T): ConverterSuccessResponse<T> {
  return {
    success: true,
    data
  }
}

/**
 * Type guard to check if a response is an error response
 * 
 * @param response - The response to check
 * @returns True if the response is an error response
 */
export function isConverterError(response: ConverterResponse): response is ConverterErrorResponse {
  return !response.success
}

/**
 * Error thrown when file is corrupted or invalid
 */
export class CorruptedFileError extends ConverterError {
  constructor(format?: string, details?: string) {
    const message = format
      ? `The ${format.toUpperCase()} file appears to be corrupted or invalid. ${details || 'Please try with a different file.'}`
      : `The file appears to be corrupted or invalid. ${details || 'Please try with a different file.'}`
    super(message, 'CORRUPTED_FILE', 400)
  }
}

/**
 * Error thrown when dimensions exceed limits
 */
export class DimensionError extends ConverterError {
  public readonly width?: number
  public readonly height?: number
  public readonly maxWidth?: number
  public readonly maxHeight?: number

  constructor(width?: number, height?: number, maxWidth?: number, maxHeight?: number, format?: string) {
    const dimension = width && height ? `${width}x${height}` : 'provided'
    const maxDimension = maxWidth && maxHeight ? `${maxWidth}x${maxHeight}` : 'allowed'
    const formatStr = format ? ` for ${format.toUpperCase()} format` : ''
    
    super(
      `Image dimensions (${dimension}) exceed maximum ${maxDimension}${formatStr}. Please resize your image and try again.`,
      'DIMENSION_EXCEEDED',
      400
    )
    
    this.width = width
    this.height = height
    this.maxWidth = maxWidth
    this.maxHeight = maxHeight
  }
}

/**
 * Error thrown for invalid conversion parameters
 */
export class InvalidParameterError extends ConverterError {
  public readonly parameter: string
  public readonly value: any
  public readonly expectedRange?: string

  constructor(parameter: string, value: any, expectedRange?: string) {
    const rangeMsg = expectedRange ? ` Expected: ${expectedRange}` : ''
    super(
      `Invalid ${parameter}: ${value}.${rangeMsg}`,
      'INVALID_PARAMETER',
      400
    )
    this.parameter = parameter
    this.value = value
    this.expectedRange = expectedRange
  }
}

/**
 * Error thrown for security violations
 */
export class SecurityError extends ConverterError {
  constructor(message: string = 'Security violation detected', details?: string) {
    super(
      `${message}. ${details || 'The file contains potentially harmful content and cannot be processed.'}`,
      'SECURITY_VIOLATION',
      403
    )
  }
}

/**
 * Common error messages for consistent user experience
 */
export const ERROR_MESSAGES = {
  INVALID_FILE: 'Please provide a valid file',
  INVALID_FORMAT: 'Invalid file format',
  CONVERSION_FAILED: 'Failed to convert the file',
  FILE_TOO_LARGE: 'File size exceeds the allowed limit',
  MISSING_FILE: 'No file provided',
  CORRUPT_FILE: 'The file appears to be corrupted',
  NETWORK_ERROR: 'Network error occurred during conversion',
  TIMEOUT: 'Conversion timed out. Please try with a smaller file',
  UNSUPPORTED_OPERATION: 'This conversion operation is not supported',
  // New user-friendly messages
  EMPTY_FILE: 'The uploaded file is empty. Please select a file with content.',
  INVALID_DIMENSIONS: 'The image dimensions are invalid or too large.',
  MALFORMED_SVG: 'The SVG file is malformed. Please ensure it contains valid SVG markup.',
  MISSING_DEPENDENCIES: 'Required conversion libraries are not available. Please try again later.',
  QUOTA_EXCEEDED: 'You have exceeded your conversion quota. Please upgrade your plan or try again later.',
  BROWSER_INCOMPATIBLE: 'Your browser does not support this conversion. Please try a modern browser.',
  PARTIAL_CONVERSION: 'The file was only partially converted. Some data may be missing.',
  ENCODING_ERROR: 'Unable to process the file encoding. Please ensure the file is not corrupted.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const

/**
 * HTTP status codes for converter errors
 */
export const ERROR_STATUS_CODES = {
  FILE_VALIDATION_FAILED: 400,
  UNSUPPORTED_FORMAT: 400,
  MISSING_FILE: 400,
  INVALID_FORMAT: 400,
  CORRUPTED_FILE: 400,
  DIMENSION_EXCEEDED: 400,
  INVALID_PARAMETER: 400,
  SECURITY_VIOLATION: 403,
  FILE_SIZE_EXCEEDED: 413,
  CONVERSION_FAILED: 500,
  UNKNOWN_ERROR: 500,
  TIMEOUT: 504
} as const

/**
 * Get user-friendly error message with recovery suggestions
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof ConverterError) {
    return error.message
  }
  
  if (error instanceof Error) {
    // Map common error patterns to user-friendly messages
    const message = error.message.toLowerCase()
    
    if (message.includes('memory') || message.includes('heap')) {
      return 'The file is too large to process. Please try with a smaller file or reduce its dimensions.'
    }
    
    if (message.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
    
    if (message.includes('encoding') || message.includes('decode')) {
      return ERROR_MESSAGES.ENCODING_ERROR
    }
    
    // Default to original message if no pattern matches
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Create detailed error response with recovery suggestions
 */
export function createDetailedErrorResponse(error: unknown): ConverterErrorResponse {
  const baseResponse = handleConverterError(error)
  
  // Add recovery suggestions based on error type
  if (error instanceof FileSizeError) {
    baseResponse.error += ' Try compressing the file or reducing its dimensions before converting.'
  } else if (error instanceof DimensionError) {
    baseResponse.error += ' You can use an image editor to resize the image first.'
  } else if (error instanceof CorruptedFileError) {
    baseResponse.error += ' Try re-saving the file in its original application or use a different file.'
  } else if (error instanceof SecurityError) {
    baseResponse.error += ' Remove any scripts or external references from the file.'
  } else if (error instanceof UnsupportedFormatError) {
    baseResponse.error += ' Check our supported formats list or try converting to a different format first.'
  }
  
  return baseResponse
}