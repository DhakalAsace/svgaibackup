/**
 * Validation Utilities for Converters
 * 
 * This module provides common validation utilities that can be used
 * across all 40 converter implementations.
 */

import { Buffer } from 'buffer'
import type { ConversionOptions, ImageFormat } from './types'
import { createLogger } from '@/lib/logger'

const logger = createLogger('validation-utils')
import { 
  validateFile, 
  validateConversionParams,
  isConversionSupported,
  FORMAT_SIZE_LIMITS,
  MAX_DIMENSIONS
} from './validation'
import {
  FileValidationError,
  InvalidParameterError,
  UnsupportedFormatError,
  DimensionError,
  SecurityError,
  CorruptedFileError
} from './errors'
import { converterConfig } from '@/lib/env-client'

/**
 * Standard validation for converter handlers
 * This should be called at the beginning of every conversion handler
 */
export async function validateConversion(
  input: Buffer | string,
  sourceFormat: ImageFormat,
  targetFormat: ImageFormat,
  options: ConversionOptions = {}
): Promise<Buffer> {
  // Convert input to buffer if needed
  const buffer = typeof input === 'string' 
    ? Buffer.from(input, 'base64') 
    : input

  // Check conversion support
  const supportCheck = isConversionSupported(sourceFormat, targetFormat)
  if (!supportCheck.supported) {
    throw new UnsupportedFormatError(
      sourceFormat,
      [targetFormat],
      supportCheck.reason
    )
  }

  // Validate file
  // Special cases: 
  // - AI files are PDF-based, so allow both AI and PDF formats
  // - EPS files might be detected as PostScript or PDF
  let allowedFormats: ImageFormat[]
  if (sourceFormat === 'ai') {
    allowedFormats = ['ai', 'pdf']
  } else if (sourceFormat === 'eps') {
    allowedFormats = ['eps', 'pdf']
  } else {
    allowedFormats = [sourceFormat]
  }
    
  const fileValidation = validateFile(buffer, {
    allowedFormats,
    targetFormat
  })
  
  if (!fileValidation.isValid) {
    throw new FileValidationError(fileValidation.error!)
  }

  // Validate parameters
  const paramValidation = validateConversionParams(options, sourceFormat, targetFormat)
  if (!paramValidation.isValid) {
    throw new InvalidParameterError('options', options, paramValidation.error)
  }

  return buffer
}

/**
 * Validate output dimensions based on format constraints
 */
export function validateOutputDimensions(
  width: number,
  height: number,
  format: ImageFormat
): void {
  const maxDim = MAX_DIMENSIONS[format]
  
  if (width > maxDim.width || height > maxDim.height) {
    throw new DimensionError(
      width,
      height,
      maxDim.width,
      maxDim.height,
      format
    )
  }
  
  // Additional checks for specific formats
  if (format === 'ico' && (width > 256 || height > 256)) {
    throw new DimensionError(
      width,
      height,
      256,
      256,
      'ico (for compatibility)'
    )
  }
}

/**
 * Validate and sanitize SVG content
 */
export function validateSvgSecurity(svgContent: string): string {
  if (!converterConfig.enableSecurityChecks) {
    return svgContent
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script[\s>]/i,
    /on\w+\s*=/i,
    /javascript:/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /<form/i,
    /xlink:href\s*=\s*["'](?!#)/i, // External references
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(svgContent)) {
      throw new SecurityError(
        'SVG contains potentially dangerous content',
        'Remove scripts, event handlers, and external references'
      )
    }
  }

  return svgContent
}

/**
 * Check if buffer appears to be corrupted
 */
