'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { getPublicSupportedConverters, getPublicConvertersByPriority } from './public-converter-config'
import { getSupportedConverters, getConverterBySlug } from './converter-config'
import { ConverterCard, ConverterGrid } from '@/components/converter-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// Note: Using client component, metadata moved to layout
const pageMetadata = {
  title: 'Free Online Converters - Convert SVG, PNG, JPG & More | SVG AI',
  description: 'Convert between SVG and 40+ image formats with our free online converters. Fast, secure, and no signup required. PNG to SVG, SVG to PNG, and more.',
  keywords: ['svg converter', 'image converter', 'free converter', 'online converter', 'png to svg', 'svg to png']
}

// Converter card component removed - using new unified ConverterCard component

export default function ConvertersHubPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get only supported converters (public version) and filter out duplicates and learn content
  const supportedConverters = useMemo(() => {
    return getPublicSupportedConverters().filter(converter => {
      // Remove duplicate image-to-svg-generator, keep main image-to-svg
      if (converter.id === 'image-to-svg-generator') return false
      // Filter out learn content from converter listing
      if (converter.routeType === 'learn') return false
      return true
    })
  }, [])

  // Filter converters based on search
  const filteredConverters = useMemo(() => {
    if (!searchQuery.trim()) return supportedConverters
    
    const query = searchQuery.toLowerCase()
    return supportedConverters.filter(converter => 
      converter.title.toLowerCase().includes(query) ||
      converter.fromFormat.toLowerCase().includes(query) ||
      converter.toFormat.toLowerCase().includes(query) ||
      converter.keywords.some(keyword => keyword.toLowerCase().includes(query))
    )
  }, [supportedConverters, searchQuery])

  // Categorize filtered converters
  const categorizedConverters = useMemo(() => {
    const high = filteredConverters.filter(c => c.priority === 'high')
    const medium = filteredConverters.filter(c => c.priority === 'medium')
    const low = filteredConverters.filter(c => c.priority === 'low')
    return { high, medium, low }
  }, [filteredConverters])

  const totalConverters = supportedConverters.length

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SVG AI Free Converters',
    url: 'https://svgai.com/convert',
    description: `Convert between SVG and ${totalConverters}+ image formats with our free online tools.`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Free SVG conversion',
      'No registration required',
      'Client-side processing',
      'Multiple format support',
      'High-quality output'
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Online Converters</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Convert between SVG and {totalConverters}+ image formats with our free online tools. Fast, secure, and no signup required.
          </p>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% Free
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure & Private
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Registration
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Ultra Fast
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalConverters}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Free Converters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Client-Side Security</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">File Conversions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <Input
              type="search"
              placeholder="Search converters... (e.g., PNG to SVG)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7043] focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Found {filteredConverters.length} converter{filteredConverters.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Results */}
        {searchQuery ? (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            {filteredConverters.length > 0 ? (
              <ConverterGrid>
                {filteredConverters.map((converter) => (
                  <ConverterCard 
                    key={converter.id} 
                    title={converter.title}
                    description={converter.metaDescription}
                    href={`/convert/${converter.urlSlug}`}
                    isSupported={converter.isSupported}
                    fromFormat={converter.fromFormat}
                    toFormat={converter.toFormat}
                    searchVolume={getConverterBySlug(converter.urlSlug)?.searchVolume || 0}
                  />
                ))}
              </ConverterGrid>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.477-.881-6.08-2.33" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No converters found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search term or browse all converters below.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Popular Converters */}
            {categorizedConverters.high.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Most Popular Converters</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {categorizedConverters.high.length} converters
                  </span>
                </div>
                <ConverterGrid>
                  {categorizedConverters.high.map((converter) => (
                    <ConverterCard 
                      key={converter.id} 
                      title={converter.title}
                      description={converter.metaDescription}
                      href={`/convert/${converter.urlSlug}`}
                      isSupported={converter.isSupported}
                      fromFormat={converter.fromFormat}
                      toFormat={converter.toFormat}
                      searchVolume={getConverterBySlug(converter.urlSlug)?.searchVolume || 0}
                      variant="featured"
                    />
                  ))}
                </ConverterGrid>
              </section>
            )}

            {/* Image Format Converters */}
            {categorizedConverters.medium.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Standard Image Converters</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {categorizedConverters.medium.length} converters
                  </span>
                </div>
                <ConverterGrid>
                  {categorizedConverters.medium.map((converter) => (
                    <ConverterCard 
                      key={converter.id} 
                      title={converter.title}
                      description={converter.metaDescription}
                      href={`/convert/${converter.urlSlug}`}
                      isSupported={converter.isSupported}
                      fromFormat={converter.fromFormat}
                      toFormat={converter.toFormat}
                    />
                  ))}
                </ConverterGrid>
              </section>
            )}

            {/* Specialized Converters */}
            {categorizedConverters.low.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Specialized & Professional Converters</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {categorizedConverters.low.length} converters
                  </span>
                </div>
                <ConverterGrid>
                  {categorizedConverters.low.map((converter) => (
                    <ConverterCard 
                      key={converter.id} 
                      title={converter.title}
                      description={converter.metaDescription}
                      href={`/convert/${converter.urlSlug}`}
                      isSupported={converter.isSupported}
                      fromFormat={converter.fromFormat}
                      toFormat={converter.toFormat}
                    />
                  ))}
                </ConverterGrid>
              </section>
            )}
          </>
        )}

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Are these converters really free?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! All {totalConverters} converters are 100% free to use with no hidden costs, signup requirements, or usage limits. Convert unlimited files anytime.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                How secure is my data?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Completely secure. All conversions happen directly in your browser using client-side processing. Your files never leave your device or touch our servers.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                What file sizes are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Most converters support files up to 50MB with optimal performance under 10MB. File size limits depend on your device's memory and processing power.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Which converter should I use?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose based on your source and target formats. Popular choices: PNG to SVG for logos, SVG to PNG for web graphics, and JPG to SVG for illustrations. Use the search above to find your specific converter.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                What makes these converters special?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our converters use advanced algorithms optimized for quality and speed. They handle edge cases better than generic tools and produce professional-grade results suitable for print and web use.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Custom SVG Designs?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto text-lg">
            Beyond conversion? Create unique, professional SVG designs from text descriptions with our AI-powered generator!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/ai-icon-generator"
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Try AI SVG Generator
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/animate"
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary dark:text-primary hover:bg-primary hover:text-white transition-all rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707a1 1 0 00.707.293H15M9 10v1.586a1 1 0 00.293.707l.707.707a1 1 0 00.707.293H13" />
              </svg>
              Animate SVGs
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trusted by 50K+ users
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              99.9% uptime
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Enterprise ready
            </div>
          </div>
        </div>
      </div>
    </>
  )
}