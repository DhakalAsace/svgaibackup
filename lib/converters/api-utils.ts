import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { createLogger } from '@/lib/logger'
import { createErrorResponse, badRequest, tooManyRequests, createSuccessResponse } from '@/lib/error-handler'
import { FileValidationResult, ConversionResult, ImageFormat, ConversionOptions } from './types'
import { validateFile, getOutputFilename, getMimeTypeFromFormat } from './validation'
import { converterConfig } from '@/lib/env-client'
import { z } from 'zod'

// Initialize logger
const logger = createLogger('converters:api-utils')

// Initialize Redis for rate limiting if available
let converterRateLimit: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  converterRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 conversions per minute
    analytics: true,
  })
}

// Request body schemas
const conversionRequestSchema = z.object({
  options: z.object({
    quality: z.number().min(1).max(100).optional(),
    width: z.number().min(1).max(4096).optional(),
    height: z.number().min(1).max(4096).optional(),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    format: z.string().optional(),
    preserveAspectRatio: z.boolean().optional(),
  }).optional(),
})

// Helper to get client identifier for rate limiting
function getClientIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : null
  const realIp = req.headers.get('x-real-ip')
  
  return ip || realIp || 'unknown_ip'
}

// Process file upload from request
export async function processFileUpload(
  req: NextRequest,
  allowedFormats?: string[]
): Promise<{ file: Buffer; filename: string; format: ImageFormat; validation: FileValidationResult } | { error: Response }> {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof File)) {
      return { error: badRequest('No file provided') }
    }

    // Read file into buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Validate file
    const validation = validateFile(buffer, { 
      allowedFormats: allowedFormats || converterConfig.allowedFormats,
      maxSize: converterConfig.maxFileSize 
    })
    
    if (!validation.isValid) {
      logger.warn('File validation failed', { error: validation.error })
      return { error: badRequest(validation.error || 'Invalid file') }
    }

    return {
      file: buffer,
      filename: file.name,
      format: validation.format!,
      validation
    }
  } catch (error) {
    logger.error('Error processing file upload', { error })
    return { error: badRequest('Failed to process file upload') }
  }
}

// Apply rate limiting to request
export async function applyRateLimit(
  req: NextRequest,
  identifier?: string
): Promise<{ success: boolean; error?: Response }> {
  if (!converterRateLimit) {
    // Rate limiting not configured, allow all requests
    return { success: true }
  }

  const clientId = identifier || getClientIdentifier(req)
  
  try {
    const { success, limit, reset, remaining } = await converterRateLimit.limit(clientId)
    
    if (!success) {
      logger.warn('Rate limit exceeded', { clientId, limit, remaining })
      const resetTime = new Date(reset).toISOString()
      return { 
        success: false, 
        error: tooManyRequests(`Rate limit exceeded. Try again after ${resetTime}`) 
      }
    }

    logger.debug('Rate limit check passed', { clientId, remaining })
    return { success: true }
  } catch (error) {
    logger.debug('Rate limit check failed (Redis unavailable), allowing request', { 
      clientId, 
      errorMessage: error instanceof Error ? error.message : 'Unknown error' 
    })
    // Allow request if rate limiting fails
    return { success: true }
  }
}

// Parse and validate conversion options from request
export async function parseConversionOptions(
  req: NextRequest
): Promise<{ options: ConversionOptions } | { error: Response }> {
  try {
    const body = await req.json()
    const result = conversionRequestSchema.safeParse(body)
    
    if (!result.success) {
      return { error: badRequest('Invalid request body') }
    }

    const options: any = result.data.options || {}
    // Convert format string to ImageFormat type if present
    if (options.format && typeof options.format === 'string') {
      options.format = options.format as ImageFormat
    }
    return { options: options as ConversionOptions }
  } catch (error) {
    // For multipart requests, options might be in form data
    try {
      const formData = await req.formData()
      const options: ConversionOptions = {}
      
      const quality = formData.get('quality')
      const width = formData.get('width')
      const height = formData.get('height')
      const background = formData.get('background')
      const preserveAspectRatio = formData.get('preserveAspectRatio')
      
      if (quality) options.quality = parseInt(quality.toString())
      if (width) options.width = parseInt(width.toString())
      if (height) options.height = parseInt(height.toString())
      if (background) options.background = background.toString()
      if (preserveAspectRatio) options.preserveAspectRatio = preserveAspectRatio === 'true'
      
      return { options }
    } catch {
      return { options: {} }
    }
  }
}

