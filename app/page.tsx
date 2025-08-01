import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { LazyLoadWrapper } from '@/components/lazy-load-wrapper'

// Import optimized Hero with full design - keep static for SEO
import Hero from "@/components/hero-optimized"

// Lazy load all non-critical components without loading indicators to prevent layout shift
const Features = dynamic(() => import("@/components/features"), {
  loading: () => null
})

const UseCases = dynamic(() => import("@/components/use-cases"), {
  loading: () => null
})

const HowItWorks = dynamic(() => import("@/components/how-it-works"), {
  loading: () => null
})

const Faq = dynamic(() => import("@/components/faq"), {
  loading: () => null
})

const Pricing = dynamic(() => import("@/components/pricing"), {
  loading: () => null
})

// Removed SVG examples to improve performance

// Define keywords for better organization and reuse
const homeKeywords = [
  'text to svg ai',
  'ai svg generator',
  'svg generator ai',
  'ai generate svg',
  'vector graphics creator',
  'ai svg icon generator', 
  'ai svg logo generator',
  'ai svg generator free',
];

export const metadata: Metadata = {
  // Title now uses the title template from layout
  title: "AI SVG Generator: Create SVGs Instantly with AI",
  description: "Instantly convert text to SVG with our powerful AI SVG generator. Create stunning AI-generated logos, icons, and vector illustrations effortlessly. Free trial available.",
  keywords: homeKeywords,
  
  // Add canonical URL
  alternates: {
    canonical: '/',
  },
  
  // Open Graph data for social sharing
  openGraph: {
    title: "AI SVG Generator: Create SVGs Instantly with AI",
    description: "Instantly convert text to SVG with our powerful AI SVG generator. Create stunning AI-generated logos, icons, and vector illustrations effortlessly.",
    url: '/',
    images: [
      {
        url: '/og-home.jpg', // Need to ensure this image exists
        width: 1200,
        height: 630,
        alt: 'AI SVG Generator by SVG AI',
      }
    ],
  },
  
  // Twitter card
  twitter: {
    title: "AI SVG Generator: Create SVGs Instantly with AI",
    description: "Instantly convert text to SVG with our powerful AI SVG generator. Free for everyone.",
    images: ['/og-home.jpg'],
  }
}

// Enable ISR with revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

export default function Home() {
  return (
    <main>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI SVG Generator",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "246"
            },
            "description": "Transform text prompts into beautiful SVG vector graphics with our AI-powered tool."
          })
        }}
      />
      
      {/* Prioritize the Hero section for faster LCP */}
      <Hero />
      
      {/* Removed SVG examples section to improve performance */}
      
      <LazyLoadWrapper delay={200}>
        <UseCases />
      </LazyLoadWrapper>
      
      <LazyLoadWrapper delay={300}>
        <Features />
      </LazyLoadWrapper>
      
      <LazyLoadWrapper delay={400}>
        <HowItWorks />
      </LazyLoadWrapper>
      
      <LazyLoadWrapper delay={500}>
        <Pricing />
      </LazyLoadWrapper>
      
      <LazyLoadWrapper delay={600}>
        <Faq />
      </LazyLoadWrapper>
    </main>
  );
}
