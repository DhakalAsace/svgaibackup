/**
 * EMF to SVG Client-side Converter
 * 
 * This client-side converter makes requests to our API endpoint
 * which uses CloudConvert for high-quality EMF to SVG conversion.
 * 
 * CloudConvert API v2 workflow:
 * 1. Upload EMF file to CloudConvert
 * 2. Create conversion task (EMF → SVG)
 * 3. Wait for task completion
 * 4. Export and download result
 */

import type { ConversionHandler, ConversionOptions, ConversionResult } from './types'
import { ConversionError } from './errors'

/**
 * Client-side EMF to SVG converter that uses the API endpoint
 */
export const emfToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    console.log('[EMF-to-SVG-Client] Starting EMF to SVG conversion')
    
    // Convert input to Blob for FormData
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
    const blob = new Blob([inputBuffer], { type: 'application/emf' })
    
    // Create form data
    const formData = new FormData()
    formData.append('file', blob, 'image.emf')
    
    // Add conversion options
    if (options.width) formData.append('width', options.width.toString())
    if (options.height) formData.append('height', options.height.toString())
    if (options.preserveAspectRatio !== undefined) {
      formData.append('preserveAspectRatio', options.preserveAspectRatio.toString())
    }
    
    console.log('[EMF-to-SVG-Client] Uploading file to API endpoint')
    
    // Progress tracking
    const startTime = Date.now()
    
    // Simulate progress for better UX
    const progressInterval = simulateProgress(options.onProgress, startTime)
    
    try {
      // Make API request to our endpoint (which will use CloudConvert)
      const response = await fetch('/api/convert/emf-to-svg', {
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
      console.log('[EMF-to-SVG-Client] Response received:', {
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
          console.error('[EMF-to-SVG-Client] Error parsing error response:', e)
        }
        
        throw new ConversionError(errorMessage, 'API_REQUEST_FAILED')
      }
      
      // Handle successful response
      let svgData: string
      
      // CloudConvert returns SVG directly
      if (contentType.includes('image/svg+xml') || contentType.includes('text/xml') || !contentType) {
        svgData = await response.text()
        console.log('[EMF-to-SVG-Client] Received SVG data:', {
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
        console.log('[EMF-to-SVG-Client] Received data with content-type:', contentType)
      }
      
      // Validate SVG data
      if (!svgData || (!svgData.includes('<svg') && !svgData.includes('<?xml'))) {
        throw new ConversionError('Invalid SVG data received', 'INVALID_SVG_DATA')
      }
      
      const conversionTime = Date.now() - startTime
      console.log('[EMF-to-SVG-Client] Conversion completed in', conversionTime, 'ms')
      
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
          method: 'cloudconvert',
          size: svgData.length,
          conversionTime,
          engine: 'inkscape', // CloudConvert uses Inkscape for EMF to SVG
          originalFormat: 'emf'
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
    console.error('[EMF-to-SVG-Client] Conversion error:', error)
    
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
      `Failed to convert EMF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'EMF_TO_SVG_FAILED'
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
 * EMF to SVG converter configuration for client-side use
 */
export const emfToSvgConverter = {
  name: 'EMF to SVG',
  from: 'emf' as const,
  to: 'svg' as const,
  handler: emfToSvgHandler,
  isClientSide: true, // Client-side wrapper that calls API
  description: 'Convert EMF files to SVG format using CloudConvert API'
}

// Export handler directly for convenience
export default emfToSvgHandler