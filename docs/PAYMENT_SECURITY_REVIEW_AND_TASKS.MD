# Payment System Security Review and Testing Tasks

## Executive Summary

This document provides a comprehensive security review of the SVG AI payment integration, identifies critical vulnerabilities, and outlines both programmatically and non-programmatically testable scenarios. The payment system uses Stripe for payment processing and Supabase for data storage with a credit-based subscription model.

## =¨ URGENT SECURITY ISSUES

### 1. **CRITICAL: Missing Webhook Authentication in Production**
- **Issue**: The webhook endpoint only validates Stripe signatures but lacks additional authentication
- **Risk**: Replay attacks, webhook spoofing if signing secret is compromised
- **Impact**: Unauthorized subscription modifications, credit manipulation
- **Fix Priority**: IMMEDIATE

### 2. **HIGH: Hardcoded Price IDs Without Validation**
- **Issue**: Price IDs are hardcoded in multiple locations without central configuration
- **Risk**: Price mismatch, subscription tier confusion
- **Files Affected**: 
  - `/app/api/webhooks/stripe/route.ts` (lines 25-30)
  - `/app/api/create-checkout-session/route.ts` (lines 15-20)
- **Fix Priority**: HIGH

### 3. **HIGH: No Rate Limiting on Payment Endpoints**
- **Issue**: API routes lack rate limiting protection
- **Risk**: DoS attacks, webhook flooding, checkout session spam
- **Affected Endpoints**:
  - `/api/create-checkout-session`
  - `/api/create-portal-session`
  - `/api/webhooks/stripe`
- **Fix Priority**: HIGH

### 4. **MEDIUM: Insufficient Error Handling in Credit System**
- **Issue**: Race conditions possible in credit deduction logic
- **Risk**: Users could exploit timing to get free generations
- **File**: `check_credits_v3` function in migrations
- **Fix Priority**: MEDIUM

### 5. **MEDIUM: Missing Audit Trail for Payment Events**
- **Issue**: No comprehensive logging of payment/subscription changes
- **Risk**: Difficult to investigate fraud or disputes
- **Fix Priority**: MEDIUM

## Security Vulnerabilities and Fixes

### Task 1: Implement Webhook Security Enhancements
```typescript
// Add to webhook handler:
- Implement idempotency key checking
- Add timestamp validation (reject webhooks older than 5 minutes)
- Store processed webhook IDs to prevent replay
- Add webhook event logging table
```

### Task 2: Centralize Price Configuration
```typescript
// Create /lib/stripe-config.ts:
export const STRIPE_CONFIG = {
  prices: {
    starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL,
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  webhookTimeout: 300000, // 5 minutes
  maxRetries: 3
};
```

### Task 3: Add Rate Limiting Middleware
```typescript
// Implement using @upstash/ratelimit or similar:
- 10 requests per minute for checkout sessions per user
- 100 webhook events per minute per IP
- 5 portal session requests per minute per user
```

### Task 4: Fix Credit System Race Conditions
```sql
-- Add row-level locking to check_credits_v3:
SELECT * INTO v_profile
FROM profiles
WHERE id = p_user_id
FOR UPDATE; -- Prevents concurrent modifications
```

### Task 5: Implement Payment Audit Trail
```sql
CREATE TABLE payment_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  stripe_event_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_audit_user ON payment_audit_log(user_id);
CREATE INDEX idx_payment_audit_event ON payment_audit_log(event_type);
```

## Programmatically Testable Scenarios

### 1. Webhook Security Tests
```typescript
// File: /tests/webhooks.test.ts
describe('Webhook Security', () => {
  test('Rejects invalid signatures', async () => {
    const response = await fetch('/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid' },
      body: JSON.stringify({ type: 'checkout.session.completed' })
    });
    expect(response.status).toBe(400);
  });

  test('Rejects replayed webhooks', async () => {
    // Send same webhook twice with valid signature
    // Second attempt should fail
  });

  test('Rejects expired webhooks', async () => {
    // Send webhook with timestamp > 5 minutes old
    expect(response.status).toBe(400);
  });
});
```

### 2. Credit System Tests
```typescript
// File: /tests/credits.test.ts
describe('Credit System', () => {
  test('Prevents race condition exploitation', async () => {
    // Attempt 10 concurrent generations with 1 credit
    const promises = Array(10).fill(null).map(() => 
      generateSVG(userId, prompt)
    );
    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success).length;
    expect(successful).toBe(1);
  });

  test('Correctly deducts credits for different generation types', async () => {
    // Test icon (1 credit) vs SVG (2 credits)
  });

  test('Resets monthly credits on billing cycle', async () => {
    // Simulate subscription renewal
  });
});
```

