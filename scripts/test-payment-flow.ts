#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testPaymentFlow() {
  console.log('🔍 Testing Payment Flow End-to-End\n');

  try {
    // 1. Check Stripe webhook configuration
    console.log('1️⃣ Checking Stripe webhook endpoints...');
    const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 10 });
    
    const activeEndpoints = webhookEndpoints.data.filter(ep => ep.status === 'enabled');
    console.log(`   Found ${activeEndpoints.length} active webhook endpoints`);
    
    activeEndpoints.forEach(endpoint => {
      console.log(`   - ${endpoint.url}`);
      console.log(`     Events: ${endpoint.enabled_events.join(', ')}`);
    });

    // 2. Check recent Stripe events
    console.log('\n2️⃣ Checking recent Stripe events...');
    const events = await stripe.events.list({ limit: 10 });
    
    const relevantEvents = events.data.filter(event => 
      ['checkout.session.completed', 'customer.subscription.created', 'customer.subscription.updated'].includes(event.type)
    );
    
    console.log(`   Found ${relevantEvents.length} relevant events in last batch`);
    relevantEvents.forEach(event => {
      console.log(`   - ${event.type} at ${new Date(event.created * 1000).toISOString()}`);
    });

    // 3. Check active subscriptions
    console.log('\n3️⃣ Checking active Stripe subscriptions...');
    const subscriptions = await stripe.subscriptions.list({ 
      status: 'active',
      limit: 5 
    });
    
    console.log(`   Found ${subscriptions.data.length} active subscriptions`);
    
    for (const sub of subscriptions.data) {
      const customer = await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer;
      console.log(`   - ${sub.id}: ${customer.email || 'No email'}`);
      console.log(`     Price: $${sub.items.data[0].price.unit_amount! / 100}/month`);
      console.log(`     Status: ${sub.status}`);
    }

    // 4. Check Supabase profiles
    console.log('\n4️⃣ Checking Supabase subscription data...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id, subscription_status, subscription_tier, monthly_generation_limit')
      .not('stripe_customer_id', 'is', null);

    if (profileError) throw profileError;

    console.log(`   Found ${profiles?.length || 0} profiles with Stripe customers`);
    
    const activeProfiles = profiles?.filter(p => p.subscription_status === 'active') || [];
    console.log(`   Active subscriptions in database: ${activeProfiles.length}`);

    // 5. Check for mismatches
    console.log('\n5️⃣ Checking for data mismatches...');
    
    let mismatches = 0;
    for (const profile of profiles || []) {
      if (profile.stripe_customer_id) {
        try {
          const stripeSubs = await stripe.subscriptions.list({
            customer: profile.stripe_customer_id,
            status: 'active',
            limit: 1
          });
          
          const hasActiveSub = stripeSubs.data.length > 0;
          const dbShowsActive = profile.subscription_status === 'active';
          
          if (hasActiveSub !== dbShowsActive) {
            mismatches++;
            console.log(`   ⚠️  Mismatch for customer ${profile.stripe_customer_id}`);
            console.log(`      Stripe: ${hasActiveSub ? 'active' : 'no active sub'}`);
            console.log(`      Database: ${profile.subscription_status}`);
          }
        } catch (err) {
          console.log(`   ❌ Error checking customer ${profile.stripe_customer_id}:`, err);
        }
      }
    }
    
    if (mismatches === 0) {
      console.log('   ✅ All subscriptions are in sync!');
    } else {
      console.log(`   ⚠️  Found ${mismatches} mismatches`);
    }

    // 6. Test webhook endpoint
    console.log('\n6️⃣ Webhook endpoint configuration...');
    
    if (!STRIPE_WEBHOOK_SECRET) {
      console.log('   ❌ STRIPE_WEBHOOK_SECRET not configured');
    } else {
      console.log('   ✅ STRIPE_WEBHOOK_SECRET is configured');
    }

    // 7. Recommendations
    console.log('\n📋 Recommendations:');
    
    if (activeEndpoints.length === 0) {
      console.log('   - No active webhooks found. Set up webhook in Stripe Dashboard:');
      console.log('     1. Go to https://dashboard.stripe.com/webhooks');
      console.log('     2. Add endpoint: https://your-domain.com/api/webhooks/stripe');
      console.log('     3. Select events: checkout.session.completed, customer.subscription.*');
      console.log('     4. Copy the signing secret to STRIPE_WEBHOOK_SECRET env var');
    }
    
    if (mismatches > 0) {
      console.log('   - Run manual sync for mismatched subscriptions');
      console.log('   - Check webhook logs in Stripe Dashboard for failures');
    }

    console.log('\n✅ Payment flow test completed!');
    
  } catch (error) {
    console.error('\n❌ Error during payment flow test:', error);
  }
}

// Run the test
testPaymentFlow();