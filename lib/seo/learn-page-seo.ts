import { Metadata } from 'next';

// TypeScript interfaces for SEO configuration
interface LearnPageSEOConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  searchVolume: number;
  schemaType: 'HowToGuide' | 'Article' | 'FAQPage' | 'TechArticle';
  priority: number;
  relatedPages?: string[];
  faqQuestions?: Array<{
    question: string;
    answer: string;
  }>;
}

// Complete SEO configuration for all 12 learn pages based on search volume
export const learnPageSEOConfig: Record<string, LearnPageSEOConfig> = {
  'what-is-svg': {
    slug: 'what-is-svg',
    title: 'What is SVG? Everything You Need to Know About Scalable Vector Graphics',
    description: 'Learn what SVG (Scalable Vector Graphics) is, how it works, and why it\'s essential for modern web design. Complete guide with examples, benefits, and practical applications.',
    keywords: ['what is svg', 'svg meaning', 'scalable vector graphics', 'svg definition', 'svg explained', 'svg file format'],
    searchVolume: 33100,
    schemaType: 'Article',
    priority: 1.0,
    relatedPages: ['/learn/svg-file', '/learn/svg-file-format', '/convert/png-to-svg'],
    faqQuestions: [
      {
        question: 'What does SVG stand for?',
        answer: 'SVG stands for Scalable Vector Graphics, an XML-based vector image format for two-dimensional graphics.'
      },
      {
        question: 'What is the difference between SVG and PNG?',
        answer: 'SVG uses mathematical formulas to create images that scale infinitely without quality loss, while PNG uses a fixed grid of pixels that can become blurry when scaled.'
      },
      {
        question: 'Can I edit SVG files?',
        answer: 'Yes, SVG files can be edited with text editors, vector graphics software like Illustrator, or our free online SVG editor.'
      }
    ]
  },
  'svg-file': {
    slug: 'svg-file',
    title: 'SVG File: Complete Guide to Working with SVG Files',
    description: 'Master SVG files with our comprehensive guide. Learn how to open, edit, create, and optimize SVG files for web and design projects.',
    keywords: ['svg file', 'svg files', 'open svg file', 'edit svg file', 'create svg file', 'svg file viewer'],
    searchVolume: 14800,
    schemaType: 'HowToGuide',
    priority: 0.9,
    relatedPages: ['/learn/what-is-svg', '/learn/svg-file-format', '/tools/svg-editor'],
    faqQuestions: [
      {
        question: 'How do I open an SVG file?',
        answer: 'SVG files can be opened in web browsers, vector graphics editors like Adobe Illustrator, or with our free online SVG viewer.'
      },
      {
        question: 'What programs can edit SVG files?',
        answer: 'SVG files can be edited with Adobe Illustrator, Inkscape, our free online SVG editor, or even text editors for code-level changes.'
      }
    ]
  },
  'svg-file-format': {
    slug: 'svg-file-format',
    title: 'SVG File Format: Technical Specification & Complete Guide',
    description: 'Deep dive into the SVG file format. Understand XML structure, elements, attributes, and how to create optimized SVG files for web performance.',
    keywords: ['svg file format', 'svg format', 'svg specification', 'svg xml', 'svg structure', 'svg syntax'],
    searchVolume: 9900,
    schemaType: 'TechArticle',
    priority: 0.85,
    relatedPages: ['/learn/what-is-svg', '/learn/svg-file', '/tools/svg-optimizer'],
    faqQuestions: [
      {
        question: 'What is the SVG file format based on?',
        answer: 'SVG is based on XML (Extensible Markup Language) and uses text-based descriptions to define vector graphics.'
      },
      {
        question: 'What elements are used in SVG format?',
        answer: 'Common SVG elements include <path>, <rect>, <circle>, <line>, <polygon>, <text>, and <g> for grouping.'
      }
    ]
  },
  'convert-png-to-svg': {
    slug: 'convert-png-to-svg',
    title: 'How to Convert PNG to SVG: Step-by-Step Guide & Best Tools',
    description: 'Learn how to convert PNG images to SVG format with our comprehensive guide. Compare methods, tools, and get professional tips for best results.',
    keywords: ['convert png to svg', 'png to svg', 'png to svg converter', 'how to convert png to svg', 'png to vector'],
    searchVolume: 6600,
    schemaType: 'HowToGuide',
    priority: 0.8,
    relatedPages: ['/convert/png-to-svg', '/learn/svg-file', '/learn/best-svg-converters'],
    faqQuestions: [
      {
        question: 'Can you convert PNG to SVG?',
        answer: 'Yes, PNG images can be converted to SVG using tracing algorithms. Our free converter uses advanced AI to create high-quality vector conversions.'
      },
      {
        question: 'Is PNG to SVG conversion lossless?',
        answer: 'PNG to SVG conversion involves tracing raster pixels into vector paths, which may simplify details but creates infinitely scalable graphics.'
      }
    ]
  },
  'convert-svg-to-png-windows': {
    slug: 'convert-svg-to-png-windows',
    title: 'Convert SVG to PNG on Windows: Easy Methods & Free Tools',
    description: 'Discover the best ways to convert SVG to PNG on Windows. Step-by-step tutorials for built-in tools, free software, and online converters.',
    keywords: ['convert svg to png windows', 'svg to png windows', 'windows svg converter', 'svg to png windows 10', 'svg to png windows 11'],
    searchVolume: 2900,
    schemaType: 'HowToGuide',
    priority: 0.7,
    relatedPages: ['/convert/svg-to-png', '/learn/batch-svg-to-png', '/learn/svg-file'],
    faqQuestions: [
      {
        question: 'How do I convert SVG to PNG in Windows 10?',
        answer: 'You can use Paint, PowerShell commands, free software like Inkscape, or our online converter that works directly in your browser.'
      },
      {
        question: 'Can Windows open SVG files natively?',
        answer: 'Yes, Windows 10 and 11 can display SVG files in File Explorer and Microsoft Edge browser, but conversion requires additional tools.'
      }
    ]
  },
  'svg-css-animation': {
    slug: 'svg-css-animation',
    title: 'SVG CSS Animation: Complete Guide with Examples & Code',
    description: 'Master SVG CSS animations with our comprehensive tutorial. Learn keyframes, transforms, and create stunning animated graphics for your website.',
    keywords: ['svg css animation', 'animate svg css', 'css svg animation', 'svg animation tutorial', 'svg keyframes'],
    searchVolume: 2400,
    schemaType: 'HowToGuide',
    priority: 0.65,
    relatedPages: ['/animate', '/learn/check-svg-animation', '/learn/react-native-svg-animation'],
    faqQuestions: [
      {
        question: 'Can you animate SVG with CSS?',
        answer: 'Yes, SVG elements can be animated using CSS animations, transitions, and transforms just like HTML elements.'
      },
      {
        question: 'What CSS properties work with SVG?',
        answer: 'Common CSS properties for SVG include fill, stroke, opacity, transform, and filter, plus standard animation properties.'
      }
    ]
  },
  'best-svg-converters': {
    slug: 'best-svg-converters',
    title: 'Best SVG Converters 2025: Top Tools Compared & Reviewed',
    description: 'Compare the best SVG converters for PNG, JPG, PDF and more. In-depth reviews, features, pricing, and recommendations for every use case.',
    keywords: ['best svg converters', 'svg converter comparison', 'top svg converters', 'svg converter review', 'svg conversion tools'],
    searchVolume: 1900,
    schemaType: 'Article',
    priority: 0.6,
    relatedPages: ['/convert', '/learn/convert-png-to-svg', '/learn/batch-svg-to-png'],
    faqQuestions: [
      {
        question: 'What is the best SVG converter?',
        answer: 'The best SVG converter depends on your needs. For AI-powered conversions, try our free tool. For batch processing, desktop software like Inkscape works well.'
      },
      {
        question: 'Are online SVG converters safe?',
        answer: 'Reputable online converters like ours process files client-side in your browser, ensuring your files never leave your device.'
      }
    ]
  },
  'batch-svg-to-png': {
    slug: 'batch-svg-to-png',
    title: 'Batch Convert SVG to PNG: Automate Bulk Conversions',
    description: 'Learn how to batch convert multiple SVG files to PNG format. Compare tools, scripts, and methods for efficient bulk SVG to PNG conversion.',
    keywords: ['batch svg to png', 'bulk svg to png', 'convert multiple svg to png', 'svg to png batch', 'mass convert svg'],
    searchVolume: 1300,
    schemaType: 'HowToGuide',
    priority: 0.55,
    relatedPages: ['/convert/svg-to-png', '/learn/convert-svg-to-png-windows', '/tools/svg-optimizer'],
    faqQuestions: [
      {
        question: 'How do I convert multiple SVG files to PNG at once?',
        answer: 'Use command-line tools like ImageMagick, desktop software like Inkscape with batch processing, or our online converter for smaller batches.'
      },
      {
        question: 'Can I automate SVG to PNG conversion?',
        answer: 'Yes, you can automate conversions using scripts with ImageMagick, Node.js libraries, or Python with cairosvg.'
      }
    ]
  },
  'check-svg-animation': {
    slug: 'check-svg-animation',
    title: 'How to Check & Debug SVG Animations: Testing Guide',
    description: 'Learn how to check, test, and debug SVG animations. Tools and techniques for ensuring your animated SVGs work perfectly across all browsers.',
    keywords: ['check svg animation', 'test svg animation', 'debug svg animation', 'svg animation testing', 'svg animation tools'],
    searchVolume: 880,
    schemaType: 'HowToGuide',
    priority: 0.5,
    relatedPages: ['/animate', '/learn/svg-css-animation', '/tools/svg-editor'],
    faqQuestions: [
      {
        question: 'How do I test SVG animations?',
        answer: 'Test SVG animations using browser developer tools, online validators, or specialized tools like our SVG animation checker.'
      },
      {
        question: 'Why is my SVG animation not working?',
        answer: 'Common issues include incorrect syntax, browser compatibility, missing animation triggers, or conflicting CSS rules.'
      }
    ]
  },
  'react-native-svg-animation': {
    slug: 'react-native-svg-animation',
    title: 'React Native SVG Animation: Complete Implementation Guide',
    description: 'Master SVG animations in React Native. Learn react-native-svg, animation libraries, performance tips, and create smooth vector animations.',
    keywords: ['react native svg animation', 'react native svg', 'animate svg react native', 'react native vector animation', 'react native svg tutorial'],
    searchVolume: 720,
    schemaType: 'HowToGuide',
    priority: 0.45,
    relatedPages: ['/learn/svg-css-animation', '/learn/check-svg-animation', '/animate'],
    faqQuestions: [
      {
        question: 'Can you use SVG animations in React Native?',
        answer: 'Yes, React Native supports SVG animations through react-native-svg library combined with Animated API or reanimated.'
      },
      {
        question: 'What is the best library for React Native SVG animations?',
        answer: 'react-native-svg with react-native-reanimated provides the best performance and flexibility for complex animations.'
      }
    ]
  },
  'html-string-to-svg-js': {
    slug: 'html-string-to-svg-js',
    title: 'Convert HTML String to SVG with JavaScript: Developer Guide',
    description: 'Learn how to convert HTML strings to SVG using JavaScript. Code examples, best practices, and techniques for dynamic SVG generation.',
    keywords: ['html string to svg js', 'convert html to svg javascript', 'html to svg conversion', 'javascript svg generation', 'dynamic svg creation'],
    searchVolume: 480,
    schemaType: 'HowToGuide',
    priority: 0.4,
    relatedPages: ['/learn/svg-file-format', '/tools/svg-editor', '/learn/svg-css-animation'],
    faqQuestions: [
      {
        question: 'How do I convert HTML to SVG in JavaScript?',
        answer: 'Use the foreignObject element to embed HTML in SVG, or use libraries like html2canvas with svg conversion for complex layouts.'
      },
      {
        question: 'Can SVG contain HTML elements?',
        answer: 'Yes, SVG can contain HTML through the foreignObject element, allowing rich content within vector graphics.'
      }
    ]
  },
  'svg-animation': {
    slug: 'svg-animation',
    title: 'SVG Animation: Master Guide to Animating Vector Graphics',
    description: 'Complete guide to SVG animation techniques. Learn SMIL, CSS, and JavaScript methods to create stunning animated vector graphics for the web.',
    keywords: ['svg animation', 'animate svg', 'svg animation tutorial', 'svg motion', 'animated svg'],
    searchVolume: 7720,
    schemaType: 'HowToGuide',
    priority: 0.75,
    relatedPages: ['/animate', '/learn/svg-css-animation', '/learn/check-svg-animation'],
    faqQuestions: [
      {
        question: 'What are the ways to animate SVG?',
        answer: 'SVG can be animated using CSS animations, JavaScript libraries like GSAP, or SMIL (deprecated but still supported).'
      },
      {
        question: 'Is SVG animation better than GIF?',
        answer: 'Yes, SVG animations are resolution-independent, have smaller file sizes, and offer more control over timing and interactivity.'
      }
    ]
  }
};

