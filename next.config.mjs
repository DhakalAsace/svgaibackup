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
  images: {
    unoptimized: true,
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
      }
    ];
  },
  
  reactStrictMode: true,
  experimental: {
    // Temporarily disable experimental features that might cause build issues
    // serverComponentsExternalPackages: ['sharp'],
    // parallelServerCompiles: true,
    mdxRs: true, // Enable the new Rust-based MDX compiler
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  webpack: (config, { isServer }) => {
    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

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
