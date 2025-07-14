'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ToolMapping, 
  CtaConfig, 
  getToolDetails,
  generateCtaConfig,
  trackToolClick,
  getAbTestVariant 
} from '@/lib/keyword-tool-mapping'
import { cn } from '@/lib/utils'

interface DynamicToolCtaProps {
  mapping: ToolMapping
  searchVolume: number
  position?: 'top' | 'middle' | 'bottom' | 'sidebar'
  className?: string
  userId?: string
  sourceKeyword: string
}

export function DynamicToolCta({
  mapping,
  searchVolume,
  position = 'middle',
  className,
  userId,
  sourceKeyword
}: DynamicToolCtaProps) {
  const tool = getToolDetails(mapping.toolId)
  const ctaConfig = generateCtaConfig(mapping, searchVolume, position)
  const abVariant = getAbTestVariant(userId)
  
  if (!tool) return null
  
  const handleClick = () => {
    trackToolClick(
      tool.id,
      sourceKeyword,
      position,
      abVariant
    )
  }
  
  // A/B test different CTA styles
  if (abVariant === 'B' && ctaConfig.variant === 'prominent') {
    return <ProminentCtaVariantB tool={tool} mapping={mapping} onClick={handleClick} className={className} />
  }
  
  switch (ctaConfig.variant) {
    case 'prominent':
      return <ProminentCta tool={tool} mapping={mapping} onClick={handleClick} className={className} />
    case 'subtle':
      return <SubtleCta tool={tool} mapping={mapping} onClick={handleClick} className={className} />
    default:
      return <StandardCta tool={tool} mapping={mapping} onClick={handleClick} className={className} />
  }
}

// Prominent CTA for high-traffic keywords
function ProminentCta({ tool, mapping, onClick, className }: any) {
  return (
    <Card className={cn(
      "border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <Badge variant="default">Most Popular Tool</Badge>
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          {mapping.customCta || `Try ${tool.title} - Free & Instant`}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          {tool.metaDescription}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/convert/${tool.urlSlug}`} className="flex-1">
            <Button 
              size="lg" 
              className="w-full"
              onClick={onClick}
            >
              Start Converting Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span>4.9/5 (2,341 reviews)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">{tool.searchVolume.toLocaleString()}</span>
            <span className="text-muted-foreground">monthly users</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// Prominent CTA Variant B (A/B testing)
function ProminentCtaVariantB({ tool, mapping, onClick, className }: any) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border-2 border-primary p-6",
      "bg-gradient-to-br from-primary/20 via-primary/10 to-background",
      className
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              {mapping.customCta || tool.title}
            </h3>
            <p className="text-muted-foreground">
              No signup required • 100% free
            </p>
          </div>
          <Badge variant="default" className="ml-4">
            <Zap className="w-3 h-3 mr-1" />
            Instant
          </Badge>
        </div>
        
        <Link href={`/convert/${tool.urlSlug}`}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={onClick}
          >
            Try It Now - It's Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Standard CTA for medium-traffic keywords
function StandardCta({ tool, mapping, onClick, className }: any) {
  return (
    <Card className={cn("border", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">
              {mapping.customCta || `${tool.title} - Free Online Tool`}
            </h4>
            <p className="text-sm text-muted-foreground">
              Fast, secure, and easy to use
            </p>
          </div>
          
          <Link href={`/convert/${tool.urlSlug}`}>
            <Button 
              variant="default"
              onClick={onClick}
            >
              Try Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Subtle CTA for low-traffic keywords
function SubtleCta({ tool, mapping, onClick, className }: any) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 p-3 rounded-lg bg-muted/50",
      className
    )}>
      <span className="text-sm text-muted-foreground">
        Looking for a converter?
      </span>
      <Link 
        href={`/convert/${tool.urlSlug}`}
        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        onClick={onClick}
      >
        {mapping.customCta || `Try ${tool.title}`}
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}