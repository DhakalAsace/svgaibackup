import { getLearnPagesSitemapData } from '@/lib/seo/learn-page-seo'

export async function GET() {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()
  
  // Get learn pages data sorted by priority
  const learnPages = getLearnPagesSitemapData()
  
  // Add main learn page
  const urls = [`
  <url>
    <loc>${baseUrl}/learn</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`]
  
  // Add individual learn pages
  learnPages.forEach(page => {
    // Update URL to use correct domain
    const url = page.url.replace('https://svgai.org', baseUrl)
    
    urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
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