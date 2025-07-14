/**
 * Vercel-specific ISR configuration for dynamic revalidation
 * This uses Vercel's Edge Config or Environment Variables to control ISR
 */

import { getTrafficCategory } from './converter-traffic-groups'

// Environment variable names for ISR configuration
const ISR_ENV_KEYS = {
  HIGH_TRAFFIC: 'ISR_REVALIDATE_HIGH_TRAFFIC',
  MEDIUM_TRAFFIC: 'ISR_REVALIDATE_MEDIUM_TRAFFIC',
  LOW_TRAFFIC: 'ISR_REVALIDATE_LOW_TRAFFIC',
} as const

/**
 * Get ISR revalidation time from environment variables
 * This allows changing revalidation times without rebuilding
 */
export function getISRFromEnv(searchVolume: number): number {
  const category = getTrafficCategory(searchVolume)
  
  // Get from environment variables with fallbacks
  const envKey = category === 'high' 
    ? ISR_ENV_KEYS.HIGH_TRAFFIC
    : category === 'medium'
    ? ISR_ENV_KEYS.MEDIUM_TRAFFIC
    : ISR_ENV_KEYS.LOW_TRAFFIC
    
  const envValue = process.env[envKey]
  
  if (envValue) {
    const parsed = parseInt(envValue, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }
  
  // Fallback to default values
  return category === 'high' ? 900 : category === 'medium' ? 1800 : 3600
}

/**
 * Headers to instruct Vercel's Edge Network about caching
 * These work in conjunction with ISR
 */
export function getVercelCacheHeaders(searchVolume: number): Record<string, string> {
  const revalidate = getISRFromEnv(searchVolume)
  const category = getTrafficCategory(searchVolume)
  
  return {
    // Vercel-specific cache control
    'Cache-Control': `s-maxage=${revalidate}, stale-while-revalidate`,
    
    // Custom headers for monitoring
    'X-Vercel-Revalidate': revalidate.toString(),
    'X-Traffic-Category': category,
    
    // Helps with debugging
    'X-Cache-Generated': new Date().toISOString(),
  }
}

/**
 * Configuration for Vercel's Incremental Static Regeneration
 * Can be used with unstable_cache or in API routes
 */
export interface VercelISRConfig {
  revalidate: number
  tags: string[]
  headers: Record<string, string>
}

export function getVercelISRConfig(
  converterSlug: string,
  searchVolume: number
): VercelISRConfig {
  const category = getTrafficCategory(searchVolume)
  const revalidate = getISRFromEnv(searchVolume)
  
  return {
    revalidate,
    tags: [
      'converter',
      `converter-${category}`,
      `converter-${converterSlug}`,
    ],
    headers: getVercelCacheHeaders(searchVolume),
  }
}

/**
 * Script to update ISR times via Vercel API
 * This can be called from a monitoring system
 */
export async function updateVercelISRConfig(
  projectId: string,
  token: string,
  updates: {
    highTraffic?: number
    mediumTraffic?: number
    lowTraffic?: number
  }
) {
  const envUpdates: Array<{ key: string; value: string }> = []
  
  if (updates.highTraffic) {
    envUpdates.push({
      key: ISR_ENV_KEYS.HIGH_TRAFFIC,
      value: updates.highTraffic.toString(),
    })
  }
  
  if (updates.mediumTraffic) {
    envUpdates.push({
      key: ISR_ENV_KEYS.MEDIUM_TRAFFIC,
      value: updates.mediumTraffic.toString(),
    })
  }
  
  if (updates.lowTraffic) {
    envUpdates.push({
      key: ISR_ENV_KEYS.LOW_TRAFFIC,
      value: updates.lowTraffic.toString(),
    })
  }
  
  // Update environment variables via Vercel API
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/env`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(envUpdates),
    }
  )
  
  return response.json()
}