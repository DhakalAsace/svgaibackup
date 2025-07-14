import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Import security utilities
import { checkAdminAuth } from '@/lib/admin-auth';
import { createLogger } from '@/lib/logger';
import { 
  createErrorResponse, 
  unauthorized, 
  forbidden, 
  badRequest, 
  createSuccessResponse, 
  successResponse 
} from '@/lib/error-handler';

export const dynamic = "force-static";

// Initialize logger
const logger = createLogger('api:delete-user');

// Get required environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Needed for user client
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate critical environment variables
if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!supabaseServiceRoleKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  
  logger.error('Missing required environment variables', { 
    missingVariables: missingVars.join(', ') 
  });
  
  // In production, we'll throw an error during initialization
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Server configuration error: Missing ${missingVars.join(', ')}`);
  }
}

export async function POST(request: Request) {
  logger.info('Received user deletion request');

  let userId: string | undefined;
  let requestingUserId: string | undefined;
  let requestBody: any;

  // --- Parse request body ---
  try {
    requestBody = await request.json();

    // Validate request body
    if (!requestBody || typeof requestBody !== 'object') {
      logger.warn('Invalid request body format');
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Extract userIdToDelete from request body
    userId = requestBody.userIdToDelete;
    if (!userId) {
      logger.warn('Missing userIdToDelete in request');
      return NextResponse.json({ error: 'User ID to delete is required' }, { status: 400 });
    }
  } catch (error) {
    logger.error('Failed to parse request body', { error });
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }

  // --- Check authentication and authorization ---
  try {
    // First verify the user is authenticated and has admin privileges
    const { isAuthenticated, isAdmin, user } = await checkAdminAuth();
    
    if (!isAuthenticated) {
      logger.warn('Unauthenticated user deletion attempt');
      return unauthorized('Authentication required');
    }
    
    requestingUserId = user?.id;
    
    // Only allow user to delete themselves OR admin to delete any user
    if (!isAdmin && userId !== requestingUserId) {
      logger.warn('Unauthorized deletion attempt', { 
        requestingUserId, 
        targetUserId: userId 
      });
      return forbidden('You can only delete your own account unless you are an admin');
    }
    
    logger.info('Authorized user deletion attempt', { 
      requestingUserId,
      targetUserId: userId,
      isAdmin
    });

    // Verify environment variables are available during request
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      logger.error('Missing required environment variables during request');
      return badRequest('Server configuration error');
    }
    
    // Create authenticated admin client with service role (used for DB operations)
    // SECURITY: Initialize with validated environment variables
    // Use any type to avoid strict typing issues with tables that might not be in the Database type
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Step 1: Delete user's SVG designs
    logger.info('Deleting user SVG designs', { userId });
    const { error: deleteSVGsError } = await supabaseAdmin
      .from('svg_designs')
      .delete()
      .eq('user_id', userId);

    if (deleteSVGsError) {
      logger.warn('Error deleting user SVG designs', { userId, error: deleteSVGsError });
      // Continue with user deletion even if SVG designs deletion fails
    }

    // Step 2: Delete user profile data (if exists)
    logger.info('Deleting user profile', { userId });
    try {
      // SECURITY: Use a more generic typing approach for tables that might not be in the Database type
      // This avoids type errors without compromising security
      const profilesResult = await (supabaseAdmin as any)
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      const deleteProfileError = profilesResult.error;

      if (deleteProfileError && !deleteProfileError.message.includes('relation "profiles" does not exist')) {
        // Log error only if it's not just "table doesn't exist"
        logger.warn('Error deleting user profile', { userId, error: deleteProfileError });
      }
    } catch (profileError) {
      // If we get an error from the profiles table not existing in the type, just log and continue
      logger.warn('Error accessing profiles table', { profileError });
    }

    // Step 3: Delete the user from auth.users
    logger.info('Deleting auth user', { userId });
    const { data: deletionData, error: deleteAuthUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthUserError) {
      logger.error('Error deleting auth user', { userId, error: deleteAuthUserError });
      const { response, status } = createErrorResponse(deleteAuthUserError, 'Failed to delete user account', 500);
      return NextResponse.json(response, { status });
    }

    logger.info(`Successfully deleted user and associated data`, {
      wasAdmin: isAdmin,
      targetUser: userId
    });
    
    // Create a standardized success response using our utilities
    const result = createSuccessResponse({ 
      message: 'User and associated data deleted successfully' 
    });
    
    return successResponse(result);

  } catch (error) {
    // SECURITY: Sanitize error objects before logging to prevent token leakage
    const sanitizedError = sanitizeErrorForLogging(error);
    
    logger.error('Error deleting user', { error: sanitizedError });
    
    // Use genericized error message in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Failed to delete user and associated data' 
      : (error instanceof Error ? error.message : 'Unknown error');
    
    const { response, status } = createErrorResponse(
      null, // Never pass the raw error object to prevent token leakage
      errorMessage,
      500
    );
    
    return NextResponse.json(response, { status });
  }
}

/**
 * Sanitizes error objects to prevent leaking sensitive information in logs
 * Removes any properties that might contain API tokens or credentials
 */
function sanitizeErrorForLogging(error: unknown): any {
  if (error instanceof Error) {
    // Create a sanitized copy of the error
    const sanitized: Record<string, any> = {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    // If error has a cause property, recursively sanitize it
    if ('cause' in error && error.cause) {
      sanitized['cause'] = sanitizeErrorForLogging(error.cause);
    }
    
    return sanitized;
  }
  
  if (typeof error === 'object' && error !== null) {
    // Create a new object to avoid modifying the original
    const sanitized: Record<string, any> = {};
    
    // Copy only safe properties, excluding any that might contain tokens
    for (const [key, value] of Object.entries(error)) {
      // Skip properties that might contain sensitive data
      if (
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('key') ||
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('credential')
      ) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = sanitizeErrorForLogging(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  // For primitive values or null
  return error;
}
