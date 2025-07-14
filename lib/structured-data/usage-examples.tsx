/**
 * Usage Examples for Structured Data Implementation
 * 
 * This file demonstrates how to integrate structured data schemas
 * into various page components across the SVG AI application.
 */

import { Metadata } from 'next'
import { 
  generateConverterPageSchemas,
  generateToolPageSchemas,
  generateFAQSchema,
  StructuredData,
  organizationSchema,
  websiteSchema,
  combineSchemas
} from './tool-schemas'
import { ConverterConfig } from '@/app/convert/converter-config'

// Example 1: Converter Page Implementation
export function ConverterPageExample({ config }: { config: ConverterConfig }) {
  // Generate all schemas for the converter
  const schemas = generateConverterPageSchemas(config)
  
  return (
    <>
      {/* Add schemas to page head */}
      <StructuredData schemas={schemas} />
      
      {/* Rest of the converter page component */}
      <div className="converter-page">
        <h1>{config.title}</h1>
        {/* Converter UI components */}
      </div>
    </>
  )
}

// Example 2: SVG Editor Page Implementation
export function SVGEditorPageExample() {
  const schemas = generateToolPageSchemas('editor', false)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      
      <div className="svg-editor-page">
        <h1>SVG Editor</h1>
        {/* Editor components */}
      </div>
    </>
  )
}

// Example 3: SVG to Video Page (Paid Tool)
export function SVGToVideoPageExample() {
  const schemas = generateToolPageSchemas('video-converter', true)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      
      <div className="svg-to-video-page">
        <h1>SVG to Video Converter</h1>
        {/* Video converter components */}
      </div>
    </>
  )
}

// Example 4: Page with FAQ Section
export function PageWithFAQExample() {
  const faqs = [
    {
      question: 'Is the PNG to SVG converter free?',
      answer: 'Yes, our PNG to SVG converter is completely free to use with no limits on conversions.'
    },
    {
      question: 'How does PNG to SVG conversion work?',
      answer: 'Our converter uses advanced vectorization algorithms to trace the raster image and convert it into scalable vector paths.'
    },
    {
      question: 'What file sizes are supported?',
      answer: 'We support PNG files up to 10MB for conversion to SVG format.'
    }
  ]
  
  const faqSchema = generateFAQSchema(faqs)
  const toolSchemas = generateConverterPageSchemas({
    id: 'png-to-svg',
    urlSlug: 'png-to-svg',
    fromFormat: 'PNG',
    toFormat: 'SVG',
    title: 'PNG to SVG Converter',
    metaTitle: 'PNG to SVG Converter - Free Online Tool',
    metaDescription: 'Convert PNG to SVG online for free',
    keywords: ['png to svg'],
    searchVolume: 40500,
    priority: 'high',
    routeType: 'convert',
    isSupported: true
  })
  
  // Combine all schemas
  const allSchemas = combineSchemas([...toolSchemas, faqSchema])
  
  return (
    <>
      <StructuredData schemas={allSchemas} />
      
      <div className="page-with-faq">
        <h1>PNG to SVG Converter</h1>
        {/* Page content */}
        
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

// Example 5: Homepage with Organization and WebSite schemas
export function HomepageExample() {
  const schemas = [organizationSchema, websiteSchema]
  
  return (
    <>
      <StructuredData schemas={schemas} />
      
      <div className="homepage">
        <h1>SVG AI - AI-Powered SVG Tools</h1>
        {/* Homepage content */}
      </div>
    </>
  )
}

// Example 6: Integration with Next.js Metadata API
export async function generateMetadataWithSchema(
  config: ConverterConfig
): Promise<Metadata> {
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords.join(', '),
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      type: 'website',
      siteName: 'SVG AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDescription,
    },
    // Note: Structured data is added via StructuredData component in the page body
    // as Next.js Metadata API doesn't support script tags directly
  }
}

// Example 7: Dynamic Schema Generation Based on Content
export function DynamicSchemaExample({ 
  hasVideo, 
  hasFAQ, 
  toolType 
}: { 
  hasVideo?: boolean
  hasFAQ?: boolean
  toolType: 'editor' | 'optimizer' | 'animator' | 'video-converter'
}) {
  const schemas = []
  
  // Always add the tool schema
  schemas.push(...generateToolPageSchemas(toolType))
  
  // Conditionally add FAQ schema
  if (hasFAQ) {
    const faqSchema = generateFAQSchema([
      {
        question: `What is the ${toolType}?`,
        answer: `Our ${toolType} is a powerful tool for working with SVG files.`
      }
    ])
    schemas.push(faqSchema)
  }
  
  // Add video schema if page has video content
  if (hasVideo) {
    const videoSchema = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: `How to use ${toolType}`,
      description: `Tutorial video for ${toolType}`,
      thumbnailUrl: `https://svgai.org/videos/${toolType}-thumb.jpg`,
      uploadDate: new Date().toISOString(),
      duration: 'PT5M',
      contentUrl: `https://svgai.org/videos/${toolType}-tutorial.mp4`
    }
    schemas.push(videoSchema)
  }
  
  return <StructuredData schemas={schemas} />
}