import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// Helper function to get file modification date
export function getFileModifiedDate(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch {
    return new Date()
  }
}

// Helper function to get blog post metadata
export function getBlogPostMetadata(filePath: string): {
  title: string
  lastModified: Date
  priority: number
} {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)
    const lastModified = data.lastModified ? new Date(data.lastModified) : getFileModifiedDate(filePath)
    const priority = data.priority || 0.7
    
    return {
      title: data.title || 'Untitled',
      lastModified,
      priority
    }
  } catch {
    return {
      title: 'Untitled',
      lastModified: new Date(),
      priority: 0.7
    }
  }
}

// Get all MDX files from a directory recursively
export function getAllMdxFiles(dir: string): string[] {
  const files: string[] = []
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir)
    
    items.forEach(item => {
      const itemPath = path.join(currentDir, item)
      const stat = fs.statSync(itemPath)
      
      if (stat.isDirectory()) {
        traverse(itemPath)
      } else if (item.endsWith('.mdx')) {
        files.push(itemPath)
      }
    })
  }
  
  traverse(dir)
  return files
}

// Priority calculation based on search volume
export function calculatePriority(searchVolume: number, type: 'converter' | 'gallery' | 'learn' | 'tool' | 'blog' = 'blog'): number {
  switch (type) {
    case 'converter':
      if (searchVolume >= 10000) return 1.0
      if (searchVolume >= 5000) return 0.9
      if (searchVolume >= 1000) return 0.8
      if (searchVolume >= 500) return 0.7
      return 0.6
      
    case 'gallery':
      if (searchVolume >= 4000) return 1.0
      if (searchVolume >= 2000) return 0.9
      if (searchVolume >= 1000) return 0.8
      if (searchVolume >= 500) return 0.7
      return 0.6
      
    case 'learn':
      if (searchVolume >= 20000) return 1.0
      if (searchVolume >= 10000) return 0.9
      if (searchVolume >= 5000) return 0.8
      if (searchVolume >= 1000) return 0.7
      return 0.6
      
    case 'tool':
      if (searchVolume >= 5000) return 0.9
      if (searchVolume >= 1000) return 0.8
      return 0.7
      
    default:
      return 0.7
  }
}

// Change frequency calculation based on search volume and content type
export function calculateChangeFrequency(
  searchVolume: number, 
  type: 'converter' | 'gallery' | 'learn' | 'tool' | 'blog' = 'blog'
): 'daily' | 'weekly' | 'monthly' {
  switch (type) {
    case 'converter':
    case 'gallery':
      if (searchVolume >= 5000) return 'daily'
      if (searchVolume >= 1000) return 'weekly'
      return 'monthly'
      
    case 'learn':
      if (searchVolume >= 10000) return 'weekly'
      return 'monthly'
      
    case 'tool':
      return 'weekly'
      
    default:
      return 'monthly'
  }
}

// Generate XML for sitemap
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const urls = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}
</urlset>`
}

// Generate sitemap index XML
export function generateSitemapIndexXML(sitemaps: Array<{ loc: string; lastmod: Date }>): string {
  const entries = sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod.toISOString()}</lastmod>
  </sitemap>`).join('')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</sitemapindex>`
}

// Check if URL should be excluded from sitemap
export function shouldExcludeUrl(url: string): boolean {
  const excludePatterns = [
    /\/api\//,
    /\/dashboard\//,
    /\/profile/,
    /\/settings/,
    /\/auth\//,
    /\/admin\//,
    /\/_next\//,
    /\.json$/,
    /\.xml$/
  ]
  
  return excludePatterns.some(pattern => pattern.test(url))
}