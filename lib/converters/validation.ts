import { FileValidationResult, ImageFormat, ConversionOptions } from './types'
import { converterConfig } from '../env-client'
import { 
  FileValidationError, 
  FileSizeError,
  UnsupportedFormatError,
  ConversionError
} from './errors'
import { sanitizeSvg } from '../svg-sanitizer'
import { createLogger } from '../logger'

const logger = createLogger('converter-validation')

const MIME_TYPE_MAP: Record<string, ImageFormat> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'image/x-icon': 'ico',
  'image/tiff': 'tiff',
  'application/postscript': 'eps',
  'application/illustrator': 'ai',
  'application/x-illustrator': 'ai',
  'application/dxf': 'dxf',
  'model/stl': 'stl',
  'image/avif': 'avif',
  'application/x-coreldraw': 'cdr',
  'video/mp4': 'mp4',
  'text/html': 'html',
  'font/ttf': 'ttf',
  'application/x-font-ttf': 'ttf',
  'font/truetype': 'ttf',
  'image/x-emf': 'emf',
  'application/x-emf': 'emf',
  'image/x-wmf': 'wmf',
  'application/x-wmf': 'wmf',
}

// Enhanced file signatures with more specific patterns
const FILE_SIGNATURES: Record<string, Uint8Array[]> = {
  png: [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  jpg: [
    new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), // JFIF
    new Uint8Array([0xff, 0xd8, 0xff, 0xe1]), // EXIF
    new Uint8Array([0xff, 0xd8, 0xff, 0xe2]), // ICC
    new Uint8Array([0xff, 0xd8, 0xff, 0xe8]), // SPIFF
  ],
  gif: [
    new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]), // GIF87a
    new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]), // GIF89a
  ],
  webp: [new Uint8Array([0x52, 0x49, 0x46, 0x46])], // RIFF header, needs additional check
  bmp: [
    new Uint8Array([0x42, 0x4d]), // BM
  ],
  pdf: [new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])], // %PDF-
  ico: [new Uint8Array([0x00, 0x00, 0x01, 0x00])],
  tiff: [
    new Uint8Array([0x49, 0x49, 0x2a, 0x00]), // Little-endian
    new Uint8Array([0x4d, 0x4d, 0x00, 0x2a]), // Big-endian
  ],
  mp4: [
    new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]), // ftyp
    new Uint8Array([0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70]), // ftyp
  ],
  ttf: [
    new Uint8Array([0x00, 0x01, 0x00, 0x00]), // TrueType
    new Uint8Array([0x74, 0x72, 0x75, 0x65]), // 'true' - TrueType
    new Uint8Array([0x4f, 0x54, 0x54, 0x4f]), // 'OTTO' - OpenType
  ],
}

// Format-specific size limits (in bytes)
export const FORMAT_SIZE_LIMITS: Record<ImageFormat, number> = {
  png: 20 * 1024 * 1024,     // 20MB - lossless format, can be large
  jpg: 15 * 1024 * 1024,     // 15MB - compressed format
  jpeg: 15 * 1024 * 1024,    // 15MB - same as jpg
  gif: 10 * 1024 * 1024,     // 10MB - animated GIFs can be large
  webp: 15 * 1024 * 1024,    // 15MB - efficient format
  bmp: 50 * 1024 * 1024,     // 50MB - uncompressed format
  svg: 5 * 1024 * 1024,      // 5MB - text format, should be small
  pdf: 100 * 1024 * 1024,    // 100MB - can contain multiple pages
  ico: 1 * 1024 * 1024,      // 1MB - icon files should be small
  tiff: 50 * 1024 * 1024,    // 50MB - can be uncompressed
  eps: 25 * 1024 * 1024,     // 25MB - vector format
  ai: 50 * 1024 * 1024,      // 50MB - Adobe Illustrator files
  dxf: 25 * 1024 * 1024,     // 25MB - CAD format
  stl: 100 * 1024 * 1024,    // 100MB - 3D model format
  avif: 10 * 1024 * 1024,    // 10MB - modern compressed format
  cdr: 50 * 1024 * 1024,     // 50MB - CorelDRAW files
  mp4: 200 * 1024 * 1024,    // 200MB - video files
  html: 5 * 1024 * 1024,     // 5MB - HTML should be small
  ttf: 10 * 1024 * 1024,     // 10MB - font files
  emf: 25 * 1024 * 1024,     // 25MB - Windows Enhanced Metafile
  wmf: 10 * 1024 * 1024,     // 10MB - Windows Metafile (older, smaller)
}

