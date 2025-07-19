/**
 * SVG to WMF Client-side Converter
 * 
 * This client-side converter makes requests to our API endpoint
 * which uses CloudConvert for high-quality SVG to WMF conversion.
 * 
 * CloudConvert API v2 workflow:
 * 1. Upload SVG file to CloudConvert
 * 2. Create conversion task (SVG → WMF)
 * 3. Wait for task completion
 * 4. Export and download result
 */

import type { ConversionHandler, ConversionOptions, ConversionResult } from './types'
import { ConversionError } from './errors'

/**
 * Client-side SVG to WMF converter that uses the API endpoint
 */
export const svgToWmfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    console.log('[SVG-to-WMF-Client] Starting SVG to WMF conversion')
    
    // Convert input to Blob for FormData
    const svgContent = typeof input === 'string' ? input : input.toString('utf8')
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    
    // Create form data
    const formData = new FormData()
    formData.append('file', blob, 'image.svg')
    
    // Add conversion options
    if (options.width) formData.append('width', options.width.toString())
    if (options.height) formData.append('height', options.height.toString())
    if (options.preserveAspectRatio !== undefined) {
      formData.append('preserveAspectRatio', options.preserveAspectRatio.toString())
    }
    
    console.log('[SVG-to-WMF-Client] Uploading file to API endpoint')
    
    // Progress tracking
    const startTime = Date.now()
    
    // Simulate progress for better UX
    const progressInterval = simulateProgress(options.onProgress, startTime)
    
    try {
      // Make API request to our endpoint (which will use CloudConvert)
      const response = await fetch('/api/convert/svg-to-wmf', {
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
      console.log('[SVG-to-WMF-Client] Response received:', {
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
          console.error('[SVG-to-WMF-Client] Error parsing error response:', e)
        }
        
        throw new ConversionError(errorMessage, 'API_REQUEST_FAILED')
      }
      
      // Handle successful response - WMF is binary data
      const wmfBuffer = await response.arrayBuffer()
      const wmfData = Buffer.from(wmfBuffer)
      
      console.log('[SVG-to-WMF-Client] Received WMF data:', {
        length: wmfData.length,
        type: 'binary'
      })
      
      // Validate WMF data (basic check)
      if (wmfData.length < 18) { // WMF files have minimum header size
        throw new ConversionError('Invalid WMF data received - too small', 'INVALID_WMF_DATA')
      }
      
      const conversionTime = Date.now() - startTime
      console.log('[SVG-to-WMF-Client] Conversion completed in', conversionTime, 'ms')
      
      // Report final progress
      if (options.onProgress) {
        options.onProgress(1.0)
      }
      
      return {
        success: true,
        data: wmfData,
        mimeType: 'image/x-wmf',
        metadata: {
          format: 'wmf',
          method: 'cloudconvert',
          size: wmfData.length,
          conversionTime,
          engine: 'inkscape', // CloudConvert uses Inkscape for SVG to WMF
          originalFormat: 'svg'
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
    console.error('[SVG-to-WMF-Client] Conversion error:', error)
    
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
      'SVG_TO_WMF_FAILED'
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
 * SVG to WMF converter configuration for client-side use
 */
export const svgToWmfConverter = {
  name: 'SVG to WMF',
  from: 'svg' as const,
  to: 'wmf' as const,
  handler: svgToWmfHandler,
  isClientSide: true, // Client-side wrapper that calls API
  description: 'Convert SVG files to Windows Metafile format using CloudConvert API'
}

// Export handler directly for convenience
export default svgToWmfHandler