### 3. Subscription Flow Tests
```typescript
// File: /tests/subscription.test.ts
describe('Subscription Management', () => {
  test('Prevents duplicate active subscriptions', async () => {
    // Attempt to create second subscription for user
    expect(response.status).toBe(409);
  });

  test('Correctly downgrades on cancellation', async () => {
    // Cancel subscription, verify free tier
  });

  test('Handles payment failures gracefully', async () => {
    // Simulate failed payment webhook
  });
});
```

### 4. API Rate Limiting Tests
```typescript
// File: /tests/rate-limits.test.ts
describe('Rate Limiting', () => {
  test('Enforces checkout session limits', async () => {
    // Send 11 requests in 1 minute
    // 11th should be rate limited
  });

  test('Separate limits per user', async () => {
    // Verify user A's requests don't affect user B
  });
});
```

### 5. Database Security Tests
```typescript
// File: /tests/database-security.test.ts
describe('Database Security', () => {
  test('RLS prevents unauthorized access', async () => {
    // Attempt to read other user's subscription data
    expect(result).toBeNull();
  });

  test('Service role has appropriate permissions', async () => {
    // Verify admin can update subscriptions
  });
});
```

## Non-Programmatically Testable Scenarios

### 1. Manual Payment Flow Testing
- [ ] Complete checkout with test card 4242 4242 4242 4242
- [ ] Verify subscription appears in Stripe Dashboard
- [ ] Confirm webhook received and processed
- [ ] Check database updated correctly
- [ ] Verify credits allocated properly

### 2. Edge Case Testing
- [ ] Test with 3D Secure required card: 4000 0025 0000 3155
- [ ] Test with insufficient funds card: 4000 0000 0000 9995
- [ ] Test subscription upgrade/downgrade flow
- [ ] Test cancellation and resubscription
- [ ] Test payment method update via portal

### 3. Security Penetration Testing
- [ ] Attempt SQL injection in webhook payload
- [ ] Try XSS in customer metadata
- [ ] Test CSRF protection on payment endpoints
- [ ] Verify HTTPS enforcement
- [ ] Check for timing attacks on credit checks

### 4. Load Testing
- [ ] Simulate 100 concurrent webhook deliveries
- [ ] Test checkout session creation under load
- [ ] Verify credit system performance with 1000 concurrent users
- [ ] Monitor database connection pooling

### 5. Compliance Testing
- [ ] Verify PCI compliance (no card data stored)
- [ ] Check GDPR compliance for EU customers
- [ ] Test data retention policies
- [ ] Verify secure data transmission
- [ ] Audit logging completeness

## Implementation Tasks Priority

### Immediate (Security Critical)
1. **Fix Webhook Security** (2 days)
   - Add replay protection
   - Implement timestamp validation
   - Create webhook event log table

2. **Add Rate Limiting** (1 day)
   - Implement middleware
   - Configure limits per endpoint
   - Add monitoring

### High Priority (Within 1 Week)
3. **Centralize Configuration** (1 day)
   - Move all Stripe IDs to environment
   - Create configuration module
   - Update all references

4. **Fix Credit Race Conditions** (1 day)
   - Add database locking
   - Implement transaction retry logic
   - Add integration tests

5. **Implement Audit Logging** (2 days)
   - Create audit tables
   - Add logging to all payment events
   - Create admin dashboard

### Medium Priority (Within 2 Weeks)
6. **Comprehensive Test Suite** (3 days)
   - Unit tests for all payment functions
   - Integration tests for full flows
   - Load testing setup

7. **Monitoring and Alerts** (2 days)
   - Payment failure alerts
   - Unusual activity detection
   - Performance monitoring

8. **Documentation** (1 day)
   - Security procedures
   - Incident response plan
   - Testing checklist

## Testing Commands

### Run Payment Flow Test
```bash
npm run test:payments
```

### Test Specific Webhook
```bash
stripe trigger checkout.session.completed \
  --override checkout_session:metadata.user_id=test-user-123
```

### Load Test Webhooks
```bash
artillery run tests/load/webhooks.yml
```

### Security Scan
```bash
npm audit
npm run security:scan
```

## Monitoring Checklist

### Daily
- [ ] Check webhook delivery success rate
- [ ] Review failed payment logs
- [ ] Monitor credit usage anomalies

### Weekly
- [ ] Audit subscription sync status
- [ ] Review security alerts
- [ ] Check for unusual patterns

### Monthly
- [ ] Full payment reconciliation
- [ ] Security audit
- [ ] Performance review

## Conclusion

The payment system has several critical security issues that need immediate attention. The most urgent is improving webhook security to prevent replay attacks and unauthorized modifications. Following the implementation of these fixes and comprehensive testing, the system will be production-ready with proper security measures in place.

**Estimated Time to Production Ready: 2 weeks** (with immediate security fixes applied first)