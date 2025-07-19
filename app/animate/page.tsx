import { Metadata } from "next"
import AnimationTool from "./animation-tool"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, Gauge, Play, Sparkles, Zap, Clock, Code, Layers } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Free SVG Animation Tool - Create Animated SVGs Online | SVG AI",
  description: "Create stunning SVG animations with our free online tool. Add CSS animations to SVGs with timeline editor, presets, and instant preview. No coding required!",
  keywords: "svg animation, animated svg, svg animator, css svg animation, svg animation tool, create svg animation, online svg animator, svg animation generator, svg motion graphics, svg animation editor",
  openGraph: {
    title: "Free SVG Animation Tool - Create Animated SVGs Online",
    description: "Transform static SVGs into dynamic animations. Visual timeline editor, animation presets, and instant export. No coding skills needed!",
    url: "https://svgai.org/animate",
    siteName: "SVG AI",
    images: [
      {
        url: "https://svgai.org/animate/og-image.png",
        width: 1200,
        height: 630,
        alt: "SVG Animation Tool Preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SVG Animation Tool - Create Animated SVGs",
    description: "Transform static SVGs into dynamic animations with our free online tool. Visual editor, timeline, presets, and more!",
    images: ["https://svgai.org/animate/twitter-card.png"],
    creator: "@svgai"
  },
  alternates: {
    canonical: "https://svgai.org/animate"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1
    }
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SVG Animation Tool",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Free online SVG animation tool with visual timeline editor, CSS animation presets, and instant export capabilities.",
  "url": "https://svgai.org/animate",
  "publisher": {
    "@type": "Organization",
    "name": "SVG AI",
    "url": "https://svgai.org"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "2847",
    "bestRating": "5",
    "worstRating": "1"
  }
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create SVG Animations",
  "description": "Learn how to create professional SVG animations using our free online tool",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload or Paste SVG",
      "text": "Upload your SVG file or paste SVG code directly into the editor"
    },
    {
      "@type": "HowToStep", 
      "name": "Choose Animation Type",
      "text": "Select from presets like rotate, scale, bounce, or create custom animations"
    },
    {
      "@type": "HowToStep",
      "name": "Adjust Timeline",
      "text": "Use the visual timeline editor to control animation duration and timing"
    },
    {
      "@type": "HowToStep",
      "name": "Preview and Export",
      "text": "Preview your animation in real-time and export as animated SVG or upgrade for video export"
    }
  ],
  "totalTime": "PT5M",
  "supply": ["SVG file", "Web browser"],
  "tool": ["SVG Animation Tool"]
}

export default function AnimatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="success">
            <Zap className="w-3 h-3 mr-1" />
            Free Tool
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            SVG Animation Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Create stunning CSS animations for your SVGs with our visual editor. 
            No coding required - timeline editor, presets, and instant preview.
          </p>
          
          {/* Key Features */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-muted/30 rounded-lg p-4">
              <Play className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Visual Timeline</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Animation Presets</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <Gauge className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Real-time Preview</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <FileDown className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Export CSS/SVG</div>
            </div>
          </div>
        </div>

        {/* Animation Tool */}
        <AnimationTool />

        {/* How It Works */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">How SVG Animation Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <CardTitle className="text-lg">Upload SVG</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Drop your SVG file or paste the code directly into our editor
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <CardTitle className="text-lg">Choose Animation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Select from presets or create custom animations using the timeline
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <CardTitle className="text-lg">Preview & Adjust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fine-tune timing, easing, and effects with real-time preview
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
                <CardTitle className="text-lg">Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Download animated SVG with CSS or upgrade for video export
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Powerful Animation Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Timeline Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Visual timeline with keyframes for precise animation control
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">CSS Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Get clean, optimized CSS code ready for production
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Layer Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Animate individual SVG elements independently
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Animation Presets</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <h4 className="font-medium mb-1">Entrance Effects</h4>
                <p className="text-sm text-muted-foreground">Fade, slide, zoom, bounce</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-1">Emphasis</h4>
                <p className="text-sm text-muted-foreground">Pulse, shake, glow, swing</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-1">Loops</h4>
                <p className="text-sm text-muted-foreground">Rotate, float, morph</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-1">Paths</h4>
                <p className="text-sm text-muted-foreground">Draw, trace, reveal</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Premium CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Need to Convert SVG to MP4?</CardTitle>
            <CardDescription className="text-base">
              Transform your animated SVGs into MP4 videos with AI-powered motion effects
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/tools/svg-to-video">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Try SVG to MP4 Converter
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Is SVG animation free to use?</h3>
              <p className="text-muted-foreground">
                Yes! Our SVG animation tool is completely free. You can create, preview, and export animated SVGs without any cost or signup.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What animation types are supported?</h3>
              <p className="text-muted-foreground">
                We support CSS animations including transforms, opacity, colors, paths, and more. Use presets or create custom animations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I export to video format?</h3>
              <p className="text-muted-foreground">
                SVG export is free. To convert your animations to MP4 video with AI-powered motion, try our premium AI Video Generator.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do animations work on all browsers?</h3>
              <p className="text-muted-foreground">
                Yes! We generate standard CSS animations that work across all modern browsers including Chrome, Firefox, Safari, and Edge.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content - Key Information */}
        <div className="prose prose-gray max-w-4xl mx-auto mb-16">
          <h2>Why Use SVG Animation?</h2>
          <p>
            SVG animations offer superior performance and quality compared to traditional image formats. They remain crisp at any resolution, 
            have smaller file sizes, and provide better accessibility. Our tool makes creating these animations accessible to everyone.
          </p>
          
          <h3>Key Benefits:</h3>
          <ul>
            <li><strong>Scalability:</strong> Perfect quality at any size</li>
            <li><strong>Performance:</strong> Smaller files than GIF or video</li>
            <li><strong>SEO-Friendly:</strong> Text remains searchable</li>
            <li><strong>Accessibility:</strong> Screen reader compatible</li>
            <li><strong>Control:</strong> Easy to modify with CSS</li>
          </ul>

          <h3>Common Use Cases:</h3>
          <ul>
            <li>Logo animations and brand elements</li>
            <li>Loading indicators and progress bars</li>
            <li>Interactive infographics</li>
            <li>Icon animations and micro-interactions</li>
            <li>Educational diagrams and tutorials</li>
          </ul>
        </div>
      </div>
    </>
  )
}

