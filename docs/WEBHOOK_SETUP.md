# Stripe Webhook Setup Guide

This guide covers the complete setup and testing of Stripe webhooks for the SVG AI application.

## Overview

The webhook system handles the following critical events:
- Subscription creation (via checkout or direct API)
- Subscription updates (status changes, tier changes)
- Subscription cancellations
- Payment renewals and failures

## Architecture

### Data Flow
1. Customer completes Stripe checkout or subscription is created via API
2. Stripe sends webhook event to `/api/webhooks/stripe`
3. Webhook handler validates the event signature
4. Handler updates both `profiles` and `subscriptions` tables in Supabase
5. User's subscription status and limits are immediately reflected in the app

### Key Components

#### 1. Webhook Handler (`/app/api/webhooks/stripe/route.ts`)
- Validates webhook signatures for security
- Handles multiple subscription scenarios:
  - Checkout flow subscriptions (with metadata)
  - Direct API subscriptions (without metadata)
  - Subscription updates and cancellations
- Includes user lookup logic for various scenarios

#### 2. Checkout Session (`/app/api/create-checkout-session/route.ts`)
- Creates Stripe customers if they don't exist
- Generates checkout sessions with proper metadata
- Links Stripe customers to Supabase users

#### 3. Manual Sync (`/app/api/sync-subscription/route.ts`)
- Fallback for syncing existing subscriptions
- Useful for testing and data recovery
- Can be triggered via UI button

## Setup Instructions

### 1. Environment Variables

Required environment variables in `.env.local`:
```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2. Stripe Dashboard Configuration

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the signing secret and add to `STRIPE_WEBHOOK_SECRET`

### 3. Create Price IDs

Ensure you have the following products and prices in Stripe:

```javascript
// Starter Tier - $12/month
{
  product: 'prod_SPHEKt3vyhUXhW',
  price: 'price_1RW8DSIe6gMo8ijpNM67JVAX',
  amount: 1200,
  interval: 'month'
}

// Pro Tier - $35/month
{
  product: 'prod_SPHES57RnhBWJq',
  price: 'price_1RW8E3Ie6gMo8ijpU6KQyHwx',
  amount: 3500,
  interval: 'month'
}
```

### 4. Database Schema

Ensure your Supabase database has the correct schema:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_tier TEXT,
  subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  monthly_generation_limit INTEGER DEFAULT 3,
  monthly_generations_used INTEGER DEFAULT 0,
  last_generation_reset TIMESTAMPTZ
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT,
  tier TEXT,
  stripe_price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Testing

### 1. Test Webhook Locally

Use Stripe CLI for local testing:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

### 2. Test End-to-End Flow

1. **Create a test subscription:**
   ```bash
   # Via UI: Go to /pricing and select a plan
   # Via API: Use Stripe test card 4242 4242 4242 4242
   ```

2. **Verify webhook receipt:**
   - Check Stripe Dashboard > Webhooks > Event log
   - Look for successful 200 responses

3. **Check database sync:**
   ```sql
   -- Check profile update
   SELECT * FROM profiles WHERE stripe_customer_id = 'cus_xxx';
   
   -- Check subscription record
   SELECT * FROM subscriptions WHERE stripe_subscription_id = 'sub_xxx';
   ```

### 3. Manual Sync Testing

If a subscription exists in Stripe but not in the database:

1. Go to `/dashboard`
2. Click "Sync Stripe Subscription" button
3. Verify the subscription is now active

### 4. Common Test Scenarios

#### Scenario 1: New User Checkout
1. User signs up
2. User goes to pricing page
3. User completes checkout
4. Webhook updates profile with subscription

#### Scenario 2: Existing Customer New Subscription
1. Customer already has Stripe ID
2. New subscription created via API
3. Webhook finds user by customer ID
4. Profile updated with new subscription

#### Scenario 3: Subscription Cancellation
1. Cancel subscription in Stripe
2. Webhook receives `customer.subscription.deleted`
3. User downgraded to free tier

## Troubleshooting

### Issue: Webhook signature verification fails
**Solution:** Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe Dashboard

### Issue: User not found for subscription
**Solution:** The webhook handler includes fallback logic to find users by:
1. Stripe customer ID in profiles table
2. Email address from Stripe customer
3. Metadata in Stripe customer object

### Issue: Subscription exists but not synced
**Solution:** Use the manual sync endpoint or button to force sync

### Issue: Generation limits not updating
**Solution:** Check that the price ID mapping in webhook handler matches your Stripe prices

## Monitoring

### Webhook Health Checks
1. Monitor Stripe Dashboard > Webhooks for failed events
2. Check application logs for webhook errors
3. Set up alerts for repeated failures

### Database Consistency
Run periodic checks to ensure Stripe and database are in sync:

```sql
-- Find mismatched subscriptions
SELECT p.id, p.stripe_customer_id, p.subscription_status
FROM profiles p
WHERE p.stripe_customer_id IS NOT NULL
AND p.subscription_status != (
  SELECT s.status 
  FROM subscriptions s 
  WHERE s.user_id = p.id 
  ORDER BY s.created_at DESC 
  LIMIT 1
);
```

## Security Best Practices

1. **Always validate webhook signatures** to prevent replay attacks
2. **Use environment variables** for all sensitive keys
3. **Implement idempotency** - webhooks may be sent multiple times
4. **Log but don't expose** sensitive customer data
5. **Use HTTPS only** for webhook endpoints
6. **Regularly rotate** API keys and webhook secrets

## Future Improvements

1. Add webhook retry logic for transient failures
2. Implement webhook event deduplication
3. Add comprehensive logging and monitoring
4. Create admin dashboard for subscription management
5. Add support for usage-based billing
6. Implement grace periods for failed payments