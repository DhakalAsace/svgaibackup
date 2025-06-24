# Payment Security Implementation Checklist

This checklist provides step-by-step implementation tasks for fixing payment security issues. Check off each task as you complete it.

## 🚨 IMMEDIATE SECURITY FIXES (Complete First!)

### 1. Webhook Security Enhancement
- [x] Create `/lib/webhook-security.ts` with the following:
  ```typescript
  import crypto from 'crypto';
  
  export interface WebhookEvent {
    id: string;
    type: string;
    created: number;
    data: any;
  }
  
  export class WebhookSecurity {
    private static readonly MAX_AGE_SECONDS = 300; // 5 minutes
    
    static validateTimestamp(timestamp: number): boolean {
      const now = Math.floor(Date.now() / 1000);
      return (now - timestamp) <= this.MAX_AGE_SECONDS;
    }
    
    static generateIdempotencyKey(eventId: string): string {
      return crypto.createHash('sha256').update(eventId).digest('hex');
    }
  }
  ```

- [x] Create database migration `/migrations/add_webhook_events_table.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);
  CREATE INDEX idx_webhook_events_idempotency ON webhook_events(idempotency_key);
  ```

- [x] Update `/app/api/webhooks/stripe/route.ts` - Add to the beginning of POST function:
  ```typescript
  // Add after line 116 (after event construction)
  
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
    console.log('Webhook already processed:', event.id);
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
  ```

- [x] Run the migration in Supabase dashboard

### 2. Environment Variable Configuration
- [x] Create `/lib/stripe-config.ts`:
  ```typescript
  export const STRIPE_CONFIG = {
    prices: {
      starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_1RW8DSIe6gMo8ijpNM67JVAX',
      starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || 'price_1RcNYUIe6gMo8ijpRtzAFayx',
      pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1RcNYcIe6gMo8ijpfeKA0bb4',
      pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_1RcNeTIe6gMo8ijpB0qJ85Cy',
    },
    webhookTimeout: 300000,
    maxRetries: 3
  } as const;
  
  export const PRICE_TO_TIER: Record<string, { tier: string; credits: number; interval: string }> = {
    [STRIPE_CONFIG.prices.starter_monthly]: { tier: 'starter', credits: 100, interval: 'monthly' },
    [STRIPE_CONFIG.prices.starter_annual]: { tier: 'starter', credits: 100, interval: 'annual' },
    [STRIPE_CONFIG.prices.pro_monthly]: { tier: 'pro', credits: 350, interval: 'monthly' },
    [STRIPE_CONFIG.prices.pro_annual]: { tier: 'pro', credits: 350, interval: 'annual' },
  };
  ```

- [x] Update `/app/api/webhooks/stripe/route.ts` - Replace lines 25-30:
  ```typescript
  import { PRICE_TO_TIER } from '@/lib/stripe-config';
  // Remove the hardcoded PRICE_TO_TIER constant
  ```

- [x] Update `/app/api/create-checkout-session/route.ts` - Replace lines 15-20:
  ```typescript
  import { STRIPE_CONFIG } from '@/lib/stripe-config';
  // Remove the hardcoded PRICE_IDS constant
  // Update line 86 to use STRIPE_CONFIG.prices
  ```

- [x] Add to `.env.local`:
  ```bash
  # Stripe Price IDs
  STRIPE_PRICE_STARTER_MONTHLY=price_1RW8DSIe6gMo8ijpNM67JVAX
  STRIPE_PRICE_STARTER_ANNUAL=price_1RcNYUIe6gMo8ijpRtzAFayx
  STRIPE_PRICE_PRO_MONTHLY=price_1RcNYcIe6gMo8ijpfeKA0bb4
  STRIPE_PRICE_PRO_ANNUAL=price_1RcNeTIe6gMo8ijpB0qJ85Cy
  ```

### 3. Rate Limiting Implementation
- [ ] Install rate limiting package (MANUAL STEP REQUIRED):
  ```bash
  npm install @upstash/ratelimit @upstash/redis
  ```

- [x] Create `/lib/rate-limit.ts`:
  ```typescript
  import { Ratelimit } from '@upstash/ratelimit';
  import { Redis } from '@upstash/redis';
  
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  
  export const rateLimiters = {
    checkout: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
      analytics: true,
    }),
    portal: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
      analytics: true,
    }),
    webhook: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
      analytics: true,
    }),
  };
  ```

