/**
 * AI to SVG Client-side Converter
 * 
 * This client-side converter makes requests to our API endpoint
 * which uses CloudConvert for high-quality AI to SVG conversion.
 * 
 * CloudConvert API v2 workflow:
 * 1. Upload file to CloudConvert
 * 2. Create conversion task (AI → SVG)
 * 3. Wait for task completion
 * 4. Export and download result
 */
import type { ConversionHandler, ConversionOptions, ConversionResult } from './types'
import { ConversionError } from './errors'
/**
 * Client-side AI to SVG converter that uses the API endpoint
 */
export const aiToSvgHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    // Convert input to Blob for FormData
    const inputBuffer = typeof input === 'string' ? Buffer.from(input, 'base64') : input
    const blob = new Blob([inputBuffer], { type: 'application/postscript' }) // AI files are PostScript-based
    // Create form data
    const formData = new FormData()
    formData.append('file', blob, 'design.ai')
    // Add conversion options
    if (options.width) formData.append('width', options.width.toString())
    if (options.height) formData.append('height', options.height.toString())
    if (options.preserveAspectRatio !== undefined) {
      formData.append('preserveAspectRatio', options.preserveAspectRatio.toString())
    }
    // Progress tracking
    const startTime = Date.now()
    let progressInterval: NodeJS.Timeout | null = null
    // Start progress simulation
    progressInterval = simulateProgress(options.onProgress, startTime)
    try {
      // Make API request to our endpoint (which will use CloudConvert)
      const response = await fetch('/api/convert/ai-to-svg', {
        method: 'POST',
        body: formData,
        // Add timeout for large files
        signal: AbortSignal.timeout(300000) // 5 minute timeout
      })
      // Log response details
      const contentType = response.headers.get('content-type') || ''
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
          // Ignore error parsing failures
        }
        throw new ConversionError(errorMessage, 'API_REQUEST_FAILED')
      }
      // Handle successful response
      let svgData: string
      // CloudConvert returns SVG directly
      if (contentType.includes('image/svg+xml') || contentType.includes('text/xml') || !contentType) {
        svgData = await response.text()
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
        }
      // Validate SVG data
      if (!svgData || (!svgData.includes('<svg') && !svgData.includes('<?xml'))) {
        throw new ConversionError('Invalid SVG data received', 'INVALID_SVG_DATA')
      }
      const conversionTime = Date.now() - startTime
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
          engine: 'inkscape' // CloudConvert uses Inkscape for AI to SVG
        }
      }
    } finally {
      // Clean up progress interval
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  } catch (error) {
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
      `Failed to convert AI file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'AI_TO_SVG_FAILED'
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
 * AI to SVG converter configuration for client-side use
 */
export const aiToSvgConverter = {
  name: 'AI to SVG',
  from: 'ai' as const,
  to: 'svg' as const,
  handler: aiToSvgHandler,
  isClientSide: true, // Client-side wrapper that calls API
  description: 'Convert Adobe Illustrator files to SVG format using CloudConvert API'
}
// Export handler directly for convenience
export default aiToSvgHandler