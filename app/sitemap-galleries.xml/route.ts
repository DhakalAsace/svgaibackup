import { getAllGalleryThemes } from '@/app/gallery/gallery-config'

export async function GET() {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()
  
  // Helper function to determine priority based on search volume
  const getPriority = (searchVolume: number): number => {
    if (searchVolume >= 4000) return 1.0
    if (searchVolume >= 2000) return 0.9
    if (searchVolume >= 1000) return 0.8
    if (searchVolume >= 500) return 0.7
    return 0.6
  }
  
  // Helper function to determine change frequency
  const getChangeFrequency = (searchVolume: number): string => {
    if (searchVolume >= 2000) return 'daily'
    if (searchVolume >= 1000) return 'weekly'
    return 'weekly' // Galleries update regularly
  }
  
  // Get all gallery themes sorted by search volume
  const galleryThemes = getAllGalleryThemes().sort((a, b) => b.searchVolume - a.searchVolume)
  
  // Add main gallery page
  const urls = [`
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`]
  
  // Add individual gallery pages
  galleryThemes.forEach(theme => {
    const priority = getPriority(theme.searchVolume)
    const changefreq = getChangeFrequency(theme.searchVolume)
    
    urls.push(`
  <url>
    <loc>${baseUrl}/gallery/${theme.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`)
  })
  
  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls.join('')}
</urlset>`
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}