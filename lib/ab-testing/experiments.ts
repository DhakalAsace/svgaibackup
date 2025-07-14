/**
 * Predefined A/B Test Experiments
 */

import { ABTestConfig, abTestManager } from './index'

// Converter page layout test
export const converterLayoutTest: ABTestConfig = {
  id: 'converter_layout_2024',
  name: 'Converter Page Layout Test',
  description: 'Test sidebar vs inline tools layout for converter pages',
  status: 'active',
  variants: [
    {
      id: 'sidebar',
      name: 'Sidebar Layout',
      weight: 50,
      isControl: true,
      properties: {
        layout: 'sidebar',
        toolsPosition: 'left',
      },
    },
    {
      id: 'inline',
      name: 'Inline Layout',
      weight: 50,
      properties: {
        layout: 'inline',
        toolsPosition: 'top',
      },
    },
  ],
  successMetrics: [
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      type: 'conversion',
      eventName: 'converter_conversion_completed',
      higherIsBetter: true,
    },
    {
      id: 'engagement_time',
      name: 'Time on Page',
      type: 'engagement',
      eventName: 'page_engagement_time',
      higherIsBetter: true,
    },
  ],
  minimumSampleSize: 1000,
  confidenceLevel: 95,
  winnerSelectionMode: 'automatic',
}

// CTA button variations
export const ctaButtonTest: ABTestConfig = {
  id: 'cta_button_variations',
  name: 'CTA Button Text and Placement',
  description: 'Test different CTA button texts and placements',
  status: 'active',
  variants: [
    {
      id: 'control',
      name: 'Convert Now - Bottom',
      weight: 25,
      isControl: true,
      properties: {
        text: 'Convert Now',
        placement: 'bottom',
        color: 'primary',
      },
    },
    {
      id: 'start_free',
      name: 'Start Free - Bottom',
      weight: 25,
      properties: {
        text: 'Start Free Conversion',
        placement: 'bottom',
        color: 'primary',
      },
    },
    {
      id: 'instant_convert',
      name: 'Instant Convert - Floating',
      weight: 25,
      properties: {
        text: 'Instant Convert',
        placement: 'floating',
        color: 'accent',
      },
    },
    {
      id: 'try_now',
      name: 'Try Now - Sticky',
      weight: 25,
      properties: {
        text: 'Try It Now - Free',
        placement: 'sticky-top',
        color: 'gradient',
      },
    },
  ],
  successMetrics: [
    {
      id: 'click_rate',
      name: 'CTA Click Rate',
      type: 'conversion',
      eventName: 'cta_clicked',
      higherIsBetter: true,
    },
    {
      id: 'conversion_start',
      name: 'Conversion Started',
      type: 'conversion',
      eventName: 'converter_conversion_started',
      higherIsBetter: true,
    },
  ],
  minimumSampleSize: 2000,
  confidenceLevel: 95,
  winnerSelectionMode: 'automatic',
}

// Gallery grid layout test
export const galleryGridTest: ABTestConfig = {
  id: 'gallery_grid_columns',
  name: 'Gallery Grid Layout',
  description: 'Test 3 vs 4 column gallery layouts',
  status: 'active',
  variants: [
    {
      id: 'three_columns',
      name: '3 Columns',
      weight: 50,
      isControl: true,
      properties: {
        columns: 3,
        gap: 'large',
        imageSize: 'large',
      },
    },
    {
      id: 'four_columns',
      name: '4 Columns',
      weight: 50,
      properties: {
        columns: 4,
        gap: 'medium',
        imageSize: 'medium',
      },
    },
  ],
  targetingRules: [
    {
      type: 'device',
      property: 'type',
      operator: 'not_in',
      value: ['mobile'], // Only test on desktop/tablet
    },
  ],
  successMetrics: [
    {
      id: 'engagement_rate',
      name: 'Gallery Engagement',
      type: 'engagement',
      eventName: 'gallery_item_clicked',
      higherIsBetter: true,
    },
    {
      id: 'download_rate',
      name: 'Download Rate',
      type: 'conversion',
      eventName: 'gallery_download_completed',
      higherIsBetter: true,
    },
  ],
  minimumSampleSize: 1500,
  confidenceLevel: 95,
}

