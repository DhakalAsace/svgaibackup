import { ConverterConfig, converterConfigs } from '@/app/convert/converter-config'

// Enhanced topic clusters for SEO empire optimization
export const formatFamilies = {
  image: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'avif', 'heic'],
  vector: ['svg', 'eps', 'ai', 'pdf', 'dxf', 'cdr', 'emf', 'wmf'],
  document: ['pdf', 'eps', 'ai'],
  font: ['ttf', 'otf', 'woff', 'woff2'],
  '3d': ['stl', 'obj', 'fbx'],
  web: ['png', 'jpg', 'webp', 'svg', 'avif', 'gif'],
  print: ['pdf', 'eps', 'ai', 'svg', 'tiff'],
  cad: ['dxf', 'dwg', 'stl'],
  design: ['ai', 'cdr', 'eps', 'svg', 'pdf'],
  legacy: ['emf', 'wmf', 'bmp', 'tiff'],
  modern: ['webp', 'avif', 'heic', 'svg']
}

// Enhanced topic clusters with ultra-optimized link flow
export const topicClustersEnhanced = {
  'vector-conversion': {
    name: 'Vector Conversion Hub',
    description: 'Professional vector format conversions',
    keywords: ['vector', 'scalable', 'graphics', 'svg', 'eps', 'ai'],
    formats: ['svg', 'eps', 'ai', 'pdf', 'dxf'],
    boost: 5,
    hubUrl: '/convert/vector-converters',
    relatedClusters: ['print-ready', 'design-workflow']
  },
  'raster-conversion': {
    name: 'Raster Image Conversion',
    description: 'Convert bitmap and raster images',
    keywords: ['image', 'photo', 'bitmap', 'png', 'jpg', 'webp'],
    formats: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'],
    boost: 4,
    hubUrl: '/convert/image-converters',
    relatedClusters: ['web-optimization', 'social-media']
  },
  'professional-formats': {
    name: 'Professional Design Formats',
    description: 'Industry-standard design file conversions',
    keywords: ['professional', 'adobe', 'print', 'design', 'publishing'],
    formats: ['pdf', 'eps', 'ai', 'tiff'],
    boost: 3,
    hubUrl: '/convert/professional-converters',
    relatedClusters: ['print-ready', 'design-workflow']
  },
  'animation-cluster': {
    name: 'Animation & Motion',
    description: 'Convert and create animated graphics',
    keywords: ['animation', 'animated', 'gif', 'video', 'motion'],
    formats: ['gif', 'svg', 'mp4'],
    boost: 4,
    hubUrl: '/convert/animation-converters',
    relatedClusters: ['web-optimization', 'social-media']
  },
  'web-optimization': {
    keywords: ['web', 'website', 'optimize', 'performance', 'responsive'],
    formats: ['svg', 'webp', 'avif', 'png'],
    boost: 4
  },
  'print-ready': {
    keywords: ['print', 'high-quality', 'vector', 'scalable'],
    formats: ['svg', 'eps', 'ai', 'pdf'],
    boost: 3
  },
  'social-media': {
    keywords: ['social', 'share', 'profile', 'avatar', 'icon'],
    formats: ['png', 'jpg', 'svg', 'webp'],
    boost: 3
  },
  'design-workflow': {
    keywords: ['design', 'creative', 'workflow', 'adobe', 'canva'],
    formats: ['ai', 'eps', 'svg', 'pdf'],
    boost: 2
  },
  'mobile-first': {
    keywords: ['mobile', 'app', 'responsive', 'retina', 'icon'],
    formats: ['svg', 'png', 'webp', 'avif'],
    boost: 3
  }
}

// Topic clusters for semantic relationship scoring
export const topicClusters = {
  'web-optimization': {
    keywords: ['web', 'website', 'optimize', 'performance', 'responsive'],
    formats: ['svg', 'webp', 'avif', 'png'],
    boost: 4
  },
  'print-ready': {
    keywords: ['print', 'high-quality', 'vector', 'scalable'],
    formats: ['svg', 'eps', 'ai', 'pdf'],
    boost: 3
  },
  'social-media': {
    keywords: ['social', 'share', 'profile', 'avatar', 'icon'],
    formats: ['png', 'jpg', 'svg', 'webp'],
    boost: 3
  },
  'design-workflow': {
    keywords: ['design', 'creative', 'workflow', 'adobe', 'canva'],
    formats: ['ai', 'eps', 'svg', 'pdf'],
    boost: 2
  },
  'mobile-first': {
    keywords: ['mobile', 'app', 'responsive', 'retina', 'icon'],
    formats: ['svg', 'png', 'webp', 'avif'],
    boost: 3
  }
}

