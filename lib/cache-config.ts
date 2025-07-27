/**
 * Cache configuration for different resource types
 * Used for CDN headers and client-side caching strategies
 */

export const CACHE_CONFIG = {
  // Static assets with long-term caching
  static: {
    // JS/CSS bundles with hash in filename
    bundles: {
      maxAge: 31536000, // 1 year
      sMaxAge: 31536000,
      immutable: true,
      pattern: /\/_next\/static\/.+\.(js|css)$/,
    },
    
    // Images and other media
    media: {
      maxAge: 31536000, // 1 year
      sMaxAge: 31536000,
      mustRevalidate: true,
      pattern: /\.(svg|jpg|jpeg|png|gif|ico|webp)$/i,
    },
    
    // Fonts
    fonts: {
      maxAge: 31536000, // 1 year
      sMaxAge: 31536000,
      immutable: true,
      pattern: /\.(woff|woff2|ttf|otf)$/i,
    },
  },
  
  // Dynamic content with short-term caching
  dynamic: {
    // API routes (general)
    api: {
      maxAge: 0,
      sMaxAge: 0,
      noStore: true,
      pattern: /^\/api\/.*/,
    },
    
    // Converter API routes (deterministic)
    converterApi: {
      maxAge: 3600, // 1 hour
      sMaxAge: 3600,
      staleWhileRevalidate: 86400, // 1 day
      pattern: /^\/api\/convert\/.*/,
    },
    
    // HTML pages
    pages: {
      maxAge: 0,
      sMaxAge: 10,
      staleWhileRevalidate: 59,
      pattern: /\.html?$/,
    },
  },
  
  // Service worker specific
  serviceWorker: {
    sw: {
      maxAge: 0,
      mustRevalidate: true,
      pattern: /\/sw\.js$/,
    },
    
    manifest: {
      maxAge: 3600, // 1 hour
      sMaxAge: 3600,
      pattern: /\/manifest\.json$/,
    },
  },
};

/**
 * Generate cache headers based on configuration
 */
export function getCacheHeaders(config: {
  maxAge?: number;
  sMaxAge?: number;
  immutable?: boolean;
  mustRevalidate?: boolean;
  noStore?: boolean;
  staleWhileRevalidate?: number;
}) {
  const parts: string[] = ['public'];
  
  if (config.noStore) {
    return 'no-store, must-revalidate';
  }
  
  if (config.maxAge !== undefined) {
    parts.push(`max-age=${config.maxAge}`);
  }
  
  if (config.sMaxAge !== undefined) {
    parts.push(`s-maxage=${config.sMaxAge}`);
  }
  
  if (config.immutable) {
    parts.push('immutable');
  }
  
  if (config.mustRevalidate) {
    parts.push('must-revalidate');
  }
  
  if (config.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }
  
  return parts.join(', ');
}

/**
 * Get cache headers for a specific path
 */
export function getCacheHeadersForPath(path: string): string {
  // Check static patterns
  for (const [_, config] of Object.entries(CACHE_CONFIG.static)) {
    if (config.pattern.test(path)) {
      return getCacheHeaders(config);
    }
  }
  
  // Check dynamic patterns
  for (const [_, config] of Object.entries(CACHE_CONFIG.dynamic)) {
    if (config.pattern.test(path)) {
      return getCacheHeaders(config);
    }
  }
  
  // Check service worker patterns
  for (const [_, config] of Object.entries(CACHE_CONFIG.serviceWorker)) {
    if (config.pattern.test(path)) {
      return getCacheHeaders(config);
    }
  }
  
  // Default to no cache
  return getCacheHeaders(CACHE_CONFIG.dynamic.pages);
}