// Example implementations of structured data for different page types

import { Metadata } from 'next'
import {
  generateConverterStructuredData,
  generateConverterMetadata,
  generateGalleryStructuredData,
  generateLearnPageStructuredData,
  generateToolStructuredData,
  generateCategoryStructuredData,
  generateHomepageStructuredData,
  generateBreadcrumbSchema,
  combineSchemas,
  generateJsonLdScript
} from './index'

// Example 1: Converter Page with full schema implementation
export function ConverterPageExample() {
  const converterConfig = {
    id: 'png-to-svg',
    urlSlug: 'png-to-svg',
    title: 'PNG to SVG Converter',
    metaTitle: 'PNG to SVG Converter - Free Online Raster to Vector Tool',
    metaDescription: 'Convert PNG images to SVG vector format instantly. Free online converter with batch processing, color reduction, and optimization features.',
    keywords: ['png to svg', 'png svg converter', 'raster to vector', 'image converter'],
    fromFormat: 'PNG',
    toFormat: 'SVG',
    searchVolume: 40500,
    priority: 'high' as const,
    isSupported: true,
    routeType: 'convert' as const
  }
  
  const howItWorksSteps = [
    {
      title: "Upload PNG Image",
      description: "Select or drag and drop your PNG file into the upload area. Supports batch upload for multiple files."
    },
    {
      title: "Configure Settings",
      description: "Adjust color reduction, smoothing, and optimization settings for best results."
    },
    {
      title: "Convert to SVG",
      description: "Click convert and our tool will trace your raster image into scalable vector paths."
    },
    {
      title: "Download SVG",
      description: "Download your converted SVG file or copy the code directly to your clipboard."
    }
  ]
  
  const faqs = [
    {
      question: "How does PNG to SVG conversion work?",
      answer: "Our converter uses advanced tracing algorithms to convert raster pixels into vector paths. It analyzes color boundaries and creates scalable shapes that approximate the original image."
    },
    {
      question: "What's the maximum file size for PNG conversion?",
      answer: "We support PNG files up to 10MB in size. For larger files, consider reducing the image dimensions before conversion."
    },
    {
      question: "Can I convert multiple PNG files at once?",
      answer: "Yes! Our batch converter allows you to upload and convert up to 20 PNG files simultaneously."
    },
    {
      question: "Will the SVG file be smaller than the PNG?",
      answer: "It depends on image complexity. Simple graphics with few colors typically result in smaller SVG files, while photos may be larger."
    },
    {
      question: "Is the conversion process secure?",
      answer: "Yes, all conversions happen directly in your browser. No files are uploaded to our servers, ensuring complete privacy."
    }
  ]
  
  const currentUrl = 'https://svgai.org/convert/png-to-svg'
  
  const schemas = generateConverterStructuredData({
    converterConfig,
    howItWorksSteps,
    faqs,
    currentUrl
  })
  
  const allSchemas = combineSchemas(
    schemas.softwareApplicationSchema,
    schemas.webApplicationSchema,
    schemas.howToSchema,
    schemas.faqSchema,
    schemas.videoSchema,
    schemas.techArticleSchema,
    schemas.webPageSchema
  )
  
  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

// Example 2: Gallery Page with ImageGallery schema
export function GalleryPageExample() {
  const galleryProps = {
    title: "Heart SVG Icons - Free Vector Graphics Collection",
    description: "Download free heart SVG icons and graphics. Perfect for Valentine's Day, love-themed designs, and romantic projects.",
    images: [
      {
        url: "https://svgai.org/gallery/heart-icons/simple-heart.svg",
        title: "Simple Heart Icon",
        description: "Clean minimalist heart shape in solid red",
        width: 512,
        height: 512
      },
      {
        url: "https://svgai.org/gallery/heart-icons/outlined-heart.svg",
        title: "Outlined Heart Icon",
        description: "Heart icon with stroke outline, no fill",
        width: 512,
        height: 512
      },
      {
        url: "https://svgai.org/gallery/heart-icons/double-heart.svg",
        title: "Double Heart Icon",
        description: "Two overlapping hearts symbolizing love",
        width: 512,
        height: 512
      }
    ],
    currentUrl: "https://svgai.org/gallery/heart-svg",
    searchVolume: 12000
  }
  
  const schemas = generateGalleryStructuredData(galleryProps)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.imageGallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionPageSchema) }}
      />
    </>
  )
}