// User journey optimization paths with enhanced funnel design
export const conversionFunnels = {
  'free-to-paid': {
    name: 'Free to Premium Journey',
    steps: ['png-to-svg', 'svg-to-png', 'jpg-to-svg', 'ai-icon-generator'],
    conversionPoints: {
      'png-to-svg': ['Try AI-powered vectorization', 'Create custom SVG icons'],
      'svg-to-png': ['Export as video', 'Batch convert with premium'],
      'jpg-to-svg': ['AI-enhanced conversion', 'Remove backgrounds']
    }
  },
  'basic-to-advanced': {
    name: 'Basic to Advanced Tools',
    steps: ['svg-converter', 'svg-to-png', 'animate', 'ai-icon-generator'],
    conversionPoints: {
      'svg-converter': ['Try specific converters', 'Use advanced options'],
      'animate': ['Export animations as video', 'Create complex animations']
    }
  },
  'discover-to-create': {
    name: 'Discovery to Creation',
    steps: ['gallery', 'converter', 'animate', 'ai-icon-generator'],
    conversionPoints: {
      'gallery': ['Create similar designs', 'Customize existing SVGs'],
      'converter': ['Generate new designs', 'Batch process files']
    }
  },
  'research-to-convert': {
    name: 'Research to Conversion',
    steps: ['learn', 'converter', 'gallery', 'ai-icon-generator'],
    conversionPoints: {
      'learn': ['Try it yourself', 'See examples'],
      'converter': ['Advanced features', 'Premium tools']
    }
  }
}

// Strategic link distribution rules
export const linkDistributionRules = {
  maxLinksPerSection: 6,
  minLinksPerSection: 3,
  priorityBoost: {
    reverseConverter: 10,
    sameFormatFamily: 5,
    highSearchVolume: 3,
    topicCluster: 2
  },
  diversityRules: {
    maxSameFormat: 2,
    requireDiverseAnchors: true,
    balanceSearchVolume: true
  }
}

// Get reverse converter (e.g., png-to-svg -> svg-to-png)
export function getReverseConverter(config: ConverterConfig): ConverterConfig | null {
  const reverseId = `${config.toFormat.toLowerCase()}-to-${config.fromFormat.toLowerCase()}`
  return converterConfigs.find(c => c.id === reverseId) || null
}

// Get converters in the same format family
export function getFormatFamilyConverters(config: ConverterConfig): ConverterConfig[] {
  const format = config.fromFormat.toLowerCase()
  const families = Object.entries(formatFamilies).filter(([_, formats]) => 
    formats.includes(format)
  )
  
  if (families.length === 0) return []
  
  const relatedFormats = new Set<string>()
  families.forEach(([_, formats]) => {
    formats.forEach(f => relatedFormats.add(f))
  })
  
  return converterConfigs.filter(c => 
    c.id !== config.id && (
      relatedFormats.has(c.fromFormat.toLowerCase()) ||
      relatedFormats.has(c.toFormat.toLowerCase())
    )
  )
}

