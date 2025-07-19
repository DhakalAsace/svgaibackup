'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, ArrowRight, Video, Wand2, FileVideo, Image, FileText, Palette } from 'lucide-react'
import { SVGToVideoModal } from '@/components/svg-to-video-modal'

export default function SVGToVideoPageClient() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="default">
            <Crown className="w-3 h-3 mr-1" />
            Premium Tool
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            SVG to MP4 Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Convert SVG to MP4 video format using AI. Transform static SVG files into dynamic MP4 
            animations. Describe the motion and get a 5-second HD video.
          </p>
          
          {/* Main CTA */}
          <Button 
            size="lg" 
            className="gap-2 text-lg px-8 py-6 h-auto"
            onClick={() => setModalOpen(true)}
          >
            <Wand2 className="w-5 h-5" />
            Convert SVG to MP4
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="text-center">
            <CardHeader>
              <Video className="w-10 h-10 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">MP4 Video Output</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                5-second MP4 videos compatible with all platforms
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="w-10 h-10 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">AI-Powered Motion</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced AI understands your animation descriptions
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Crown className="w-10 h-10 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Full HD Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                1080p resolution videos optimized for all platforms
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-lg">Upload SVG</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your static SVG file. Simple designs work best for AI animation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-lg">Describe Motion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tell the AI how you want your design to move - rotation, scaling, effects, etc.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-lg">Get MP4 Video</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI generates a 5-second HD MP4 video with your custom animation. Takes about 1-2 minutes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Example */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">See It In Action</h2>
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle>Example: Shopping Cart Animation</CardTitle>
              <CardDescription className="text-base">
                Prompt: "Make this cart run forward with dust particles behind it"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-muted/20 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <video 
                    className="w-full rounded-lg shadow-lg"
                    controls
                    loop
                    muted
                    playsInline
                  >
                    <source src="/examples/cart-animation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-sm text-muted-foreground mt-4">
                    This 5-second video was generated from a simple shopping cart SVG icon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">More Animation Examples</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Logo Animation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Make the logo rotate 360 degrees while scaling up with a burst of light"
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Icon Motion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Animate the icon with a bouncing effect and add sparkles around it"
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Text Effects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Make the text appear letter by letter with a typewriter effect and glow"
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Shape Morphing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Transform the circle into a square with smooth morphing and color shift"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What format is the output video?</h3>
              <p className="text-muted-foreground">
                All videos are delivered as MP4 files. Each SVG to MP4 conversion creates a 5-second 
                video in 1080p Full HD resolution, compatible with all platforms and devices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How much does it cost?</h3>
              <p className="text-muted-foreground">
                Each video generation uses 6 credits. Free users get 6 credits to start (1 free video). 
                Subscribed users get monthly credits based on their plan.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How long are videos stored?</h3>
              <p className="text-muted-foreground">
                Videos are stored for 7 days for free and Starter users, and 30 days for Pro subscribers. 
                Download your videos to keep them permanently.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What if generation fails?</h3>
              <p className="text-muted-foreground">
                Credits are only consumed for successful generations. If the AI fails to generate 
                your video, no credits will be deducted from your account.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Related SVG Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">AI SVG Generator</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create stunning SVG graphics from text prompts.
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
                  <Sparkles className="w-5 h-5 text-primary" />
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
                  <FileVideo className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">SVG to GIF</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert SVG animations to GIF format for universal compatibility
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
                  <Palette className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Animate SVG</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create CSS animations for your SVG files with our free tool
                </p>
                <Link href="/animate">
                  <Button variant="outline" size="sm" className="w-full">
                    Animate SVG Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">SVG to PNG</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert SVG to high-quality PNG images for any resolution
                </p>
                <Link href="/convert/svg-to-png">
                  <Button variant="outline" size="sm" className="w-full">
                    Convert to PNG
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
                href="/blog" 
                className="inline-flex items-center px-4 py-2 border rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                SVG Blog & Tutorials
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Convert SVG to MP4?</CardTitle>
              <CardDescription className="text-base">
                Start converting SVG files to MP4 videos with 6 free credits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setModalOpen(true)}
              >
                <Sparkles className="w-4 h-4" />
                Start SVG to MP4 Conversion
              </Button>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Link href="/pricing">
                  <Button size="default" variant="outline" className="gap-2">
                    View Pricing
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'SVG to MP4 Converter - AI Video Generator',
              description: 'Convert SVG to MP4 video format. Transform static SVG files into dynamic MP4 animations using AI.',
              url: 'https://svgai.org/tools/svg-to-video',
              applicationCategory: 'MultimediaApplication',
              offers: {
                '@type': 'Offer',
                price: '6',
                priceCurrency: 'CREDITS',
                description: '6 credits per SVG to MP4 conversion'
              },
              featureList: [
                'SVG to MP4 conversion',
                'AI-powered motion generation using Kling 2.1',
                '5-second MP4 videos',
                '1080p Full HD resolution',
                'MP4 format output',
                'Custom animation for SVG to video'
              ],
            }),
          }}
        />
      </div>

      {/* Modal */}
      <SVGToVideoModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}