// Create response for conversion result
export function createConversionResponse(
  result: ConversionResult,
  filename: string,
  fromFormat: ImageFormat,
  toFormat: ImageFormat
): Response {
  if (!result.success || !result.data) {
    const { response, status } = createErrorResponse(
      result.error || 'Conversion failed',
      'Failed to convert file',
      422
    )
    return NextResponse.json(response, { status })
  }

  const outputFilename = getOutputFilename(filename, fromFormat, toFormat)
  const mimeType = result.mimeType || getMimeTypeFromFormat(toFormat)
  
  // Log what we're about to return
  logger.info('Creating conversion response', {
    converter: `${fromFormat}-to-${toFormat}`,
    mimeType,
    dataType: result.data instanceof Buffer ? 'Buffer' : 'string',
    dataLength: result.data instanceof Buffer ? result.data.length : result.data.length,
    outputFilename,
    dataPreview: result.data instanceof Buffer ? 'Binary data' : typeof result.data === 'string' ? result.data.substring(0, 100) : 'Non-string data'
  })
  
  // For binary data, return as blob
  if (result.data instanceof Buffer) {
    logger.info('Returning binary response', {
      converter: `${fromFormat}-to-${toFormat}`,
      size: result.data.length
    })
    return new NextResponse(result.data, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': result.data.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      }
    })
  }
  
  // For text data (like SVG), return as text
  logger.info('Returning text response', {
    converter: `${fromFormat}-to-${toFormat}`,
    size: Buffer.byteLength(result.data),
    preview: typeof result.data === 'string' ? result.data.substring(0, 100) : 'Non-string data'
  })
  return new NextResponse(result.data, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': Buffer.byteLength(result.data).toString(),
      'Cache-Control': 'public, max-age=3600',
    }
  })
}

// Stream large file response
export function streamFileResponse(
  data: Buffer | string,
  mimeType: string,
  filename: string
): Response {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data
  
  // Create readable stream
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(buffer)
      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
      'Transfer-Encoding': 'chunked',
    }
  })
}

// Handle CORS for converter endpoints
export function handleCors(origin: string | null): HeadersInit {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'https://svgai.org',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  const headers: HeadersInit = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

// Create OPTIONS response for CORS preflight
export function handleOptionsRequest(req: NextRequest): Response {
  const origin = req.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: handleCors(origin)
  })
}

// Log conversion metrics
export function logConversionMetrics(
  fromFormat: ImageFormat,
  toFormat: ImageFormat,
  success: boolean,
  duration: number,
  fileSize?: number
): void {
  logger.info('Conversion completed', {
    from: fromFormat,
    to: toFormat,
    success,
    duration,
    fileSize,
    converter: `${fromFormat}-to-${toFormat}`,
  })
}

// Validate conversion request
export async function validateConversionRequest(
  req: NextRequest,
  supportedFromFormat: ImageFormat,
  supportedToFormat: ImageFormat
): Promise<{ valid: boolean; error?: Response }> {
  // Check rate limit
  const rateLimitResult = await applyRateLimit(req)
  if (!rateLimitResult.success) {
    return { valid: false, error: rateLimitResult.error }
  }

  // Process file upload
  const uploadResult = await processFileUpload(req, [supportedFromFormat])
  if ('error' in uploadResult) {
    return { valid: false, error: uploadResult.error }
  }

  // Verify format matches expected
  if (uploadResult.format !== supportedFromFormat) {
    return { 
      valid: false, 
      error: badRequest(`Expected ${supportedFromFormat} file, got ${uploadResult.format}`) 
    }
  }

  return { valid: true }
}

// Create a standardized converter API handler
export function createConverterHandler(
  fromFormat: ImageFormat,
  toFormat: ImageFormat,
  converter: (input: Buffer | string, options: ConversionOptions) => Promise<ConversionResult>
) {
  return async function handler(req: NextRequest) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return handleOptionsRequest(req)
    }

    const startTime = Date.now()

    try {
      // Apply rate limiting
      const rateLimitResult = await applyRateLimit(req)
      if (!rateLimitResult.success) {
        return rateLimitResult.error!
      }

      // Process file upload
      // For AI converter, also allow PDF files since AI files are PDF-based
      const allowedFormats = fromFormat === 'ai' ? ['ai', 'pdf'] : [fromFormat]
      const uploadResult = await processFileUpload(req, allowedFormats)
      if ('error' in uploadResult) {
        return uploadResult.error
      }

      const { file, filename, format } = uploadResult

      // Verify format
      if (format !== fromFormat) {
        // Special case: AI files can come as PDF files
        if (fromFormat === 'ai' && format === 'pdf') {
          logger.info('PDF file uploaded to AI converter, will check if it is an AI file')
          // Allow it to proceed, the AI converter will validate it properly
        } else {
          return badRequest(`Expected ${fromFormat} file, got ${format}`)
        }
      }

      // Parse conversion options
      const optionsResult = await parseConversionOptions(req)
      const options = 'error' in optionsResult ? {} : optionsResult.options

      // Perform conversion
      const result = await converter(file, options)

      // Log metrics
      const duration = Date.now() - startTime
      logConversionMetrics(fromFormat, toFormat, result.success, duration, file.length)

      // Return response
      return createConversionResponse(result, filename, fromFormat, toFormat)
    } catch (error) {
      const duration = Date.now() - startTime
      logConversionMetrics(fromFormat, toFormat, false, duration)
      
      logger.error('Converter handler error', { error, converter: `${fromFormat}-to-${toFormat}` })
      const { response, status } = createErrorResponse(error, 'Conversion failed', 500)
      return NextResponse.json(response, { status })
    }
  }
}

// Export types for use in API routes
export type { ConversionResult, ConversionOptions, FileValidationResult }