// Get related converters based on technology/use case
export function getRelatedConverters(config: ConverterConfig, limit: number = 6): ConverterConfig[] {
  const related: Array<{ converter: ConverterConfig; score: number }> = []
  
  converterConfigs.forEach(c => {
    if (c.id === config.id) return
    
    let score = 0
    
    // Same source format (high relevance)
    if (c.fromFormat === config.fromFormat) score += 5
    
    // Same target format (high relevance)
    if (c.toFormat === config.toFormat) score += 5
    
    // Reverse converter (highest relevance)
    if (c.id === `${config.toFormat.toLowerCase()}-to-${config.fromFormat.toLowerCase()}`) {
      score += 10
    }
    
    // Same format family
    const configFamilies = Object.entries(formatFamilies)
      .filter(([_, formats]) => 
        formats.includes(config.fromFormat.toLowerCase()) ||
        formats.includes(config.toFormat.toLowerCase())
      )
      .map(([family]) => family)
    
    const cFamilies = Object.entries(formatFamilies)
      .filter(([_, formats]) => 
        formats.includes(c.fromFormat.toLowerCase()) ||
        formats.includes(c.toFormat.toLowerCase())
      )
      .map(([family]) => family)
    
    const sharedFamilies = configFamilies.filter(f => cFamilies.includes(f))
    score += sharedFamilies.length * 2
    
    // Semantic relationship scoring via topic clusters
    Object.entries(topicClusters).forEach(([_, cluster]) => {
      const configInCluster = cluster.formats.some(f => 
        f === config.fromFormat.toLowerCase() || f === config.toFormat.toLowerCase()
      )
      const cInCluster = cluster.formats.some(f => 
        f === c.fromFormat.toLowerCase() || f === c.toFormat.toLowerCase()
      )
      if (configInCluster && cInCluster) {
        score += cluster.boost
      }
    })
    
    // User journey optimization - boost conversion funnel paths
    Object.entries(conversionFunnels).forEach(([_, funnel]) => {
      if (funnel.steps.includes(config.id) && funnel.steps.includes(c.id)) {
        const configIndex = funnel.steps.indexOf(config.id)
        const cIndex = funnel.steps.indexOf(c.id)
        // Boost adjacent steps in funnel more than distant ones
        const distance = Math.abs(configIndex - cIndex)
        if (distance === 1) score += 6      // Next step in funnel
        else if (distance === 2) score += 3 // Two steps ahead
        else if (distance <= 3) score += 1  // Within funnel
      }
    })
    
    // Enhanced search volume weighting for SEO empire growth
    if (c.searchVolume > 50000) score += 8      // Ultra-high volume
    if (c.searchVolume > 30000) score += 6      // Very high volume
    if (c.searchVolume > 10000) score += 5      // High volume boost
    if (c.searchVolume > 5000) score += 3       // Medium volume
    if (c.searchVolume > 1000) score += 1       // Base volume
    
    if (score > 0) {
      related.push({ converter: c, score })
    }
  })
  
  // Sort by score and return top converters
  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.converter)
}

// Enhanced hub page converters with topic clustering
export function getHubPageConverters(hubFormat: string): ConverterConfig[] {
  const format = hubFormat.toLowerCase()
  return converterConfigs.filter(c => 
    c.fromFormat.toLowerCase() === format || 
    c.toFormat.toLowerCase() === format
  ).sort((a, b) => b.searchVolume - a.searchVolume)
}

// Get converters by topic cluster for strategic hub pages
export function getTopicClusterConverters(clusterName: keyof typeof topicClusters): ConverterConfig[] {
  const cluster = topicClusters[clusterName]
  if (!cluster) return []
  
  return converterConfigs.filter(c => 
    cluster.formats.includes(c.fromFormat.toLowerCase()) ||
    cluster.formats.includes(c.toFormat.toLowerCase())
  ).sort((a, b) => b.searchVolume - a.searchVolume)
}

// Get image converters hub (PNG, JPG, WebP → SVG focus)
export function getImageConvertersHub(): {
  primary: ConverterConfig[]
  secondary: ConverterConfig[]
  total_searches: number
} {
  const imageFormats = formatFamilies.image
  const converters = converterConfigs.filter(c => 
    imageFormats.includes(c.fromFormat.toLowerCase()) ||
    imageFormats.includes(c.toFormat.toLowerCase())
  )
  
  // Prioritize SVG conversions for monetization funnel
  const primary = converters.filter(c => 
    c.toFormat.toLowerCase() === 'svg' || c.fromFormat.toLowerCase() === 'svg'
  ).sort((a, b) => b.searchVolume - a.searchVolume)
  
  const secondary = converters.filter(c => 
    !primary.includes(c)
  ).sort((a, b) => b.searchVolume - a.searchVolume)
  
  const total_searches = converters.reduce((sum, c) => sum + c.searchVolume, 0)
  
  return { primary, secondary, total_searches }
}

