export async function GET() {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()
  
  // Tool pages with their priorities based on functionality and search volume
  const toolPages = [
    {
      url: `${baseUrl}/tools`,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/animate`,
      changefreq: 'weekly',
      priority: 0.9, // Animation tool has 7,720 searches
    },
    {
      url: `${baseUrl}/tools/svg-editor`,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/svg-optimizer`,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/svg-to-video`,
      changefreq: 'weekly',
      priority: 0.9, // Premium tool, higher priority
    },
  ]
  
  // Generate URLs
  const urls = toolPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('')
  
  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}
</urlset>`
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}