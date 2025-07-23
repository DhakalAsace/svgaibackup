/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://svgai.org',
  sourceDir: '.next-build',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Don't need index until 5000+ URLs
  
  // Clean exclusions - all private/functional areas
  exclude: [
    '/blog/*%2F*',  // Prevent encoded slash URLs
    '/api/*',
    '/dashboard*',
    '/settings*',
    '/profile*',
    '/auth/*',
    '/admin/*',
    '/results/*',
    '/generate/*',
    '/server-sitemap*', // Prevent any server sitemap references
    '/404',
    '/500',
    '/_error',
    '/_app',
    '/_document',
    '/gone',          // 410 error page
    '/offline',       // PWA offline fallback
    '/login',         // Auth pages shouldn't be indexed
    '/signup',        // Auth pages shouldn't be indexed
    '/privacy-policy', // Duplicate of /privacy
    '/terms-of-service', // Duplicate of /terms
    '/converters/*',  // Redirects to /convert/*
    '/converters',    // Redirects to /convert
  ],
  
  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: [
          '/api/',
          '/dashboard/',
          '/settings/',
          '/profile/',
          '/auth/',
          '/admin/',
          '/results/',
          '/generate/',
          '/_next/',
          '/server-sitemap',
          '/gone',
          '/offline',
          '/login',
          '/signup',
        ],
      },
    ],
  },
  
  // Transform function for custom priorities based on content type
  transform: async (config, path) => {
    // Homepage - highest priority
    if (path === '/') {
      return {
        loc: path,
        priority: 1.0,
        changefreq: 'daily',
        lastmod: new Date().toISOString(),
      }
    }
    
    // AI Icon Generator - second highest priority
    if (path === '/ai-icon-generator') {
      return {
        loc: path,
        priority: 0.9,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Converter pages - high value based on search volume
    if (path.startsWith('/convert/')) {
      const highValueConverters = [
        'png-to-svg',    // 40,500 searches
        'svg-to-png',    // 40,500 searches
        'jpg-to-svg',    // 27,100 searches
        'svg-to-jpg',    // 12,100 searches
        'pdf-to-svg',    // 14,800 searches
      ]
      const slug = path.split('/').pop()
      
      if (highValueConverters.includes(slug)) {
        return {
          loc: path,
          priority: 0.9,
          changefreq: 'monthly',
          lastmod: new Date().toISOString(),
        }
      }
      
      return {
        loc: path,
        priority: 0.7,
        changefreq: 'monthly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Gallery pages - medium-high priority
    if (path.startsWith('/gallery/')) {
      return {
        loc: path,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Blog pages - standard priority
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        priority: 0.7,
        changefreq: 'monthly',
        lastmod: new Date().toISOString(),
      }
    }
    
    
    // Pricing page
    if (path === '/pricing') {
      return {
        loc: path,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Animation tool - key feature
    if (path === '/animate') {
      return {
        loc: path,
        priority: 0.9,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Tools pages - important for user engagement
    if (path.startsWith('/tools/')) {
      return {
        loc: path,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default for all other pages
    return {
      loc: path,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: new Date().toISOString(),
    }
  },
  
  // Additional paths to include in sitemap
  additionalPaths: async (config) => {
    const converters = [
      'png-to-svg', 'svg-to-png', 'svg-converter', 'jpg-to-svg', 'image-to-svg',
      'svg-to-jpg', 'jpeg-to-svg', 'svg-to-pdf', 'pdf-to-svg', 'webp-to-svg',
      'svg-to-webp', 'gif-to-svg', 'svg-to-gif', 'bmp-to-svg', 'svg-to-bmp',
      'ico-to-svg', 'svg-to-ico', 'eps-to-svg', 'svg-to-eps', 'ai-to-svg',
      'svg-to-ai', 'dxf-to-svg', 'svg-to-dxf', 'tiff-to-svg', 'svg-to-tiff',
      'jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'png-to-pdf',
      'jpg-to-pdf', 'jpg-to-ico', 'png-to-ico', 'ico-to-jpg', 'ico-to-png',
      'webp-to-jpg', 'webp-to-png', 'avif-to-jpg', 'avif-to-png', 'heic-to-jpg',
      'heic-to-png', 'jfif-to-jpg', 'jfif-to-png'
    ]
    
    return converters.map(converter => ({
      loc: `/convert/${converter}`,
      priority: converter.includes('png-to-svg') || converter.includes('svg-to-png') ? 0.9 : 0.7,
      changefreq: 'monthly',
    }))
  },
  
  // Output directory
  outDir: 'public',
}
