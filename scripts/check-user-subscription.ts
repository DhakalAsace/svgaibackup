import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

async function checkUserSubscription(email: string) {
  console.log(`\nChecking subscription for: ${email}\n`);

  try {
    // 1. Get user from Supabase auth
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;

    const user = users.users.find(u => u.email === email);
    if (!user) {
      console.log('User not found in Supabase Auth');
      return;
    }

    console.log('User ID:', user.id);

    // 2. Get user profile from Supabase
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError) {
      console.log('Profile error:', profileError);
    } else {
      console.log('\nSupabase Profile:');
      console.log('- Subscription Tier:', profile.subscription_tier);
      console.log('- Subscription Status:', profile.subscription_status);
      console.log('- Monthly Credits:', profile.monthly_credits);
      console.log('- Stripe Customer ID:', profile.stripe_customer_id);
    }

    // 3. Get subscription record from Supabase
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError) {
      console.log('Subscription error:', subError);
    } else {
      console.log('\nSupabase Subscription:');
      console.log('- Status:', subscription.status);
      console.log('- Tier:', subscription.tier);
      console.log('- Interval:', subscription.interval);
      console.log('- Stripe Subscription ID:', subscription.stripe_subscription_id);
    }

    // 4. Check Stripe if we have a customer ID
    if (profile?.stripe_customer_id) {
      console.log('\nChecking Stripe...');
      
      // Get customer
      const customer = await stripe.customers.retrieve(profile.stripe_customer_id);
      console.log('\nStripe Customer:');
      console.log('- Email:', (customer as any).email);
      
      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: 'active',
      });

      if (subscriptions.data.length > 0) {
        const stripeSub = subscriptions.data[0];
        console.log('\nStripe Subscription:');
        console.log('- Status:', stripeSub.status);
        console.log('- Current Period End:', new Date((stripeSub as any).current_period_end * 1000).toISOString());
        console.log('- Price ID:', stripeSub.items.data[0].price.id);
        console.log('- Amount:', stripeSub.items.data[0].price.unit_amount! / 100, stripeSub.items.data[0].price.currency);
        console.log('- Interval:', stripeSub.items.data[0].price.recurring?.interval);
      }

      // Get recent payments
      const charges = await stripe.charges.list({
        customer: profile.stripe_customer_id,
        limit: 5,
      });

      console.log('\nRecent Charges:');
      charges.data.forEach(charge => {
        console.log(`- ${new Date(charge.created * 1000).toLocaleDateString()}: $${charge.amount / 100} (${charge.status})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the check
checkUserSubscription('doncenaa684@gmail.com');