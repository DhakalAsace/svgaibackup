"use client"

import { ReactNode, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { 
  PremiumToolsCTA, 
  TrustIndicators, 
  SecurityBadges, 
  TestimonialSlider,
  ProfessionalFeatureIcon,
  ProfessionalCTA
} from "@/components/converter-enhancements"
import { ConverterConfig } from "@/app/convert/converter-config"
import { generateConverterStructuredData } from "@/lib/seo/structured-data"
import { InternalLinksEnhanced } from "@/components/internal-links-enhanced"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { ConverterBreadcrumb, getConverterBreadcrumbs } from "@/components/ui/breadcrumb"
import { ConverterContentSections } from "@/components/converter-content-sections"
import { getRelatedConverters } from "@/lib/seo/related-content"

interface ConverterPageTemplateProps {
  // Meta information
  title: string
  description: string
  keywords: string[]
  converterConfig: ConverterConfig
  converterType: {
    from: string
    to: string
    fromFull: string
    toFull: string
  }
  
  // Hero section
  heroTitle: string
  heroSubtitle: string
  converterComponent: ReactNode
  
  // Features
  features?: Array<{
    title: string
    description: string
  }>
  
  // How it works
  howItWorksSteps?: Array<{
    title: string
    description: string
  }>
  
  // FAQ
  faqs?: Array<{
    question: string
    answer: string | ReactNode
  }>
  
  // Related converters
  relatedConverters?: Array<{
    title: string
    href: string
    description: string
  }>
  
  // Additional sections
  additionalSections?: ReactNode
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
    }
  }
  
  return benefits[fromFormat.toLowerCase()]?.[toFormat.toLowerCase()] || "Enhanced format compatibility"
}

