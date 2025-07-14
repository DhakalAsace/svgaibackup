"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, Search, Sparkles, Grid, List } from "lucide-react"
import { GalleryTheme, getRelatedThemes } from "@/app/gallery/gallery-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GalleryPageTemplateProps {
  theme: GalleryTheme
}

interface SVGItem {
  id: string
  title: string
  svg: string
  tags: string[]
  downloads: number
}

// Sample SVG data - in production, this would come from a database or API
function generateSampleSVGs(theme: GalleryTheme): SVGItem[] {
  const baseShapes = {
    heart: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>`,
    star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>`,
    flower: `<circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="5" r="3" fill="currentColor" opacity="0.8"/><circle cx="19" cy="12" r="3" fill="currentColor" opacity="0.8"/><circle cx="12" cy="19" r="3" fill="currentColor" opacity="0.8"/><circle cx="5" cy="12" r="3" fill="currentColor" opacity="0.8"/>`,
    butterfly: `<path d="M12 2C6 2 2 6 2 12s4 10 10 10c1 0 2-1 2-2s-1-2-2-2c-4 0-8-4-8-8s4-8 8-8 8 4 8 8c0 1 1 2 2 2s2-1 2-2c0-6-4-10-10-10z" fill="currentColor"/>`,
    arrow: `<path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/>`,
    circle: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>`,
    cat: `<path d="M12 2l-4 4v6c0 3.3 2.7 6 6 6h4c3.3 0 6-2.7 6-6V6l-4-4h-8zm-2 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" fill="currentColor"/>`,
    sun: `<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v6m0 6v6m-9-9h6m6 0h6m-4.22-4.22l-4.22 4.22m0 0l-4.22 4.22m0-4.22l4.22-4.22m4.22 0l4.22 4.22" stroke="currentColor" stroke-width="2"/>`,
  }

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#DDA0DD", "#98D8C8", "#FFE66D"]
  const variations = ["outline", "filled", "gradient", "pattern", "minimalist", "decorative", "geometric", "hand-drawn"]
  
  const items: SVGItem[] = []
  const baseShape = baseShapes[theme.slug.split("-")[0] as keyof typeof baseShapes] || baseShapes.circle
  
  for (let i = 0; i < 24; i++) {
    const color = colors[i % colors.length]
    const variation = variations[i % variations.length]
    const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${baseShape.replace(/currentColor/g, color)}</svg>`
    
    items.push({
      id: `${theme.slug}-${i + 1}`,
      title: `${theme.title.split(" ")[0]} ${variation} #${i + 1}`,
      svg,
      tags: [variation, theme.slug.split("-")[0], "free", "download"],
      downloads: Math.floor(Math.random() * 5000) + 100
    })
  }
  
  return items
}

export default function GalleryPageTemplate({ theme }: GalleryPageTemplateProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredItems, setFilteredItems] = useState<SVGItem[]>([])
  const [svgItems, setSvgItems] = useState<SVGItem[]>([])
  
  const relatedThemes = getRelatedThemes(theme.slug)

  useEffect(() => {
    // Generate sample SVGs - in production, fetch from API
    const items = generateSampleSVGs(theme)
    setSvgItems(items)
    setFilteredItems(items)
  }, [theme])

  useEffect(() => {
    if (searchQuery) {
      const filtered = svgItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(svgItems)
    }
  }, [searchQuery, svgItems])

  const downloadSVG = (item: SVGItem) => {
    const blob = new Blob([item.svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.id}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {theme.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {theme.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/ai-icon-generator">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Create Custom {theme.title.split(" ")[0]} with AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Search ${theme.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredItems.length} designs
              </span>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                <TabsList>
                  <TabsTrigger value="grid" className="gap-2">
                    <Grid className="h-4 w-4" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Gallery Grid */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          {viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted/50 p-8 transition-colors group-hover:bg-muted">
                      <div 
                        className="h-full w-full"
                        dangerouslySetInnerHTML={{ __html: item.svg }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => downloadSVG(item)}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-20 w-20 shrink-0 bg-muted/50 p-2">
                      <div 
                        className="h-full w-full"
                        dangerouslySetInnerHTML={{ __html: item.svg }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => downloadSVG(item)}
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Generator CTA */}
      <section className="border-t bg-muted/50">
        <div className="container px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Need Something More Specific?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Create custom {theme.title.toLowerCase()} with our AI-powered generator.
              Get exactly what you need in seconds.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {theme.samplePrompts.map((prompt, index) => (
                <Card key={index} className="border-dashed">
                  <CardContent className="p-4">
                    <p className="text-sm italic">"{prompt}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link href="/ai-icon-generator" className="mt-8 inline-block">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Try AI Generator Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Themes */}
      {relatedThemes.length > 0 && (
        <section className="border-t">
          <div className="container px-4 py-16">
            <h2 className="text-2xl font-bold tracking-tight">
              Related Collections
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedThemes.map((relatedTheme) => (
                <Link key={relatedTheme.slug} href={`/gallery/${relatedTheme.slug}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold">{relatedTheme.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {relatedTheme.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}