// Pricing display format test
export const pricingDisplayTest: ABTestConfig = {
  id: 'pricing_display_format',
  name: 'Pricing Display Format',
  description: 'Test different ways of displaying pricing',
  status: 'active',
  variants: [
    {
      id: 'table',
      name: 'Traditional Table',
      weight: 25,
      isControl: true,
      properties: {
        format: 'table',
        highlight: 'popular',
      },
    },
    {
      id: 'cards',
      name: 'Card Layout',
      weight: 25,
      properties: {
        format: 'cards',
        highlight: 'savings',
      },
    },
    {
      id: 'slider',
      name: 'Interactive Slider',
      weight: 25,
      properties: {
        format: 'slider',
        showSavings: true,
      },
    },
    {
      id: 'comparison',
      name: 'Feature Comparison',
      weight: 25,
      properties: {
        format: 'comparison',
        expandable: true,
      },
    },
  ],
  targetingRules: [
    {
      type: 'user_property',
      property: 'user_type',
      operator: 'equals',
      value: 'free', // Only test on free users
    },
  ],
  successMetrics: [
    {
      id: 'pricing_engagement',
      name: 'Pricing Page Engagement',
      type: 'engagement',
      eventName: 'pricing_plan_clicked',
      higherIsBetter: true,
    },
    {
      id: 'subscription_rate',
      name: 'Subscription Conversion',
      type: 'conversion',
      eventName: 'premium_subscription_started',
      higherIsBetter: true,
    },
    {
      id: 'revenue',
      name: 'Revenue Per User',
      type: 'revenue',
      eventName: 'revenue',
      higherIsBetter: true,
    },
  ],
  minimumSampleSize: 2500,
  confidenceLevel: 95,
  winnerSelectionMode: 'manual', // Manual because of revenue implications
}

// Landing page hero variations
export const heroVariationsTest: ABTestConfig = {
  id: 'landing_hero_variations',
  name: 'Landing Page Hero Test',
  description: 'Test different hero section designs and copy',
  status: 'active',
  variants: [
    {
      id: 'benefit_focused',
      name: 'Benefit Focused',
      weight: 25,
      isControl: true,
      properties: {
        headline: 'Convert Any Image to SVG in Seconds',
        subheadline: 'Professional-grade conversions with AI-powered accuracy',
        ctaText: 'Start Converting Free',
        showDemo: false,
      },
    },
    {
      id: 'feature_focused',
      name: 'Feature Focused',
      weight: 25,
      properties: {
        headline: '40+ Converters, Unlimited Free Conversions',
        subheadline: 'PNG to SVG, JPG to SVG, and more - all in your browser',
        ctaText: 'Try Any Converter',
        showDemo: true,
      },
    },
    {
      id: 'social_proof',
      name: 'Social Proof',
      weight: 25,
      properties: {
        headline: 'Join 100,000+ Designers Converting with AI',
        subheadline: 'Trusted by professionals for perfect vector conversions',
        ctaText: 'Join Free Today',
        showTestimonials: true,
      },
    },
    {
      id: 'urgency',
      name: 'Urgency/Scarcity',
      weight: 25,
      properties: {
        headline: 'Free AI Conversions - Limited Time',
        subheadline: 'Get premium features at no cost during our launch',
        ctaText: 'Claim Free Access',
        showCountdown: true,
      },
    },
  ],
  successMetrics: [
    {
      id: 'hero_engagement',
      name: 'Hero CTA Click Rate',
      type: 'engagement',
      eventName: 'hero_cta_clicked',
      higherIsBetter: true,
    },
    {
      id: 'scroll_depth',
      name: 'Scroll Past Hero',
      type: 'engagement',
      eventName: 'scroll_past_hero',
      higherIsBetter: true,
    },
    {
      id: 'tool_usage',
      name: 'Converter Tool Usage',
      type: 'conversion',
      eventName: 'converter_page_view',
      higherIsBetter: true,
    },
  ],
  minimumSampleSize: 3000,
  confidenceLevel: 95,
  trafficAllocation: 50, // Only 50% of traffic in test
}

