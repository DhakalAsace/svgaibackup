import { Metadata } from "next"
import Link from "next/link"
import { getAllGalleryThemes } from "./gallery-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, TrendingUp, Download, Palette, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "./gallery.module.css"

export const metadata: Metadata = {
  title: "Free SVG Gallery - 37,700+ Icons & Graphics Collections",
  description: "Browse 19 curated SVG collections with 37,700+ monthly searches. Download free hearts, icons, arrows, Christmas, flowers, and more. Commercial use allowed.",
  keywords: "svg gallery, free svg, svg icons, svg images, svg download, vector graphics, heart svg, svg icons collection, arrow svg, christmas svg",
  openGraph: {
    title: "Free SVG Gallery - 37,700+ Icons & Graphics Collections",
    description: "Browse 19 curated SVG collections. Download free hearts, icons, arrows, Christmas designs, and more. Commercial use allowed.",
    type: "website",
    url: "https://svgai.org/gallery",
    images: [
      {
        url: "https://svgai.org/og-images/gallery-index.png",
        width: 1200,
        height: 630,
        alt: "SVG AI Gallery Collections"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SVG Gallery - 37,700+ Icons & Graphics",
    description: "Browse 19 curated SVG collections. Download free designs or create custom with AI.",
    images: ["https://svgai.org/og-images/gallery-index.png"]
  },
  alternates: {
    canonical: "https://svgai.org/gallery",
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "SVG AI Gallery",
      description: "Comprehensive collection of free SVG icons and graphics across 19 popular categories",
      url: "https://svgai.org/gallery",
      numberOfItems: 19,
      provider: {
        "@type": "Organization",
        name: "SVG AI",
        url: "https://svgai.org"
      }
    })
  }
}

