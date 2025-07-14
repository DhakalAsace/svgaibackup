"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Terminal, 
  Monitor, 
  Smartphone, 
  ChevronRight,
  FileIcon,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Code2,
  Mouse,
  Zap,
  Rocket,
  Target,
  Users,
  TrendingUp,
  Clock,
  Shield,
  RefreshCw,
  Package,
  Cpu,
  Globe,
  BookOpen,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import ConversionGuide from "@/components/keyword-components/ConversionGuide"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// TypeScript interfaces
export interface ConversionBenefit {
  title: string
  description: string
  icon: React.ReactNode
}

export interface ConversionProblem {
  problem: string
  symptom: string
  solution: string
  preventionTip?: string
}

export interface BestPractice {
  category: string
  practices: {
    title: string
    description: string
    example?: string
  }[]
}

export interface AlternativeTool {
  name: string
  description: string
  pros: string[]
  cons: string[]
  bestFor: string
  pricing: string
}

export interface BatchConversionMethod {
  platform: "windows" | "mac" | "linux" | "web"
  title: string
  steps: string[]
  command?: string
  limitations?: string[]
}

export interface APIOption {
  name: string
  description: string
  documentation: string
  example: string
  pricing: string
  rateLimit?: string
}

export interface RelatedConversion {
  fromFormat: string
  toFormat: string
  title: string
  description: string
  href: string
}

export interface ConversionGuideTemplateProps {
  // Basic information
  fromFormat: string
  toFormat: string
  title: string
  description: string
  searchIntent: string
  monthlySearches: number
  
  // SEO metadata
  metaTitle?: string
  metaDescription?: string
  
  // Converter component
  converterComponent: React.ReactNode
  
  // Content sections
  benefits?: ConversionBenefit[]
  commonProblems?: ConversionProblem[]
  bestPractices?: BestPractice[]
  alternativeTools?: AlternativeTool[]
  batchMethods?: BatchConversionMethod[]
  apiOptions?: APIOption[]
  relatedConversions?: RelatedConversion[]
  
  // Advanced techniques
  advancedTechniques?: {
    title: string
    description: string
    steps: string[]
    codeExample?: string
  }[]
  
  // FAQ items
  faqs?: {
    question: string
    answer: string
  }[]
  
  // UI customization
  className?: string
  showTableOfContents?: boolean
  ctaButtonText?: string
  ctaButtonAction?: () => void
}

// Default benefits if none provided
const getDefaultBenefits = (fromFormat: string, toFormat: string): ConversionBenefit[] => [
  {
    title: "File Size Optimization",
    description: `Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} for optimal file sizes and faster loading times.`,
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    title: "Universal Compatibility",
    description: `Ensure your files work across all platforms and applications with ${toFormat.toUpperCase()} format.`,
    icon: <Globe className="w-5 h-5" />
  },
  {
    title: "Quality Preservation",
    description: "Maintain the original quality of your images during the conversion process.",
    icon: <Shield className="w-5 h-5" />
  },
  {
    title: "Batch Processing",
    description: "Convert files efficiently to save time and streamline your workflow.",
    icon: <Package className="w-5 h-5" />
  }
]

