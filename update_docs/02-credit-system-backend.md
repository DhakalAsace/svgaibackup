# Task 2: Credit System Backend Implementation

## Objective
Implement a credit-based system where 1 icon = 1 credit, 1 SVG = 2 credits. Users get 6 one-time credits on signup (3 SVGs or 6 icons lifetime). Monthly plans provide recurring credits.

## Database Changes Required

### 1. Create Migration File
**File**: `/migrations/implement_credit_system.sql`

```sql
-- Add credit fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lifetime_credits_granted INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS credits_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migrate existing data
UPDATE public.profiles 
SET 
  lifetime_credits_granted = 6,
  lifetime_credits_used = LEAST(monthly_generations_used * 2, 6), -- Assume all were SVGs (worst case)
  monthly_credits = CASE 
    WHEN subscription_tier = 'starter' THEN 100
    WHEN subscription_tier = 'pro' THEN 350
    ELSE 0
  END,
  monthly_credits_used = CASE
    WHEN subscription_tier IS NOT NULL THEN monthly_generations_used * 2
    ELSE 0
  END
WHERE monthly_generations_used > 0;

-- Drop old generation tracking columns (after verification)
-- ALTER TABLE public.profiles 
-- DROP COLUMN monthly_generation_limit,
-- DROP COLUMN monthly_generations_used,
-- DROP COLUMN last_generation_reset;

-- Create function to check credit availability
CREATE OR REPLACE FUNCTION public.check_credits_v3(
  p_user_id UUID,
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_generation_type TEXT -- 'icon' or 'svg'
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
    ELSE 2 -- Default to SVG cost
  END;

  -- Anonymous users check
  IF p_user_id IS NULL THEN
    -- Check daily limit for anonymous (they don't have credits)
    SELECT COALESCE(count, 0) INTO current_count
    FROM daily_generation_limits
    WHERE identifier = p_identifier
      AND identifier_type = p_identifier_type
      AND generation_date = CURRENT_DATE;
    
    IF current_count >= 1 THEN
      RETURN QUERY SELECT 
        FALSE as success,
        current_count,
        0 as remaining_credits,
        FALSE as is_subscribed,
        'anonymous_daily' as limit_type;
      RETURN;
    END IF;
    
    -- Increment anonymous counter
    INSERT INTO daily_generation_limits (identifier, identifier_type, generation_date, count)
    VALUES (p_identifier, p_identifier_type, CURRENT_DATE, 1)
    ON CONFLICT (identifier, identifier_type, generation_date)
    DO UPDATE SET count = daily_generation_limits.count + 1;
    
    RETURN QUERY SELECT 
      TRUE as success,
      1 as current_count,
      0 as remaining_credits,
      FALSE as is_subscribed,
      'anonymous_daily' as limit_type;
    RETURN;
  END IF;

  -- Get user profile with credit info
  SELECT * INTO v_profile
  FROM profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Check if subscribed
  v_is_subscribed := v_profile.subscription_status = 'active';

  -- Reset monthly credits if needed
  IF v_is_subscribed AND v_profile.credits_reset_at < date_trunc('month', NOW()) THEN
    UPDATE profiles
    SET 
      monthly_credits_used = 0,
      credits_reset_at = NOW()
    WHERE id = p_user_id;
    
    v_profile.monthly_credits_used := 0;
  END IF;

  -- Calculate total available credits
  IF v_is_subscribed THEN
    -- Subscribed users only use monthly credits
    v_total_available := v_profile.monthly_credits - v_profile.monthly_credits_used;
  ELSE
    -- Free users use lifetime credits
    v_total_available := v_profile.lifetime_credits_granted - v_profile.lifetime_credits_used;
  END IF;

  -- Check if enough credits
  IF v_total_available < v_credits_needed THEN
    RETURN QUERY SELECT 
      FALSE as success,
      CASE 
        WHEN v_is_subscribed THEN v_profile.monthly_credits_used
        ELSE v_profile.lifetime_credits_used
      END as current_count,
      v_total_available as remaining_credits,
      v_is_subscribed,
      CASE 
        WHEN v_is_subscribed THEN 'monthly_credits'
        ELSE 'lifetime_credits'
      END as limit_type;
    RETURN;
  END IF;

  -- Deduct credits
  IF v_is_subscribed THEN
    UPDATE profiles
    SET monthly_credits_used = monthly_credits_used + v_credits_needed
    WHERE id = p_user_id;
  ELSE
    UPDATE profiles
    SET lifetime_credits_used = lifetime_credits_used + v_credits_needed
    WHERE id = p_user_id;
  END IF;

  RETURN QUERY SELECT 
    TRUE as success,
    CASE 
      WHEN v_is_subscribed THEN v_profile.monthly_credits_used + v_credits_needed
      ELSE v_profile.lifetime_credits_used + v_credits_needed
    END as current_count,
    v_total_available - v_credits_needed as remaining_credits,
    v_is_subscribed,
    CASE 
      WHEN v_is_subscribed THEN 'monthly_credits'
      ELSE 'lifetime_credits'
    END as limit_type;
END;
$$;

-- Update handle_new_user function to grant lifetime credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    lifetime_credits_granted,
    lifetime_credits_used,
    monthly_credits,
    monthly_credits_used,
    credits_reset_at,
    subscription_status
  )
  VALUES (
    NEW.id,
    6, -- 6 lifetime credits for new users
    0,
    0,
    0,
    NOW(),
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Update Generation APIs

**File**: `/app/api/generate-svg/route.ts`

**Changes at lines 122-153** (rate limiting section):
```typescript
// Replace the check_generation_limit_v2 call with:
const { data: limitResult, error: limitError } = await supabaseAdmin
  .rpc('check_credits_v3', {
    p_user_id: userId || null,
    p_identifier: identifier,
    p_identifier_type: identifier_type,
    p_generation_type: 'svg' // This endpoint generates SVGs
  })

