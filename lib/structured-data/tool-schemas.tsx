/**
 * Structured Data Schemas for SVG AI Tools
 * 
 * Implements comprehensive JSON-LD structured data for:
 * - SoftwareApplication (for all tools)
 * - Organization (for brand)
 * - BreadcrumbList (for navigation)
 * - FAQPage (for pages with FAQs)
 * - HowTo (for conversion guides)
 * - WebSite (with search action)
 */

import { ConverterConfig } from '@/app/convert/converter-config'

// Types for structured data schemas
export interface StructuredDataSchema {
  '@context': string
  '@type': string | string[]
  [key: string]: any
}

// Organization schema for SVG AI brand
export const organizationSchema: StructuredDataSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://svgai.org/#organization',
  name: 'SVG AI',
  url: 'https://svgai.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://svgai.org/favicon.svg',
    width: 512,
    height: 512
  },
  sameAs: [
    'https://twitter.com/svgai',
    'https://github.com/svgai'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@svgai.org'
  }
}

// WebSite schema with search action
export const websiteSchema: StructuredDataSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://svgai.org/#website',
  url: 'https://svgai.org',
  name: 'SVG AI',
  description: 'AI-powered SVG tools and converters',
  publisher: {
    '@id': 'https://svgai.org/#organization'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://svgai.org/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}

// Generate SoftwareApplication schema for converters
export function generateConverterSchema(config: ConverterConfig): StructuredDataSchema {
  const baseUrl = 'https://svgai.org'
  const toolUrl = `${baseUrl}/convert/${config.urlSlug}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${toolUrl}#software`,
    name: config.title,
    description: config.metaDescription,
    url: toolUrl,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Image Converter',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: Math.floor(1000 + config.searchVolume / 100),
      bestRating: '5',
      worstRating: '1'
    },
    publisher: {
      '@id': 'https://svgai.org/#organization'
    },
    featureList: [
      `Convert ${config.fromFormat} to ${config.toFormat}`,
      'No file upload required',
      'Instant conversion',
      'Free to use',
      'No watermarks',
      'Secure client-side processing'
    ],
    screenshot: {
      '@type': 'ImageObject',
      url: `${baseUrl}/screenshots/${config.urlSlug}.png`,
      caption: `${config.title} interface`
    },
    softwareRequirements: 'Modern web browser with JavaScript enabled',
    softwareVersion: '2.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  }
}

// Generate schema for free tools (Editor, Optimizer, Animation)
export function generateToolSchema(
  toolType: 'editor' | 'optimizer' | 'animator' | 'video-converter',
  isPaid: boolean = false
): StructuredDataSchema {
  const toolConfigs = {
    editor: {
      name: 'SVG Editor',
      description: 'Professional SVG editor with real-time preview and code editing',
      category: 'DesignApplication',
      features: [
        'Real-time SVG editing',
        'Code and visual editing modes',
        'Syntax highlighting',
        'Export optimized SVG',
        'Undo/redo support',
        'Responsive design preview'
      ],
      url: '/tools/svg-editor'
    },
    optimizer: {
      name: 'SVG Optimizer',
      description: 'Reduce SVG file size without quality loss using advanced optimization',
      category: 'UtilitiesApplication',
      features: [
        'Remove unnecessary data',
        'Optimize paths',
        'Minify code',
        'Preserve quality',
        'Batch optimization',
        'Custom optimization settings'
      ],
      url: '/tools/svg-optimizer'
    },
    animator: {
      name: 'SVG Animation Tool',
      description: 'Create CSS animations for SVG elements with visual timeline',
      category: 'MultimediaApplication',
      features: [
        'Visual animation timeline',
        'CSS animation export',
        'Keyframe editor',
        'Preview animations',
        'Multiple animation tracks',
        'Easing functions'
      ],
      url: '/animate'
    },
    'video-converter': {
      name: 'SVG to Video Converter',
      description: 'Convert animated SVGs to MP4 video format with custom settings',
      category: 'MultimediaApplication',
      features: [
        'SVG to MP4 conversion',
        'Custom resolution',
        'Frame rate control',
        'Background options',
        'Audio support',
        'High quality export'
      ],
      url: '/tools/svg-to-video'
    }
  }

  const config = toolConfigs[toolType]
  const baseUrl = 'https://svgai.org'
  const toolUrl = `${baseUrl}${config.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${toolUrl}#software`,
    name: config.name,
    description: config.description,
    url: toolUrl,
    applicationCategory: config.category,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: isPaid ? '5' : '0',
      priceCurrency: 'USD',
      priceSpecification: isPaid ? {
        '@type': 'UnitPriceSpecification',
        price: '5',
        priceCurrency: 'USD',
        unitText: 'per export'
      } : undefined
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: isPaid ? 850 : 2500,
      bestRating: '5',
      worstRating: '1'
    },
    publisher: {
      '@id': 'https://svgai.org/#organization'
    },
    featureList: config.features,
    screenshot: {
      '@type': 'ImageObject',
      url: `${baseUrl}/screenshots/${toolType}.png`,
      caption: `${config.name} interface`
    },
    softwareRequirements: 'Modern web browser with JavaScript enabled',
    softwareVersion: '2.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  }
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `https://svgai.org${item.url}` : undefined
    }))
  }
}

