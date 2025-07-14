import { generateSitemapIndex } from '@/lib/seo/dynamic-sitemap'

export async function GET() {
  const xml = generateSitemapIndex()
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}