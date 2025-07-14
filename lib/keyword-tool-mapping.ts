/**
 * Keyword to Tool Mapping System
 * 
 * Maps educational content keywords to relevant conversion tools
 * with dynamic CTA generation based on search volume
 */

import { ConverterConfig, converterConfigs } from '@/app/convert/converter-config'

// Re-export ConverterConfig for external use
export type { ConverterConfig } from '@/app/convert/converter-config'

// Types for the mapping system
export interface ToolMapping {
  toolId: string
  relevance: 'primary' | 'secondary' | 'related'
  ctaVariant?: 'prominent' | 'standard' | 'subtle'
  customCta?: string
}

export interface KeywordMapping {
  keyword: string
  pageSlug: string
  searchVolume: number
  mappings: ToolMapping[]
  primaryFocus?: string
  contextualInfo?: string
}

export interface CtaConfig {
  variant: 'prominent' | 'standard' | 'subtle'
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
  trackingId: string
  abTestVariant?: 'A' | 'B'
}

// Keyword mappings for all 12 learn pages
export const keywordMappings: KeywordMapping[] = [
  {
    keyword: 'convert-png-to-svg',
    pageSlug: 'convert-png-to-svg',
    searchVolume: 40500,
    primaryFocus: 'PNG to SVG conversion',
    mappings: [
      {
        toolId: 'png-to-svg',
        relevance: 'primary',
        ctaVariant: 'prominent',
        customCta: 'Try Our Free PNG to SVG Converter'
      },
      {
        toolId: 'image-to-svg',
        relevance: 'secondary',
        ctaVariant: 'standard'
      },
      {
        toolId: 'jpg-to-svg',
        relevance: 'related',
        ctaVariant: 'subtle'
      }
    ]
  },
  {
    keyword: 'convert-svg-to-png-windows',
    pageSlug: 'convert-svg-to-png-windows',
    searchVolume: 33100,
    primaryFocus: 'SVG to PNG on Windows',
    contextualInfo: 'Windows-specific instructions',
    mappings: [
      {
        toolId: 'svg-to-png',
        relevance: 'primary',
        ctaVariant: 'prominent',
        customCta: 'Convert SVG to PNG Online - Works on Windows!'
      },
      {
        toolId: 'batch-svg-to-png',
        relevance: 'secondary',
        ctaVariant: 'standard',
        customCta: 'Need to Convert Multiple Files?'
      }
    ]
  },
  {
    keyword: 'best-svg-converters',
    pageSlug: 'best-svg-converters',
    searchVolume: 33100,
    primaryFocus: 'Comprehensive converter comparison',
    mappings: [
      {
        toolId: 'svg-converter',
        relevance: 'primary',
        ctaVariant: 'prominent'
      },
      {
        toolId: 'png-to-svg',
        relevance: 'primary',
        ctaVariant: 'prominent'
      },
      {
        toolId: 'svg-to-png',
        relevance: 'primary',
        ctaVariant: 'prominent'
      },
      {
        toolId: 'jpg-to-svg',
        relevance: 'secondary'
      },
      {
        toolId: 'svg-to-pdf',
        relevance: 'secondary'
      }
    ]
  },
  {
    keyword: 'what-is-svg',
    pageSlug: 'what-is-svg',
    searchVolume: 33100,
    primaryFocus: 'SVG format education',
    mappings: [
      {
        toolId: 'svg-converter',
        relevance: 'secondary',
        ctaVariant: 'subtle',
        customCta: 'Ready to Create Your First SVG?'
      },
      {
        toolId: 'png-to-svg',
        relevance: 'related'
      },
      {
        toolId: 'svg-to-png',
        relevance: 'related'
      }
    ]
  },
  {
    keyword: 'svg-file',
    pageSlug: 'svg-file',
    searchVolume: 14800,
    primaryFocus: 'SVG file format details',
    mappings: [
      {
        toolId: 'svg-converter',
        relevance: 'secondary',
        ctaVariant: 'standard'
      },
      {
        toolId: 'svg-optimizer',
        relevance: 'secondary',
        customCta: 'Optimize Your SVG Files'
      },
      {
        toolId: 'svg-to-png',
        relevance: 'related'
      }
    ]
  },
  {
    keyword: 'svg-file-format',
    pageSlug: 'svg-file-format',
    searchVolume: 9900,
    primaryFocus: 'Technical SVG format details',
    mappings: [
      {
        toolId: 'svg-converter',
        relevance: 'secondary'
      },
      {
        toolId: 'image-to-svg',
        relevance: 'secondary'
      },
      {
        toolId: 'svg-to-pdf',
        relevance: 'related'
      }
    ]
  },
  {
    keyword: 'svg-animation',
    pageSlug: 'svg-css-animation',
    searchVolume: 4400,
    primaryFocus: 'SVG animation techniques',
    mappings: [
      {
        toolId: 'svg-animation-tool',
        relevance: 'primary',
        ctaVariant: 'prominent',
        customCta: 'Create Animated SVGs'
      },
      {
        toolId: 'svg-to-mp4',
        relevance: 'secondary',
        customCta: 'Export Animations to Video'
      }
    ]
  },
  {
    keyword: 'react-native-svg-animation',
    pageSlug: 'react-native-svg-animation',
    searchVolume: 1900,
    primaryFocus: 'React Native SVG animations',
    contextualInfo: 'Developer-focused content',
    mappings: [
      {
        toolId: 'svg-animation-tool',
        relevance: 'secondary',
        ctaVariant: 'subtle'
      },
      {
        toolId: 'svg-optimizer',
        relevance: 'secondary',
        customCta: 'Optimize SVGs for React Native'
      }
    ]
  },
  {
    keyword: 'check-svg-animation',
    pageSlug: 'check-svg-animation',
    searchVolume: 1400,
    primaryFocus: 'SVG animation validation',
    mappings: [
      {
        toolId: 'svg-animation-tool',
        relevance: 'primary',
        ctaVariant: 'standard'
      },
      {
        toolId: 'svg-optimizer',
        relevance: 'related'
      }
    ]
  },
  {
    keyword: 'html-string-to-svg-js',
    pageSlug: 'html-string-to-svg-js',
    searchVolume: 880,
    primaryFocus: 'HTML to SVG conversion in JavaScript',
    contextualInfo: 'Developer tutorial',
    mappings: [
      {
        toolId: 'html-to-svg',
        relevance: 'primary',
        ctaVariant: 'standard',
        customCta: 'Try Our HTML to SVG Converter'
      },
      {
        toolId: 'svg-converter',
        relevance: 'related'
      }
    ]
  },
  {
    keyword: 'batch-svg-to-png',
    pageSlug: 'batch-svg-to-png',
    searchVolume: 720,
    primaryFocus: 'Batch conversion guide',
    mappings: [
      {
        toolId: 'batch-svg-to-png',
        relevance: 'primary',
        ctaVariant: 'prominent'
      },
      {
        toolId: 'svg-to-png',
        relevance: 'secondary',
        customCta: 'Convert Single Files'
      }
    ]
  },
  {
    keyword: 'svg-css-animation',
    pageSlug: 'svg-css-animation',
    searchVolume: 2900,
    primaryFocus: 'CSS-based SVG animations',
    mappings: [
      {
        toolId: 'svg-animation-tool',
        relevance: 'primary',
        ctaVariant: 'prominent',
        customCta: 'Create CSS Animations Visually'
      },
      {
        toolId: 'svg-optimizer',
        relevance: 'secondary'
      }
    ]
  }
]