// Maximum dimensions for image formats
export const MAX_DIMENSIONS: Record<ImageFormat, { width: number; height: number }> = {
  png: { width: 10000, height: 10000 },
  jpg: { width: 10000, height: 10000 },
  jpeg: { width: 10000, height: 10000 },
  gif: { width: 5000, height: 5000 },
  webp: { width: 16383, height: 16383 },
  bmp: { width: 10000, height: 10000 },
  svg: { width: 100000, height: 100000 }, // SVG can be very large
  pdf: { width: 20000, height: 20000 },
  ico: { width: 256, height: 256 },
  tiff: { width: 30000, height: 30000 },
  eps: { width: 20000, height: 20000 },
  ai: { width: 20000, height: 20000 },
  dxf: { width: 50000, height: 50000 },
  stl: { width: 10000, height: 10000 },
  avif: { width: 10000, height: 10000 },
  cdr: { width: 20000, height: 20000 },
  mp4: { width: 4096, height: 2160 }, // 4K
  html: { width: 10000, height: 10000 },
  ttf: { width: 0, height: 0 }, // Not applicable
  emf: { width: 32767, height: 32767 }, // EMF supports 32-bit coordinates
  wmf: { width: 32767, height: 32767 }, // WMF supports 16-bit coordinates
}

export function getImageFormatFromMimeType(mimeType: string): ImageFormat | null {
  return MIME_TYPE_MAP[mimeType.toLowerCase()] || null
}

export function getMimeTypeFromFormat(format: ImageFormat): string {
  const mimeTypeEntry = Object.entries(MIME_TYPE_MAP).find(([_, fmt]) => fmt === format)
  return mimeTypeEntry ? mimeTypeEntry[0] : 'application/octet-stream'
}

/**
 * Enhanced file type detection with magic byte validation
 */
