# Stripe Subscription Testing Guide

## Summary of Current Implementation

### How Credit Resets Work

1. **Primary Reset Mechanism**: Database function `check_credits_v3`
   - Automatically resets credits when `credits_reset_at` is before the current month
   - Runs on every credit check (when users generate content)
   - Works for BOTH monthly and annual subscriptions

2. **Backup Reset Mechanism**: Stripe webhook `invoice.payment_succeeded`
   - Triggers on `subscription_cycle` billing reason
   - For monthly: Fires every month
   - For annual: Fires once per year
   - Resets `monthly_credits_used` to 0 and updates `credits_reset_at`

3. **Important Discovery**: Annual subscribers get monthly credit resets!
   - The database function resets credits monthly based on calendar months
   - Annual subscribers effectively get 12 months × monthly credits per year
   - This may be intentional or a bug depending on your business model

## Manual Testing Procedures

### Test 1: Monthly Subscription Credit Reset
1. **Create Test Customer**
   ```bash
   # Use Stripe CLI to trigger test events
   stripe customers create --email="monthly-test@example.com" --name="Monthly Test User"
   ```

2. **Subscribe to Monthly Plan**
   - Login as test user
   - Subscribe to Starter Monthly ($19/month)
   - Verify in database:
     ```sql
     SELECT id, email, subscription_tier, subscription_status, 
            monthly_credits, monthly_credits_used, credits_reset_at
     FROM profiles WHERE email = 'monthly-test@example.com';
     ```

3. **Use Some Credits**
   - Generate 50 icons (50 credits)
   - Check remaining: Should show 50/100 used

4. **Simulate Month End**
   - Option A: Wait for actual billing cycle
   - Option B: Manually update database:
     ```sql
     UPDATE profiles 
     SET credits_reset_at = NOW() - INTERVAL '32 days'
     WHERE email = 'monthly-test@example.com';
     ```

5. **Trigger Credit Check**
   - Try to generate another icon
   - Credits should reset to 0/100

### Test 2: Annual Subscription Credit Reset
1. **Create Annual Subscriber**
   ```bash
   stripe customers create --email="annual-test@example.com" --name="Annual Test User"
   ```

2. **Subscribe to Annual Plan**
   - Login and subscribe to Pro Annual ($360/year)
   - Verify 350 credits available

3. **Test Monthly Reset Behavior**
   - Use 200 credits in first month
   - Update `credits_reset_at` to last month:
     ```sql
     UPDATE profiles 
     SET credits_reset_at = NOW() - INTERVAL '32 days'
     WHERE email = 'annual-test@example.com';
     ```
   - Generate new content - credits should reset!

### Test 3: Webhook Simulation
```bash
# Test monthly renewal
stripe trigger invoice.payment_succeeded \
  --override invoice:billing_reason=subscription_cycle \
  --override invoice:subscription=sub_xxxxx

# Check if credits were reset in database
```

### Test 4: Edge Cases

1. **Subscription Upgrade Mid-Cycle**
   - Start with Starter Monthly
   - Use 50 credits
   - Upgrade to Pro Monthly
   - Check if credits adjust properly

2. **Failed Payment**
   ```bash
   stripe trigger invoice.payment_failed
   ```
   - Verify subscription goes to `past_due`
   - Check if credits still work

3. **Cancellation**
   - Cancel subscription
   - Verify credits set to 0
   - Check free tier credits (6 lifetime)

## Automated Testing Script

Create `/test/subscription-credits.test.ts`:

```typescript
import { createClientComponentClient } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

describe('Subscription Credit Resets', () => {
  let supabase;
  
  beforeEach(() => {
    supabase = createClientComponentClient();
  });

  test('Monthly subscription resets credits monthly', async () => {
    // 1. Create test user
    const { data: user } = await supabase.auth.signUp({
      email: 'test-monthly@example.com',
      password: 'testpass123'
    });

    // 2. Subscribe to monthly plan
    const subscription = await stripe.subscriptions.create({
      customer: 'cus_test',
      items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY }]
    });

    // 3. Use credits
    await supabase.rpc('deduct_credits', { 
      user_id: user.id, 
      amount: 50 
    });

    // 4. Simulate month passing
    await supabase.from('profiles').update({
      credits_reset_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
    }).eq('id', user.id);

    // 5. Check credits reset
    const { data: credits } = await supabase.rpc('check_credits_v3', {
      p_user_id: user.id,
      p_amount: 1
    });

    expect(credits.monthly_credits_used).toBe(0);
  });

  test('Annual subscription gets monthly resets', async () => {
    // Similar test but with annual subscription
    // Verify credits reset monthly, not annually
  });
});
```

