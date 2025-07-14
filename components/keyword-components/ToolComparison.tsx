'use client'

import * as React from 'react'
import { Check, X, Star, StarHalf, ArrowRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// TypeScript types for tool data structure
export interface ToolFeature {
  name: string
  description?: string
}

export interface ToolRating {
  overall: number
  ease: number
  features: number
  value: number
}

export interface ComparisonTool {
  id: string
  name: string
  description: string
  logo?: string
  rating: ToolRating
  pricing: {
    type: 'free' | 'freemium' | 'paid'
    startingPrice?: string
    currency?: string
  }
  features: string[]
  missingFeatures?: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  url: string
  highlighted?: boolean
  badge?: string
}

export interface ToolComparisonProps {
  tools: ComparisonTool[]
  title?: string
  description?: string
  category?: string
}

// Star rating component
const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  )
}

// Pricing badge component
const PricingBadge = ({ pricing }: { pricing: ComparisonTool['pricing'] }) => {
  const variants = {
    free: 'secondary',
    freemium: 'default',
    paid: 'outline',
  } as const

  const labels = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
  }

  return (
    <Badge variant={variants[pricing.type]} className="font-semibold">
      {labels[pricing.type]}
      {pricing.startingPrice && (
        <span className="ml-1">
          from {pricing.currency || '$'}{pricing.startingPrice}
        </span>
      )}
    </Badge>
  )
}

export default function ToolComparison({
  tools,
  title = 'Best SVG Converter Tools Compared',
  description = 'Compare the top SVG converter tools to find the perfect solution for your needs.',
  category = 'SVG Converters',
}: ToolComparisonProps) {
  const [sortBy, setSortBy] = React.useState<'rating' | 'price' | 'name'>('rating')
  const [filterBy, setFilterBy] = React.useState<'all' | 'free' | 'paid'>('all')

  // Sort and filter tools
  const processedTools = React.useMemo(() => {
    let filtered = [...tools]

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(tool => {
        if (filterBy === 'free') return tool.pricing.type === 'free' || tool.pricing.type === 'freemium'
        return tool.pricing.type === 'paid'
      })
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating.overall - a.rating.overall
        case 'price':
          const priceA = a.pricing.type === 'free' ? 0 : parseFloat(a.pricing.startingPrice || '999')
          const priceB = b.pricing.type === 'free' ? 0 : parseFloat(b.pricing.startingPrice || '999')
          return priceA - priceB
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [tools, sortBy, filterBy])

  // Get the highlighted tool (usually SVG AI)
  const highlightedTool = processedTools.find(tool => tool.highlighted)

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              <SelectItem value="free">Free Tools</SelectItem>
              <SelectItem value="paid">Paid Tools</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {processedTools.length} of {tools.length} tools
        </div>
      </div>

      {/* Quick Verdict - Highlighted Tool */}
      {highlightedTool && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Our Top Recommendation</CardTitle>
                {highlightedTool.badge && (
                  <Badge variant="default">{highlightedTool.badge}</Badge>
                )}
              </div>
              <StarRating rating={highlightedTool.rating.overall} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{highlightedTool.name}</h3>
              <p className="text-muted-foreground">{highlightedTool.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlightedTool.bestFor.map((use, index) => (
                <Badge key={index} variant="secondary">
                  Best for: {use}
                </Badge>
              ))}
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={highlightedTool.url} rel="noopener noreferrer">
                Try {highlightedTool.name} Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comparison Tabs */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Comparison Table</TabsTrigger>
          <TabsTrigger value="cards">Detailed Cards</TabsTrigger>
        </TabsList>

        {/* Table View */}
        <TabsContent value="table" className="mt-6">
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Tool</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Key Features</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedTools.map((tool) => (
                  <TableRow 
                    key={tool.id} 
                    className={cn(
                      tool.highlighted && "bg-primary/5 hover:bg-primary/10"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {tool.name}
                        {tool.badge && (
                          <Badge variant="default" className="text-xs">
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={tool.rating.overall} />
                    </TableCell>
                    <TableCell>
                      <PricingBadge pricing={tool.pricing} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs text-muted-foreground">
                            {feature}{index < 2 && index < tool.features.length - 1 ? ',' : ''}
                          </span>
                        ))}
                        {tool.features.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{tool.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant={tool.highlighted ? "default" : "outline"} 
                        size="sm"
                        asChild
                      >
                        <a href={tool.url} rel="noopener noreferrer">
                          Try Now
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Card View */}
        <TabsContent value="cards" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processedTools.map((tool) => (
              <Card 
                key={tool.id} 
                className={cn(
                  "relative overflow-hidden",
                  tool.highlighted && "border-primary/50 bg-primary/5"
                )}
              >
                {tool.badge && (
                  <Badge className="absolute top-4 right-4" variant="default">
                    {tool.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tool.name}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                  <div className="pt-2">
                    <StarRating rating={tool.rating.overall} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div>
                    <PricingBadge pricing={tool.pricing} />
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-600 mb-1">Pros</h4>
                      <ul className="space-y-1">
                        {tool.pros.slice(0, 3).map((pro, index) => (
                          <li key={index} className="text-xs flex items-start gap-1">
                            <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 mb-1">Cons</h4>
                      <ul className="space-y-1">
                        {tool.cons.slice(0, 3).map((con, index) => (
                          <li key={index} className="text-xs flex items-start gap-1">
                            <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Best For */}
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Best For</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.bestFor.map((use, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full" 
                    variant={tool.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <a href={tool.url} rel="noopener noreferrer">
                      Try {tool.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature Comparison Matrix */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Feature Comparison</h3>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                {processedTools.slice(0, 4).map((tool) => (
                  <TableHead key={tool.id} className="text-center">
                    {tool.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Collect all unique features */}
              {Array.from(
                new Set(processedTools.flatMap(tool => [...tool.features, ...(tool.missingFeatures || [])]))
              ).slice(0, 10).map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  {processedTools.slice(0, 4).map((tool) => (
                    <TableCell key={tool.id} className="text-center">
                      {tool.features.includes(feature) ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: title,
            description: description,
            category: category,
            review: processedTools.map(tool => ({
              '@type': 'Review',
              itemReviewed: {
                '@type': 'SoftwareApplication',
                name: tool.name,
                applicationCategory: category,
                offers: {
                  '@type': 'Offer',
                  price: tool.pricing.startingPrice || '0',
                  priceCurrency: tool.pricing.currency || 'USD',
                }
              },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: tool.rating.overall,
                bestRating: 5,
                worstRating: 1,
              },
            }))
          })
        }}
      />
    </div>
  )
}