/**
 * SVG to EMF Client-side Converter
 * 
 * This client-side converter makes requests to our API endpoint
 * which uses CloudConvert for high-quality SVG to EMF conversion.
 * 
 * CloudConvert API v2 workflow:
 * 1. Upload SVG file to CloudConvert
 * 2. Create conversion task (SVG → EMF)
 * 3. Wait for task completion
 * 4. Export and download result
 */
import type { ConversionHandler, ConversionOptions, ConversionResult } from './types'
import { ConversionError } from './errors'
/**
 * Client-side SVG to EMF converter that uses the API endpoint
 */
export const svgToEmfHandler: ConversionHandler = async (
  input: Buffer | string,
  options: ConversionOptions = {}
): Promise<ConversionResult> => {
  try {
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
    // Progress tracking
    const startTime = Date.now()
    // Simulate progress for better UX
    const progressInterval = simulateProgress(options.onProgress, startTime)
    try {
      // Make API request to our endpoint (which will use CloudConvert)
      const response = await fetch('/api/convert/svg-to-emf', {
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
      // Handle successful response - EMF is binary data
      const emfBuffer = await response.arrayBuffer()
      const emfData = Buffer.from(emfBuffer)
      // Validate EMF data (basic check)
      if (emfData.length < 88) { // EMF files have minimum header size
        throw new ConversionError('Invalid EMF data received - too small', 'INVALID_EMF_DATA')
      }
      const conversionTime = Date.now() - startTime
      // Report final progress
      if (options.onProgress) {
        options.onProgress(1.0)
      }
      return {
        success: true,
        data: emfData,
        mimeType: 'image/x-emf',
        metadata: {
          format: 'emf',
          method: 'cloudconvert',
          size: emfData.length,
          conversionTime,
          engine: 'inkscape', // CloudConvert uses Inkscape for SVG to EMF
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
      'SVG_TO_EMF_FAILED'
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
 * SVG to EMF converter configuration for client-side use
 */
export const svgToEmfConverter = {
  name: 'SVG to EMF',
  from: 'svg' as const,
  to: 'emf' as const,
  handler: svgToEmfHandler,
  isClientSide: true, // Client-side wrapper that calls API
  description: 'Convert SVG files to Windows Enhanced Metafile format using CloudConvert API'
}
// Export handler directly for convenience
export default svgToEmfHandler