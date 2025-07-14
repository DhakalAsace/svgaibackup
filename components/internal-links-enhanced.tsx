"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  Image as ImageIcon, 
  Wand2,
  Download,
  Palette,
  FileImage,
  Layers
} from 'lucide-react'
import { ConverterConfig, converterConfigs, getConverterBySlug } from '@/app/convert/converter-config'
import { PublicConverterConfig } from '@/app/convert/public-converter-config'
import { GalleryTheme, galleryThemes } from '@/app/gallery/gallery-config'
import {
  getReverseConverter,
  getRelatedConverters,
  getLearningPageLinks,
  getRelatedGalleryLinks,
  getContextualLinkText
} from '@/lib/internal-linking'

// Helper function to get full config from public config
function getFullConfig(publicConfig: PublicConverterConfig): ConverterConfig | null {
  return getConverterBySlug(publicConfig.urlSlug) || null
}

type PageType = 'gallery' | 'converter' | 'learn'

interface InternalLinksEnhancedProps {
  pageType: PageType
  config?: PublicConverterConfig
  theme?: GalleryTheme
  currentPath?: string
}

// Get converters relevant to a gallery theme
function getGalleryConverters(theme: GalleryTheme): ConverterConfig[] {
  const converters: ConverterConfig[] = []
  
  // All galleries benefit from SVG converters
  const svgConverters = converterConfigs.filter(c => 
    c.toFormat.toLowerCase() === 'svg' || c.fromFormat.toLowerCase() === 'svg'
  ).sort((a, b) => b.searchVolume - a.searchVolume)
  
  // Add top SVG converters
  converters.push(...svgConverters.slice(0, 6))
  
  return converters
}

// Get galleries related to a converter
function getConverterGalleries(config: ConverterConfig): Array<{ slug: string; theme: GalleryTheme }> {
  const galleries: Array<{ slug: string; theme: GalleryTheme }> = []
  
  // SVG converters link to all galleries
  if (config.toFormat.toLowerCase() === 'svg' || config.fromFormat.toLowerCase() === 'svg') {
    const topGalleries = Object.entries(galleryThemes)
      .sort(([_, a], [__, b]) => b.searchVolume - a.searchVolume)
      .slice(0, 6)
      .map(([slug, theme]) => ({ slug, theme }))
    
    galleries.push(...topGalleries)
  }
  
  return galleries
}

// Track link clicks for analytics
function trackLinkClick(from: string, to: string, type: string) {
  // Analytics tracking removed - internal navigation is tracked by Vercel Analytics automatically
}

