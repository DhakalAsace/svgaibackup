import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Crown, Film, Play, Sparkles, Video, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SVG to MP4 Converter Online - Convert SVG Animation to Video',
  description: 'Convert SVG to MP4 video online. Transform animated SVG files into MP4 format for social media, presentations, and video projects. High-quality conversion with custom settings.',
  keywords: 'svg to mp4, convert svg to mp4, svg to video, svg animation to mp4, svg to mp4 converter, online svg to mp4, animated svg to video',
  openGraph: {
    title: 'SVG to MP4 Converter - Transform SVG Animations to Video',
    description: 'Professional SVG to MP4 conversion tool. Export your animated SVGs as high-quality MP4 videos.',
    type: 'website',
    url: 'https://svgai.org/convert/svg-to-mp4',
  },
  alternates: {
    canonical: 'https://svgai.org/convert/svg-to-mp4',
  },
}

export const revalidate = 1800 // 30 minutes for this specific high-value page

export default function SVGToMP4Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="default">
          <Crown className="w-3 h-3 mr-1" />
          Premium Converter
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          SVG to MP4 Converter
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Convert animated SVG files to MP4 video format online. Perfect for creating 
          shareable videos from your SVG animations for social media and presentations.
        </p>
        
        {/* CTA Button */}
        <Link href="/tools/svg-to-video">
          <Button size="lg" className="gap-2">
            <Video className="w-5 h-5" />
            Start Converting
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Film className="w-8 h-8 text-primary mb-2" />
            <CardTitle>High-Quality Video</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Export your SVG animations as crisp MP4 videos with H.264 encoding for universal playback
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Custom Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Choose resolution, frame rate, and duration to perfectly match your needs
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Play className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Instant Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Preview your animation before conversion to ensure perfect results every time
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How to Convert SVG to MP4</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2">Upload SVG</h3>
            <p className="text-sm text-muted-foreground">
              Select your animated SVG file
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">Configure</h3>
            <p className="text-sm text-muted-foreground">
              Set quality, FPS, and duration
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2">Convert</h3>
            <p className="text-sm text-muted-foreground">
              Process your animation to MP4
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <h3 className="font-semibold mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Save your MP4 video file
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">SVG vs MP4: When to Convert</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Keep as SVG when:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>You need scalable graphics for web</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>File size needs to be minimal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Animations are simple and CSS-based</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>You need interactive elements</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Convert to MP4 when:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span>Sharing on social media platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span>Embedding in presentations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span>Using in video editing software</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span>Need universal compatibility</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-muted/30 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Use Cases</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Social Media</h3>
            <p className="text-sm text-muted-foreground">
              Instagram, Twitter, LinkedIn posts
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Presentations</h3>
            <p className="text-sm text-muted-foreground">
              PowerPoint, Keynote, Google Slides
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Video Projects</h3>
            <p className="text-sm text-muted-foreground">
              Intros, overlays, transitions
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Marketing</h3>
            <p className="text-sm text-muted-foreground">
              Ads, banners, email campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Pricing CTA */}
      <div className="text-center mb-12">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <Badge className="mx-auto mb-2" variant="default">
              <Crown className="w-3 h-3 mr-1" />
              Premium Feature
            </Badge>
            <CardTitle>Ready to Convert SVG to MP4?</CardTitle>
            <CardDescription>
              High-quality video conversion starting at just 2 credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/svg-to-video">
              <Button size="lg" className="gap-2">
                <Video className="w-4 h-4" />
                Convert Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Related Tools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/convert/svg-to-png">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">SVG to PNG</CardTitle>
                <CardDescription>Convert SVG to static PNG images</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/tools/svg-editor">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">SVG Editor</CardTitle>
                <CardDescription>Edit SVG code with live preview</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/animate">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">SVG Animator</CardTitle>
                <CardDescription>Create animated SVGs visually</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8">SVG to MP4 FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I convert static SVG to MP4?</h3>
            <p className="text-muted-foreground">
              Yes, static SVGs can be converted to MP4 as a still video. However, for static images, 
              we recommend using our free <Link href="/convert/svg-to-png" className="text-primary hover:underline">SVG to PNG converter</Link> instead.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What's the best quality setting for social media?</h3>
            <p className="text-muted-foreground">
              HD quality (1280×720) at 30 FPS works perfectly for most social media platforms including 
              Instagram, Twitter, and LinkedIn. This balances quality with file size.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How long can my video be?</h3>
            <p className="text-muted-foreground">
              You can create videos up to 60 seconds long. This covers most use cases including 
              social media posts, presentation clips, and video intros.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Will my animations look the same in MP4?</h3>
            <p className="text-muted-foreground">
              Our converter accurately captures SVG animations including SMIL, CSS animations, and 
              JavaScript-based animations. The MP4 will faithfully reproduce your animation.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert SVG to MP4',
            description: 'Step-by-step guide to convert animated SVG files to MP4 video format',
            totalTime: 'PT2M',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'CREDITS',
              value: '2-5',
            },
            supply: [
              {
                '@type': 'HowToSupply',
                name: 'Animated SVG file',
              },
            ],
            tool: [
              {
                '@type': 'HowToTool',
                name: 'SVG to MP4 Converter',
                url: 'https://svgai.org/tools/svg-to-video',
              },
            ],
            step: [
              {
                '@type': 'HowToStep',
                name: 'Upload SVG File',
                text: 'Click the upload area and select your animated SVG file',
                url: 'https://svgai.org/convert/svg-to-mp4#upload',
              },
              {
                '@type': 'HowToStep',
                name: 'Choose Settings',
                text: 'Select MP4 format, quality (HD recommended), and frame rate',
                url: 'https://svgai.org/convert/svg-to-mp4#settings',
              },
              {
                '@type': 'HowToStep',
                name: 'Convert',
                text: 'Click convert button to process your SVG animation',
                url: 'https://svgai.org/convert/svg-to-mp4#convert',
              },
              {
                '@type': 'HowToStep',
                name: 'Download MP4',
                text: 'Download your converted MP4 video file',
                url: 'https://svgai.org/convert/svg-to-mp4#download',
              },
            ],
          }),
        }}
      />
    </div>
  )
}