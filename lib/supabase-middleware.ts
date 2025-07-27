import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "@/types/database.types";

export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              name,
              value,
              ...options,
              sameSite: 'lax' as const,
              secure: process.env.NODE_ENV === 'production',
              httpOnly: false, // Allow client-side access for PKCE
            };
            request.cookies.set(cookieOptions);
            response.cookies.set(cookieOptions);
          });
        },
      },
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
      },
    }
  );
}