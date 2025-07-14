import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
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
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, newTier, newInterval } = await req.json();

  // Get user's current subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_id, stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.subscription_id) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);

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