// Mobile-specific converter UI test
export const mobileConverterUITest: ABTestConfig = {
  id: 'mobile_converter_ui',
  name: 'Mobile Converter UI',
  description: 'Test mobile-optimized converter interfaces',
  status: 'active',
  variants: [
    {
      id: 'standard',
      name: 'Standard Mobile',
      weight: 50,
      isControl: true,
      properties: {
        layout: 'stacked',
        uploadMethod: 'button',
      },
    },
    {
      id: 'optimized',
      name: 'Optimized Mobile',
      weight: 50,
      properties: {
        layout: 'tabs',
        uploadMethod: 'drag-area',
        showPreview: true,
      },
    },
  ],
  targetingRules: [
    {
      type: 'device',
      property: 'type',
      operator: 'equals',
      value: 'mobile',
    },
  ],
  successMetrics: [
    {
      id: 'mobile_conversion_rate',
      name: 'Mobile Conversion Rate',
      type: 'conversion',
      eventName: 'converter_conversion_completed',
      higherIsBetter: true,
    },
    {
      id: 'mobile_bounce_rate',
      name: 'Bounce Rate',
      type: 'engagement',
      eventName: 'bounce',
      higherIsBetter: false,
    },
  ],
  minimumSampleSize: 2000,
  confidenceLevel: 95,
}

// All experiments array
export const allExperiments: ABTestConfig[] = [
  converterLayoutTest,
  ctaButtonTest,
  galleryGridTest,
  pricingDisplayTest,
  heroVariationsTest,
  mobileConverterUITest,
]

// Initialize experiments
export function initializeExperiments() {
  allExperiments.forEach(experiment => {
    abTestManager.createTest(experiment)
  })
}

// Feature flags configuration
export const featureFlags = {
  newConverterUI: {
    name: 'New Converter UI',
    description: 'Enable redesigned converter interface',
    rolloutPercentage: 0, // Start at 0%, gradually increase
  },
  animationTool: {
    name: 'SVG Animation Tool',
    description: 'Enable free SVG animation tool',
    rolloutPercentage: 100, // Fully rolled out
  },
  advancedGallery: {
    name: 'Advanced Gallery Features',
    description: 'Enable search and filters in galleries',
    rolloutPercentage: 50,
  },
  aiSuggestions: {
    name: 'AI Conversion Suggestions',
    description: 'Show AI-powered optimization suggestions',
    rolloutPercentage: 25,
  },
  premiumUpsell: {
    name: 'Premium Upsell Prompts',
    description: 'Show premium feature upsell prompts',
    rolloutPercentage: 100,
  },
}

// Gradual rollout configurations
export const rollouts = {
  videoExport: {
    name: 'SVG to Video Export',
    description: 'Gradually roll out video export feature',
    schedule: [
      { date: new Date('2024-01-01'), percentage: 10 },
      { date: new Date('2024-01-07'), percentage: 25 },
      { date: new Date('2024-01-14'), percentage: 50 },
      { date: new Date('2024-01-21'), percentage: 100 },
    ],
  },
  performanceOptimizations: {
    name: 'Performance Optimizations',
    description: 'Roll out performance improvements',
    schedule: [
      { date: new Date('2024-01-01'), percentage: 5 },
      { date: new Date('2024-01-03'), percentage: 20 },
      { date: new Date('2024-01-05'), percentage: 50 },
      { date: new Date('2024-01-07'), percentage: 100 },
    ],
  },
}

// Get current rollout percentage based on schedule
export function getCurrentRolloutPercentage(
  rolloutName: keyof typeof rollouts
): number {
  const rollout = rollouts[rolloutName]
  const now = new Date()
  
  const applicable = rollout.schedule
    .filter(s => s.date <= now)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  return applicable[0]?.percentage || 0
}