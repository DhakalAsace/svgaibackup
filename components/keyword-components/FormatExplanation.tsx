"use client"

import React from 'react'
import Link from 'next/link'
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
  ArrowRight
} from 'lucide-react'

interface TechnicalSpec {
  property: string
  value: string
  description?: string
}

interface UseCase {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
}

interface ProsCons {
  pros: string[]
  cons: string[]
}

interface BrowserSupport {
  browser: string
  version: string
  support: 'full' | 'partial' | 'none'
}

interface RelatedFormat {
  name: string
  description: string
  href: string
}

export interface FormatExplanationProps {
  // Basic information
  formatName: string
  fullName: string
  description: string
  introduction: string
  
  // Technical specifications
  technicalSpecs: TechnicalSpec[]
  
  // Use cases
  useCases: UseCase[]
  
  // Pros and cons
  prosAndCons: ProsCons
  
  // File structure example
  fileStructureExample?: string
  fileStructureDescription?: string
  
  // Browser compatibility
  browserCompatibility: BrowserSupport[]
  
  // Related formats
  relatedFormats: RelatedFormat[]
  
  // Schema markup data
  schemaData?: {
    searchVolume?: number
    lastUpdated?: string
  }
  
  // Related converters (internal links)
  relatedConverters?: Array<{
    title: string
    href: string
    fromFormat: string
    toFormat: string
  }>
}

export default function FormatExplanation({
  formatName,
  fullName,
  description,
  introduction,
  technicalSpecs,
  useCases,
  prosAndCons,
  fileStructureExample,
  fileStructureDescription,
  browserCompatibility,
  relatedFormats,
  schemaData,
  relatedConverters
}: FormatExplanationProps) {
  // Generate schema markup
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${formatName} Format: ${fullName}`,
    "description": description,
    "dateModified": schemaData?.lastUpdated || new Date().toISOString(),
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
      "@id": `https://svgai.org/learn/${formatName.toLowerCase()}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <article className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          {schemaData?.searchVolume && (
            <Badge variant="secondary" className="mb-4">
              Popular Topic
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold">
            Understanding {formatName} Format
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {fullName} - {description}
          </p>
        </section>

        {/* Introduction */}
        <section className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">{introduction}</p>
        </section>

        {/* Technical Specifications */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Technical Specifications</h2>
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
                  {technicalSpecs.map((spec, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <code className="text-sm">{spec.property}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{spec.value}</Badge>
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
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon || FileText
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Pros and Cons */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Advantages & Limitations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prosAndCons.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <XCircle className="w-5 h-5" />
                  Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prosAndCons.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* File Structure */}
        {fileStructureExample && (
          <section>
            <h2 className="text-3xl font-bold mb-6">File Structure</h2>
            <Tabs defaultValue="example" className="w-full">
              <TabsList>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>
              <TabsContent value="example">
                <Card>
                  <CardContent className="p-6">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{fileStructureExample}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="explanation">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p>{fileStructureDescription || "This format follows a structured approach to organize data efficiently."}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        )}

        {/* Browser Compatibility */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Browser Compatibility</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Browser</TableHead>
                    <TableHead>Minimum Version</TableHead>
                    <TableHead>Support Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {browserCompatibility.map((browser, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{browser.browser}</TableCell>
                      <TableCell>{browser.version}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            browser.support === 'full' ? 'default' : 
                            browser.support === 'partial' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {browser.support === 'full' ? 'Full Support' :
                           browser.support === 'partial' ? 'Partial Support' :
                           'Not Supported'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              For the best experience, we recommend using the latest version of modern browsers.
            </AlertDescription>
          </Alert>
        </section>

        {/* Related Formats */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Related File Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedFormats.map((format, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    <Link 
                      href={format.href}
                      className="hover:text-primary transition-colors"
                    >
                      {format.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Converters */}
        {relatedConverters && relatedConverters.length > 0 && (
          <section className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Convert {formatName} Files
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Need to convert {formatName} files? Try our free online converters for instant results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {relatedConverters.map((converter, index) => (
                <Link
                  key={index}
                  href={converter.href}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all hover:border-primary">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {converter.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Convert {converter.fromFormat} to {converter.toFormat}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/convert">
                  View All Converters
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">
            Ready to Work with {formatName} Files?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you need to convert, create, or edit {formatName} files, our tools make it easy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/convert">
                Free Converters
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/ai-icon-generator">
                AI SVG Generator
                <Package className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </article>
    </>
  )
}