'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, Calendar, Share2, Copy, Check, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface LearnArticleLayoutProps {
  title: string
  description?: string
  date?: string
  readTime?: number
  content: string
  children?: React.ReactNode
}

export function LearnArticleLayout({
  title,
  description,
  date,
  readTime,
  content,
  children
}: LearnArticleLayoutProps) {
  const [toc, setToc] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Extract table of contents from content
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3')
      const items: TableOfContentsItem[] = []
      
      headings.forEach((heading, index) => {
        const id = `heading-${index}`
        heading.id = id
        items.push({
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName[1])
        })
      })
      
      setToc(items)
    }
  }, [content])

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      // Update reading progress
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(scrollPercent)

      // Show/hide scroll to top button
      setShowScrollTop(scrollTop > 500)

      // Update active TOC item
      const headings = contentRef.current?.querySelectorAll('h2, h3')
      if (headings) {
        let current = ''
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect()
          if (rect.top <= 100) {
            current = heading.id
          }
        })
        setActiveId(current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress"
        style={{ width: `${progress}%` }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Hero Section */}
            <div className="learn-hero">
              <div className="learn-hero-content">
                <h1 className="text-5xl font-bold leading-tight mb-4">{title}</h1>
                {description && (
                  <p className="text-xl text-gray-600 dark:text-gray-400">{description}</p>
                )}
                <div className="learn-meta mt-6">
                  {date && (
                    <div className="learn-meta-item">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}
                  {readTime && (
                    <div className="learn-meta-item">
                      <Clock className="w-4 h-4" />
                      <span>{readTime} min read</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="learn-meta-item"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div 
              ref={contentRef}
              className="learn-article"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Children (for MDX components) */}
            {children}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="toc-container bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
                <nav>
                  <ul className="space-y-1">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={cn(
                            'toc-link',
                            item.level === 3 && 'ml-4',
                            activeId === item.id && 'active'
                          )}
                          onClick={(e) => {
                            e.preventDefault()
                            document.getElementById(item.id)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                            })
                          }}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* CTA Card */}
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Ready to Create?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Generate custom SVG icons and graphics with AI
              </p>
              <Button className="w-full" asChild>
                <a href="/ai-icon-generator">
                  Try AI Icon Generator
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" className="w-full mt-2" asChild>
                <a href="/convert">
                  Free SVG Converters
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg"
          size="icon"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}