## SQL Queries for Investigation

```sql
-- 1. Check all active subscriptions and their credit status
SELECT 
  p.email,
  p.subscription_tier,
  p.subscription_status,
  p.monthly_credits,
  p.monthly_credits_used,
  p.credits_reset_at,
  s.interval,
  s.created_at as subscription_started,
  CASE 
    WHEN p.credits_reset_at < date_trunc('month', NOW()) 
    THEN 'Needs Reset'
    ELSE 'Current'
  END as reset_status
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
WHERE p.subscription_status = 'active'
ORDER BY p.credits_reset_at;

-- 2. Find annual subscribers who've had multiple resets
SELECT 
  p.email,
  s.interval,
  s.created_at,
  COUNT(pe.id) as payment_count,
  MAX(pe.created_at) as last_payment
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN payment_events pe ON pe.user_id = p.id 
  AND pe.event_type = 'invoice.payment_succeeded'
WHERE s.interval = 'annual'
GROUP BY p.email, s.interval, s.created_at
HAVING COUNT(pe.id) > 1;

-- 3. Check credit usage patterns
SELECT 
  date_trunc('month', created_at) as month,
  subscription_tier,
  COUNT(DISTINCT user_id) as users,
  SUM(credits_used) as total_credits_used,
  AVG(credits_used) as avg_credits_per_user
FROM generations
JOIN profiles ON profiles.id = generations.user_id
WHERE subscription_tier IS NOT NULL
GROUP BY month, subscription_tier
ORDER BY month DESC;
```

## Monitoring Dashboard

Create a monitoring query to track credit resets:

```sql
-- Real-time credit reset monitoring
CREATE VIEW credit_reset_monitoring AS
SELECT 
  p.id,
  p.email,
  p.subscription_tier,
  s.interval as billing_interval,
  p.monthly_credits,
  p.monthly_credits_used,
  p.credits_reset_at,
  EXTRACT(DAY FROM (NOW() - p.credits_reset_at)) as days_since_reset,
  CASE 
    WHEN s.interval = 'annual' AND EXTRACT(DAY FROM (NOW() - p.credits_reset_at)) < 365
    THEN 'Annual - Resetting Monthly (Potential Issue)'
    WHEN s.interval = 'monthly' AND EXTRACT(DAY FROM (NOW() - p.credits_reset_at)) > 31
    THEN 'Monthly - Overdue Reset'
    ELSE 'Normal'
  END as status
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
WHERE p.subscription_status = 'active';
```

## Recommendations

### If Monthly Resets for Annual Subscribers is Unintended:

1. **Modify `check_credits_v3` function** to check subscription interval:
```sql
-- Add interval check
IF v_is_subscribed THEN
  -- Get subscription interval
  SELECT interval INTO v_interval
  FROM subscriptions
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Reset based on interval
  IF v_interval = 'monthly' AND v_profile.credits_reset_at < date_trunc('month', NOW()) THEN
    -- Monthly reset
  ELSIF v_interval = 'annual' AND v_profile.credits_reset_at < NOW() - INTERVAL '1 year' THEN
    -- Annual reset
  END IF;
END IF;
```

2. **Update Webhook Handler** to differentiate intervals
3. **Clearly Communicate** credit allocation on pricing page

### If Monthly Resets are Intended:

1. **Update Pricing Page** to clarify:
   - "100 credits per month" (not just "100 credits")
   - Annual subscribers get same monthly credits

2. **Add Tooltip** explaining the benefit
3. **Monitor Usage** to ensure it's sustainable

## Stripe Test Cards

For payment testing:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

## Support Ticket Template

If you need to investigate a specific customer:

```
Subject: Credit Reset Investigation - [Customer Email]

1. Customer Email: ___________
2. Subscription Type: [ ] Monthly [ ] Annual
3. Current Credits: _____ / _____
4. Last Reset Date: ___________
5. Expected Behavior: ___________
6. Actual Behavior: ___________

SQL Query Results:
[Paste results from investigation queries]

Webhook Logs:
[Check Stripe Dashboard > Developers > Webhooks > Event Log]
```