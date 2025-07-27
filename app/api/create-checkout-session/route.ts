import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import Stripe from 'stripe';
import { STRIPE_CONFIG } from '@/lib/stripe-config';
import { logPaymentEvent } from '@/lib/payment-audit';
import { rateLimiters } from '@/lib/rate-limit';
import { createCheckoutSessionSchema, validateRequestBody } from '@/lib/validation-schemas';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});


export async function POST(req: NextRequest) {
  try {
    const supabase = await createRouteClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    const identifier = user.id;
    const { success } = await rateLimiters.checkout.limit(identifier);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }

    // Validate request body
    const { data: validatedData, error: validationError } = await validateRequestBody(req, createCheckoutSessionSchema);
    
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    
    const { tier, interval } = validatedData!;

    // Get user profile to check for existing Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Update profile with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Prevent duplicate subscriptions: check for any active subscriptions
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 10,
    });

    console.log(`Checking subscriptions for ${user.email} (${customerId}): found ${existingSubs.data.length} active subscriptions`);

    // Check if there's a truly active subscription (not cancelled)
    const hasActiveNonCancelledSub = existingSubs.data.some(
      sub => sub.status === 'active' && !sub.cancel_at_period_end
    );

    if (hasActiveNonCancelledSub) {
      console.log(`Active non-cancelled subscription found for ${user.email}`);
      return NextResponse.json(
        { error: 'You already have an active subscription', portal: true },
        { status: 409 }
      );
    }

    // Also check for incomplete subscriptions
    const incompleteSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'incomplete',
      limit: 10,
    });

    console.log(`Found ${incompleteSubs.data.length} incomplete subscriptions for ${user.email}`);

    if (incompleteSubs.data.length > 0) {
      console.log(`Incomplete subscription found for ${user.email}, allowing new checkout session`);
      // Don't block for incomplete subscriptions - they can be replaced
    }

    // Get the correct price ID
    const priceKey = `${tier}_${interval}`;
    const priceId = STRIPE_CONFIG.prices[priceKey as keyof typeof STRIPE_CONFIG.prices];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid pricing selection' }, { status: 400 });
    }

    // Create checkout session with idempotency key to prevent duplicate charges
    const idempotencyKey = `checkout_${user.id}_${tier}_${interval}_${Date.now()}`;
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        tier,
        interval,
      },
    }, {
      idempotencyKey,
    });

    // Log payment event
    try {
      await logPaymentEvent(
        supabase,
        user.id,
        'checkout_session_created',
        { session_id: session.id, tier, interval },
        undefined,
        req
      );
    } catch (auditError) {
      console.error('Payment audit logging failed:', auditError);
      // Do not throw - audit failures should not block checkout
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}