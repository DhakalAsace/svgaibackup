/**
 * SVG Optimizer Implementation
 * 
 * This module provides SVG optimization using the SVGO library.
 * It reduces file size while maintaining visual quality by removing
 * unnecessary elements, optimizing paths, and cleaning up attributes.
 */

import { LazyLoadedConverter } from './base-converter'
import type { 
  ConversionOptions, 
  ConversionResult,
  ImageFormat 
} from './types'
import { 
  ConversionError, 
  FileValidationError,
  UnsupportedFormatError 
} from './errors'
import { detectFileTypeFromBuffer } from './validation'

/**
 * Extended optimization options
 */
interface SvgOptimizerOptions extends ConversionOptions {
  /** Optimization level (0-3, default: 2) */
  level?: 0 | 1 | 2 | 3
  /** Prettify output (default: false) */
  pretty?: boolean
  /** Number of decimal places for numbers (default: 3) */
  precision?: number
  /** Remove viewBox attribute (default: false) */
  removeViewBox?: boolean
  /** Remove hidden elements (default: true) */
  removeHiddenElems?: boolean
  /** Remove empty attributes (default: true) */
  removeEmptyAttrs?: boolean
  /** Convert colors to shorter form (default: true) */
  convertColors?: boolean
  /** Merge paths (default: true) */
  mergePaths?: boolean
  /** Remove comments (default: true) */
  removeComments?: boolean
  /** Remove metadata (default: true) */
  removeMetadata?: boolean
  /** Remove title (default: false) */
  removeTitle?: boolean
  /** Remove desc (default: false) */
  removeDesc?: boolean
  /** Custom SVGO plugins */
  customPlugins?: any[]
}

/**
 * SVG Optimizer using SVGO (works in browser)
 */
class SvgOptimizer extends LazyLoadedConverter {
  name = 'SVG Optimizer'
  from: ImageFormat = 'svg'
  to: ImageFormat = 'svg'
  description = 'Optimize SVG files to reduce size while maintaining quality using advanced compression techniques'
  isClientSide = true // Works in browser!
  
  private svgo: any = null

  /**
   * Load the SVGO library
   */
  protected async loadLibraries(): Promise<void> {
    const svgoModule = await import('svgo')
    this.svgo = svgoModule
  }

