import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const runtime = 'edge';

interface RedirectLog {
  source: string;
  destination: string;
  referrer?: string;
  userAgent?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RedirectLog;
    
    // Log redirect event for analytics
    console.log('Redirect logged:', {
      ...body,
      timestamp: new Date().toISOString(),
    });
    
    // You can also store this in Supabase for analytics
    try {
      const supabase = createServerClient();
      await supabase.from('redirect_logs').insert({
        source_url: body.source,
        destination_url: body.destination,
        referrer: body.referrer,
        user_agent: body.userAgent,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      // Log error but don't fail the request
      console.error('Failed to store redirect log:', dbError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redirect monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to log redirect' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const supabase = createServerClient();
    
    // Get redirect analytics
    const { data: redirects, error } = await supabase
      .from('redirect_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    // Group by source URL for analytics
    const analytics = redirects?.reduce((acc: any, log: any) => {
      if (!acc[log.source_url]) {
        acc[log.source_url] = {
          source: log.source_url,
          destination: log.destination_url,
          count: 0,
          referrers: new Set(),
        };
      }
      acc[log.source_url].count++;
      if (log.referrer) {
        acc[log.source_url].referrers.add(log.referrer);
      }
      return acc;
    }, {});
    
    // Convert to array and add referrer count
    const analyticsArray = Object.values(analytics || {}).map((item: any) => ({
      ...item,
      referrerCount: item.referrers.size,
      referrers: Array.from(item.referrers),
    }));
    
    return NextResponse.json({
      redirects: analyticsArray,
      total: analyticsArray.length,
    });
  } catch (error) {
    console.error('Failed to fetch redirect analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}