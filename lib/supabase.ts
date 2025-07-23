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
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Backward compatibility export for components using old auth-helpers
// Ignoring the generic type parameter since we always use Database type
export function createClientComponentClient<T = any>() {
  return createBrowserClient()
}

// Alias for backward compatibility
export const createClient = createServerClient
