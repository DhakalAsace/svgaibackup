/**
 * Fallback implementation for SVG to Video AI conversion
 * Used when FAL API key is not configured or for demo purposes
 */

// Demo video data (base64 encoded small MP4)
const DEMO_VIDEO_BASE64 = 'AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAABwxtZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAXGWIhABp//73Qi0vLMuf/m7QoavTvL/wxbH9J+lzetvvjewtGBgaWTH7HWqfADjOABPHWD8pADXkCEbzH/p7/73S6rXNe8R5AkIAABhAG/lgRQGQAAADAAADAAcg8WANH9AAAC7G4Fh22IbZW7I5Oq3ZiA5pqW7I5Oq3bHJ0cNMxcQ=='

/**
 * Creates a demo video blob as fallback
 * @param format - Output format (mp4 or gif)
 * @returns Blob containing demo video
 */
export function createDemoVideoBlob(format: 'mp4' | 'gif'): Blob {
  if (format === 'mp4') {
    // Convert base64 to binary
    const binaryString = atob(DEMO_VIDEO_BASE64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new Blob([bytes], { type: 'video/mp4' })
  }
  
  // For GIF, return a simple animated GIF
  // This is a 1x1 transparent GIF with 2 frames
  const gifBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw=='
  const gifBinary = atob(gifBase64)
  const gifBytes = new Uint8Array(gifBinary.length)
  for (let i = 0; i < gifBinary.length; i++) {
    gifBytes[i] = gifBinary.charCodeAt(i)
  }
  return new Blob([gifBytes], { type: 'image/gif' })
}

/**
 * Generates a demo video response message
 */
export function getDemoMessage(): string {
  return 'This is a demo video. To generate real AI-powered videos, please ensure the FAL_API_KEY environment variable is configured.'
}