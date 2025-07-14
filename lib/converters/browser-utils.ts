/**
 * Browser utility functions for converters
 * 
 * Provides feature detection and fallback strategies for browser compatibility
 */

/**
 * Detects if the browser supports WebP format
 */
export function isWebPSupported(): boolean {
  if (typeof window === 'undefined' || !window.document) {
    return false
  }
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  try {
    const dataUrl = canvas.toDataURL('image/webp')
    return dataUrl.indexOf('data:image/webp') === 0
  } catch {
    return false
  }
}

/**
 * Detects if Canvas API is available
 */
export function isCanvasSupported(): boolean {
  if (typeof window === 'undefined' || !window.document) {
    return false
  }
  
  const canvas = document.createElement('canvas')
  return !!(canvas.getContext && canvas.getContext('2d'))
}

/**
 * Detects if Image object can load WebP
 * This is an async check that actually tries to load a WebP image
 */
export async function canLoadWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    // 1x2 WebP image (base64)
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Gets browser name and version
 */
export function getBrowserInfo(): { name: string; version: string } {
  const ua = navigator.userAgent
  let match
  let browserName = 'Unknown'
  let version = 'Unknown'
  
  // Chrome
  if ((match = ua.match(/Chrome\/(\d+)/))) {
    browserName = 'Chrome'
    version = match[1]
  }
  // Firefox
  else if ((match = ua.match(/Firefox\/(\d+)/))) {
    browserName = 'Firefox'
    version = match[1]
  }
  // Safari
  else if ((match = ua.match(/Version\/(\d+).*Safari/))) {
    browserName = 'Safari'
    version = match[1]
  }
  // Edge
  else if ((match = ua.match(/Edg\/(\d+)/))) {
    browserName = 'Edge'
    version = match[1]
  }
  // IE
  else if ((match = ua.match(/MSIE (\d+)/)) || (match = ua.match(/Trident.*rv:(\d+)/))) {
    browserName = 'IE'
    version = match[1]
  }
  
  return { name: browserName, version }
}

/**
 * Checks if browser has minimum requirements for converters
 */
export function checkBrowserCompatibility(): {
  compatible: boolean
  issues: string[]
  warnings: string[]
} {
  const issues: string[] = []
  const warnings: string[] = []
  
  // Check Canvas support (required)
  if (!isCanvasSupported()) {
    issues.push('Canvas API is not supported. This browser cannot perform image conversions.')
  }
  
  // Check WebP support (warning only)
  if (!isWebPSupported()) {
    warnings.push('WebP format is not supported. WebP conversions will use PNG fallback.')
  }
  
  // Check for old browsers
  const browser = getBrowserInfo()
  
  // IE is not supported
  if (browser.name === 'IE') {
    issues.push('Internet Explorer is not supported. Please use a modern browser.')
  }
  
  // Safari WebP support (Safari 14+ supports WebP)
  if (browser.name === 'Safari' && parseInt(browser.version) < 14) {
    warnings.push('Your Safari version does not support WebP. Consider updating to Safari 14 or later.')
  }
  
  return {
    compatible: issues.length === 0,
    issues,
    warnings
  }
}

/**
 * Creates a fallback message for unsupported features
 */
export function createFallbackMessage(feature: string): string {
  const messages: Record<string, string> = {
    webp: 'WebP format is not supported in your browser. The converter will use PNG format as a fallback.',
    canvas: 'Your browser does not support the Canvas API required for image conversion. Please use a modern browser.',
    worker: 'Web Workers are not supported. Conversions may be slower.',
    wasm: 'WebAssembly is not supported. Some advanced features may be unavailable.'
  }
  
  return messages[feature] || `The feature "${feature}" is not supported in your browser.`
}