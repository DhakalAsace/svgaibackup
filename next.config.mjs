/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  experimental: {
    optimizeCss: false, // Disable experimental CSS optimization
    scrollRestoration: false, // Disable experimental scroll restoration
  },
  // Remove complex user config import
  // Remove MDX for now
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  
  // Add webpack configuration to handle native modules
  webpack: (config, { isServer, webpack }) => {
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
    ];
  },
};

export default nextConfig; 