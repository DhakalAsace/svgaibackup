# A/B Testing Framework Documentation

## Overview

This comprehensive A/B testing framework provides a complete solution for running experiments, feature flags, and gradual rollouts on the SVG AI platform. It includes statistical analysis, automatic winner selection, GDPR compliance, and minimal performance impact.

## Features

- **Multiple Test Types**: A/B tests, multivariate tests, feature flags, gradual rollouts
- **Statistical Analysis**: Automatic significance calculation, sample size estimation
- **Targeting Rules**: Device, location, user properties, custom rules
- **Real-time Dashboard**: Live results, visualizations, test controls
- **GDPR Compliant**: Consent management, data minimization, privacy controls
- **Performance Optimized**: Lazy loading, caching, minimal overhead
- **QA Tools**: Preview modes, forced variants, debug utilities

## Quick Start

### 1. Wrap Your App with Provider

```tsx
// app/providers.tsx
import { ABTestProvider } from '@/lib/ab-testing/components'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ABTestProvider
      userId={user?.id}
      userProperties={{
        user_type: user?.type || 'free',
        signup_date: user?.createdAt,
      }}
      device={{
        type: isMobile ? 'mobile' : 'desktop',
        os: navigator.platform,
      }}
    >
      {children}
    </ABTestProvider>
  )
}
```

### 2. Run a Simple A/B Test

```tsx
import { ABTest, Variant } from '@/lib/ab-testing/components'

export function ConverterPage() {
  return (
    <ABTest testId="converter_layout_2024">
      {(variant) => (
        <>
          <Variant testId="converter_layout_2024" variantId="sidebar">
            <SidebarLayout />
          </Variant>
          <Variant testId="converter_layout_2024" variantId="inline">
            <InlineLayout />
          </Variant>
        </>
      )}
    </ABTest>
  )
}
```

### 3. Track Conversions

```tsx
import { ConversionTracker } from '@/lib/ab-testing/components'

export function CTAButton() {
  return (
    <ConversionTracker 
      testId="cta_button_variations" 
      metricId="click_rate"
      trigger="click"
    >
      <Button>Convert Now</Button>
    </ConversionTracker>
  )
}
```

## Test Configuration

### Creating a Test

```typescript
import { abTestManager } from '@/lib/ab-testing'

const myTest: ABTestConfig = {
  id: 'homepage_hero_test',
  name: 'Homepage Hero Variations',
  status: 'active',
  variants: [
    {
      id: 'control',
      name: 'Current Hero',
      weight: 50,
      isControl: true,
    },
    {
      id: 'new_design',
      name: 'New Hero Design',
      weight: 50,
    },
  ],
  successMetrics: [
    {
      id: 'cta_clicks',
      name: 'CTA Click Rate',
      type: 'conversion',
      eventName: 'hero_cta_clicked',
    },
  ],
  minimumSampleSize: 1000,
  confidenceLevel: 95,
}

abTestManager.createTest(myTest)
```

### Targeting Rules

```typescript
targetingRules: [
  {
    type: 'user_property',
    property: 'user_type',
    operator: 'equals',
    value: 'free',
  },
  {
    type: 'device',
    property: 'type',
    operator: 'in',
    value: ['desktop', 'tablet'],
  },
]
```

## React Hooks

### useABTest

```tsx
import { useABTest } from '@/lib/ab-testing/components'

function MyComponent() {
  const { variant, isLoading, trackConversion } = useABTest('test_id')
  
  if (isLoading) return <Skeleton />
  
  return variant?.id === 'new' ? <NewDesign /> : <OldDesign />
}
```

### useFeatureFlag

```tsx
import { useFeatureFlag } from '@/lib/ab-testing/components'

function MyComponent() {
  const showNewFeature = useFeatureFlag('new_animation_tool')
  
  return showNewFeature ? <AnimationTool /> : null
}
```

### useRollout

```tsx
import { useRollout } from '@/lib/ab-testing/components'

function MyComponent() {
  const inRollout = useRollout('video_export', 25) // 25% rollout
  
  return inRollout ? <VideoExportButton /> : null
}
```

## Admin Dashboard

### Accessing the Dashboard

```tsx
import { ABTestDashboard } from '@/lib/ab-testing/admin-dashboard'

export function AdminPage() {
  return <ABTestDashboard isAdmin={true} />
}
```

### Dashboard Features

- View all active experiments
- Real-time performance metrics
- Statistical significance indicators
- Start/pause/complete tests
- Export results as CSV
- Visualizations (bar charts, pie charts)

## QA and Testing

### Force a Variant

```
// URL parameter
?ab_force_converter_layout_2024=inline

// Programmatically
ABTestingQA.forceVariant('converter_layout_2024', 'inline')
```

### Debug Mode

```
// URL parameter
?ab_debug=true

// Programmatically
ABTestingQA.enableDebugMode()
```

### Preview Mode

