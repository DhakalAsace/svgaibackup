import { NextRequest } from 'next/server';

// Redirect configuration types
export interface RedirectRule {
  source: string | RegExp;
  destination: string;
  permanent: boolean;
  statusCode?: 301 | 302 | 307 | 308;
}

export interface GoneRule {
  source: string | RegExp;
  message?: string;
}

// Legacy URL patterns to new format
export const redirectRules: RedirectRule[] = [
  // Legacy converter URLs
  { source: '/tools/png-to-svg', destination: '/convert/png-to-svg', permanent: true },
  { source: '/tools/svg-to-png', destination: '/convert/svg-to-png', permanent: true },
  { source: '/tools/jpg-to-svg', destination: '/convert/jpg-to-svg', permanent: true },
  { source: '/tools/svg-to-jpg', destination: '/convert/svg-to-jpg', permanent: true },
  { source: '/tools/svg-to-pdf', destination: '/convert/svg-to-pdf', permanent: true },
  { source: '/tools/pdf-to-svg', destination: '/convert/pdf-to-svg', permanent: true },
  { source: '/tools/svg-to-mp4', destination: '/convert/svg-to-mp4', permanent: true },
  { source: '/tools/webp-to-svg', destination: '/convert/webp-to-svg', permanent: true },
  { source: '/tools/svg-to-webp', destination: '/convert/svg-to-webp', permanent: true },
  
  // Common misspellings
  { source: '/convert/svg-conveter', destination: '/convert/svg-converter', permanent: true },
  { source: '/convert/svg-convertor', destination: '/convert/svg-converter', permanent: true },
  { source: '/convert/png-to-svg-converter', destination: '/convert/png-to-svg', permanent: true },
  { source: '/convert/svg-to-png-converter', destination: '/convert/svg-to-png', permanent: true },
  { source: '/convert/jpg-to-svg-converter', destination: '/convert/jpg-to-svg', permanent: true },
  
  // Alternative URL patterns
  { source: '/converter/png-to-svg', destination: '/convert/png-to-svg', permanent: true },
  { source: '/converters/png-to-svg', destination: '/convert/png-to-svg', permanent: true },
  { source: '/svg/converter', destination: '/convert/svg-converter', permanent: true },
  { source: '/svg/convert', destination: '/convert/svg-converter', permanent: true },
  { source: '/svg-converter', destination: '/convert/svg-converter', permanent: true },
  
  // Gallery redirects
  { source: '/svg-gallery', destination: '/gallery', permanent: true },
  { source: '/svg-gallery/:theme', destination: '/gallery/:theme', permanent: true },
  { source: '/galleries/:theme', destination: '/gallery/:theme', permanent: true },
  
  // Learn page redirects
  { source: '/docs/what-is-svg', destination: '/learn/what-is-svg', permanent: true },
  { source: '/tutorials/svg-file-format', destination: '/learn/svg-file-format', permanent: true },
  { source: '/guide/svg-basics', destination: '/learn/svg-basics', permanent: true },
  
  // Tool redirects
  { source: '/svg-editor', destination: '/tools/svg-editor', permanent: true },
  { source: '/svg-optimizer', destination: '/tools/svg-optimizer', permanent: true },
  { source: '/svg-animation', destination: '/animate', permanent: true },
  { source: '/animation-tool', destination: '/animate', permanent: true },
  
  // AI icon generator redirects
  { source: '/icon-generator', destination: '/ai-icon-generator', permanent: true },
  { source: '/generate-icon', destination: '/ai-icon-generator', permanent: true },
  { source: '/ai-icons', destination: '/ai-icon-generator', permanent: true },
];

// Pages that have been permanently removed
export const goneRules: GoneRule[] = [
  { source: '/beta', message: 'The beta program has ended. Please visit our main site.' },
  { source: '/old-api', message: 'This API version is no longer supported.' },
  { source: '/v1/*', message: 'Version 1 has been discontinued.' },
];

// Trailing slash normalization
export function normalizeTrailingSlash(pathname: string): string | null {
  // Skip normalization for API routes and static files
  if (pathname.startsWith('/api/') || pathname.includes('.')) {
    return null;
  }
  
  // Remove trailing slash (except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  
  return null;
}

