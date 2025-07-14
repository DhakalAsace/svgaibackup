/**
 * Keyword Tool Mapping System - Usage Examples
 * 
 * This file demonstrates how to integrate the keyword-to-tool mapping system
 * into your existing learn pages and components.
 */

// ============================================
// EXAMPLE 1: Basic Learn Page Integration
// ============================================

import { LearnPageToolsIntegration } from '@/components/learn-page-tools-integration'

export function ConvertPngToSvgLearnPage() {
  // Get user ID from your auth system
  const userId = 'user-123' // Replace with actual user ID
  
  return (
    <LearnPageToolsIntegration 
      keyword="convert-png-to-svg"
      userId={userId}
    >
      <h1>How to Convert PNG to SVG: Complete Guide</h1>
      <p>
        Converting PNG images to SVG format is essential for creating scalable 
        graphics that maintain quality at any size...
      </p>
      {/* Your existing MDX content */}
    </LearnPageToolsIntegration>
  )
}

// ============================================
// EXAMPLE 2: Manual CTA Placement
// ============================================

import { useKeywordTools } from '@/hooks/use-keyword-tools'
import { DynamicToolCta } from '@/components/dynamic-tool-cta'

export function ManualCtaExample() {
  const { mapping, primaryTools } = useKeywordTools('best-svg-converters')
  
  return (
    <article>
      <h1>Best SVG Converters in 2024</h1>
      
      {/* Place primary tool CTA after introduction */}
      {primaryTools[0] && mapping && (
        <DynamicToolCta
          mapping={primaryTools[0]}
          searchVolume={mapping.searchVolume}
          position="top"
          sourceKeyword="best-svg-converters"
        />
      )}
      
      <p>Your content here...</p>
    </article>
  )
}

// ============================================
// EXAMPLE 3: Custom Sidebar Implementation
// ============================================

import { RelatedToolsSidebar } from '@/components/related-tools-sidebar'

export function CustomLayoutExample() {
  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <main className="lg:col-span-2">
        <h1>Understanding SVG File Format</h1>
        {/* Main content */}
      </main>
      
      <aside>
        <RelatedToolsSidebar 
          keyword="svg-file-format"
          position="sidebar"
        />
      </aside>
    </div>
  )
}

// ============================================
// EXAMPLE 4: Programmatic Tool Access
// ============================================

import { 
  getToolsForKeyword, 
  getToolDetails,
  generateSidebarTools 
} from '@/lib/keyword-tool-mapping'

export function ProgrammaticExample() {
  // Get all tools for a keyword
  const tools = getToolsForKeyword('svg-animation')
  
  // Get specific tool details
  const pngToSvg = getToolDetails('png-to-svg')
  
  // Generate sidebar tools with custom limit
  const sidebarTools = generateSidebarTools('what-is-svg', 3)
  
  return (
    <div>
      <h2>Animation Tools</h2>
      {tools.map(tool => {
        const details = getToolDetails(tool.toolId)
        return details && (
          <a key={tool.toolId} href={`/convert/${details.urlSlug}`}>
            {details.title}
          </a>
        )
      })}
    </div>
  )
}

// ============================================
// EXAMPLE 5: A/B Testing Implementation
// ============================================

import { useAbTest } from '@/hooks/use-keyword-tools'

export function AbTestExample() {
  const { variant } = useAbTest('cta_style_test', 'user-123')
  
  return (
    <div>
      {variant === 'A' ? (
        <button className="bg-blue-500">Convert Now</button>
      ) : (
        <button className="bg-green-500">Start Free Conversion</button>
      )}
    </div>
  )
}

// ============================================
// EXAMPLE 6: MDX Component Integration
// ============================================

// In your MDX components configuration
export const mdxComponents = {
  // Your existing components...
  
  ToolCta: ({ keyword, position = 'middle' }: any) => {
    const { mapping, primaryTools } = useKeywordTools(keyword)
    
    if (!primaryTools[0] || !mapping) return null
    
    return (
      <DynamicToolCta
        mapping={primaryTools[0]}
        searchVolume={mapping.searchVolume}
        position={position}
        sourceKeyword={keyword}
      />
    )
  },
  
  RelatedTools: ({ keyword }: any) => (
    <RelatedToolsSidebar 
      keyword={keyword}
      position="inline"
      className="my-8"
    />
  )
}

// Then in your MDX files:
// <ToolCta keyword="convert-png-to-svg" position="top" />
// <RelatedTools keyword="convert-png-to-svg" />

// ============================================
// EXAMPLE 7: Conversion Tracking
// ============================================

import { useToolConversion } from '@/hooks/use-keyword-tools'

export function ConversionTrackingExample() {
  const { trackConversion } = useToolConversion()
  
  const handleToolUse = (toolId: string) => {
    // Track when user clicks on tool
    trackConversion(toolId, 'learn-page', 'click')
    
    // Track when user actually uses the tool
    trackConversion(toolId, 'learn-page', 'use')
    
    // Track when conversion completes
    trackConversion(toolId, 'learn-page', 'complete')
  }
  
  return (
    <button onClick={() => handleToolUse('png-to-svg')}>
      Use PNG to SVG Converter
    </button>
  )
}

// ============================================
// INTEGRATION CHECKLIST
// ============================================

/**
 * 1. Import the components and hooks you need
 * 2. Wrap your learn page content with LearnPageToolsIntegration
 * 3. Pass the correct keyword (matches the mapping in keyword-tool-mapping.ts)
 * 4. Optionally pass userId for A/B testing and personalization
 * 5. The system will automatically:
 *    - Show relevant tool CTAs based on search volume
 *    - Display a sidebar with related tools
 *    - Track conversions and clicks
 *    - Run A/B tests on CTA styles and layouts
 * 
 * For custom implementations:
 * - Use useKeywordTools hook to get tool data
 * - Place DynamicToolCta components manually
 * - Use RelatedToolsSidebar for custom layouts
 * - Track conversions with useToolConversion
 */