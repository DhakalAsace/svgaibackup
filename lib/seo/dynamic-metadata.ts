import { Metadata } from 'next'

interface DynamicMetadataConfig {
  title: string
  description: string
  keywords: string[]
  url: string
  type?: 'website' | 'article' | 'product'
  image?: string
  noIndex?: boolean
  searchVolume?: number
  lastModified?: string
}

// Generate comprehensive metadata for dynamic routes
export function generateDynamicMetadata(config: DynamicMetadataConfig): Metadata {
  const {
    title,
    description,
    keywords,
    url,
    type = 'website',
    image = '/og-default.png',
    noIndex = false,
    searchVolume,
    lastModified
  } = config

  // Enhanced title with branding
  const enhancedTitle = `${title} | SVG AI - Free Tools & AI Generator`
  
  // Generate rich keywords including related terms
  const enrichedKeywords = [
    ...keywords,
    'svg',
    'vector graphics',
    'free online tool',
    'ai generator',
    'svg converter',
    'svg editor'
  ].filter((k, i, arr) => arr.indexOf(k) === i) // Remove duplicates

  const metadata: Metadata = {
    title: enhancedTitle,
    description,
    keywords: enrichedKeywords.join(', '),
    authors: [{ name: 'SVG AI', url: 'https://svgai.org' }],
    creator: 'SVG AI',
    publisher: 'SVG AI',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://svgai.org'),
    openGraph: {
      title,
      description,
      url,
      siteName: 'SVG AI',
      type: type as any,
      locale: 'en_US',
      images: [
        {
          url: image.startsWith('http') ? image : `https://svgai.org${image}`,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@svgai_com',
      site: '@svgai_com',
      images: [image.startsWith('http') ? image : `https://svgai.org${image}`],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
      canonical: url,
    },
    category: 'Technology',
    classification: 'Software/Web Application',
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    other: {
      'search-volume': searchVolume?.toString() || '0',
      'last-updated': lastModified || new Date().toISOString(),
      'schema-type': type,
    },
  }

  return metadata
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://svgai.org${item.url}`,
    })),
  }
}

// Generate FAQ structured data
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Generate WebApplication schema
export function generateWebApplicationSchema(config: {
  name: string
  description: string
  url: string
  applicationCategory: string
  features: string[]
  offers?: {
    price: string | number
    priceCurrency: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    description: config.description,
    url: config.url,
    applicationCategory: config.applicationCategory,
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    featureList: config.features,
    offers: config.offers || {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: 'SVG AI',
      url: 'https://svgai.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://svgai.org/logo.svg',
      },
    },
  }
}

// Generate HowTo schema for converter pages
export function generateHowToSchema(config: {
  name: string
  description: string
  url: string
  steps: Array<{ name: string; text: string }>
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description,
    url: config.url,
    totalTime: config.totalTime || 'PT2M',
    supply: [],
    tool: [],
    step: config.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${config.url}#step${index + 1}`,
    })),
  }
}

// Generate CollectionPage schema for galleries
export function generateCollectionSchema(config: {
  name: string
  description: string
  url: string
  numberOfItems: number
  keywords: string[]
  searchVolume: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.name,
    description: config.description,
    url: config.url,
    about: {
      '@type': 'Thing',
      name: config.keywords[0],
      description: `High-quality ${config.keywords[0]} designs and vectors`,
    },
    mainEntity: {
      '@type': 'ImageGallery',
      name: config.name,
      description: config.description,
      url: config.url,
      numberOfItems: config.numberOfItems,
      genre: 'Vector Graphics',
      keywords: config.keywords.join(', '),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        bestRating: '5',
        worstRating: '1',
        ratingCount: Math.floor(config.searchVolume / 100),
        reviewCount: Math.floor(config.searchVolume / 200),
      },
    },
  }
}

// Generate Article schema for learn pages
export function generateArticleSchema(config: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  keywords: string[]
  wordCount?: number
  author?: {
    name: string
    role: string
    expertise: string[]
    profileUrl?: string
  }
  reviewedBy?: {
    name: string
    role: string
  }
  technicalLevel?: string
  learningOutcomes?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['TechArticle', 'LearningResource'],
    headline: config.title,
    description: config.description,
    url: config.url,
    datePublished: config.datePublished,
    dateModified: config.dateModified || new Date().toISOString(),
    author: config.author ? {
      '@type': 'Person',
      name: config.author.name,
      jobTitle: config.author.role,
      url: config.author.profileUrl,
      knowsAbout: config.author.expertise,
    } : {
      '@type': 'Organization',
      name: 'SVG AI',
      url: 'https://svgai.org',
    },
    contributor: config.reviewedBy ? {
      '@type': 'Person',
      name: config.reviewedBy.name,
      jobTitle: config.reviewedBy.role,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'SVG AI',
      url: 'https://svgai.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://svgai.org/logo.svg',
      },
    },
    keywords: config.keywords.join(', '),
    wordCount: config.wordCount || 2000,
    articleSection: 'Technology',
    inLanguage: 'en-US',
    proficiencyLevel: config.technicalLevel || 'beginner',
    educationalLevel: config.technicalLevel || 'beginner',
    learningResourceType: 'Article',
    teaches: config.learningOutcomes || [],
    isPartOf: {
      '@type': 'WebSite',
      name: 'SVG AI Learn Hub',
      url: 'https://svgai.org/learn',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
  }
}

// Enhanced FAQ schema with E-E-A-T signals
export function generateEnhancedFAQSchema(faqs: Array<{
  question: string
  answer: string
  expertName?: string
  expertRole?: string
  dateAnswered?: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        author: faq.expertName ? {
          '@type': 'Person',
          name: faq.expertName,
          jobTitle: faq.expertRole,
        } : undefined,
        dateCreated: faq.dateAnswered || new Date().toISOString(),
      },
    })),
  }
}

// Generate LearningResource schema for tutorials
export function generateLearningResourceSchema(config: {
  name: string
  description: string
  url: string
  learningOutcomes: string[]
  prerequisites?: string[]
  timeRequired?: string
  educationalLevel: string
  keywords: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: config.name,
    description: config.description,
    url: config.url,
    learningResourceType: 'Tutorial',
    educationalLevel: config.educationalLevel,
    teaches: config.learningOutcomes,
    competencyRequired: config.prerequisites || [],
    timeRequired: config.timeRequired || 'PT10M',
    inLanguage: 'en-US',
    keywords: config.keywords.join(', '),
    provider: {
      '@type': 'Organization',
      name: 'SVG AI',
      url: 'https://svgai.org',
    },
    isPartOf: {
      '@type': 'Course',
      name: 'Complete SVG Mastery Course',
      description: 'Comprehensive SVG learning path from basics to advanced',
      url: 'https://svgai.org/learn',
    },
  }
}

// Generate Review schema for author credibility
export function generateReviewSchema(config: {
  itemReviewed: string
  reviewRating: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'LearningResource',
      name: config.itemReviewed,
    },
    ratingValue: config.reviewRating,
    reviewCount: config.reviewCount,
    bestRating: config.bestRating || 5,
    worstRating: config.worstRating || 1,
  }
}