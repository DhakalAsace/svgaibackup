/**
 * GIF.js Configuration for SVG to GIF Conversion
 * 
 * This module provides centralized configuration for gif.js library
 * including quality settings, worker configuration, and optimization parameters
 */

/**
 * GIF.js configuration interface
 */
export interface GifConfig {
  /** Number of web workers for parallel processing (default: 2) */
  workers: number
  /** Quality setting (1-30, lower is better, default: 10) */
  quality: number
  /** Worker script path */
  workerScript: string
  /** Enable transparency (default: true) */
  transparent?: boolean | string
  /** Background color for non-transparent GIFs */
  background?: string
  /** Dithering algorithm */
  dither?: false | 'FloydSteinberg' | 'FalseFloydSteinberg' | 'Stucki' | 'Atkinson'
  /** Debug mode */
  debug?: boolean
}

/**
 * Default GIF.js configuration
 */
export const defaultGifConfig: GifConfig = {
  workers: 2,
  quality: 10,
  workerScript: '/gif.worker.js',
  transparent: true,
  dither: false,
  debug: false
}

/**
 * Quality presets for different use cases
 */
export const qualityPresets = {
  /** High quality, larger file size */
  high: {
    quality: 1,
    workers: 4,
    dither: 'FloydSteinberg' as const
  },
  /** Balanced quality and file size */
  medium: {
    quality: 10,
    workers: 2,
    dither: false as const
  },
  /** Lower quality, smaller file size */
  low: {
    quality: 20,
    workers: 1,
    dither: false as const
  },
  /** Optimized for animations */
  animation: {
    quality: 5,
    workers: 4,
    dither: 'Atkinson' as const
  }
}

/**
 * Get optimal worker count based on available cores
 */
export function getOptimalWorkerCount(): number {
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    // Use half of available cores, max 4
    return Math.min(Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)), 4)
  }
  return 2 // Default fallback
}

/**
 * Get GIF configuration based on options
 */
export function getGifConfig(
  preset: keyof typeof qualityPresets = 'medium',
  customOptions?: Partial<GifConfig>
): GifConfig {
  const presetConfig = qualityPresets[preset] || qualityPresets.medium
  const optimalWorkers = getOptimalWorkerCount()
  
  return {
    ...defaultGifConfig,
    ...presetConfig,
    workers: Math.min(presetConfig.workers, optimalWorkers),
    ...customOptions
  }
}

/**
 * Calculate optimal frame settings based on animation duration
 */
export function calculateFrameSettings(
  duration: number,
  targetFileSize?: number
): { frameCount: number; frameDelay: number; quality: number } {
  // Base calculations
  const fps = targetFileSize ? 10 : 20 // Lower FPS for size constraints
  const frameCount = Math.max(1, Math.floor(duration * fps))
  const frameDelay = Math.floor(1000 / fps)
  
  // Adjust quality based on frame count and target size
  let quality = 10
  if (targetFileSize && frameCount > 30) {
    quality = 15 // Lower quality for many frames
  } else if (frameCount < 10) {
    quality = 5 // Higher quality for few frames
  }
  
  return {
    frameCount: Math.min(frameCount, 100), // Cap at 100 frames
    frameDelay,
    quality
  }
}

/**
 * Validate GIF.js worker availability
 */
export async function validateWorkerAvailability(workerScript: string): Promise<boolean> {
  try {
    const response = await fetch(workerScript, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.warn('GIF worker script not available:', error)
    return false
  }
}