```tsx
import { TestPreview } from '@/lib/ab-testing/components'

<TestPreview>
  <YourApp />
</TestPreview>
```

## Statistical Analysis

### Sample Size Calculation

```typescript
const sampleSize = abTestManager.calculateSampleSize(
  0.05,    // 5% baseline conversion rate
  0.20,    // 20% minimum detectable effect
  95       // 95% confidence level
)
// Returns: 3,842 participants per variant
```

### Significance Testing

The framework automatically calculates statistical significance using:
- Z-score for proportions
- Configurable confidence levels (default 95%)
- Automatic winner detection when thresholds are met

## Performance Optimization

### Best Practices

1. **Lazy Load Variants**: Use dynamic imports for heavy components
```tsx
const SidebarLayout = lazy(() => import('./SidebarLayout'))
const InlineLayout = lazy(() => import('./InlineLayout'))
```

2. **Cache Assignments**: Assignments are cached in localStorage
3. **Batch Analytics**: Events are batched and sent every 5 seconds
4. **Minimal Re-renders**: Using React Context efficiently

### Performance Monitoring

```typescript
// Check if A/B testing is impacting performance
if (ABTestingPerformance.checkPerformanceImpact(100)) {
  console.warn('A/B testing causing performance issues')
}
```

## GDPR Compliance

### Consent Management

```tsx
import { ABTestingPrivacy } from '@/lib/ab-testing/utils'

// Check consent
if (!ABTestingPrivacy.hasConsent()) {
  // Show consent banner
}

// Set consent
ABTestingPrivacy.setConsent(true)

// Clear all data
ABTestingPrivacy.clearAllData()
```

### Privacy-Safe Context

The framework automatically removes PII when consent is not given:
- No user IDs are tracked
- Only session-based tracking
- Minimal data collection

## Emergency Controls

### Kill Switch

```typescript
import { ABTestingKillSwitch } from '@/lib/ab-testing/utils'

// Activate kill switch (disables all tests)
ABTestingKillSwitch.activate('Performance issues detected')

// Check status
if (ABTestingKillSwitch.isActive()) {
  // All tests are disabled
}

// Deactivate
ABTestingKillSwitch.deactivate()
```

## Common Use Cases

### 1. Converter Layout Test

```tsx
<ABTest testId="converter_layout_2024">
  {(variant) => (
    <div className={variant?.id === 'sidebar' ? 'flex' : 'block'}>
      {/* Layout based on variant */}
    </div>
  )}
</ABTest>
```

### 2. CTA Button Variations

```tsx
<MultiVariantTest testId="cta_button_variations">
  {{
    control: <Button>Convert Now</Button>,
    start_free: <Button>Start Free Conversion</Button>,
    instant_convert: <Button color="accent">Instant Convert</Button>,
    try_now: <Button>Try It Now - Free</Button>,
  }}
</MultiVariantTest>
```

### 3. Feature Flag with Rollout

```tsx
<FeatureFlag flag="video_export">
  <Rollout name="video_export_rollout" percentage={25}>
    <VideoExportButton />
  </Rollout>
</FeatureFlag>
```

### 4. Personalized Experience

```tsx
function PersonalizedHero() {
  const variant = useFeatureValue('hero_personalization', {
    new_user: <WelcomeHero />,
    returning: <ReturningUserHero />,
    power_user: <PowerUserHero />,
  })
  
  return variant || <DefaultHero />
}
```

## Integration with Analytics

The framework automatically integrates with the existing analytics system:

```typescript
// Automatic tracking
analytics.trackABTest(testId, variantId, 'assigned', properties)
analytics.trackABTest(testId, variantId, 'converted', properties)

// Custom events
trackConversion('signup_completed', 29.99) // with value
```

## Troubleshooting

### Common Issues

1. **Variant not showing**: Check test status, targeting rules, and dates
2. **Inconsistent assignments**: Clear cache and check for URL overrides
3. **Performance issues**: Use performance monitoring tools, check variant complexity
4. **No statistical significance**: Ensure adequate sample size and effect size

### Debug Checklist

- [ ] Test is active (`status: 'active'`)
- [ ] User matches targeting rules
- [ ] Within date range (if specified)
- [ ] Traffic allocation includes user
- [ ] No kill switch activated
- [ ] Consent is given (for GDPR)

## Advanced Features

### Custom Metrics

```typescript
successMetrics: [
  {
    id: 'custom_engagement',
    name: 'Custom Engagement Score',
    type: 'custom',
    eventName: 'calculate_engagement_score',
    higherIsBetter: true,
  },
]
```

### Multi-armed Bandit

Coming soon: Automatic traffic allocation based on performance.

### Server-side Testing

Coming soon: Edge function support for server-side experiments.

## Support

For issues or questions:
1. Check the dashboard for test configuration
2. Use debug mode to inspect assignments
3. Review browser console for errors
4. Export test results for analysis