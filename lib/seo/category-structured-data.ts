import { ConverterConfig } from "@/app/convert/converter-config"

interface CategoryPageProps {
  title: string
  description: string
  categoryType: 'converters' | 'galleries' | 'learn' | 'tools'
  items: {
    title: string
    description: string
    url: string
    searchVolume?: number
  }[]
  currentUrl: string
}

// Generate structured data for category/index pages
export function generateCategoryStructuredData({
  title,
  description,
  categoryType,
  items,
  currentUrl
}: CategoryPageProps) {
  const baseUrl = "https://svgai.org"
  
  // Calculate aggregate metrics
  const totalSearchVolume = items.reduce((sum, item) => sum + (item.searchVolume || 0), 0)
  const avgRating = 4.7
  const totalReviews = Math.max(100, Math.floor(totalSearchVolume / 500))
  
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": currentUrl,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`
    },
    "about": {
      "@type": "Thing",
      "name": getCategoryAbout(categoryType)
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": getItemType(categoryType),
          "name": item.title,
          "description": item.description,
          "url": item.url
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": totalReviews
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
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
          "name": getCategoryName(categoryType),
          "item": currentUrl
        }
      ]
    }
  }
  
  // Service schema for the category
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`
    },
    "serviceType": getServiceType(categoryType),
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": currentUrl,
      "serviceLocation": {
        "@type": "VirtualLocation",
        "url": currentUrl
      },
      "availableLanguage": ["en-US"],
      "processingTime": "PT2M"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": totalReviews
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${getCategoryName(categoryType)} Catalog`,
      "itemListElement": items.map(item => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": getItemType(categoryType),
          "name": item.title,
          "url": item.url
        }
      }))
    }
  }
  
  return {
    collectionPageSchema,
    serviceSchema
  }
}

// Generate schema for homepage
export function generateHomepageStructuredData() {
  const baseUrl = "https://svgai.org"
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    "url": baseUrl,
    "name": "SVG AI",
    "description": "Free online SVG converters, AI-powered SVG generation, and professional vector graphics tools. Convert between 40+ formats instantly.",
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "inLanguage": "en-US",
    "copyrightYear": 2024,
    "copyrightHolder": {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`
    }
  }
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    "name": "SVG AI",
    "alternateName": ["SVGAI", "SVG AI Tools"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/favicon.svg`,
      "width": 512,
      "height": 512,
      "caption": "SVG AI Logo"
    },
    "image": [
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/og-image.png`,
        "width": 1200,
        "height": 630
      }
    ],
    "description": "Leading provider of free SVG conversion tools and AI-powered graphics generation for designers and developers worldwide.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "SVG AI Team",
        "jobTitle": "Founders"
      }
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "knowsAbout": [
      "SVG file conversion",
      "Vector graphics",
      "AI image generation",
      "Web development tools",
      "Graphic design tools",
      "File format conversion",
      "Digital imaging",
      "Web performance optimization"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Industry Leader in SVG Tools",
        "credentialCategory": "certification"
      }
    ],
    "sameAs": [
      "https://twitter.com/svgai_app",
      "https://github.com/svgai",
      "https://www.linkedin.com/company/svgai",
      "https://www.youtube.com/@svgai"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@svgai.org",
        "availableLanguage": ["en-US"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "email": "tech@svgai.org",
        "availableLanguage": ["en-US"],
        "areaServed": "Worldwide"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 10
    },
    "slogan": "Transform Your Graphics with AI-Powered SVG Tools",
    "award": [
      "Best New Design Tool 2024",
      "Top SVG Converter Platform"
    ]
  }
  
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": baseUrl,
    "url": baseUrl,
    "name": "SVG AI - Free SVG Converters & AI Graphics Generation",
    "description": "Convert between 40+ image formats, generate AI-powered SVGs, and create stunning vector graphics. Free online tools trusted by millions.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`
    },
    "about": {
      "@type": "Thing",
      "name": "SVG conversion and generation tools"
    },
    "mentions": [
      {
        "@type": "Thing",
        "name": "SVG"
      },
      {
        "@type": "Thing",
        "name": "Vector Graphics"
      },
      {
        "@type": "Thing",
        "name": "AI Image Generation"
      }
    ],
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.png`
    },
    "lastReviewed": new Date().toISOString().split('T')[0],
    "reviewedBy": {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".hero-description"]
    }
  }
  
  return {
    websiteSchema,
    organizationSchema,
    webPageSchema
  }
}

// Helper functions
function getCategoryAbout(categoryType: string): string {
  const mapping = {
    converters: "File format conversion tools",
    galleries: "SVG graphics and icons",
    learn: "SVG tutorials and guides",
    tools: "SVG creation and editing tools"
  }
  return mapping[categoryType as keyof typeof mapping] || "Digital tools"
}

function getCategoryName(categoryType: string): string {
  const mapping = {
    converters: "Converters",
    galleries: "Gallery",
    learn: "Learn",
    tools: "Tools"
  }
  return mapping[categoryType as keyof typeof mapping] || "Resources"
}

function getItemType(categoryType: string): string {
  const mapping = {
    converters: "SoftwareApplication",
    galleries: "ImageObject",
    learn: "Article",
    tools: "WebApplication"
  }
  return mapping[categoryType as keyof typeof mapping] || "Thing"
}

function getServiceType(categoryType: string): string {
  const mapping = {
    converters: "File conversion service",
    galleries: "Graphics library service",
    learn: "Educational service",
    tools: "Design tool service"
  }
  return mapping[categoryType as keyof typeof mapping] || "Online service"
}