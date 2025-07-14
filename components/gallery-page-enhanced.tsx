"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Download, Search, Sparkles, Grid, List, Info, Zap, FileDown, Edit, Share2, Heart, TrendingUp, Clock, Users, Filter, SortAsc, ChevronRight, Eye, Palette, Copy, X } from "lucide-react"
import { GalleryTheme, getRelatedThemes } from "@/app/gallery/gallery-config"
import { getGallerySVGs, getSVGFullPath, galleryFolderMap, type GallerySVG } from "@/app/gallery/gallery-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SVGPreviewModal from "./gallery/svg-preview-modal"
import { InternalLinksEnhanced } from "@/components/internal-links-enhanced"
import LazySVG from "@/components/lazy-svg"
import VirtualizedGallery from "@/components/gallery/virtualized-gallery"
import GalleryItem from "@/components/gallery/gallery-item"
import { useGalleryPerformance } from "@/hooks/use-gallery-performance"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import styles from "@/app/gallery/gallery.module.css"

interface GalleryPageEnhancedProps {
  theme: GalleryTheme
}

interface SVGItem {
  id: string
  filename: string
  title: string
  description: string
  svgPath: string
  svgContent?: string
  tags: string[]
  downloads: number
  likes: number
  isNew: boolean
  featured?: boolean
}

