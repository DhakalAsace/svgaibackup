"use client"

import { Suspense, lazy } from "react"
import { LazyLoad } from "@/components/ui/lazy-load"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ConverterSkeleton, 
  CardSkeleton
} from "@/components/ui/loading"
import { ErrorBoundary, DefaultErrorFallback } from "@/components/ui/error-boundary"
import { getRelatedConverters } from "@/lib/seo/related-content"
import { ConverterConfig } from "@/app/convert/converter-config"

// Lazy load heavy sections
const FAQSection = lazy(() => import("./converter-sections/faq-section"))
const RelatedConverters = lazy(() => import("./converter-sections/related-converters"))
const TechnicalDetails = lazy(() => import("./converter-sections/technical-details"))

interface ConverterPageTemplateWithLoadingProps {
  // Same props as original ConverterPageTemplate
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
  heroTitle: string
  heroSubtitle: string
  converterComponent: React.ReactNode
  features?: Array<{
    title: string
    description: string
  }>
  howItWorksSteps?: Array<{
    title: string
    description: string
  }>
  faqs?: Array<{
    question: string
    answer: string | React.ReactNode
  }>
  relatedConverters?: Array<{
    title: string
    href: string
    description: string
  }>
  additionalSections?: React.ReactNode
}

export default function ConverterPageTemplateWithLoading(props: ConverterPageTemplateWithLoadingProps) {
  // Generate related converters if not provided
  const finalRelatedConverters = props.relatedConverters || getRelatedConverters(props.converterConfig, 6).map(item => ({
    title: item.title,
    href: item.url,
    description: item.description
  }))
  
  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      <main className="min-h-screen">
        {/* Hero Section with Converter Tool */}
        <section className="py-12 bg-gradient-to-b from-[#FFF8F6] to-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#4E342E] mb-4">
                {props.heroTitle}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {props.heroSubtitle}
              </p>
            </div>
            
            {/* Converter Tool Component with Loading */}
            <div className="max-w-4xl mx-auto">
              <Suspense fallback={<ConverterSkeleton />}>
                {props.converterComponent}
              </Suspense>
            </div>
          </div>
        </section>
        
        {/* Features Section - Always visible for SEO */}
        {props.features && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Why Use Our {props.converterType.fromFull} to {props.converterType.toFull} Converter?
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Professional-grade conversion with advanced features for designers and developers
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {props.features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* How It Works Section */}
        {props.howItWorksSteps && (
          <HowItWorksSection 
            steps={props.howItWorksSteps}
            converterType={props.converterType}
          />
        )}
        
        {/* Additional Custom Sections */}
        {props.additionalSections}
        
        {/* Lazy loaded sections */}
        <LazyLoad
          fallback={<FAQSectionSkeleton />}
          rootMargin="200px"
        >
          <Suspense fallback={<FAQSectionSkeleton />}>
            {props.faqs && (
              <FAQSection
                faqs={props.faqs.map(faq => ({
                  question: faq.question,
                  answer: typeof faq.answer === 'string' ? faq.answer : ''
                }))}
                fromFormat={props.converterType.from}
                toFormat={props.converterType.to}
              />
            )}
          </Suspense>
        </LazyLoad>
        
        <LazyLoad
          fallback={<RelatedConvertersSkeleton />}
          rootMargin="200px"
        >
          <Suspense fallback={<RelatedConvertersSkeleton />}>
            {finalRelatedConverters && finalRelatedConverters.length > 0 && (
              <RelatedConverters relatedTools={finalRelatedConverters} />
            )}
          </Suspense>
        </LazyLoad>
        
        {/* Final CTA Section */}
        <FinalCTASection converterType={props.converterType} />
      </main>
    </ErrorBoundary>
  )
}

// Sub-components with optimized loading
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <LazyLoad
      fallback={<CardSkeleton />}
      threshold={0.1}
    >
      <div className="flex animate-in fade-in slide-in-from-bottom duration-500" 
           style={{ animationDelay: `${index * 100}ms` }}>
        <div className="flex-shrink-0 mr-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
            <Check className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      </div>
    </LazyLoad>
  )
}

function HowItWorksSection({ steps, converterType }: any) {
  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
          How to Convert {converterType.from.toUpperCase()} to {converterType.to.toUpperCase()}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Convert your files in three simple steps with our free online tool
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step: any, index: number) => (
            <LazyLoad key={index} fallback={<Skeleton className="h-48" />}>
              <StepCard step={step} index={index} />
            </LazyLoad>
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, index }: { step: any; index: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center animate-in fade-in slide-in-from-bottom duration-500"
         style={{ animationDelay: `${index * 150}ms` }}>
      <div className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mb-4 mx-auto">
        <span className="text-2xl font-bold text-[#FF7043]">{index + 1}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">{step.title}</h3>
      <p className="text-gray-600">{step.description}</p>
    </div>
  )
}

function FinalCTASection({ converterType }: any) {
  return (
    <section className="py-16 bg-gradient-to-br from-[#FFF8F6] to-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-[#4E342E] mb-4">
          Start Converting {converterType.from.toUpperCase()} to {converterType.to.toUpperCase()} Now
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of designers and developers who use our free converter tools daily
        </p>
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="py-4 px-10 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all"
        >
          <Sparkles className="mr-2 h-6 w-6" />
          Try Free Converter
        </Button>
      </div>
    </section>
  )
}

// Loading skeletons for lazy loaded sections
function FAQSectionSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <Skeleton className="h-10 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-12" />
        <div className="max-w-3xl mx-auto space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedConvertersSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <Skeleton className="h-10 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

// Required imports
import { Button } from "@/components/ui/button"
import { Sparkles, Check } from "lucide-react"