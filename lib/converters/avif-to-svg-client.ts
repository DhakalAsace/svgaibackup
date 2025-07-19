/**
 * AVIF to SVG Client-side Converter
 * 
 * This client-side converter makes requests to our API endpoint
 * which uses CloudConvert for AVIF to PNG, then vectorizes to SVG.
 * 
 * CloudConvert API v2 workflow:
 * 1. Upload AVIF file to CloudConvert
 * 2. Convert AVIF → PNG (CloudConvert supports this)
 * 3. Vectorize PNG → SVG using server-side tools
 * 4. Return final SVG result
 */

import type { ConversionHandler, ConversionOptions, ConversionResult } from './types'
import { ConversionError } from './errors'

/**
 * Client-side AVIF to SVG converter that uses the API endpoint
 */
export const avifToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    console.log('[AVIF-to-SVG-Client] Starting AVIF to SVG conversion')
    
    // Convert input to Blob for FormData
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
    const blob = new Blob([inputBuffer], { type: 'image/avif' })
    
    // Create form data
    const formData = new FormData()
    formData.append('file', blob, 'image.avif')
    
    // Add conversion options
    if (options.width) formData.append('width', options.width.toString())
    if (options.height) formData.append('height', options.height.toString())
    if (options.preserveAspectRatio !== undefined) {
      formData.append('preserveAspectRatio', options.preserveAspectRatio.toString())
    }
    if (options.threshold !== undefined) {
      formData.append('threshold', options.threshold.toString())
    }
    
    console.log('[AVIF-to-SVG-Client] Uploading file to API endpoint')
    
    // Progress tracking
    const startTime = Date.now()
    
    // Simulate progress for better UX
    const progressInterval = simulateProgress(options.onProgress, startTime)
    
    try {
      // Make API request to our endpoint (which will use CloudConvert + vectorization)
      const response = await fetch('/api/convert/avif-to-svg', {
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
      console.log('[AVIF-to-SVG-Client] Response received:', {
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
          console.error('[AVIF-to-SVG-Client] Error parsing error response:', e)
        }
        
        throw new ConversionError(errorMessage, 'API_REQUEST_FAILED')
      }
      
      // Handle successful response
      let svgData: string
      
      // CloudConvert returns SVG directly
      if (contentType.includes('image/svg+xml') || contentType.includes('text/xml') || !contentType) {
        svgData = await response.text()
        console.log('[AVIF-to-SVG-Client] Received SVG data:', {
          length: svgData.length,
          preview: svgData.substring(0, 100)
        })
      } else if (contentType.includes('application/json')) {
        // Handle JSON response (legacy format)
        const jsonData = await response.json()
        if (jsonData.data) {
          svgData = jsonData.data
        } else if (jsonData.error) {
          throw new ConversionError(jsonData.error, 'CONVERSION_FAILED')
        } else {
          throw new ConversionError('Invalid response format', 'INVALID_RESPONSE')
        }
      } else {
        // Treat any other content as SVG
        svgData = await response.text()
        console.log('[AVIF-to-SVG-Client] Received data with content-type:', contentType)
      }
      
      // Validate SVG data
      if (!svgData || (!svgData.includes('<svg') && !svgData.includes('<?xml'))) {
        throw new ConversionError('Invalid SVG data received', 'INVALID_SVG_DATA')
      }
      
      const conversionTime = Date.now() - startTime
      console.log('[AVIF-to-SVG-Client] Conversion completed in', conversionTime, 'ms')
      
      // Report final progress
      if (options.onProgress) {
        options.onProgress(1.0)
      }
      
      return {
        success: true,
        data: svgData,
        mimeType: 'image/svg+xml',
        metadata: {
          format: 'svg',
          method: 'cloudconvert+vectorization',
          size: svgData.length,
          conversionTime,
          engine: 'cloudconvert-imagemagick+potrace', // Two-step process
          originalFormat: 'avif'
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
    console.error('[AVIF-to-SVG-Client] Conversion error:', error)
    
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
      `Failed to convert AVIF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'AVIF_TO_SVG_FAILED'
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
    if (elapsed < 3000) {
      // Upload phase (0-3s): 10-30%
      progress = 0.1 + (elapsed / 3000) * 0.2
    } else if (elapsed < 10000) {
      // CloudConvert AVIF→PNG phase (3-10s): 30-60%
      progress = 0.3 + ((elapsed - 3000) / 7000) * 0.3
    } else if (elapsed < 18000) {
      // Vectorization PNG→SVG phase (10-18s): 60-90%
      progress = 0.6 + ((elapsed - 10000) / 8000) * 0.3
    } else {
      // Long conversion: stay at 90%
      progress = 0.9
    }
    
    onProgress(Math.min(progress, 0.9))
  }, 250)
  
  return interval
}

/**
 * AVIF to SVG converter configuration for client-side use
 */
export const avifToSvgConverter = {
  name: 'AVIF to SVG',
  from: 'avif' as const,
  to: 'svg' as const,
  handler: avifToSvgHandler,
  isClientSide: true, // Client-side wrapper that calls API
  description: 'Convert AVIF images to SVG format using CloudConvert API + vectorization'
}

// Export handler directly for convenience
export default avifToSvgHandler