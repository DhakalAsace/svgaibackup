import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { PRICE_TO_TIER } from '@/lib/stripe-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

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

// Simple in-memory cache to prevent duplicate sync calls
const syncCache = new Map<string, { timestamp: number; result: any }>();
const CACHE_DURATION = 5000; // 5 seconds

export async function POST(req: NextRequest) {
  try {
    const supabase = await createRouteClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check cache to prevent duplicate calls
    const cacheKey = `sync-${user.id}`;
    const cachedResult = syncCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      console.info(`Returning cached sync result for user ${user.id}`);
      return NextResponse.json(cachedResult.result);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer ID found' }, { status: 400 });
    }

    // Get all active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscriptions found' }, { status: 404 });
    }

    // Take the most recent subscription
    const subscription = subscriptions.data[0];

    // Stripe removed current_period_start/end from the Subscription object in newer API versions.
    // Retrieve them from the first subscription item instead.
    const firstItem = subscription.items.data[0];
    const currentPeriodStartUnix = (firstItem as any).current_period_start as number | undefined;
    const currentPeriodEndUnix = (firstItem as any).current_period_end as number | undefined;

    const priceId = subscription.items.data[0]?.price.id;
    
    // Determine tier and credits
    let tier = 'starter';
    let credits = 100;
    
    if (priceId && PRICE_TO_TIER[priceId]) {
      const tierInfo = PRICE_TO_TIER[priceId];
      tier = tierInfo.tier;
      credits = tierInfo.credits;
    } else {
      // Fallback to price amount
      const amount = subscription.items.data[0]?.price.unit_amount;
      if (amount === 3900 || amount === 36000) {
        tier = 'pro';
        credits = 350;
      } else if (amount === 1900 || amount === 16800) {
        tier = 'starter';
        credits = 100;
      }
    }

    // Check if user already has billing_day set
    const { data: currentProfile } = await supabaseAdmin
      .from('profiles')
      .select('billing_day')
      .eq('id', user.id)
      .single();

    // Update profile
    const updateData: any = {
      subscription_status: subscription.status,
      subscription_tier: tier,
      subscription_id: subscription.id,
      current_period_end: currentPeriodEndUnix
        ? new Date(currentPeriodEndUnix * 1000).toISOString()
        : null,
      monthly_credits: credits,
      // Don't reset monthly_credits_used here, only on billing cycle
    };
    
    // Set billing_day if not already set
    if (!currentProfile?.billing_day && currentPeriodStartUnix) {
      const startDate = new Date(currentPeriodStartUnix * 1000);
      updateData.billing_day = startDate.getDate();
    }
    
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (profileError) throw profileError;

    // Create or update subscription record
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: profile.stripe_customer_id,
        status: subscription.status,
        tier,
        stripe_price_id: priceId,
        current_period_start: currentPeriodStartUnix
          ? new Date(currentPeriodStartUnix * 1000).toISOString()
          : null,
        current_period_end: currentPeriodEndUnix
          ? new Date(currentPeriodEndUnix * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_subscription_id'
      });

    if (subError) throw subError;

    const result = { 
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        tier,
        credits,
        current_period_end: currentPeriodEndUnix
          ? new Date(currentPeriodEndUnix * 1000).toISOString()
          : null,
      }
    };

    // Cache the successful result
    syncCache.set(cacheKey, {
      timestamp: Date.now(),
      result
    });

    // Clean up old cache entries periodically
    if (syncCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of syncCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION * 2) {
          syncCache.delete(key);
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Sync subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to sync subscription' },
      { status: 500 }
    );
  }
}