export function detectFileTypeFromBuffer(buffer: Buffer): ImageFormat | null {
  // Check binary signatures first
  for (const [format, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      if (buffer.length >= signature.length) {
        const bufferStart = buffer.subarray(0, signature.length)
        if (bufferStart.every((byte, index) => byte === signature[index])) {
          // Additional validation for specific formats
          if (format === 'webp') {
            // WebP needs additional WEBP string check at bytes 8-11
            if (buffer.length >= 12 && buffer.slice(8, 12).toString('ascii') === 'WEBP') {
              return 'webp'
            }
            continue
          }
          return format as ImageFormat
        }
      }
    }
  }
  
  // Check for text-based formats
  const textStart = buffer.toString('utf8', 0, Math.min(1000, buffer.length))
  
  // SVG - more thorough check
  if (textStart.match(/<svg[^>]*>/i) || 
      (textStart.includes('<?xml') && textStart.includes('svg'))) {
    return 'svg'
  }
  
  // HTML
  if (textStart.match(/<!DOCTYPE\s+html/i) || 
      textStart.match(/<html[^>]*>/i)) {
    return 'html'
  }
  
  // EPS/AI (PostScript)
  if (textStart.startsWith('%!PS') || textStart.startsWith('%%')) {
    if (textStart.includes('%%Creator: Adobe Illustrator')) {
      return 'ai'
    }
    return 'eps'
  }
  
  // AI files are often PDF-based, check for AI markers in PDF files
  if (textStart.includes('%PDF')) {
    if (textStart.includes('%%Creator: Adobe Illustrator') || 
        (textStart.includes('%%Title:') && textStart.includes('.ai')) ||
        textStart.includes('/Creator (Adobe Illustrator)') ||
        textStart.includes('/Creator(Adobe Illustrator)') || // Without space
        textStart.includes('%%AI') ||
        textStart.toLowerCase().includes('adobe illustrator') ||
        textStart.includes('AI9_') ||
        textStart.includes('AI8_') ||
        textStart.includes('%%For: (Adobe Illustrator)') ||
        textStart.includes('/Producer') && textStart.includes('Illustrator')) {
      return 'ai'
    }
    return 'pdf'
  }
  
  // DXF - AutoCAD format
  if (textStart.includes('0\nSECTION') || 
      textStart.includes('0\r\nSECTION') ||
      textStart.startsWith('  0\nSECTION')) {
    return 'dxf'
  }
  
  // STL ASCII
  if (textStart.toLowerCase().startsWith('solid') && 
      (textStart.includes('facet normal') || textStart.includes('vertex'))) {
    return 'stl'
  }
  
  // TTF Font check
  if (buffer.length >= 12) {
    const ttfHeader = buffer.readUInt32BE(0)
    if (ttfHeader === 0x00010000 || // TrueType
        ttfHeader === 0x4F54544F || // OpenType
        ttfHeader === 0x74727565 || // 'true'
        ttfHeader === 0x74797031) { // 'typ1'
      return 'ttf'
    }
  }
  
  // EMF (Enhanced Metafile) check
  if (buffer.length >= 88) {
    // EMF header starts with signature 0x00000001 at offset 0
    // and contains "EMF" identifier
    const emfType = buffer.readUInt32LE(0)
    const emfSize = buffer.readUInt32LE(4)
    
    if (emfType === 0x00000001 && emfSize >= 88 && emfSize <= buffer.length) {
      // Additional validation: check for EMR_HEADER record type
      const recordType = buffer.readUInt32LE(0)
      if (recordType === 0x00000001) { // EMR_HEADER
        return 'emf'
      }
    }
  }
  
  // WMF (Windows Metafile) check
  if (buffer.length >= 22) {
    // WMF can be either placeable or standard
    // Placeable WMF starts with 0x9AC6CDD7
    const placeableKey = buffer.readUInt32LE(0)
    if (placeableKey === 0x9AC6CDD7) {
      return 'wmf'
    }
    
    // Standard WMF: check for valid mtType and mtHeaderSize
    const mtType = buffer.readUInt16LE(0)
    const mtHeaderSize = buffer.readUInt16LE(2)
    
    if ((mtType === 1 || mtType === 2) && mtHeaderSize === 9) {
      return 'wmf'
    }
  }
  
  // Check binary formats
  const header = buffer.slice(0, 16).toString('hex')
  
  // CDR (RIFF-based CorelDRAW)
  if (header.startsWith('52494646') && buffer.length >= 12) {
    const riffType = buffer.slice(8, 12).toString('ascii')
    if (riffType === 'CDR' || riffType === 'CDR9' || riffType === 'CDRA') {
      return 'cdr'
    }
  }
  
  // AVIF (AV1 Image File Format)
  if (buffer.length >= 12) {
    const ftypOffset = header.indexOf('6674797061766966') // 'ftypavif'
    if (ftypOffset >= 0 && ftypOffset <= 8) {
      return 'avif'
    }
  }
  
  // STL Binary - more robust check
  if (buffer.length >= 84) {
    // Binary STL: 80-byte header + 4-byte triangle count + triangles
    try {
      const triangleCount = buffer.readUInt32LE(80)
      const expectedMinSize = 84 + (triangleCount * 50)
      // Sanity check: triangle count should be reasonable
      if (triangleCount > 0 && triangleCount < 10000000 && buffer.length >= Math.min(expectedMinSize, 1000)) {
        return 'stl'
      }
    } catch {
      // Invalid read, not STL
    }
  }
  
  // HTML detection
  const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1000))
  if (content.match(/^\s*<!DOCTYPE\s+html/i) || 
      content.match(/^\s*<html/i) ||
      (content.match(/<head[\s>]/i) && content.match(/<body[\s>]/i))) {
    return 'html'
  }
  
  // TTF detection (fallback for signatures not caught above)
  if (buffer.length >= 12) {
    const signature = buffer.readUInt32BE(0)
    if (signature === 0x00010000 || signature === 0x74727565 || 
        signature === 0x4f54544f || signature === 0x74746366) {
      return 'ttf'
    }
  }
  
  return null
}

