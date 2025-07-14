"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, TrendingUp, BookOpen, Code, ChevronRight } from "lucide-react"
import { learnPageConfigs, type LearnPage } from "@/app/learn/learn-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

// Group pages by search volume tiers
const HIGH_VOLUME_THRESHOLD = 5000
const MEDIUM_VOLUME_THRESHOLD = 1000

interface LearnNavigationProps {
  showSearchVolume?: boolean
  className?: string
}

// Type for pages with relevance score
interface LearnPageWithRelevance extends LearnPage {
  relevance: number
}

export function LearnNavigation({ showSearchVolume = false, className }: LearnNavigationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Categorize pages by search volume
  const categorizedPages = useMemo(() => {
    const highVolume = learnPageConfigs.filter((p: LearnPage) => p.searchVolume >= HIGH_VOLUME_THRESHOLD)
    const mediumVolume = learnPageConfigs.filter(
      (p: LearnPage) => p.searchVolume >= MEDIUM_VOLUME_THRESHOLD && p.searchVolume < HIGH_VOLUME_THRESHOLD
    )
    const lowVolume = learnPageConfigs.filter((p: LearnPage) => p.searchVolume < MEDIUM_VOLUME_THRESHOLD)

    return { highVolume, mediumVolume, lowVolume }
  }, [])

  // Filter pages based on search
  const filteredPages = useMemo(() => {
    if (!searchQuery) return learnPageConfigs
    
    return learnPageConfigs.filter((page: LearnPage) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  // Get search suggestions
  const searchSuggestions = [
    "svg basics",
    "convert svg",
    "svg animation",
    "file format",
    "batch convert"
  ]

  return (
    <div className={cn("w-full", className)}>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search learn topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchQuery === "" && (
          <div className="absolute top-full mt-2 w-full rounded-md border bg-popover p-2 shadow-md">
            <p className="mb-2 text-sm text-muted-foreground">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured Topics (High Volume) */}
      {!searchQuery && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Popular Topics</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorizedPages.highVolume.map((page: LearnPage) => (
              <Card key={page.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Link 
                      href={`/learn/${page.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {page.title}
                    </Link>
                    {showSearchVolume && (
                      <Badge variant="secondary" className="ml-2">
                        {page.searchVolume.toLocaleString()}/mo
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Essential guide to understanding {page.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/learn/${page.slug}`}>
                    <Button className="w-full" variant="outline">
                      Read Guide
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Topics or Search Results */}
      <div className="space-y-8">
        {searchQuery ? (
          // Search Results
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Search Results ({filteredPages.length})
            </h2>
            <div className="space-y-2">
              {filteredPages.map((page: LearnPage) => (
                <Link
                  key={page.slug}
                  href={`/learn/${page.slug}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{page.title}</span>
                  {showSearchVolume && (
                    <Badge variant="outline">
                      {page.searchVolume.toLocaleString()}/mo
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Conversion Guides (Medium Volume) */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Conversion Guides</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {categorizedPages.mediumVolume.map((page: LearnPage) => (
                  <Link
                    key={page.slug}
                    href={`/learn/${page.slug}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{page.title}</span>
                    {showSearchVolume && (
                      <Badge variant="outline">
                        {page.searchVolume.toLocaleString()}/mo
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Technical Guides (Low Volume) */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Technical Guides</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {categorizedPages.lowVolume.map((page: LearnPage) => (
                  <Link
                    key={page.slug}
                    href={`/learn/${page.slug}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{page.title}</span>
                    {showSearchVolume && (
                      <Badge variant="outline">
                        {page.searchVolume.toLocaleString()}/mo
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Mobile Navigation Menu
export function LearnMobileNav({ showSearchVolume = false }: { showSearchVolume?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          Learn
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Learn Center</SheetTitle>
          <SheetDescription>
            Explore our comprehensive guides and tutorials
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <LearnNavigation showSearchVolume={showSearchVolume} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Breadcrumb Navigation Component
interface LearnBreadcrumbProps {
  currentPage?: {
    title: string
    slug: string
  }
}

export function LearnBreadcrumb({ currentPage }: LearnBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/learn">Learn</BreadcrumbLink>
        </BreadcrumbItem>
        {currentPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Related Articles Component
interface RelatedArticlesProps {
  currentSlug: string
  maxItems?: number
  showSearchVolume?: boolean
}

export function RelatedArticles({ 
  currentSlug, 
  maxItems = 3,
  showSearchVolume = false 
}: RelatedArticlesProps) {
  // Get related articles based on similarity and search volume
  const relatedArticles = useMemo(() => {
    const currentPage = learnPageConfigs.find(p => p.slug === currentSlug)
    if (!currentPage) return []

    // Filter out current page and sort by relevance
    return learnPageConfigs
      .filter((page: LearnPage) => page.slug !== currentSlug)
      .map((page: LearnPage) => {
        // Calculate relevance score based on keyword overlap
        const currentWords = currentPage.title.toLowerCase().split(' ')
        const pageWords = page.title.toLowerCase().split(' ')
        const overlap = currentWords.filter((word: string) => 
          pageWords.some((w: string) => w.includes(word) || word.includes(w))
        ).length
        
        return { ...page, relevance: overlap }
      })
      .sort((a: LearnPageWithRelevance, b: LearnPageWithRelevance) => {
        // Sort by relevance first, then by search volume
        if (b.relevance !== a.relevance) return b.relevance - a.relevance
        return b.searchVolume - a.searchVolume
      })
      .slice(0, maxItems)
  }, [currentSlug, maxItems])

  if (relatedArticles.length === 0) return null

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Related Articles</CardTitle>
        <CardDescription>
          Continue learning with these related guides
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relatedArticles.map((article: LearnPageWithRelevance) => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <span className="font-medium">{article.title}</span>
              {showSearchVolume && (
                <Badge variant="outline" className="ml-2">
                  {article.searchVolume.toLocaleString()}/mo
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Mega Menu for Desktop Navigation
export function LearnMegaMenu({ showSearchVolume = false }: { showSearchVolume?: boolean }) {
  const { highVolume, mediumVolume, lowVolume } = useMemo(() => {
    const high = learnPageConfigs.filter((p: LearnPage) => p.searchVolume >= HIGH_VOLUME_THRESHOLD)
    const medium = learnPageConfigs.filter(
      (p: LearnPage) => p.searchVolume >= MEDIUM_VOLUME_THRESHOLD && p.searchVolume < HIGH_VOLUME_THRESHOLD
    )
    const low = learnPageConfigs.filter((p: LearnPage) => p.searchVolume < MEDIUM_VOLUME_THRESHOLD)
    return { highVolume: high, mediumVolume: medium, lowVolume: low }
  }, [])

  return (
    <div className="absolute left-0 top-full mt-2 w-screen max-w-4xl rounded-lg border bg-background p-6 shadow-lg">
      <div className="grid grid-cols-3 gap-6">
        {/* Popular Topics */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Popular Topics</h3>
          </div>
          <ul className="space-y-2">
            {highVolume.map((page: LearnPage) => (
              <li key={page.slug}>
                <Link
                  href={`/learn/${page.slug}`}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>{page.title}</span>
                  {showSearchVolume && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {(page.searchVolume / 1000).toFixed(1)}k
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Conversion Guides */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Conversion Guides</h3>
          </div>
          <ul className="space-y-2">
            {mediumVolume.map((page: LearnPage) => (
              <li key={page.slug}>
                <Link
                  href={`/learn/${page.slug}`}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>{page.title}</span>
                  {showSearchVolume && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {page.searchVolume.toLocaleString()}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Guides */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Technical Guides</h3>
          </div>
          <ul className="space-y-2">
            {lowVolume.map((page: LearnPage) => (
              <li key={page.slug}>
                <Link
                  href={`/learn/${page.slug}`}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>{page.title}</span>
                  {showSearchVolume && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {page.searchVolume}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}