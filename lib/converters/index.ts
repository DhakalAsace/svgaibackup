/**
 * Converters Library Index
 * 
 * Central export file for all converter implementations, types, interfaces,
 * registry, and utility functions. Provides a convenient API surface for
 * consuming the converter library.
 */

// Export all types and interfaces
export type {
  ImageFormat,
  ConversionOptions,
  ConversionResult,
  FileValidationResult,
  ConverterConfig,
  ConversionHandler,
  Converter
} from './types'

import type { ImageFormat } from './types'

// Export error classes and utilities
export {
  // Error classes
  ConverterError,
  FileValidationError,
  ConversionError,
  UnsupportedFormatError,
  FileSizeError,
  
  // Error handling utilities
  handleConverterError,
  createConverterSuccessResponse,
  isConverterError,
  
  // Error constants
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
  
  // Types
  type ConverterErrorResponse,
  type ConverterSuccessResponse,
  type ConverterResponse
} from './errors'

// Export validation utilities
export {
  getImageFormatFromMimeType,
  getMimeTypeFromFormat,
  detectFileTypeFromBuffer,
  validateFile,
  sanitizeFilename,
  getOutputFilename
} from './validation'

// Export API utilities for server-side usage
export {
  processFileUpload,
  applyRateLimit,
  parseConversionOptions,
  createConversionResponse,
  streamFileResponse,
  handleCors,
  handleOptionsRequest,
  logConversionMetrics,
  validateConversionRequest,
  createConverterHandler
} from './api-utils'

// Note: Client-side converter utilities are available but require
// the file to be renamed to .tsx for React support
// export * from './client-converter'

// Export converter registry and convenience functions
export {
  converterRegistry,
  getConverter,
  isConversionSupported,
  listAvailableConversions,
  listConverters,
  getConverterMetadata,
  
  // Types
  type ConverterMetadata,
  type ConverterRegistry
} from './registry'

// Import needed types
import type { ConverterMetadata } from './registry'

// Import all converter implementations
import { pngToSvgConverter } from './png-to-svg'
import { svgToPngConverter } from './svg-to-png'
import { jpgToSvgConverter } from './jpg-to-svg'
import { svgToJpgConverter } from './svg-to-jpg'

// Create alias for JPEG
const jpegToSvgConverter = jpgToSvgConverter
import { webpToSvgConverter } from './webp-to-svg'
import { svgToWebpConverter } from './svg-to-webp'
import { gifToSvgConverter } from './gif-to-svg'
import { svgToGifConverter } from './svg-to-gif'
import { bmpToSvgConverter } from './bmp-to-svg'
import { svgToBmpConverter } from './svg-to-bmp'
import { pdfToSvgConverter } from './pdf-to-svg'
import { svgToPdfConverter } from './svg-to-pdf'
import { icoToSvgConverter } from './ico-to-svg'
import { svgToIcoConverter } from './svg-to-ico'
import { tiffToSvgConverter } from './tiff-to-svg'
import { svgToTiffConverter } from './svg-to-tiff'
import { imageToSvgConverter } from './image-to-svg'
import { svgOptimizerConverter } from './svg-optimizer'
import { svgToBase64Converter } from './svg-to-base64'
import { epsToSvgConverter } from './eps-to-svg'
import { aiToSvgConverter } from './ai-to-svg'
import { dxfToSvgConverter } from './dxf-to-svg'
import { stlToSvgConverter } from './stl-to-svg'
import { svgToAvifConverter } from './svg-to-avif'
import { cdrToSvgConverter } from './cdr-to-svg'
import { svgToDxfConverter } from './svg-to-dxf'
import { svgToStlConverter } from './svg-to-stl'
import { svgToEpsConverter } from './svg-to-eps'
import { svgToMp4Converter } from './svg-to-mp4'
import { htmlToSvgConverter } from './html-to-svg'
import { avifToSvgConverter } from './avif-to-svg'
import { ttfToSvgConverter } from './ttf-to-svg'
import { svgToHtmlConverter } from './svg-to-html'
import { svgToEmfConverter } from './svg-to-emf'
import { svgToAiConverter } from './svg-to-ai'
import { wmfToSvgConverter } from './wmf-to-svg'
import { svgToWmfConverter } from './svg-to-wmf'
import { emfToSvgConverter } from './emf-to-svg'
import { heicToSvgConverter } from './heic-to-svg'
import { svgToHeicConverter } from './svg-to-heic'

