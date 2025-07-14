"use client"

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { converterConfigs } from '@/app/convert/converter-config'
import { galleryThemes } from '@/app/gallery/gallery-config'
import { getContextualLinkText } from '@/lib/internal-linking'
import { cn } from '@/lib/utils'

interface ContextualLinksProps {
  format?: string
  context: 'learn' | 'blog' | 'gallery' | 'converter'
  variant?: 'inline' | 'block' | 'card'
  limit?: number
  className?: string
}

// Component for use in MDX files and content
export function ContextualLinks({
  format,
  context,
  variant = 'inline',
  limit = 3,
  className
}: ContextualLinksProps) {
  // Find relevant converters based on format
  const relevantConverters = format
    ? converterConfigs
        .filter(c => 
          c.fromFormat.toLowerCase() === format.toLowerCase() ||
          c.toFormat.toLowerCase() === format.toLowerCase()
        )
        .filter(c => c.isSupported)
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, limit)
    : converterConfigs
        .filter(c => c.isSupported)
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, limit)

  if (variant === 'inline') {
    return (
      <span className={cn("inline-flex flex-wrap gap-2", className)}>
        {relevantConverters.map((converter, idx) => (
          <span key={converter.id}>
            {idx > 0 && <span className="text-muted-foreground mx-1">•</span>}
            <Link
              href={`/convert/${converter.urlSlug}`}
              className="text-primary hover:underline inline-flex items-center"
            >
              {getContextualLinkText(
                relevantConverters[0], 
                converter, 
                'natural',
                context === 'blog' ? undefined : context
              )}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </span>
        ))}
      </span>
    )
  }

  if (variant === 'block') {
    return (
      <div className={cn("my-6 p-4 bg-muted/50 rounded-lg", className)}>
        <p className="text-sm font-medium mb-3">Try it yourself:</p>
        <div className="space-y-2">
          {relevantConverters.map((converter) => (
            <Link
              key={converter.id}
              href={`/convert/${converter.urlSlug}`}
              className="flex items-center justify-between p-2 bg-background rounded hover:bg-primary/5 transition-colors"
            >
              <span className="text-sm">
                {converter.title}
              </span>
              <span className="text-xs text-muted-foreground flex items-center">
                Free tool
                <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Card variant
  return (
    <div className={cn("my-8 border rounded-lg p-6", className)}>
      <h4 className="font-semibold mb-4">Related Tools</h4>
      <div className="grid gap-3">
        {relevantConverters.map((converter) => (
          <Link
            key={converter.id}
            href={`/convert/${converter.urlSlug}`}
            className="group"
          >
            <div className="p-3 border rounded hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium text-sm group-hover:text-primary transition-colors">
                    {converter.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {converter.metaDescription.split('.')[0]}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Quick converter link for inline use
export function ConverterLink({ 
  from, 
  to,
  className 
}: { 
  from: string
  to: string
  className?: string 
}) {
  const converter = converterConfigs.find(c => 
    c.fromFormat.toLowerCase() === from.toLowerCase() &&
    c.toFormat.toLowerCase() === to.toLowerCase()
  )

  if (!converter || !converter.isSupported) {
    return <span className={className}>{from} to {to}</span>
  }

  return (
    <Link
      href={`/convert/${converter.urlSlug}`}
      className={cn("text-primary hover:underline inline-flex items-center", className)}
    >
      {from} to {to}
      <ExternalLink className="w-3 h-3 ml-1" />
    </Link>
  )
}

// Gallery link for inline use
export function GalleryLink({ 
  theme,
  className 
}: { 
  theme: string
  className?: string 
}) {
  const gallery = galleryThemes[theme]

  if (!gallery) {
    return <span className={className}>{theme} gallery</span>
  }

  return (
    <Link
      href={`/gallery/${theme}`}
      className={cn("text-primary hover:underline inline-flex items-center", className)}
    >
      {gallery.title}
      <ExternalLink className="w-3 h-3 ml-1" />
    </Link>
  )
}

// Learn page link
export function LearnLink({ 
  page,
  text,
  className 
}: { 
  page: string
  text?: string
  className?: string 
}) {
  const learnPages: Record<string, { href: string; title: string }> = {
    'what-is-svg': { href: '/learn/what-is-svg', title: 'What is SVG?' },
    'svg-file': { href: '/learn/svg-file', title: 'SVG File Format' },
    'svg-file-format': { href: '/learn/svg-file-format', title: 'SVG File Format Guide' },
    'convert-png': { href: '/learn/convert-png-to-svg', title: 'How to Convert PNG to SVG' },
    'convert-svg': { href: '/learn/convert-svg-to-png-windows', title: 'Convert SVG to PNG' },
    'best-converters': { href: '/learn/best-svg-converters', title: 'Best SVG Converters' }
  }

  const pageInfo = learnPages[page]
  if (!pageInfo) {
    return <span className={className}>{text || page}</span>
  }

  return (
    <Link
      href={pageInfo.href}
      className={cn("text-primary hover:underline inline-flex items-center", className)}
    >
      {text || pageInfo.title}
      <ExternalLink className="w-3 h-3 ml-1" />
    </Link>
  )
}

// Tool recommendation box
export function ToolRecommendation({
  title = "Recommended Tool",
  tool,
  description,
  className
}: {
  title?: string
  tool: string
  description?: string
  className?: string
}) {
  const converter = converterConfigs.find(c => 
    c.id === tool || c.urlSlug === tool
  )

  if (!converter || !converter.isSupported) {
    return null
  }

  return (
    <div className={cn(
      "my-6 p-6 border-2 border-primary/20 rounded-lg bg-primary/5",
      className
    )}>
      <h4 className="font-semibold mb-2 flex items-center">
        {title}
      </h4>
      <p className="text-sm text-muted-foreground mb-4">
        {description || converter.metaDescription}
      </p>
      <Link
        href={`/convert/${converter.urlSlug}`}
        className="inline-flex items-center font-medium text-primary hover:text-primary/80"
      >
        Try {converter.title}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  )
}