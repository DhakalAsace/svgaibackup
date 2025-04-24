import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { Database } from '@/types/database.types';

// Import security utilities
import { checkAdminAuth } from '@/lib/admin-auth';
import { createLogger } from '@/lib/logger';
import { createErrorResponse, unauthorized, forbidden } from '@/lib/error-handler';

// Initialize logger
const logger = createLogger('api:apply-migration');

type MigrationType = 'profiles' | 'svg_permissions';

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const { isAuthenticated, isAdmin, user } = await checkAdminAuth();
    
    if (!isAuthenticated) {
      logger.warn('Unauthenticated migration attempt');
      return unauthorized('Authentication required to perform database migrations');
    }
    
    if (!isAdmin) {
      logger.warn('Non-admin migration attempt', { userId: user?.id });
      return forbidden('Admin privileges required to perform database migrations');
    }
    
    // Parse the request body to get the migration type
    const { migrationType = 'profiles' } = await request.json();
    
    // Log the migration attempt
    logger.info('Admin migration initiated', { 
      migrationType, 
      userId: user?.id 
    });
    
    // Create an admin client with service role for migrations
    // This is more appropriate than the route handler client which operates at user privilege level
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    
    // Determine which migration file to use
    let migrationPath: string;
    if (migrationType === 'svg_permissions') {
      migrationPath = path.join(process.cwd(), 'migrations', 'update_svg_designs_permissions.sql');
    } else {
      migrationPath = path.join(process.cwd(), 'migrations', 'create_profiles_table.sql');
    }
    
    // Read the migration file
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration directly using SQL with admin client
    // Cast to any to bypass TypeScript constraints for the custom RPC function
    const { error } = await (supabaseAdmin as any).rpc('pgSQL', { query: migrationSql });
    
    // If the rpc method doesn't exist, try direct SQL execution
    if (error && error.message.includes('function "pgsql" does not exist')) {
      // Split the SQL into individual statements
      const statements = migrationSql.split(';').filter(stmt => stmt.trim());
      
      // Execute each statement separately
      for (const stmt of statements) {
        if (stmt.trim()) {
          const { error: stmtError } = await (supabaseAdmin as any).rpc('pgSQL', { query: stmt + ';' });
          if (stmtError) {
            // Skip errors about objects already existing
            if (!stmtError.message.includes('already exists')) {
              logger.error('Statement error', { error: stmtError, statement: stmt });
              const { response, status } = createErrorResponse(stmtError, 'Migration statement failed', 500);
              return NextResponse.json(response, { status });
            }
          }
        }
      }
    } else if (error) {
      logger.error('Migration error', { error });
      const { response, status } = createErrorResponse(error, 'Migration failed', 500);
      return NextResponse.json(response, { status });
    }
    
    // Log successful migration
    logger.info('Migration completed successfully', { migrationType, userId: user?.id });
    
    return NextResponse.json({ 
      success: true, 
      message: `${migrationType === 'svg_permissions' ? 'SVG permissions' : 'Profiles table'} migration applied successfully` 
    });
  } catch (error: any) {
    logger.error('Error applying migration', { error });
    const { response, status } = createErrorResponse(error, 'Migration failed', 500);
    return NextResponse.json(response, { status });
  }
}

export async function GET() {
  try {
    // Check admin authentication - same security model as POST
    const { isAuthenticated, isAdmin, user } = await checkAdminAuth();
    
    if (!isAuthenticated) {
      logger.warn('Unauthenticated table check attempt');
      return unauthorized('Authentication required');
    }
    
    if (!isAdmin) {
      logger.warn('Non-admin table check attempt', { userId: user?.id });
      return forbidden('Admin privileges required');
    }
    
    // Create an admin client for checking table existence
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    
    // Check if profiles table exists using RPC for more flexibility with table names
    // that might not be in the Database type definition
    const { data, error } = await (supabaseAdmin as any).rpc('check_table_exists', {
      table_name: 'profiles'
    });
    
    if (error && !error.message.includes('does not exist')) {
      throw error;
    }
    
    const tableExists = !error;
    
    logger.info('Table existence check', { 
      table: 'profiles', 
      exists: tableExists, 
      userId: user?.id 
    });
    
    return NextResponse.json({ 
      success: true, 
      tableExists,
      message: tableExists ? 'Profiles table exists' : 'Profiles table does not exist'
    });
  } catch (error: any) {
    logger.error('Error checking profiles table', { error });
    const { response, status } = createErrorResponse(error, 'Failed to check table existence', 500);
    return NextResponse.json(response, { status });
  }
}
