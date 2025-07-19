"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  Info,
  Code,
  Globe,
  Zap,
  Shield,
  Package,
  ArrowRight,
  Download,
  Upload,
  Settings,
  Layers,
  Edit3,
  Maximize2,
  Smartphone,
  Monitor,
  HelpCircle,
  BookOpen,
  Palette,
  Grid
} from 'lucide-react'
import FormatExplanation from '@/components/keyword-components/FormatExplanation'

interface TechnicalDetail {
  category: string
  details: Array<{
    label: string
    value: string
    description?: string
  }>
}

interface Example {
  title: string
  code: string
  description: string
  preview?: string
}

interface Tool {
  name: string
  description: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isPremium?: boolean
}

interface FAQ {
  question: string
  answer: string
}

export interface SVGBasicsTemplateProps {
  // Basic information
  keyword: string
  searchVolume: number
  lastUpdated?: string
  
  // Content sections
  introduction?: {
    title?: string
    content: string
    highlights?: string[]
  }
  
  // Optional: Use FormatExplanation component for standard format pages
  formatExplanationProps?: React.ComponentProps<typeof FormatExplanation>
  
  // Additional sections for comprehensive content
  technicalDetails?: TechnicalDetail[]
  examples?: Example[]
  tools?: Tool[]
  faqs?: FAQ[]
  
  // SEO and links
  relatedPages?: Array<{
    title: string
    href: string
    description: string
  }>
  
  // Schema markup
  schemaType?: 'Article' | 'HowTo' | 'TechArticle'
}

