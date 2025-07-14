"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Star, 
  Wand2,
  ArrowRight,
  Zap,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react'
import { getPopularConversions } from '@/lib/internal-linking'
import { cn } from '@/lib/utils'

interface PopularConversionsProps {
  variant?: 'default' | 'compact' | 'homepage'
  className?: string
  title?: string
  showCategories?: boolean
}

export function PopularConversions({ 
  variant = 'default',
  className,
  title = "Popular Conversions",
  showCategories = true
}: PopularConversionsProps) {
  const { trending, mostUsed, aiPowered } = getPopularConversions(12)

  if (variant === 'homepage') {
    return (
      <div className={cn("space-y-12", className)}>
        {/* Hero Popular Tools */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Convert Any File Format Instantly
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.slice(0, 8).map((converter) => (
              <Link
                key={converter.id}
                href={`/convert/${converter.urlSlug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg hover:border-primary transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-primary" />
                      {converter.searchVolume > 30000 && (
                        <Badge variant="secondary" className="text-xs">Hot</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {converter.fromFormat} to {converter.toFormat}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Free converter
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Trending Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trending.slice(0, 5).map((converter, idx) => (
                  <Link
                    key={converter.id}
                    href={`/convert/${converter.urlSlug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-muted-foreground mr-3">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium">
                        {converter.title}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Used */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Most Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mostUsed.slice(0, 5).map((converter, idx) => (
                  <Link
                    key={converter.id}
                    href={`/convert/${converter.urlSlug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-muted-foreground mr-3">
                        #{idx + 1}
                      </span>
                      <span className="text-sm font-medium">
                        {converter.title}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {converter.fromFormat} → {converter.toFormat}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI-Ready */}
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Wand2 className="w-5 h-5 mr-2 text-violet-600" />
                AI-Enhanced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiPowered.slice(0, 4).map((converter, idx) => (
                  <Link
                    key={converter.id}
                    href={`/convert/${converter.urlSlug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {converter.title}
                    </span>
                    <Sparkles className="w-4 h-4 text-violet-500" />
                  </Link>
                ))}
                <Link
                  href="/ai-icon-generator"
                  className="block mt-4"
                >
                  <Button 
                    variant="secondary" 
                    className="w-full bg-violet-100 hover:bg-violet-200 dark:bg-violet-800 dark:hover:bg-violet-700"
                  >
                    Try AI Generator
                    <Wand2 className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-semibold">Instant Conversion</h4>
              <p className="text-sm text-muted-foreground">No waiting, no uploads</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-semibold">100% Secure</h4>
              <p className="text-sm text-muted-foreground">Files never leave your device</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-semibold">No Sign-up</h4>
              <p className="text-sm text-muted-foreground">Free forever, no limits</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {title}
            </span>
            <Link 
              href="/convert" 
              className="text-sm font-normal text-primary hover:underline"
            >
              View all
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {trending.slice(0, 6).map((converter) => (
              <Link
                key={converter.id}
                href={`/convert/${converter.urlSlug}`}
                className="p-2 text-sm border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="font-medium">
                  {converter.fromFormat} → {converter.toFormat}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Free converter
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <div className={cn("space-y-8", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">
          Join thousands converting files every day
        </p>
      </div>

      {showCategories && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Trending */}
          <div>
            <h3 className="font-semibold flex items-center mb-4">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Trending Converters
            </h3>
            <div className="space-y-2">
              {trending.slice(0, 4).map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  className="block p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-sm">{converter.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {converter.fromFormat} → {converter.toFormat} • Free
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Used */}
          <div>
            <h3 className="font-semibold flex items-center mb-4">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Most Used Tools
            </h3>
            <div className="space-y-2">
              {mostUsed.slice(0, 4).map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  className="block p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-sm">{converter.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {converter.fromFormat} → {converter.toFormat} • Fast & Free
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI-Powered */}
          <div>
            <h3 className="font-semibold flex items-center mb-4">
              <Wand2 className="w-5 h-5 mr-2 text-violet-600" />
              AI-Ready Formats
            </h3>
            <div className="space-y-2">
              {aiPowered.slice(0, 4).map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  className="block p-3 border rounded-lg hover:border-violet-300 hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-sm">{converter.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Perfect for AI generation
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <Link href="/convert">
          <Button size="lg">
            Explore All Converters
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}