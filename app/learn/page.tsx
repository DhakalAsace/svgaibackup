import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Code, Palette, Layers, Zap, ChevronRight, Clock, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Learn About SVG - Tutorials, Guides & Documentation | SVG AI',
  description: 'Master SVG with comprehensive tutorials, guides, and documentation. Learn about SVG file format, animations, conversions, and best practices for web development.',
  keywords: 'svg tutorial, svg guide, svg documentation, learn svg, svg file format, svg animation, svg conversion',
  openGraph: {
    title: 'Learn About SVG - Complete Guide & Tutorials',
    description: 'Master SVG with comprehensive tutorials, guides, and documentation. From basics to advanced techniques.',
    type: 'website',
    url: 'https://svgai.org/learn',
  },
  alternates: {
    canonical: 'https://svgai.org/learn',
  },
}

const learnPages = [
  {
    title: 'What is SVG?',
    description: 'Complete guide to understanding SVG format, its benefits, and use cases',
    href: '/learn/what-is-svg',
    icon: BookOpen,
    searches: '33,100/mo',
    featured: true,
    readTime: 12,
    category: 'Fundamentals',
  },
  {
    title: 'SVG File Format',
    description: 'Deep dive into the SVG file format structure and specifications',
    href: '/learn/svg-file-format',
    icon: FileText,
    searches: '9,900/mo',
    featured: true,
    readTime: 10,
    category: 'Technical',
  },
  {
    title: 'SVG File Guide',
    description: 'Everything you need to know about working with SVG files',
    href: '/learn/svg-file',
    icon: FileText,
    searches: '14,800/mo',
    featured: true,
    readTime: 8,
    category: 'Fundamentals',
  },
  {
    title: 'Convert SVG to PNG on Windows',
    description: 'Step-by-step guide for Windows users to convert SVG to PNG',
    href: '/learn/convert-svg-to-png-windows',
    icon: Code,
    searches: '1,900/mo',
    readTime: 5,
    category: 'Conversion',
  },
  {
    title: 'Convert PNG to SVG',
    description: 'Learn how to convert raster PNG images to vector SVG format',
    href: '/learn/convert-png-to-svg',
    icon: Layers,
    searches: '1,590/mo',
    readTime: 7,
    category: 'Conversion',
  },
  {
    title: 'HTML String to SVG with JavaScript',
    description: 'Convert HTML strings to SVG using JavaScript techniques',
    href: '/learn/html-string-to-svg-js',
    icon: Code,
    searches: '590/mo',
    readTime: 6,
    category: 'Development',
  },
  {
    title: 'Batch Convert SVG to PNG',
    description: 'Efficiently convert multiple SVG files to PNG format at once',
    href: '/learn/batch-svg-to-png',
    icon: Layers,
    searches: '720/mo',
    readTime: 5,
    category: 'Conversion',
  },
  {
    title: 'Best SVG Converters',
    description: 'Comprehensive comparison of the best SVG conversion tools',
    href: '/learn/best-svg-converters',
    icon: Zap,
    searches: '1,600/mo',
    readTime: 8,
    category: 'Tools',
  },
  {
    title: 'Check SVG Animation',
    description: 'Tools and techniques to test and debug SVG animations',
    href: '/learn/check-svg-animation',
    icon: Palette,
    searches: '320/mo',
    readTime: 6,
    category: 'Animation',
  },
  {
    title: 'React Native SVG Animation',
    description: 'Guide to implementing SVG animations in React Native apps',
    href: '/learn/react-native-svg-animation',
    icon: Code,
    searches: '90/mo',
    readTime: 9,
    category: 'Development',
  },
  {
    title: 'SVG CSS Animation',
    description: 'Create stunning animations using CSS with SVG elements',
    href: '/learn/svg-css-animation',
    icon: Palette,
    searches: '90/mo',
    readTime: 7,
    category: 'Animation',
  },
]

export default function LearnPage() {
  const featuredPages = learnPages.filter(page => page.featured)
  const regularPages = learnPages.filter(page => !page.featured)
  
  // Group pages by category
  const categories = Array.from(new Set(learnPages.map(page => page.category)))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">SVG Learning Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Master SVG with our comprehensive guides, tutorials, and documentation. 
              From basics to advanced techniques, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Articles */}
        {featuredPages.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Guides</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>High search volume topics</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPages.map((page) => {
                const Icon = page.icon
                return (
                  <Link 
                    key={page.href} 
                    href={page.href}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {page.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {page.readTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {page.searches}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Articles by Category */}
        <section>
          <h2 className="text-3xl font-bold mb-8">All Articles</h2>
          {categories.map(category => {
            const categoryPages = regularPages.filter(page => page.category === category)
            if (categoryPages.length === 0) return null
            
            return (
              <div key={category} className="mb-12">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPages.map((page) => {
                    const Icon = page.icon
                    return (
                      <Link 
                        key={page.href} 
                        href={page.href}
                        className="group block p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-colors">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                              {page.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {page.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {page.readTime} min
                            </span>
                            <span>{page.searches}</span>
                          </div>
                          <span className="inline-flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Read more
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Start Creating SVGs</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Put your knowledge into practice with our tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/ai-icon-generator">
                  AI Icon Generator
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/convert">
                  Free SVG Converters
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}