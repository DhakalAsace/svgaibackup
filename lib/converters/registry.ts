/**
 * Converter Registry
 * 
 * Central registry for all image format converters.
 * Provides dynamic converter lookup, registration, and metadata access.
 */

import type { Converter, ImageFormat } from './types'
import { pngToSvgConverter } from './png-to-svg'
import { epsToSvgConverter } from './eps-to-svg'
import { aiToSvgConverter } from './ai-to-svg'
import { svgToEpsConverter } from './svg-to-eps'
import { dxfToSvgConverter } from './dxf-to-svg'
import { svgToDxfConverter } from './svg-to-dxf'
import { stlToSvgConverter } from './stl-to-svg'
import { svgToStlConverter } from './svg-to-stl'

/**
 * Registry metadata for a converter
 */
export interface ConverterMetadata {
  name: string
  from: ImageFormat
  to: ImageFormat
  isClientSide: boolean
  description?: string
  supportedOptions?: string[]
}

/**
 * Registry entry combining converter and its metadata
 */
interface RegistryEntry {
  converter: Converter
  metadata: ConverterMetadata
}

/**
 * Converter registry class
 */
class ConverterRegistry {
  private converters: Map<string, RegistryEntry> = new Map()

  /**
   * Generates a unique key for converter lookup
   */
  private getKey(from: ImageFormat, to: ImageFormat): string {
    return `${from}-to-${to}`
  }

  /**
   * Registers a converter in the registry
   */
  register(converter: Converter): void {
    const key = this.getKey(converter.from, converter.to)
    
    const metadata: ConverterMetadata = {
      name: converter.name,
      from: converter.from,
      to: converter.to,
      isClientSide: converter.isClientSide,
      description: converter.description
    }

    this.converters.set(key, { converter, metadata })
  }

  /**
   * Gets a converter by source and target format
   */
  getConverter(from: ImageFormat, to: ImageFormat): Converter | undefined {
    const key = this.getKey(from, to)
    return this.converters.get(key)?.converter
  }

  /**
   * Gets converter metadata
   */
  getMetadata(from: ImageFormat, to: ImageFormat): ConverterMetadata | undefined {
    const key = this.getKey(from, to)
    return this.converters.get(key)?.metadata
  }

  /**
   * Checks if a conversion is supported
   */
  isSupported(from: ImageFormat, to: ImageFormat): boolean {
    const key = this.getKey(from, to)
    return this.converters.has(key)
  }

  /**
   * Lists all available conversions
   */
  listAvailableConversions(): Array<{ from: ImageFormat; to: ImageFormat }> {
    return Array.from(this.converters.values()).map(entry => ({
      from: entry.metadata.from,
      to: entry.metadata.to
    }))
  }

  /**
   * Lists all converters with full metadata
   */
  listConverters(): ConverterMetadata[] {
    return Array.from(this.converters.values()).map(entry => entry.metadata)
  }

  /**
   * Gets all converters that can convert from a specific format
   */
  getConvertersFrom(format: ImageFormat): ConverterMetadata[] {
    return Array.from(this.converters.values())
      .filter(entry => entry.metadata.from === format)
      .map(entry => entry.metadata)
  }

  /**
   * Gets all converters that can convert to a specific format
   */
  getConvertersTo(format: ImageFormat): ConverterMetadata[] {
    return Array.from(this.converters.values())
      .filter(entry => entry.metadata.to === format)
      .map(entry => entry.metadata)
  }

  /**
   * Gets all client-side converters
   */
  getClientSideConverters(): ConverterMetadata[] {
    return Array.from(this.converters.values())
      .filter(entry => entry.metadata.isClientSide)
      .map(entry => entry.metadata)
  }

  /**
   * Gets all server-side converters
   */
  getServerSideConverters(): ConverterMetadata[] {
    return Array.from(this.converters.values())
      .filter(entry => !entry.metadata.isClientSide)
      .map(entry => entry.metadata)
  }

  /**
   * Clears all registered converters
   */
  clear(): void {
    this.converters.clear()
  }

  /**
   * Gets the total number of registered converters
   */
  get size(): number {
    return this.converters.size
  }
}

// Create singleton registry instance
export const converterRegistry = new ConverterRegistry()

// Register all existing converters
converterRegistry.register(pngToSvgConverter)
converterRegistry.register(epsToSvgConverter)
converterRegistry.register(aiToSvgConverter)
converterRegistry.register(svgToEpsConverter)
converterRegistry.register(dxfToSvgConverter)
converterRegistry.register(svgToDxfConverter)
converterRegistry.register(stlToSvgConverter)
converterRegistry.register(svgToStlConverter)

// Export convenience functions
export function getConverter(from: ImageFormat, to: ImageFormat): Converter | undefined {
  return converterRegistry.getConverter(from, to)
}

export function isConversionSupported(from: ImageFormat, to: ImageFormat): boolean {
  return converterRegistry.isSupported(from, to)
}

export function listAvailableConversions(): Array<{ from: ImageFormat; to: ImageFormat }> {
  return converterRegistry.listAvailableConversions()
}

export function listConverters(): ConverterMetadata[] {
  return converterRegistry.listConverters()
}

export function getConverterMetadata(from: ImageFormat, to: ImageFormat): ConverterMetadata | undefined {
  return converterRegistry.getMetadata(from, to)
}

// Export type for external usage
export type { ConverterRegistry }