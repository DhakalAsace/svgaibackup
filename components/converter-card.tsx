import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCardStyles, getButtonStyles } from '@/lib/design-system'

interface ConverterCardProps {
  title: string
  description: string
  href: string
  isSupported?: boolean
  isPremium?: boolean
  searchVolume?: number
  fromFormat?: string
  toFormat?: string
  className?: string
  variant?: 'default' | 'featured' | 'compact'
}

export function ConverterCard({
  title,
  description,
  href,
  isSupported = true,
  isPremium = false,
  searchVolume,
  fromFormat,
  toFormat,
  className,
  variant = 'default'
}: ConverterCardProps) {
  const cardContent = (
    <>
      <CardHeader className={variant === 'compact' ? 'pb-3' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className={cn(
              "flex items-center gap-2",
              variant === 'compact' ? 'text-lg' : 'text-xl'
            )}>
              {title}
              {isPremium && (
                <Badge variant="default" className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              {!isSupported && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  Coming Soon
                </Badge>
              )}
            </CardTitle>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF7043] transition-colors flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className={variant === 'compact' ? 'pt-0' : ''}>
        <CardDescription className={cn(
          "line-clamp-2",
          variant === 'compact' ? 'text-sm' : ''
        )}>
          {description}
        </CardDescription>
        
        {variant !== 'compact' && (
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            {fromFormat && toFormat && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{fromFormat.toUpperCase()}</span>
                <span>→</span>
                <span className="font-medium">{toFormat.toUpperCase()}</span>
              </div>
            )}
            {!isPremium && (
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>100% Free</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  )

  if (!isSupported) {
    return (
      <Card className={cn(
        getCardStyles('default'),
        "opacity-75 cursor-not-allowed",
        className
      )}>
        {cardContent}
      </Card>
    )
  }

  return (
    <Link href={href} className="block group">
      <Card className={cn(
        getCardStyles(variant === 'featured' ? 'premium' : 'hover'),
        "h-full transition-all duration-300",
        "group-hover:scale-[1.02]",
        className
      )}>
        {cardContent}
      </Card>
    </Link>
  )
}

// Grid component for converter cards
interface ConverterGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ConverterGrid({ 
  children, 
  columns = 3,
  className 
}: ConverterGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}