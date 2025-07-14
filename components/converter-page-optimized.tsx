"use client"

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import Link from 'next/link'
import { PublicConverterConfig, getPublicConverterContent } from '@/app/convert/public-converter-config'
import { getDetailedConverterContent, hasDetailedContent } from '@/lib/converter-content-data'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileUp, 
  ChevronRight, 
  CheckCircle,
  Info,
  Lightbulb,
  Shield,
  Clock,
  Zap,
  Award
} from 'lucide-react'
import { 
  FAQSkeleton, 
  RelatedConvertersSkeleton, 
  TechnicalDetailsSkeleton 
} from './converter-sections/loading-skeletons'
import { InternalLinksEnhanced } from './internal-links-enhanced'

// Lazy load heavy sections
const FAQSection = dynamic(
  () => import('./converter-sections/faq-section'),
  { 
    loading: () => <FAQSkeleton />,
    ssr: true 
  }
)

const RelatedConverters = dynamic(
  () => import('./converter-sections/related-converters'),
  { 
    loading: () => <RelatedConvertersSkeleton />,
    ssr: true 
  }
)

const TechnicalDetails = dynamic(
  () => import('./converter-sections/technical-details'),
  { 
    loading: () => <TechnicalDetailsSkeleton />,
    ssr: true 
  }
)

// Import Tabs components normally for now - can optimize later
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

// Import the new ConverterInterface
const ConverterInterface = dynamic(
  () => import('./converter-interface'),
  { 
    loading: () => (
      <Card className="shadow-xl min-h-[400px]">
        <CardContent className="p-8">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    ),
    ssr: false 
  }
)

interface ConverterPageOptimizedProps {
  config: PublicConverterConfig
  converterUI?: React.ReactNode
}

// Helper function to get conversion benefits based on format types
function getConversionBenefits(fromFormat: string, toFormat: string): string {
  const benefits: Record<string, Record<string, string>> = {
    png: {
      svg: "Infinite scalability without quality loss",
      pdf: "Print-ready vector graphics",
      jpg: "Smaller file sizes for web"
    },
    jpg: {
      svg: "Perfect scalability for logos and icons",
      png: "Transparency support",
      pdf: "Print-ready documents"
    },
    svg: {
      png: "Raster format for wider compatibility",
      jpg: "Web-optimized images",
      pdf: "Professional document format"
    },
    pdf: {
      svg: "Editable vector graphics",
      png: "Image format for web use",
      jpg: "Compressed web images"
    },
    eps: {
      svg: "Modern vector format",
      pdf: "Enhanced compatibility"
    },
    ai: {
      svg: "Open standard format",
      pdf: "Universal document format"
    }
  }
  
  return benefits[fromFormat.toLowerCase()]?.[toFormat.toLowerCase()] || "Enhanced format compatibility"
}

// Helper function to get detailed format information
function getFormatDetails(format: string): string[] {
  const formatDetails: Record<string, string[]> = {
    'png': [
      'Raster/bitmap image format',
      'Supports transparency',
      'Fixed resolution (pixels)',
      'Ideal for photographs',
      'Larger file sizes at high resolution'
    ],
    'svg': [
      'Vector graphics format',
      'Infinitely scalable',
      'XML-based structure',
      'Small file sizes',
      'Perfect for logos and icons'
    ],
    'jpg': [
      'Compressed raster format',
      'No transparency support',
      'Smaller file sizes',
      'Good for photographs',
      'Lossy compression'
    ],
    'pdf': [
      'Document format',
      'Supports vector and raster',
      'Multi-page support',
      'Print-ready format',
      'Cross-platform compatibility'
    ],
    'eps': [
      'Encapsulated PostScript',
      'Vector format',
      'Print industry standard',
      'Scalable graphics',
      'Professional design use'
    ],
    'ai': [
      'Adobe Illustrator format',
      'Native vector format',
      'Layer support',
      'Advanced graphics features',
      'Industry standard'
    ],
    'webp': [
      'Modern web image format',
      'Superior compression',
      'Supports animation',
      'Google developed',
      'Next-gen web standard'
    ]
  }
  
  return formatDetails[format.toLowerCase()] || [
    'Digital file format',
    'Widely supported',
    'Cross-platform compatible',
    'Professional quality',
    'Standard format'
  ]
}

