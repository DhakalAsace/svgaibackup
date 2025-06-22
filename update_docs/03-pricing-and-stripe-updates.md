# Task 3: Pricing and Stripe Updates

## Objective
Update pricing to new structure with annual billing options and credit-based system. Implement proper upgrade/downgrade timing (end of billing period only).

## New Pricing Structure
- **Starter**: $12/month or $119/year (100 credits/month)
- **Pro**: $29/month or $289/year (350 credits/month)
- Annual discount: ~17% (marketed as "Two months free")

## Stripe Dashboard Configuration Required

### 1. Create New Price IDs in Stripe
1. Log into Stripe Dashboard
2. Navigate to Products > Create new prices:
   - **Starter Monthly**: $12.00/month
   - **Starter Annual**: $119.00/year
   - **Pro Monthly**: $29.00/month
   - **Pro Annual**: $289.00/year
3. Note the new price IDs for code updates

## Code Changes

### 1. Update Pricing Constants
**File**: `/app/api/create-checkout-session/route.ts`

**Replace lines 10-14**:
```typescript
// Price IDs from your Stripe account
const PRICE_IDS = {
  starter_monthly: 'price_NEW_STARTER_MONTHLY', // Replace with actual
  starter_annual: 'price_NEW_STARTER_ANNUAL',   // Replace with actual
  pro_monthly: 'price_NEW_PRO_MONTHLY',         // Replace with actual
  pro_annual: 'price_NEW_PRO_ANNUAL',           // Replace with actual
};
```

**Update POST handler (lines 25-62)**:
```typescript
const { tier, interval } = await req.json(); // Add interval parameter

// Validate inputs
if (!tier || !['starter', 'pro'].includes(tier)) {
  return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
}

if (!interval || !['monthly', 'annual'].includes(interval)) {
  return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
}

// Get the correct price ID
const priceKey = `${tier}_${interval}`;
const priceId = PRICE_IDS[priceKey as keyof typeof PRICE_IDS];

if (!priceId) {
  return NextResponse.json({ error: 'Invalid pricing selection' }, { status: 400 });
}

// Update metadata to include interval
metadata: {
  user_id: user.id,
  tier,
  interval,
},
```

### 2. Update Webhook Handler
**File**: `/app/api/webhooks/stripe/route.ts`

**Update PRICE_TO_TIER mapping (lines 25-29)**:
```typescript
const PRICE_TO_TIER: Record<string, { tier: string; credits: number; interval: string }> = {
  'price_NEW_STARTER_MONTHLY': { tier: 'starter', credits: 100, interval: 'monthly' },
  'price_NEW_STARTER_ANNUAL': { tier: 'starter', credits: 100, interval: 'annual' },
  'price_NEW_PRO_MONTHLY': { tier: 'pro', credits: 350, interval: 'monthly' },
  'price_NEW_PRO_ANNUAL': { tier: 'pro', credits: 350, interval: 'annual' },
};

// Add subscription interval to profiles table
// This requires a migration to add subscription_interval column
```

### 3. Update Pricing Components

**File**: `/components/pricing.tsx`

**Replace entire plans array (lines 5-49)**:
```typescript
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our AI tools",
    features: [
      "6 one-time credits on signup",
      "Create 3 SVGs or 6 icons",
      "All styles & formats",
      "Watermarked outputs",
    ],
    cta: "Start Creating Free",
    highlighted: false,
    showBillingToggle: false,
  },
  {
    name: "Starter",
    price: { monthly: "$12", annual: "$119" },
    period: { monthly: "per month", annual: "per year" },
    savings: "Save $25/year",
    description: "For individuals and small projects",
    features: [
      "100 credits per month",
      "Create 50 SVGs or 100 icons",
      "No watermarks",
      "7-day generation history",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
    tier: 'starter',
    showBillingToggle: true,
  },
  {
    name: "Pro",
    price: { monthly: "$29", annual: "$289" },
    period: { monthly: "per month", annual: "per year" },
    savings: "Save $59/year",
    description: "For professionals and businesses",
    features: [
      "350 credits per month",
      "Create 175 SVGs or 350 icons",
      "Everything in Starter",
      "30-day extended history",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    tier: 'pro',
    showBillingToggle: true,
  },
]
```

**Add billing toggle state and UI** (after line 4):
```typescript
export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  
  // Add toggle UI before plans grid
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* ... existing header ... */}
        
        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'annual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-[#00B894]">Save 17%</span>
            </button>
          </div>
        </div>
```

### 4. Update Pricing Section Component
**File**: `/components/pricing-section.tsx`

**Add billing interval to subscription handler** (lines 78-126):
```typescript
const handleSubscribe = async (tier?: 'starter' | 'pro', interval: 'monthly' | 'annual' = 'monthly') => {
  // ... existing checks ...
  
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tier, interval }), // Add interval
    });
```

### 5. Add Subscription Management Features

**Create new file**: `/app/api/manage-subscription/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, newTier, newInterval } = await req.json();

  // Get user's current subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_id, stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.subscription_id) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);

    if (action === 'cancel') {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });
    } else if (action === 'change_plan') {
      // Schedule plan change for end of period
      const newPriceId = PRICE_IDS[`${newTier}_${newInterval}`];
      
      await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'none', // No proration, change at period end
        billing_cycle_anchor: 'unchanged',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}
```

### 6. Database Migration for Interval Tracking

**File**: `/migrations/add_subscription_interval.sql`
```sql
-- Add interval column to track billing period
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_interval TEXT DEFAULT 'monthly';

-- Update subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS interval TEXT DEFAULT 'monthly';
```

## Testing Checklist
1. [ ] Monthly to annual upgrade works
2. [ ] Annual to monthly downgrade scheduled for period end
3. [ ] Correct credits assigned for each tier
4. [ ] Billing toggle updates prices correctly
5. [ ] Stripe webhook processes new price IDs
6. [ ] Credits reset properly for both monthly and annual

## Rollback Plan
1. Revert to old PRICE_IDS constants
2. Remove interval parameter from checkout session
3. Restore original pricing component
4. Keep old Stripe prices active during transition

## Post-Deployment Tasks
1. Update Stripe webhook endpoint in Stripe dashboard
2. Deactivate old price IDs (after migration period)
3. Update any email templates with new pricing
4. Monitor webhook logs for processing errors