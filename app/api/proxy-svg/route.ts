import { NextRequest } from 'next/server';
import { createLogger } from '@/lib/logger';
import { sanitizeSvg } from '@/lib/svg-sanitizer';

// Initialize a logger
const logger = createLogger('api:proxy-svg');

// SECURITY: Only allow SVGs from trusted domains
const ALLOWED_DOMAINS = [
  'replicate.delivery',
  'replicate.com',
  'replicate-api-prod-models.s3.amazonaws.com',
  'storage.googleapis.com',
];

// Helper to check if a URL is valid and comes from an allowed domain
const isValidHttpUrl = (string: string | undefined | null): boolean => {
  if (!string) return false;
  try {
    const url = new URL(string);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    
    // SECURITY: Check if the domain is in our allowed list
    return ALLOWED_DOMAINS.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch (_) {
    return false;
  }
};

export async function GET(req: NextRequest) {
  try {
    // Get the SVG URL from the query parameter
    const url = req.nextUrl.searchParams.get('url');
    
    if (!url) {
      logger.warn('No URL provided to proxy-svg endpoint');
      return new Response('No SVG URL provided', { status: 400 });
    }
    
    // Validate the URL
    if (!isValidHttpUrl(url)) {
      logger.warn('Invalid SVG URL or domain not allowed', { domain: new URL(url).hostname });
      return new Response('Invalid SVG URL or domain not allowed', { status: 400 });
    }
    
    logger.info('Proxying SVG request', { domain: new URL(url).hostname });
    
    // Fetch the SVG content
    const response = await fetch(url, {
      cache: 'no-store', // Don't cache the SVG content
    });
    
    if (!response.ok) {
      logger.error(`Failed to fetch SVG from external source: ${response.status}`, { statusText: response.statusText });
      return new Response(`Failed to fetch SVG: ${response.status}`, { status: response.status });
    }
    
    // Get the content type
    const contentType = response.headers.get('content-type') || 'image/svg+xml';
    
    // Get the SVG content
    const svgText = await response.text();
    
    // Basic check for SVG content
    if (!svgText.includes('<svg')) {
      logger.warn('Response does not contain valid SVG content');
      return new Response('Response does not contain valid SVG content', { status: 422 });
    }
    
    // --- Add viewBox if missing --- START
    let processedSvgText = svgText;
    if (!processedSvgText.includes('viewBox=')) {
      const svgTagMatch = processedSvgText.match(/<svg[^>]*>/);
      if (svgTagMatch) {
        const svgTag = svgTagMatch[0];
        const widthMatch = svgTag.match(/width="([^"%]+)"/); // Avoid matching percentages
        const heightMatch = svgTag.match(/height="([^"%]+)"/); // Avoid matching percentages
        
        if (widthMatch && heightMatch && widthMatch[1] && heightMatch[1]) {
          const width = widthMatch[1];
          const height = heightMatch[1];
          // Simple check for numeric values (can be extended)
          if (!isNaN(parseFloat(width)) && !isNaN(parseFloat(height))) {
            const viewBoxValue = `0 0 ${width} ${height}`;
            const modifiedSvgTag = svgTag.replace('<svg', `<svg viewBox="${viewBoxValue}"`);
            processedSvgText = processedSvgText.replace(svgTag, modifiedSvgTag);
            logger.info('Added missing viewBox attribute', { width, height });
          } else {
            logger.warn('Could not add viewBox: width/height attributes are not valid numbers.', { width, height });
          }
        } else {
          logger.warn('Could not add viewBox: width/height attributes not found or invalid in <svg> tag.');
        }
      }
    }
    // --- Add viewBox if missing --- END

    // Sanitize the potentially modified SVG content
    const sanitizedSvg = sanitizeSvg(processedSvgText);
    
    // Return the sanitized SVG with appropriate content type
    return new Response(sanitizedSvg, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('Error in proxy-svg endpoint', { error });
    return new Response('Error fetching SVG content', { status: 500 });
  }
}
