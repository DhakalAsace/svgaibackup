import { createRouteClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// Auth routes must be dynamic to set cookies
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  try {
    if (code) {
      const supabase = await createRouteClient();

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("[Auth Callback] Error exchanging code for session:", error);
        return NextResponse.redirect(new URL("/login?error=auth_error", request.url));
      }

      // Default redirect URL - changed to homepage instead of dashboard
      let finalRedirectUrl = "/";

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