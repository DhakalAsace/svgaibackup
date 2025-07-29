# Credit Reset System Summary

## Overview
The system correctly handles credit resets for both monthly and annual subscribers using different mechanisms to prevent double-resets and exploitation.

## How It Works

### 1. Monthly Subscribers (Period ≤ 31 days)
- **Reset Mechanism**: Stripe webhooks ONLY
- **Trigger**: `invoice.payment_succeeded` webhook event
- **When**: On billing anniversary when Stripe charges the card
- **Function Behavior**: `check_credits_v3` skips reset logic for monthly subscribers

### 2. Annual Subscribers (Period > 300 days)
- **Reset Mechanism**: Dual system for reliability
  - Primary: Daily cron job at 3 AM UTC
  - Backup: `check_credits_v3` function when user attempts to use credits
- **When**: Monthly on their billing day (e.g., subscribed Jan 15 = reset on 15th of each month)
- **Why Monthly**: Annual subscribers pay yearly but get monthly credit refreshes

## Key Logic Changes Made

### 1. Fixed Annual Detection
Previous logic incorrectly used month comparison which failed for subscriptions spanning month boundaries.

**Old Logic (Incorrect)**:
```sql
-- This would mark Jan 25 - Feb 25 as "annual"
EXTRACT(MONTH FROM s.current_period_start) != EXTRACT(MONTH FROM s.current_period_end)
```

**New Logic (Correct)**:
```sql
-- Checks if period is > 300 days
EXTRACT(EPOCH FROM (s.current_period_end - s.current_period_start)) / 86400 > 300
```

### 2. Prevented Double Resets
Monthly subscribers now ONLY get credits reset via Stripe webhooks, preventing the race condition where:
1. Webhook resets credits
2. User tries to generate something
3. Function would reset credits again

## Edge Cases Handled

### 1. Month-End Billing Days (29-31)
- System correctly handles billing days that don't exist in all months
- February 29/30/31 billing → resets on Feb 28 (or 29 in leap years)
- Handled identically by Stripe and our system

### 2. Failed Webhooks
- Annual subscribers have backup reset in `check_credits_v3`
- Monthly subscribers rely solely on webhooks (by design)
- Webhook events are stored and deduplicated to prevent double processing

### 3. Subscription Changes
- Upgrades/downgrades update credits immediately via webhook
- Billing day is preserved during plan changes
- Cancellations stop future resets

## Monitoring

### SQL Queries for Verification

```sql
-- Check reset health
SELECT * FROM credit_reset_monitoring 
WHERE reset_health = 'OVERDUE RESET';

-- Verify billing intervals
SELECT billing_interval, COUNT(*), AVG(period_days)::int 
FROM credit_reset_monitoring 
GROUP BY billing_interval;

-- Check recent webhook events
SELECT event_type, COUNT(*) 
FROM webhook_events 
WHERE created_at > NOW() - INTERVAL '24 hours' 
GROUP BY event_type;
```

### Key Metrics to Monitor
1. No monthly subscribers should have `OVERDUE RESET` status
2. Annual subscribers should reset within 24 hours of billing day
3. Webhook events should process successfully
4. Cron job should run daily without errors

## Testing

Run the test script to verify everything is working:
```bash
npx tsx scripts/test-credit-resets.ts
```

## Important Notes

1. **Don't Change Back**: The separation of reset mechanisms (webhooks for monthly, cron+function for annual) is intentional and prevents exploitation

2. **Billing Day Alignment**: Credits reset on billing anniversary, not calendar months, which is the industry standard

3. **Annual Subscribers Get Monthly Resets**: This is intentional - they pay yearly but get fresh credits monthly

4. **Period Detection**: Using 300 days as the threshold cleanly separates monthly (28-31 days) from annual (365-366 days) subscriptions