// Helper function to add contextual links to text content
function enhanceTextWithLinks(text: string | ReactNode, converterConfig: ConverterConfig): ReactNode {
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
  let result: ReactNode[] = [text]
  
  linkPatterns.forEach(({ pattern, replacement }) => {
    result = result.flatMap((item, index) => {
      if (typeof item !== 'string') return [item]
      
      const parts = item.split(pattern)
      if (parts.length === 1) return [item]
      
      const enhanced: ReactNode[] = []
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

export default function ConverterPageTemplate({
  title,
  description,
  keywords,
  converterConfig,
  converterType,
  heroTitle,
  heroSubtitle,
  converterComponent,
  features = generateDynamicFeatures(converterType),
  howItWorksSteps = defaultHowItWorksSteps,
  faqs = generateDynamicFAQs(converterType, converterConfig),
  relatedConverters,
  additionalSections
}: ConverterPageTemplateProps) {
  
  // Generate related converters if not provided
  const finalRelatedConverters = relatedConverters || getRelatedConverters(converterConfig, 6).map(item => ({
    title: item.title,
    href: item.url,
    description: item.description
  }))
  
  // Inject structured data into page head
  useEffect(() => {
    const currentUrl = `https://svgai.org/convert/${converterConfig.urlSlug}`
    
    const structuredData = generateConverterStructuredData({
      converterConfig,
      howItWorksSteps,
      faqs,
      currentUrl
    })
    
    // Create and inject structured data scripts
    const schemas = [
      structuredData.softwareApplicationSchema,
      structuredData.howToSchema,
      structuredData.faqSchema,
      structuredData.webPageSchema
    ]
    
    const scripts: HTMLScriptElement[] = []
    
    schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      script.id = `structured-data-${converterConfig.id}-${index}`
      document.head.appendChild(script)
      scripts.push(script)
    })
    
    // Cleanup function to remove scripts when component unmounts
    return () => {
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })
    }
  }, [converterConfig, howItWorksSteps, faqs])
  
  // Generate breadcrumb items
  const breadcrumbItems = getConverterBreadcrumbs(
    converterType.fromFull,
    converterType.toFull,
    converterType.fromFull + " to " + converterType.toFull + " Converter"
  )
  
  return (
    <main className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <ConverterBreadcrumb items={breadcrumbItems} />
        </div>
      </section>
      
      {/* Enhanced Hero Section with Value Proposition */}
      <section className="py-16 bg-gradient-to-br from-[#FFF8F6] via-white to-[#F3E5F5]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Value Proposition Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-full font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              #1 Free {converterType.fromFull} to {converterType.toFull} Converter
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#4E342E] mb-6 leading-tight">
              {heroTitle}
            </h1>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              {heroSubtitle}
            </p>
            
            {/* Key Value Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mr-3">⚡</div>
                <div className="text-left">
                  <div className="font-semibold text-[#4E342E]">Lightning Fast</div>
                  <div className="text-sm text-gray-600">Convert in seconds</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mr-3">🔒</div>
                <div className="text-left">
                  <div className="font-semibold text-[#4E342E]">100% Secure</div>
                  <div className="text-sm text-gray-600">Files stay private</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mr-3">🆓</div>
                <div className="text-left">
                  <div className="font-semibold text-[#4E342E]">Always Free</div>
                  <div className="text-sm text-gray-600">No limits, no signup</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Converter Tool Component */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {converterComponent}
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Trusted by 50,000+ users worldwide</p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                No registration
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                No watermarks
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                Commercial use
              </div>
            </div>
          </div>
          
          {/* Inline Premium CTA - High Engagement Moment */}
          <div className="max-w-4xl mx-auto mt-12">
            <PremiumToolsCTA 
              converterType={converterType}
              placement="inline"
              variant="upgrade"
            />
          </div>
        </div>
      </section>
      
      {/* Key Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#4E342E]">
              Why Choose Our {converterType.fromFull} to {converterType.toFull} Converter?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade conversion trusted by designers, developers, and businesses worldwide
            </p>
          </div>
          
          {/* Primary Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {features.slice(0, 6).map((feature, index) => {
              const icons = ['🚀', '🔒', '⚡', '🎯', '📁', '🌐']
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">{icons[index] || '✨'}</div>
                  <h3 className="text-xl font-semibold text-[#4E342E] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{enhanceTextWithLinks(feature.description, converterConfig)}</p>
                </div>
              )
            })}
          </div>
          
          {/* Format Comparison Section */}
          <div className="bg-gradient-to-br from-[#FFF8F6] to-gray-50 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-[#4E342E]">
              {converterType.fromFull} vs {converterType.toFull} Comparison
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Source Format */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">📄</div>
                  <h4 className="text-xl font-semibold text-[#4E342E]">{converterType.fromFull} Format</h4>
                </div>
                <div className="space-y-3">
                  {getFormatDetails(converterType.from).map((detail, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Target Format */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">🎨</div>
                  <h4 className="text-xl font-semibold text-[#4E342E]">{converterType.toFull} Format</h4>
                </div>
                <div className="space-y-3">
                  {getFormatDetails(converterType.to).map((detail, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Conversion Benefits */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-full font-semibold">
                <span className="mr-2">Convert to unlock:</span>
                <span>{getConversionBenefits(converterType.from, converterType.to)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Enhanced */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#4E342E]">
              How to Convert {converterType.from.toUpperCase()} to {converterType.to.toUpperCase()}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your files in three simple steps with our professional-grade converter
            </p>
          </div>
          
          {/* Steps with connecting arrows */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div id={`step-${index + 1}`} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF7043] to-[#FFA726] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                      <span className="text-3xl font-bold text-white">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[#4E342E]">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Connecting arrow (hidden on mobile) */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 z-0">
                      <ArrowRight className="w-8 h-8 text-[#FF7043] opacity-60" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Technical Details Callout */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#4E342E] mb-4">
                🔧 Technical Excellence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-[#4E342E] mb-2">Processing Speed</div>
                  <div className="text-gray-600">Under 5 seconds</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-[#4E342E] mb-2">File Size Limit</div>
                  <div className="text-gray-600">Up to 100MB</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-[#4E342E] mb-2">Quality Retention</div>
                  <div className="text-gray-600">100% Lossless</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="py-4 px-10 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all transform hover:scale-105"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start Converting Now
            </Button>
            
            <div className="text-sm text-gray-500 flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              No registration required
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Content Sections - Industry Applications, Technical Details, Best Practices */}
      <ConverterContentSections config={converterConfig} converterType={converterType} />
      
      {/* Additional Custom Sections */}
      {additionalSections}
      
      {/* Premium Tools CTA Section - Consideration Phase */}
      <PremiumToolsCTA 
        converterType={converterType}
        placement="section"
        variant="explore"
      />
      
      {/* FAQ Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#4E342E]">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert answers to common questions about {converterType.fromFull} to {converterType.toFull} conversion
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Categories */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#FFF8F6] to-gray-50 rounded-xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-[#4E342E] mb-4">Quick Topics</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mr-3"></div>
                    Conversion Process
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                    File Quality & Size
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                    Usage & Licensing
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-3"></div>
                    Technical Details
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="font-semibold text-[#4E342E] mb-2">Need More Help?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Can't find what you're looking for?
                    </p>
                    <Link 
                      href="/learn/svg-file-format"
                      className="text-sm text-[#FF7043] hover:underline font-medium"
                    >
                      Explore our learning center →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${index}`} className="border-none">
                        <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:bg-gray-100 transition-colors">
                          <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-[#FF7043] text-white text-sm font-bold flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-lg font-semibold text-[#4E342E] pr-4">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="ml-10 text-gray-700 leading-relaxed">
                            {enhanceTextWithLinks(faq.answer, converterConfig)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
              
              {/* Bottom CTA in FAQ */}
              <div className="mt-12 text-center p-8 bg-gradient-to-r from-[#FFF8F6] to-white rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-[#4E342E] mb-4">
                  Ready to Convert Your Files?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of users who trust our converter for professional results
                </p>
                <Button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="py-3 px-8 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Try Converter Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Internal Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4 text-[#4E342E]">
                Related Tools & Resources
              </h2>
              <p className="text-gray-600 mb-8">
                Explore our comprehensive suite of conversion tools, learning resources, and free SVG collections
              </p>
              
              {/* Legacy related converters as cards if provided */}
              {finalRelatedConverters.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-[#4E342E]">Quick Access</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {finalRelatedConverters.slice(0, 4).map((converter, index) => (
                      <Link 
                        key={index}
                        href={converter.href}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-[#4E342E] mb-1 flex items-center">
                          {converter.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </h4>
                        <p className="text-sm text-gray-600">{converter.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <InternalLinksEnhanced 
                pageType="converter"
                config={converterConfig}
                currentPath={`/convert/${converterConfig.urlSlug}`}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#FFF8F6] to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#4E342E] mb-4">
            Ready for More Advanced Tools?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of designers who've upgraded from conversion to AI creation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="outline"
              className="py-3 px-8 border-[#FF7043] text-[#FF7043] hover:bg-[#FFF0E6] font-semibold text-lg rounded-lg transition-all"
            >
              Use Free Converter
            </Button>
            
            <Link 
              href="/"
              onClick={() => {
                if (typeof window !== 'undefined' && converterType) {
                  const { trackPremiumCTA, trackPremiumConversionFunnel } = require('@/lib/conversion-tracking')
                  trackPremiumCTA({
                    converterType: `${converterType.from.toLowerCase()}-to-${converterType.to.toLowerCase()}`,
                    ctaPlacement: 'final',
                    ctaVariant: 'upgrade',
                    targetTool: 'ai-generator',
                    action: 'click'
                  })
                  trackPremiumConversionFunnel(
                    'cta_clicked',
                    `${converterType.from.toLowerCase()}-to-${converterType.to.toLowerCase()}`,
                    'ai-generator'
                  )
                }
              }}
            >
              <Button className="py-3 px-8 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all">
                <Sparkles className="mr-2 h-5 w-5" />
                Try AI Generator
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            ✓ Create custom designs instantly ✓ No conversion needed ✓ Professional results
          </p>
        </div>
      </section>
    </main>
  )
}

// Helper functions for format comparison
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


// Enhanced feature content generation based on converter type
function generateDynamicFeatures(converterType: { from: string; to: string }): Array<{ title: string; description: string }> {
  const baseFeatures = [
    {
      title: "100% Free & Unlimited",
      description: "No signup required, no file limits, completely free to use for personal and commercial projects. Convert as many ${converterType.from.toUpperCase()} files to ${converterType.to.toUpperCase()} as you need without any restrictions or hidden costs."
    },
    {
      title: "Client-Side Processing",
      description: "Your files never leave your device - all ${converterType.from} to ${converterType.to} conversion happens locally in your browser. This ensures maximum privacy, security, and compliance with data protection regulations."
    },
    {
      title: "Professional-Grade Quality",
      description: `Our advanced algorithms ensure optimal conversion from ${converterType.from.toUpperCase()} to ${converterType.to.toUpperCase()}, preserving ${getQualityAspect(converterType.from, converterType.to)} while maintaining the best possible output quality.`
    },
    {
      title: "Lightning Fast Performance",
      description: `Convert ${converterType.from.toUpperCase()} files to ${converterType.to.toUpperCase()} instantly with our optimized conversion engine. No waiting for uploads or server processing - get your converted files in seconds.`
    },
    {
      title: "Smart Batch Processing",
      description: `Save hours by converting multiple ${converterType.from.toUpperCase()} files to ${converterType.to.toUpperCase()} simultaneously. Perfect for large projects, design systems, or bulk asset management.`
    },
    {
      title: "Universal Compatibility",
      description: `Works seamlessly on any device with a modern web browser. Whether you're using Windows, Mac, Linux, iOS, or Android, our ${converterType.from} to ${converterType.to} converter delivers consistent results.`
    }
  ]
  
  // Add format-specific features
  const specificFeatures = getFormatSpecificFeatures(converterType.from, converterType.to)
  return [...baseFeatures, ...specificFeatures]
}

// Get quality aspect preserved during conversion
function getQualityAspect(from: string, to: string): string {
  const qualityMap: Record<string, Record<string, string>> = {
    png: {
      svg: "transparency and sharp edges",
      jpg: "image quality and color accuracy",
      pdf: "resolution and print quality"
    },
    svg: {
      png: "scalability at chosen resolution",
      jpg: "vector precision in raster format",
      pdf: "vector data and editability"
    },
    jpg: {
      svg: "main shapes and color regions",
      png: "full image data with added transparency",
      pdf: "image quality for documents"
    }
  }
  return qualityMap[from.toLowerCase()]?.[to.toLowerCase()] || "maximum quality"
}

// Get format-specific features
function getFormatSpecificFeatures(from: string, to: string): Array<{ title: string; description: string }> {
  const key = `${from.toLowerCase()}-to-${to.toLowerCase()}`
  const specificFeatures: Record<string, Array<{ title: string; description: string }>> = {
    'png-to-svg': [
      {
        title: "Advanced Vectorization Technology",
        description: "Powered by state-of-the-art tracing algorithms that intelligently convert raster pixels to smooth vector paths, perfect for logos and icons."
      },
      {
        title: "Transparency Preservation",
        description: "PNG alpha channel is fully preserved in SVG format, maintaining transparent backgrounds for seamless integration."
      }
    ],
    'svg-to-png': [
      {
        title: "Resolution Control",
        description: "Export SVG to PNG at any resolution - from small thumbnails to high-DPI retina displays and print-quality images."
      },
      {
        title: "Anti-Aliasing Options",
        description: "Advanced rendering with customizable anti-aliasing ensures smooth edges and professional appearance."
      }
    ],
    'jpg-to-svg': [
      {
        title: "Intelligent Edge Detection",
        description: "Sophisticated algorithms identify and trace edges in photographic content, creating artistic vector interpretations."
      },
      {
        title: "Color Quantization Control",
        description: "Fine-tune color palette reduction for optimal balance between file size and visual fidelity."
      }
    ]
  }
  
  return specificFeatures[key] || [
    {
      title: "Format Optimization",
      description: `Specialized algorithms ensure optimal conversion from ${from.toUpperCase()} to ${to.toUpperCase()} with minimal quality loss.`
    },
    {
      title: "Metadata Preservation",
      description: "Important file metadata is preserved during conversion when applicable, maintaining copyright and other embedded information."
    }
  ]
}

// Default content for features
const defaultFeatures = generateDynamicFeatures({ from: 'PNG', to: 'SVG' })

// Default how it works steps
const defaultHowItWorksSteps = [
  {
    title: "Upload Your File",
    description: "Drag and drop or click to select your file. All processing happens locally in your browser."
  },
  {
    title: "Automatic Conversion",
    description: "Our tool instantly converts your file using advanced algorithms for optimal quality."
  },
  {
    title: "Download Result",
    description: "Get your converted file immediately. Use it anywhere with no restrictions."
  }
]

// Enhanced FAQ generation with format-specific questions
function generateDynamicFAQs(converterType: { from: string; to: string }, converterConfig: ConverterConfig): Array<{ question: string; answer: string | ReactNode }> {
  const baseFAQs = [
    {
      question: `Is this ${converterType.from} to ${converterType.to} converter really free?`,
      answer: `Yes, our ${converterType.from} to ${converterType.to} converter is 100% free with no hidden costs, signup requirements, or usage limits. You can convert as many files as you need without any restrictions. We believe in providing professional-grade tools accessible to everyone.`
    },
    {
      question: `Are my ${converterType.from} files secure during conversion?`,
      answer: `Absolutely. All ${converterType.from} to ${converterType.to} conversion happens directly in your browser using client-side JavaScript. Your files never leave your device or get uploaded to any server. This ensures complete privacy, security, and compliance with data protection regulations like GDPR.`
    },
    {
      question: `What's the maximum file size for ${converterType.from} to ${converterType.to} conversion?`,
      answer: `Our converter can handle ${converterType.from} files up to 100MB. This covers the vast majority of use cases including high-resolution images and complex graphics. For larger files, we recommend using desktop software or splitting the file into smaller parts.`
    },
    {
      question: `Can I use the converted ${converterType.to} files commercially?`,
      answer: `Yes, you retain full rights to your converted files. The conversion process doesn't add any watermarks or restrictions. Use your ${converterType.to} files in any personal or commercial project, including client work, products for sale, or business materials.`
    },
    {
      question: `Do I need to install software to convert ${converterType.from} to ${converterType.to}?`,
      answer: `No installation required. Our converter works entirely in your web browser on any device with internet access. It's compatible with Chrome, Firefox, Safari, Edge, and other modern browsers. Simply visit our site and start converting immediately.`
    }
  ]
  
  // Add format-specific FAQs
  const specificFAQs = getFormatSpecificFAQs(converterType.from, converterType.to)
  
  // Combine and enhance with internal links
  return [...baseFAQs, ...specificFAQs].map(faq => ({
    ...faq,
    answer: enhanceTextWithLinks(faq.answer, converterConfig)
  }))
}

// Get format-specific FAQs
function getFormatSpecificFAQs(from: string, to: string): Array<{ question: string; answer: string }> {
  const key = `${from.toLowerCase()}-to-${to.toLowerCase()}`
  const specificFAQs: Record<string, Array<{ question: string; answer: string }>> = {
    'png-to-svg': [
      {
        question: "What types of PNG images convert best to SVG?",
        answer: "Simple graphics with solid colors and clear edges convert best to SVG format. This includes logos, icons, simple illustrations, and text-based designs. Images with few colors (2-16) and geometric shapes produce the cleanest conversions. Complex photographs may not produce satisfactory results."
      },
      {
        question: "Will PNG transparency be preserved in SVG?",
        answer: "Yes, PNG transparency (alpha channel) is fully preserved during conversion to SVG. Transparent areas in your PNG will remain transparent in the SVG output. This is particularly useful for logos and icons that need to work on various backgrounds."
      },
      {
        question: "How accurate is the PNG to SVG conversion?",
        answer: "Conversion accuracy depends on image complexity. Simple graphics with clear edges convert with near-perfect accuracy. Complex images are simplified during vectorization, which may result in stylized interpretations rather than exact replicas. Adjust threshold and color settings for best results."
      }
    ],
    'svg-to-png': [
      {
        question: "What resolution should I choose for SVG to PNG conversion?",
        answer: "Choose resolution based on intended use: 72-96 DPI for web graphics, 150-300 DPI for print materials, and 300+ DPI for high-quality prints. For responsive web design, consider creating multiple resolutions. Our converter allows custom width/height settings for precise control."
      },
      {
        question: "Can I convert animated SVG to PNG?",
        answer: "Our converter captures the static state of SVG files. For animated SVGs, it will convert the initial frame to PNG. To capture specific animation states, you'll need to pause the animation at the desired frame before conversion."
      },
      {
        question: "Will SVG text be rendered correctly in PNG?",
        answer: "Yes, all SVG text elements are rendered accurately in the PNG output. The converter handles all fonts, including web fonts and system fonts. Text remains sharp and readable at the chosen resolution."
      }
    ],
    'jpg-to-svg': [
      {
        question: "Can I convert photographic JPGs to SVG?",
        answer: "While technically possible, converting photographs to SVG rarely produces ideal results. Photos contain complex gradients and details that result in very large SVG files. This converter works best for JPGs containing logos, simple graphics, or images that can be stylized into vector art."
      },
      {
        question: "How does JPG compression affect SVG conversion?",
        answer: "JPG compression artifacts can impact conversion quality. Higher quality JPGs (less compression) produce better SVG results. Visible compression blocks or artifacts may appear as unwanted elements in the vector output. Use the highest quality source JPG available."
      },
      {
        question: "What color settings work best for JPG to SVG?",
        answer: "For logos and simple graphics, limit colors to 2-16 for clean results. For artistic conversions of photos, 32-64 colors can create interesting poster effects. The posterize option helps reduce gradients to distinct color regions suitable for vector conversion."
      }
    ]
  }
  
  return specificFAQs[key] || [
    {
      question: `Why convert from ${from.toUpperCase()} to ${to.toUpperCase()}?`,
      answer: `Converting from ${from.toUpperCase()} to ${to.toUpperCase()} provides specific advantages: ${getConversionBenefits(from, to)}. This makes it ideal for projects requiring these particular characteristics.`
    },
    {
      question: `What's the quality difference between ${from.toUpperCase()} and ${to.toUpperCase()}?`,
      answer: `${from.toUpperCase()} and ${to.toUpperCase()} serve different purposes. ${getFormatComparison(from, to)} Choose based on your specific requirements for quality, file size, and compatibility.`
    },
    {
      question: `How long does ${from.toUpperCase()} to ${to.toUpperCase()} conversion take?`,
      answer: `Conversion is typically instant for files under 10MB, taking just 1-3 seconds. Larger files may take 5-10 seconds depending on complexity and your device performance. All processing happens locally, so conversion speed depends on your computer rather than internet connection.`
    }
  ]
}

// Get format comparison text
function getFormatComparison(from: string, to: string): string {
  const comparisons: Record<string, string> = {
    'png-svg': 'PNG offers pixel-perfect raster images while SVG provides infinite scalability. PNG is better for photographs, SVG excels at logos and icons.',
    'svg-png': 'SVG offers scalability and small file sizes for simple graphics, while PNG provides universal compatibility and is better for complex images.',
    'jpg-svg': 'JPG uses lossy compression for photos, while SVG uses mathematical descriptions for shapes. JPG is ideal for photographs, SVG for graphics.',
    'svg-jpg': 'SVG maintains perfect quality at any size, while JPG offers efficient compression for photographic content.',
    'pdf-svg': 'PDF is a document format supporting multiple pages and mixed content, while SVG focuses on single vector graphics with web compatibility.',
    'svg-pdf': 'SVG is designed for web graphics with CSS/JS integration, while PDF is optimized for document distribution and printing.'
  }
  const key = `${from.toLowerCase()}-${to.toLowerCase()}`
  return comparisons[key] || `Each format has unique strengths: ${from.toUpperCase()} excels in certain scenarios while ${to.toUpperCase()} is optimized for different use cases.`
}

// Default FAQs (using dummy config)
const dummyConfig: ConverterConfig = {
  id: 'png-to-svg',
  urlSlug: 'png-to-svg',
  fromFormat: 'PNG',
  toFormat: 'SVG',
  title: 'PNG to SVG Converter',
  metaTitle: 'PNG to SVG Converter',
  metaDescription: 'Convert PNG to SVG',
  keywords: [],
  searchVolume: 0,
  priority: 'high',
  routeType: 'convert',
  isSupported: true
}
const defaultFAQs = generateDynamicFAQs({ from: 'PNG', to: 'SVG' }, dummyConfig)