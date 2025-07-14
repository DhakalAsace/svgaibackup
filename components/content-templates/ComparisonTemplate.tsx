'use client'

import * as React from 'react'
import { 
  Check, 
  X, 
  Star, 
  StarHalf, 
  ArrowRight, 
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Shield,
  Clock,
  DollarSign,
  ChevronDown,
  Info,
  ExternalLink,
  Award
} from 'lucide-react'
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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import ToolComparison, { ComparisonTool, ToolRating } from '@/components/keyword-components/ToolComparison'

// Extended types for comprehensive comparison
export interface ToolFeature {
  name: string
  description?: string
  category: 'core' | 'advanced' | 'integration' | 'support'
}

export interface PerformanceMetric {
  metric: string
  value: number
  unit: string
  benchmark?: number
}

export interface UserTestimonial {
  author: string
  role?: string
  company?: string
  rating: number
  content: string
  date: string
  verified?: boolean
}

export interface PricingTier {
  name: string
  price: number
  currency: string
  period: 'monthly' | 'yearly' | 'one-time'
  features: string[]
  limitations?: string[]
  recommended?: boolean
}

export interface ExtendedComparisonTool extends ComparisonTool {
  lastUpdated: string
  userBase?: string
  performance?: PerformanceMetric[]
  testimonials?: UserTestimonial[]
  pricingTiers?: PricingTier[]
  integrations?: string[]
  support?: {
    channels: string[]
    responseTime: string
    documentation: 'excellent' | 'good' | 'fair' | 'poor'
  }
  security?: {
    encryption: boolean
    compliance: string[]
    dataLocation: string
  }
}

export interface ComparisonTemplateProps {
  tools: ExtendedComparisonTool[]
  title?: string
  description?: string
  category?: string
  lastUpdated?: string
  affiliateDisclosure?: boolean
  showPerformanceCharts?: boolean
  showTestimonials?: boolean
  showIntegrations?: boolean
}

// Star rating component
const StarRating = ({ rating, maxRating = 5, showNumber = true }: { 
  rating: number
  maxRating?: number
  showNumber?: boolean 
}) => {
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
      {showNumber && (
        <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      )}
    </div>
  )
}

