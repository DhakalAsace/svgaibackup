import { MetadataRoute } from 'next'
import { converterConfigs } from '@/app/convert/converter-config'
import { getAllGalleryThemes } from '@/app/gallery/gallery-config'
import { getAllMdxFiles } from '@/lib/mdx'

interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// Generate sitemap for converters based on search volume
export function generateConverterSitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date()

  return converterConfigs
    .filter(config => config.isSupported)
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .map((converter): SitemapEntry => {
      // Higher search volume = higher priority and more frequent updates
      const priority = converter.searchVolume > 10000 ? 0.9 
        : converter.searchVolume > 5000 ? 0.8 
        : converter.searchVolume > 1000 ? 0.7 
        : 0.6

      const changeFrequency = converter.searchVolume > 10000 ? 'daily' 
        : converter.searchVolume > 5000 ? 'weekly' 
        : 'monthly'

      return {
        url: `${baseUrl}/convert/${converter.urlSlug}`,
        lastModified: currentDate,
        changeFrequency: changeFrequency as any,
        priority,
      }
    })
}

// Generate sitemap for gallery themes
export function generateGallerySitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date()
  const themes = getAllGalleryThemes()

  return themes
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .map((theme): SitemapEntry => {
      const priority = theme.searchVolume > 5000 ? 0.8 
        : theme.searchVolume > 2000 ? 0.7 
        : 0.6

      const changeFrequency = theme.searchVolume > 5000 ? 'weekly' 
        : 'monthly'

      return {
        url: `${baseUrl}/gallery/${theme.slug}`,
        lastModified: currentDate,
        changeFrequency: changeFrequency as any,
        priority,
      }
    })
}

// Generate sitemap for learn articles
export function generateLearnSitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date()
  const articles = getAllMdxFiles('learn')

  // Map of slugs to search volumes
  const searchVolumeMap: Record<string, number> = {
    'what-is-svg': 33100,
    'svg-file': 14800,
    'svg-file-format': 9900,
    'how-to-open-svg-files': 4900,
    'svg-vs-png': 2100,
    'svg-animation-guide': 1800,
    'convert-png-to-svg': 40500,
    'svg-browser-support': 1300,
    'svg-for-web': 880,
    'svg-optimization': 720,
  }

  return articles
    .map((article): SitemapEntry => {
      const searchVolume = searchVolumeMap[article.slug] || 500
      
      const priority = searchVolume > 10000 ? 0.8 
        : searchVolume > 5000 ? 0.7 
        : 0.6

      const changeFrequency = searchVolume > 10000 ? 'weekly' 
        : 'monthly'

      return {
        url: `${baseUrl}/learn/${article.slug}`,
        lastModified: new Date(article.metadata.date || currentDate),
        changeFrequency: changeFrequency as any,
        priority,
      }
    })
    .sort((a, b) => b.priority - a.priority)
}

// Generate sitemap for tools
export function generateToolsSitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date()

  const tools = [
    { slug: 'svg-editor', priority: 0.8, changeFrequency: 'weekly' },
    { slug: 'svg-optimizer', priority: 0.8, changeFrequency: 'weekly' },
    { slug: 'svg-to-video', priority: 0.7, changeFrequency: 'monthly' },
  ]

  return tools.map((tool): SitemapEntry => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: tool.changeFrequency as any,
    priority: tool.priority,
  }))
}

// Generate complete dynamic sitemap
export function generateCompleteSitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://svgai.org',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://svgai.org/ai-icon-generator',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://svgai.org/animate',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://svgai.org/pricing',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://svgai.org/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://svgai.org/convert',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://svgai.org/gallery',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://svgai.org/learn',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://svgai.org/tools',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  return [
    ...staticPages,
    ...generateConverterSitemap(),
    ...generateGallerySitemap(),
    ...generateLearnSitemap(),
    ...generateToolsSitemap(),
  ]
}

// Generate sitemap index for large sites
export function generateSitemapIndex(): string {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-converters.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-galleries.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-learn.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tools.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`
}