  /**
   * Perform the optimization with loaded libraries
   */
  protected async performConversionWithLibraries(
    input: Buffer,
    options: SvgOptimizerOptions
  ): Promise<ConversionResult> {
    try {
      const svgString = this.validateSvgInput(input)
      const originalSize = Buffer.byteLength(svgString, 'utf8')
      
      // Report initial progress
      this.reportProgress(options, 0.2)
      
      // Get SVGO configuration
      const config = this.getSvgoConfig(options)
      
      // Report progress before optimization
      this.reportProgress(options, 0.5)
      
      // Optimize SVG
      const result = this.svgo.optimize(svgString, config)
      
      if ('error' in result) {
        throw new ConversionError(
          `SVG optimization failed: ${result.error}`,
          'OPTIMIZATION_FAILED'
        )
      }
      
      // Report progress after optimization
      this.reportProgress(options, 0.8)
      
      const optimizedSvg = result.data
      const optimizedSize = Buffer.byteLength(optimizedSvg, 'utf8')
      const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2)
      
      return this.createSuccessResult(
        optimizedSvg,
        'image/svg+xml',
        {
          originalSize,
          compressionRatio: parseFloat(compressionRatio),
          saved: originalSize - optimizedSize,
          savedPercentage: parseFloat(compressionRatio)
        }
      )
      
    } catch (error) {
      if (error instanceof FileValidationError || 
          error instanceof UnsupportedFormatError ||
          error instanceof ConversionError) {
        throw error
      }
      
      if (error instanceof Error) {
        throw new ConversionError(
          `SVG optimization failed: ${error.message}`,
          'SVG_OPTIMIZATION_FAILED'
        )
      }
      
      throw new ConversionError(
        'An unexpected error occurred during SVG optimization',
        'SVG_OPTIMIZATION_UNKNOWN_ERROR'
      )
    }
  }

  /**
   * Validates that the input is an SVG
   */
  private validateSvgInput(input: Buffer | string): string {
    if (typeof input === 'string') {
      const trimmed = input.trim()
      if (!trimmed.includes('<svg') && !trimmed.includes('<?xml')) {
        throw new FileValidationError('Invalid SVG: Missing SVG tag')
      }
      return trimmed
    }
    
    const format = detectFileTypeFromBuffer(input)
    
    if (format !== 'svg') {
      throw new UnsupportedFormatError(
        format || 'unknown',
        ['svg'],
        `Expected SVG format but received ${format || 'unknown format'}`
      )
    }
    
    return input.toString('utf8')
  }

  /**
   * Get SVGO configuration based on optimization level
   */
  private getSvgoConfig(options: SvgOptimizerOptions): any {
    const level = options.level ?? 2
    const precision = options.precision ?? 3
    
    // Base configuration
    const baseConfig: any = {
      multipass: true,
      js2svg: {
        pretty: options.pretty ?? false,
        indent: 2
      }
    }
    
    // Level 0: Minimal optimization (safe mode)
    if (level === 0) {
      return {
        ...baseConfig,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                removeEmptyAttrs: false,
                removeHiddenElems: false,
                removeTitle: false,
                removeDesc: false,
                removeMetadata: true,
                removeComments: true,
                cleanupNumericValues: {
                  floatPrecision: precision
                }
              }
            }
          }
        ]
      }
    }
    
    // Level 1: Conservative optimization
    if (level === 1) {
      return {
        ...baseConfig,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                removeTitle: false,
                removeDesc: false,
                cleanupNumericValues: {
                  floatPrecision: precision
                },
                convertPathData: {
                  floatPrecision: precision
                }
              }
            }
          }
        ]
      }
    }
    
    // Level 3: Aggressive optimization
    if (level === 3) {
      return {
        ...baseConfig,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: options.removeViewBox ?? false,
                removeTitle: options.removeTitle ?? true,
                removeDesc: options.removeDesc ?? true,
                cleanupNumericValues: {
                  floatPrecision: Math.max(1, precision - 1)
                },
                convertPathData: {
                  floatPrecision: Math.max(1, precision - 1),
                  transformPrecision: Math.max(1, precision - 1)
                }
              }
            }
          },
          'removeXMLNS',
          'sortAttrs',
          'removeOffCanvasPaths',
          ...(options.customPlugins || [])
        ]
      }
    }
    
    // Level 2: Default balanced optimization
    return {
      ...baseConfig,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: options.removeViewBox ?? false,
              removeHiddenElems: options.removeHiddenElems ?? true,
              removeEmptyAttrs: options.removeEmptyAttrs ?? true,
              removeComments: options.removeComments ?? true,
              removeMetadata: options.removeMetadata ?? true,
              removeTitle: options.removeTitle ?? false,
              removeDesc: options.removeDesc ?? false,
              convertColors: options.convertColors ?? true,
              mergePaths: options.mergePaths ?? true,
              cleanupNumericValues: {
                floatPrecision: precision
              },
              convertPathData: {
                floatPrecision: precision
              }
            }
          }
        },
        ...(options.customPlugins || [])
      ]
    }
  }
}

// Create and export the optimizer instance
export const svgOptimizer = new SvgOptimizer()

// Export the handler for direct use
export const svgOptimizerHandler = svgOptimizer.handler

// Keep the existing converter configuration for backward compatibility
export const svgOptimizerConverter = {
  name: 'SVG Optimizer',
  from: 'svg' as ImageFormat,
  to: 'svg' as ImageFormat,
  handler: svgOptimizerHandler,
  isClientSide: true,
  description: 'Optimize SVG files to reduce size while maintaining quality using advanced compression techniques'
}

/**
 * Client-side SVG optimization wrapper
 */
export async function optimizeSvgClient(
  input: File | string,
  options: SvgOptimizerOptions = {}
): Promise<ConversionResult> {
  if (input instanceof File) {
    const text = await input.text()
    return svgOptimizerHandler(text, options)
  }
  
  return svgOptimizerHandler(input, options)
}

/**
 * Server-side SVG optimization wrapper
 */
export async function optimizeSvgServer(
  input: Buffer | string,
  options: SvgOptimizerOptions = {}
): Promise<ConversionResult> {
  return svgOptimizerHandler(input, options)
}

/**
 * Get optimization statistics
 */
export function getOptimizationStats(result: ConversionResult): {
  originalSize?: number
  optimizedSize?: number
  saved?: number
  savedPercentage?: number
} {
  if (!result.metadata) return {}
  
  const metadata = result.metadata as any
  const originalSize = metadata.originalSize
  const optimizedSize = metadata.size
  
  if (!originalSize || !optimizedSize) return { originalSize, optimizedSize }
  
  const saved = originalSize - optimizedSize
  const savedPercentage = (saved / originalSize) * 100
  
  return {
    originalSize,
    optimizedSize,
    saved,
    savedPercentage
  }
}