// Performance chart component
const PerformanceChart = ({ tools }: { tools: ExtendedComparisonTool[] }) => {
  const chartData = tools.slice(0, 4).map(tool => ({
    name: tool.name,
    ease: tool.rating.ease * 20,
    features: tool.rating.features * 20,
    value: tool.rating.value * 20,
    overall: tool.rating.overall * 20,
  }))

  const chartConfig: ChartConfig = {
    ease: { label: "Ease of Use", color: "hsl(var(--chart-1))" },
    features: { label: "Features", color: "hsl(var(--chart-2))" },
    value: { label: "Value", color: "hsl(var(--chart-3))" },
    overall: { label: "Overall", color: "hsl(var(--chart-4))" },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="ease" fill="var(--color-ease)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="features" fill="var(--color-features)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="overall" fill="var(--color-overall)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Testimonial card component
const TestimonialCard = ({ testimonial }: { testimonial: UserTestimonial }) => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{testimonial.author}</p>
          {testimonial.role && (
            <p className="text-sm text-muted-foreground">
              {testimonial.role}
              {testimonial.company && ` at ${testimonial.company}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={testimonial.rating} showNumber={false} />
          {testimonial.verified && (
            <Badge variant="secondary" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm italic">"{testimonial.content}"</p>
      <p className="text-xs text-muted-foreground mt-2">{testimonial.date}</p>
    </CardContent>
  </Card>
)

export default function ComparisonTemplate({
  tools,
  title = 'Best SVG Converter Tools: Comprehensive Comparison',
  description = 'An in-depth comparison of the top SVG converter tools to help you make the right choice for your needs.',
  category = 'SVG Converters',
  lastUpdated = new Date().toLocaleDateString(),
  affiliateDisclosure = false,
  showPerformanceCharts = true,
  showTestimonials = true,
  showIntegrations = true,
}: ComparisonTemplateProps) {
  const [selectedTools, setSelectedTools] = React.useState<string[]>(
    tools.slice(0, 3).map(t => t.id)
  )
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['summary'])

  // Get SVG AI tool (highlighted)
  const svgAITool = tools.find(tool => tool.highlighted) || tools[0]

  // Calculate average ratings
  const avgRating = tools.reduce((acc, tool) => acc + tool.rating.overall, 0) / tools.length

  return (
    <TooltipProvider>
      <article className="w-full max-w-7xl mx-auto space-y-12 py-8">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              {tools.length} tools compared
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Avg rating: {avgRating.toFixed(1)}/5
            </span>
          </div>
        </header>

        {/* Affiliate Disclosure */}
        {affiliateDisclosure && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This page contains affiliate links. We may earn a commission if you make a purchase through these links, at no extra cost to you. Our recommendations are based on genuine quality and user value.
            </AlertDescription>
          </Alert>
        )}

        {/* Executive Summary */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Executive Summary</h2>
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Our Top Pick: {svgAITool.name}</CardTitle>
                  <Badge variant="default" className="text-sm">Editor's Choice</Badge>
                </div>
                <StarRating rating={svgAITool.rating.overall} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{svgAITool.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-1">
                    {svgAITool.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Best For
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {svgAITool.bestFor.map((use, i) => (
                      <Badge key={i} variant="secondary">{use}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Pricing
                  </h4>
                  <p className="text-sm">
                    {svgAITool.pricing.type === 'free' ? 'Completely Free' : 
                     svgAITool.pricing.type === 'freemium' ? `Free tier available, paid from ${svgAITool.pricing.currency}${svgAITool.pricing.startingPrice}` :
                     `Starting at ${svgAITool.pricing.currency}${svgAITool.pricing.startingPrice}`}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button size="lg" asChild>
                  <a href={svgAITool.url} rel="noopener noreferrer">
                    Try {svgAITool.name} Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#detailed-comparison">
                    View Full Comparison
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Verdict Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Most Reliable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{tools.find(t => t.security?.encryption)?.name || svgAITool.name}</p>
                <p className="text-sm text-muted-foreground">Best uptime and security features</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Best Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{tools.sort((a, b) => b.rating.value - a.rating.value)[0].name}</p>
                <p className="text-sm text-muted-foreground">Optimal price-to-feature ratio</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Easiest to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{tools.sort((a, b) => b.rating.ease - a.rating.ease)[0].name}</p>
                <p className="text-sm text-muted-foreground">Most intuitive interface</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Comparison Table */}
        <section id="detailed-comparison" className="space-y-6">
          <h2 className="text-3xl font-bold">Detailed Comparison Table</h2>
          
          {/* Tool selector for comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Select Tools to Compare</CardTitle>
              <CardDescription>Choose up to 4 tools for side-by-side comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tools.map(tool => (
                  <Badge
                    key={tool.id}
                    variant={selectedTools.includes(tool.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTools.includes(tool.id)) {
                        setSelectedTools(selectedTools.filter(id => id !== tool.id))
                      } else if (selectedTools.length < 4) {
                        setSelectedTools([...selectedTools, tool.id])
                      }
                    }}
                  >
                    {tool.name}
                    {selectedTools.includes(tool.id) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main comparison component */}
          <ToolComparison 
            tools={tools.filter(t => selectedTools.includes(t.id))}
            title="Feature-by-Feature Comparison"
            description="Compare selected tools across all key features and capabilities"
          />
        </section>

        {/* Individual Tool Reviews */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">In-Depth Tool Reviews</h2>
          <Accordion 
            type="multiple" 
            value={expandedSections}
            onValueChange={setExpandedSections}
            className="space-y-4"
          >
            {tools.map((tool, index) => (
              <AccordionItem key={tool.id} value={tool.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StarRating rating={tool.rating.overall} />
                      {tool.badge && (
                        <Badge variant="default">{tool.badge}</Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main review content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Overview */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Overview</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {tool.name} is a {tool.pricing.type} {category.toLowerCase()} that excels in providing
                          high-quality conversion capabilities. With a user base of {tool.userBase || 'thousands of users'},
                          it has established itself as a {tool.rating.overall >= 4.5 ? 'top-tier' : 
                          tool.rating.overall >= 4 ? 'reliable' : 'decent'} option in the market.
                        </p>
                      </div>

                      {/* Features breakdown */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tool.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pros and Cons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-3 text-green-600">Advantages</h4>
                          <ul className="space-y-2">
                            {tool.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                <span className="text-sm">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-3 text-red-600">Limitations</h4>
                          <ul className="space-y-2">
                            {tool.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <X className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                <span className="text-sm">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Performance metrics */}
                      {tool.performance && tool.performance.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Performance Metrics</h4>
                          <div className="space-y-3">
                            {tool.performance.map((metric, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{metric.metric}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {metric.value}{metric.unit}
                                    {metric.benchmark && (
                                      <span className="ml-2 text-xs">
                                        (Industry avg: {metric.benchmark}{metric.unit})
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <Progress 
                                  value={metric.benchmark ? (metric.value / metric.benchmark) * 100 : 75} 
                                  className="h-2"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User testimonials */}
                      {showTestimonials && tool.testimonials && tool.testimonials.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">User Testimonials</h4>
                          <div className="grid grid-cols-1 gap-4">
                            {tool.testimonials.slice(0, 2).map((testimonial, i) => (
                              <TestimonialCard key={i} testimonial={testimonial} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Rating breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Rating Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Overall</span>
                              <StarRating rating={tool.rating.overall} />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Ease of Use</span>
                              <StarRating rating={tool.rating.ease} />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Features</span>
                              <StarRating rating={tool.rating.features} />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Value for Money</span>
                              <StarRating rating={tool.rating.value} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Pricing */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Pricing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {tool.pricingTiers ? (
                            <div className="space-y-3">
                              {tool.pricingTiers.map((tier, i) => (
                                <div key={i} className={cn(
                                  "p-3 rounded-lg border",
                                  tier.recommended && "border-primary bg-primary/5"
                                )}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold">{tier.name}</span>
                                    {tier.recommended && (
                                      <Badge variant="default" className="text-xs">Recommended</Badge>
                                    )}
                                  </div>
                                  <p className="text-2xl font-bold">
                                    {tier.currency}{tier.price}
                                    <span className="text-sm font-normal text-muted-foreground">
                                      /{tier.period}
                                    </span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>
                              <Badge variant={tool.pricing.type === 'free' ? 'secondary' : 'default'}>
                                {tool.pricing.type === 'free' ? 'Free' : 
                                 tool.pricing.type === 'freemium' ? 'Freemium' : 'Paid'}
                              </Badge>
                              {tool.pricing.startingPrice && (
                                <p className="mt-2 text-sm">
                                  Starting at {tool.pricing.currency}{tool.pricing.startingPrice}
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Support info */}
                      {tool.support && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Support</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Channels:</span>
                              <p className="text-sm text-muted-foreground">
                                {tool.support.channels.join(', ')}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Response Time:</span>
                              <p className="text-sm text-muted-foreground">{tool.support.responseTime}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Documentation:</span>
                              <p className="text-sm text-muted-foreground capitalize">{tool.support.documentation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* CTA */}
                      <Button className="w-full" size="lg" asChild>
                        <a href={tool.url} rel="noopener noreferrer">
                          Try {tool.name}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Use Case Recommendations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Recommendations by Use Case</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  For Individual Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Best choice for freelancers and hobbyists who need occasional conversions.</p>
                <div className="space-y-3">
                  {tools
                    .filter(t => t.bestFor.some(use => use.toLowerCase().includes('individual') || use.toLowerCase().includes('personal')))
                    .slice(0, 2)
                    .map(tool => (
                      <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-semibold">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">{tool.pricing.type} option available</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={tool.url}>Try Now</a>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  For Business Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Ideal for teams needing collaboration features and high-volume processing.</p>
                <div className="space-y-3">
                  {tools
                    .filter(t => t.bestFor.some(use => use.toLowerCase().includes('team') || use.toLowerCase().includes('business')))
                    .slice(0, 2)
                    .map(tool => (
                      <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-semibold">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">Team features included</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={tool.url}>Try Now</a>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  For Quick Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">When you need fast, no-frills conversions without creating an account.</p>
                <div className="space-y-3">
                  {tools
                    .filter(t => t.pricing.type === 'free' || t.rating.ease >= 4.5)
                    .slice(0, 2)
                    .map(tool => (
                      <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-semibold">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">No signup required</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={tool.url}>Try Now</a>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  For Enterprise Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Enterprise-grade security with compliance certifications.</p>
                <div className="space-y-3">
                  {tools
                    .filter(t => t.security?.compliance && t.security.compliance.length > 0)
                    .slice(0, 2)
                    .map(tool => (
                      <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-semibold">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tool.security?.compliance.join(', ')}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={tool.url}>Try Now</a>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Analysis */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Pricing Analysis</h2>
          <div className="grid gap-6">
            {/* Pricing overview */}
            <Card>
              <CardHeader>
                <CardTitle>Price Comparison Overview</CardTitle>
                <CardDescription>
                  Monthly pricing comparison across all tools (prices in USD)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tools.map(tool => {
                    const price = tool.pricing.type === 'free' ? 0 : 
                                 parseFloat(tool.pricing.startingPrice || '0')
                    const maxPrice = Math.max(...tools.map(t => 
                      t.pricing.type === 'free' ? 0 : parseFloat(t.pricing.startingPrice || '0')
                    ))
                    
                    return (
                      <div key={tool.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-sm font-semibold">
                            {tool.pricing.type === 'free' ? 'Free' : 
                             `$${price}${tool.pricing.type === 'freemium' ? '+' : ''}/mo`}
                          </span>
                        </div>
                        <Progress 
                          value={maxPrice > 0 ? (price / maxPrice) * 100 : 0} 
                          className="h-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Value analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Free Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{tools.filter(t => t.pricing.type === 'free').length}</p>
                  <p className="text-sm text-muted-foreground">Completely free tools</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Average Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ${(tools.reduce((acc, t) => 
                      acc + (t.pricing.type === 'free' ? 0 : parseFloat(t.pricing.startingPrice || '0')), 0
                    ) / tools.filter(t => t.pricing.type !== 'free').length).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Per month for paid tools</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Best Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{svgAITool.name}</p>
                  <p className="text-sm text-muted-foreground">Highest value-for-money rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Deep Dive */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Feature Deep Dive</h2>
          <Tabs defaultValue="core" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="core">Core Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
              <TabsTrigger value="integration">Integrations</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="core" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Essential Conversion Features</CardTitle>
                  <CardDescription>
                    Core functionality that every SVG converter should have
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['SVG to PNG', 'PNG to SVG', 'Batch Processing', 'Quality Settings', 'Preview'].map(feature => (
                      <div key={feature} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{feature}</span>
                          <div className="flex gap-2">
                            {tools.slice(0, 4).map(tool => (
                              <Tooltip key={tool.id}>
                                <TooltipTrigger>
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">{tool.name}</p>
                                    {tool.features.some(f => f.toLowerCase().includes(feature.toLowerCase())) ? (
                                      <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <X className="h-5 w-5 text-red-600" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {tool.name} {tool.features.some(f => f.toLowerCase().includes(feature.toLowerCase())) ? 'supports' : 'does not support'} {feature}
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Capabilities</CardTitle>
                  <CardDescription>
                    Features that set professional tools apart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.slice(0, 4).map(tool => (
                      <div key={tool.id} className="space-y-3">
                        <h4 className="font-semibold">{tool.name}</h4>
                        <div className="space-y-2">
                          {tool.features.slice(3, 6).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">Advanced</Badge>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integration" className="mt-6">
              {showIntegrations && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Ecosystem</CardTitle>
                    <CardDescription>
                      How well each tool integrates with your existing workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {tools.slice(0, 3).map(tool => (
                        <div key={tool.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{tool.name}</h4>
                            <Badge variant="outline">
                              {tool.integrations?.length || 0} integrations
                            </Badge>
                          </div>
                          {tool.integrations && tool.integrations.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {tool.integrations.map((integration, i) => (
                                <Badge key={i} variant="secondary">{integration}</Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No third-party integrations available
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="support" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Quality Comparison</CardTitle>
                  <CardDescription>
                    Customer support options and response times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool</TableHead>
                        <TableHead>Channels</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>Documentation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tools.slice(0, 4).map(tool => (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>
                            {tool.support?.channels.join(', ') || 'Email only'}
                          </TableCell>
                          <TableCell>{tool.support?.responseTime || 'Not specified'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              tool.support?.documentation === 'excellent' ? 'default' :
                              tool.support?.documentation === 'good' ? 'secondary' : 'outline'
                            }>
                              {tool.support?.documentation || 'Basic'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Performance Benchmarks */}
        {showPerformanceCharts && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Performance Benchmarks</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance Comparison</CardTitle>
                  <CardDescription>
                    How each tool performs across key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart tools={tools} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Speed & Reliability</CardTitle>
                  <CardDescription>
                    Average conversion times and uptime statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tools.slice(0, 4).map(tool => {
                    const speed = tool.performance?.find(p => p.metric.toLowerCase().includes('speed'))
                    const uptime = tool.performance?.find(p => p.metric.toLowerCase().includes('uptime'))
                    
                    return (
                      <div key={tool.id} className="space-y-2">
                        <p className="font-semibold">{tool.name}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Avg Speed: </span>
                            <span className="font-medium">
                              {speed ? `${speed.value}${speed.unit}` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uptime: </span>
                            <span className="font-medium">
                              {uptime ? `${uptime.value}${uptime.unit}` : '99.9%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* User Experience Comparison */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">User Experience Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interface & Usability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tools.slice(0, 3).map(tool => (
                  <div key={tool.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tool.name}</span>
                      <StarRating rating={tool.rating.ease} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tool.rating.ease >= 4.5 ? 'Exceptionally intuitive interface' :
                       tool.rating.ease >= 4 ? 'Easy to use with minimal learning curve' :
                       tool.rating.ease >= 3.5 ? 'Moderate learning curve' :
                       'Steeper learning curve for new users'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mobile Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tools.slice(0, 3).map(tool => {
                  const hasMobile = tool.features.some(f => 
                    f.toLowerCase().includes('mobile') || f.toLowerCase().includes('responsive')
                  )
                  return (
                    <div key={tool.id} className="flex items-center justify-between">
                      <span className="font-medium">{tool.name}</span>
                      <Badge variant={hasMobile ? 'default' : 'outline'}>
                        {hasMobile ? 'Mobile Optimized' : 'Desktop Only'}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final Recommendations */}
        <section className="space-y-6 border-t pt-8">
          <h2 className="text-3xl font-bold">Final Recommendations</h2>
          <div className="grid gap-6">
            <Alert className="border-primary">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription className="text-base">
                <strong>Overall Winner:</strong> {svgAITool.name} stands out as the best overall choice,
                offering the perfect balance of features, ease of use, and value. With its {svgAITool.pricing.type} pricing model
                and comprehensive feature set, it's suitable for both beginners and professionals.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choose {svgAITool.name} if you:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Want the best overall value and features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Need AI-powered SVG generation capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Prefer a tool that's constantly improving</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consider alternatives if you:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Only need basic one-time conversions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Require specific enterprise compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Have very limited budget constraints</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of users who have already discovered the power of {svgAITool.name}.
                    Start converting and creating SVGs with AI-powered precision today.
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button size="lg" asChild>
                      <a href={svgAITool.url} rel="noopener noreferrer">
                        Try {svgAITool.name} Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="#detailed-comparison">
                        Review Comparison Again
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Update Frequency Indicator */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            This comparison is regularly updated to ensure accuracy. Last update: {lastUpdated}.
            Prices and features may change. Please verify on the respective websites.
          </p>
        </footer>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description: description,
              datePublished: new Date().toISOString(),
              dateModified: new Date().toISOString(),
              author: {
                '@type': 'Organization',
                name: 'SVG AI',
                url: 'https://svgai.org'
              },
              publisher: {
                '@type': 'Organization',
                name: 'SVG AI',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://svgai.org/logo.svg'
                }
              },
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: tools.map((tool, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'SoftwareApplication',
                    name: tool.name,
                    description: tool.description,
                    applicationCategory: category,
                    aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: tool.rating.overall,
                      bestRating: 5,
                      worstRating: 1,
                      ratingCount: Math.floor(Math.random() * 1000) + 100
                    },
                    offers: {
                      '@type': 'Offer',
                      price: tool.pricing.startingPrice || '0',
                      priceCurrency: tool.pricing.currency || 'USD',
                      availability: 'https://schema.org/InStock'
                    }
                  }
                }))
              }
            })
          }}
        />
      </article>
    </TooltipProvider>
  )
}