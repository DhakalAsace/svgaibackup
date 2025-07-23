import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { WebhookSecurity } from '@/lib/webhook-security';
import { PRICE_TO_TIER } from '@/lib/stripe-config';
import { logPaymentEvent } from '@/lib/payment-audit';
import { rateLimiters } from '@/lib/rate-limit';
import { createLogger } from '@/lib/logger';
const logger = createLogger('stripe-webhook');
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
// Webhook secret from Stripe dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// Validate webhook secret is configured
if (!endpointSecret) {
  console.error('STRIPE_WEBHOOK_SECRET is not configured');
}
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
  if (amount === 1900 || amount === 18900) return { tier: 'starter', credits: 100, interval };
  if (amount === 3900 || amount === 38900) return { tier: 'pro', credits: 350, interval };
  // Default to starter if unclear
  logger.warn(`Unknown price configuration for subscription ${subscription.id}`);
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
  // Check if webhook secret is configured
  if (!endpointSecret) {
    console.error('Webhook secret not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  // Rate limiting check using IP address
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';
  const { success } = await rateLimiters.webhook.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
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
  // Validate timestamp
  if (!WebhookSecurity.validateTimestamp(event.created)) {
    console.error('Webhook timestamp too old:', event.created);
    return NextResponse.json({ error: 'Event too old' }, { status: 400 });
  }
  // Check for duplicate processing
  const idempotencyKey = WebhookSecurity.generateIdempotencyKey(event.id);
  const { data: existingEvent } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single();
  if (existingEvent) {
    return NextResponse.json({ received: true });
  }
  // Store webhook event
  await supabaseAdmin
    .from('webhook_events')
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      idempotency_key: idempotencyKey,
      event_data: event
    });
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.subscription) {
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
        
        // ALWAYS update subscription record first to ensure consistency
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            status: subscription.status,
            tier,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_start: (subscription as any).current_period_start 
              ? new Date((subscription as any).current_period_start * 1000).toISOString()
              : new Date().toISOString(),
            current_period_end: (subscription as any).current_period_end
              ? new Date((subscription as any).current_period_end * 1000).toISOString()
              : new Date().toISOString(),
            cancel_at_period_end: (subscription as any).cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_subscription_id'
          });
        if (subError) throw subError;
        
        // Then update user profile with subscription info
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
            subscription_tier: tier,
            monthly_credits: credits,
            monthly_credits_used: 0,
            credits_reset_at: new Date().toISOString(),
          })
          .eq('id', userId);
        if (profileError) throw profileError;
        // Log payment event
        await logPaymentEvent(
          supabaseAdmin,
          userId,
          'checkout_completed',
          { 
            session_id: session.id,
            subscription_id: subscription.id,
            tier,
            interval,
            credits
          },
          event.id,
          req
        );
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
        
        // Get current tier info from the subscription
        const { tier, credits, interval } = getTierInfo(subscription);
        
        // Log for debugging subscription updates
        logger.info(`Updating subscription ${subscription.id}: tier=${tier}, price=${subscription.items.data[0]?.price.id}, status=${subscription.status}`);
        
        // ALWAYS update subscription record with current data
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            status: subscription.status,
            tier,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_start: (subscription as any).current_period_start 
              ? new Date((subscription as any).current_period_start * 1000).toISOString()
              : new Date().toISOString(),
            current_period_end: (subscription as any).current_period_end
              ? new Date((subscription as any).current_period_end * 1000).toISOString()
              : new Date().toISOString(),
            cancel_at_period_end: (subscription as any).cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_subscription_id'
          });
        if (subError) {
          logger.error(`Failed to update subscription record: ${subError.message}`);
          throw subError;
        }
        
        // Update profile with current subscription data
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
            subscription_tier: tier,
            monthly_credits: credits,
            // Don't reset credits_used on subscription updates
          })
          .eq('id', userId);
        if (profileError) {
          logger.error(`Failed to update profile: ${profileError.message}`);
          throw profileError;
        }
        // Log payment event
        await logPaymentEvent(
          supabaseAdmin,
          userId,
          event.type,
          { 
            subscription_id: subscription.id,
            tier,
            interval,
            status: subscription.status,
            credits
          },
          event.id,
          req
        );
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
          const subscriptionId = typeof (invoice as any).subscription === 'string' 
            ? (invoice as any).subscription 
            : (invoice as any).subscription.id;
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, tier')
            .eq('stripe_subscription_id', subscriptionId)
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
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          const subscriptionId = typeof (invoice as any).subscription === 'string' 
            ? (invoice as any).subscription 
            : (invoice as any).subscription.id;
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscriptionId)
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
          }
        }
        break;
      }
      case 'subscription_schedule.created':
      case 'subscription_schedule.updated': {
        const schedule = event.data.object as Stripe.SubscriptionSchedule;
        
        // Only process if the schedule has an active subscription
        if (!schedule.subscription || schedule.status !== 'active') {
          break;
        }
        
        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(
          schedule.subscription as string
        );
        
        // Only update based on the current phase, not future phases
        if (subscription.status === 'active') {
          const customerId = subscription.customer as string;
          const userId = await findOrCreateUserFromCustomer(customerId);
          
          if (!userId) {
            console.error(`Cannot find user for customer ${customerId}`);
            break;
          }
          
          // Get tier info from the CURRENT subscription, not the schedule
          const { tier, credits, interval } = getTierInfo(subscription);
          
          // Update subscription record with current information
          const { error: subError } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: customerId,
              status: subscription.status,
              tier,
              stripe_price_id: subscription.items.data[0].price.id,
              current_period_start: (subscription as any).current_period_start 
                ? new Date((subscription as any).current_period_start * 1000).toISOString()
                : new Date().toISOString(),
              current_period_end: (subscription as any).current_period_end
                ? new Date((subscription as any).current_period_end * 1000).toISOString()
                : new Date().toISOString(),
              cancel_at_period_end: (subscription as any).cancel_at_period_end,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_subscription_id'
            });
          
          if (subError) throw subError;
          
          // Update profile with current subscription info
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              subscription_status: subscription.status,
              subscription_tier: tier,
              monthly_credits: credits,
            })
            .eq('id', userId);
          
          if (profileError) throw profileError;
          
          // Log the schedule event
          await logPaymentEvent(
            supabaseAdmin,
            userId,
            event.type,
            { 
              schedule_id: schedule.id,
              subscription_id: subscription.id,
              tier,
              interval,
              status: subscription.status,
              credits,
              has_future_phases: schedule.phases.length > 1
            },
            event.id,
            req
          );
        }
        break;
      }
      case 'subscription_schedule.released':
      case 'subscription_schedule.canceled': {
        const schedule = event.data.object as Stripe.SubscriptionSchedule;
        
        // When a schedule is released/canceled, ensure the subscription data is still correct
        if (schedule.subscription && schedule.status !== 'canceled') {
          const subscription = await stripe.subscriptions.retrieve(
            schedule.subscription as string
          );
          
          const customerId = subscription.customer as string;
          const userId = await findOrCreateUserFromCustomer(customerId);
          
          if (userId) {
            const { tier, credits, interval } = getTierInfo(subscription);
            
            // Update to ensure we have the correct current state
            await supabaseAdmin
              .from('profiles')
              .update({
                subscription_tier: tier,
                monthly_credits: credits,
              })
              .eq('id', userId);
          }
        }
        break;
      }
      default:
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