// Get vector converters hub (SVG, PDF, EPS focus)
export function getVectorConvertersHub(): {
  primary: ConverterConfig[]
  secondary: ConverterConfig[]
  total_searches: number
} {
  const vectorFormats = formatFamilies.vector
  const converters = converterConfigs.filter(c => 
    vectorFormats.includes(c.fromFormat.toLowerCase()) ||
    vectorFormats.includes(c.toFormat.toLowerCase())
  )
  
  // Prioritize high-volume SVG conversions
  const primary = converters.filter(c => 
    c.searchVolume > 10000 && (
      c.toFormat.toLowerCase() === 'svg' || c.fromFormat.toLowerCase() === 'svg'
    )
  ).sort((a, b) => b.searchVolume - a.searchVolume)
  
  const secondary = converters.filter(c => 
    !primary.includes(c)
  ).sort((a, b) => b.searchVolume - a.searchVolume)
  
  const total_searches = converters.reduce((sum, c) => sum + c.searchVolume, 0)
  
  return { primary, secondary, total_searches }
}

// Authority flow optimization - get high-authority pages to link to
export function getAuthorityFlowTargets(sourceConfig: ConverterConfig): {
  high_authority: ConverterConfig[]
  medium_authority: ConverterConfig[]
  long_tail: ConverterConfig[]
} {
  const related = getRelatedConverters(sourceConfig, 20)
  
  const high_authority = related.filter(c => c.searchVolume > 30000)
  const medium_authority = related.filter(c => c.searchVolume >= 5000 && c.searchVolume <= 30000)
  const long_tail = related.filter(c => c.searchVolume < 5000)
  
  return { high_authority, medium_authority, long_tail }
}

// Generate strategic cross-linking recommendations for hub pages
export function getStrategicHubLinks(): {
  image_hub: { converters: ConverterConfig[], searches: number }
  vector_hub: { converters: ConverterConfig[], searches: number }
  web_optimization: ConverterConfig[]
  print_ready: ConverterConfig[]
  mobile_first: ConverterConfig[]
} {
  const imageHub = getImageConvertersHub()
  const vectorHub = getVectorConvertersHub()
  
  return {
    image_hub: {
      converters: imageHub.primary.slice(0, 8),
      searches: imageHub.total_searches
    },
    vector_hub: {
      converters: vectorHub.primary.slice(0, 8),
      searches: vectorHub.total_searches
    },
    web_optimization: getTopicClusterConverters('web-optimization').slice(0, 6),
    print_ready: getTopicClusterConverters('print-ready').slice(0, 6),
    mobile_first: getTopicClusterConverters('mobile-first').slice(0, 6)
  }
}

// Get format-specific hub organization for /convert landing page
export function getConvertLandingPageStructure(): {
  hero_converters: ConverterConfig[]
  by_format: { [key: string]: ConverterConfig[] }
  by_use_case: { [key: string]: ConverterConfig[] }
  total_monthly_searches: number
} {
  // Hero converters: highest search volume
  const hero_converters = converterConfigs
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 12)
  
  // Organize by source format
  const by_format: { [key: string]: ConverterConfig[] } = {}
  Object.keys(formatFamilies).forEach(family => {
    by_format[family] = converterConfigs.filter(c => 
      formatFamilies[family as keyof typeof formatFamilies].includes(c.fromFormat.toLowerCase())
    ).sort((a, b) => b.searchVolume - a.searchVolume)
  })
  
  // Organize by use case
  const by_use_case: { [key: string]: ConverterConfig[] } = {}
  Object.entries(topicClusters).forEach(([name, cluster]) => {
    by_use_case[name] = getTopicClusterConverters(name as keyof typeof topicClusters)
  })
  
  const total_monthly_searches = converterConfigs.reduce((sum, c) => sum + c.searchVolume, 0)
  
  return { hero_converters, by_format, by_use_case, total_monthly_searches }
}

// Get learning page links for a converter
export function getLearningPageLinks(config: ConverterConfig): Array<{ href: string; title: string }> {
  const links: Array<{ href: string; title: string }> = []
  
  // Add format-specific learning pages
  if (config.fromFormat.toLowerCase() === 'svg' || config.toFormat.toLowerCase() === 'svg') {
    links.push(
      { href: '/learn/what-is-svg', title: 'What is SVG?' },
      { href: '/learn/svg-file-format', title: 'SVG File Format Guide' }
    )
  }
  
  if (config.fromFormat.toLowerCase() === 'png' || config.toFormat.toLowerCase() === 'png') {
    links.push({ href: '/learn/convert-png-to-svg', title: 'PNG to SVG Conversion Guide' })
  }
  
  // Add converter-specific learning pages
  if (config.id === 'svg-to-png' || config.id === 'png-to-svg') {
    links.push({ href: '/learn/convert-svg-to-png-windows', title: 'Convert SVG to PNG on Windows' })
  }
  
  // Add general converter guides
  links.push({ href: '/learn/best-svg-converters', title: 'Best SVG Converters' })
  
  return links.slice(0, 3) // Limit to 3 learning links
}