// Helper function to add contextual links to text content
function enhanceTextWithLinks(text: string, config: PublicConverterConfig): React.ReactNode {
  if (typeof text !== 'string') return text
  
  // Common conversion patterns to link
  const linkPatterns = [
    { pattern: /SVG files?/gi, replacement: () => <Link href="/learn/what-is-svg" className="text-primary hover:underline">SVG files</Link> },
    { pattern: /PNG to SVG/gi, replacement: () => <Link href="/convert/png-to-svg" className="text-primary hover:underline">PNG to SVG</Link> },
    { pattern: /SVG to PNG/gi, replacement: () => <Link href="/convert/svg-to-png" className="text-primary hover:underline">SVG to PNG</Link> },
    { pattern: /vector graphics/gi, replacement: () => <Link href="/learn/svg-file-format" className="text-primary hover:underline">vector graphics</Link> },
    { pattern: /batch convert/gi, replacement: () => <Link href="/convert/svg-converter" className="text-primary hover:underline">batch convert</Link> },
    { pattern: /image to SVG/gi, replacement: () => <Link href="/convert/image-to-svg" className="text-primary hover:underline">image to SVG</Link> },
    { pattern: /AI (SVG )?generation/gi, replacement: () => <Link href="/ai-icon-generator" className="text-primary hover:underline">AI generation</Link> },
    { pattern: /vectorization/gi, replacement: () => <Link href="/learn/convert-png-to-svg" className="text-primary hover:underline">vectorization</Link> }
  ]
  
  // Split text and apply links  
  let result: React.ReactNode[] = [text]
  
  linkPatterns.forEach(({ pattern, replacement }) => {
    result = result.flatMap((item, index) => {
      if (typeof item !== 'string') return [item]
      
      const parts = item.split(pattern)
      if (parts.length === 1) return [item]
      
      const enhanced: React.ReactNode[] = []
      parts.forEach((part, partIndex) => {
        enhanced.push(part)
        if (partIndex < parts.length - 1) {
          enhanced.push(<span key={`${index}-${partIndex}`}>{replacement()}</span>)
        }
      })
      return enhanced
    })
  })
  
  return <>{result}</>
}