// Example 3: Learn Page with Article and VideoObject schemas
export function LearnPageExample() {
  const learnProps = {
    title: "What is SVG? Complete Guide to Scalable Vector Graphics",
    description: "Learn everything about SVG files, how they work, their benefits, and when to use them. Perfect for beginners and web developers.",
    content: `SVG (Scalable Vector Graphics) is an XML-based vector image format for two-dimensional graphics with support for interactivity and animation...`, // Full article content
    faqs: [
      {
        question: "What does SVG stand for?",
        answer: "SVG stands for Scalable Vector Graphics, an XML-based format for vector images."
      },
      {
        question: "Can I edit SVG files?",
        answer: "Yes, SVG files can be edited with vector graphics software like Illustrator or Inkscape, or even with a text editor."
      }
    ],
    currentUrl: "https://svgai.org/learn/what-is-svg",
    searchVolume: 33100,
    readingTime: "8 minutes"
  }
  
  const schemas = generateLearnPageStructuredData(learnProps)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.videoSchema) }}
      />
      {schemas.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
        />
      )}
    </>
  )
}

// Example 4: Premium Tool Page with Product schema
export function PremiumToolExample() {
  const toolProps = {
    title: "SVG to Video Converter - Export Animations to MP4",
    description: "Convert SVG animations to MP4 videos for social media, presentations, and more. High-quality export with custom settings.",
    isPremium: true,
    features: [
      "Export SVG animations to MP4",
      "Custom resolution up to 4K",
      "Frame rate control (24-60 fps)",
      "Audio track support",
      "Batch export multiple animations",
      "Transparent background option"
    ],
    currentUrl: "https://svgai.org/tools/svg-to-video",
    price: 4.99,
    priceUnit: "per video export"
  }
  
  const schemas = generateToolStructuredData(toolProps)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApplicationSchema) }}
      />
      {schemas.productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.productSchema) }}
        />
      )}
    </>
  )
}

// Example 5: Category Page (Converters Index)
export function CategoryPageExample() {
  const categoryProps = {
    title: "Free Online File Converters - 40+ Format Conversions",
    description: "Convert between 40+ file formats instantly. PNG to SVG, SVG to PNG, PDF to SVG, and more. All converters are free and work in your browser.",
    categoryType: 'converters' as const,
    items: [
      {
        title: "PNG to SVG Converter",
        description: "Convert raster PNG images to scalable SVG vectors",
        url: "https://svgai.org/convert/png-to-svg",
        searchVolume: 40500
      },
      {
        title: "SVG to PNG Converter", 
        description: "Convert SVG vectors to PNG raster images",
        url: "https://svgai.org/convert/svg-to-png",
        searchVolume: 18100
      },
      {
        title: "JPG to SVG Converter",
        description: "Convert JPEG photos to SVG vector format",
        url: "https://svgai.org/convert/jpg-to-svg",
        searchVolume: 27100
      }
    ],
    currentUrl: "https://svgai.org/convert"
  }
  
  const schemas = generateCategoryStructuredData(categoryProps)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.serviceSchema) }}
      />
    </>
  )
}

// Example 6: Homepage with comprehensive organization schema
export function HomepageExample() {
  const schemas = generateHomepageStructuredData()
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webPageSchema) }}
      />
    </>
  )
}

// Example: Next.js Metadata with structured data
export async function generateMetadata(): Promise<Metadata> {
  const converterConfig = {
    id: 'png-to-svg',
    urlSlug: 'png-to-svg',
    title: 'PNG to SVG Converter',
    metaTitle: 'PNG to SVG Converter - Free Online Raster to Vector Tool',
    metaDescription: 'Convert PNG images to SVG vector format instantly.',
    keywords: ['png to svg', 'png svg converter'],
    fromFormat: 'PNG',
    toFormat: 'SVG',
    searchVolume: 40500,
    priority: 'high' as const,
    isSupported: true,
    routeType: 'convert' as const
  }
  
  return generateConverterMetadata(
    converterConfig,
    'https://svgai.org/convert/png-to-svg'
  )
}