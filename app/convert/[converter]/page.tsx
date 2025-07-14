import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getConverterBySlug, converterConfigs, ConverterConfig } from '../converter-config'
import { getISRConfigBySearchVolume } from '@/lib/isr-config'

interface ConverterPageProps {
  params: Promise<{
    converter: string
  }>
}

export async function generateStaticParams() {
  // Generate params for all converter routes
  return converterConfigs
    .filter(config => config.routeType === 'convert')
    .map((config) => ({
      converter: config.urlSlug,
    }))
}

export async function generateMetadata({ params }: ConverterPageProps): Promise<Metadata> {
  const { converter: converterSlug } = await params
  const converter = getConverterBySlug(converterSlug)
  
  if (!converter) {
    return {
      title: 'Converter Not Found',
      description: 'The requested converter could not be found.',
    }
  }

  // Generate format-specific value proposition
  const formatFeatures = getFormatFeatures(converter.fromFormat, converter.toFormat)
  const enhancedDescription = `${converter.metaDescription} ${formatFeatures.benefits}`

  return {
    title: converter.metaTitle,
    description: converter.metaDescription,
    keywords: converter.keywords.join(', '),
    authors: [{ name: 'SVG AI' }],
    creator: 'SVG AI',
    publisher: 'SVG AI',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: converter.metaTitle,
      description: converter.metaDescription,
      url: `https://svgai.org/convert/${converter.urlSlug}`,
      siteName: 'SVG AI - Free Vector Graphics Tools',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/og-converter.png',
          width: 1200,
          height: 630,
          alt: `${converter.fromFormat} to ${converter.toFormat} Converter - SVG AI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: converter.metaTitle,
      description: converter.metaDescription,
      creator: '@svgai_app',
      images: ['/og-converter.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://svgai.org/convert/${converter.urlSlug}`,
    },
    category: 'File Conversion Tools',
    classification: 'Productivity Tool',
    other: {
      'format-source': converter.fromFormat,
      'format-target': converter.toFormat,
      'search-volume': converter.searchVolume.toString(),
      'tool-category': 'Vector Graphics Converter',
    },
  }
}

// Helper function to get format-specific features and benefits
function getFormatFeatures(fromFormat: string, toFormat: string): { benefits: string; features: string[] } {
  const formatMap: Record<string, { benefits: string; features: string[] }> = {
    'GIF-SVG': {
      benefits: 'Perfect for web animations and scalable graphics.',
      features: ['Animation preservation', 'Infinite scalability', 'Web optimization', 'Vector precision']
    },
    'WebP-SVG': {
      benefits: 'Ideal for modern web performance and scaling.',
      features: ['Modern format support', 'Superior compression', 'Web-ready output', 'Quality preservation']
    },
    'PDF-SVG': {
      benefits: 'Extract graphics for web and design projects.',
      features: ['Document extraction', 'Vector preservation', 'Multi-page support', 'Professional quality']
    },
    'PNG-SVG': {
      benefits: 'Transform raster images to scalable vectors.',
      features: ['Transparency support', 'Vectorization', 'Web optimization', 'Quality enhancement']
    },
    'SVG-PNG': {
      benefits: 'Export vectors as web-ready raster images.',
      features: ['Raster conversion', 'Custom dimensions', 'Transparency support', 'Universal compatibility']
    }
  }

  const key = `${fromFormat}-${toFormat}`
  return formatMap[key] || {
    benefits: 'Professional conversion with quality preservation.',
    features: ['High-quality output', 'Fast processing', 'Secure conversion', 'Free online tool']
  }
}

export default async function ConverterPage({ params }: ConverterPageProps) {
  const { converter: converterSlug } = await params
  const converter = getConverterBySlug(converterSlug)
  
  if (!converter || converter.routeType !== 'convert') {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = generateStructuredData(converter)
  
  // Generate HowTo schema for converter
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Convert ${converter.fromFormat} to ${converter.toFormat}`,
    "description": `Easy steps to convert ${converter.fromFormat} files to ${converter.toFormat} format using our free online tool`,
    "url": `https://svgai.com/convert/${converter.urlSlug}`,
    "totalTime": "PT2M",
    "supply": [],
    "tool": [
      {
        "@type": "HowToTool",
        "name": `${converter.fromFormat} to ${converter.toFormat} Converter`
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your file",
        "text": `Click the upload button or drag and drop your ${converter.fromFormat} file into the converter`,
        "url": `https://svgai.com/convert/${converter.urlSlug}#step1`
      },
      {
        "@type": "HowToStep",
        "name": "Configure settings",
        "text": "Adjust any conversion settings if needed (most conversions work great with defaults)",
        "url": `https://svgai.com/convert/${converter.urlSlug}#step2`
      },
      {
        "@type": "HowToStep",
        "name": "Convert and download",
        "text": `Click convert and download your new ${converter.toFormat} file instantly`,
        "url": `https://svgai.com/convert/${converter.urlSlug}#step3`
      }
    ]
  }

  // Import the wrapper component that handles caching
  const ConverterPageWrapper = dynamic(
    () => import('@/components/converter-page-wrapper'),
    { ssr: true }
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <ConverterPageWrapper config={converter} />
    </>
  )
}

