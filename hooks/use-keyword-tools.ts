'use client'

import { useEffect, useState } from 'react'
import { 
  KeywordMapping,
  ToolMapping,
  ConverterConfig,
  getToolDetails,
  generateCtaConfig,
  keywordMappings,
  generateSidebarTools,
  getAbTestVariant
} from '@/lib/keyword-tool-mapping'

interface EnhancedToolMapping extends ToolMapping {
  details?: ConverterConfig
  ctaConfig?: ReturnType<typeof generateCtaConfig>
}

interface UseKeywordToolsReturn {
  mapping?: KeywordMapping
  tools: EnhancedToolMapping[]
  primaryTools: EnhancedToolMapping[]
  secondaryTools: EnhancedToolMapping[]
  relatedTools: EnhancedToolMapping[]
  sidebarTools: Array<ConverterConfig & { mapping?: ToolMapping }>
  hasTools: boolean
  abVariant: 'A' | 'B'
  isLoading: boolean
}

export function useKeywordTools(
  keyword: string,
  userId?: string
): UseKeywordToolsReturn {
  const [data, setData] = useState<UseKeywordToolsReturn>({
    tools: [],
    primaryTools: [],
    secondaryTools: [],
    relatedTools: [],
    sidebarTools: [],
    hasTools: false,
    abVariant: 'A',
    isLoading: true
  })
  
  useEffect(() => {
    // Find the mapping for this keyword
    const mapping = keywordMappings.find(m => 
      m.keyword === keyword || m.pageSlug === keyword
    )
    
    if (!mapping) {
      setData({
        tools: [],
        primaryTools: [],
        secondaryTools: [],
        relatedTools: [],
        sidebarTools: [],
        hasTools: false,
        abVariant: getAbTestVariant(userId),
        isLoading: false
      })
      return
    }
    
    // Enhance tool mappings with details and CTA configs
    const enhancedTools = mapping.mappings.map(toolMapping => ({
      ...toolMapping,
      details: getToolDetails(toolMapping.toolId),
      ctaConfig: generateCtaConfig(
        toolMapping,
        mapping.searchVolume
      )
    }))
    
    // Categorize tools by relevance
    const primaryTools = enhancedTools.filter(t => t.relevance === 'primary')
    const secondaryTools = enhancedTools.filter(t => t.relevance === 'secondary')
    const relatedTools = enhancedTools.filter(t => t.relevance === 'related')
    
    // Generate sidebar tools
    const sidebarTools = generateSidebarTools(keyword)
    
    setData({
      mapping,
      tools: enhancedTools,
      primaryTools,
      secondaryTools,
      relatedTools,
      sidebarTools,
      hasTools: enhancedTools.length > 0,
      abVariant: getAbTestVariant(userId),
      isLoading: false
    })
  }, [keyword, userId])
  
  return data
}

// Hook for tracking conversions
export function useToolConversion() {
  const trackConversion = (
    toolId: string,
    source: string,
    conversionType: 'click' | 'use' | 'complete'
  ) => {
    // Conversion tracking removed - using Vercel Analytics
  }
  
  return { trackConversion }
}

// Hook for A/B test tracking
export function useAbTest(testName: string, userId?: string) {
  const variant = getAbTestVariant(userId)
  
  useEffect(() => {
    // A/B test tracking removed - using Vercel Analytics
  }, [testName, variant, userId])
  
  return { variant }
}