- [x] Add to `/app/api/create-checkout-session/route.ts` after line 22 (COMMENTED OUT - needs packages):
  ```typescript
  import { rateLimiters } from '@/lib/rate-limit';
  
  // In POST function, after user check:
  const identifier = user.id;
  const { success } = await rateLimiters.checkout.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
  ```

- [x] Add similar rate limiting to `/app/api/create-portal-session/route.ts` (COMMENTED OUT - needs packages)
- [x] Add similar rate limiting to `/app/api/webhooks/stripe/route.ts` (use IP as identifier) (COMMENTED OUT - needs packages)

## HIGH PRIORITY FIXES (Complete within 1 week)

### 4. Fix Credit System Race Conditions
- [x] Create migration `/migrations/fix_credit_race_conditions.sql`:
  ```sql
  -- Drop and recreate the function with row locking
  DROP FUNCTION IF EXISTS public.check_credits_v3;
  
  CREATE OR REPLACE FUNCTION public.check_credits_v3(
    p_user_id UUID,
    p_identifier TEXT,
    p_identifier_type TEXT,
    p_generation_type TEXT
  )
  RETURNS TABLE(
    success BOOLEAN,
    current_count INTEGER,
    remaining_credits INTEGER,
    is_subscribed BOOLEAN,
    limit_type TEXT
  ) 
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    v_profile RECORD;
    v_credits_needed INTEGER;
    v_total_available INTEGER;
    v_is_subscribed BOOLEAN;
  BEGIN
    -- Determine credits needed
    v_credits_needed := CASE 
      WHEN p_generation_type = 'icon' THEN 1
      WHEN p_generation_type = 'svg' THEN 2
      ELSE 2
    END;

    -- Anonymous users check
    IF p_user_id IS NULL THEN
      -- Ensure we lock the anonymous usage row to prevent concurrent updates
      SELECT * INTO v_profile
      FROM daily_generation_limits
      WHERE identifier = p_identifier
      FOR UPDATE;

      -- If no row exists yet, create it with zero count so that we can safely increment
      IF NOT FOUND THEN
        INSERT INTO daily_generation_limits(identifier, identifier_type, current_count, created_at)
        VALUES (p_identifier, p_identifier_type, 0, NOW())
        RETURNING * INTO v_profile;
      END IF;

      v_total_available := GREATEST(0, 25 - v_profile.current_count);

      -- Insufficient remaining credits for anonymous user
      IF v_total_available < v_credits_needed THEN
        RETURN QUERY SELECT FALSE, v_profile.current_count, v_total_available, FALSE, 'anonymous';
        RETURN;
      END IF;

      -- Atomically increment the usage counter
      UPDATE daily_generation_limits
      SET current_count = current_count + v_credits_needed,
          updated_at   = NOW()
      WHERE identifier = p_identifier;

      RETURN QUERY SELECT TRUE,
                    v_profile.current_count + v_credits_needed,
                    v_total_available - v_credits_needed,
                    FALSE,
                    'anonymous';
      RETURN;
    END IF;

    -- Get user profile with row lock to prevent concurrent modifications
    SELECT * INTO v_profile
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- [Keep rest of the function logic]
    -- ... (lines 100-167 from original function)
  END;
  $$;
  ```

- [x] Run the migration in Supabase dashboard

### 5. Add Payment Audit Trail
- [x] Create migration `/migrations/add_payment_audit_log.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS payment_audit_log (
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
  CREATE INDEX idx_payment_audit_created ON payment_audit_log(created_at);
  ```

- [x] Create `/lib/payment-audit.ts`:
  ```typescript
  import { createClient } from '@supabase/supabase-js';
  
  export async function logPaymentEvent(
    supabase: any,
    userId: string | null,
    eventType: string,
    eventData: any,
    stripeEventId?: string,
    request?: Request
  ) {
    const ip = request?.headers.get('x-forwarded-for')?.split(',')[0] || 
                request?.headers.get('x-real-ip') || null;
    const userAgent = request?.headers.get('user-agent') || null;
    
    await supabase.from('payment_audit_log').insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      stripe_event_id: stripeEventId,
      ip_address: ip,
      user_agent: userAgent
    });
  }
  ```

- [x] Add audit logging to `/app/api/create-checkout-session/route.ts`:
  ```typescript
  // After successful session creation:
  await logPaymentEvent(
    supabase,
    user.id,
    'checkout_session_created',
    { session_id: session.id, tier, interval },
    null,
    req
  );
  ```