export function InternalLinksEnhanced({ 
  pageType, 
  config, 
  theme,
  currentPath = ''
}: InternalLinksEnhancedProps) {
  
  // Gallery page links
  if (pageType === 'gallery' && theme) {
    const converters = getGalleryConverters(theme)
    const relatedThemes = theme.relatedThemes
      .map(slug => galleryThemes[slug])
      .filter(Boolean)
      .slice(0, 4)
    
    return (
      <div className="space-y-8">
        {/* Convert This SVG Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <RefreshCw className="w-5 h-5 mr-2" />
              Convert These SVGs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download any {theme.title.toLowerCase()} and convert to other formats
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {converters.slice(0, 6).map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  onClick={() => trackLinkClick(currentPath, `/convert/${converter.urlSlug}`, 'gallery_to_converter')}
                  className="group"
                >
                  <div className="p-3 bg-white dark:bg-gray-800 border rounded-lg hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <FileImage className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      {converter.searchVolume > 10000 && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {converter.fromFormat} → {converter.toFormat}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {converter.searchVolume > 1000 ? `${(converter.searchVolume / 1000).toFixed(0)}k searches` : 'Convert now'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Similar with AI */}
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wand2 className="w-5 h-5 mr-2 text-violet-600" />
              Create Custom {theme.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate unique {theme.title.toLowerCase()} designs with AI
            </p>
            <div className="space-y-3">
              {theme.samplePrompts.slice(0, 3).map((prompt, idx) => (
                <Link
                  key={idx}
                  href={`/ai-icon-generator?prompt=${encodeURIComponent(prompt)}`}
                  onClick={() => trackLinkClick(currentPath, '/ai-icon-generator', 'gallery_to_ai_generator')}
                  className="block p-3 bg-white dark:bg-gray-800 border rounded-lg hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{prompt}</span>
                    <Sparkles className="w-4 h-4 text-violet-500" />
                  </div>
                </Link>
              ))}
            </div>
            <Button
              asChild
              className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Link 
                href="/ai-icon-generator"
                onClick={() => trackLinkClick(currentPath, '/ai-icon-generator', 'gallery_to_ai_generator_main')}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Create Your Own SVG with AI
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Related Collections */}
        {relatedThemes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Layers className="w-5 h-5 mr-2" />
                Related SVG Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedThemes.map((relatedTheme) => (
                  <Link
                    key={relatedTheme.slug}
                    href={`/gallery/${relatedTheme.slug}`}
                    onClick={() => trackLinkClick(currentPath, `/gallery/${relatedTheme.slug}`, 'gallery_to_gallery')}
                    className="group"
                  >
                    <div className="p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">
                            {relatedTheme.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {relatedTheme.keywords.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {(relatedTheme.searchVolume / 1000).toFixed(1)}k
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link
                  href="/gallery"
                  onClick={() => trackLinkClick(currentPath, '/gallery', 'gallery_to_gallery_hub')}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Browse All SVG Collections
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick SVG Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                href="/animate"
                onClick={() => trackLinkClick(currentPath, '/animate', 'gallery_to_animation')}
                className="p-3 text-center border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Palette className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Animate SVG</span>
              </Link>
              <Link
                href="/tools/svg-editor"
                onClick={() => trackLinkClick(currentPath, '/tools/svg-editor', 'gallery_to_editor')}
                className="p-3 text-center border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Download className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Edit SVG</span>
              </Link>
              <Link
                href="/learn/what-is-svg"
                onClick={() => trackLinkClick(currentPath, '/learn/what-is-svg', 'gallery_to_learn')}
                className="p-3 text-center border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <BookOpen className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Learn SVG</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Converter page links
  if (pageType === 'converter' && config) {
    const fullConfig = getFullConfig(config)
    if (!fullConfig) return null
    
    const reverseConverter = getReverseConverter(fullConfig)
    const relatedConverters = getRelatedConverters(fullConfig, 6)
    const learningLinks = getLearningPageLinks(fullConfig)
    const galleries = getConverterGalleries(fullConfig)

    return (
      <div className="space-y-8">
        {/* Reverse Converter */}
        {reverseConverter && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <RefreshCw className="w-5 h-5 mr-2" />
                Reverse Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/convert/${reverseConverter.urlSlug}`}
                onClick={() => trackLinkClick(currentPath, `/convert/${reverseConverter.urlSlug}`, 'converter_reverse')}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div>
                  <h4 className="font-semibold">{reverseConverter.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Convert back from {config.toFormat} to {config.fromFormat}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Browse Free SVGs */}
        {galleries.length > 0 && (
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <ImageIcon className="w-5 h-5 mr-2" />
                Browse Free SVG Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download free SVGs to use with this converter
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleries.slice(0, 6).map(({ slug, theme }) => (
                  <Link
                    key={slug}
                    href={`/gallery/${slug}`}
                    onClick={() => trackLinkClick(currentPath, `/gallery/${slug}`, 'converter_to_gallery')}
                    className="p-3 text-center border rounded-lg hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
                  >
                    <span className="text-sm font-medium">{theme.title}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {(theme.searchVolume / 1000).toFixed(0)}k
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Resources */}
        {learningLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {learningLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => trackLinkClick(currentPath, link.href, 'converter_to_learn')}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium">{link.title}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* More Converters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              More Converters You Might Like
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedConverters.slice(0, 6).map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  onClick={() => trackLinkClick(currentPath, `/convert/${converter.urlSlug}`, 'converter_related')}
                  className="group"
                >
                  <div className="p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {converter.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {converter.fromFormat} → {converter.toFormat}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/convert"
                onClick={() => trackLinkClick(currentPath, '/convert', 'converter_to_hub')}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All Converters
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Learn page links
  if (pageType === 'learn') {
    const topConverters = converterConfigs
      .sort((a, b) => b.searchVolume - a.searchVolume)
      .slice(0, 6)
    
    const topGalleries = Object.entries(galleryThemes)
      .sort(([_, a], [__, b]) => b.searchVolume - a.searchVolume)
      .slice(0, 4)
      .map(([slug, theme]) => ({ slug, theme }))

    return (
      <div className="space-y-8">
        {/* Try Our Converters */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Our Free Converters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Put your knowledge to practice with our free conversion tools
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {topConverters.map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  onClick={() => trackLinkClick(currentPath, `/convert/${converter.urlSlug}`, 'learn_to_converter')}
                  className="p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <h4 className="font-medium text-sm">{converter.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(converter.searchVolume / 1000).toFixed(0)}k searches
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Browse SVG Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ImageIcon className="w-5 h-5 mr-2" />
              Browse SVG Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {topGalleries.map(({ slug, theme }) => (
                <Link
                  key={slug}
                  href={`/gallery/${slug}`}
                  onClick={() => trackLinkClick(currentPath, `/gallery/${slug}`, 'learn_to_gallery')}
                  className="p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all"
                >
                  <h4 className="font-medium text-sm">{theme.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {theme.keywords.slice(0, 2).join(', ')}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create with AI */}
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wand2 className="w-5 h-5 mr-2 text-violet-600" />
              Create SVGs with AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate custom SVG designs using artificial intelligence
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Link 
                href="/ai-icon-generator"
                onClick={() => trackLinkClick(currentPath, '/ai-icon-generator', 'learn_to_ai_generator')}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Try AI SVG Generator
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

// Simplified inline component for use within content
export function InlineInternalLinks({ 
  type,
  limit = 3,
  className = ""
}: { 
  type: 'converters' | 'galleries' | 'learn'
  limit?: number
  className?: string
}) {
  let links: Array<{ href: string; title: string }> = []

  if (type === 'converters') {
    links = converterConfigs
      .sort((a, b) => b.searchVolume - a.searchVolume)
      .slice(0, limit)
      .map(c => ({ href: `/convert/${c.urlSlug}`, title: c.title }))
  } else if (type === 'galleries') {
    links = Object.entries(galleryThemes)
      .sort(([_, a], [__, b]) => b.searchVolume - a.searchVolume)
      .slice(0, limit)
      .map(([slug, theme]) => ({ href: `/gallery/${slug}`, title: theme.title }))
  } else if (type === 'learn') {
    links = [
      { href: '/learn/what-is-svg', title: 'What is SVG?' },
      { href: '/learn/svg-file-format', title: 'SVG File Format Guide' },
      { href: '/learn/convert-svg-to-png-windows', title: 'Convert SVG to PNG' }
    ].slice(0, limit)
  }

  if (links.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => trackLinkClick(window.location.pathname, link.href, `inline_${type}`)}
          className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
        >
          {link.title}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      ))}
    </div>
  )
}