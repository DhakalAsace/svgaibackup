# Task 4: Frontend UI Updates for Credit System

## Objective
Update all frontend components to display credits instead of generations, show credit costs clearly, and update messaging throughout the application.

## Component Updates Required

### 1. Generation Upsell Component
**File**: `/components/generation-upsells.tsx`

**Update GenerationUpsellProps interface (lines 12-18)**:
```typescript
interface GenerationUpsellProps {
  creditsUsed: number;      // Changed from generationsUsed
  creditLimit: number;      // Changed from limit
  isSubscribed: boolean;
  limitType?: 'daily' | 'monthly' | 'lifetime';  // Add lifetime
  tier?: string | null;
}
```

**Update component display logic (lines 20-130)**:
```typescript
export function GenerationUpsell({ 
  creditsUsed, 
  creditLimit, 
  isSubscribed,
  limitType = 'lifetime',
  tier
}: GenerationUpsellProps) {
  const percentage = creditLimit > 0 ? (creditsUsed / creditLimit) * 100 : 100;
  const remaining = Math.max(0, creditLimit - creditsUsed);
  
  if (isSubscribed && tier) {
    return (
      <Card className="p-4 bg-gradient-to-r from-[#FFF8F6] to-white border-[#FFE0B2]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {tier === 'pro' ? (
              <Crown className="w-5 h-5 text-[#FF7043] mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#FF7043] mr-2" />
            )}
            <span className="font-medium text-sm">
              {tier === 'pro' ? 'Pro' : 'Starter'} Plan
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {remaining} credits left
          </span>
        </div>
        <Progress value={percentage} className="h-2 mb-2" />
        <p className="text-xs text-gray-600">
          {creditsUsed} of {creditLimit} credits used this month
        </p>
        {percentage > 80 && tier !== 'pro' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm mb-2">Running low on credits?</p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/pricing">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade to Pro (350 credits/month)
              </Link>
            </Button>
          </div>
        )}
      </Card>
    );
  }
  
  // Free user with lifetime credits
  if (limitType === 'lifetime') {
    return (
      <Card className="p-4 bg-gradient-to-r from-white to-[#FFF8F6] border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-sm">Free Account</span>
          <span className="text-sm text-gray-600">
            {remaining} lifetime credits left
          </span>
        </div>
        <Progress value={percentage} className="h-2 mb-3" />
        
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            {creditsUsed} of {creditLimit} one-time credits used
          </p>
          
          {remaining === 0 && (
            <div className="bg-[#FFF8F6] p-3 rounded-lg">
              <p className="text-sm font-medium mb-1 flex items-center">
                <Zap className="w-4 h-4 text-[#FF7043] mr-1" />
                No credits remaining!
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Subscribe to get monthly credits that refresh
              </p>
              <Button size="sm" className="w-full bg-[#FF7043] hover:bg-[#FF5722]" asChild>
                <Link href="/pricing">
                  View Plans
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }
```

### 2. Update Hero Components

**File**: `/components/hero.tsx`

**Add credit cost display** (after line 531, before generate button):
```typescript
{/* Credit cost indicator */}
<div className="mt-3 flex items-center justify-center text-sm text-gray-600">
  <Sparkles className="w-4 h-4 mr-1 text-[#FF7043]" />
  <span>This will use 2 credits</span>
</div>
```

**Update error messages** (lines 186-204):
```typescript
if (response.status === 429) {
  const errorMessage = responseData.error || "";
  
  if (errorMessage.includes("Sign up to get")) {
    // Anonymous user - show signup modal
    setIsSoftPrompt(false);
    setShowSignupModal(true);
  } else if (errorMessage.includes("no credits remaining") || errorMessage.includes("lifetime credits")) {
    // Free user out of credits - show upgrade modal
    setShowUpgradeModal(true);
  } else if (errorMessage.includes("monthly credits")) {
    // Subscribed user out of credits
    setError("You've used all your monthly credits. They'll refresh at the start of your next billing period.");
  }
  
  setIsGenerating(false)
  return
}
```

**File**: `/app/ai-icon-generator/hero-section.tsx`

**Add credit cost display** (similar location):
```typescript
{/* Credit cost indicator */}
<div className="mt-3 flex items-center justify-center text-sm text-gray-600">
  <Sparkles className="w-4 h-4 mr-1 text-[#FF7043]" />
  <span>This will use 1 credit</span>
</div>
```

### 3. Update Signup Modal
**File**: `/components/auth/generation-signup-modal.tsx`