/**
 * Enhanced file validation with format-specific checks
 */
export function validateFile(
  file: File | Buffer,
  options?: { 
    allowedFormats?: string[]; 
    maxSize?: number;
    targetFormat?: ImageFormat; // For conversion validation
  }
): FileValidationResult {
  console.log('[validateFile] Starting validation...')
  console.log('[validateFile] Options:', options)
  
  const config = {
    allowedFormats: options?.allowedFormats || converterConfig.allowedFormats,
    maxSize: options?.maxSize || converterConfig.maxFileSize,
  }
  
  console.log('[validateFile] Config allowedFormats:', config.allowedFormats)

  // Get file buffer and size
  const size = file instanceof File ? file.size : file.length
  const buffer = file instanceof Buffer ? file : null
  
  console.log('[validateFile] File type:', file instanceof File ? 'File' : 'Buffer')
  console.log('[validateFile] File size:', size)

  // Check for empty file
  if (size === 0) {
    return {
      isValid: false,
      error: 'File is empty. Please provide a valid file with content.',
      size,
    }
  }

  // Detect format from buffer or file
  let format: ImageFormat | null = null
  
  if (file instanceof File) {
    console.log('[validateFile] File name:', file.name)
    console.log('[validateFile] File MIME type:', file.type)
    
    // Special handling for AI files that might be detected as PDF
    const ext = file.name.split('.').pop()?.toLowerCase()
    console.log('[validateFile] File extension:', ext)
    
    if (ext === 'ai' && (file.type === 'application/pdf' || file.type === 'application/postscript' || file.type === '')) {
      format = 'ai'
      console.log('[validateFile] Detected as AI file based on extension')
    } else if ((file.type === 'application/pdf' || ext === 'pdf') && options?.allowedFormats?.includes('ai')) {
      // If AI format is allowed and we have a PDF file, check if it's actually an AI file
      // We'll let the buffer content detection decide later
      format = null // Force buffer detection
      console.log('[validateFile] PDF file with AI format allowed, will check content for AI markers')
    } else {
      // Try to get format from MIME type first
      format = getImageFormatFromMimeType(file.type)
      console.log('[validateFile] Format from MIME type:', format)
      
      // Fall back to file extension if MIME type not recognized
      if (!format && file.name) {
        if (ext && Object.values(MIME_TYPE_MAP).includes(ext as ImageFormat)) {
          format = ext as ImageFormat
          console.log('[validateFile] Format from extension:', format)
        }
      }
    }
  } else {
    // Detect from buffer content
    format = detectFileTypeFromBuffer(file)
    console.log('[validateFile] Format detected from buffer:', format)
    
    // Special case: If we detected PDF but AI is in allowed formats, 
    // check if it's actually an AI file
    if (format === 'pdf' && config.allowedFormats.includes('ai')) {
      const header = file.toString('utf8', 0, Math.min(2048, file.length))
      const hasAIMarkers = header.includes('%%Creator: Adobe Illustrator') || 
                          header.includes('%%AI') ||
                          header.includes('/Creator (Adobe Illustrator)') ||
                          header.toLowerCase().includes('adobe illustrator') ||
                          header.includes('%%For: (Adobe Illustrator)') ||
                          header.includes('AI9_') ||
                          header.includes('%%Title:') && header.includes('.ai')
      
      if (hasAIMarkers) {
        console.log('[validateFile] PDF file contains AI markers, treating as AI file')
        format = 'ai'
      }
    }
  }

  if (!format) {
    return {
      isValid: false,
      error: 'Unable to detect file format. The file may be corrupted or in an unsupported format.',
      size,
    }
  }

  console.log('[validateFile] Final detected format:', format)
  console.log('[validateFile] Checking if format is in allowedFormats:', config.allowedFormats.includes(format))

  // Check if format is allowed
  if (!config.allowedFormats.includes(format)) {
    // Special case: If we detected PDF but AI is allowed, and this might be an AI file
    if (format === 'pdf' && config.allowedFormats.includes('ai')) {
      console.log('[validateFile] PDF detected but AI is allowed, checking if it might be an AI file...')
      // Allow it to pass validation, the AI converter will handle it
      return {
        isValid: true,
        format: 'ai', // Treat as AI since that's what's expected
        size,
      }
    }
    
    return {
      isValid: false,
      error: `File format "${format}" is not supported. Supported formats: ${config.allowedFormats.join(', ')}`,
      size,
      format,
    }
  }

  // Use format-specific size limit
  const formatSizeLimit = FORMAT_SIZE_LIMITS[format] || config.maxSize
  if (size > formatSizeLimit) {
    const limitMB = (formatSizeLimit / 1024 / 1024).toFixed(1)
    const sizeMB = (size / 1024 / 1024).toFixed(1)
    return {
      isValid: false,
      error: `File size (${sizeMB}MB) exceeds the maximum allowed size for ${format.toUpperCase()} files (${limitMB}MB). Please use a smaller file or compress it before uploading.`,
      size,
      format,
    }
  }

  // Perform format-specific validation if we have a buffer
  if (buffer) {
    const formatValidation = validateFormatSpecific(buffer, format)
    if (!formatValidation.isValid) {
      return formatValidation
    }
  }

  return {
    isValid: true,
    format,
    size,
  }
}