export default function GalleryIndexPage() {
  const themes = getAllGalleryThemes()
  const totalSearchVolume = themes.reduce((sum, theme) => sum + theme.searchVolume, 0)
  
  // Sort themes by search volume
  const sortedThemes = [...themes].sort((a, b) => b.searchVolume - a.searchVolume)
  
  // Get top themes for featured section
  const featuredThemes = sortedThemes.slice(0, 6)
  const allThemes = sortedThemes

  return (
    <div className="min-h-screen">
      {/* Hero Section with Professional Gradient */}
      <section className={`relative overflow-hidden border-b ${styles.hero}`}>
        <div className="container relative z-10 px-6 py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Free SVG Gallery</span>
            </div>
            <h1 className={`mb-6 ${styles.sectionTitle}`}>
              Free SVG Gallery & Collections
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
              Browse thousands of professional SVG icons and images across {themes.length} curated categories. 
              Download instantly or create custom designs with our AI-powered generator.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ai-icon-generator">
                <Button size="lg" className={`gap-2 px-8 py-6 text-lg ${styles.ctaButton}`}>
                  <Sparkles className="h-5 w-5" />
                  Create Custom SVGs with AI
                </Button>
              </Link>
              <Link href="#collections">
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-lg">
                  <Download className="h-5 w-5" />
                  Browse Free Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/20">
        <div className="container px-6 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{themes.length}</div>
              <div className={styles.statLabel}>SVG Collections</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Free Designs</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>FREE</div>
              <div className={styles.statLabel}>Always Free</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Free to Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className={`${styles.section} ${styles.contentSection}`}>
        <div className="container px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Popular SVG Collections
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our most searched categories, featuring high-quality designs ready for instant download
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredThemes.map((theme, index) => (
                <Link key={theme.slug} href={`/gallery/${theme.slug}`}>
                  <Card className={`group h-full transition-all duration-300 ${styles.galleryCard} ${styles.fadeInUp}`} 
                        style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {theme.title}
                          </CardTitle>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              {(theme.searchVolume / 1000).toFixed(1)}K searches
                            </Badge>
                            {index === 0 && (
                              <Badge className={`text-xs ${styles.premiumBadge}`}>
                                Most Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="rounded-full bg-primary/10 p-2 transition-all group-hover:bg-primary/20">
                          <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">
                        {theme.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          View collection →
                        </span>
                        <div className="flex gap-1">
                          {theme.keywords.slice(0, 2).map((keyword, idx) => (
                            <span key={idx} className={styles.tag}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* All Collections Grid with Enhanced Styling */}
      <section className={`border-t bg-gradient-to-b from-muted/30 to-background ${styles.section}`}>
        <div className="container px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Complete SVG Library
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Explore all {themes.length} collections featuring thousands of free SVG designs
              </p>
            </div>
            
            <div className={styles.galleryGrid}>
              {allThemes.map((theme, index) => (
                <Link key={theme.slug} href={`/gallery/${theme.slug}`}>
                  <Card className={`group h-full transition-all ${styles.listItem} hover:scale-[1.02]`}>
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {theme.title}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {theme.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {theme.title.split(' ')[0]} Collection
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          30+ designs
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container relative z-10 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
              <Zap className="h-4 w-4 text-primary" />
              <span>AI-Powered Creation</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Can't Find What You Need?
            </h2>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Generate unlimited custom SVG designs with our AI tool. Describe your vision, 
              and get professional results in seconds.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ai-icon-generator">
                <Button size="lg" className={`gap-2 px-8 py-6 text-lg ${styles.ctaButton}`}>
                  <Sparkles className="h-5 w-5" />
                  Try AI Generator Free
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-lg">
                  <Palette className="h-5 w-5" />
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-1/2 bg-gradient-to-r from-primary/5 to-transparent" />
      </section>

      {/* SEO Content Section with Professional Typography */}
      <section className="border-t bg-muted/20">
        <div className="container px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg prose-gray max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold">Free SVG Downloads for Every Project</h2>
              <p className="lead text-xl">
                Welcome to SVG AI's comprehensive gallery of free SVG icons and images. Our collection 
                spans {themes.length} popular categories, from simple geometric shapes to detailed 
                illustrations, all optimized for web and print use.
              </p>
              
              <div className="my-12 grid gap-8 md:grid-cols-2">
                <div className={`${styles.faqCard} p-6`}>
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <Download className="h-5 w-5 text-primary" />
                    Instant Downloads
                  </h3>
                  <p className="text-muted-foreground">
                    All SVGs are free to download and use immediately. No registration required, 
                    no hidden fees. Just click and download.
                  </p>
                </div>
                
                <div className={`${styles.faqCard} p-6`}>
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Customization
                  </h3>
                  <p className="text-muted-foreground">
                    Can't find exactly what you need? Generate custom SVGs with our AI tool. 
                    Describe your vision and get unique designs instantly.
                  </p>
                </div>
                
                <div className={`${styles.faqCard} p-6`}>
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <Zap className="h-5 w-5 text-primary" />
                    High Quality
                  </h3>
                  <p className="text-muted-foreground">
                    Clean, optimized vector graphics that scale perfectly. Each design is 
                    crafted for professional use in web and print.
                  </p>
                </div>
                
                <div className={`${styles.faqCard} p-6`}>
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Regular Updates
                  </h3>
                  <p className="text-muted-foreground">
                    New designs added weekly across all categories. Stay updated with the 
                    latest trends and styles in vector graphics.
                  </p>
                </div>
              </div>
              
              <h3 className="mt-12 text-2xl font-semibold">Popular SVG Categories</h3>
              <p>
                Our most popular collections include {featuredThemes.slice(0, 3).map(t => t.title.toLowerCase()).join(", ")}, 
                and more. Each category contains dozens of unique designs in various styles, from minimalist 
                line art to detailed illustrations.
              </p>
              
              <h3 className="mt-8 text-2xl font-semibold">Custom SVG Generation</h3>
              <p>
                While our gallery offers thousands of free designs, sometimes you need something specific. 
                That's where our AI-powered SVG generator comes in. Create custom icons, logos, and 
                illustrations in seconds by describing what you need.
              </p>
              
              <div className="mt-10 not-prose">
                <Link href="/ai-icon-generator">
                  <Button size="lg" className={`gap-2 ${styles.ctaButton}`}>
                    <Sparkles className="h-5 w-5" />
                    Try AI SVG Generator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}