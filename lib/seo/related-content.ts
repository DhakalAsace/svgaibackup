import { converterConfigs, ConverterConfig } from '@/app/convert/converter-config'
import { getAllGalleryThemes, GalleryTheme } from '@/app/gallery/gallery-config'

interface RelatedContent {
  type: 'converter' | 'gallery' | 'learn' | 'tool'
  title: string
  description: string
  url: string
  searchVolume?: number
  keywords?: string[]
}

// Get related converters based on format
export function getRelatedConverters(
  currentConverter: ConverterConfig,
  limit: number = 4
): RelatedContent[] {
  const { fromFormat, toFormat } = currentConverter
  
  // Find converters that share either format
  const related = converterConfigs
    .filter(
      (c) =>
        c.urlSlug !== currentConverter.urlSlug &&
        c.isSupported &&
        (c.fromFormat === fromFormat ||
          c.toFormat === toFormat ||
          c.fromFormat === toFormat ||
          c.toFormat === fromFormat)
    )
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit)
    .map((converter): RelatedContent => ({
      type: 'converter',
      title: converter.title,
      description: converter.metaDescription,
      url: `/convert/${converter.urlSlug}`,
      searchVolume: converter.searchVolume,
      keywords: converter.keywords,
    }))

  return related
}

// Get related gallery themes based on keywords
export function getRelatedGalleries(
  currentKeywords: string[],
  excludeSlug?: string,
  limit: number = 4
): RelatedContent[] {
  const themes = getAllGalleryThemes()
  
  // Score themes based on keyword overlap
  const scoredThemes = themes
    .filter((theme) => theme.slug !== excludeSlug)
    .map((theme) => {
      const score = theme.keywords.reduce((acc, keyword) => {
        const keywordLower = keyword.toLowerCase()
        const matchScore = currentKeywords.some((k) =>
          k.toLowerCase().includes(keywordLower) ||
          keywordLower.includes(k.toLowerCase())
        )
          ? 1
          : 0
        return acc + matchScore
      }, 0)
      
      return { theme, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      // Sort by score first, then by search volume
      if (a.score !== b.score) return b.score - a.score
      return b.theme.searchVolume - a.theme.searchVolume
    })
    .slice(0, limit)
    .map(({ theme }): RelatedContent => ({
      type: 'gallery',
      title: theme.title,
      description: theme.description,
      url: `/gallery/${theme.slug}`,
      searchVolume: theme.searchVolume,
      keywords: theme.keywords,
    }))

  return scoredThemes
}

// Get related learn articles based on topic
export function getRelatedLearnArticles(
  currentTopic: string,
  excludeSlug?: string,
  limit: number = 4
): RelatedContent[] {
  // Define learn articles with their topics
  const learnArticles = [
    {
      slug: 'what-is-svg',
      title: 'What is SVG? Complete Guide to Scalable Vector Graphics',
      description: 'Learn everything about SVG format, its benefits, and how to use it',
      topics: ['svg', 'basics', 'format', 'introduction'],
      searchVolume: 33100,
    },
    {
      slug: 'svg-file-format',
      title: 'SVG File Format Explained: Structure, Syntax & Best Practices',
      description: 'Deep dive into SVG file format, XML structure, and optimization',
      topics: ['svg', 'format', 'xml', 'technical'],
      searchVolume: 9900,
    },
    {
      slug: 'how-to-open-svg-files',
      title: 'How to Open SVG Files: Complete Guide for All Platforms',
      description: 'Learn how to open, view, and edit SVG files on any device',
      topics: ['svg', 'open', 'edit', 'software'],
      searchVolume: 4900,
    },
    {
      slug: 'svg-vs-png',
      title: 'SVG vs PNG: Which Format Should You Use?',
      description: 'Comprehensive comparison of SVG and PNG formats',
      topics: ['svg', 'png', 'comparison', 'formats'],
      searchVolume: 2100,
    },
    {
      slug: 'svg-animation-guide',
      title: 'SVG Animation: Complete Guide with Examples',
      description: 'Learn how to create stunning SVG animations',
      topics: ['svg', 'animation', 'css', 'smil'],
      searchVolume: 1800,
    },
  ]

  // Score articles based on topic relevance
  const topicWords = currentTopic.toLowerCase().split(/[\s-]+/)
  
  const related = learnArticles
    .filter((article) => article.slug !== excludeSlug)
    .map((article) => {
      const score = article.topics.reduce((acc, topic) => {
        const topicScore = topicWords.some((word) =>
          topic.includes(word) || word.includes(topic)
        )
          ? 1
          : 0
        return acc + topicScore
      }, 0)
      
      return { article, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return b.article.searchVolume - a.article.searchVolume
    })
    .slice(0, limit)
    .map(({ article }): RelatedContent => ({
      type: 'learn',
      title: article.title,
      description: article.description,
      url: `/learn/${article.slug}`,
      searchVolume: article.searchVolume,
      keywords: article.topics,
    }))

  return related
}

// Get related tools based on functionality
export function getRelatedTools(
  currentTool: string,
  limit: number = 4
): RelatedContent[] {
  const tools = [
    {
      slug: 'svg-editor',
      title: 'SVG Editor - Edit SVG Files Online',
      description: 'Professional SVG editor with real-time preview',
      features: ['edit', 'design', 'modify'],
      isPaid: false,
    },
    {
      slug: 'svg-optimizer',
      title: 'SVG Optimizer - Reduce File Size',
      description: 'Optimize SVG files for web performance',
      features: ['optimize', 'compress', 'performance'],
      isPaid: false,
    },
    {
      slug: 'svg-to-video',
      title: 'SVG to Video Converter',
      description: 'Convert animated SVGs to video format',
      features: ['convert', 'animation', 'video'],
      isPaid: true,
    },
    {
      slug: 'ai-icon-generator',
      title: 'AI Icon Generator',
      description: 'Generate custom SVG icons with AI',
      features: ['generate', 'ai', 'create'],
      isPaid: true,
    },
  ]

  // Filter out current tool and return others
  const related = tools
    .filter((tool) => tool.slug !== currentTool)
    .slice(0, limit)
    .map((tool): RelatedContent => ({
      type: 'tool',
      title: tool.title + (tool.isPaid ? ' (Premium)' : ' (Free)'),
      description: tool.description,
      url: tool.slug === 'ai-icon-generator' ? '/ai-icon-generator' : `/tools/${tool.slug}`,
      keywords: tool.features,
    }))

  return related
}

// Get mixed related content for maximum engagement
export function getMixedRelatedContent(config: {
  currentType: 'converter' | 'gallery' | 'learn' | 'tool'
  currentSlug: string
  keywords: string[]
  limit?: number
}): RelatedContent[] {
  const { currentType, currentSlug, keywords, limit = 8 } = config
  const relatedContent: RelatedContent[] = []

  // Get content based on current type
  switch (currentType) {
    case 'converter':
      const converter = converterConfigs.find((c) => c.urlSlug === currentSlug)
      if (converter) {
        relatedContent.push(...getRelatedConverters(converter, 3))
      }
      relatedContent.push(...getRelatedGalleries(keywords, undefined, 2))
      relatedContent.push(...getRelatedLearnArticles(keywords.join(' '), undefined, 2))
      relatedContent.push(...getRelatedTools(currentSlug, 1))
      break

    case 'gallery':
      relatedContent.push(...getRelatedGalleries(keywords, currentSlug, 3))
      // Find relevant converters for gallery
      const relevantConverters = converterConfigs
        .filter((c) => c.isSupported && keywords.some((k) => c.title.toLowerCase().includes(k.toLowerCase())))
        .slice(0, 3)
        .map((c): RelatedContent => ({
          type: 'converter',
          title: c.title,
          description: c.metaDescription,
          url: `/convert/${c.urlSlug}`,
          searchVolume: c.searchVolume,
          keywords: c.keywords,
        }))
      relatedContent.push(...relevantConverters)
      relatedContent.push(...getRelatedTools('', 2))
      break

    case 'learn':
      relatedContent.push(...getRelatedLearnArticles(keywords.join(' '), currentSlug, 3))
      relatedContent.push(...getRelatedTools('', 2))
      relatedContent.push(...getRelatedGalleries(keywords, undefined, 3))
      break

    case 'tool':
      relatedContent.push(...getRelatedTools(currentSlug, 3))
      relatedContent.push(...getRelatedConverters(converterConfigs[0], 3))
      relatedContent.push(...getRelatedLearnArticles('tool guide', undefined, 2))
      break
  }

  // Remove duplicates and limit
  const seen = new Set<string>()
  return relatedContent
    .filter((item) => {
      if (seen.has(item.url)) return false
      seen.add(item.url)
      return true
    })
    .slice(0, limit)
}