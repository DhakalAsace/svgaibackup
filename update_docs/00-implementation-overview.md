# Credit System Implementation Overview

## Summary of Changes
This document provides a high-level overview of the credit system implementation for SVG AI. The system replaces the current generation-based limits with a credit-based system where:
- 1 icon generation = 1 credit
- 1 SVG generation = 2 credits
- Free users get 6 lifetime credits (3 SVGs or 6 icons)
- Paid plans provide monthly recurring credits

## Implementation Tasks

### Task 1: Signup Flow Modification
**File**: [01-signup-flow-modification.md](./01-signup-flow-modification.md)
- Show signup modal BEFORE generation (not after)
- Preserve user's prompt through signup process
- Automatic prompt restoration after authentication

### Task 2: Credit System Backend
**File**: [02-credit-system-backend.md](./02-credit-system-backend.md)
- Database schema updates for credit tracking
- New SQL function `check_credits_v3`
- API endpoint modifications
- Webhook handler updates

### Task 3: Pricing and Stripe Updates
**File**: [03-pricing-and-stripe-updates.md](./03-pricing-and-stripe-updates.md)
- New pricing: Starter $12/$119, Pro $29/$289
- Annual billing implementation
- Subscription management (upgrades/downgrades at period end)
- Stripe webhook modifications

### Task 4: Frontend UI Updates
**File**: [04-frontend-ui-updates.md](./04-frontend-ui-updates.md)
- Display credits instead of generations
- Show credit costs (1 for icon, 2 for SVG)
- Update all messaging and UI components
- Dashboard credit tracking

## Implementation Order
1. **Backend First**: Implement database changes and API updates (Task 2)
2. **Stripe Setup**: Configure new prices in Stripe dashboard (Task 3)
3. **Frontend Updates**: Update UI components for credits (Task 4)
4. **Flow Enhancement**: Implement signup flow improvements (Task 1)

## Critical Configuration Steps

### Stripe Dashboard
1. Create new price IDs:
   - Starter Monthly: $12/month
   - Starter Annual: $119/year
   - Pro Monthly: $29/month
   - Pro Annual: $289/year

2. Update webhook endpoint if needed

### Database Migration
Run migrations in this order:
1. `implement_credit_system.sql` - Core credit system
2. `add_subscription_interval.sql` - Annual billing support

### Environment Variables
No new environment variables required. Uses existing:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## Testing Strategy

### Phase 1: Development Testing
1. Test credit deduction (1 for icon, 2 for SVG)
2. Verify 6 lifetime credits for new users
3. Test monthly credit reset for subscribers
4. Verify annual subscription handling

### Phase 2: User Flow Testing
1. Anonymous user → Signup → Generation with preserved prompt
2. Free user exhausting credits → Upgrade flow
3. Monthly to annual plan changes
4. Downgrade scheduling for period end

### Phase 3: Edge Cases
1. Concurrent generation requests
2. Credit reset at exact billing boundary
3. Webhook retry handling
4. Migration of existing users

## Rollback Procedures
Each task document includes specific rollback steps. General approach:
1. Keep database backup before migration
2. Maintain old Stripe prices during transition
3. Feature flag for gradual rollout
4. Revert commits in reverse order if needed

## Post-Implementation Tasks
1. Update documentation and FAQ
2. Notify existing users of credit system
3. Monitor credit usage patterns
4. Adjust credit allocations based on data
5. Update email templates with new terminology

## Success Metrics
- Conversion rate from free to paid
- Average credits used per user
- Support ticket reduction
- User satisfaction scores
- Revenue per user

## Risk Mitigation
1. **Data Loss**: Backup profiles table before migration
2. **Billing Errors**: Test thoroughly in Stripe test mode
3. **User Confusion**: Clear migration messaging
4. **Performance**: Index new credit columns
5. **Compatibility**: Maintain API backwards compatibility