// Generate comprehensive metadata for learn pages
export function generateLearnPageSEO(slug: string, customMetadata?: Partial<Metadata>): Metadata {
  const config = learnPageSEOConfig[slug];
  
  if (!config) {
    return {
      title: 'Learn About SVG - SVG AI',
      description: 'Learn about SVG files, formats, and conversions with our comprehensive guides.',
      ...customMetadata
    };
  }

  // Generate breadcrumb structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://svgai.org'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Learn',
        'item': 'https://svgai.org/learn'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': config.title.split(':')[0],
        'item': `https://svgai.org/learn/${slug}`
      }
    ]
  };

  // Generate appropriate schema based on content type
  let contentSchema: any;
  
  switch (config.schemaType) {
    case 'HowToGuide':
      contentSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': config.title,
        'description': config.description,
        'step': config.relatedPages?.map((page, index) => ({
          '@type': 'HowToStep',
          'name': `Step ${index + 1}`,
          'text': `Visit ${page} for more information`,
          'url': `https://svgai.org${page}`
        })) || []
      };
      break;
      
    case 'FAQPage':
      contentSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': config.faqQuestions?.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        })) || []
      };
      break;
      
    case 'TechArticle':
      contentSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': config.title,
        'description': config.description,
        'keywords': config.keywords.join(', '),
        'author': {
          '@type': 'Organization',
          'name': 'SVG AI',
          'url': 'https://svgai.org'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'SVG AI',
          'url': 'https://svgai.org',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://svgai.org/favicon.svg'
          }
        },
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString()
      };
      break;
      
    default: // Article
      contentSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': config.title,
        'description': config.description,
        'keywords': config.keywords.join(', '),
        'author': {
          '@type': 'Organization',
          'name': 'SVG AI',
          'url': 'https://svgai.org'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'SVG AI',
          'url': 'https://svgai.org',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://svgai.org/favicon.svg'
          }
        },
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `https://svgai.org/learn/${slug}`
        }
      };
  }

  // Add FAQ schema if questions exist
  const faqSchema = config.faqQuestions && config.faqQuestions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': config.faqQuestions.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : null;

  // Combine all structured data
  const structuredData = [
    breadcrumbSchema,
    contentSchema,
    ...(faqSchema ? [faqSchema] : [])
  ];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    authors: [{ name: 'SVG AI Team' }],
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'article',
      url: `https://svgai.org/learn/${slug}`,
      siteName: 'SVG AI - AI-Powered SVG Generation & Tools',
      images: [
        {
          url: `https://svgai.org/learn/${slug}-og.jpg`,
          width: 1200,
          height: 630,
          alt: config.title
        }
      ],
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [`https://svgai.org/learn/${slug}-twitter.jpg`],
      creator: '@svgai'
    },
    alternates: {
      canonical: `https://svgai.org/learn/${slug}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1
      }
    },
    other: {
      'script:ld+json': JSON.stringify(structuredData)
    },
    ...customMetadata
  };
}

// Sitemap configuration for learn pages
export function getLearnPagesSitemapData() {
  return Object.entries(learnPageSEOConfig)
    .map(([slug, config]) => ({
      url: `https://svgai.org/learn/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: config.priority
    }))
    .sort((a, b) => b.priority - a.priority);
}

// Get related learn pages for internal linking
export function getRelatedLearnPages(currentSlug: string, limit: number = 3): Array<{
  slug: string;
  title: string;
  description: string;
  href: string;
}> {
  const currentConfig = learnPageSEOConfig[currentSlug];
  if (!currentConfig) return [];

  // Get explicitly related pages first
  const relatedSlugs = currentConfig.relatedPages
    ?.map(path => path.replace('/learn/', ''))
    .filter(slug => slug !== currentSlug && learnPageSEOConfig[slug]) || [];

  // Add high-priority pages if needed
  const allPages = Object.entries(learnPageSEOConfig)
    .filter(([slug]) => slug !== currentSlug && !relatedSlugs.includes(slug))
    .sort((a, b) => b[1].priority - a[1].priority)
    .map(([slug]) => slug);

  const finalSlugs = [...relatedSlugs, ...allPages].slice(0, limit);

  return finalSlugs.map(slug => {
    const config = learnPageSEOConfig[slug];
    return {
      slug,
      title: config.title.split(':')[0], // Get main title part
      description: config.description.substring(0, 100) + '...',
      href: `/learn/${slug}`
    };
  });
}

// Export types for use in components
export type { LearnPageSEOConfig };