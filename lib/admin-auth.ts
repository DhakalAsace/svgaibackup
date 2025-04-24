/**
 * Admin Authentication Utility
 * 
 * This module provides functionality to verify if a user has admin privileges.
 * It checks the user's session and compares the user ID against a list of
 * authorized admin user IDs.
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

/**
 * Result of admin authentication check
 */
export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    email?: string;
  } | null;
}

/**
 * Check if a user is authenticated and has admin privileges
 * 
 * @returns Object containing authentication status and user information
 */
export async function checkAdminAuth(): Promise<AdminAuthResult> {
  try {
    // Get current session from cookies
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return { isAuthenticated: false, isAdmin: false, user: null };
    }
    
    // Get admin user IDs from environment variable
    // These should be set in .env.local as a comma-separated list
    const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || [];
    
    // Check if user is in admin list
    const isAdmin = ADMIN_USER_IDS.includes(session.user.id);
    
    return { 
      isAuthenticated: true, 
      isAdmin, 
      user: {
        id: session.user.id,
        email: session.user.email
      }
    };
  } catch (error) {
    console.error('Admin auth check error:', error);
    return { isAuthenticated: false, isAdmin: false, user: null };
  }
}