export default function SVGBasicsTemplate({
  keyword,
  searchVolume,
  lastUpdated,
  introduction,
  formatExplanationProps,
  technicalDetails,
  examples,
  tools,
  faqs,
  relatedPages,
  schemaType = 'TechArticle'
}: SVGBasicsTemplateProps) {
  // Generate schema markup
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "headline": introduction?.title || `Understanding ${keyword.toUpperCase()}`,
    "description": formatExplanationProps?.description || introduction?.content.substring(0, 160),
    "dateModified": lastUpdated || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "SVG AI"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "SVG AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://svgai.org/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://svgai.org/learn/${keyword.toLowerCase().replace(/\s+/g, '-')}`
    },
    "articleSection": "Technology",
    "about": {
      "@type": "Thing",
      "name": keyword.toUpperCase(),
      "description": formatExplanationProps?.fullName || `${keyword.toUpperCase()} file format`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <article className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge variant="info" className="mb-4">
                <HelpCircle className="w-3 h-3 mr-1" />
                Guide
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {introduction?.title || `Understanding ${keyword.toUpperCase()}`}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {formatExplanationProps?.description || introduction?.content.substring(0, 200)}
              </p>
              
              {introduction?.highlights && (
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {introduction.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                      {highlight}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg">
                  <Link href="/convert">
                    <Upload className="mr-2 h-4 w-4" />
                    Free Converters
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/ai-icon-generator">
                    <Zap className="mr-2 h-4 w-4" />
                    AI SVG Generator
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Introduction Section */}
          {introduction && !formatExplanationProps && (
            <section className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-muted/50 rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6">What is {keyword.toUpperCase()}?</h2>
                <p className="text-lg leading-relaxed">{introduction.content}</p>
              </div>
            </section>
          )}

          {/* Use FormatExplanation component if props provided */}
          {formatExplanationProps && (
            <FormatExplanation {...formatExplanationProps} />
          )}

          {/* Key Features and Benefits */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Key Features and Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Maximize2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Scalability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vector-based format that scales infinitely without quality loss, perfect for responsive designs.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Edit3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Editability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    XML-based structure allows easy editing with text editors or specialized design software.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Flexibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Supports animations, interactivity, and complex graphical effects through CSS and JavaScript.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Works across all modern browsers and devices without plugins or special software.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>File Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Typically smaller than raster images, especially for simple graphics and icons.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Web Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    W3C standard format ensuring long-term support and consistent implementation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Specifications */}
          {technicalDetails && technicalDetails.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Technical Specifications</h2>
              <Tabs defaultValue={technicalDetails[0].category} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-auto">
                  {technicalDetails.map((detail) => (
                    <TabsTrigger 
                      key={detail.category} 
                      value={detail.category}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {detail.category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {technicalDetails.map((detail) => (
                  <TabsContent key={detail.category} value={detail.category}>
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Property</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead className="hidden md:table-cell">Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {detail.details.map((spec, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <code className="text-sm bg-muted px-2 py-1 rounded">
                                    {spec.label}
                                  </code>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="info">{spec.value}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                  {spec.description}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          )}

          {/* Common Use Cases */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  Web Development
                </h3>
                <ul className="space-y-2 ml-7">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Website logos and branding elements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>User interface icons and buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Interactive infographics and charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Animated illustrations and decorations</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Design & Branding
                </h3>
                <ul className="space-y-2 ml-7">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Company logos and brand marks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Marketing materials and presentations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Social media graphics and assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Print materials at any resolution</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          {examples && examples.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Getting Started Guide</h2>
              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
                  {examples.map((example, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      {example.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {examples.map((example, index) => (
                  <TabsContent key={index} value={index.toString()}>
                    <Card>
                      <CardHeader>
                        <CardDescription>{example.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                          {example.preview && (
                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
                              <div dangerouslySetInnerHTML={{ __html: example.preview }} />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          )}

          {/* Comparison with Other Formats */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Comparison with Other Formats</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>SVG</TableHead>
                      <TableHead>PNG</TableHead>
                      <TableHead>JPG</TableHead>
                      <TableHead>GIF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Scalability</TableCell>
                      <TableCell><CheckCircle className="w-5 h-5 text-green-600" /></TableCell>
                      <TableCell><XCircle className="w-5 h-5 text-red-600" /></TableCell>
                      <TableCell><XCircle className="w-5 h-5 text-red-600" /></TableCell>
                      <TableCell><XCircle className="w-5 h-5 text-red-600" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Transparency</TableCell>
                      <TableCell><CheckCircle className="w-5 h-5 text-green-600" /></TableCell>
                      <TableCell><CheckCircle className="w-5 h-5 text-green-600" /></TableCell>
                      <TableCell><XCircle className="w-5 h-5 text-red-600" /></TableCell>
                      <TableCell><CheckCircle className="w-5 h-5 text-green-600" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Animation</TableCell>
                      <TableCell><CheckCircle className="w-5 h-5 text-green-600" /></TableCell>
                      <TableCell><XCircle className="w-5 h-5 text-red-600" /></TableCell>
                      <TableCell><XCircle className="w-5 h-5 text-red-600" /></TableCell>
                      <TableCell><CheckCircle className="w-5 h-5 text-green-600" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">File Size (Icons)</TableCell>
                      <TableCell><Badge variant="info">Small</Badge></TableCell>
                      <TableCell><Badge variant="info">Medium</Badge></TableCell>
                      <TableCell><Badge variant="info">Large</Badge></TableCell>
                      <TableCell><Badge variant="info">Medium</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Best For</TableCell>
                      <TableCell>Icons, Logos</TableCell>
                      <TableCell>Photos with transparency</TableCell>
                      <TableCell>Photographs</TableCell>
                      <TableCell>Simple animations</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Tools and Resources */}
          {tools && tools.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 text-center">Tools and Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => {
                  const Icon = tool.icon || Package
                  return (
                    <Link key={index} href={tool.href} className="group">
                      <Card className="h-full hover:shadow-lg transition-all hover:border-primary">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            {tool.isPremium && (
                              <Badge variant="warning">Premium</Badge>
                            )}
                          </div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {tool.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{tool.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {faqs && faqs.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="ml-8">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          )}

          {/* Internal Links Section */}
          <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-background rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Convert to and from {keyword.toUpperCase()}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our free online converters make it easy to work with {keyword.toUpperCase()} files. 
              Convert between formats instantly, no software required.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Convert TO SVG */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Convert to SVG
                </h3>
                <div className="space-y-2">
                  {['PNG', 'JPG', 'PDF', 'AI', 'EPS'].map((format) => (
                    <Link
                      key={format}
                      href={`/convert/${format.toLowerCase()}-to-svg`}
                      className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted transition-colors group"
                    >
                      <span className="font-medium">{format} to SVG</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Convert FROM SVG */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Convert from SVG
                </h3>
                <div className="space-y-2">
                  {['PNG', 'JPG', 'PDF', 'ICO', 'WebP'].map((format) => (
                    <Link
                      key={format}
                      href={`/convert/svg-to-${format.toLowerCase()}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted transition-colors group"
                    >
                      <span className="font-medium">SVG to {format}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/convert">
                  View All Converters
                  <Grid className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Related Pages */}
          {relatedPages && relatedPages.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPages.map((page, index) => (
                  <Link key={index} href={page.href} className="group">
                    <Card className="h-full hover:shadow-md transition-all hover:border-primary">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {page.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{page.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="text-center space-y-6 py-12 border-t">
            <h2 className="text-3xl font-bold">
              Ready to Create Amazing SVGs?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need to convert existing files or create new vector graphics from scratch, 
              our tools make it simple and fast.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/ai-icon-generator">
                  <Zap className="mr-2 h-5 w-5" />
                  Generate with AI
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                <Link href="/convert">
                  <Settings className="mr-2 h-5 w-5" />
                  Convert Files
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                <Link href="/animate">
                  <Layers className="mr-2 h-5 w-5" />
                  Animate SVGs
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}