// Get gallery links related to converter
export function getRelatedGalleryLinks(config: ConverterConfig): Array<{ href: string; title: string }> {
  const galleries: Array<{ href: string; title: string }> = []
  
  // SVG-related converters link to popular galleries
  if (config.toFormat.toLowerCase() === 'svg') {
    galleries.push(
      { href: '/gallery/heart-svg', title: 'Heart SVG Gallery' },
      { href: '/gallery/icon-svg', title: 'Icon SVG Gallery' },
      { href: '/gallery/star-svg', title: 'Star SVG Gallery' }
    )
  }
  
  // Image converters link to design galleries
  if (formatFamilies.image.includes(config.fromFormat.toLowerCase())) {
    galleries.push(
      { href: '/gallery/flower-svg', title: 'Flower SVG Designs' },
      { href: '/gallery/animal-svg', title: 'Animal SVG Graphics' }
    )
  }
  
  return galleries.slice(0, 3)
}

// Anchor text variations for natural link diversity
const anchorTextVariations = {
  exact: (from: string, to: string) => `${from} to ${to}`,
  branded: (from: string, to: string) => `Convert ${from} to ${to} with SVG AI`,
  natural: [
    'Convert your files',
    'Try this converter',
    'Free conversion tool',
    'Transform your images',
    'Quick file conversion',
    'Online converter',
    'Change format easily',
    'Easy conversion',
    'Simple converter',
    'Transform files here'
  ],
  action: [
    'Convert now',
    'Transform files',
    'Change format',
    'Get started',
    'Try it free',
    'Convert online',
    'Download converted',
    'Start converting',
    'Begin conversion',
    'Process files'
  ],
  benefit: [
    'High-quality conversion',
    'Fast and secure',
    'No signup required',
    'Professional results',
    'Maintain quality',
    'Free online tool',
    'Instant results',
    'Preserve quality',
    'Quick processing',
    'Secure conversion'
  ],
  contextual: {
    gallery: [
      'Convert these designs',
      'Transform this style',
      'Use with converter',
      'Download and convert'
    ],
    learn: [
      'Try it yourself',
      'Practice with converter',
      'See it in action',
      'Test the tool'
    ],
    converter: [
      'Also try',
      'Similar tool',
      'Alternative converter',
      'Related conversion'
    ]
  }
}