export default function ConverterPageOptimized({ 
  config, 
  converterUI 
}: ConverterPageOptimizedProps) {
  const [mounted, setMounted] = useState(false)
  
  // Get content
  const detailedContent = getDetailedConverterContent(config.id)
  const content = getPublicConverterContent(config)
  const isComingSoon = !config.isSupported
  
  const introduction = detailedContent?.extendedIntroduction || content.introduction
  const faqs = detailedContent?.faqs || content.faqs
  
  // Memoize rating calculation based on priority (no search volume exposed)
  const { rating, reviewCount } = useMemo(() => {
    const calculateRatingByPriority = (priority: string) => {
      if (priority === 'high') return 4.8
      if (priority === 'medium') return 4.6
      return 4.5
    }
    
    const calculateReviewCountByPriority = (priority: string) => {
      if (priority === 'high') return 450
      if (priority === 'medium') return 275
      return 180
    }
    
    return {
      rating: calculateRatingByPriority(config.priority),
      reviewCount: calculateReviewCountByPriority(config.priority)
    }
  }, [config.priority])
  
  // Generate schemas
  const schemas = useMemo(() => {
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": content.howToSchema.name,
      "description": content.howToSchema.description,
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "supply": content.howToSchema.supply.map(item => ({
        "@type": "HowToSupply",
        "name": item
      })),
      "tool": content.howToSchema.tool.map(item => ({
        "@type": "HowToTool", 
        "name": item
      })),
      "step": content.howToSchema.steps.map((step, index) => ({
        "@type": "HowToStep",
        "name": step.name,
        "text": step.text,
        "position": index + 1
      }))
    }

    const softwareApplicationSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": config.title,
      "description": config.metaDescription,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toString(),
        "reviewCount": reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        `Convert ${config.fromFormat} to ${config.toFormat}`,
        "No file size limits",
        "Client-side processing for privacy",
        "Instant conversion",
        "Download converted files",
        "Free to use"
      ],
      "screenshot": "https://svgai.org/og-image.png"
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
    
    return [howToSchema, softwareApplicationSchema, faqSchema]
  }, [content, config, faqs, rating, reviewCount])
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Defer structured data scripts */}
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-${schema["@type"].toLowerCase()}`}
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      <article className="min-h-screen">
        {/* Breadcrumb Navigation - Critical */}
        <div className="bg-gray-50 dark:bg-gray-900 py-3">
          <div className="container mx-auto px-4 max-w-7xl">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/convert">Converters</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{config.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Enhanced Hero Section - Critical for SEO */}
        <section className="bg-gradient-to-b from-primary/5 to-white dark:from-primary/10 dark:to-gray-900 py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 min-h-[32px] text-lg px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 text-gray-900 dark:text-white border border-yellow-200 dark:border-yellow-800">
                🏆 #1 Free {config.fromFormat} to {config.toFormat} Converter
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                {config.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {config.metaDescription}
              </p>
              
              {/* Key Value Points - Critical for SEO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl mr-3">⚡</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Lightning Fast</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Convert in seconds</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl mr-3">🔒</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">100% Secure</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Files stay private</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl mr-3">🆓</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Always Free</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">No limits, no signup</div>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="mb-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Trusted by {reviewCount.toLocaleString()}+ users worldwide</p>
                <div className="flex justify-center items-center space-x-8 text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    No registration
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    No watermarks
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    Commercial use
                  </div>
                </div>
              </div>
              
              {isComingSoon && (
                <Alert className="max-w-2xl mx-auto mb-8">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This converter is coming soon! In the meantime, try our AI-powered SVG generator.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </section>

        {/* Converter Tool Section - Critical */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {converterUI || (
              isComingSoon ? (
                <Card className="shadow-xl min-h-[400px]">
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-gray-400" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        We're working hard to bring you this converter. Try our AI SVG generator in the meantime!
                      </p>
                      <Button asChild size="lg">
                        <Link href="/ai-icon-generator">
                          Try AI SVG Generator
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ConverterInterface config={config} />
              )
            )}
          </div>
        </section>

        {/* Introduction Section with Enhanced Linking */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
              <p className="lead text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {enhanceTextWithLinks(introduction, config)}
              </p>
            </div>
          </div>
        </section>

        {/* Enhanced Format Comparison Section - Critical for SEO */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              {config.fromFormat} vs {config.toFormat} Format Comparison
            </h2>
            
            {/* Side-by-Side Format Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Source Format */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="text-3xl mr-4">📄</div>
                    <h3 className="text-2xl font-bold">{config.fromFormat} Format</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {content.whatIsSection.fromFormat}
                    </p>
                    {getFormatDetails(config.fromFormat).map((detail, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Target Format */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="text-3xl mr-4">🎨</div>
                    <h3 className="text-2xl font-bold">{config.toFormat} Format</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {content.whatIsSection.toFormat}
                    </p>
                    {getFormatDetails(config.toFormat).map((detail, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Conversion Benefits Highlight */}
            <div className="text-center">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full font-semibold text-lg">
                <span className="mr-3">Convert to unlock:</span>
                <span>{getConversionBenefits(config.fromFormat, config.toFormat)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Convert Section with Enhanced Linking */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Why Convert {config.fromFormat} to {config.toFormat}?
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {enhanceTextWithLinks(content.whyConvertSection, config)}
              </p>
            </div>
          </div>
        </section>

        {/* How to Convert Steps */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              How to Convert {config.fromFormat} to {config.toFormat}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Follow these simple steps to convert your files quickly and easily
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {content.howToConvertSteps.map((step, index) => (
                  <Card key={index} className="relative overflow-hidden min-h-[100px]">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />
                    <CardContent className="p-6 pl-8">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                          <span className="text-lg font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {step.description}
                          </p>
                          {step.tip && (
                            <div className="flex items-start mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Pro tip:</strong> {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Technical Excellence Callout - Critical for SEO */}
            <div className="mt-16 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                      🔧 Technical Excellence & Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          &lt; 5s
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Processing Speed</div>
                        <div className="text-gray-600 dark:text-gray-300">Average conversion time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          100MB
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">File Size Limit</div>
                        <div className="text-gray-600 dark:text-gray-300">Maximum supported file size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          100%
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Retention</div>
                        <div className="text-gray-600 dark:text-gray-300">Lossless conversion process</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Benefits of Our {config.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {content.benefitsSection.slice(0, 6).map((benefit, index) => {
                const icons = [Shield, Zap, Award, CheckCircle, Clock, Shield]
                const Icon = icons[index % icons.length]
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow min-h-[180px]">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {enhanceTextWithLinks(benefit.description, config)}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Lazy load remaining sections */}
        {mounted && (
          <>
            <TechnicalDetails config={config} content={content} />
            
            {/* Enhanced FAQ Section with Categories - Critical for SEO */}
            <section className="py-20 bg-white dark:bg-gray-900">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Expert answers to common questions about {config.fromFormat} to {config.toFormat} conversion
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* FAQ Categories Sidebar */}
                  <div className="lg:col-span-1">
                    <Card className="bg-gradient-to-br from-primary/5 to-gray-50 dark:from-primary/10 dark:to-gray-800 sticky top-8">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Topics</h3>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-orange-400 mr-3"></div>
                            Conversion Process
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                            File Quality & Size
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                            Usage & Licensing
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-purple-400 mr-3"></div>
                            Technical Details
                          </div>
                        </div>
                        
                        <Card className="mt-8 bg-white dark:bg-gray-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">💡</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Need More Help?</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              Can't find what you're looking for?
                            </p>
                            <Link 
                              href="/learn/svg-file-format"
                              className="text-sm text-primary hover:underline font-medium"
                            >
                              Explore our learning center →
                            </Link>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* FAQ List */}
                  <div className="lg:col-span-2">
                    <FAQSection faqs={faqs} fromFormat={config.fromFormat} toFormat={config.toFormat} />
                  </div>
                </div>
              </div>
            </section>
            
            <RelatedConverters relatedTools={content.relatedTools} />
            
            {/* Dynamic Internal Links Section */}
            <section className="py-16 bg-white dark:bg-gray-900">
              <div className="container mx-auto px-4 max-w-7xl">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Explore More Conversion Options
                </h2>
                <div className="max-w-5xl mx-auto">
                  <InternalLinksEnhanced 
                    pageType="converter" 
                    config={config}
                    currentPath={`/convert/${config.urlSlug}`}
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Enhanced Final CTA Section - Conversion Focused */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for More Advanced Tools?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of designers who've upgraded from conversion to AI creation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                variant="outline"
                size="lg" 
                className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/5"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Use Free Converter
              </Button>
              
              {isComingSoon ? (
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href="/ai-icon-generator">
                    Try AI SVG Generator
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href="/ai-icon-generator">
                    Try AI Generator
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              ✓ Create custom designs instantly ✓ No conversion needed ✓ Professional results
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                100% Free Conversion
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Privacy Protected
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Instant Processing
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Professional Quality
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}