// Get tools for a specific keyword/page
export function getToolsForKeyword(keyword: string): ToolMapping[] {
  const mapping = keywordMappings.find(m => 
    m.keyword === keyword || m.pageSlug === keyword
  )
  return mapping?.mappings || []
}

// Get tool details by ID
export function getToolDetails(toolId: string): ConverterConfig | undefined {
  return converterConfigs.find(config => config.id === toolId)
}

// Generate CTA configuration based on search volume and relevance
export function generateCtaConfig(
  mapping: ToolMapping,
  searchVolume: number,
  position: 'top' | 'middle' | 'bottom' | 'sidebar' = 'middle',
  abTestVariant?: 'A' | 'B'
): CtaConfig {
  // Higher search volume = more prominent CTAs
  let variant: 'prominent' | 'standard' | 'subtle' = mapping.ctaVariant || 'standard'
  
  if (!mapping.ctaVariant) {
    if (searchVolume >= 10000 && mapping.relevance === 'primary') {
      variant = 'prominent'
    } else if (searchVolume < 1000 || mapping.relevance === 'related') {
      variant = 'subtle'
    }
  }

  return {
    variant,
    position,
    trackingId: `cta_${mapping.toolId}_${position}`,
    abTestVariant
  }
}

// Get related tools based on format
export function getRelatedToolsByFormat(
  fromFormat?: string,
  toFormat?: string,
  excludeIds: string[] = []
): ConverterConfig[] {
  return converterConfigs.filter(config => {
    if (excludeIds.includes(config.id)) return false
    
    const matchesFrom = fromFormat && 
      (config.fromFormat.toLowerCase() === fromFormat.toLowerCase() ||
       config.toFormat.toLowerCase() === fromFormat.toLowerCase())
    
    const matchesTo = toFormat &&
      (config.fromFormat.toLowerCase() === toFormat.toLowerCase() ||
       config.toFormat.toLowerCase() === toFormat.toLowerCase())
    
    return matchesFrom || matchesTo
  })
}

