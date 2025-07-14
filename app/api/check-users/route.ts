import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Import security utilities
import { checkAdminAuth } from '@/lib/admin-auth';
import { createLogger } from '@/lib/logger';
import { createErrorResponse, unauthorized, forbidden } from '@/lib/error-handler';

export const dynamic = "force-static";

// Initialize logger
const logger = createLogger('api:check-users');

// Define the user type based on the fields we're selecting - more limited for security
type LimitedAuthUser = {
  id: string;
  created_at: string;
  last_sign_in_at: string | null;
  // Removed email, app_metadata, and user_metadata for security
};

/**
 * API route to fetch users from the auth.users table
 * Uses the service role key to access the auth schema
 */

export async function GET() {
  try {
    // Check admin authentication
    const { isAuthenticated, isAdmin, user } = await checkAdminAuth();
    
    if (!isAuthenticated) {
      logger.warn('Unauthenticated user data access attempt');
      return unauthorized('Authentication required');
    }
    
    if (!isAdmin) {
      logger.warn('Non-admin user data access attempt', { userId: user?.id });
      return forbidden('Admin privileges required');
    }
    
    // Log the authorized access
    logger.info('Admin accessing user data', { adminId: user?.id });
    
    // Create Supabase client with service role for auth schema access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    // Execute the query to fetch users with MINIMAL data for security
    // Removed email, app_metadata, and user_metadata fields
    const { data: users, error } = await (supabaseAdmin as any)
      .from('auth.users')
      .select('id, created_at, last_sign_in_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      logger.error('Error fetching users', { error });
      const { response, status } = createErrorResponse(error, 'Failed to fetch users', 500);
      return NextResponse.json(response, { status });
    }
    
    // Type assertion with limited fields
    const typedUsers = users as LimitedAuthUser[];
    
    return NextResponse.json({ 
      users: typedUsers,
      totalCount: typedUsers.length,
      note: 'Limited user data returned for security purposes'
    });
  } catch (error) {
    logger.error('Unexpected error in user data access', { error });
    const { response, status } = createErrorResponse(error, 'Internal server error', 500);
    return NextResponse.json(response, { status });
  }
}
