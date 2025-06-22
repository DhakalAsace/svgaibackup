import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/database.types";

// Auth routes must be dynamic to set cookies
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  console.log("[Auth Callback] Processing auth callback with code:", code ? "Code present" : "No code");
  
  try {
    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("[Auth Callback] Error exchanging code for session:", error);
        return NextResponse.redirect(new URL("/login?error=auth_error", request.url));
      }
      
      console.log("[Auth Callback] Session established successfully:", data.session ? "Session present" : "No session");
      
      // Default redirect URL
      let finalRedirectUrl = "/dashboard";
      
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
