import { MetadataRoute } from 'next'
import { generateCompleteSitemap } from '@/lib/seo/dynamic-sitemap'

// Main sitemap that includes all pages dynamically
export default function sitemap(): MetadataRoute.Sitemap {
  // Generate complete sitemap with all routes
  // Note: Using svgai.org as the canonical domain
  return generateCompleteSitemap()
}