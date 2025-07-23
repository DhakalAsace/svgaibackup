import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Price IDs from your Stripe account
const PRICE_IDS = {
  starter_monthly: 'price_NEW_STARTER_MONTHLY', // Replace with actual
  starter_annual: 'price_NEW_STARTER_ANNUAL',   // Replace with actual
  pro_monthly: 'price_NEW_PRO_MONTHLY',         // Replace with actual
  pro_annual: 'price_NEW_PRO_ANNUAL',           // Replace with actual
};

export async function POST(req: NextRequest) {
  const supabase = await createRouteClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, newTier, newInterval } = await req.json();

  // Get user's Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, subscription_tier, subscription_status')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
  }

  if (profile.subscription_status !== 'active' && profile.subscription_status !== 'trialing') {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  try {
    // Get the customer's active subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    const subscription = subscriptions.data[0];

    if (action === 'cancel') {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });
    } else if (action === 'change_plan') {
      // Schedule plan change for end of period
      const newPriceId = PRICE_IDS[`${newTier}_${newInterval}` as keyof typeof PRICE_IDS];
      
      await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'none', // No proration, change at period end
        billing_cycle_anchor: 'unchanged',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}