/**
 * Format-specific validation functions
 */
function validateFormatSpecific(buffer: Buffer, format: ImageFormat): FileValidationResult {
  switch (format) {
    case 'svg':
      return validateSvgContent(buffer)
    case 'png':
      return validatePngContent(buffer)
    case 'jpg':
    case 'jpeg':
      return validateJpegContent(buffer)
    case 'gif':
      return validateGifContent(buffer)
    case 'pdf':
      return validatePdfContent(buffer)
    case 'mp4':
      return validateMp4Content(buffer)
    case 'html':
      return validateHtmlContent(buffer)
    case 'ttf':
      return validateTtfContent(buffer)
    default:
      return { isValid: true, format }
  }
}

/**
 * Validate SVG content for security and structure
 */
function validateSvgContent(buffer: Buffer): FileValidationResult {
  const content = buffer.toString('utf8')
  
  // Check for malicious content
  const dangerousPatterns = [
    /<script[\s>]/i,
    /on\w+\s*=/i, // Event handlers
    /javascript:/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /<form/i,
    /<link/i,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        error: 'SVG file contains potentially dangerous content. Scripts, event handlers, and external references are not allowed.',
        format: 'svg',
      }
    }
  }
  
  // Check for valid SVG structure
  if (!content.match(/<svg[^>]*>/i)) {
    return {
      isValid: false,
      error: 'Invalid SVG file structure. The file must contain a valid <svg> element.',
      format: 'svg',
    }
  }
  
  return { isValid: true, format: 'svg' }
}

/**
 * Validate PNG content structure
 */
function validatePngContent(buffer: Buffer): FileValidationResult {
  // PNG must have IHDR chunk after signature
  if (buffer.length < 24) {
    return {
      isValid: false,
      error: 'PNG file is too small to be valid. The file may be corrupted.',
      format: 'png',
    }
  }
  
  // Check for IHDR chunk
  const ihdrMarker = buffer.slice(12, 16).toString('ascii')
  if (ihdrMarker !== 'IHDR') {
    return {
      isValid: false,
      error: 'Invalid PNG file structure. Missing required IHDR chunk.',
      format: 'png',
    }
  }
  
  // Read dimensions from IHDR
  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  
  const maxDim = MAX_DIMENSIONS.png
  if (width > maxDim.width || height > maxDim.height) {
    return {
      isValid: false,
      error: `PNG dimensions (${width}x${height}) exceed maximum allowed dimensions (${maxDim.width}x${maxDim.height}). Please use a smaller image.`,
      format: 'png',
    }
  }
  
  return { isValid: true, format: 'png' }
}

/**
 * Validate JPEG content structure
 */