// Find matching redirect rule
export function findRedirect(pathname: string): RedirectRule | null {
  for (const rule of redirectRules) {
    if (typeof rule.source === 'string') {
      // Handle simple string matches and wildcards
      if (rule.source.includes(':')) {
        // Dynamic route pattern
        const pattern = rule.source.replace(/:([^/]+)/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        const match = pathname.match(regex);
        
        if (match) {
          let destination = rule.destination;
          // Replace dynamic segments
          const segments = rule.source.match(/:([^/]+)/g) || [];
          segments.forEach((segment, index) => {
            destination = destination.replace(segment, match[index + 1]);
          });
          
          return {
            ...rule,
            destination
          };
        }
      } else if (rule.source === pathname) {
        return rule;
      }
    } else if (rule.source instanceof RegExp && rule.source.test(pathname)) {
      return rule;
    }
  }
  
  return null;
}

// Find matching gone rule
export function findGoneRule(pathname: string): GoneRule | null {
  for (const rule of goneRules) {
    if (typeof rule.source === 'string') {
      if (rule.source.endsWith('*')) {
        const prefix = rule.source.slice(0, -1);
        if (pathname.startsWith(prefix)) {
          return rule;
        }
      } else if (rule.source === pathname) {
        return rule;
      }
    } else if (rule.source instanceof RegExp && rule.source.test(pathname)) {
      return rule;
    }
  }
  
  return null;
}

// Fuzzy URL matching for 404 suggestions
export function findSimilarUrls(pathname: string, maxSuggestions: number = 5): string[] {
  const allPaths = [
    // Converters
    '/convert/png-to-svg',
    '/convert/svg-to-png',
    '/convert/jpg-to-svg',
    '/convert/svg-to-jpg',
    '/convert/svg-to-pdf',
    '/convert/pdf-to-svg',
    '/convert/svg-to-mp4',
    '/convert/webp-to-svg',
    '/convert/svg-to-webp',
    '/convert/gif-to-svg',
    '/convert/svg-to-gif',
    '/convert/bmp-to-svg',
    '/convert/svg-to-bmp',
    '/convert/ico-to-svg',
    '/convert/svg-to-ico',
    '/convert/tiff-to-svg',
    '/convert/svg-to-tiff',
    '/convert/eps-to-svg',
    '/convert/svg-to-eps',
    '/convert/dxf-to-svg',
    '/convert/svg-to-dxf',
    '/convert/svg-converter',
    
    // Gallery
    '/gallery',
    '/gallery/heart-svg',
    '/gallery/star-svg',
    '/gallery/arrow-svg',
    '/gallery/flower-svg',
    '/gallery/christmas-svg',
    '/gallery/halloween-svg',
    '/gallery/easter-svg',
    
    // Learn
    '/learn',
    '/learn/what-is-svg',
    '/learn/svg-file-format',
    '/learn/svg-basics',
    '/learn/how-to-use-svg',
    '/learn/svg-optimization',
    
    // Tools
    '/tools/svg-editor',
    '/tools/svg-optimizer',
    '/tools/svg-to-video',
    '/animate',
    '/ai-icon-generator',
    
    // Other pages
    '/pricing',
    '/blog',
    '/dashboard',
    '/profile',
    '/settings',
  ];
  
  // Calculate Levenshtein distance
  function levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  // Score each path based on similarity
  const scored = allPaths.map(path => ({
    path,
    score: levenshteinDistance(pathname.toLowerCase(), path.toLowerCase())
  }));
  
  // Sort by score and return top suggestions
  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, maxSuggestions)
    .map(item => item.path);
}

// Get category-based recommendations
export function getCategoryRecommendations(pathname: string): string[] {
  const recommendations: string[] = [];
  
  if (pathname.includes('convert') || pathname.includes('converter')) {
    recommendations.push(
      '/convert/png-to-svg',
      '/convert/svg-to-png',
      '/convert/jpg-to-svg',
      '/convert/svg-converter'
    );
  } else if (pathname.includes('gallery') || pathname.includes('svg')) {
    recommendations.push(
      '/gallery',
      '/gallery/heart-svg',
      '/gallery/star-svg',
      '/ai-icon-generator'
    );
  } else if (pathname.includes('learn') || pathname.includes('guide') || pathname.includes('tutorial')) {
    recommendations.push(
      '/learn',
      '/learn/what-is-svg',
      '/learn/svg-file-format',
      '/learn/svg-basics'
    );
  } else if (pathname.includes('tool') || pathname.includes('editor') || pathname.includes('optimize')) {
    recommendations.push(
      '/tools/svg-editor',
      '/tools/svg-optimizer',
      '/animate',
      '/ai-icon-generator'
    );
  }
  
  // Add popular pages if no specific category matches
  if (recommendations.length === 0) {
    recommendations.push(
      '/convert/png-to-svg',
      '/ai-icon-generator',
      '/gallery',
      '/tools/svg-editor'
    );
  }
  
  return recommendations.slice(0, 4);
}

// Popular converters for 404 page
export const popularConverters = [
  { href: '/convert/png-to-svg', title: 'PNG to SVG', searches: '40,500/mo' },
  { href: '/convert/svg-to-png', title: 'SVG to PNG', searches: '27,100/mo' },
  { href: '/convert/jpg-to-svg', title: 'JPG to SVG', searches: '22,200/mo' },
  { href: '/convert/svg-to-jpg', title: 'SVG to JPG', searches: '9,900/mo' },
  { href: '/convert/svg-to-pdf', title: 'SVG to PDF', searches: '8,100/mo' },
  { href: '/convert/svg-converter', title: 'SVG Converter', searches: '6,600/mo' },
];

// Edge redirect configuration for Vercel
export const edgeRedirects = {
  redirects: redirectRules.map(rule => ({
    source: typeof rule.source === 'string' ? rule.source : rule.source.source,
    destination: rule.destination,
    permanent: rule.permanent,
  })),
};