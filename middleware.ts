import { createMiddlewareClient } from '@/lib/supabase-middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getConverterTrafficCategory } from '@/lib/converter-traffic-groups'
import { findRedirect, findGoneRule, normalizeTrailingSlash } from '@/lib/redirects'

// Define paths that require authentication
// Note: We're only protecting dashboard and settings now
// SVG generation and download are accessible without authentication
const protectedPaths = ['/dashboard', '/settings'];
const authPaths = ['/login', '/signup'];

// Paths that should be excluded from auth checks completely
const publicPaths = ['/auth/callback', '/_next', '/api', '/favicon.ico', '/site.webmanifest'];

// Static asset file extensions that should get cache headers
const STATIC_EXTENSIONS = ['.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2'];

export async function middleware(request: NextRequest) {
  // Handle cache control for static assets
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Create base response with security headers
  const baseResponse = NextResponse.next();
  
  // Add security headers to all responses
  baseResponse.headers.set('X-Frame-Options', 'DENY');
  baseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  baseResponse.headers.set('X-XSS-Protection', '1; mode=block');
  baseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  baseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy - balanced security with functionality
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : '';
  
  // Secure CSP policy
  const csp = [
    // Default policy - only allow same origin
    "default-src 'self'",
    // Scripts - allow self, Next.js, Vercel Analytics, and necessary inline scripts
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-scripts.com https://vercel.live https://va.vercel-scripts.com https://challenges.cloudflare.com",
    // Styles - allow self and inline styles (required for styled-components and Tailwind)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Images - allow various sources for user uploads and external images
    "img-src 'self' data: blob: https: http:",
    // Fonts - allow Google Fonts and self
    "font-src 'self' https://fonts.gstatic.com data:",
    // Connect - allow API calls to necessary services
    `connect-src 'self' ${supabaseHost ? `https://${supabaseHost} wss://${supabaseHost}` : ''} https://api.replicate.com https://fal.run https://*.fal.run https://api.stripe.com https://vercel.live https://vitals.vercel-insights.com https://challenges.cloudflare.com https://*.supabase.co wss://*.supabase.co`,
    // Media - allow self and blob for video generation
    "media-src 'self' blob:",
    // Workers - allow blob for web workers
    "worker-src 'self' blob:",
    // Frame ancestors - prevent clickjacking
    "frame-ancestors 'none'",
    // Frame sources - allow Stripe for payment processing
    "frame-src https://checkout.stripe.com https://js.stripe.com https://challenges.cloudflare.com",
    // Form action - restrict form submissions
    "form-action 'self'",
    // Base URI - restrict base tag
    "base-uri 'self'",
    // Object source - no plugins
    "object-src 'none'",
    // Upgrade insecure requests
    "upgrade-insecure-requests"
  ].join('; ');
  
  baseResponse.headers.set('Content-Security-Policy', csp);
  
  // HSTS (Strict Transport Security)
  baseResponse.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // COOP (Cross-Origin-Opener-Policy)
  baseResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // CORP (Cross-Origin-Resource-Policy) 
  baseResponse.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // Handle redirects first
  // Check for trailing slash normalization
  const normalizedPath = normalizeTrailingSlash(pathname);
  if (normalizedPath) {
    const redirectUrl = new URL(normalizedPath, request.url);
    redirectUrl.search = url.search; // Preserve query params
    const redirectResponse = NextResponse.redirect(redirectUrl, 301);
    // Copy security headers to redirect response
    baseResponse.headers.forEach((value, key) => {
      redirectResponse.headers.set(key, value);
    });
    return redirectResponse;
  }

  // Check for configured redirects
  const redirect = findRedirect(pathname);
  if (redirect) {
    const redirectUrl = new URL(redirect.destination, request.url);
    redirectUrl.search = url.search; // Preserve query params
    return NextResponse.redirect(redirectUrl, redirect.statusCode || (redirect.permanent ? 301 : 302));
  }

  // Check for gone pages (410)
  const goneRule = findGoneRule(pathname);
  if (goneRule) {
    return new NextResponse(
      JSON.stringify({
        error: 'Gone',
        message: goneRule.message || 'This page has been permanently removed.',
        statusCode: 410
      }),
      {
        status: 410,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=31536000' // Cache 410s for a year
        }
      }
    );
  }

  // Handle converter pages with traffic-based cache headers
  if (pathname.startsWith('/convert/') && pathname.split('/').length === 3) {
    const converterSlug = pathname.split('/')[2];
    const category = getConverterTrafficCategory(converterSlug);
    if (category) {
      // Continue with the request but we'll set cache headers in the page
      const response = NextResponse.next();
      // Set cache headers based on traffic category
      const revalidateSeconds = category === 'high' ? 900 : category === 'medium' ? 1800 : 3600;
      // These headers will be used by CDN/Edge
      response.headers.set('X-Converter-Category', category);
      response.headers.set('X-Revalidate-Seconds', revalidateSeconds.toString());
      // Note: Cache-Control headers should be set in the page component
      // as middleware headers might be overridden
      return response;
    }
  }

  // Handle Next.js static files with proper Content-Type
  if (pathname.startsWith('/_next/static/css/')) {
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'text/css; charset=utf-8');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }
  
  // Apply efficient cache policy to static assets
  if (STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    // Skip auth check for static assets and just add cache headers
    const response = baseResponse;
    const fileType = pathname.split('.').pop() || '';
    
    // Set correct Content-Type for CSS files to prevent MIME type errors
    if (fileType === 'css') {
      response.headers.set('Content-Type', 'text/css; charset=utf-8');
    }
    
    // Set longer cache for fonts and images, shorter for JS/CSS that might change more often
    const maxAge = ['woff', 'woff2', 'png', 'jpg', 'jpeg', 'gif', 'svg'].includes(fileType) 
      ? 60 * 60 * 24 * 30 // 30 days for fonts/images
      : 60 * 60 * 24 * 7;  // 7 days for JS/CSS
    
    response.headers.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=86400`);
    return response;
  }

  // Add security headers for payment endpoints
  if (pathname.startsWith('/api/webhooks/stripe') || 
      pathname.startsWith('/api/create-checkout-session') || 
      pathname.startsWith('/api/create-portal-session')) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    return response;
  }

  // Skip middleware for auth callback endpoint - this is critical
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // For auth callback, we still need to ensure cookies are properly set
    if (pathname.startsWith('/auth/callback')) {
      const res = NextResponse.next();
      // Allow cookies to be set properly for PKCE flow
      res.headers.set('Cache-Control', 'no-store, must-revalidate');
      return res;
    }
    return NextResponse.next();
  }

  // Use the base response with security headers
  const res = baseResponse;

  // Create a Supabase client specifically for use in middleware
  const supabase = createMiddlewareClient(request, res);

  try {
    // This both refreshes the session if needed and gets the current session
    const { data: { session } } = await supabase.auth.getSession();

    // If user is logged in and trying to access login/signup pages, redirect to dashboard
    if (session && authPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not logged in and accessing a protected path, redirect to login
    if (!session && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // For all other cases, continue with the response as is
    return res;
  } catch (error) {
    return res;
  }
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - But DO match for public/speed-insights and other JS files we want to cache
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/public/speed-insights/:path*',
    '/:path*.js',
    '/:path*.css',
    '/:path*.svg' // Add SVG files to be properly handled by middleware
  ],
}