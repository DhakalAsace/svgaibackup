/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using default .next directory for compatibility
  // distDir: '.next-build',
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
      '@radix-ui/*', 
      'framer-motion',
      'react-hook-form',
      'zod',
      '@supabase/supabase-js',
      'codemirror',
      '@uiw/react-codemirror',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ], // Optimize imports
    // optimizeCss: true, // Disabled - causing build issues with missing critters module
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
  productionBrowserSourceMaps: true, // Enable source maps to fix error
  compress: true, // Enable gzip compression
  
  // Remove complex user config import
  // Remove MDX for now
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  
  // Configure modern JavaScript output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
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
    // Enable source maps in production to fix console errors
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }
    
    // Optimize bundle splitting
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Split vendor code
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-sync-external-store)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            radix: {
              name: 'radix',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 30,
              enforce: true,
              reuseExistingChunk: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate large dependencies
            supabase: {
              name: 'supabase',
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },
            codemirror: {
              name: 'codemirror',
              test: /[\\/]node_modules[\\/](codemirror|@codemirror|@uiw\/react-codemirror)[\\/]/,
              priority: 35,
              enforce: true,
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