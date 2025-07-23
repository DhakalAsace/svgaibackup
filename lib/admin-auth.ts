/**
 * Admin Authentication Utility
 * 
 * This module provides functionality to verify if a user has admin privileges.
 * It checks the user's session and compares the user ID against a list of
 * authorized admin user IDs.
 */

import { createServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

/**
 * Check if a user is authenticated and has admin privileges
 * 
 * @returns Boolean indicating if the user is an admin
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    // Get current session from cookies
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return false;
    }
    
    // Get admin user IDs from environment variable
    // These should be set in .env.local as a comma-separated list
    const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',').map(id => id.trim()) || [];
    
    // Check if user is in admin list
    return ADMIN_USER_IDS.includes(user.id);
  } catch (error) {
    console.error('Admin auth check error:', error);
    return false;
  }
}