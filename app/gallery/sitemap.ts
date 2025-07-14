import { MetadataRoute } from 'next'
import { getAllGalleryThemes } from './gallery-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgai.org'
  
  // Get all gallery themes sorted by search volume
  const galleryThemes = getAllGalleryThemes()
    .sort((a, b) => b.searchVolume - a.searchVolume)
  
  // Generate gallery URLs with priority based on search volume
  const galleryUrls = galleryThemes.map(theme => {
    // Higher priority for higher search volume galleries
    let priority = 0.9
    if (theme.searchVolume >= 4000) priority = 1.0
    else if (theme.searchVolume >= 2000) priority = 0.9
    else if (theme.searchVolume >= 1000) priority = 0.8
    else if (theme.searchVolume >= 500) priority = 0.7
    else priority = 0.6
    
    return {
      url: `${baseUrl}/gallery/${theme.slug}`,
      lastModified: new Date(),
      changeFrequency: theme.searchVolume >= 2000 ? 'daily' as const : 'weekly' as const,
      priority
    }
  })
  
  // Add main gallery page
  const mainGalleryPage = {
    url: `${baseUrl}/gallery`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }
  
  return [mainGalleryPage, ...galleryUrls]
}