// Enhanced contextual link text with diversity scoring
export function getContextualLinkText(
  from: ConverterConfig, 
  to: ConverterConfig, 
  variation: 'exact' | 'branded' | 'natural' | 'action' | 'benefit' = 'exact',
  context?: 'gallery' | 'learn' | 'converter'
): string {
  // Reverse converter gets highest priority phrasing
  if (to.id === getReverseConverter(from)?.id) {
    const phrases = [
      `Need to convert back? Try ${to.title}`,
      `Reverse the process with ${to.fromFormat} to ${to.toFormat}`,
      `Convert back to ${to.toFormat} format`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
  
  // Same source format variations
  if (to.fromFormat === from.fromFormat) {
    const phrases = [
      `Also convert ${from.fromFormat} to ${to.toFormat}`,
      `Try ${from.fromFormat} to ${to.toFormat} conversion`,
      `Convert ${from.fromFormat} files to ${to.toFormat}`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
  
  // Same target format variations
  if (to.toFormat === from.toFormat) {
    const phrases = [
      `Convert ${to.fromFormat} to ${from.toFormat} instead`,
      `Try ${to.fromFormat} to ${to.toFormat} converter`,
      `${to.fromFormat} to ${to.toFormat} conversion tool`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
  
  // Context-specific variations
  if (context && anchorTextVariations.contextual[context]) {
    const contextualText = anchorTextVariations.contextual[context][
      Math.floor(Math.random() * anchorTextVariations.contextual[context].length)
    ]
    return `${contextualText}: ${to.fromFormat} to ${to.toFormat}`
  }
  
  // Apply variation strategy
  switch (variation) {
    case 'branded':
      return anchorTextVariations.branded(to.fromFormat, to.toFormat)
    case 'natural':
      const naturalText = anchorTextVariations.natural[Math.floor(Math.random() * anchorTextVariations.natural.length)]
      return `${naturalText} (${to.fromFormat} → ${to.toFormat})`
    case 'action':
      const actionText = anchorTextVariations.action[Math.floor(Math.random() * anchorTextVariations.action.length)]
      return `${actionText}: ${to.fromFormat} to ${to.toFormat}`
    case 'benefit':
      const benefitText = anchorTextVariations.benefit[Math.floor(Math.random() * anchorTextVariations.benefit.length)]
      return `${benefitText} - ${to.title}`
    case 'exact':
    default:
      return anchorTextVariations.exact(to.fromFormat, to.toFormat)
  }
}

// Get popular conversions for homepage or high-traffic pages
export function getPopularConversions(limit: number = 12): {
  trending: ConverterConfig[]
  mostUsed: ConverterConfig[]
  aiPowered: ConverterConfig[]
} {
  const allConverters = converterConfigs.filter(c => c.isSupported)
  
  // Trending: High search volume converters
  const trending = allConverters
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit)
  
  // Most Used: Balanced mix of high and medium volume
  const mostUsed = [
    ...allConverters.filter(c => c.searchVolume > 30000).slice(0, 4),
    ...allConverters.filter(c => c.searchVolume > 10000 && c.searchVolume <= 30000).slice(0, 4),
    ...allConverters.filter(c => c.searchVolume > 5000 && c.searchVolume <= 10000).slice(0, 4)
  ].slice(0, limit)
  
  // AI-Powered: Converters that lead to AI tools
  const aiPowered = allConverters
    .filter(c => 
      c.toFormat.toLowerCase() === 'svg' || 
      c.fromFormat.toLowerCase() === 'svg' ||
      c.id.includes('svg')
    )
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit)
  
  return { trending, mostUsed, aiPowered }
}

// Generate internal links for content (blog posts, learn pages)
export function generateContentInternalLinks(
  content: string,
  currentPath: string,
  options: {
    maxLinks?: number
    linkDensity?: number // links per 1000 words
    preferredFormats?: string[]
    avoidDuplicates?: boolean
  } = {}
): { content: string; linksAdded: number } {
  const {
    maxLinks = 10,
    linkDensity = 3,
    preferredFormats = [],
    avoidDuplicates = true
  } = options
  
  const wordCount = content.split(/\s+/).length
  const targetLinks = Math.min(maxLinks, Math.floor(wordCount / 1000 * linkDensity))
  
  let modifiedContent = content
  let linksAdded = 0
  const addedLinks = new Set<string>()
  
  // Find relevant converters based on content
  const relevantConverters = converterConfigs.filter(c => {
    const isPreferred = preferredFormats.length === 0 || 
      preferredFormats.includes(c.fromFormat.toLowerCase()) ||
      preferredFormats.includes(c.toFormat.toLowerCase())
    
    const isRelevant = content.toLowerCase().includes(c.fromFormat.toLowerCase()) ||
      content.toLowerCase().includes(c.toFormat.toLowerCase()) ||
      c.keywords.some(k => content.toLowerCase().includes(k.toLowerCase()))
    
    return c.isSupported && isPreferred && isRelevant
  }).sort((a, b) => b.searchVolume - a.searchVolume)
  
  // Add links for converter mentions
  for (const converter of relevantConverters) {
    if (linksAdded >= targetLinks) break
    if (avoidDuplicates && addedLinks.has(converter.id)) continue
    
    // Look for natural mentions to link
    const patterns = [
      new RegExp(`\\b${converter.fromFormat} to ${converter.toFormat}\\b`, 'gi'),
      new RegExp(`\\bconvert ${converter.fromFormat} to ${converter.toFormat}\\b`, 'gi'),
      new RegExp(`\\b${converter.fromFormat}2${converter.toFormat}\\b`, 'gi')
    ]
    
    for (const pattern of patterns) {
      const match = modifiedContent.match(pattern)
      if (match && (!avoidDuplicates || !addedLinks.has(converter.id))) {
        const linkText = match[0]
        const link = `<Link href="/convert/${converter.urlSlug}">${linkText}</Link>`
        modifiedContent = modifiedContent.replace(pattern, link)
        addedLinks.add(converter.id)
        linksAdded++
        break
      }
    }
  }
  
  return { content: modifiedContent, linksAdded }
}

// Get strategic hub page structure for maximum link equity distribution
export function getStrategicHubStructure(): {
  primaryHubs: Array<{ title: string; url: string; converters: ConverterConfig[] }>
  secondaryHubs: Array<{ title: string; url: string; converters: ConverterConfig[] }>
  topicalHubs: Array<{ title: string; url: string; description: string; converters: ConverterConfig[] }>
} {
  // Primary hubs - highest search volume categories
  const primaryHubs = [
    {
      title: 'SVG Converters',
      url: '/convert/svg-converters',
      converters: converterConfigs
        .filter(c => c.toFormat === 'SVG' || c.fromFormat === 'SVG')
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, 12)
    },
    {
      title: 'Image Converters',
      url: '/convert/image-converters',
      converters: converterConfigs
        .filter(c => formatFamilies.image.includes(c.fromFormat.toLowerCase()))
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, 12)
    },
    {
      title: 'Vector Converters',
      url: '/convert/vector-converters',
      converters: converterConfigs
        .filter(c => formatFamilies.vector.includes(c.fromFormat.toLowerCase()))
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, 12)
    }
  ]
  
  // Secondary hubs - medium search volume categories
  const secondaryHubs = [
    {
      title: 'Professional Design Converters',
      url: '/convert/professional-converters',
      converters: converterConfigs
        .filter(c => ['ai', 'eps', 'pdf'].includes(c.fromFormat.toLowerCase()) ||
                     ['ai', 'eps', 'pdf'].includes(c.toFormat.toLowerCase()))
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, 8)
    },
    {
      title: 'CAD & 3D Converters',
      url: '/convert/cad-converters',
      converters: converterConfigs
        .filter(c => ['dxf', 'stl'].includes(c.fromFormat.toLowerCase()) ||
                     ['dxf', 'stl'].includes(c.toFormat.toLowerCase()))
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, 8)
    }
  ]
  
  // Topical hubs - use case based
  const topicalHubs = Object.entries(topicClustersEnhanced)
    .filter(([_, cluster]) => 'hubUrl' in cluster && cluster.hubUrl)
    .map(([key, cluster]) => {
      const fullCluster = cluster as typeof topicClustersEnhanced['vector-conversion']
      return {
        title: fullCluster.name,
        url: fullCluster.hubUrl,
        description: fullCluster.description,
        converters: getTopicClusterConverters(key as keyof typeof topicClusters).slice(0, 8)
      }
    })
  
  return { primaryHubs, secondaryHubs, topicalHubs }
}

