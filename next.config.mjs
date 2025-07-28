/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default build directory for Vercel compatibility
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  experimental: {
    scrollRestoration: false, // Disable experimental scroll restoration
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-*',
      'framer-motion',
      'react-hook-form',
      'zod',
      '@supabase/supabase-js',
      'codemirror',
      '@codemirror/*',
      '@uiw/react-codemirror',
      'date-fns',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      '@tanstack/react-query'
    ], // Optimize imports
    // webpackBuildWorker: true, // Disabled - may cause build issues
  },
  // Fix trailing slash to prevent redirects
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ['sharp'], // Ensure sharp is handled correctly
  
  // Allow development access from local network
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://10.0.0.168:3000',
  ],
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production to reduce bundle size
  compress: true, // Enable gzip compression
  
  // Optimize CSS
  optimizeCss: {
    minify: true,
  },
  
  // Remove complex user config import
  // Remove MDX for now
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  
  // Configure modern JavaScript output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Target modern browsers only to avoid legacy polyfills
  target: 'es2020',
  
  // Transpile packages that need it
  transpilePackages: [
    '@radix-ui/react-accordion',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
  ],
  
  // Modularize imports to reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },
  
  // Add webpack configuration to handle native modules
  webpack: (config, { isServer, webpack, dev }) => {
    // Disable source maps to reduce bundle size
    if (!isServer) {
      config.devtool = false;
    }
    
    // Optimized bundle splitting to reduce initial JavaScript chunks
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25, // Allow more initial chunks for better caching
          maxAsyncRequests: 30,
          minSize: 20000, // Smaller chunks for better tree-shaking
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            // Split vendors into smaller chunks by package
            radixUI: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 30,
              reuseExistingChunk: true,
            },
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 25,
              reuseExistingChunk: true,
            },
            codemirror: {
              test: /[\\/]node_modules[\\/](@codemirror|codemirror)[\\/]/,
              name: 'codemirror',
              priority: 25,
              reuseExistingChunk: true,
            },
            tanstack: {
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              name: 'tanstack',
              priority: 25,
              reuseExistingChunk: true,
            },
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-sync-external-store)[\\/]/,
              priority: 40,
              name: 'framework',
              enforce: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              name(module, chunks, cacheGroupKey) {
                const moduleFileName = module
                  .identifier()
                  .split('/')
                  .reduceRight((item) => item);
                const allChunksNames = chunks.map((item) => item.name).join('~');
                return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              },
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // Handle native modules that cause build hangs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        'pdfjs-dist/build/pdf.worker.min.js': false,
        fs: false,
        path: false,
        stream: false,
        util: false,
        crypto: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
        sharp: false,
      };
      
      // More aggressive approach to ignore sharp and its dependencies
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^sharp$/
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /node_modules\/sharp/
        }),
        new webpack.NormalModuleReplacementPlugin(
          /^sharp$/,
          'data:text/javascript,module.exports = function() { throw new Error("Sharp not available in browser"); }'
        )
      );
    }
    
    // Suppress SVGO webpack warning about dynamic imports
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    
    // Fix module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'zod/lib/index.mjs': 'zod/index.js',
      'zod/lib': 'zod',
    };
    
    // Externalize native modules to prevent bundling issues on server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('potrace', 'canvas', 'sharp');
    }
    
    return config;
  },

  // Add caching headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect duplicate /converters routes to /convert
      {
        source: '/converters/:slug',
        destination: '/convert/:slug',
        permanent: true,
      },
      {
        source: '/converters',
        destination: '/convert',
        permanent: true,
      },
      // Redirect learn pages to blog/guides
      {
        source: '/learn/:slug',
        destination: '/blog/guides/:slug',
        permanent: true,
      },
      // Consolidate JPG/JPEG converters
      {
        source: '/convert/jpeg-to-svg',
        destination: '/convert/jpg-to-svg',
        permanent: true,
      },
      {
        source: '/convert/svg-to-jpeg',
        destination: '/convert/svg-to-jpg',
        permanent: true,
      },

      // Consolidate general converters into the best specific term
      {
        source: '/convert/svg-converter',
        destination: '/convert/image-to-svg',
        permanent: true,
      },

      // Redirect unsupported converters to the premium tool
      {
        source: '/convert/svg-to-mp4',
        destination: '/tools/svg-to-video',
        permanent: true,
      },
      
      // Redirect old privacy and terms URLs to new ones
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig; 