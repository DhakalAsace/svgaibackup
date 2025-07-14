import fs from 'fs'
import path from 'path'

export async function GET() {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()
  
  // Get blog post files
  const blogDir = path.join(process.cwd(), 'content', 'blog')
  const categories = ['ai-svg-generation', 'specialized-svg-applications', 'technical-svg-implementation', 'text-to-svg']
  
  // Add main blog page
  const urls = [`
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`]
  
  // Add blog posts from each category
  categories.forEach(category => {
    const categoryPath = path.join(blogDir, category)
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
      files
        .filter(file => file.endsWith('.mdx'))
        .forEach(file => {
          const slug = file.replace('.mdx', '')
          urls.push(`
  <url>
    <loc>${baseUrl}/blog/${category}/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
        })
    }
  })
  
  // Add custom blog pages
  const customPages = [
    'ai-icon-maker-vs-traditional-design',
    'best-ai-icon-generators-compared',
    'best-ai-icon-tools',
    'guide-ai-icon-creation',
    'how-to-create-app-icons-with-ai'
  ]
  
  customPages.forEach(page => {
    urls.push(`
  <url>
    <loc>${baseUrl}/blog/${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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