// Export individual converters
export {
  // PNG converters
  pngToSvgConverter,
  svgToPngConverter,
  
  // JPG/JPEG converters
  jpgToSvgConverter,
  jpegToSvgConverter,
  svgToJpgConverter,
  
  // WebP converters
  webpToSvgConverter,
  svgToWebpConverter,
  
  // GIF converters
  gifToSvgConverter,
  svgToGifConverter,
  
  // BMP converters
  bmpToSvgConverter,
  svgToBmpConverter,
  
  // PDF converters
  pdfToSvgConverter,
  svgToPdfConverter,
  
  // ICO converters
  icoToSvgConverter,
  svgToIcoConverter,
  
  // TIFF converters
  tiffToSvgConverter,
  svgToTiffConverter,
  
  // Generic converters
  imageToSvgConverter,
  svgOptimizerConverter,
  svgToBase64Converter,
  
  // Advanced format converters
  epsToSvgConverter,
  aiToSvgConverter,
  dxfToSvgConverter,
  stlToSvgConverter,
  svgToAvifConverter,
  cdrToSvgConverter,
  svgToDxfConverter,
  svgToStlConverter,
  svgToEpsConverter,
  svgToMp4Converter,
  htmlToSvgConverter,
  avifToSvgConverter,
  ttfToSvgConverter,
  svgToHtmlConverter,
  svgToEmfConverter,
  svgToAiConverter,
  wmfToSvgConverter,
  svgToWmfConverter,
  emfToSvgConverter,
  
  // HEIC converters
  heicToSvgConverter,
  svgToHeicConverter
}

// Export handler functions directly for convenience
export { pngToSvgHandler } from './png-to-svg'
export { svgToPngHandler } from './svg-to-png'
export { jpgToSvgHandler, jpegToSvgHandler } from './jpg-to-svg'
export { svgToJpgHandler } from './svg-to-jpg'
export { webpToSvgHandler } from './webp-to-svg'
export { svgToWebpHandler } from './svg-to-webp'
export { gifToSvgHandler } from './gif-to-svg'
export { svgToGifHandler } from './svg-to-gif'
export { bmpToSvgHandler } from './bmp-to-svg'
export { svgToBmpHandler } from './svg-to-bmp'
export { pdfToSvgHandler } from './pdf-to-svg'
export { svgToPdfHandler } from './svg-to-pdf'
export { icoToSvgHandler } from './ico-to-svg'
export { svgToIcoHandler } from './svg-to-ico'
export { tiffToSvgHandler } from './tiff-to-svg'
export { svgToTiffHandler } from './svg-to-tiff'
export { imageToSvgHandler } from './image-to-svg'
export { svgOptimizerHandler } from './svg-optimizer'
export { svgToBase64Handler } from './svg-to-base64'
export { epsToSvgHandler } from './eps-to-svg'
export { aiToSvgHandler } from './ai-to-svg'
export { dxfToSvgHandler } from './dxf-to-svg'
export { stlToSvgHandler } from './stl-to-svg'
export { svgToAvifHandler } from './svg-to-avif'
export { cdrToSvgHandler } from './cdr-to-svg'
export { svgToDxfHandler } from './svg-to-dxf'
export { svgToStlHandler } from './svg-to-stl'
export { svgToEpsHandler } from './svg-to-eps'
export { svgToMp4Handler } from './svg-to-mp4'
export { htmlToSvgHandler } from './html-to-svg'
export { avifToSvgHandler } from './avif-to-svg'
export { ttfToSvgHandler } from './ttf-to-svg'
export { svgToHtmlHandler } from './svg-to-html'
export { svgToEmfHandler } from './svg-to-emf'
export { svgToAiHandler } from './svg-to-ai'
export { wmfToSvgHandler } from './wmf-to-svg'
export { svgToWmfHandler } from './svg-to-wmf'
export { emfToSvgHandler } from './emf-to-svg'
export { heicToSvgHandler } from './heic-to-svg'
export { svgToHeicHandler } from './svg-to-heic'

// Create and export a pre-configured registry with all converters
import { converterRegistry } from './registry'

// Register all converters in the registry
const converters = [
  pngToSvgConverter,
  svgToPngConverter,
  jpgToSvgConverter,
  jpegToSvgConverter,
  svgToJpgConverter,
  webpToSvgConverter,
  svgToWebpConverter,
  gifToSvgConverter,
  svgToGifConverter,
  bmpToSvgConverter,
  svgToBmpConverter,
  pdfToSvgConverter,
  svgToPdfConverter,
  icoToSvgConverter,
  svgToIcoConverter,
  tiffToSvgConverter,
  svgToTiffConverter,
  imageToSvgConverter,
  svgOptimizerConverter,
  svgToBase64Converter,
  epsToSvgConverter,
  aiToSvgConverter,
  dxfToSvgConverter,
  stlToSvgConverter,
  svgToAvifConverter,
  cdrToSvgConverter,
  svgToDxfConverter,
  svgToStlConverter,
  svgToEpsConverter,
  svgToMp4Converter,
  htmlToSvgConverter,
  avifToSvgConverter,
  ttfToSvgConverter,
  svgToHtmlConverter,
  svgToEmfConverter,
  svgToAiConverter,
  wmfToSvgConverter,
  svgToWmfConverter,
  emfToSvgConverter,
  heicToSvgConverter,
  svgToHeicConverter
]

