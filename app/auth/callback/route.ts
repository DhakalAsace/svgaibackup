import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import { Database } from '@/types/database.types'

// Auth routes must be dynamic to set cookies
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next") ?? "/";

  try {
    // Handle error cases first
    if (error) {
      console.error("[Auth Callback] Auth error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(`/login?error=${error}&description=${encodeURIComponent(errorDescription || '')}`, request.url)
      );
    }

    if (code) {
      const cookieStore = await cookies();
      
      // Create a Supabase client with proper cookie handling for PKCE
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, {
                    ...options,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: false, // Important for PKCE
                  })
                })
              } catch {
                // Server Component may have restrictions
              }
            },
          },
        }
      )

      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error("[Auth Callback] Error exchanging code for session:", sessionError);
        // More specific error handling
        if (sessionError.message?.includes('code verifier')) {
          return NextResponse.redirect(new URL("/login?error=pkce_error&message=Please+try+signing+in+again", request.url));
        }
        return NextResponse.redirect(new URL("/login?error=auth_error", request.url));
      }

      // Default redirect URL - redirect to dashboard for authenticated users
      const finalRedirectUrl = "/dashboard";

      // For OAuth flows, we store the redirect path in localStorage
      // This is retrieved client-side after redirect
      // Note: We can't access localStorage in route handlers, so the client
      // will handle the final redirect based on stored path

      // Redirect to the appropriate page after successful authentication
      return NextResponse.redirect(new URL(finalRedirectUrl, request.url));
    } else {
      console.error("[Auth Callback] No code parameter in callback URL");
      return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }
  } catch (error) {
    console.error("[Auth Callback] Unexpected error in auth callback:", error);
    return NextResponse.redirect(new URL("/login?error=unexpected", request.url));
  }
}