"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, RefreshCw, Sparkles, BookOpen, Image as ImageIcon } from 'lucide-react'
import { ConverterConfig } from '@/app/convert/converter-config'
import {
  getReverseConverter,
  getFormatFamilyConverters,
  getRelatedConverters,
  getLearningPageLinks,
  getRelatedGalleryLinks,
  getContextualLinkText
} from '@/lib/internal-linking'

interface InternalLinksProps {
  config: ConverterConfig
}

export function InternalLinks({ config }: InternalLinksProps) {
  const reverseConverter = getReverseConverter(config)
  const familyConverters = getFormatFamilyConverters(config).slice(0, 4)
  const relatedConverters = getRelatedConverters(config, 6)
  const learningLinks = getLearningPageLinks(config)
  const galleryLinks = getRelatedGalleryLinks(config)

  return (
    <div className="space-y-8">
      {/* Reverse Converter - Most Important */}
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

      {/* Format Family Converters */}
      {familyConverters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related {config.fromFormat} Converters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyConverters.map((converter) => (
                <Link
                  key={converter.id}
                  href={`/convert/${converter.urlSlug}`}
                  className="group p-3 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {converter.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {getContextualLinkText(config, converter, 'natural')}
                      </p>
                    </div>
                    {converter.searchVolume > 10000 && (
                      <Badge variant="secondary" className="ml-2">
                        Popular
                      </Badge>
                    )}
                  </div>
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

      {/* Gallery Links */}
      {galleryLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ImageIcon className="w-5 h-5 mr-2" />
              SVG Galleries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {galleryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-center p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <span className="text-sm font-medium">{link.title}</span>
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

// Inline links component for use within content
export function InlineConverterLinks({ 
  converters, 
  title = "Related Converters" 
}: { 
  converters: ConverterConfig[]
  title?: string 
}) {
  if (converters.length === 0) return null

  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {converters.map((converter) => (
          <Link
            key={converter.id}
            href={`/convert/${converter.urlSlug}`}
            className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
          >
            {converter.fromFormat} → {converter.toFormat}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}