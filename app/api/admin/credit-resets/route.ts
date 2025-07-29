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

    // Fetch active subscribers using admin client (bypasses RLS)
    // First get the profiles
    const { data: subscribers, error: subError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .not('subscription_tier', 'is', null)
      .eq('subscription_status', 'active')
      .order('credits_reset_at', { ascending: false });

    if (subError) {
      console.error('Error fetching subscribers:', subError);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    // Get emails from auth.users for each subscriber
    const subscribersWithEmail = await Promise.all(
      (subscribers || []).map(async (profile) => {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        return {
          ...profile,
          email: authUser?.user?.email || 'Unknown'
        };
      })
    );

    // Fetch subscription details
    const { data: subscriptions, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id, stripe_price_id, current_period_start, current_period_end')
      .eq('status', 'active');

    if (subscriptionError) {
      console.error('Error fetching subscriptions:', subscriptionError);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    // Check cron job status
    const { data: cronData, error: cronError } = await supabaseAdmin
      .rpc('get_cron_job_status', { job_name: 'reset-annual-subscriber-credits' });

    return NextResponse.json({
      subscribers: subscribersWithEmail || [],
      subscriptions: subscriptions || [],
      cronStatus: cronData?.[0] || null,
    });
  } catch (error) {
    console.error('Admin credit resets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}