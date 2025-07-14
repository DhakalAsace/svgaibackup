import { generateConverterSitemap } from '@/lib/seo/dynamic-sitemap'

export async function GET() {
  const sitemap = generateConverterSitemap()
  
  // Convert Next.js sitemap format to XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified ? (typeof entry.lastModified === 'string' ? entry.lastModified : entry.lastModified.toISOString()) : new Date().toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}