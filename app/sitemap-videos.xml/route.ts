export async function GET() {
  const baseUrl = 'https://svgai.org'
  const currentDate = new Date().toISOString()
  
  // Video entries for tools that can export video
  const videoEntries = [
    {
      loc: `${baseUrl}/tools/svg-to-video`,
      title: 'SVG to Video Converter - Export Animations as MP4',
      description: 'Convert animated SVG files to MP4 video format. Perfect for social media and presentations.',
      thumbnail: `${baseUrl}/tools/svg-to-video/thumbnail.jpg`,
      contentLoc: `${baseUrl}/demo/svg-to-video-demo.mp4`,
      duration: 30, // seconds
      category: 'Tools'
    },
    {
      loc: `${baseUrl}/animate`,
      title: 'SVG Animation Tool - Create Animated Graphics',
      description: 'Create stunning SVG animations with our free CSS animation tool. Export as video available.',
      thumbnail: `${baseUrl}/animate/thumbnail.jpg`,
      contentLoc: `${baseUrl}/demo/animation-tool-demo.mp4`,
      duration: 45,
      category: 'Tools'
    },
    {
      loc: `${baseUrl}/convert/svg-to-mp4`,
      title: 'Convert SVG to MP4 Video - Premium Tool',
      description: 'Professional SVG to MP4 conversion with custom resolution and frame rate options.',
      thumbnail: `${baseUrl}/convert/svg-to-mp4/thumbnail.jpg`,
      contentLoc: `${baseUrl}/demo/svg-to-mp4-demo.mp4`,
      duration: 60,
      category: 'Converters'
    }
  ]
  
  // Generate video sitemap entries
  const videoUrls = videoEntries.map(video => `
  <url>
    <loc>${video.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumbnail}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:content_loc>${video.contentLoc}</video:content_loc>
      <video:duration>${video.duration}</video:duration>
      <video:publication_date>${currentDate}</video:publication_date>
      <video:category>${video.category}</video:category>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
    </video:video>
  </url>`).join('')
  
  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${videoUrls}
</urlset>`
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}