// Calculate link equity flow for a page
export function calculateLinkEquityFlow(
  pageConfig: ConverterConfig,
  outboundLinks: ConverterConfig[]
): {
  equityScore: number
  distribution: Array<{ converter: ConverterConfig; equityShare: number }>
  recommendations: string[]
} {
  // Base equity from search volume
  const baseEquity = Math.log10(pageConfig.searchVolume + 1) * 10
  
  // Calculate distribution
  const totalOutboundValue = outboundLinks.reduce((sum, link) => 
    sum + Math.log10(link.searchVolume + 1), 0
  )
  
  const distribution = outboundLinks.map(link => ({
    converter: link,
    equityShare: totalOutboundValue > 0 
      ? (Math.log10(link.searchVolume + 1) / totalOutboundValue) * baseEquity
      : 0
  }))
  
  // Generate recommendations
  const recommendations: string[] = []
  
  if (outboundLinks.length > 15) {
    recommendations.push('Consider reducing outbound links to concentrate link equity')
  }
  
  if (!outboundLinks.find(l => l.searchVolume > 30000)) {
    recommendations.push('Add links to high-authority pages (30k+ searches)')
  }
  
  const reverseConverter = getReverseConverter(pageConfig)
  if (reverseConverter && !outboundLinks.find(l => l.id === reverseConverter.id)) {
    recommendations.push(`Add link to reverse converter: ${reverseConverter.title}`)
  }
  
  return {
    equityScore: baseEquity,
    distribution,
    recommendations
  }
}