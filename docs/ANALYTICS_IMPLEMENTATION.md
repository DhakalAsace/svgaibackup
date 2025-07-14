# Analytics Implementation Guide

## Overview

This document describes the comprehensive analytics implementation for SVG AI, combining Google Analytics 4, PostHog, and custom tracking to monitor user behavior, conversion funnels, and business metrics.

## Architecture

### 1. Analytics Services

- **Google Analytics 4**: Primary analytics platform for traffic, user behavior, and conversions
- **PostHog**: Product analytics, feature flags, session recordings, and A/B testing
- **Vercel Analytics**: Performance monitoring and Web Vitals
- **Custom Database**: Server-side event storage for critical business events

### 2. Tracking Configuration

All analytics events are centrally configured in `/lib/analytics/tracking-config.ts`:

```typescript
// Event categories
- CONVERTER: File conversion events
- GALLERY: Gallery browsing and downloads
- TOOL: Editor, optimizer, animator usage
- PREMIUM: Video export and credit usage
- LEARN: Educational content engagement
- FUNNEL: Conversion funnel tracking
- ENGAGEMENT: User interaction patterns
- PERFORMANCE: Page load and API metrics
```

### 3. Custom Dimensions

GA4 custom dimensions for advanced segmentation:

1. **User Type** (dimension1): free/paid/trial
2. **Converter Type** (dimension2): png-to-svg, svg-to-png, etc.
3. **Content Category** (dimension3): converter/gallery/learn/tool
4. **Session Quality** (dimension4): engaged/bounced/converted
5. **Feature Tier** (dimension5): free/premium
6. **Referral Source** (dimension6): organic/paid/social/direct
7. **A/B Test Variant** (dimension7): test variants
8. **User Journey Stage** (dimension8): awareness/consideration/decision

## Implementation

### 1. Client-Side Tracking

Use the enhanced analytics hook in components:

```typescript
import { useEnhancedAnalytics } from '@/hooks/use-enhanced-analytics'

function ConverterPage({ converterType }) {
  const analytics = useEnhancedAnalytics({
    tool: converterType,
    category: 'converter',
  })

  // Track conversion process
  const handleFileSelect = (file) => {
    analytics.trackConverter('fileSelected', converterType, {
      file_size: file.size,
      file_type: file.type,
    })
  }

  // Track errors
  const handleError = (error) => {
    analytics.trackError(error, {
      type: 'conversion_error',
      converter: converterType,
    })
  }
}
```

### 2. Server-Side Tracking

Track critical events server-side:

```typescript
import { trackServerEvent, trackServerConversion } from '@/lib/analytics/server-analytics'

// In API routes
export async function POST(request: Request) {
  const context = await getServerContext(request)
  
  try {
    // Process conversion...
    
    await trackServerConversion(
      userId,
      'premium_subscription',
      29.99,
      { plan: 'pro', interval: 'monthly' }
    )
  } catch (error) {
    await trackServerEvent('api_error', {
      endpoint: '/api/subscribe',
      error: error.message,
    }, context)
  }
}
```

### 3. Conversion Funnel Tracking

Track user journey through conversion funnels:

```typescript
// Converter funnel
const tracker = analytics.createConversionTracker('png-to-svg')
tracker.trackFileSelected(file.size, file.type)
tracker.trackConversionStarted()
tracker.trackConversionCompleted(true, { 
  conversionTime: 2500,
  outputSize: 1024 
})
tracker.trackDownload()

// Premium conversion funnel
analytics.trackFunnel('conversionCompleted', 'free_to_paid', {
  from_tool: 'svg-editor',
  to_feature: 'video-export',
  journey_duration: 180000,
})
```

### 4. A/B Testing

Implement A/B tests with tracking:

```typescript
const ctaTracker = analytics.createCTATracker('premium_upsell_test', [
  { id: 'control', text: 'Upgrade Now', style: 'primary', size: 'md' },
  { id: 'variant_a', text: 'Try Premium Features', style: 'primary', size: 'lg' },
  { id: 'variant_b', text: 'Unlock Video Export', style: 'secondary', size: 'md' },
])

// Track impression
ctaTracker.trackImpression('converter_page')

// Track click
ctaTracker.trackClick('converter_page')

// Get selected variant
const variant = ctaTracker.getVariant()
```

### 5. Performance Tracking

Automatic Web Vitals and performance tracking:

```typescript
// Automatically tracked:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

// Manual performance tracking
analytics.trackPerformance('pageLoadTime', {
  page_type: 'converter',
  load_time: 1234,
  first_contentful_paint: 456,
  time_to_interactive: 789,
})
```

## Event Reference

### Converter Events

