# Subscription Credit Reset Testing Guide

This comprehensive guide covers testing procedures for subscription credit resets, including manual tests, SQL queries, Stripe test scenarios, and edge case handling.

## Table of Contents

1. [System Overview](#system-overview)
2. [Manual Test Scenarios](#manual-test-scenarios)
3. [SQL Verification Queries](#sql-verification-queries)
4. [Stripe Test Mode Scenarios](#stripe-test-mode-scenarios)
5. [Edge Case Testing](#edge-case-testing)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Troubleshooting](#troubleshooting)

## System Overview

### Credit Reset Mechanisms

1. **Monthly Subscriptions**: Reset via Stripe webhook on `invoice.payment_succeeded` events
2. **Annual Subscriptions**: Reset via daily cron job checking `billing_day`
3. **Manual Resets**: Available through admin interface for testing/support

### Key Database Fields

- `monthly_credits`: Total credits allocated per month
- `monthly_credits_used`: Credits consumed in current period
- `credits_reset_at`: Timestamp of last credit reset
- `billing_day`: Day of month (1-31) when billing occurs
- `subscription_tier`: Current subscription level (starter/professional/business)

## Manual Test Scenarios

### 1. Monthly Subscription Credit Reset Test

```sql
-- Step 1: Create test subscriber with used credits
UPDATE profiles 
SET 
  subscription_tier = 'starter',
  subscription_status = 'active',
  monthly_credits = 100,
  monthly_credits_used = 75,
  credits_reset_at = NOW() - INTERVAL '35 days',
  billing_day = EXTRACT(DAY FROM NOW())::integer
WHERE id = 'test-user-id';

-- Step 2: Verify current state
SELECT 
  id,
  email,
  subscription_tier,
  monthly_credits,
  monthly_credits_used,
  credits_reset_at,
  billing_day
FROM profiles 
WHERE id = 'test-user-id';

-- Step 3: Trigger Stripe webhook test (see Stripe section below)

-- Step 4: Verify credits were reset
SELECT 
  monthly_credits_used,
  credits_reset_at,
  (credits_reset_at > NOW() - INTERVAL '1 minute') as recently_reset
FROM profiles 
WHERE id = 'test-user-id';
```

### 2. Annual Subscription Credit Reset Test

```sql
-- Step 1: Create annual subscriber due for reset
UPDATE profiles 
SET 
  subscription_tier = 'professional',
  subscription_status = 'active',
  monthly_credits = 2500,
  monthly_credits_used = 1500,
  credits_reset_at = NOW() - INTERVAL '35 days',
  billing_day = EXTRACT(DAY FROM NOW())::integer
WHERE id = 'test-user-id';

-- Step 2: Manually trigger cron job
SELECT cron_reset_annual_credits();

-- Step 3: Verify reset
SELECT 
  monthly_credits_used,
  credits_reset_at,
  (credits_reset_at > NOW() - INTERVAL '1 minute') as just_reset
FROM profiles 
WHERE id = 'test-user-id';

-- Step 4: Check cron log
SELECT * FROM cron_job_logs 
WHERE job_name = 'reset-annual-subscriber-credits'
ORDER BY execution_time DESC 
LIMIT 1;
```

### 3. Credit Usage After Reset Test

```sql
-- Step 1: Reset credits for test user
UPDATE profiles 
SET 
  monthly_credits_used = 0,
  credits_reset_at = NOW()
WHERE id = 'test-user-id';

-- Step 2: Test credit usage
SELECT check_credits_v3(
  'test-user-id'::uuid,
  'test-user-id'::text,
  'user_id'::credit_identifier_type,
  'svg'::generation_type
);

-- Step 3: Verify deduction
SELECT 
  monthly_credits,
  monthly_credits_used,
  (monthly_credits - monthly_credits_used) as remaining
FROM profiles 
WHERE id = 'test-user-id';
```

## SQL Verification Queries

### 1. Find Users Due for Reset

```sql
-- Annual subscribers due for reset today
WITH today_info AS (
  SELECT 
    EXTRACT(DAY FROM NOW())::integer as today_day,
    EXTRACT(DAY FROM (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day'))::integer as last_day_of_month
)
SELECT 
  p.id,
  p.email,
  p.subscription_tier,
  p.monthly_credits_used,
  p.credits_reset_at,
  p.billing_day,
  s.stripe_price_id,
  CASE 
    WHEN p.billing_day = (SELECT today_day FROM today_info) THEN 'Due today'
    WHEN p.billing_day > 28 AND (SELECT today_day FROM today_info) = (SELECT last_day_of_month FROM today_info) THEN 'Due today (month-end)'
    ELSE 'Not due'
  END as reset_status
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
WHERE 
  p.subscription_status = 'active'
  AND s.status = 'active'
  AND s.stripe_price_id IN (
    'price_professional_annual_id',
    'price_starter_annual_id',
    'price_business_annual_id'
  )
  AND (
    p.billing_day = (SELECT today_day FROM today_info)
    OR (p.billing_day > 28 AND (SELECT today_day FROM today_info) = (SELECT last_day_of_month FROM today_info))
  )
  AND (
    p.credits_reset_at IS NULL 
    OR p.credits_reset_at < NOW() - INTERVAL '25 days'
  );
```

### 2. Credit Reset History

```sql
-- View credit reset history for a user
SELECT 
  execution_time,
  affected_rows,
  success,
  error_message,
  execution_details
FROM cron_job_logs 
WHERE 
  job_name = 'reset-annual-subscriber-credits'
  AND execution_details::text LIKE '%test-user-id%'
ORDER BY execution_time DESC;

-- Or check recent resets
SELECT 
  id,
  email,
  subscription_tier,
  credits_reset_at,
  monthly_credits_used,
  DATE_PART('day', NOW() - credits_reset_at) as days_since_reset
FROM profiles 
WHERE 
  subscription_status = 'active'
  AND credits_reset_at > NOW() - INTERVAL '7 days'
ORDER BY credits_reset_at DESC;
```

### 3. Subscription Billing Day Distribution

```sql
-- Check distribution of billing days
SELECT 
  billing_day,
  COUNT(*) as subscriber_count,
  STRING_AGG(subscription_tier, ', ') as tiers
FROM profiles 
WHERE 
  subscription_status = 'active'
  AND billing_day IS NOT NULL
GROUP BY billing_day
ORDER BY billing_day;
```

## Stripe Test Mode Scenarios

### 1. Monthly Subscription Renewal Test

```bash
# Using Stripe CLI to trigger webhook
stripe trigger invoice.payment_succeeded \
  --add invoice:billing_reason=subscription_cycle \
  --add invoice:subscription=sub_test_monthly_id
```

### 2. Test Clock for Accelerated Testing

```javascript
// Create a test clock in Stripe Dashboard or via API
const testClock = await stripe.testHelpers.testClocks.create({
  frozen_time: Math.floor(Date.now() / 1000),
  name: 'Credit Reset Testing'
});

// Create subscription with test clock
const subscription = await stripe.subscriptions.create({
  customer: 'cus_test_id',
  items: [{ price: 'price_monthly_starter_id' }],
  test_clock: testClock.id
});

// Advance time by 1 month
await stripe.testHelpers.testClocks.advance(testClock.id, {
  frozen_time: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
});
```

### 3. Webhook Event Verification

```sql
-- Check webhook processing
SELECT 
  stripe_webhook_id,
  event_type,
  processed_at,
  error
FROM stripe_webhook_events
WHERE 
  event_type = 'invoice.payment_succeeded'
  AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

## Edge Case Testing

### 1. Month-End Date Handling (28th, 29th, 30th, 31st)

```sql
-- Test February edge case (billing_day = 31)
UPDATE profiles 
SET 
  billing_day = 31,
  credits_reset_at = '2024-01-31'::timestamp
WHERE id = 'test-user-id';

-- Run on February 28th (or 29th in leap year)
SELECT 
  id,
  billing_day,
  EXTRACT(DAY FROM NOW()) as today,
  EXTRACT(DAY FROM (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')) as last_day_of_month,
  CASE 
    WHEN billing_day > 28 AND EXTRACT(DAY FROM NOW()) = EXTRACT(DAY FROM (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day'))
    THEN 'Should reset today'
    ELSE 'Should not reset'
  END as reset_status
FROM profiles 
WHERE id = 'test-user-id';
```

### 2. Subscription Cancellation During Billing Cycle

```sql
-- Test cancelled subscription doesn't reset
UPDATE profiles 
SET 
  subscription_status = 'cancelled',
  monthly_credits_used = 50
WHERE id = 'test-user-id';

-- Trigger reset attempt
SELECT cron_reset_annual_credits();

-- Verify no reset occurred
SELECT 
  monthly_credits_used,
  credits_reset_at
FROM profiles 
WHERE id = 'test-user-id';
```

### 3. Subscription Upgrade/Downgrade

```sql
-- Test upgrade from starter to professional
BEGIN;

-- Current state
SELECT * FROM profiles WHERE id = 'test-user-id';

-- Simulate upgrade
UPDATE profiles 
SET 
  subscription_tier = 'professional',
  monthly_credits = 2500,
  -- Keep used credits to test proportional handling
  monthly_credits_used = 50
WHERE id = 'test-user-id';

-- Verify new limits
SELECT 
  subscription_tier,
  monthly_credits,
  monthly_credits_used,
  (monthly_credits - monthly_credits_used) as available
FROM profiles 
WHERE id = 'test-user-id';

COMMIT;
```

### 4. Race Condition Testing

```bash
# Run concurrent reset attempts
for i in {1..10}; do
  psql -c "SELECT cron_reset_annual_credits();" &
done
wait

# Check for duplicate resets
psql -c "
SELECT 
  COUNT(*) as reset_count,
  MIN(execution_time) as first_reset,
  MAX(execution_time) as last_reset
FROM cron_job_logs 
WHERE 
  job_name = 'reset-annual-subscriber-credits'
  AND execution_time > NOW() - INTERVAL '1 minute'
  AND success = true;
"
```

## Monitoring & Health Checks

### 1. Daily Credit Reset Monitor

```bash
#!/bin/bash
# save as monitor-credit-resets.sh

npx tsx scripts/monitor-credit-resets.ts

# Or use SQL directly
psql -c "
SELECT 
  CASE 
    WHEN credits_reset_at::date = CURRENT_DATE THEN 'Reset Today'
    WHEN billing_day = EXTRACT(DAY FROM NOW())::integer THEN 'Due Today'
    ELSE 'Not Due'
  END as status,
  COUNT(*) as count
FROM profiles 
WHERE 
  subscription_status = 'active'
  AND subscription_tier IS NOT NULL
GROUP BY status;
"
```

### 2. Cron Job Health Check

```sql
-- Check cron job status and recent performance
SELECT * FROM monitor_cron_jobs() 
WHERE job_name = 'reset-annual-subscriber-credits';

-- Detailed execution history
SELECT 
  DATE(execution_time) as date,
  COUNT(*) as runs,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  SUM(affected_rows) as total_resets,
  AVG(EXTRACT(EPOCH FROM execution_duration)) as avg_duration_seconds
FROM cron_job_logs 
WHERE 
  job_name = 'reset-annual-subscriber-credits'
  AND execution_time > NOW() - INTERVAL '7 days'
GROUP BY DATE(execution_time)
ORDER BY date DESC;
```

### 3. Alert Queries

```sql
-- Users with stale credits (should have reset but didn't)
SELECT 
  p.id,
  p.email,
  p.subscription_tier,
  p.billing_day,
  p.credits_reset_at,
  DATE_PART('day', NOW() - p.credits_reset_at) as days_since_reset
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
WHERE 
  p.subscription_status = 'active'
  AND s.stripe_price_id LIKE '%annual%'
  AND DATE_PART('day', NOW() - p.credits_reset_at) > 35
  AND p.monthly_credits_used > 0;

-- Failed webhook events
SELECT 
  event_type,
  error,
  created_at,
  retry_count
FROM stripe_webhook_events
WHERE 
  error IS NOT NULL
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Credits Not Resetting for Monthly Subscribers

```sql
-- Check subscription and webhook status
SELECT 
  p.id,
  p.subscription_tier,
  s.stripe_subscription_id,
  s.stripe_price_id,
  s.current_period_end,
  p.credits_reset_at
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
WHERE 
  p.id = 'affected-user-id';

-- Check recent webhooks
SELECT * FROM stripe_webhook_events
WHERE 
  data->>'subscription' = 'sub_xxx'
  AND event_type = 'invoice.payment_succeeded'
ORDER BY created_at DESC;
```

#### 2. Annual Credits Not Resetting

```sql
-- Verify cron job is active
SELECT * FROM cron.job 
WHERE jobname = 'reset-annual-subscriber-credits';

-- Check if user meets reset criteria
SELECT 
  p.*,
  s.stripe_price_id,
  (p.billing_day = EXTRACT(DAY FROM NOW())::integer) as is_billing_day,
  (p.credits_reset_at < NOW() - INTERVAL '25 days') as reset_eligible
FROM profiles p
JOIN subscriptions s ON s.user_id = p.id
WHERE p.id = 'affected-user-id';

-- Manually trigger reset for testing
UPDATE profiles 
SET 
  monthly_credits_used = 0,
  credits_reset_at = NOW()
WHERE 
  id = 'affected-user-id'
  AND subscription_status = 'active';
```

#### 3. Monitoring Script Setup

```bash
# Add to crontab for daily monitoring
0 9 * * * cd /path/to/project && npm run monitor:credits >> /var/log/credit-monitor.log 2>&1

# Or use systemd timer for more control
# /etc/systemd/system/credit-monitor.service
[Unit]
Description=Monitor Credit Resets
After=network.target

[Service]
Type=oneshot
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/npm run monitor:credits
User=www-data

# /etc/systemd/system/credit-monitor.timer
[Unit]
Description=Run Credit Monitor Daily
Requires=credit-monitor.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

### Testing Checklist

- [ ] Monthly subscription credit reset via webhook
- [ ] Annual subscription credit reset via cron
- [ ] Month-end date handling (28-31)
- [ ] Subscription upgrade/downgrade credit handling
- [ ] Cancellation prevents reset
- [ ] Race condition protection
- [ ] Webhook retry on failure
- [ ] Cron job monitoring and alerts
- [ ] Manual reset capability for support
- [ ] Credit usage tracking accuracy

## Quick Reference Commands

```bash
# Monitor current state
npm run monitor:credits

# Test cron jobs
npm run test:cron

# Check specific user
psql -c "SELECT * FROM profiles WHERE email = 'user@example.com';"

# Trigger manual reset (admin only)
curl -X POST https://your-domain.com/api/admin/reset-credits \
  -H "Authorization: Bearer admin-token" \
  -d '{"userId": "user-id"}'

# View recent resets
psql -c "SELECT * FROM cron_job_logs WHERE job_name LIKE '%credit%' ORDER BY execution_time DESC LIMIT 10;"
```

This testing guide provides comprehensive coverage of all credit reset scenarios. Regular monitoring using these queries and tests will ensure your subscription credit system operates reliably.