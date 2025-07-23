/**
 * Revalidation Manager for ISR (Incremental Static Regeneration)
 * Provides dynamic revalidation logic based on converter traffic
 */
import { revalidatePath, revalidateTag } from 'next/cache'
import { getConverterBySlug } from '@/app/convert/converter-config'
import { getISRConfigBySearchVolume } from './isr-config'
export interface RevalidationConfig {
  path: string
  searchVolume: number
  revalidateSeconds: number
  priority: 'high' | 'medium' | 'low'
  lastRevalidated?: Date
}
// In-memory cache for revalidation configs (in production, use Redis or similar)
const revalidationCache = new Map<string, RevalidationConfig>()
/**
 * Get revalidation config for a converter
 */
export function getRevalidationConfig(converterSlug: string): RevalidationConfig | null {
  const converter = getConverterBySlug(converterSlug)
  if (!converter) return null
  const isrConfig = getISRConfigBySearchVolume(converter.searchVolume)
  return {
    path: `/convert/${converterSlug}`,
    searchVolume: converter.searchVolume,
    revalidateSeconds: isrConfig.revalidate,
    priority: isrConfig.priority,
  }
}
/**
 * Schedule revalidation for high-traffic pages
 * This would be called by a cron job or external service
 */
export async function scheduleRevalidation() {
  const highTrafficConverters = [
    'png-to-svg',    // 40,500 searches
    'svg-to-png',    // 33,100 searches
    'svg-converter', // 33,100 searches
    'jpg-to-svg',    // 12,100 searches
  ]
  for (const slug of highTrafficConverters) {
    const config = getRevalidationConfig(slug)
    if (!config) continue
    // Check if it's time to revalidate
    const cached = revalidationCache.get(slug)
    const now = new Date()
    if (!cached || !cached.lastRevalidated || 
        (now.getTime() - cached.lastRevalidated.getTime()) / 1000 > config.revalidateSeconds) {
      // Trigger revalidation
      await revalidatePath(config.path)
      // Update cache
      revalidationCache.set(slug, {
        ...config,
        lastRevalidated: now,
      })
      }
  }
}
/**
 * On-demand revalidation for specific converter
 * Can be triggered by webhooks or admin actions
 */
export async function revalidateConverter(converterSlug: string) {
  const config = getRevalidationConfig(converterSlug)
  if (!config) return false
  try {
    await revalidatePath(config.path)
    revalidationCache.set(converterSlug, {
      ...config,
      lastRevalidated: new Date(),
    })
    return true
  } catch (error) {
    return false
  }
}
/**
 * Batch revalidation by priority
 */
export async function revalidateByPriority(priority: 'high' | 'medium' | 'low') {
  const { converterConfigs } = await import('@/app/convert/converter-config')
  const convertersToRevalidate = converterConfigs.filter(config => {
    const isrConfig = getISRConfigBySearchVolume(config.searchVolume)
    return isrConfig.priority === priority
  })
  const results = await Promise.allSettled(
    convertersToRevalidate.map(config => revalidateConverter(config.urlSlug))
  )
  const successful = results.filter(r => r.status === 'fulfilled' && r.value).length
  return {
    total: convertersToRevalidate.length,
    successful,
    failed: convertersToRevalidate.length - successful,
  }
}
/**
 * Get revalidation schedule for monitoring
 */
export function getRevalidationSchedule() {
  const { converterConfigs } = require('@/app/convert/converter-config')
  return converterConfigs.map((config: any) => {
    const isrConfig = getISRConfigBySearchVolume(config.searchVolume)
    const cached = revalidationCache.get(config.urlSlug)
    return {
      converter: config.urlSlug,
      searchVolume: config.searchVolume,
      priority: isrConfig.priority,
      revalidateEvery: `${isrConfig.revalidate}s (${Math.round(isrConfig.revalidate / 60)}min)`,
      lastRevalidated: cached?.lastRevalidated || null,
      nextRevalidation: cached?.lastRevalidated 
        ? new Date(cached.lastRevalidated.getTime() + isrConfig.revalidate * 1000)
        : null,
    }
  }).sort((a: any, b: any) => b.searchVolume - a.searchVolume)
}