```typescript
// Page view
trackConverter('pageView', 'png-to-svg', {
  search_volume: 40500,
  priority: 'high',
})

// File selection
trackConverter('fileSelected', 'png-to-svg', {
  file_size: 1024000,
  file_type: 'image/png',
})

// Conversion completion
trackConverter('conversionCompleted', 'png-to-svg', {
  conversion_time: 2500,
  input_size: 1024000,
  output_size: 512000,
  compression_ratio: 0.5,
})

// Error tracking
trackConverter('conversionError', 'png-to-svg', {
  error_type: 'invalid_format',
  error_message: 'File format not supported',
  file_size: 1024000,
})
```

### Gallery Events

```typescript
// Gallery view
trackGallery('pageView', 'heart-svg', {
  search_volume: 12100,
  item_count: 50,
})

// Item interaction
trackGallery('itemViewed', 'heart-svg', {
  item_id: 'heart_001',
  item_type: 'svg',
})

// Download
trackGallery('itemDownloaded', 'heart-svg', {
  item_id: 'heart_001',
  format: 'svg',
})
```

### Premium Feature Events

```typescript
// Video export
trackPremium('videoExportStarted', {
  format: 'mp4',
  duration: 5000,
  resolution: '1080p',
  credits_required: 5,
})

// Credit purchase
trackPremium('creditsPurchased', {
  package: 'credits_50',
  credits: 50,
  price: 19.99,
  source: 'video_export_prompt',
})

// Subscription
trackPremium('subscriptionStarted', {
  plan: 'pro',
  interval: 'monthly',
  price: 29.99,
  trial: false,
})
```

### Engagement Events

```typescript
// Session tracking
trackEngagement('sessionStarted', {
  entry_page: '/convert/png-to-svg',
  referrer: 'google.com',
  device_type: 'desktop',
  browser: 'chrome',
})

// CTA tracking
trackEngagement('ctaClicked', {
  cta_id: 'premium_upsell',
  cta_type: 'button',
  location: 'converter_error',
  variant: 'variant_a',
  time_to_click: 5000,
})

// Newsletter signup
trackEngagement('newsletterSignup', {
  source: 'footer',
  incentive: 'free_credits',
})
```

## Dashboard Access

### Analytics Dashboard Component

The analytics dashboard is available at `/dashboard/analytics` for admin users:

```typescript
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export default function AnalyticsPage() {
  return <AnalyticsDashboard />
}
```

Features:
- Real-time metrics overview
- Converter performance tracking
- Conversion funnel visualization
- User segment analysis
- Performance metrics
- Premium feature usage

### PostHog Dashboards

Access PostHog dashboards for:
- User paths analysis
- Session recordings
- Feature flag performance
- A/B test results
- Retention cohorts
- Revenue tracking

## Environment Variables

Required environment variables:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your_api_secret  # For server-side tracking

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Optional: Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx  # For alerts
```

## Debug Mode

Enable debug mode in development:

```typescript
const analytics = useEnhancedAnalytics({
  debug: true,  // Enables console logging
})

// Or globally
window.__analytics.trackEvent('test_event', { foo: 'bar' })
```

## Privacy Compliance

- All tracking respects user consent preferences
- PII is never sent to analytics platforms
- Session recordings mask sensitive data
- Server-side events are anonymized
- GDPR/CCPA compliant implementation

## Performance Considerations

1. **Batching**: Events are batched and sent every 5 seconds
2. **Critical Events**: Important events (conversions, errors) are sent immediately
3. **Lazy Loading**: Analytics libraries are loaded asynchronously
4. **Sampling**: High-volume events can be sampled in production
5. **Local Queue**: Failed events are queued and retried

## Monitoring & Alerts

Set up alerts for:
- Conversion rate drops > 20%
- Error rate increases > 5%
- Page load time > 3 seconds
- API latency > 1 second
- Revenue tracking discrepancies

## Best Practices

1. **Consistent Naming**: Use the predefined event names from tracking-config.ts
2. **Required Properties**: Always include required event properties
3. **User Context**: Initialize analytics with user context when available
4. **Error Handling**: Wrap tracking calls in try-catch for critical paths
5. **Testing**: Verify events in GA4 DebugView and PostHog Live Events
6. **Documentation**: Document any custom events or properties

## Troubleshooting

### Events Not Appearing

1. Check browser console for errors
2. Verify environment variables are set
3. Use GA4 DebugView for real-time validation
4. Check PostHog Live Events
5. Ensure ad blockers aren't interfering

### Performance Issues

1. Reduce event frequency for high-volume interactions
2. Implement sampling for non-critical events
3. Use server-side tracking for heavy computations
4. Monitor analytics payload sizes

### Data Discrepancies

1. Verify timezone settings in all platforms
2. Check event deduplication logic
3. Ensure consistent user identification
4. Validate conversion attribution windows