'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKeywordTools, trackToolClick, getAbTestVariant } from '@/lib/keyword-tool-mapping'
import { cn } from '@/lib/utils'

interface RelatedToolsSidebarProps {
  keyword: string
  className?: string
  userId?: string
  position?: 'sidebar' | 'inline'
}

export function RelatedToolsSidebar({ 
  keyword, 
  className,
  userId,
  position = 'sidebar'
}: RelatedToolsSidebarProps) {
  const { sidebarTools, mapping } = useKeywordTools(keyword)
  const abVariant = getAbTestVariant(userId)
  
  if (!sidebarTools.length) return null
  
  const handleToolClick = (toolId: string, index: number) => {
    trackToolClick(
      toolId,
      keyword,
      `${position}_${index}`,
      abVariant
    )
  }
  
  return (
    <Card className={cn(
      "sticky top-24",
      position === 'sidebar' ? 'w-full max-w-sm' : 'w-full',
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Related Tools
        </CardTitle>
        <CardDescription>
          Explore more conversion options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sidebarTools.map((tool, index) => {
          const isPrimary = tool.mapping?.relevance === 'primary'
          const isHighTraffic = tool.searchVolume >= 10000
          
          return (
            <Link
              key={tool.id}
              href={`/convert/${tool.urlSlug}`}
              onClick={() => handleToolClick(tool.id, index)}
              className="block"
            >
              <Card className={cn(
                "transition-all hover:shadow-md cursor-pointer",
                isPrimary && "border-primary",
                isHighTraffic && "bg-gradient-to-r from-primary/5 to-primary/10"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tool.metaDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {tool.isSupported ? (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Available Now
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                    
                    {isHighTraffic && (
                      <Badge variant="default" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  {tool.mapping?.customCta && (
                    <p className="text-xs font-medium text-primary mt-2">
                      {tool.mapping.customCta}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
        
        <div className="pt-2 border-t">
          <Link href="/convert" className="block">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => trackToolClick('all-tools', keyword, `${position}_view_all`, abVariant)}
            >
              View All Converters
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}