export default function ConversionGuideTemplate({
  fromFormat,
  toFormat,
  title,
  description,
  searchIntent,
  monthlySearches,
  metaTitle,
  metaDescription,
  converterComponent,
  benefits,
  commonProblems = [],
  bestPractices = [],
  alternativeTools = [],
  batchMethods = [],
  apiOptions = [],
  relatedConversions = [],
  advancedTechniques = [],
  faqs = [],
  className,
  showTableOfContents = true,
  ctaButtonText = "Convert Now",
  ctaButtonAction
}: ConversionGuideTemplateProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const conversionBenefits = benefits || getDefaultBenefits(fromFormat, toFormat)
  
  // Generate HowTo schema markup
  const generateSchemaMarkup = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": metaTitle || title,
      "description": metaDescription || description,
      "totalTime": "PT5M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "supply": [],
      "tool": [
        {
          "@type": "HowToTool",
          "name": `${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} Converter`
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your file",
          "text": `Select or drag and drop your ${fromFormat.toUpperCase()} file into the converter.`,
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure settings",
          "text": "Adjust conversion settings like quality, dimensions, or format-specific options.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert the file",
          "text": `Click the convert button to transform your ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}.`,
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download result",
          "text": `Download your converted ${toFormat.toUpperCase()} file to your device.`,
          "position": 4
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250"
      }
    }
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    )
  }
  
  // Table of Contents
  const tableOfContents = [
    { id: "benefits", title: "Why Convert?", icon: <Target className="w-4 h-4" /> },
    { id: "converter", title: "Quick Converter", icon: <Zap className="w-4 h-4" /> },
    { id: "methods", title: "Conversion Methods", icon: <BookOpen className="w-4 h-4" /> },
    { id: "advanced", title: "Advanced Techniques", icon: <Cpu className="w-4 h-4" /> },
    { id: "problems", title: "Common Problems", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "best-practices", title: "Best Practices", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "alternatives", title: "Alternative Tools", icon: <RefreshCw className="w-4 h-4" /> },
    { id: "batch", title: "Batch Conversion", icon: <Package className="w-4 h-4" /> },
    { id: "api", title: "API & Automation", icon: <Terminal className="w-4 h-4" /> },
    { id: "related", title: "Related Conversions", icon: <Globe className="w-4 h-4" /> }
  ]
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
  return (
    <>
      {generateSchemaMarkup()}
      <div className={cn("space-y-12", className)}>
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-2">
              {monthlySearches.toLocaleString()}+ monthly searches
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {description}
            </p>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('converter')}
              className="gap-2"
            >
              <Rocket className="w-5 h-5" />
              {ctaButtonText}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('methods')}
              className="gap-2"
            >
              <BookOpen className="w-5 h-5" />
              View Step-by-Step Guide
            </Button>
          </div>
        </div>
        
        {/* Table of Contents */}
        {showTableOfContents && (
          <Card className="sticky top-4 z-10">
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {tableOfContents.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.icon}
                    <span className="ml-2 text-sm">{item.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Why Convert Section */}
        <section id="benefits" className="space-y-6">
          <h2 className="text-3xl font-bold">Why Convert {fromFormat.toUpperCase()} to {toFormat.toUpperCase()}?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversionBenefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA after benefits */}
          <Alert className="bg-primary/5 border-primary/20">
            <Rocket className="h-4 w-4" />
            <AlertTitle>Ready to get started?</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Convert your {fromFormat.toUpperCase()} files instantly with our free online tool.</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => scrollToSection('converter')}
                className="ml-4"
              >
                Try it now
              </Button>
            </AlertDescription>
          </Alert>
        </section>
        
        {/* Quick Conversion Widget */}
        <section id="converter" className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Quick {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} Converter
              </CardTitle>
              <CardDescription>
                Convert your files instantly - no signup required, 100% free
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {converterComponent}
            </CardContent>
          </Card>
        </section>
        
        {/* Step-by-Step Methods */}
        <section id="methods" className="space-y-6">
          <h2 className="text-3xl font-bold">Step-by-Step Conversion Methods</h2>
          <ConversionGuide
            fromFormat={fromFormat}
            toFormat={toFormat}
            converterComponent={null}
            className="shadow-none border-0"
          />
        </section>
        
        {/* Advanced Techniques */}
        {advancedTechniques.length > 0 && (
          <section id="advanced" className="space-y-6">
            <h2 className="text-3xl font-bold">Advanced Techniques</h2>
            <div className="space-y-6">
              {advancedTechniques.map((technique, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{technique.title}</CardTitle>
                    <CardDescription>{technique.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {technique.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex gap-3">
                          <Badge variant="outline" className="flex-shrink-0">
                            {stepIndex + 1}
                          </Badge>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                    {technique.codeExample && (
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
                          <code>{technique.codeExample}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => navigator.clipboard.writeText(technique.codeExample || '')}
                        >
                          <Code2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Common Problems & Solutions */}
        {commonProblems.length > 0 && (
          <section id="problems" className="space-y-6">
            <h2 className="text-3xl font-bold">Common Problems & Solutions</h2>
            <Accordion type="single" collapsible className="w-full">
              {commonProblems.map((item, index) => (
                <AccordionItem key={index} value={`problem-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{item.problem}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Symptom:</h4>
                        <p className="text-sm text-muted-foreground">{item.symptom}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Solution:</h4>
                        <p className="text-sm">{item.solution}</p>
                      </div>
                      {item.preventionTip && (
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertTitle>Prevention Tip</AlertTitle>
                          <AlertDescription>{item.preventionTip}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {/* CTA after problems */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold mb-1">Still having issues?</h3>
                  <p className="text-sm text-muted-foreground">
                    Try our converter - it handles these problems automatically
                  </p>
                </div>
                <Button onClick={() => scrollToSection('converter')}>
                  Use Converter
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
        
        {/* Best Practices */}
        {bestPractices.length > 0 && (
          <section id="best-practices" className="space-y-6">
            <h2 className="text-3xl font-bold">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {bestPractices.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.practices.map((practice, practiceIndex) => (
                        <div key={practiceIndex} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{practice.title}</h4>
                              <p className="text-sm text-muted-foreground">{practice.description}</p>
                              {practice.example && (
                                <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-x-auto">
                                  <code>{practice.example}</code>
                                </pre>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Alternative Tools Comparison */}
        {alternativeTools.length > 0 && (
          <section id="alternatives" className="space-y-6">
            <h2 className="text-3xl font-bold">Alternative Tools Comparison</h2>
            <div className="space-y-4">
              {alternativeTools.map((tool, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{tool.name}</CardTitle>
                      <Badge variant="outline">{tool.pricing}</Badge>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400">Pros</h4>
                        <ul className="space-y-1">
                          {tool.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-orange-700 dark:text-orange-400">Cons</h4>
                        <ul className="space-y-1">
                          {tool.cons.map((con, conIndex) => (
                            <li key={conIndex} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Best For</h4>
                        <p className="text-sm text-muted-foreground">{tool.bestFor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Our tool comparison */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Our {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} Converter
                    </CardTitle>
                    <Badge>Free</Badge>
                  </div>
                  <CardDescription>The fastest, easiest way to convert your files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400">Advantages</h4>
                      <ul className="space-y-1">
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>100% free, no signup</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Instant conversion</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>No file size limits</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Privacy-focused</span>
                        </li>
                      </ul>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-center">
                      <Button 
                        size="lg" 
                        onClick={() => scrollToSection('converter')}
                        className="gap-2"
                      >
                        <Rocket className="w-5 h-5" />
                        Try Our Free Converter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        
        {/* Batch Conversion Guide */}
        {batchMethods.length > 0 && (
          <section id="batch" className="space-y-6">
            <h2 className="text-3xl font-bold">Batch Conversion Guide</h2>
            <p className="text-lg text-muted-foreground">
              Need to convert multiple {fromFormat.toUpperCase()} files to {toFormat.toUpperCase()}? Here's how to do it efficiently.
            </p>
            <Tabs defaultValue={batchMethods[0]?.platform || "windows"}>
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                {batchMethods.map((method) => (
                  <TabsTrigger key={method.platform} value={method.platform}>
                    {method.platform.charAt(0).toUpperCase() + method.platform.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {batchMethods.map((method) => (
                <TabsContent key={method.platform} value={method.platform} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{method.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {method.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex gap-3">
                            <Badge variant="secondary" className="flex-shrink-0">
                              {stepIndex + 1}
                            </Badge>
                            <p className="text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                      {method.command && (
                        <div className="relative">
                          <pre className="bg-slate-900 text-slate-50 p-3 rounded-md text-sm overflow-x-auto">
                            <code>{method.command}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => navigator.clipboard.writeText(method.command!)}
                          >
                            <Code2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {method.limitations && method.limitations.length > 0 && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Limitations</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              {method.limitations.map((limitation, index) => (
                                <li key={index} className="text-sm">{limitation}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
            
            {/* Batch conversion CTA */}
            <Alert className="bg-primary/5 border-primary/20">
              <Package className="h-4 w-4" />
              <AlertTitle>Need to convert files in bulk?</AlertTitle>
              <AlertDescription>
                Our online converter supports multiple file uploads for easy batch conversion.
                <Button 
                  size="sm" 
                  variant="link" 
                  className="px-0 ml-2"
                  onClick={() => scrollToSection('converter')}
                >
                  Try batch conversion →
                </Button>
              </AlertDescription>
            </Alert>
          </section>
        )}
        
        {/* API/Automation Options */}
        {apiOptions.length > 0 && (
          <section id="api" className="space-y-6">
            <h2 className="text-3xl font-bold">API & Automation Options</h2>
            <p className="text-lg text-muted-foreground">
              Automate your {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} conversions with these API solutions.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {apiOptions.map((api, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{api.name}</CardTitle>
                      <Badge variant="outline">{api.pricing}</Badge>
                    </div>
                    <CardDescription>{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Example Request</h4>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        <code>{api.example}</code>
                      </pre>
                    </div>
                    {api.rateLimit && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Rate Limit: {api.rateLimit}</span>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(api.documentation, '_blank')}
                    >
                      View Documentation
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pl-8">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
        
        {/* Related Conversions Section */}
        {relatedConversions.length > 0 && (
          <section id="related" className="space-y-6">
            <h2 className="text-3xl font-bold">Related Conversions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedConversions.map((related, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = related.href}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{related.fromFormat}</Badge>
                        <ArrowRight className="w-4 h-4" />
                        <Badge variant="secondary">{related.toFormat}</Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{related.title}</h3>
                    <p className="text-sm text-muted-foreground">{related.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Final CTA Section */}
        <section className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-3xl font-bold">
                Ready to Convert Your {fromFormat.toUpperCase()} Files?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who trust our converter for fast, reliable {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} conversions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={ctaButtonAction || (() => scrollToSection('converter'))}
                  className="gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Start Converting Now
                </Button>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>10,000+ users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>100% secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span>Instant results</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}