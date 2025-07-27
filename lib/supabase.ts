import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { type Database } from '@/types/database.types'

// For server-side usage with direct API access (service role)
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase server environment variables')
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}

// For client components - uses @supabase/ssr
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase client environment variables')
  }


  return createSupabaseBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        debug: process.env.NODE_ENV === 'development',
        storage: {
          getItem: (key: string) => {
            if (typeof window !== 'undefined') {
              return window.localStorage.getItem(key);
            }
            return null;
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, value);
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(key);
            }
          }
        }
      },
    }
  )
}

// Backward compatibility export for components using old auth-helpers
// Ignoring the generic type parameter since we always use Database type
export function createClientComponentClient<T = any>() {
  return createBrowserClient()
}

// Alias for backward compatibility
export const createClient = createServerClient
