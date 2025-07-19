/**
 * SVG to GIF Client-side Converter
 * 
 * This client-side converter makes requests to our API endpoint
 * which uses CloudConvert for high-quality SVG to GIF conversion.
 * 
 * CloudConvert API v2 workflow:
 * 1. Upload SVG file to CloudConvert
 * 2. Create conversion task (SVG → GIF)
 * 3. Wait for task completion
 * 4. Export and download result
 */

import type { ConversionHandler, ConversionOptions, ConversionResult } from './types'
import { ConversionError } from './errors'

/**
 * Extended conversion options for SVG to GIF
 */
interface SvgToGifOptions extends ConversionOptions {
  /** DPI for rasterization (default: 150) */
  density?: number
  /** Whether to preserve transparency (default: true) */
  transparent?: boolean
  /** Number of colors in palette (2-256, default: 256) */
  colors?: number
  /** Dithering algorithm (default: false) */
  dither?: boolean
  /** Fit method for resizing */
  fit?: 'scale' | 'crop' | 'pad' | 'fill'
  /** Strip metadata (default: true) */
  strip?: boolean
}

/**
 * Client-side SVG to GIF converter that uses the API endpoint
 */
export const svgToGifHandler: ConversionHandler = async (
  input: Buffer | string,
  options: SvgToGifOptions = {}
): Promise<ConversionResult> => {
  try {
    console.log('[SVG-to-GIF-Client] Starting SVG to GIF conversion')
    
    // Convert input to Blob for FormData
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'utf-8') : input
    const blob = new Blob([inputBuffer], { type: 'image/svg+xml' })
    
    // Create form data
    const formData = new FormData()
    formData.append('file', blob, 'image.svg')
    
    // Add conversion options
    if (options.width) formData.append('width', options.width.toString())
    if (options.height) formData.append('height', options.height.toString())
    if (options.quality !== undefined) formData.append('quality', options.quality.toString())
    if (options.density !== undefined) formData.append('density', options.density.toString())
    if (options.colors !== undefined) formData.append('colors', options.colors.toString())
    if (options.fit !== undefined) formData.append('fit', options.fit)
    if (options.dither !== undefined) formData.append('dither', options.dither.toString())
    if (options.transparent !== undefined) formData.append('transparent', options.transparent.toString())
    if (options.strip !== undefined) formData.append('strip', options.strip.toString())
    if (options.preserveAspectRatio !== undefined) {
      formData.append('preserveAspectRatio', options.preserveAspectRatio.toString())
    }
    
    console.log('[SVG-to-GIF-Client] Uploading file to API endpoint')
    
    // Progress tracking
    const startTime = Date.now()
    
    // Simulate progress for better UX
    const progressInterval = simulateProgress(options.onProgress, startTime)
    
    try {
      // Make API request to our endpoint (which will use CloudConvert)
      const response = await fetch('/api/convert/svg-to-gif', {
        method: 'POST',
        body: formData,
        // Add timeout for large files
        signal: AbortSignal.timeout(300000) // 5 minute timeout
      })
      
      // Clear progress simulation
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      
      // Log response details
      const contentType = response.headers.get('content-type') || ''
      console.log('[SVG-to-GIF-Client] Response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        contentLength: response.headers.get('content-length')
      })
      
      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`
        
        try {
          // Try to get error details from response
          if (contentType.includes('application/json')) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || errorMessage
          } else {
            const errorText = await response.text()
            if (errorText && errorText.length < 1000) {
              errorMessage = errorText
            }
          }
        } catch (e) {
          console.error('[SVG-to-GIF-Client] Error parsing error response:', e)
        }
        
        throw new ConversionError(errorMessage, 'API_REQUEST_FAILED')
      }
      
      // Handle successful response
      let gifData: ArrayBuffer
      
      // CloudConvert returns binary GIF data
      if (contentType.includes('image/gif') || !contentType) {
        gifData = await response.arrayBuffer()
        console.log('[SVG-to-GIF-Client] Received GIF data:', {
          length: gifData.byteLength
        })
      } else if (contentType.includes('application/json')) {
        // Handle JSON response (legacy format)
        const jsonData = await response.json()
        if (jsonData.data) {
          // Assume base64 encoded data
          const base64Data = jsonData.data
          const binaryString = atob(base64Data)
          gifData = new ArrayBuffer(binaryString.length)
          const bytes = new Uint8Array(gifData)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
        } else if (jsonData.error) {
          throw new ConversionError(jsonData.error, 'CONVERSION_FAILED')
        } else {
          throw new ConversionError('Invalid response format', 'INVALID_RESPONSE')
        }
      } else {
        // Treat any other content as binary
        gifData = await response.arrayBuffer()
        console.log('[SVG-to-GIF-Client] Received data with content-type:', contentType)
      }
      
      // Validate GIF data
      if (!gifData || gifData.byteLength === 0) {
        throw new ConversionError('Invalid GIF data received', 'INVALID_GIF_DATA')
      }
      
      // Check for GIF signature
      const gifSignature = new Uint8Array(gifData.slice(0, 6))
      const isGif87a = Array.from(gifSignature).map(b => String.fromCharCode(b)).join('') === 'GIF87a'
      const isGif89a = Array.from(gifSignature).map(b => String.fromCharCode(b)).join('') === 'GIF89a'
      
      if (!isGif87a && !isGif89a) {
        throw new ConversionError('Received data is not a valid GIF file', 'INVALID_GIF_FORMAT')
      }
      
      const conversionTime = Date.now() - startTime
      console.log('[SVG-to-GIF-Client] Conversion completed in', conversionTime, 'ms')
      
      // Report final progress
      if (options.onProgress) {
        options.onProgress(1.0)
      }
      
      return {
        success: true,
        data: Buffer.from(gifData),
        mimeType: 'image/gif',
        metadata: {
          format: 'gif',
          method: 'cloudconvert',
          size: gifData.byteLength,
          conversionTime,
          engine: 'imagemagick', // CloudConvert uses ImageMagick for SVG to GIF
          originalFormat: 'svg',
          quality: options.quality || 85,
          density: options.density || 150,
          colors: options.colors || 256
        }
      }
      
    } catch (error) {
      // Clear progress simulation on error
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      throw error
    }
    
  } catch (error) {
    console.error('[SVG-to-GIF-Client] Conversion error:', error)
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ConversionError(
        'Conversion timed out. The file may be too large or complex.',
        'CONVERSION_TIMEOUT'
      )
    }
    
    if (error instanceof ConversionError) {
      throw error
    }
    
    throw new ConversionError(
      `Failed to convert SVG file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'SVG_TO_GIF_FAILED'
    )
  }
}

