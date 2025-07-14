import { getAllGalleryThemes } from '@/app/gallery/gallery-config'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()
  
  // Get all gallery themes
  const galleryThemes = getAllGalleryThemes()
  
  // Generate image entries for gallery SVGs
  const imageEntries: string[] = []
  
  // Add gallery preview images
  galleryThemes.forEach(theme => {
    // Add theme preview images
    imageEntries.push(`
  <url>
    <loc>${baseUrl}/gallery/${theme.slug}</loc>
    <image:image>
      <image:loc>${baseUrl}/gallery/${theme.slug}/preview.svg</image:loc>
      <image:title>${theme.title}</image:title>
      <image:caption>${theme.description}</image:caption>
    </image:image>
  </url>`)
  })
  
  // Add SVG examples and icon generator examples
  const svgExamplesDir = path.join(process.cwd(), 'public', 'svg-examples')
  const iconExamplesDir = path.join(process.cwd(), 'public', 'icon-generator-examples')
  
  // Add SVG examples
  if (fs.existsSync(svgExamplesDir)) {
    const files = fs.readdirSync(svgExamplesDir)
    files
      .filter(file => file.endsWith('.svg'))
      .forEach(file => {
        const title = file.replace('.svg', '').replace(/-/g, ' ')
        imageEntries.push(`
  <url>
    <loc>${baseUrl}/results</loc>
    <image:image>
      <image:loc>${baseUrl}/svg-examples/${file}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>AI-generated SVG example</image:caption>
    </image:image>
  </url>`)
      })
  }
  
  // Add icon generator examples
  if (fs.existsSync(iconExamplesDir)) {
    const files = fs.readdirSync(iconExamplesDir)
    files
      .filter(file => file.endsWith('.svg'))
      .slice(0, 20) // Limit to avoid huge sitemap
      .forEach(file => {
        const title = file.replace('.svg', '').replace(/-/g, ' ')
        imageEntries.push(`
  <url>
    <loc>${baseUrl}/ai-icon-generator</loc>
    <image:image>
      <image:loc>${baseUrl}/icon-generator-examples/${file}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>AI-generated icon example</image:caption>
    </image:image>
  </url>`)
      })
  }
  
  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${imageEntries.join('')}
</urlset>`
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}