if (limitError) {
  logger.error('Error checking credit limit', { error: limitError })
  return serverError('Failed to check generation limit')
}

if (!limitResult || limitResult.length === 0 || !limitResult[0].success) {
  const remaining = limitResult?.[0]?.remaining_credits || 0;
  const limitType = limitResult?.[0]?.limit_type || 'unknown';
  
  let errorMessage = '';
  if (limitType === 'anonymous_daily') {
    errorMessage = "You've used your free generation. Sign up to get 6 free credits!";
  } else if (limitType === 'lifetime_credits') {
    errorMessage = "You've used all your free credits. Upgrade to Pro for more!";
  } else if (limitType === 'monthly_credits') {
    errorMessage = `You've used all your monthly credits (${limitResult[0].current_count}). Upgrade your plan or wait for next month.`;
  }
  
  return tooManyRequests(errorMessage);
}

const remainingCredits = limitResult[0].remaining_credits || 0;
const isSubscribed = limitResult[0].is_subscribed || false;

// Update response to use credits instead of generations
// Line ~490 in the response:
remainingGenerations: remainingCredits, // Keep the same field name for compatibility
creditsUsed: 2, // SVG costs 2 credits
```

**File**: `/app/api/generate-icon/route.ts`

**Apply similar changes**, but with `p_generation_type: 'icon'` and `creditsUsed: 1`

### 3. Update Webhook Handler

**File**: `/app/api/webhooks/stripe/route.ts`

**Changes at lines 26-36** (tier mapping):
```typescript
// Update PRICE_TO_TIER mapping to include credits
const PRICE_TO_TIER: Record<string, { tier: string; credits: number }> = {
  'price_1RW8DSIe6gMo8ijpNM67JVAX': { tier: 'starter', credits: 100 },
  'price_1RW8E3Ie6gMo8ijpU6KQyHwx': { tier: 'pro', credits: 350 },
};

// Update getTierInfo function (lines 38-54):
function getTierInfo(subscription: Stripe.Subscription): { tier: string; credits: number } {
  const priceId = subscription.items.data[0]?.price.id;
  
  if (priceId && PRICE_TO_TIER[priceId]) {
    return PRICE_TO_TIER[priceId];
  }
  
  // Fallback based on amount
  const amount = subscription.items.data[0]?.price.unit_amount;
  if (amount === 1200) return { tier: 'starter', credits: 100 };
  if (amount === 2900) return { tier: 'pro', credits: 350 };
  
  console.warn(`Unknown price configuration for subscription ${subscription.id}`);
  return { tier: 'starter', credits: 100 };
}
```

**Update profile updates** to use credits (multiple locations):
```typescript
// In checkout.session.completed handler (line ~145):
const { tier, credits } = getTierInfo(subscription);

const { error: profileError } = await supabaseAdmin
  .from('profiles')
  .update({
    stripe_customer_id: customerId,
    subscription_status: subscription.status,
    subscription_tier: tier,
    subscription_id: subscription.id,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    monthly_credits: credits,
    monthly_credits_used: 0,
    credits_reset_at: new Date().toISOString(),
  })
  .eq('id', userId);

// Similar updates needed in other event handlers
```

### 4. Update Sync Subscription Endpoint

**File**: `/app/api/sync-subscription/route.ts`

Update to sync credit information instead of generation limits.

## Testing SQL Functions

```sql
-- Test credit check for new user (should have 6 credits)
SELECT * FROM check_credits_v3(
  'user-uuid-here'::uuid,
  'user-uuid-here',
  'user_id',
  'svg'
);

-- Test after using 2 credits (1 SVG)
SELECT * FROM check_credits_v3(
  'user-uuid-here'::uuid,
  'user-uuid-here',
  'user_id',
  'icon'
);
```

## Rollback Plan
1. Keep backup of original check_generation_limit_v2 function
2. Restore original API endpoint logic
3. Drop new credit columns from profiles table
4. Restore monthly_generation columns

## Success Metrics
- Users can generate exactly 3 SVGs OR 6 icons with free credits
- Credit deduction is accurate (1 for icon, 2 for SVG)
- Monthly credit reset works correctly
- No credit loss during migration