function validateJpegContent(buffer: Buffer): FileValidationResult {
  // Check for valid JPEG end marker
  if (buffer.length < 2) {
    return {
      isValid: false,
      error: 'JPEG file is too small to be valid.',
      format: 'jpg',
    }
  }
  
  // JPEG should end with FFD9
  const lastTwo = buffer.slice(-2)
  if (lastTwo[0] !== 0xFF || lastTwo[1] !== 0xD9) {
    // Warning only, some JPEGs might not have proper end marker
    logger.warn('JPEG file may be truncated (missing end marker)')
  }
  
  return { isValid: true, format: 'jpg' }
}

/**
 * Validate GIF content structure
 */
function validateGifContent(buffer: Buffer): FileValidationResult {
  if (buffer.length < 13) {
    return {
      isValid: false,
      error: 'GIF file is too small to be valid.',
      format: 'gif',
    }
  }
  
  // Read dimensions from GIF header
  const width = buffer.readUInt16LE(6)
  const height = buffer.readUInt16LE(8)
  
  const maxDim = MAX_DIMENSIONS.gif
  if (width > maxDim.width || height > maxDim.height) {
    return {
      isValid: false,
      error: `GIF dimensions (${width}x${height}) exceed maximum allowed dimensions (${maxDim.width}x${maxDim.height}).`,
      format: 'gif',
    }
  }
  
  return { isValid: true, format: 'gif' }
}

/**
 * Validate PDF content structure
 */
function validatePdfContent(buffer: Buffer): FileValidationResult {
  const content = buffer.toString('utf8', 0, Math.min(1024, buffer.length))
  
  // Check for PDF version
  if (!content.match(/%PDF-\d\.\d/)) {
    return {
      isValid: false,
      error: 'Invalid PDF file. Missing PDF version header.',
      format: 'pdf',
    }
  }
  
  // Check for %%EOF marker (should be at the end)
  const endContent = buffer.toString('utf8', Math.max(0, buffer.length - 1024))
  if (!endContent.includes('%%EOF')) {
    return {
      isValid: false,
      error: 'PDF file may be truncated or corrupted (missing EOF marker).',
      format: 'pdf',
    }
  }
  
  return { isValid: true, format: 'pdf' }
}

/**
 * Validate MP4 content structure
 */
function validateMp4Content(buffer: Buffer): FileValidationResult {
  if (buffer.length < 12) {
    return {
      isValid: false,
      error: 'MP4 file is too small to be valid.',
      format: 'mp4',
    }
  }
  
  // Check for ftyp box
  const ftypBox = buffer.slice(4, 8).toString('ascii')
  if (ftypBox !== 'ftyp') {
    return {
      isValid: false,
      error: 'Invalid MP4 file structure. Missing required ftyp box.',
      format: 'mp4',
    }
  }
  
  return { isValid: true, format: 'mp4' }
}

/**
 * Validate conversion parameters
 */