- [x] Add audit logging to all webhook events in `/app/api/webhooks/stripe/route.ts`

### 6. Create Test Suite
- [x] Create `/tests/setup.ts`:
  ```typescript
  import { createClient } from '@supabase/supabase-js';
  import Stripe from 'stripe';
  
  export const testSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  export const testStripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
  });
  
  export async function createTestUser() {
    const email = `test-${Date.now()}@example.com`;
    const { data, error } = await testSupabase.auth.admin.createUser({
      email,
      password: 'test123456',
    });
    return data?.user;
  }
  
  export async function cleanupTestUser(userId: string) {
    await testSupabase.auth.admin.deleteUser(userId);
  }
  ```

- [x] Create `/tests/webhooks.test.ts`:
  ```typescript
  import { describe, test, expect } from '@jest/globals';
  import crypto from 'crypto';
  
  describe('Webhook Security', () => {
    test('Rejects invalid signatures', async () => {
      const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'stripe-signature': 'invalid_signature' },
        body: JSON.stringify({ type: 'checkout.session.completed' })
      });
      expect(response.status).toBe(400);
    });
    
    test('Rejects old timestamps', async () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 400; // 6+ minutes old
      const payload = JSON.stringify({
        id: 'evt_test',
        type: 'checkout.session.completed',
        created: oldTimestamp
      });
      
      // Generate valid signature with old timestamp
      const signature = generateTestSignature(payload, oldTimestamp);
      
      const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'stripe-signature': signature },
        body: payload
      });
      expect(response.status).toBe(400);
    });
  });
  ```

- [x] Create `/tests/credits.test.ts`
- [x] Create `/tests/subscription.test.ts`
- [x] Update `package.json` to add test script:
  ```json
  "scripts": {
    "test:payments": "jest tests/*.test.ts"
  }
  ```

## MEDIUM PRIORITY FIXES (Complete within 2 weeks)

### 7. Add Monitoring and Alerts
- [x] Create `/lib/monitoring.ts`:
  ```typescript
  export async function checkWebhookHealth() {
    // Query recent webhook events
    // Alert if failure rate > 5%
  }
  
  export async function checkPaymentHealth() {
    // Monitor checkout completion rate
    // Alert on unusual patterns
  }
  ```

- [ ] Set up cron job for monitoring (using Vercel Cron or similar)

### 8. Security Headers
- [x] Update `/middleware.ts` to add security headers:
  ```typescript
  // Add to payment endpoints:
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  ```

### 9. Documentation Updates
- [x] Create `/docs/PAYMENT_SECURITY_PROCEDURES.md`
- [x] Create `/docs/INCIDENT_RESPONSE_PLAN.md`
- [x] Update README with security best practices

## DEPLOYMENT CHECKLIST

### Production Environment Setup
- [ ] Set all environment variables in production
- [ ] Configure Stripe webhook endpoint in Dashboard
- [ ] Enable webhook signature verification
- [ ] Set up Upstash Redis for rate limiting
- [ ] Configure monitoring alerts

### Pre-Launch Testing
- [ ] Run full test suite
- [ ] Perform manual end-to-end testing
- [ ] Load test payment endpoints
- [ ] Security scan with `npm audit`

### Go-Live
- [ ] Deploy with feature flag initially
- [ ] Monitor first 24 hours closely
- [ ] Have rollback plan ready

## VERIFICATION CHECKLIST

After implementing each section, verify:

### Webhook Security
- [ ] Old webhooks are rejected
- [ ] Duplicate webhooks return 200 without processing
- [ ] All webhooks are logged in database

### Configuration
- [ ] No hardcoded price IDs remain
- [ ] Environment variables are set
- [ ] Configuration is imported correctly

### Rate Limiting
- [ ] Excessive requests return 429
- [ ] Different users have separate limits
- [ ] Redis connection is stable

### Credit System
- [ ] Concurrent requests handled correctly
- [ ] No free generations possible
- [ ] Credits deduct accurately

### Audit Trail
- [ ] All payment events logged
- [ ] IP addresses captured
- [ ] Queries perform well

## Notes
- Test each fix in development first
- Keep backups before database migrations
- Document any deviations from this plan
- Report blockers immediately

Last Updated: [Date]
Completed By: [Developer Name]