import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Vercel Cron job for video cleanup
// Configure in vercel.json to run daily

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Call the cleanup function
    const { data: cleanupResult, error: cleanupError } = await supabase
      .rpc('cleanup_expired_videos');

    if (cleanupError) {
      console.error('Error cleaning up videos:', cleanupError);
      return NextResponse.json({ 
        error: 'Cleanup failed', 
        details: cleanupError.message 
      }, { status: 500 });
    }

    // Get cleanup status
    const { data: status, error: statusError } = await supabase
      .rpc('get_cleanup_status');

    if (statusError) {
      console.error('Error getting cleanup status:', statusError);
    }

    // Trigger Edge Function to process storage cleanup queue
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/scheduled-storage-cleanup`;
    const edgeResponse = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const edgeResult = await edgeResponse.json();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cleanup_status: status?.[0] || {},
      storage_cleanup: edgeResult
    });

  } catch (error) {
    console.error('Unexpected error in cleanup cron job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}