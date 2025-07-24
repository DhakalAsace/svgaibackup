import { Metadata } from "next"
import AnimationTool from "./animation-tool"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, Gauge, Play, Sparkles, Zap, Clock, Code, Layers, ArrowRight, Wand2, Crown, FileVideo, Image as ImageIcon, FileText } from 'lucide-react'
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

        {/* Animation Examples Gallery */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Animation Examples</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loading Spinner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-lg p-8 flex items-center justify-center mb-4" style={{ minHeight: '150px' }}>
                  <svg width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="80 20" opacity="0.3"/>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="60 40" strokeLinecap="round">
                      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Smooth rotating loader perfect for async operations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pulse Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-lg p-8 flex items-center justify-center mb-4" style={{ minHeight: '150px' }}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="10" fill="currentColor">
                      <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Attention-grabbing pulse for notifications or CTAs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Path Drawing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-lg p-8 flex items-center justify-center mb-4" style={{ minHeight: '150px' }}>
                  <svg width="80" height="60" viewBox="0 0 80 60">
                    <path d="M10 30 Q 40 10 70 30 T 70 50" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100" strokeDashoffset="100">
                      <animate attributeName="stroke-dashoffset" to="0" dur="2s" fill="freeze"/>
                    </path>
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Elegant line drawing animation for signatures or logos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Step-by-Step Animation Tutorials</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tutorial 1: Creating a Bouncing Ball Animation</CardTitle>
              <CardDescription>Learn the basics of SVG animation with this simple example</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Step 1: Create the SVG Structure</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="50" r="20" fill="#3b82f6"/>
</svg>`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Step 2: Add the Animation</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<circle cx="100" cy="50" r="20" fill="#3b82f6">
  <animate attributeName="cy" 
    values="50;150;50" 
    dur="1s" 
    repeatCount="indefinite"/>
</circle>`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Step 3: Add Easing for Realism</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use keyTimes and keySplines for a natural bounce effect:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<animate attributeName="cy" 
  values="50;150;50" 
  dur="1s" 
  keyTimes="0;0.5;1"
  keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
  repeatCount="indefinite"/>`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tutorial 2: Logo Reveal Animation</CardTitle>
              <CardDescription>Create a professional logo animation for your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Technique 1: Fade and Scale</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Combine opacity and transform animations for a smooth reveal:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<g id="logo" opacity="0" transform="scale(0.8)">
  <!-- Your logo paths here -->
  <animateTransform attributeName="transform" 
    type="scale" from="0.8" to="1" dur="0.5s" fill="freeze"/>
  <animate attributeName="opacity" 
    from="0" to="1" dur="0.5s" fill="freeze"/>
</g>`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technique 2: Draw-In Effect</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use stroke animations for a drawing effect:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<path d="M10 10 L90 10 L90 90 L10 90 Z" 
  fill="none" stroke="#000" stroke-width="2"
  stroke-dasharray="320" stroke-dashoffset="320">
  <animate attributeName="stroke-dashoffset" 
    to="0" dur="2s" fill="freeze"/>
</path>`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 3: Interactive Hover Animations</CardTitle>
              <CardDescription>Add interactivity with CSS animations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">CSS Animation Classes</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`/* Add to your CSS */
.svg-button {
  transition: transform 0.3s ease;
}

.svg-button:hover {
  transform: scale(1.1);
}

.svg-button:hover .icon {
  animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Combining with SMIL</h4>
                <p className="text-sm text-muted-foreground">
                  Use begin="mouseover" and begin="mouseout" for pure SVG interactions:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<circle cx="50" cy="50" r="20" fill="#3b82f6">
  <animate attributeName="r" begin="mouseover" 
    dur="0.2s" to="25" fill="freeze"/>
  <animate attributeName="r" begin="mouseout" 
    dur="0.2s" to="20" fill="freeze"/>
</circle>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Animation Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Use CSS transforms instead of animating x/y attributes</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Limit simultaneous animations to prevent jank</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Use will-change CSS property for complex animations</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Optimize SVG paths before animating</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accessibility Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Provide prefers-reduced-motion alternatives</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Include descriptive titles and descriptions</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Ensure animations don't interfere with content</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <p className="text-sm">Test with screen readers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SEO Content - Key Information */}
        <div className="prose prose-gray dark:prose-invert max-w-4xl mx-auto mb-16">
          <h2>Why Use SVG Animation?</h2>
          <p>
            SVG animations offer superior performance and quality compared to traditional image formats. They remain crisp at any resolution, 
            have smaller file sizes, and provide better accessibility. Our tool makes creating these animations accessible to everyone, 
            from beginners to professional designers.
          </p>
          
          <h3>Key Benefits of SVG Animation:</h3>
          <ul>
            <li><strong>Scalability:</strong> Perfect quality at any size - from mobile to 4K displays</li>
            <li><strong>Performance:</strong> Smaller files than GIF or video (often 10x smaller)</li>
            <li><strong>SEO-Friendly:</strong> Text remains searchable and indexable by search engines</li>
            <li><strong>Accessibility:</strong> Screen reader compatible with proper ARIA labels</li>
            <li><strong>Control:</strong> Easy to modify with CSS and JavaScript</li>
            <li><strong>Browser Support:</strong> Works in all modern browsers without plugins</li>
          </ul>

          <h3>Common Use Cases:</h3>
          <ul>
            <li><strong>Logo animations:</strong> Professional brand reveals and transitions</li>
            <li><strong>Loading indicators:</strong> Smooth, lightweight progress animations</li>
            <li><strong>Interactive infographics:</strong> Data visualizations that respond to user input</li>
            <li><strong>Icon animations:</strong> Micro-interactions that enhance UX</li>
            <li><strong>Educational diagrams:</strong> Step-by-step animated explanations</li>
            <li><strong>UI animations:</strong> Button hovers, menu transitions, and form feedback</li>
          </ul>

          <h3>SVG Animation Techniques</h3>
          <p>
            There are three main approaches to animating SVGs, each with its own strengths:
          </p>
          
          <h4>1. SMIL Animation</h4>
          <p>
            SMIL (Synchronized Multimedia Integration Language) animations are defined directly in the SVG markup using elements 
            like <code>&lt;animate&gt;</code>, <code>&lt;animateTransform&gt;</code>, and <code>&lt;animateMotion&gt;</code>. 
            They're declarative, work without JavaScript, and are perfect for simple animations.
          </p>

          <h4>2. CSS Animation</h4>
          <p>
            CSS animations and transitions offer powerful control over SVG elements. They're hardware-accelerated, 
            responsive to media queries, and integrate seamlessly with your existing stylesheets. Perfect for hover 
            effects and state transitions.
          </p>

          <h4>3. JavaScript Animation</h4>
          <p>
            JavaScript provides the most flexibility, allowing complex animations, user interactions, and dynamic 
            behavior. Libraries like GSAP or Anime.js make JavaScript SVG animation even more powerful.
          </p>

          <h3>Getting Started with Our Tool</h3>
          <p>
            Our free SVG animation tool combines the best of all approaches, generating clean, optimized code that 
            works across all browsers. Whether you're creating a simple loading spinner or a complex animated 
            illustration, our visual editor makes the process intuitive and enjoyable.
          </p>
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Related SVG Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">AI SVG Generator</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create stunning SVG graphics from text prompts with AI.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full">
                    Try AI SVG Generator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">AI Icon Generator</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate unique and consistent icon sets in seconds.
                </p>
                <Link href="/ai-icon-generator">
                  <Button variant="outline" size="sm" className="w-full">
                    Try AI Icon Generator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">SVG to MP4 Video</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert SVG animations to MP4 videos with AI motion effects.
                </p>
                <Link href="/tools/svg-to-video">
                  <Button variant="outline" size="sm" className="w-full">
                    Try SVG to Video
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileVideo className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">SVG to GIF</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert SVG animations to GIF format for universal compatibility.
                </p>
                <Link href="/convert/svg-to-gif">
                  <Button variant="outline" size="sm" className="w-full">
                    Try SVG to GIF
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">SVG to PNG</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert SVG to high-quality PNG images for any resolution.
                </p>
                <Link href="/convert/svg-to-png">
                  <Button variant="outline" size="sm" className="w-full">
                    Convert to PNG
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">SVG Editor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Edit SVG code with syntax highlighting and live preview.
                </p>
                <Link href="/edit">
                  <Button variant="outline" size="sm" className="w-full">
                    Open SVG Editor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Learn More About SVG</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/learn/svg-css-animation" 
                className="inline-flex items-center px-4 py-2 border rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                SVG CSS Animation Guide
              </Link>
              <Link 
                href="/learn/check-svg-animation" 
                className="inline-flex items-center px-4 py-2 border rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Test SVG Animations
              </Link>
              <Link 
                href="/learn/what-is-svg" 
                className="inline-flex items-center px-4 py-2 border rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                What is SVG?
              </Link>
              <Link 
                href="/blog" 
                className="inline-flex items-center px-4 py-2 border rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                SVG Blog & Tutorials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