/**
 * Progress simulation for better UX
 * CloudConvert doesn't provide real-time progress, so we simulate it
 */
function simulateProgress(
  onProgress: ((progress: number) => void) | undefined,
  startTime: number
): NodeJS.Timeout | null {
  if (!onProgress) return null
  
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime
    let progress = 0.1
    
    // Simulate progress based on typical conversion times
    if (elapsed < 2000) {
      // Upload phase (0-2s): 10-30%
      progress = 0.1 + (elapsed / 2000) * 0.2
    } else if (elapsed < 8000) {
      // Processing phase (2-8s): 30-80%
      progress = 0.3 + ((elapsed - 2000) / 6000) * 0.5
    } else if (elapsed < 15000) {
      // Finalizing phase (8-15s): 80-90%
      progress = 0.8 + ((elapsed - 8000) / 7000) * 0.1
    } else {
      // Long conversion: stay at 90%
      progress = 0.9
    }
    
    onProgress(Math.min(progress, 0.9))
  }, 250)
  
  return interval
}

/**
 * SVG to GIF converter configuration for client-side use
 */
export const svgToGifConverter = {
  name: 'SVG to GIF',
  from: 'svg' as const,
  to: 'gif' as const,
  handler: svgToGifHandler,
  isClientSide: true, // Client-side wrapper that calls API
  description: 'Convert SVG images to GIF format using CloudConvert API'
}

// Export handler directly for convenience
export default svgToGifHandler