**Update benefit text** (lines 65-89):
```typescript
<div className="space-y-4 mt-6">
  <div className="flex items-start space-x-3">
    <Gift className="h-5 w-5 text-[#FF7043] mt-0.5" />
    <div>
      <p className="font-medium">6 free credits on signup</p>
      <p className="text-sm text-gray-600">Create 3 SVGs or 6 icons</p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <History className="h-5 w-5 text-[#FF7043] mt-0.5" />
    <div>
      <p className="font-medium">Save your creations</p>
      <p className="text-sm text-gray-600">Access your designs anytime</p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <Sparkles className="h-5 w-5 text-[#FF7043] mt-0.5" />
    <div>
      <p className="font-medium">Track your credits</p>
      <p className="text-sm text-gray-600">See usage and remaining balance</p>
    </div>
  </div>
</div>
```

**Update hard prompt section** (lines 122-149):
```typescript
<DialogDescription className="text-base mt-2">
  {isAuthenticatedFreeUser
    ? "You've used all 6 of your free credits. Subscribe for monthly credits!"
    : "You've used your free generation. Sign up to get 6 free credits!"}
</DialogDescription>

{!isAuthenticated && (
  <div className="bg-[#FFF8F6] p-4 rounded-lg mt-4">
    <p className="font-medium mb-2">With a free account:</p>
    <ul className="space-y-1 text-sm">
      <li>• 6 one-time credits</li>
      <li>• Create 3 SVGs or 6 icons</li>
      <li>• Save your designs</li>
      <li>• Track your usage</li>
    </ul>
  </div>
)}

<div className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] p-4 rounded-lg text-white">
  <p className="font-medium mb-2">Want more? Pro plans include:</p>
  <ul className="space-y-1 text-sm">
    <li>• 100-350 credits per month</li>
    <li>• Credits refresh monthly</li>
    <li>• No watermarks</li>
    <li>• Extended history</li>
  </ul>
</div>
```

### 4. Update Dashboard Component
**File**: `/components/dashboard/dashboard.tsx`

**Update to show credits instead of generations**:
```typescript
// Add credit display logic
const creditInfo = {
  used: profile?.lifetime_credits_used || profile?.monthly_credits_used || 0,
  limit: profile?.lifetime_credits_granted || profile?.monthly_credits || 0,
  type: profile?.subscription_status === 'active' ? 'monthly' : 'lifetime'
};

// Update the usage display card
<Card>
  <CardHeader>
    <CardTitle>Credit Usage</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Credits Used</span>
        <span className="font-medium">{creditInfo.used}</span>
      </div>
      <div className="flex justify-between">
        <span>Credits Available</span>
        <span className="font-medium">{creditInfo.limit - creditInfo.used}</span>
      </div>
      <Progress value={(creditInfo.used / creditInfo.limit) * 100} />
      {creditInfo.type === 'lifetime' && creditInfo.used >= creditInfo.limit && (
        <p className="text-sm text-amber-600 mt-2">
          You've used all your free credits. Subscribe to get monthly credits!
        </p>
      )}
    </div>
  </CardContent>
</Card>
```

### 5. Update Results Page
**File**: `/app/results/page.tsx`

**Show credit cost on results**:
```typescript
// Add to the results display
<div className="text-sm text-gray-600 flex items-center justify-center mt-2">
  <Sparkles className="w-4 h-4 mr-1" />
  <span>
    {searchParams.type === 'icon' ? '1 credit used' : '2 credits used'}
  </span>
</div>
```

### 6. Update Type Definitions

**File**: `/types/database.types.ts`

**Add credit fields to profiles type**:
```typescript
profiles: {
  Row: {
    // ... existing fields ...
    lifetime_credits_granted: number
    lifetime_credits_used: number
    monthly_credits: number
    monthly_credits_used: number
    credits_reset_at: string
    subscription_interval: string
  }
  // Update Insert and Update types similarly
}
```

## Testing Checklist
1. [ ] Credit costs display correctly (1 for icon, 2 for SVG)
2. [ ] Credit balance updates properly after generation
3. [ ] Signup modal shows 6 free credits messaging
4. [ ] Dashboard displays credits instead of generations
5. [ ] Upgrade prompts show correct credit amounts
6. [ ] Results page shows credits used
7. [ ] All "generation" terminology replaced with "credits"

## Visual QA Points
- Credit indicators are visible but not intrusive
- Progress bars accurately reflect credit usage
- Error messages are clear about credit limits
- Upgrade CTAs mention specific credit amounts
- Pricing page clearly explains credit system

## Rollback Plan
1. Revert GenerationUpsell component changes
2. Remove credit cost indicators
3. Restore "generation" terminology
4. Revert type definitions

## Success Metrics
- Users understand credit costs before generating
- Clear visibility of credit balance at all times
- Reduced confusion about usage limits
- Improved conversion to paid plans