import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAdminAuth } from '@/lib/admin-auth';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(req: NextRequest) {
  try {
    // Check admin auth
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get cron job monitoring data
    const { data: cronJobs, error: cronError } = await supabaseAdmin
      .rpc('monitor_cron_jobs');

    if (cronError) {
      console.error('Error fetching cron job data:', cronError);
      return NextResponse.json({ error: 'Failed to fetch cron job data' }, { status: 500 });
    }

    // Get recent logs for detailed view
    const { data: recentLogs, error: logsError } = await supabaseAdmin
      .from('cron_job_logs')
      .select('*')
      .order('execution_time', { ascending: false })
      .limit(50);

    if (logsError) {
      console.error('Error fetching logs:', logsError);
    }

    return NextResponse.json({
      cronJobs: cronJobs || [],
      recentLogs: recentLogs || [],
    });
  } catch (error) {
    console.error('Admin cron monitor API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin auth
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, jobName } = await req.json();

    if (action === 'test') {
      // Manually trigger a cron job for testing
      let result;
      
      switch (jobName) {
        case 'reset-annual-subscriber-credits':
          const { error: resetError } = await supabaseAdmin
            .rpc('cron_reset_annual_credits');
          if (resetError) throw resetError;
          result = 'Credit reset job executed';
          break;
          
        case 'cleanup-expired-videos':
          const { error: videoError } = await supabaseAdmin
            .rpc('cleanup_expired_videos');
          if (videoError) throw videoError;
          result = 'Video cleanup job executed';
          break;
          
        case 'cleanup-old-svg-designs':
          const { error: svgError } = await supabaseAdmin
            .rpc('cleanup_old_svg_designs');
          if (svgError) throw svgError;
          result = 'SVG cleanup job executed';
          break;
          
        default:
          return NextResponse.json({ error: 'Unknown job' }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Cron job test error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Test failed' },
      { status: 500 }
    );
  }
}