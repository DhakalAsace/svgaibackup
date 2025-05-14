import dynamic from 'next/dynamic'
import { Metadata } from 'next'

// Dynamically import all components
const HeroSection = dynamic(() => import("./hero-section"), {
  loading: () => <div className="py-12 bg-gradient-to-b from-[#FFF8F6] to-white"></div>
})

const SocialProof = dynamic(() => import("@/components/icon-generator/social-proof"), {
  loading: () => <div className="py-12 bg-white"></div>
})

const HowItWorks = dynamic(() => import("@/components/icon-generator/how-it-works"), {
  loading: () => <div className="py-12 bg-[#FAFAFA]"></div>
})

const IconFeatures = dynamic(() => import("@/components/icon-generator/features"), {
  loading: () => <div className="py-12 bg-gray-50"></div>
})

const IconExamples = dynamic(() => import("@/components/icon-generator/examples"), {
  loading: () => <div className="py-12 bg-gray-50"></div>
})

const IconUseCases = dynamic(() => import("@/components/icon-generator/use-cases"), {
  loading: () => <div className="py-12 bg-white"></div>
})

const IconFAQ = dynamic(() => import("@/components/icon-generator/faq"), {
  loading: () => <div className="py-12 bg-white"></div>
})

const FinalCTA = dynamic(() => import("@/components/icon-generator/final-cta"), {
  loading: () => <div className="py-12 bg-gradient-to-br from-[#FFF8F6] to-white"></div>
})

// Keywords based on content strategy research (Primary, Secondary, Free variations)
const iconPageKeywords = [
  'ai icon generator',
  'icon generator ai',
  'free ai icon generator',
  'ai icon generator free',
  'svg icon generator',
  'vector icon generator',
  'ai icon maker',
  'ai icon creator',
  'custom icons',
  'app icons ai',
  'professional icons',
  'ai vector icon generator',
  'free ai app icon generator',
  'ui icon generator'
];

export const metadata: Metadata = {
  // Meta Title (optimized based on keyword research)
  title: "AI Icon Generator: Create Free SVG Icons Instantly - SVG AI",
  
  // Meta Description (optimized to include keywords and value proposition)
  description: "Generate professional SVG icons in seconds with our free AI icon generator. No signup, unlimited downloads, perfect for apps, websites, and designs. Try now!",
  
  // Keywords (Include primary, secondary, and 'free' terms)
  keywords: iconPageKeywords,
  
  // Canonical URL using relative path (metadataBase is set in layout.tsx)
  alternates: {
    canonical: '/ai-icon-generator'
  },
  
  // Open Graph Tags (optimized for social sharing)
  openGraph: {
    title: 'AI Icon Generator: Create Free SVG Icons Instantly - SVG AI',
    description: 'Generate professional SVG icons in seconds with our free AI icon generator. No signup required!',
    url: '/ai-icon-generator',
    type: 'website',
    // siteName inherited from root layout
    images: [
      {
        url: '/og-image-icon-generator.png',
        width: 1200,
        height: 630,
        alt: 'SVGai.org AI Icon Generator Interface showing various icons'
      }
    ],
  },
  
  // Twitter Card (optimized for engagement)
  twitter: {
    card: 'summary_large_image',
    title: 'AI Icon Generator: Create Free SVG Icons Instantly - SVGai.org',
    description: 'Generate professional SVG icons in seconds with our free AI icon generator.',
    images: ['/og-image-icon-generator.png'],
  }
}

// Enable ISR with revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

export default function IconGeneratorPage() {
  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SVGai.org AI Icon Generator",
            "applicationCategory": "DesignApplication",
            "applicationSubCategory": "Icon Design",
            "operatingSystem": "WebPlatform, Online",
            "description": "Generate professional SVG icons in seconds with our free AI icon generator. No signup, unlimited downloads, perfect for apps, websites, and designs.",
            "url": "https://svgai.org/ai-icon-generator",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8", 
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "1250",
              "reviewCount": "756"
            },
            "keywords": iconPageKeywords.join(", "),
            "featureList": [
              "AI Icon Generation from Text Descriptions",
              "SVG Vector Output for Scaling without Quality Loss",
              "Free Usage with No Signup Required",
              "Multiple Icon Styles (Outline, Solid, Colored, Gradient)",
              "Customizable Aspect Ratios and Sizes",
              "Optimized for UI/UX Design, Apps, Websites",
              "Commercial Usage Rights Included",
              "Instant Download in High-Quality SVG Format"
            ],
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://svgai.org/",
              "name": "SVG AI"
            },
            "potentialAction": {
              "@type": "UseAction",
              "target": "https://svgai.org/ai-icon-generator"
            }
          })
        }}
      />
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <IconFeatures />
      <IconExamples />
      <IconUseCases />
      <IconFAQ />
      <FinalCTA />
    </main>
  );
}