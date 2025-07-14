let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    instrumentationHook: false,
  },
  distDir: '.next-build',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Removed static export to allow API routes and server functionality
  
  // Use the default Next.js output directory instead of a custom one
  // distDir: '.next-build',
  skipTrailingSlashRedirect: true, // Accommodate both with and without trailing slashes
  
  // Security headers to prevent XSS and other web vulnerabilities
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          // Set strict Content-Security-Policy to mitigate XSS
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.supabase.co https://*.replicate.com https://*.replicate.delivery; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none';"
          },
          // Prevent browsers from interpreting files as a different MIME type
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Enable cross-site scripting filter in supported browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Control referrer information when navigating to other origins
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Limit browser features that can be used by the page
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      },
      {
        // More restrictive policy for SVG content in API responses
        source: '/api/svg/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'none'; object-src 'none'"
          }
        ]
      },
      // Static assets - 1 year cache with immutable
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Image assets - 1 year cache
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate'
          }
        ]
      },
      // Font files - 1 year cache
      {
        source: '/:all*(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // API routes - no cache or short cache based on route
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      },
      // Converter API routes - cache for 1 hour (they're deterministic)
      {
        source: '/api/convert/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      },
      // HTML pages - short cache with revalidation
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      },
      // Service worker
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      },
      // Manifest file
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      }
    ];
  },
  
  // Redirect configuration
  async redirects() {
    return [
      // Legacy converter URLs
      {
        source: '/tools/png-to-svg',
        destination: '/convert/png-to-svg',
        permanent: true,
      },
      {
        source: '/tools/svg-to-png',
        destination: '/convert/svg-to-png',
        permanent: true,
      },
      {
        source: '/tools/jpg-to-svg',
        destination: '/convert/jpg-to-svg',
        permanent: true,
      },
      {
        source: '/tools/svg-to-jpg',
        destination: '/convert/svg-to-jpg',
        permanent: true,
      },
      {
        source: '/tools/svg-to-pdf',
        destination: '/convert/svg-to-pdf',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-svg',
        destination: '/convert/pdf-to-svg',
        permanent: true,
      },
      // Common misspellings
      {
        source: '/convert/svg-conveter',
        destination: '/convert/svg-converter',
        permanent: true,
      },
      {
        source: '/convert/svg-convertor',
        destination: '/convert/svg-converter',
        permanent: true,
      },
      // Alternative URL patterns
      {
        source: '/converter/:path*',
        destination: '/convert/:path*',
        permanent: true,
      },
      {
        source: '/converters/:path*',
        destination: '/convert/:path*',
        permanent: true,
      },
      {
        source: '/svg-converter',
        destination: '/convert/svg-converter',
        permanent: true,
      },
      // Gallery redirects
      {
        source: '/svg-gallery',
        destination: '/gallery',
        permanent: true,
      },
      {
        source: '/svg-gallery/:theme',
        destination: '/gallery/:theme',
        permanent: true,
      },
      // Learn redirects
      {
        source: '/docs/:path*',
        destination: '/learn/:path*',
        permanent: true,
      },
      {
        source: '/tutorials/:path*',
        destination: '/learn/:path*',
        permanent: true,
      },
      // Tool redirects
      {
        source: '/svg-editor',
        destination: '/tools/svg-editor',
        permanent: true,
      },
      {
        source: '/svg-optimizer',
        destination: '/tools/svg-optimizer',
        permanent: true,
      },
      {
        source: '/animation-tool',
        destination: '/animate',
        permanent: true,
      },
      // AI icon generator redirects
      {
        source: '/icon-generator',
        destination: '/ai-icon-generator',
        permanent: true,
      },
      {
        source: '/generate-icon',
        destination: '/ai-icon-generator',
        permanent: true,
      },
    ];
  },
  
  reactStrictMode: true,
  serverExternalPackages: ['sharp', 'canvas', 'potrace'],
  experimental: {
    // parallelServerCompiles: true,
    mdxRs: true, // Enable the new Rust-based MDX compiler
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Generate build ID for cache busting
  generateBuildId: async () => {
    // Use timestamp for unique build ID
    // In production, you might want to use git commit hash
    return `build-${Date.now()}`;
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Preload critical resources
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  webpack: (config, { isServer }) => {
    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Exclude sharp from webpack bundling to avoid build issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        sharp: false,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    // Ensure proper handling of potrace and other binary modules
    config.externals = [...(config.externals || []), 'canvas', 'sharp'];

    return config;
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...config[key] }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

// Apply MDX configuration
export default withMDX(nextConfig)

// Enable hydration debugging in development
if (process.env.NODE_ENV === 'development') {
  nextConfig.onDemandEntries = {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  }
}
