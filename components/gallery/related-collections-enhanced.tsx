import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Sparkles, Download, ArrowRight } from "lucide-react"
import { GalleryTheme } from "@/app/gallery/gallery-config"

interface RelatedCollectionsEnhancedProps {
  currentTheme: string
  relatedThemes: GalleryTheme[]
}

export function RelatedCollectionsEnhanced({ currentTheme, relatedThemes }: RelatedCollectionsEnhancedProps) {
  // Add contextual links based on current theme
  const getContextualMessage = (theme: GalleryTheme): string => {
    if (currentTheme.includes("heart") && theme.slug.includes("wedding")) {
      return "Perfect for romantic projects"
    }
    if (currentTheme.includes("birthday") && theme.slug.includes("mama")) {
      return "Great for family celebrations"
    }
    if (currentTheme.includes("animal") && theme.slug.includes("paw")) {
      return "More pet-themed designs"
    }
    if (theme.searchVolume > 5000) {
      return "Trending collection"
    }
    return "Popular choice"
  }

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Explore Related Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover more SVG collections that complement your current selection. 
            Can't find what you need? <Link href="/" className="text-primary hover:underline">Create custom designs with AI</Link>.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
          {relatedThemes.map((theme) => (
            <Link key={theme.slug} href={`/gallery/${theme.slug}`}>
              <Card className="h-full group hover:shadow-xl hover:border-primary transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {theme.title}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme.searchVolume > 5000 && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {theme.searchVolume < 1000 && (
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Unique
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getContextualMessage(theme)}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      30+ designs
                    </span>
                    <span>Free download</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional CTA after related collections */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Looking for something specific that's not in our collections?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create Custom SVG with AI
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" className="gap-2">
                Browse All Collections
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}