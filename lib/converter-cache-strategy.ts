import { unstable_cache } from 'next/cache'
import { getTrafficCategory } from './converter-traffic-groups'
import { ConverterConfig } from '@/app/convert/converter-config'

/**
 * Advanced caching strategy for converters with different revalidation times
 * Uses Next.js unstable_cache with tags for granular control
 */

// Cache keys for different traffic categories
export const CACHE_TAGS = {
  ALL_CONVERTERS: 'all-converters',
  HIGH_TRAFFIC: 'converters-high',
  MEDIUM_TRAFFIC: 'converters-medium',
  LOW_TRAFFIC: 'converters-low',
  converter: (slug: string) => `converter-${slug}`,
} as const

/**
 * Get revalidation time in seconds based on search volume
 */
export function getRevalidationTime(searchVolume: number): number {
  const category = getTrafficCategory(searchVolume)
  switch (category) {
    case 'high':
      return 900 // 15 minutes
    case 'medium':
      return 1800 // 30 minutes
    case 'low':
      return 3600 // 60 minutes
    default:
      return 1800 // Default to 30 minutes
  }
}

/**
 * Create a cached function with appropriate revalidation time
 */
export function createCachedConverterData<T>(
  converter: ConverterConfig,
  fetchFn: () => Promise<T>
) {
  const category = getTrafficCategory(converter.searchVolume)
  const revalidate = getRevalidationTime(converter.searchVolume)
  
  return unstable_cache(
    fetchFn,
    [`converter-data-${converter.urlSlug}`],
    {
      revalidate,
      tags: [
        CACHE_TAGS.ALL_CONVERTERS,
        CACHE_TAGS[category === 'high' ? 'HIGH_TRAFFIC' : category === 'medium' ? 'MEDIUM_TRAFFIC' : 'LOW_TRAFFIC'],
        CACHE_TAGS.converter(converter.urlSlug)
      ]
    }
  )
}

/**
 * Fetch with converter-specific revalidation
 */
export async function fetchWithConverterCache(
  url: string,
  converter: ConverterConfig,
  options?: RequestInit
): Promise<Response> {
  const revalidate = getRevalidationTime(converter.searchVolume)
  
  return fetch(url, {
    ...options,
    next: {
      revalidate,
      tags: [CACHE_TAGS.converter(converter.urlSlug)]
    }
  })
}

/**
 * Get cache headers for converter pages
 */
export function getConverterCacheHeaders(converter: ConverterConfig): HeadersInit {
  const revalidate = getRevalidationTime(converter.searchVolume)
  const category = getTrafficCategory(converter.searchVolume)
  
  return {
    'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`,
    'CDN-Cache-Control': `public, s-maxage=${revalidate}`,
    'Vercel-CDN-Cache-Control': `public, s-maxage=${revalidate}`,
    'X-Converter-Category': category,
    'X-Revalidate-Seconds': revalidate.toString(),
  }
}

/**
 * Batch revalidation helper for maintenance
 */
export async function revalidateConvertersByCategory(
  category: 'high' | 'medium' | 'low',
  revalidateFn: (tag: string) => Promise<void>
) {
  const tag = category === 'high' 
    ? CACHE_TAGS.HIGH_TRAFFIC 
    : category === 'medium' 
    ? CACHE_TAGS.MEDIUM_TRAFFIC 
    : CACHE_TAGS.LOW_TRAFFIC
    
  await revalidateFn(tag)
}

/**
 * Smart revalidation based on traffic patterns
 * Can be called from a cron job or monitoring system
 */
export async function smartRevalidation(
  converterSlug: string,
  metrics: {
    recentTraffic: number
    errorRate: number
    lastModified: Date
  },
  revalidateFn: (tag: string) => Promise<void>
) {
  // Force revalidation if error rate is high
  if (metrics.errorRate > 0.05) {
    await revalidateFn(CACHE_TAGS.converter(converterSlug))
    return { revalidated: true, reason: 'high_error_rate' }
  }
  
  // Force revalidation if traffic spike detected
  const expectedTraffic = 1000 // baseline
  if (metrics.recentTraffic > expectedTraffic * 2) {
    await revalidateFn(CACHE_TAGS.converter(converterSlug))
    return { revalidated: true, reason: 'traffic_spike' }
  }
  
  return { revalidated: false, reason: 'within_normal_parameters' }
}