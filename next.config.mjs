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
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
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
};

export default nextConfig; 