export function validateConversionParams(
  options: ConversionOptions,
  fromFormat: ImageFormat,
  toFormat: ImageFormat
): { isValid: boolean; error?: string } {
  // Validate dimensions
  if (options.width !== undefined || options.height !== undefined) {
    const width = options.width || 0
    const height = options.height || 0
    
    if (width < 0 || height < 0) {
      return {
        isValid: false,
        error: 'Dimensions cannot be negative.',
      }
    }
    
    const maxDim = MAX_DIMENSIONS[toFormat]
    if (width > maxDim.width || height > maxDim.height) {
      return {
        isValid: false,
        error: `Output dimensions (${width}x${height}) exceed maximum allowed for ${toFormat.toUpperCase()} format (${maxDim.width}x${maxDim.height}).`,
      }
    }
  }
  
  // Validate quality parameter
  if (options.quality !== undefined) {
    if (options.quality < 1 || options.quality > 100) {
      return {
        isValid: false,
        error: 'Quality must be between 1 and 100.',
      }
    }
  }
  
  // Validate DPI
  if (options.dpi !== undefined) {
    if (options.dpi < 72 || options.dpi > 2400) {
      return {
        isValid: false,
        error: 'DPI must be between 72 and 2400.',
      }
    }
  }
  
  // Format-specific parameter validation
  if (fromFormat === 'pdf' && options.page !== undefined) {
    if (options.page < 1) {
      return {
        isValid: false,
        error: 'Page number must be 1 or greater.',
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Check if a conversion is supported
 */
export function isConversionSupported(
  fromFormat: ImageFormat,
  toFormat: ImageFormat
): { supported: boolean; reason?: string } {
  // Same format "conversion" is not supported
  if (fromFormat === toFormat) {
    return {
      supported: false,
      reason: `Cannot convert ${fromFormat.toUpperCase()} to itself. Please choose a different output format.`,
    }
  }
  
  // Some conversions might not make sense
  const unsupportedConversions: Record<string, string> = {
    'ttf-to-mp4': 'Cannot convert font files to video format.',
    'mp4-to-ttf': 'Cannot convert video files to font format.',
    'html-to-ttf': 'Cannot convert HTML to font format.',
    'ttf-to-stl': 'Cannot convert font files to 3D model format.',
  }
  
  const key = `${fromFormat}-to-${toFormat}`
  if (unsupportedConversions[key]) {
    return {
      supported: false,
      reason: unsupportedConversions[key],
    }
  }
  
  return { supported: true }
}

/**
 * Validate HTML content for security and structure
 */
function validateHtmlContent(buffer: Buffer): FileValidationResult {
  const content = buffer.toString('utf8')
  
  // Check for basic HTML structure
  const hasHtmlTags = content.match(/<[^>]+>/g)
  if (!hasHtmlTags || hasHtmlTags.length === 0) {
    return {
      isValid: false,
      error: 'Invalid HTML file. The file must contain HTML markup.',
      format: 'html',
    }
  }
  
  // Check for dangerous patterns (while allowing legitimate HTML)
  const dangerousPatterns = [
    /<script[^>]*>[\s\S]*?alert\s*\(/i, // Alert in script
    /<script[^>]*>[\s\S]*?eval\s*\(/i,  // Eval in script
    /javascript:[\s\S]*?eval\s*\(/i,    // Eval in javascript: URL
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        error: 'HTML file contains potentially dangerous JavaScript. Please remove any alert() or eval() calls.',
        format: 'html',
      }
    }
  }
  
  // Check file size for HTML (should be reasonable)
  if (buffer.length > 10 * 1024 * 1024) { // 10MB
    return {
      isValid: false,
      error: 'HTML file is too large. Maximum size is 10MB.',
      format: 'html',
    }
  }
  
  return { isValid: true, format: 'html' }
}

/**
 * Validate TTF/OTF font file content
 */
function validateTtfContent(buffer: Buffer): FileValidationResult {
  // Minimum size for a valid font file
  if (buffer.length < 12) {
    return {
      isValid: false,
      error: 'Invalid font file. The file is too small to be a valid TTF/OTF font.',
      format: 'ttf',
    }
  }
  
  // Check TTF/OTF signature
  const signature = buffer.readUInt32BE(0)
  const validSignatures = [
    0x00010000, // TrueType
    0x74727565, // 'true' - TrueType
    0x4f54544f, // 'OTTO' - OpenType with CFF
    0x74746366, // 'ttcf' - TrueType Collection
  ]
  
  if (!validSignatures.includes(signature)) {
    return {
      isValid: false,
      error: 'Invalid font file format. The file must be a valid TrueType (TTF) or OpenType (OTF) font.',
      format: 'ttf',
    }
  }
  
  // Check table count (should be reasonable)
  try {
    const numTables = buffer.readUInt16BE(4)
    if (numTables === 0 || numTables > 100) {
      return {
        isValid: false,
        error: 'Invalid font file structure. The font table count is invalid.',
        format: 'ttf',
      }
    }
  } catch {
    return {
      isValid: false,
      error: 'Invalid font file. Unable to read font table information.',
      format: 'ttf',
    }
  }
  
  return { isValid: true, format: 'ttf' }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export function getOutputFilename(
  originalName: string,
  fromFormat: ImageFormat,
  toFormat: ImageFormat
): string {
  const baseName = originalName.replace(new RegExp(`\\.${fromFormat}$`, 'i'), '')
  const sanitized = sanitizeFilename(baseName)
  return `${sanitized}.${toFormat}`
}