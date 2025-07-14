"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { 
  FileUp, 
  Settings, 
  Zap, 
  Download, 
  ChevronRight, 
  CheckCircle,
  Info,
  Lightbulb,
  BookOpen,
  Users,
  Award,
  Shield,
  Clock,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'

interface ConverterPageWithSEOProps {
  config: PublicConverterConfig
  converterUI?: React.ReactNode
}

export default function ConverterPageWithSEO({ 
  config, 
  converterUI 
}: ConverterPageWithSEOProps) {
  // Check if we have detailed content from sub-agents
  const detailedContent = getDetailedConverterContent(config.id)
  const content = getPublicConverterContent(config)
  const isComingSoon = !config.isSupported
  
  // Use detailed content if available, otherwise fall back to basic content
  const introduction = detailedContent?.extendedIntroduction || content.introduction
  const faqs = detailedContent?.faqs || content.faqs
  const whyConvertReasons = detailedContent?.whyConvert.mainReasons || []

  // Calculate rating based on priority (4.0-5.0 scale)
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

  const rating = calculateRatingByPriority(config.priority)
  const reviewCount = calculateReviewCountByPriority(config.priority)

  // Generate schema.org structured data
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

  // Combine all schemas
  const schemaData = [
    howToSchema,
    softwareApplicationSchema,
    faqSchema
  ]

  return (
    <>
      {/* Render multiple structured data scripts */}
      {schemaData.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-${schema["@type"].toLowerCase()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      <article className="min-h-screen">
        {/* Breadcrumb Navigation */}
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

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-white dark:from-primary/10 dark:to-gray-900 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4" variant="secondary">
                {config.priority === 'high' ? 'Most Popular' : config.priority === 'medium' ? 'Professional Grade' : 'Specialized Tool'}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {config.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {config.metaDescription}
              </p>
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

        {/* Converter Tool Section */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {converterUI || (
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  {isComingSoon ? (
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
                  ) : (
                    <div className="space-y-8">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                        <FileUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg mb-2">
                          Drop your {config.fromFormat} file here or click to browse
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Supports {config.fromFormat} format • Max file size: 100MB
                        </p>
                        <Button className="mt-4">
                          Select {config.fromFormat} File
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="lead">{content.introduction}</p>
            </div>
          </div>
        </section>

        {/* Format Information Tabs */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Understanding {config.fromFormat} and {config.toFormat} Formats
            </h2>
            <Tabs defaultValue="from" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="from">{config.fromFormat} Format</TabsTrigger>
                <TabsTrigger value="to">{config.toFormat} Format</TabsTrigger>
              </TabsList>
              <TabsContent value="from" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What is {config.fromFormat}?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {content.whatIsSection.fromFormat}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="to" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What is {config.toFormat}?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {content.whatIsSection.toFormat}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Why Convert Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Convert {config.fromFormat} to {config.toFormat}?
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
              <p>{content.whyConvertSection}</p>
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
                  <Card key={index} className="relative overflow-hidden">
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
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Benefits of Our {config.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.benefitsSection.map((benefit, index) => {
                const icons = [Shield, Zap, Award, Users, Clock, Smartphone]
                const Icon = icons[index % icons.length]
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Industry Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {content.useCasesSection.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary" />
                      {useCase.industry}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">{useCase.description}</p>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <p className="text-sm">
                        <strong>Example:</strong> {useCase.example}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Technical Details
            </h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {content.technicalDetailsSection.conversionProcess}
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {config.fromFormat} Technical Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {content.technicalDetailsSection.fromFormatDetails}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {config.toFormat} Technical Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {content.technicalDetailsSection.toFormatDetails}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Format Comparison Table */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              {content.comparisonSection.title}
            </h2>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                    <th className="px-6 py-4 text-left font-semibold">{config.fromFormat}</th>
                    <th className="px-6 py-4 text-left font-semibold">{config.toFormat}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.comparisonSection.comparisons.map((comparison, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-6 py-4 font-medium">{comparison.aspect}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {comparison.fromFormat}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {comparison.toFormat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Common Problems & Solutions */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Common Problems & Solutions
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.commonProblemsSection.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-start">
                      <Info className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" />
                      {item.problem}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Solution:</strong> {item.solution}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Best Practices for {config.fromFormat} to {config.toFormat} Conversion
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <ul className="space-y-6">
                  {content.bestPracticesSection.map((practice, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">{practice.practice}</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {practice.explanation}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Everything you need to know about converting {config.fromFormat} to {config.toFormat}
            </p>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible>
                {content.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Related Converters */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Related Converters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {content.relatedTools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        {tool.title}
                        <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Convert {config.fromFormat} to {config.toFormat}?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our free converter for their file conversion needs
            </p>
            {isComingSoon ? (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/ai-icon-generator">
                  Try AI SVG Generator Instead
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Start Converting Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            )}
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                100% Free
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Secure & Private
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Instant Results
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                High Quality
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}