'use client'

import React from 'react'
import { useKeywordTools, useAbTest } from '@/hooks/use-keyword-tools'
import { DynamicToolCta } from '@/components/dynamic-tool-cta'
import { RelatedToolsSidebar } from '@/components/related-tools-sidebar'
import { cn } from '@/lib/utils'

interface LearnPageToolsIntegrationProps {
  keyword: string
  userId?: string
  className?: string
  children: React.ReactNode
}

/**
 * Example integration component for learn pages
 * Shows how to integrate the keyword-to-tool mapping system
 */
export function LearnPageToolsIntegration({
  keyword,
  userId,
  className,
  children
}: LearnPageToolsIntegrationProps) {
  const { 
    mapping, 
    primaryTools, 
    secondaryTools,
    hasTools,
    abVariant
  } = useKeywordTools(keyword, userId)
  
  const { variant: layoutVariant } = useAbTest('learn_page_layout', userId)
  
  if (!hasTools) {
    // No tools mapped for this keyword, render content only
    return <div className={className}>{children}</div>
  }
  
  // Layout A: Sidebar layout for desktop
  if (layoutVariant === 'A') {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8", className)}>
        <article className="prose prose-gray dark:prose-invert max-w-none">
          {/* Primary CTA at the top for high-relevance tools */}
          {primaryTools.length > 0 && mapping && (
            <div className="not-prose mb-8">
              <DynamicToolCta
                mapping={primaryTools[0]}
                searchVolume={mapping.searchVolume}
                position="top"
                sourceKeyword={keyword}
                userId={userId}
              />
            </div>
          )}
          
          {/* Main content */}
          {children}
          
          {/* Secondary CTAs in the middle of content */}
          {secondaryTools.length > 0 && mapping && (
            <div className="not-prose my-8 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Related Tools</h3>
              {secondaryTools.slice(0, 2).map((tool, index) => (
                <DynamicToolCta
                  key={tool.toolId}
                  mapping={tool}
                  searchVolume={mapping.searchVolume}
                  position="middle"
                  sourceKeyword={keyword}
                  userId={userId}
                />
              ))}
            </div>
          )}
          
          {/* Bottom CTA for primary tools */}
          {primaryTools.length > 0 && mapping && (
            <div className="not-prose mt-8">
              <DynamicToolCta
                mapping={primaryTools[0]}
                searchVolume={mapping.searchVolume}
                position="bottom"
                sourceKeyword={keyword}
                userId={userId}
              />
            </div>
          )}
        </article>
        
        {/* Sidebar with related tools */}
        <aside className="hidden lg:block">
          <RelatedToolsSidebar
            keyword={keyword}
            userId={userId}
            position="sidebar"
          />
        </aside>
      </div>
    )
  }
  
  // Layout B: Inline layout with tools mixed in content
  return (
    <article className={cn("prose prose-gray dark:prose-invert max-w-4xl mx-auto", className)}>
      {/* Primary CTA at the top */}
      {primaryTools.length > 0 && mapping && (
        <div className="not-prose mb-8">
          <DynamicToolCta
            mapping={primaryTools[0]}
            searchVolume={mapping.searchVolume}
            position="top"
            sourceKeyword={keyword}
            userId={userId}
          />
        </div>
      )}
      
      {/* Main content */}
      {children}
      
      {/* Inline related tools section */}
      {hasTools && (
        <div className="not-prose my-12">
          <RelatedToolsSidebar
            keyword={keyword}
            userId={userId}
            position="inline"
            className="max-w-2xl mx-auto"
          />
        </div>
      )}
      
      {/* Bottom CTA */}
      {primaryTools.length > 0 && mapping && (
        <div className="not-prose mt-8">
          <DynamicToolCta
            mapping={primaryTools[0]}
            searchVolume={mapping.searchVolume}
            position="bottom"
            sourceKeyword={keyword}
            userId={userId}
          />
        </div>
      )}
    </article>
  )
}

/**
 * Example usage in a learn page:
 * 
 * export default function ConvertPngToSvgPage() {
 *   return (
 *     <LearnPageToolsIntegration 
 *       keyword="convert-png-to-svg"
 *       userId={user?.id}
 *     >
 *       <h1>How to Convert PNG to SVG</h1>
 *       <p>Your educational content here...</p>
 *     </LearnPageToolsIntegration>
 *   )
 * }
 */