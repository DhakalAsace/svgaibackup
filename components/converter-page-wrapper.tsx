import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ConverterConfig } from '@/app/convert/converter-config'
import { PublicConverterConfig } from '@/app/convert/public-converter-config'
import { getConverterCacheHeaders } from '@/lib/converter-cache-strategy'
import ConverterPageTemplate from './converter-page-template'
import ConverterInterface from './converter-interface'

interface ConverterPageWrapperProps {
  config: ConverterConfig
}

/**
 * Server component wrapper that handles caching strategy
 * This component sets appropriate cache headers based on traffic
 */
export default async function ConverterPageWrapper({ config }: ConverterPageWrapperProps) {
  // Redirect SVG to video converters to the premium tool
  if (config.fromFormat === 'SVG' && ['MP4', 'WebM', 'GIF'].includes(config.toFormat)) {
    redirect('/tools/svg-to-video')
  }
  
  // Get request headers to check if this is a revalidation request
  const headersList = await headers()
  const isRevalidating = headersList.get('x-revalidating') === 'true'
  
  // Set cache headers based on converter traffic (internal use only)
  const cacheHeaders = getConverterCacheHeaders(config)
  
  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ConverterPageWrapper] ${config.urlSlug}:`, {
      searchVolume: config.searchVolume,
      priority: config.priority,
      cacheHeaders: (cacheHeaders as any)['Cache-Control'],
      isRevalidating
    })
  }
  
  // Convert to public config (remove searchVolume)
  const { searchVolume, ...publicConfig } = config
  
  // Note: In Next.js App Router, we can't directly set response headers
  // from server components. The caching is handled by the revalidate export
  // and fetch options. This wrapper is mainly for organization and logging.
  
  return (
    <ConverterPageTemplate
      title={config.metaTitle}
      description={config.metaDescription}
      keywords={config.keywords}
      converterConfig={config}
      converterType={{
        from: config.fromFormat.toLowerCase(),
        to: config.toFormat.toLowerCase(),
        fromFull: config.fromFormat,
        toFull: config.toFormat
      }}
      heroTitle={config.title}
      heroSubtitle={config.metaDescription}
      converterComponent={<ConverterInterface config={publicConfig as PublicConverterConfig} />}
    />
  )
}

/**
 * Helper function to determine if we should use static or dynamic rendering
 * High-traffic pages benefit from static rendering with ISR
 * Low-traffic pages might benefit from on-demand rendering
 */
export function shouldUseStaticRendering(config: ConverterConfig): boolean {
  // All converters use static rendering with ISR for now
  // This could be adjusted based on traffic patterns
  return true
}

/**
 * Get prefetch hints for high-traffic converters
 * These can be added to the page head for better performance
 */
export function getConverterPrefetchHints(config: ConverterConfig): string[] {
  const hints: string[] = []
  
  // High-traffic converters should prefetch critical resources
  if (config.searchVolume >= 10000) {
    hints.push('/api/convert') // Prefetch conversion API
    hints.push('/js/converter-worker.js') // Prefetch web worker if used
  }
  
  return hints
}