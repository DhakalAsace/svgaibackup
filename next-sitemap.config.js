/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://svgai.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/'
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/dashboard/', '/results/', '/generate/', '/settings/']
      }
    ],
    additionalSitemaps: [],
  },
  // Exclude duplicate blog paths with encoded slashes and paths disallowed in robots.txt
  exclude: [
    '/blog/*%2F*', 
    '/api/*', 
    '/dashboard', 
    '/results', 
    '/generate', 
    '/settings',
    '/dashboard/*', 
    '/results/*',
    '/settings/*'
  ],
  // Ensure sitemap is updated daily
  outDir: 'public',
  changefreq: 'daily',
  priority: 0.7,
}