// Register all converters
converters.forEach(converter => {
  converterRegistry.register(converter)
})

// Export a ready-to-use registry
export const registry = converterRegistry

// Convenience function to get all supported formats
export function getSupportedFormats(): {
  inputFormats: Set<ImageFormat>
  outputFormats: Set<ImageFormat>
} {
  const conversions = converterRegistry.listAvailableConversions()
  const inputFormats = new Set(conversions.map((c: { from: ImageFormat; to: ImageFormat }) => c.from))
  const outputFormats = new Set(conversions.map((c: { from: ImageFormat; to: ImageFormat }) => c.to))
  
  return { inputFormats, outputFormats }
}

// Convenience function to get all conversions for a specific format
export function getConversionsForFormat(format: ImageFormat): {
  from: ConverterMetadata[]
  to: ConverterMetadata[]
} {
  return {
    from: converterRegistry.getConvertersFrom(format),
    to: converterRegistry.getConvertersTo(format)
  }
}

// Note: createClientConverter function requires client-converter to be .tsx
// Uncomment when client-converter.ts is renamed to client-converter.tsx
/*
export function createClientConverter(config?: ClientConverterConfig): ClientConverter {
  const converter = new ClientConverter(config)
  
  // Register only client-side converters
  converters
    .filter(c => c.isClientSide)
    .forEach(c => converter.registerConverter(c))
  
  return converter
}
*/

// Export format constants for convenience
export const SUPPORTED_FORMATS = {
  RASTER: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'tiff', 'avif'] as const,
  VECTOR: ['svg', 'pdf', 'eps', 'ai', 'dxf', 'cdr'] as const,
  CAD: ['dxf', 'stl'] as const,
  VIDEO: ['mp4'] as const,
  FONT: ['ttf'] as const,
  WEB: ['html'] as const,
  WINDOWS: ['emf', 'wmf'] as const,
  ALL: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'pdf', 'ico', 'tiff', 'eps', 'ai', 'dxf', 'stl', 'avif', 'cdr', 'mp4', 'html', 'ttf', 'emf', 'wmf', 'heic'] as const
} as const

// Export mime type mappings
export const MIME_TYPES = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'bmp': 'image/bmp',
  'svg': 'image/svg+xml',
  'pdf': 'application/pdf',
  'ico': 'image/x-icon',
  'tiff': 'image/tiff',
  'eps': 'application/postscript',
  'ai': 'application/postscript',
  'dxf': 'application/dxf',
  'stl': 'model/stl',
  'avif': 'image/avif',
  'cdr': 'application/x-coreldraw',
  'mp4': 'video/mp4',
  'html': 'text/html',
  'ttf': 'font/ttf',
  'emf': 'image/x-emf',
  'wmf': 'image/x-wmf',
  'heic': 'image/heic'
} as const

// Export file extension mappings
export const FILE_EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'image/x-icon': 'ico',
  'image/tiff': 'tiff',
  'application/postscript': 'eps',
  'application/dxf': 'dxf',
  'model/stl': 'stl',
  'image/avif': 'avif',
  'application/x-coreldraw': 'cdr',
  'video/mp4': 'mp4',
  'text/html': 'html',
  'font/ttf': 'ttf',
  'image/x-emf': 'emf',
  'image/x-wmf': 'wmf',
  'image/heic': 'heic'
} as const

// Default export with all major exports grouped
const convertersExport = {
  // Registry
  registry: converterRegistry,
  
  // Converters
  converters,
  
  // Utilities
  getConverter: converterRegistry.getConverter.bind(converterRegistry),
  isConversionSupported: converterRegistry.isSupported.bind(converterRegistry),
  listAvailableConversions: converterRegistry.listAvailableConversions.bind(converterRegistry),
  listConverters: converterRegistry.listConverters.bind(converterRegistry),
  getSupportedFormats,
  getConversionsForFormat,
  // createClientConverter, // Uncomment when client-converter.tsx is available
  
  // Constants
  SUPPORTED_FORMATS,
  MIME_TYPES,
  FILE_EXTENSIONS
}

export default convertersExport