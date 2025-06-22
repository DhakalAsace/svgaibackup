import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Subscription price IDs (Stripe):
//  Monthly Starter – $12   -> price_1RW8DSIe6gMo8ijpNM67JVAX (recurring monthly)
//  Annual Starter  – $119  -> price_1RcNYUIe6gMo8ijpRtzAFayx (recurring annual)
//  Monthly Pro     – $29   -> price_1RcNYcIe6gMo8ijpfeKA0bb4 (recurring monthly)
//  Annual Pro      – $289  -> price_1RcNeTIe6gMo8ijpB0qJ85Cy (recurring yearly)
  const PRICE_IDS = {
    starter_monthly: 'price_1RW8DSIe6gMo8ijpNM67JVAX', // recurring monthly
    starter_annual:  'price_1RcNYUIe6gMo8ijpRtzAFayx', // recurring annual payment
    pro_monthly:     'price_1RcNYcIe6gMo8ijpfeKA0bb4', // recurring monthly
    pro_annual:      'price_1RcNeTIe6gMo8ijpB0qJ85Cy', // recurring yearly
  };

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier, interval } = await req.json(); // Add interval parameter

    // Validate inputs
    if (!tier || !['starter', 'pro'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    if (!interval || !['monthly', 'annual'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
    }

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

    // Prevent duplicate subscriptions: if the customer already has an active subscription,
    // instruct the client to open the billing portal instead of creating a new checkout session.
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (existingSubs.data.length > 0) {
      return NextResponse.json(
        { error: 'You already have an active subscription', portal: true },
        { status: 409 }
      );
    }

    // Get the correct price ID
    const priceKey = `${tier}_${interval}`;
    const priceId = PRICE_IDS[priceKey as keyof typeof PRICE_IDS];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid pricing selection' }, { status: 400 });
    }

    // Create checkout session (always subscription)
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
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}