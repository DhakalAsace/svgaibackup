/**
 * Example: Converter Page with A/B Testing
 */

'use client'

import React from 'react'
import { ABTest, Variant, ConversionTracker, useABTest } from '@/lib/ab-testing/components'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Example 1: Simple Layout A/B Test
export function ConverterPageExample() {
  return (
    <ABTest testId="converter_layout_2024">
      {(variant) => (
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">PNG to SVG Converter</h1>
          
          <Variant testId="converter_layout_2024" variantId="sidebar">
            <SidebarLayout />
          </Variant>
          
          <Variant testId="converter_layout_2024" variantId="inline">
            <InlineLayout />
          </Variant>
        </div>
      )}
    </ABTest>
  )
}

// Sidebar Layout Variant
function SidebarLayout() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-3">
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Conversion Options</h2>
          <OptionsPanel />
        </Card>
      </aside>
      <main className="col-span-9">
        <ConverterArea />
      </main>
    </div>
  )
}

// Inline Layout Variant
function InlineLayout() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Conversion Options</h2>
        <OptionsPanel inline />
      </Card>
      <ConverterArea />
    </div>
  )
}

// Example 2: CTA Button Variations with Conversion Tracking
export function CTAButtonExample() {
  const { variant } = useABTest('cta_button_variations')
  
  const buttonProps = {
    control: { text: 'Convert Now', className: 'btn-primary' },
    start_free: { text: 'Start Free Conversion', className: 'btn-primary' },
    instant_convert: { text: 'Instant Convert', className: 'btn-accent' },
    try_now: { text: 'Try It Now - Free', className: 'btn-gradient' },
  }
  
  const props = buttonProps[variant?.id as keyof typeof buttonProps] || buttonProps.control
  
  return (
    <ConversionTracker 
      testId="cta_button_variations" 
      metricId="click_rate"
      trigger="click"
    >
      <Button className={props.className}>
        {props.text}
      </Button>
    </ConversionTracker>
  )
}

// Example 3: Gallery Grid Test
export function GalleryGridExample() {
  return (
    <ABTest testId="gallery_grid_columns">
      {(variant) => {
        const columns = variant?.properties?.columns || 3
        const gap = variant?.properties?.gap || 'large'
        
        return (
          <div 
            className={`grid grid-cols-${columns} gap-${gap}`}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: gap === 'large' ? '1.5rem' : '1rem',
            }}
          >
            {/* Gallery items */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <GalleryItem key={i} size={variant?.properties?.imageSize} />
            ))}
          </div>
        )
      }}
    </ABTest>
  )
}

// Example 4: Pricing Display Test
export function PricingDisplayExample() {
  return (
    <ABTest testId="pricing_display_format">
      {(variant) => {
        switch (variant?.id) {
          case 'table':
            return <PricingTable highlight={variant.properties?.highlight} />
          case 'cards':
            return <PricingCards highlight={variant.properties?.highlight} />
          case 'slider':
            return <PricingSlider showSavings={variant.properties?.showSavings} />
          case 'comparison':
            return <PricingComparison expandable={variant.properties?.expandable} />
          default:
            return <PricingTable />
        }
      }}
    </ABTest>
  )
}

// Example 5: Hero Variations with Multiple Metrics
export function HeroSectionExample() {
  const { variant, trackConversion } = useABTest('landing_hero_variations')
  
  React.useEffect(() => {
    // Track scroll past hero
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        trackConversion('scroll_depth')
        window.removeEventListener('scroll', handleScroll)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackConversion])
  
  return (
    <section className="hero min-h-screen">
      <h1 className="text-5xl font-bold mb-4">
        {variant?.properties?.headline}
      </h1>
      <p className="text-xl mb-8">
        {variant?.properties?.subheadline}
      </p>
      
      <ConversionTracker 
        testId="landing_hero_variations" 
        metricId="hero_engagement"
        trigger="click"
      >
        <Button size="lg">
          {variant?.properties?.ctaText}
        </Button>
      </ConversionTracker>
      
      {variant?.properties?.showDemo && <DemoVideo />}
      {variant?.properties?.showTestimonials && <Testimonials />}
      {variant?.properties?.showCountdown && <CountdownTimer />}
    </section>
  )
}

// Example 6: Feature Flag Usage
import { useFeatureFlag, FeatureFlag } from '@/lib/ab-testing/components'

export function FeatureFlagExample() {
  const showAnimationTool = useFeatureFlag('animationTool')
  
  return (
    <div className="tools-section">
      <h2>Available Tools</h2>
      
      {/* Method 1: Using hook */}
      {showAnimationTool && (
        <Card>
          <h3>SVG Animation Tool</h3>
          <p>Create stunning animations for your SVGs</p>
        </Card>
      )}
      
      {/* Method 2: Using component */}
      <FeatureFlag flag="advancedGallery">
        <Card>
          <h3>Advanced Gallery</h3>
          <p>Search and filter through thousands of SVGs</p>
        </Card>
      </FeatureFlag>
    </div>
  )
}

// Example 7: Gradual Rollout
import { Rollout, useRollout } from '@/lib/ab-testing/components'

export function RolloutExample() {
  const inVideoExportRollout = useRollout('videoExport', 25)
  
  return (
    <div className="export-options">
      {/* Method 1: Using hook */}
      {inVideoExportRollout && (
        <Button>Export as Video</Button>
      )}
      
      {/* Method 2: Using component */}
      <Rollout name="performanceOptimizations" percentage={50}>
        <OptimizedConverter />
      </Rollout>
    </div>
  )
}

// Placeholder components
function OptionsPanel({ inline = false }: { inline?: boolean }) {
  return <div>Options Panel</div>
}

function ConverterArea() {
  return <Card className="p-8 min-h-[400px]">Converter Area</Card>
}

function GalleryItem({ size }: { size?: string }) {
  return <Card className="aspect-square">Gallery Item</Card>
}

function PricingTable({ highlight }: { highlight?: string }) {
  return <div>Pricing Table</div>
}

function PricingCards({ highlight }: { highlight?: string }) {
  return <div>Pricing Cards</div>
}

function PricingSlider({ showSavings }: { showSavings?: boolean }) {
  return <div>Pricing Slider</div>
}

function PricingComparison({ expandable }: { expandable?: boolean }) {
  return <div>Pricing Comparison</div>
}

function DemoVideo() {
  return <div>Demo Video</div>
}

function Testimonials() {
  return <div>Testimonials</div>
}

function CountdownTimer() {
  return <div>Countdown Timer</div>
}

function OptimizedConverter() {
  return <div>Optimized Converter</div>
}