import { Metadata } from 'next'

// Canonical URL generation
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://svgai.org'
  // Remove trailing slashes and ensure clean paths
  const cleanPath = path.replace(/\/+$/, '').replace(/^\/+/, '')
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl
}

// Structured data helpers
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SVG AI',
    url: 'https://svgai.org',
    logo: 'https://svgai.org/logo.svg',
    description: 'AI-powered SVG generation and conversion tools',
    sameAs: [
      'https://twitter.com/svgai',
      'https://github.com/svgai'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@svgai.org',
      contactType: 'customer service',
      availableLanguage: ['en']
    }
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SVG AI',
    url: 'https://svgai.org',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://svgai.org/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function generateHowToSchema(config: {
  name: string
  description: string
  totalTime?: string
  estimatedCost?: string
  supply?: string[]
  tool?: string[]
  steps: Array<{
    name: string
    text: string
    image?: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description,
    totalTime: config.totalTime,
    estimatedCost: config.estimatedCost && {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: config.estimatedCost
    },
    supply: config.supply?.map(item => ({
      '@type': 'HowToSupply',
      name: item
    })),
    tool: config.tool?.map(item => ({
      '@type': 'HowToTool',
      name: item
    })),
    step: config.steps.map((step, index) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      image: step.image,
      position: index + 1
    }))
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
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

export function generateSoftwareApplicationSchema(config: {
  name: string
  description: string
  applicationCategory: string
  operatingSystem?: string[]
  offers?: {
    price: string
    priceCurrency: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.name,
    description: config.description,
    applicationCategory: config.applicationCategory,
    operatingSystem: config.operatingSystem,
    offers: config.offers && {
      '@type': 'Offer',
      price: config.offers.price,
      priceCurrency: config.offers.priceCurrency
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127'
    }
  }
}

// Meta tags generator
export function generateMetaTags(config: {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
}): Metadata {
  const canonicalUrl = generateCanonicalUrl(config.path)
  const imageUrl = config.image || 'https://svgai.org/og-image.png'
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: 'SVG AI',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title
        }
      ],
      locale: 'en_US',
      type: config.type || 'website',
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime })
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
      creator: '@svgai'
    },
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION
    }
  }
}

// Security headers configuration
export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-analytics.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://*.supabase.co https://*.vercel-analytics.com wss://*.supabase.co https://api.replicate.com;
      frame-ancestors 'self';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim()
  }
]

// HTML Sitemap generator
export function generateHTMLSitemap(sections: Array<{
  title: string
  links: Array<{ href: string; title: string; description?: string }>
}>) {
  return sections.map(section => ({
    title: section.title,
    links: section.links.map(link => ({
      href: link.href,
      title: link.title,
      description: link.description || ''
    }))
  }))
}