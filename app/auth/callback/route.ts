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
      
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      console.error("[Auth Callback] No code parameter in callback URL");
      return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }
  } catch (error) {
    console.error("[Auth Callback] Unexpected error in auth callback:", error);
    return NextResponse.redirect(new URL("/login?error=unexpected", request.url));
  }
}
