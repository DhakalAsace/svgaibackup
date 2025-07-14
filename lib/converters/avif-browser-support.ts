/**
 * AVIF Browser Support Detection
 * 
 * Utilities to detect AVIF format support in the current browser
 * for both reading (decoding) and writing (encoding) operations.
 */

/**
 * Cache for AVIF support detection results
 */
let cachedDecodeSupport: boolean | null = null
let cachedEncodeSupport: boolean | null = null

/**
 * Detects if the browser supports AVIF decoding (reading AVIF files)
 */
export async function detectAvifDecodeSupport(): Promise<boolean> {
  // Return cached result if available
  if (cachedDecodeSupport !== null) {
    return cachedDecodeSupport
  }

  try {
    // Method 1: Use Image.decode() API if available
    if ('decode' in HTMLImageElement.prototype) {
      const img = new Image()
      
      // Minimal AVIF data URL (1x1 pixel)
      const avifDataUrl = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
      
      img.src = avifDataUrl
      
      try {
        await img.decode()
        cachedDecodeSupport = true
        return true
      } catch (error) {
        // Decoding failed, AVIF not supported
        cachedDecodeSupport = false
        return false
      }
    }

    // Method 2: Use Canvas.toBlob() detection as fallback
    return new Promise<boolean>((resolve) => {
      const img = new Image()
      
      img.onload = () => {
        cachedDecodeSupport = true
        resolve(true)
      }
      
      img.onerror = () => {
        cachedDecodeSupport = false
        resolve(false)
      }
      
      // Set timeout to avoid hanging
      setTimeout(() => {
        cachedDecodeSupport = false
        resolve(false)
      }, 3000)
      
      // Minimal AVIF data URL
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })

  } catch (error) {
    cachedDecodeSupport = false
    return false
  }
}

/**
 * Detects if the browser supports AVIF encoding (creating AVIF files)
 */
export async function detectAvifEncodeSupport(): Promise<boolean> {
  // Return cached result if available
  if (cachedEncodeSupport !== null) {
    return cachedEncodeSupport
  }

  try {
    // Check if Canvas.toBlob supports AVIF
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      cachedEncodeSupport = false
      return false
    }

    // Draw a simple pixel
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(0, 0, 1, 1)

    return new Promise<boolean>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size > 0) {
            cachedEncodeSupport = true
            resolve(true)
          } else {
            cachedEncodeSupport = false
            resolve(false)
          }
        },
        'image/avif',
        0.9
      )

      // Set timeout to avoid hanging
      setTimeout(() => {
        cachedEncodeSupport = false
        resolve(false)
      }, 3000)
    })

  } catch (error) {
    cachedEncodeSupport = false
    return false
  }
}

/**
 * Gets comprehensive AVIF support information
 */
export async function getAvifSupportInfo(): Promise<{
  canDecode: boolean
  canEncode: boolean
  fullSupport: boolean
  browserInfo: {
    userAgent: string
    isChrome: boolean
    isSafari: boolean
    isFirefox: boolean
    isEdge: boolean
  }
}> {
  const [canDecode, canEncode] = await Promise.all([
    detectAvifDecodeSupport(),
    detectAvifEncodeSupport()
  ])

  const userAgent = navigator.userAgent
  const isChrome = /Chrome|Chromium/i.test(userAgent) && !/Edge/i.test(userAgent)
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)
  const isFirefox = /Firefox/i.test(userAgent)
  const isEdge = /Edge|Edg/i.test(userAgent)

  return {
    canDecode,
    canEncode,
    fullSupport: canDecode && canEncode,
    browserInfo: {
      userAgent,
      isChrome,
      isSafari,
      isFirefox,
      isEdge
    }
  }
}

/**
 * Clears the cached support detection results
 * Useful for testing or when browser capabilities might change
 */
export function clearAvifSupportCache(): void {
  cachedDecodeSupport = null
  cachedEncodeSupport = null
}

/**
 * Gets user-friendly message about AVIF support status
 */
export async function getAvifSupportMessage(): Promise<{
  status: 'full' | 'decode-only' | 'none'
  message: string
  recommendation: string
}> {
  const support = await getAvifSupportInfo()

  if (support.fullSupport) {
    return {
      status: 'full',
      message: 'Your browser fully supports AVIF format for both reading and creating files.',
      recommendation: 'All AVIF conversion features are available.'
    }
  } else if (support.canDecode) {
    return {
      status: 'decode-only',
      message: 'Your browser can read AVIF files but cannot create them.',
      recommendation: 'AVIF to SVG conversion is available, but SVG to AVIF is not supported.'
    }
  } else {
    const browserAdvice = support.browserInfo.isChrome 
      ? 'Make sure you\'re using Chrome 85+ or enable experimental features.'
      : support.browserInfo.isSafari
      ? 'Safari has limited AVIF support. Consider using Chrome or Firefox.'
      : support.browserInfo.isFirefox
      ? 'Firefox requires version 93+ for AVIF support.'
      : 'Try using a modern browser like Chrome, Firefox, or Edge.'

    return {
      status: 'none',
      message: 'Your browser does not support AVIF format.',
      recommendation: `AVIF conversion is not available. ${browserAdvice}`
    }
  }
}