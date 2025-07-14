import { ConverterConfig, converterConfigs } from '@/app/convert/converter-config'

/**
 * Categorize converters by traffic volume for ISR optimization
 * Based on search volume thresholds defined in isr-config.ts
 */

export type TrafficCategory = 'high' | 'medium' | 'low'

export interface ConverterTrafficGroup {
  category: TrafficCategory
  converters: ConverterConfig[]
  revalidate: number
}

/**
 * Get traffic category for a converter based on search volume
 */
export function getTrafficCategory(searchVolume: number): TrafficCategory {
  if (searchVolume >= 10000) return 'high'
  if (searchVolume >= 1000) return 'medium'
  return 'low'
}

/**
 * Group all converters by traffic category
 */
export function getConvertersByTrafficCategory(): Record<TrafficCategory, ConverterConfig[]> {
  const groups: Record<TrafficCategory, ConverterConfig[]> = {
    high: [],
    medium: [],
    low: []
  }

  converterConfigs
    .filter(config => config.routeType === 'convert')
    .forEach(converter => {
      const category = getTrafficCategory(converter.searchVolume)
      groups[category].push(converter)
    })

  return groups
}

/**
 * Get all converters for a specific traffic category
 */
export function getConvertersForCategory(category: TrafficCategory): ConverterConfig[] {
  const groups = getConvertersByTrafficCategory()
  return groups[category] || []
}

/**
 * Get traffic category for a specific converter slug
 */
export function getConverterTrafficCategory(slug: string): TrafficCategory | null {
  const converter = converterConfigs.find(c => c.urlSlug === slug)
  if (!converter) return null
  return getTrafficCategory(converter.searchVolume)
}

/**
 * Get revalidation time for a traffic category
 */
export function getRevalidateTimeForCategory(category: TrafficCategory): number {
  const revalidateTimes: Record<TrafficCategory, number> = {
    high: 900,    // 15 minutes
    medium: 1800, // 30 minutes
    low: 3600     // 60 minutes
  }
  return revalidateTimes[category]
}

/**
 * Get all converter slugs for static params generation by category
 */
export function getStaticParamsForCategory(category: TrafficCategory) {
  const converters = getConvertersForCategory(category)
  return converters.map(config => ({
    converter: config.urlSlug
  }))
}