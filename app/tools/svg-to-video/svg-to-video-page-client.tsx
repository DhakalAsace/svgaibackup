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

        {/* Use Cases Section */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect For Any Industry</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Create eye-catching animated videos for Instagram, TikTok, and YouTube Shorts from your brand's SVG logos and icons.
                </p>
                <Badge variant="secondary" className="text-xs">Marketing Teams</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Educational Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Transform educational diagrams and infographics into engaging animated explanations for online courses.
                </p>
                <Badge variant="secondary" className="text-xs">Educators</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Demos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Animate product illustrations and technical drawings to showcase features in compelling video presentations.
                </p>
                <Badge variant="secondary" className="text-xs">Product Teams</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logo Reveals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Create professional logo animation videos for brand introductions, video intros, and corporate presentations.
                </p>
                <Badge variant="secondary" className="text-xs">Designers</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">App Onboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Convert UI icons and illustrations into animated tutorials for seamless user onboarding experiences.
                </p>
                <Badge variant="secondary" className="text-xs">UX Teams</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NFT Animation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Bring static NFT artwork to life with custom animations, increasing value and engagement for digital collectibles.
                </p>
                <Badge variant="secondary" className="text-xs">Digital Artists</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Video Output Specs</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Format:</strong> MP4 (H.264 codec)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Resolution:</strong> 1920x1080 (Full HD)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Duration:</strong> 5 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Frame Rate:</strong> 30 FPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Bitrate:</strong> Optimized for web streaming</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Input Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>File Type:</strong> SVG format only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Max File Size:</strong> 10MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Complexity:</strong> Simple to moderate designs work best</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Elements:</strong> Distinct shapes and paths recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Colors:</strong> All color spaces supported</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Pro Tips for Best Results</h2>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">🎯 Optimize Your SVG Design</h3>
                  <p className="text-muted-foreground">
                    For best animation results, use SVGs with clear, distinct elements. Avoid overly complex designs with thousands of paths. 
                    Group related elements together and use meaningful IDs for better AI interpretation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">✍️ Write Descriptive Prompts</h3>
                  <p className="text-muted-foreground">
                    Be specific about the motion you want. Instead of "animate this", try "make the rocket fly upward leaving a trail of smoke, 
                    while the stars twinkle in the background". The more detail, the better the result.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">🎨 Consider Animation Flow</h3>
                  <p className="text-muted-foreground">
                    Think about how elements should move in relation to each other. Describe primary actions first, then secondary effects. 
                    For example: "The logo spins while scaling up, then particles burst outward".
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">⚡ Leverage AI Capabilities</h3>
                  <p className="text-muted-foreground">
                    Our AI understands concepts like physics, timing, and visual effects. You can request realistic motion blur, 
                    particle effects, morphing transitions, and even complex choreographed sequences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">SVG to Video vs Traditional Methods</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Feature</th>
                      <th className="text-center p-4">AI SVG to Video</th>
                      <th className="text-center p-4">Manual Animation</th>
                      <th className="text-center p-4">After Effects</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Time to Create</td>
                      <td className="p-4 text-center text-green-600">1-2 minutes</td>
                      <td className="p-4 text-center text-orange-600">Hours</td>
                      <td className="p-4 text-center text-orange-600">30-60 minutes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Skill Required</td>
                      <td className="p-4 text-center text-green-600">None</td>
                      <td className="p-4 text-center text-red-600">Expert</td>
                      <td className="p-4 text-center text-orange-600">Intermediate</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Cost</td>
                      <td className="p-4 text-center text-green-600">6 credits</td>
                      <td className="p-4 text-center text-red-600">$50-200/video</td>
                      <td className="p-4 text-center text-orange-600">$54.99/month</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Output Quality</td>
                      <td className="p-4 text-center text-green-600">1080p HD</td>
                      <td className="p-4 text-center text-green-600">Variable</td>
                      <td className="p-4 text-center text-green-600">Up to 4K</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Consistency</td>
                      <td className="p-4 text-center text-green-600">High</td>
                      <td className="p-4 text-center text-orange-600">Variable</td>
                      <td className="p-4 text-center text-green-600">High</td>
                    </tr>
                  </tbody>
                </table>
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
                video in 1080p Full HD resolution, compatible with all platforms and devices. The MP4 
                format ensures maximum compatibility across social media, websites, and presentation software.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How much does it cost?</h3>
              <p className="text-muted-foreground">
                Each video generation uses 6 credits. Free users get 6 credits to start (1 free video). 
                Subscribed users get monthly credits based on their plan. Starter plan includes 50 credits/month,
                and Pro plan includes 200 credits/month with additional benefits.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How long are videos stored?</h3>
              <p className="text-muted-foreground">
                Videos are stored for 7 days for free and Starter users, and 30 days for Pro subscribers. 
                Download your videos to keep them permanently. We recommend downloading immediately after 
                generation to ensure you always have access to your creations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What if generation fails?</h3>
              <p className="text-muted-foreground">
                Credits are only consumed for successful generations. If the AI fails to generate 
                your video, no credits will be deducted from your account. Our success rate is over 95%,
                and we're constantly improving the AI model for better results.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I use generated videos commercially?</h3>
              <p className="text-muted-foreground">
                Yes! All videos generated through our tool come with full commercial usage rights. You can use 
                them for marketing, social media, presentations, websites, or any other commercial purpose without 
                attribution required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What types of SVG work best?</h3>
              <p className="text-muted-foreground">
                Simple to moderately complex SVGs work best. Icons, logos, illustrations with distinct elements,
                and diagrams produce excellent results. Avoid SVGs with thousands of tiny paths or extremely 
                detailed artwork. The AI performs best with clear, recognizable shapes and elements.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I customize the video length?</h3>
              <p className="text-muted-foreground">
                Currently, all videos are 5 seconds long, which is optimal for social media engagement and 
                loading times. This duration works perfectly for logo reveals, social media posts, and 
                attention-grabbing animations. For longer videos, consider our upcoming features.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What AI technology powers this tool?</h3>
              <p className="text-muted-foreground">
                We use advanced AI video generation models that understand both visual design and motion 
                dynamics. The AI analyzes your SVG structure and your text prompt to create natural, 
                professional animations that match your vision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I edit the video after generation?</h3>
              <p className="text-muted-foreground">
                The generated MP4 files can be edited in any video editing software. However, if you need 
                different animations, we recommend generating a new video with an updated prompt for best 
                results. Each generation maintains consistent quality.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Is there a batch processing option?</h3>
              <p className="text-muted-foreground">
                Currently, videos are generated one at a time to ensure quality. Pro subscribers get priority 
                processing for faster generation times. We're exploring batch processing features for 
                enterprise users - contact us if you have high-volume needs.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h2>Understanding SVG to MP4 Conversion</h2>
          <p>
            Converting SVG to MP4 represents a significant advancement in digital content creation. While SVGs 
            are perfect for scalable graphics, MP4 videos offer universal compatibility and engagement. Our AI-powered 
            converter bridges this gap, transforming static vector graphics into dynamic video content.
          </p>
          
          <h3>Why Convert SVG to MP4?</h3>
          <p>
            MP4 videos have become the standard for digital content across all platforms. Social media algorithms 
            favor video content, showing it to 10x more users than static images. By converting your SVG designs 
            to MP4, you unlock:
          </p>
          <ul>
            <li><strong>Universal Compatibility:</strong> MP4 works everywhere - from Instagram to PowerPoint</li>
            <li><strong>Higher Engagement:</strong> Videos get 1200% more shares than text and images combined</li>
            <li><strong>Platform Optimization:</strong> Perfect for TikTok, Instagram Reels, and YouTube Shorts</li>
            <li><strong>Professional Polish:</strong> Animated logos and graphics convey innovation and quality</li>
            <li><strong>SEO Benefits:</strong> Video content ranks higher in search results</li>
          </ul>

          <h3>The AI Advantage</h3>
          <p>
            Traditional SVG to video conversion requires expensive software and animation expertise. Our AI 
            technology democratizes this process, understanding your creative intent from simple text descriptions. 
            The AI analyzes your SVG's structure, identifies key elements, and creates smooth, professional animations 
            that would typically take hours to produce manually.
          </p>

          <h3>Perfect for Modern Marketing</h3>
          <p>
            In today's fast-paced digital landscape, static content often goes unnoticed. Animated videos created 
            from your SVG assets can transform your marketing effectiveness. Whether it's a logo reveal for your 
            YouTube channel intro, an animated infographic for LinkedIn, or eye-catching product illustrations 
            for e-commerce, SVG to MP4 conversion opens new creative possibilities.
          </p>
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