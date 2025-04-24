import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  // Apply efficient cache policy to static assets
  if (STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    // Skip auth check for static assets and just add cache headers
    const response = NextResponse.next();
    const fileType = pathname.split('.').pop() || '';
    
    // Debug info for SVG files to help identify issues
    if (fileType === 'svg') {
      console.log(`[Middleware] Handling SVG: ${pathname}`);
    }
    
    // Set longer cache for fonts and images, shorter for JS/CSS that might change more often
    const maxAge = ['woff', 'woff2', 'png', 'jpg', 'jpeg', 'gif', 'svg'].includes(fileType) 
      ? 60 * 60 * 24 * 30 // 30 days for fonts/images
      : 60 * 60 * 24 * 7;  // 7 days for JS/CSS
    
    response.headers.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=86400`);
    return response;
  }
  
  // Skip middleware for auth callback endpoint - this is critical
  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log(`[Middleware] Bypassing middleware for public path: ${pathname}`);
    return NextResponse.next();
  }
  
  // Create a response object that we'll modify and return
  const res = NextResponse.next();
  
  // Create a Supabase client specifically for use in middleware
  const supabase = createMiddlewareClient({ req: request, res });
  
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
  
  try {
    // This both refreshes the session if needed and gets the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log('[Middleware] Session:', session ? `User ID: ${session.user.id}` : 'No session');
    
    // If user is logged in and trying to access login/signup pages, redirect to dashboard
    if (session && authPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      console.log('[Middleware] Logged in user accessing auth path, redirecting to dashboard.');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // If user is not logged in and accessing a protected path, redirect to login
    if (!session && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      console.log('[Middleware] Unauthenticated user accessing protected path, redirecting to login.');
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // For all other cases, continue with the response as is
    console.log('[Middleware] Access granted.');
    return res;
  } catch (error) {
    console.error('[Middleware] Error:', error);
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