export default function GalleryPageEnhanced({ theme }: GalleryPageEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredItems, setFilteredItems] = useState<SVGItem[]>([])
  const [svgItems, setSvgItems] = useState<SVGItem[]>([])
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [selectedSVG, setSelectedSVG] = useState<SVGItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [useVirtualization, setUseVirtualization] = useState(false)
  const [displayCount, setDisplayCount] = useState(20)
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "popular">("featured")
  
  const relatedThemes = getRelatedThemes(theme.slug)
  
  // Track performance metrics
  useGalleryPerformance()
  
  // Infinite scroll for pagination
  const { loadMoreRef, isLoading } = useInfiniteScroll({
    hasMore: displayCount < filteredItems.length,
    onLoadMore: () => {
      setDisplayCount(prev => Math.min(prev + 20, filteredItems.length))
    }
  })
  
  // Get items to display (either paginated or all)
  const displayedItems = useVirtualization ? filteredItems : filteredItems.slice(0, displayCount)

  // Convert gallery data to SVGItems
  useEffect(() => {
    const gallerySVGs = getGallerySVGs(theme.slug)
    
    if (gallerySVGs.length > 0) {
      const items: SVGItem[] = gallerySVGs.map((svg, index) => ({
        id: `${theme.slug}-${index + 1}`,
        filename: svg.filename,
        title: svg.title,
        description: svg.description,
        svgPath: getSVGFullPath(theme.slug, svg.filename),
        tags: svg.tags,
        downloads: svg.downloadCount || Math.floor(Math.random() * 10000) + 500,
        likes: Math.floor(Math.random() * 1000) + 50,
        isNew: index < 3, // First 3 items are marked as new
        featured: svg.featured
      }))
      
      setSvgItems(items)
      setFilteredItems(items)
      
      // Enable virtualization for large galleries
      setUseVirtualization(items.length > 50)
    } else {
      // No SVGs found for this theme - set empty arrays
      setSvgItems([])
      setFilteredItems([])
    }
  }, [theme])

  useEffect(() => {
    let filtered = svgItems
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    if (selectedStyle !== "all") {
      filtered = filtered.filter(item => item.tags.includes(selectedStyle))
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.isNew ? 1 : -1
        case "popular":
          return b.downloads - a.downloads
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })
    
    setFilteredItems(filtered)
    // Reset display count when filters change
    setDisplayCount(20)
  }, [searchQuery, selectedStyle, sortBy, svgItems])

  const openPreviewModal = (item: SVGItem) => {
    setSelectedSVG(item)
    setIsModalOpen(true)
  }

  const closePreviewModal = () => {
    setIsModalOpen(false)
    setSelectedSVG(null)
  }

  // Get long-form content based on theme
  const getLongFormContent = () => {
    const themeType = theme.slug.split("-")[0]
    const isPlural = theme.slug.includes("svg-")
    
    return {
      intro: `Welcome to the most comprehensive collection of ${theme.title.toLowerCase()} available online. Whether you're a professional designer, developer, or creative enthusiast, our curated library of ${isPlural ? theme.title : theme.title + " designs"} provides everything you need for your projects.`,
      
      benefits: [
        {
          title: "Infinitely Scalable",
          description: `Every ${theme.title.split(" ")[0].toLowerCase()} SVG scales perfectly without quality loss`,
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: "Lightweight Files",
          description: "Optimized for fast loading and superior web performance",
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: "Easy to Customize",
          description: `Modify colors, shapes, and styles with CSS or design software`,
          icon: <Palette className="h-5 w-5" />
        },
        {
          title: "SEO Friendly",
          description: "Search engines can read SVG code for better visibility",
          icon: <Search className="h-5 w-5" />
        }
      ]
    }
  }
  
  const content = getLongFormContent()
  
  // Extract unique styles from all SVG tags
  const getAllStyles = () => {
    const allTags = new Set<string>()
    svgItems.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag))
    })
    // Filter out common non-style tags
    const nonStyleTags = new Set([theme.slug.split('-')[0], 'svg', 'vector', 'free', 'download'])
    const styleTags = Array.from(allTags).filter(tag => !nonStyleTags.has(tag))
    return ['all', ...styleTags.slice(0, 6)] // Limit to 6 styles plus 'all'
  }
  
  const styleOptions = getAllStyles()

  return (
    <div className="min-h-screen">
      {/* Professional Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b bg-gradient-to-r from-muted/50 to-muted/30">
        <div className="container px-6 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              <Link href="/gallery" className="text-muted-foreground transition-colors hover:text-foreground">
                Gallery
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li className="font-medium text-foreground">{theme.title}</li>
          </ol>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className={`relative overflow-hidden ${styles.hero}`}>
        <div className="container relative z-10 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Popular Collection</span>
            </div>
            <h1 className={`mb-6 ${styles.sectionTitle}`}>
              {theme.title}
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {theme.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ai-icon-generator">
                <Button size="lg" className={`gap-2 px-8 py-6 text-lg ${styles.ctaButton}`}>
                  <Sparkles className="h-5 w-5" />
                  Create Custom {theme.title.split(" ")[0]} with AI
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 px-8 py-6 text-lg"
                onClick={() => window.scrollTo({ top: document.getElementById('gallery')?.offsetTop || 0, behavior: 'smooth' })}
              >
                <FileDown className="h-5 w-5" />
                Browse Free Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Alert Section */}
      <section className="container px-6 py-8">
        <Alert className="mx-auto max-w-4xl border-primary/20 bg-primary/5">
          <Zap className="h-5 w-5 text-primary" />
          <AlertDescription className="text-base">
            <strong className="font-semibold">New Feature Coming Soon:</strong> Upload and share your own {theme.title.split(" ")[0].toLowerCase()} designs with our community! 
            For now, enjoy our curated collection or create custom designs with AI.
          </AlertDescription>
        </Alert>
      </section>

      {/* Enhanced Search, Filter, and View Controls */}
      <section className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-6 py-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${filteredItems.length} ${theme.title.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-12 pr-4 h-12 text-base ${styles.searchInput}`}
                  />
                </div>
                <select 
                  className="h-12 rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted/50"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  {styleOptions.map(style => (
                    <option key={style} value={style}>
                      {style === 'all' ? 'All Styles' : `${style.charAt(0).toUpperCase() + style.slice(1)} Style`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  className="h-12 rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted/50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                </select>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                  <TabsList className="h-12">
                    <TabsTrigger value="grid" className="gap-2 px-4">
                      <Grid className="h-4 w-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2 px-4">
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">List</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced SVG Gallery */}
      <section id="gallery" className={`container px-6 pb-20 pt-12 ${styles.section}`}>
        <div className="mx-auto max-w-7xl">
          {filteredItems.length === 0 ? (
            <Card className="mx-auto max-w-2xl overflow-hidden">
              <CardContent className="p-16 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold">
                  {searchQuery ? "No matching SVGs found" : "Collection Coming Soon"}
                </h3>
                <p className="mb-8 text-lg text-muted-foreground">
                  {searchQuery 
                    ? `No SVGs match "${searchQuery}". Try different keywords or browse our other collections.`
                    : `We're crafting this ${theme.title.toLowerCase()} collection. Meanwhile, create custom designs instantly with AI!`
                  }
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                      className="gap-2"
                      size="lg"
                    >
                      <X className="h-4 w-4" />
                      Clear Search
                    </Button>
                  )}
                  <Link href="/ai-icon-generator">
                    <Button className="gap-2" size="lg">
                      <Sparkles className="h-4 w-4" />
                      Create with AI Instead
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            useVirtualization && filteredItems.length > 50 ? (
              <div className="h-[800px]">
                <VirtualizedGallery
                  items={filteredItems}
                  itemsPerRow={5}
                  rowHeight={320}
                  gap={24}
                  renderItem={(item) => (
                    <div className={`${styles.galleryCard} h-full`}>
                      <GalleryItem
                        item={item}
                        onClick={() => openPreviewModal(item)}
                        onViewClick={(e) => {
                          e.stopPropagation()
                          openPreviewModal(item)
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            ) : (
              <>
                <div className={styles.galleryGrid}>
                  {displayedItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`${styles.fadeInUp}`}
                      style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                    >
                      <Card className={`h-full ${styles.galleryCard}`}>
                        <CardContent className="p-0 h-full">
                          <div 
                            className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted/30 p-8 cursor-pointer transition-all hover:from-muted/70 hover:to-muted/40"
                            onClick={() => openPreviewModal(item)}
                          >
                            {item.isNew && (
                              <Badge className="absolute left-3 top-3 gap-1">
                                <Sparkles className="h-3 w-3" />
                                New
                              </Badge>
                            )}
                            {item.featured && (
                              <Badge className={`absolute right-3 top-3 gap-1 ${styles.premiumBadge}`}>
                                <TrendingUp className="h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                            <LazySVG 
                              src={item.svgPath}
                              className="h-full w-full drop-shadow-sm"
                              priority={item.featured}
                            />
                          </div>
                          <div className="p-5">
                            <h3 className="mb-2 font-semibold text-foreground line-clamp-1">{item.title}</h3>
                            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openPreviewModal(item)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                Preview
                              </Button>
                              <Link href="/ai-icon-generator" className="flex-1">
                                <Button 
                                  size="sm" 
                                  className="w-full gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="h-4 w-4" />
                                  Customize
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
                
                {/* Professional Infinite Scroll Indicator */}
                {!useVirtualization && displayCount < filteredItems.length && (
                  <div ref={loadMoreRef} className="mt-12 flex justify-center">
                    {isLoading ? (
                      <div className="flex items-center gap-3 rounded-full bg-muted px-6 py-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="text-sm font-medium">Loading more designs...</span>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="px-6 py-2">
                        <span className="text-sm">Scroll for more</span>
                      </Badge>
                    )}
                  </div>
                )}
              </>
            )
          ) : (
            <>
              <div className="space-y-4">
                {displayedItems.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden transition-all cursor-pointer ${styles.listItem} ${styles.fadeInUp}`}
                    style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                    onClick={() => openPreviewModal(item)}
                  >
                    <CardContent className="flex items-center gap-6 p-6">
                      <div className="h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 p-3">
                        <LazySVG 
                          src={item.svgPath}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground line-clamp-1">{item.description}</p>
                            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {item.downloads.toLocaleString()} downloads
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {item.likes.toLocaleString()} likes
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.isNew && <Badge>New</Badge>}
                            {item.featured && (
                              <Badge variant="secondary" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="default"
                          variant="outline"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPreviewModal(item)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Link href="/ai-icon-generator">
                          <Button 
                            size="default" 
                            className="gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit className="h-4 w-4" />
                            Customize
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* List View Infinite Scroll */}
              {!useVirtualization && displayCount < filteredItems.length && (
                <div ref={loadMoreRef} className="mt-12 flex justify-center">
                  {isLoading ? (
                    <div className="flex items-center gap-3 rounded-full bg-muted px-6 py-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm font-medium">Loading more designs...</span>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="px-6 py-2">
                      <span className="text-sm">Scroll for more</span>
                    </Badge>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Professional Benefits Section */}
      <section className="border-t bg-gradient-to-b from-muted/20 to-background">
        <div className="container px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Why Choose {theme.keywords[0]} Graphics?
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {content.benefits.map((benefit, index) => (
                <Card key={index} className={`${styles.statCard} ${styles.fadeInUp}`} 
                      style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {benefit.icon}
                    </div>
                    <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional AI CTA Section */}
      <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container relative z-10 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Creation</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Need Something More Specific?
            </h2>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Create unlimited custom {theme.title.toLowerCase()} with our AI-powered generator.
              Get exactly what you need in seconds, not hours.
            </p>
            
            {/* Sample Prompts Grid */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {theme.samplePrompts.map((prompt, index) => (
                <Card key={index} className="group cursor-pointer border-dashed transition-all hover:border-solid hover:border-primary/50 hover:bg-primary/5">
                  <CardContent className="p-4">
                    <p className="text-sm italic text-muted-foreground group-hover:text-foreground">"{prompt}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ai-icon-generator">
                <Button size="lg" className={`gap-2 px-8 py-6 text-lg ${styles.ctaButton}`}>
                  <Sparkles className="h-5 w-5" />
                  Try AI Generator Now
                </Button>
              </Link>
              <Link href="/learn/ai-svg-generation">
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-lg">
                  <Info className="h-5 w-5" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Professional Resources Grid */}
      <section className="border-t bg-muted/20">
        <div className="container px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Essential Tools & Resources
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="group transition-all hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <FileDown className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">SVG to PNG Converter</h3>
                  <p className="mb-6 text-muted-foreground">
                    Convert your {theme.title.split(" ")[0].toLowerCase()} SVGs to PNG format for maximum compatibility
                  </p>
                  <Link href="/convert/svg-to-png">
                    <Button variant="outline" className="w-full group-hover:border-primary">
                      Open Converter
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="group transition-all hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <Edit className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">SVG Editor</h3>
                  <p className="mb-6 text-muted-foreground">
                    Edit and customize any SVG with our professional online editor
                  </p>
                  <Link href="/tools/svg-editor">
                    <Button variant="outline" className="w-full group-hover:border-primary">
                      Launch Editor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="group transition-all hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">SVG Optimizer</h3>
                  <p className="mb-6 text-muted-foreground">
                    Optimize your SVG files for better performance and smaller size
                  </p>
                  <Link href="/tools/svg-optimizer">
                    <Button variant="outline" className="w-full group-hover:border-primary">
                      Optimize SVGs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Collections with Enhanced Design */}
      {relatedThemes.length > 0 && (
        <section className="border-t">
          <div className="container px-6 py-20">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Explore Related Collections
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedThemes.map((relatedTheme, index) => (
                <Link key={relatedTheme.slug} href={`/gallery/${relatedTheme.slug}`}>
                  <Card className={`group h-full transition-all hover:shadow-lg ${styles.galleryCard} ${styles.fadeInUp}`}
                        style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {relatedTheme.title}
                        </h3>
                        <Share2 className="h-5 w-5 text-muted-foreground transition-transform group-hover:scale-110" />
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {relatedTheme.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {(relatedTheme.searchVolume / 1000).toFixed(1)}K/mo
                        </Badge>
                        <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          View collection →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal Links Section */}
      <section className="border-t bg-muted/20 py-16">
        <div className="container px-6">
          <InternalLinksEnhanced 
            pageType="gallery" 
            theme={theme}
            currentPath={`/gallery/${theme.slug}`}
          />
        </div>
      </section>

      {/* SVG Preview Modal */}
      {selectedSVG && (
        <SVGPreviewModal
          isOpen={isModalOpen}
          onClose={closePreviewModal}
          svg={{
            filename: selectedSVG.filename,
            title: selectedSVG.title,
            description: selectedSVG.description,
            tags: selectedSVG.tags,
            downloadCount: selectedSVG.downloads,
            featured: selectedSVG.featured
          }}
          theme={theme.slug}
          relatedSVGs={filteredItems
            .filter(item => item.id !== selectedSVG.id)
            .slice(0, 4)
            .map(item => ({
              filename: item.filename,
              title: item.title,
              description: item.description,
              tags: item.tags,
              downloadCount: item.downloads,
              featured: item.featured
            }))}
        />
      )}
    </div>
  )
}