// Get tools by relevance for a keyword
export function getToolsByRelevance(
  keyword: string,
  relevance: 'primary' | 'secondary' | 'related'
): Array<ToolMapping & { details?: ConverterConfig }> {
  const tools = getToolsForKeyword(keyword)
  
  return tools
    .filter(tool => tool.relevance === relevance)
    .map(tool => ({
      ...tool,
      details: getToolDetails(tool.toolId)
    }))
}

// Generate sidebar tools based on context
export function generateSidebarTools(
  currentKeyword: string,
  maxTools: number = 5
): Array<ConverterConfig & { mapping?: ToolMapping }> {
  const mappings = getToolsForKeyword(currentKeyword)
  const toolIds = mappings.map(m => m.toolId)
  
  // Get mapped tools first
  const mappedTools = mappings
    .map(mapping => {
      const details = getToolDetails(mapping.toolId)
      return details ? { ...details, mapping } : null
    })
    .filter(Boolean) as Array<ConverterConfig & { mapping: ToolMapping }>
  
  // If we need more tools, get related ones
  if (mappedTools.length < maxTools) {
    const currentMapping = keywordMappings.find(m => m.keyword === currentKeyword)
    const relatedTools = currentMapping?.primaryFocus 
      ? getRelatedToolsByFormat(undefined, undefined, toolIds)
          .slice(0, maxTools - mappedTools.length)
      : []
    
    return [...mappedTools, ...relatedTools]
  }
  
  return mappedTools.slice(0, maxTools)
}

// React Hook for using keyword tools
export function useKeywordTools(keyword: string) {
  const mapping = keywordMappings.find(m => 
    m.keyword === keyword || m.pageSlug === keyword
  )
  
  const tools = mapping?.mappings.map(toolMapping => ({
    ...toolMapping,
    details: getToolDetails(toolMapping.toolId),
    ctaConfig: generateCtaConfig(
      toolMapping,
      mapping.searchVolume
    )
  })) || []
  
  const primaryTools = tools.filter(t => t.relevance === 'primary')
  const secondaryTools = tools.filter(t => t.relevance === 'secondary')
  const relatedTools = tools.filter(t => t.relevance === 'related')
  
  return {
    mapping,
    tools,
    primaryTools,
    secondaryTools,
    relatedTools,
    sidebarTools: generateSidebarTools(keyword),
    hasTools: tools.length > 0
  }
}

// A/B Testing utilities
export function getAbTestVariant(userId?: string): 'A' | 'B' {
  // Simple hash-based assignment
  if (!userId) return Math.random() > 0.5 ? 'A' : 'B'
  
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash = hash & hash
  }
  
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B'
}

// Conversion tracking helper
export function trackToolClick(
  toolId: string,
  source: string,
  position: string,
  abVariant?: 'A' | 'B'
) {
  // Analytics tracking removed to fix TypeScript error
  // Previously tracked: tool_id, source_page, position, ab_variant, timestamp
  // TODO: Implement analytics tracking with proper type definitions
}