export function checkForCorruption(
  buffer: Buffer,
  format: ImageFormat
): void {
  // Basic corruption checks
  if (buffer.length === 0) {
    throw new CorruptedFileError(format, 'File is empty')
  }

  // Format-specific corruption checks
  switch (format) {
    case 'png':
      // PNG must end with IEND chunk
      const pngEnd = buffer.slice(-12, -8).toString('ascii')
      if (pngEnd !== 'IEND') {
        throw new CorruptedFileError('PNG', 'Missing IEND chunk')
      }
      break

    case 'jpg':
    case 'jpeg':
      // JPEG should have SOI and EOI markers
      if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
        throw new CorruptedFileError('JPEG', 'Missing SOI marker')
      }
      break

    case 'gif':
      // GIF should end with trailer
      if (buffer[buffer.length - 1] !== 0x3B) {
        logger.warn('GIF may be missing trailer byte')
      }
      break

    case 'pdf':
      // PDF should have %%EOF
      const pdfEnd = buffer.slice(-32).toString('ascii')
      if (!pdfEnd.includes('%%EOF')) {
        throw new CorruptedFileError('PDF', 'Missing EOF marker')
      }
      break
  }
}

/**
 * Calculate appropriate timeout based on file size and operation
 */
export function calculateTimeout(
  fileSize: number,
  sourceFormat: ImageFormat,
  targetFormat: ImageFormat
): number {
  const baseSizeInMB = fileSize / (1024 * 1024)
  let timeout = converterConfig.timeoutMs

  // Adjust timeout based on file size
  if (baseSizeInMB > 10) {
    timeout = Math.min(timeout * 2, 120000) // Max 2 minutes
  }

  // Some conversions take longer
  const slowConversions = [
    'pdf-to-svg',
    'ai-to-svg',
    'eps-to-svg',
    'svg-to-mp4',
    'stl-to-svg'
  ]

  const conversionKey = `${sourceFormat}-to-${targetFormat}`
  if (slowConversions.includes(conversionKey)) {
    timeout = Math.min(timeout * 1.5, 180000) // Max 3 minutes
  }

  return timeout
}

/**
 * Get size limit for a specific format
 */
export function getFormatSizeLimit(format: ImageFormat): number {
  return FORMAT_SIZE_LIMITS[format] || converterConfig.maxFileSize
}

/**
 * Create a progress reporter for long-running conversions
 */
export function createProgressReporter(
  onProgress?: (progress: number) => void
): {
  report: (progress: number) => void
  reportStep: (step: number, totalSteps: number) => void
} {
  return {
    report: (progress: number) => {
      if (onProgress && progress >= 0 && progress <= 1) {
        onProgress(progress)
      }
    },
    reportStep: (step: number, totalSteps: number) => {
      if (onProgress && totalSteps > 0) {
        onProgress(Math.min(step / totalSteps, 1))
      }
    }
  }
}

/**
 * Validate file extension matches detected format
 */
export function validateFileExtension(
  filename: string,
  detectedFormat: ImageFormat
): void {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  if (!ext) {
    return // No extension to validate
  }

  // Handle common mismatches
  const extensionMap: Record<string, ImageFormat> = {
    'jpeg': 'jpg',
    'tif': 'tiff',
    'ps': 'eps',
  }

  const normalizedExt = extensionMap[ext] || ext

  if (normalizedExt !== detectedFormat && ext !== detectedFormat) {
    logger.warn(
      `File extension ".${ext}" doesn't match detected format "${detectedFormat}". ` +
      `The file will be processed as ${detectedFormat.toUpperCase()}.`
    )
  }
}

/**
 * Format-specific validation messages
 */
export const VALIDATION_MESSAGES: Record<string, string> = {
  'png-invalid-ihdr': 'PNG file is missing required image header information',
  'jpg-invalid-marker': 'JPEG file has invalid or corrupted markers',
  'gif-invalid-header': 'GIF file has invalid header information',
  'pdf-encrypted': 'PDF file is encrypted and cannot be converted',
  'svg-namespace-missing': 'SVG file is missing required namespace declaration',
  'tiff-unsupported-compression': 'TIFF file uses unsupported compression',
  'eps-binary-preview': 'EPS file contains binary preview that will be ignored',
  'ai-version-unsupported': 'Adobe Illustrator file version is not supported',
  'mp4-codec-unsupported': 'MP4 file uses unsupported video codec',
  'stl-binary-corrupted': 'STL binary file appears to be corrupted',
}