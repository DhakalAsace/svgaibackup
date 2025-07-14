import { Metadata } from 'next';

interface SocialMetaOptions {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  url: string;
  siteName?: string;
  locale?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function generateSocialMeta(options: SocialMetaOptions): Metadata {
  const {
    title,
    description,
    image,
    type = 'website',
    url,
    siteName = 'SVG AI',
    locale = 'en_US',
    twitterCard = 'summary_large_image',
    twitterSite = '@svgai_app',
    twitterCreator = '@svgai_app',
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = []
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://svgai.org';
  const defaultImage = `${baseUrl}/api/og`;
  const imageUrl = image || defaultImage;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      url,
      siteName,
      locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
        {
          url: `${imageUrl}?format=square`,
          width: 1200,
          height: 1200,
          alt: `${title} - Square Format`,
        }
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: twitterCard,
      site: twitterSite,
      creator: twitterCreator,
      title,
      description,
      images: [imageUrl],
    },
    // Additional social platforms
    other: {
      'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID || '',
      'article:author': author || '',
      'article:section': section || '',
      'article:tag': tags.join(', '),
      // Pinterest Rich Pins
      'pinterest:description': description,
      'pinterest:title': title,
      // LinkedIn
      'linkedin:owner': 'SVG AI',
      // Telegram
      'telegram:channel': '@svgai',
    },
  };
}

// Tool-specific social meta generator
export function generateToolSocialMeta(
  toolName: string,
  description: string,
  features: string[],
  isPremium = false
): Metadata {
  const slug = toolName.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://svgai.org';
  
  return generateSocialMeta({
    title: `${toolName} - ${isPremium ? 'Premium' : 'Free'} Tool | SVG AI`,
    description: `${description} Features: ${features.slice(0, 3).join(', ')}.`,
    image: `${baseUrl}/api/og?type=tool&name=${encodeURIComponent(toolName)}&desc=${encodeURIComponent(description)}&feat=${features.map(f => encodeURIComponent(f)).join('&feat=')}&premium=${isPremium}`,
    type: 'website',
    url: `${baseUrl}/tools/${slug}`,
  });
}

// Learn page social meta generator
export function generateLearnSocialMeta(
  title: string,
  category: string,
  readTime: string,
  topics: string[]
): Metadata {
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://svgai.org';
  
  return generateSocialMeta({
    title: `${title} | SVG AI Learn`,
    description: `Learn about ${topics.join(', ')} in this ${readTime} guide. ${category} tutorial for SVG enthusiasts.`,
    image: `${baseUrl}/api/og?type=learn&title=${encodeURIComponent(title)}&cat=${encodeURIComponent(category)}&time=${encodeURIComponent(readTime)}&topic=${topics.map(t => encodeURIComponent(t)).join('&topic=')}`,
    type: 'article',
    url: `${baseUrl}/learn/${slug}`,
    section: category,
    tags: topics,
  });
}

// Gallery page social meta generator
export function generateGallerySocialMeta(
  theme: string,
  title: string,
  description: string,
  exampleCount: number
): Metadata {
  const slug = theme.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://svgai.org';
  
  return generateSocialMeta({
    title: `${title} - Free SVG Gallery | SVG AI`,
    description: `${description} Browse ${exampleCount}+ free SVG graphics in our ${theme} collection.`,
    image: `${baseUrl}/api/og?type=gallery&theme=${encodeURIComponent(theme)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&count=${exampleCount}`,
    type: 'website',
    url: `${baseUrl}/gallery/${slug}`,
  });
}

// Homepage social meta
export function generateHomepageSocialMeta(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://svgai.org';
  
  return generateSocialMeta({
    title: 'SVG AI - Free SVG Converters & AI-Powered Vector Graphics Generator',
    description: 'Convert images to SVG, generate AI graphics, and access 40+ free vector tools. Join 100,000+ designers using SVG AI for professional vector graphics.',
    image: `${baseUrl}/api/og`,
    type: 'website',
    url: baseUrl,
  });
}

// AI Generation page social meta
export function generateAIGenerationSocialMeta(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://svgai.org';
  
  return generateSocialMeta({
    title: 'AI SVG Generator - Create Vector Graphics with AI | SVG AI',
    description: 'Generate unique SVG graphics using artificial intelligence. Perfect for logos, icons, illustrations. Text-to-SVG in seconds.',
    image: `${baseUrl}/api/og?type=ai`,
    type: 'website',
    url: `${baseUrl}/ai-icon-generator`,
  });
}