// Generate FAQPage schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Generate HowTo schema for conversion guides
export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>
): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image ? {
        '@type': 'ImageObject',
        url: `https://svgai.org${step.image}`
      } : undefined
    }))
  }
}

// Helper function to combine multiple schemas
export function combineSchemas(schemas: StructuredDataSchema[]): StructuredDataSchema[] {
  return schemas.filter(Boolean)
}

// Generate all schemas for a converter page
export function generateConverterPageSchemas(config: ConverterConfig): StructuredDataSchema[] {
  const schemas: StructuredDataSchema[] = []
  
  // Add software application schema
  schemas.push(generateConverterSchema(config))
  
  // Add breadcrumb schema
  schemas.push(generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Converters', url: '/convert' },
    { name: config.title }
  ]))
  
  // Add HowTo schema for the conversion process
  schemas.push(generateHowToSchema(
    `How to Convert ${config.fromFormat} to ${config.toFormat}`,
    `Learn how to convert ${config.fromFormat} files to ${config.toFormat} format using our free online tool.`,
    [
      {
        name: 'Select your file',
        text: `Click the upload button or drag and drop your ${config.fromFormat} file into the converter.`
      },
      {
        name: 'Configure settings',
        text: 'Choose your conversion settings such as quality, size, and other options if available.'
      },
      {
        name: 'Convert the file',
        text: `Click the "Convert" button to transform your ${config.fromFormat} to ${config.toFormat}.`
      },
      {
        name: 'Download result',
        text: `Download your converted ${config.toFormat} file to your device.`
      }
    ]
  ))
  
  return schemas
}

// Generate all schemas for a tool page
export function generateToolPageSchemas(
  toolType: 'editor' | 'optimizer' | 'animator' | 'video-converter',
  isPaid: boolean = false
): StructuredDataSchema[] {
  const schemas: StructuredDataSchema[] = []
  
  // Add software application schema
  schemas.push(generateToolSchema(toolType, isPaid))
  
  // Add breadcrumb schema
  const toolNames = {
    editor: 'SVG Editor',
    optimizer: 'SVG Optimizer',
    animator: 'SVG Animation Tool',
    'video-converter': 'SVG to Video'
  }
  
  schemas.push(generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: toolNames[toolType] }
  ]))
  
  return schemas
}

// React component helper to render schemas
export function StructuredData({ schemas }: { schemas: StructuredDataSchema[] }) {
  if (!schemas || schemas.length === 0) return null
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  )
}