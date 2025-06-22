import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
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

// Webhook secret from Stripe dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Map price IDs to tiers and credits
const PRICE_TO_TIER: Record<string, { tier: string; credits: number; interval: string }> = {
  'price_1RW8DSIe6gMo8ijpNM67JVAX': { tier: 'starter', credits: 100, interval: 'monthly' }, // Starter $12/month
  'price_1RcNYUIe6gMo8ijpRtzAFayx': { tier: 'starter', credits: 100, interval: 'annual' }, // Starter $119/year
  'price_1RcNYcIe6gMo8ijpfeKA0bb4': { tier: 'pro', credits: 350, interval: 'monthly' }, // Pro $29/month
  'price_1RcNeTIe6gMo8ijpB0qJ85Cy': { tier: 'pro', credits: 350, interval: 'annual' }, // Pro $289/year
};

// Default tier credits as fallback
const TIER_CREDITS: Record<string, number> = {
  starter: 100,
  pro: 350,
  free: 0,
};

// Helper function to get tier info from subscription
function getTierInfo(subscription: Stripe.Subscription): { tier: string; credits: number; interval: string } {
  const priceId = subscription.items.data[0]?.price.id;
  
  // First try to get from price mapping
  if (priceId && PRICE_TO_TIER[priceId]) {
    return PRICE_TO_TIER[priceId];
  }
  
  // Fallback to price amount and recurring interval
  const amount = subscription.items.data[0]?.price.unit_amount;
  const recurring = subscription.items.data[0]?.price.recurring;
  const interval = recurring?.interval === 'year' ? 'annual' : 'monthly';
  
  if (amount === 1200 || amount === 11900) return { tier: 'starter', credits: 100, interval };
  if (amount === 2900 || amount === 28900) return { tier: 'pro', credits: 350, interval };
  
  // Default to starter if unclear
  console.warn(`Unknown price configuration for subscription ${subscription.id}`);
  return { tier: 'starter', credits: 100, interval: 'monthly' };
}

// Helper function to find or create user from customer
async function findOrCreateUserFromCustomer(customerId: string): Promise<string | null> {
  try {
    // First check if we have a profile with this customer ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profile) return profile.id;

    // Try to get customer from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;

    // Check if we have a user with this email
    const stripeCustomer = customer as Stripe.Customer;
    if (stripeCustomer.email) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.users.find(u => u.email === stripeCustomer.email);
      
      if (user) {
        // Update profile with Stripe customer ID
        await supabaseAdmin
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);
        
        return user.id;
      }
    }

    // Check metadata for user ID
    if (stripeCustomer.metadata?.supabase_user_id) {
      return stripeCustomer.metadata.supabase_user_id;
    }

    return null;
  } catch (error) {
    console.error('Error finding user from customer:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) {
    console.error('No Stripe signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Processing webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.subscription) {
          console.log('No subscription in checkout session');
          break;
        }
        
        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        
        const customerId = session.customer as string;
        const userId = session.metadata?.user_id || await findOrCreateUserFromCustomer(customerId);
        
        if (!userId) {
          throw new Error('Cannot determine user for checkout session');
        }

        const { tier, credits, interval } = getTierInfo(subscription);

        // Update user profile with subscription info
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
            subscription_tier: tier,
            subscription_id: subscription.id,
            subscription_interval: interval,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            monthly_credits: credits,
            monthly_credits_used: 0,
            credits_reset_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (profileError) throw profileError;

        // Create or update subscription record
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            status: subscription.status,
            tier,
            interval,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_subscription_id'
          });

        if (subError) throw subError;
        
        console.log(`Checkout completed for user ${userId}, tier: ${tier}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find the user for this subscription
        const userId = await findOrCreateUserFromCustomer(customerId);
        
        if (!userId) {
          console.error(`Cannot find user for customer ${customerId}`);
          break;
        }

        const { tier, credits, interval } = getTierInfo(subscription);

        // Update or create subscription record
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            status: subscription.status,
            tier,
            interval,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_subscription_id'
          });

        if (subError) throw subError;

        // Update profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
            subscription_tier: tier,
            subscription_id: subscription.id,
            subscription_interval: interval,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            monthly_credits: credits,
            // Don't reset credit count on updates
          })
          .eq('id', userId);

        if (profileError) throw profileError;
        
        console.log(`Subscription ${event.type} for user ${userId}, tier: ${tier}, status: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get user info
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (sub) {
          // Downgrade to free tier
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'free',
              subscription_tier: null,
              subscription_id: null,
              current_period_end: null,
              monthly_credits: 0,
              monthly_credits_used: 0,
            })
            .eq('id', sub.user_id);

          if (profileError) throw profileError;

          // Update subscription record
          const { error: subError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          if (subError) throw subError;
          
          console.log(`Subscription canceled for user ${sub.user_id}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Skip the first invoice (already handled by subscription creation)
        if (invoice.billing_reason === 'subscription_create') {
          break;
        }

        // Only reset on subscription cycle
        if (invoice.billing_reason === 'subscription_cycle' && (invoice as any).subscription) {
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, tier')
            .eq('stripe_subscription_id', (invoice as any).subscription as string)
            .single();

          if (sub) {
            const { error } = await supabaseAdmin
              .from('profiles')
              .update({
                monthly_credits_used: 0,
                credits_reset_at: new Date().toISOString(),
              })
              .eq('id', sub.user_id);

            if (error) throw error;
            
            console.log(`Reset generation count for user ${sub.user_id} on renewal`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if ((invoice as any).subscription) {
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', (invoice as any).subscription as string)
            .single();

          if (sub) {
            // Update subscription status
            const { error } = await supabaseAdmin
              .from('profiles')
              .update({
                subscription_status: 'past_due',
              })
              .eq('id', sub.user_id);

            if (error) throw error;
            
            console.log(`Payment failed for user ${sub.user_id}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}