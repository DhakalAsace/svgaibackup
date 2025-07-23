import { headers } from 'next/headers';
import { createLogger } from '@/lib/logger';
const logger = createLogger('soft-404');
// Patterns that indicate a soft 404 (page exists but has no real content)
const soft404Patterns = [
  /page not found/i,
  /404 error/i,
  /content not available/i,
  /coming soon/i,
  /under construction/i,
  /maintenance mode/i,
  /no results found/i,
  /error occurred/i,
];
// Minimum content length for a valid page (excluding HTML markup)
const MIN_CONTENT_LENGTH = 200;
// Keywords that indicate valid content
const validContentKeywords = [
  'convert',
  'svg',
  'generator',
  'editor',
  'tool',
  'learn',
  'gallery',
  'pricing',
  'blog',
];
export interface Soft404Detection {
  isSoft404: boolean;
  reason?: string;
  confidence: number;
}
/**
 * Detect if a page is a soft 404 based on its content
 */
export function detectSoft404(content: string, pathname: string): Soft404Detection {
  // Remove HTML tags and get text content
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  // Check for 404 patterns in content
  for (const pattern of soft404Patterns) {
    if (pattern.test(textContent)) {
      return {
        isSoft404: true,
        reason: `Content matches soft 404 pattern: ${pattern}`,
        confidence: 0.9,
      };
    }
  }
  // Check content length
  if (textContent.length < MIN_CONTENT_LENGTH) {
    return {
      isSoft404: true,
      reason: `Content too short: ${textContent.length} characters`,
      confidence: 0.8,
    };
  }
  // Check for valid content keywords
  const hasValidContent = validContentKeywords.some(keyword => 
    textContent.toLowerCase().includes(keyword)
  );
  if (!hasValidContent) {
    return {
      isSoft404: true,
      reason: 'No valid content keywords found',
      confidence: 0.7,
    };
  }
  // Check for specific page patterns
  if (pathname.includes('/test') || pathname.includes('/debug')) {
    return {
      isSoft404: true,
      reason: 'Test or debug page detected',
      confidence: 0.95,
    };
  }
  // Page appears to be valid
  return {
    isSoft404: false,
    confidence: 1.0,
  };
}
/**
 * Log soft 404 detection for monitoring
 */
export async function logSoft404Detection(
  pathname: string,
  detection: Soft404Detection
): Promise<void> {
  if (!detection.isSoft404) return;
  try {
    // Log to monitoring service
    logger.warn(`Soft 404 detected: ${pathname}`, {
      reason: detection.reason,
      confidence: detection.confidence,
      timestamp: new Date().toISOString(),
    });
    // You can also send this to an analytics service
    // await sendToAnalytics({
    //   event: 'soft_404_detected',
    //   pathname,
    //   ...detection,
    // });
  } catch (error) {
  }
}
/**
 * Headers to set for soft 404 pages
 */
export function getSoft404Headers(): Headers {
  const responseHeaders = new Headers();
  responseHeaders.set('X-Robots-Tag', 'noindex, nofollow');
  responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return responseHeaders;
}
/**
 * Check if a URL should be monitored for soft 404s
 */
export function shouldMonitorUrl(pathname: string): boolean {
  // Skip monitoring for known system paths
  const skipPaths = [
    '/_next',
    '/api',
    '/auth',
    '/.well-known',
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
  ];
  return !skipPaths.some(path => pathname.startsWith(path));
}