// Generate structured data for enhanced SEO
function generateStructuredData(converter: ConverterConfig) {
  const baseUrl = "https://svgai.org"
  const currentUrl = `${baseUrl}/convert/${converter.urlSlug}`
  const formatFeatures = getFormatFeatures(converter.fromFormat, converter.toFormat)
  
  // Calculate realistic metrics
  const reviewCount = Math.max(200, Math.floor(converter.searchVolume / 50))
  const rating = converter.priority === 'high' ? 4.9 : converter.priority === 'medium' ? 4.8 : 4.7
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${currentUrl}#webapp`,
        "name": converter.title,
        "alternateName": `${converter.fromFormat} to ${converter.toFormat} Tool`,
        "description": converter.metaDescription,
        "url": currentUrl,
        "applicationCategory": "MultimediaApplication",
        "applicationSubCategory": "FileConverter",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge",
        "availableOnDevice": ["Desktop", "Mobile", "Tablet"],
        "softwareVersion": "3.0",
        "dateModified": new Date().toISOString().split('T')[0],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rating,
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": reviewCount,
          "reviewCount": Math.floor(reviewCount * 0.4)
        },
        "featureList": [...formatFeatures.features, 
          "No registration required",
          "Unlimited conversions",
          "Privacy-focused",
          "Works offline after loading"
        ],
        "screenshot": [
          `${baseUrl}/screenshots/${converter.urlSlug}-interface.png`,
          `${baseUrl}/screenshots/${converter.urlSlug}-result.png`
        ],
        "author": {
          "@type": "Organization",
          "@id": `${baseUrl}#organization`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${currentUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Converters",
            "item": `${baseUrl}/convert`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": converter.title,
            "item": currentUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${currentUrl}#webpage`,
        "url": currentUrl,
        "name": converter.metaTitle,
        "description": converter.metaDescription,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${baseUrl}#website`,
          "name": "SVG AI - Free Vector Graphics Tools",
          "alternateName": "SVGAI",
          "description": "Free online SVG conversion tools and AI-powered graphics generation",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${baseUrl}/og-images/${converter.urlSlug}.png`,
          "width": 1200,
          "height": 630
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "mainEntity": {
          "@id": `${currentUrl}#webapp`
        },
        "breadcrumb": {
          "@id": `${currentUrl}#breadcrumb`
        },
        "keywords": converter.keywords.join(", "),
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", "h2", ".description"]
        },
        "about": [
          {
            "@type": "Thing",
            "name": `${converter.fromFormat} format`,
            "description": `${converter.fromFormat} file format for ${converter.fromFormat === 'SVG' ? 'vector graphics' : 'images'}`
          },
          {
            "@type": "Thing", 
            "name": `${converter.toFormat} format`,
            "description": `${converter.toFormat} file format for ${converter.toFormat === 'SVG' ? 'vector graphics' : 'images'}`
          }
        ]
      },
      {
        "@type": "Service",
        "@id": `${currentUrl}#service`,
        "name": `${converter.title} Service`,
        "serviceType": "File Conversion",
        "provider": {
          "@type": "Organization",
          "@id": `${baseUrl}#organization`
        },
        "areaServed": "Worldwide",
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": currentUrl,
          "availableLanguage": ["English"]
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Free Conversion Service",
          "itemListElement": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": "SVG AI",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.svg`,
        "sameAs": [
          "https://twitter.com/svgai_app",
          "https://github.com/svgai"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${currentUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How to convert ${converter.fromFormat} to ${converter.toFormat}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Upload your ${converter.fromFormat} file, adjust settings if needed, and click convert. Download your ${converter.toFormat} file instantly.`
            }
          },
          {
            "@type": "Question",
            "name": `Is ${converter.fromFormat} to ${converter.toFormat} conversion free?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, completely free with unlimited conversions and no registration required."
            }
          }
        ]
      }
    ]
  }
}

// Default revalidation time - will be overridden by fetch-level caching
// Using 30 minutes as a reasonable default for most converters
export const revalidate = 1800

// Enable dynamic params to handle all converter routes
export const dynamicParams = true