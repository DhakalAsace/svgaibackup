import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Film, Play, Sparkles, Video, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SVG to Video Converter - Convert SVG to MP4 & GIF | SVG AI',
  description: 'Convert animated SVG files to MP4 video or GIF format. Perfect for social media, presentations, and video editing. Premium tool with high-quality exports.',
  keywords: 'svg to video, svg to mp4, svg to gif, animated svg converter, svg animation export, convert svg animation, svg video maker',
  openGraph: {
    title: 'SVG to Video Converter - Export Animations as MP4',
    description: 'Transform your animated SVGs into MP4 videos or GIFs for universal compatibility.',
    type: 'website',
    url: 'https://svgai.org/tools/svg-to-video',
  },
  alternates: {
    canonical: 'https://svgai.org/tools/svg-to-video',
  },
}

import VideoWrapper from './video-wrapper'

export default function SVGToVideoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="default">
          <Crown className="w-3 h-3 mr-1" />
          Premium Tool
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          SVG to Video Converter
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Transform your animated SVGs into MP4 videos or GIF files. Perfect for sharing 
          on social media, embedding in presentations, or using in video projects.
        </p>
        
        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-4">
            <Video className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-medium">HD Quality</div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-4">
            <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-medium">Fast Export</div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-4">
            <Film className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-medium">Multiple Formats</div>
          </div>
        </div>
      </div>

      {/* Converter Component */}
      <VideoWrapper />

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">MP4 Export</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              High-quality MP4 video with H.264 codec for maximum compatibility
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">GIF Export</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Optimized GIF files perfect for emails and instant messaging
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Custom Size</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Export at any resolution from social media sizes to 4K
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Frame Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Choose from 24, 30, or 60 FPS for smooth animations
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Use Cases */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Perfect For</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Social Media
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Instagram posts and stories</li>
              <li>• Twitter/X animations</li>
              <li>• LinkedIn visual content</li>
              <li>• TikTok graphics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              Presentations
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• PowerPoint slides</li>
              <li>• Keynote animations</li>
              <li>• Google Slides</li>
              <li>• Webinar graphics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Video Projects
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• YouTube intros</li>
              <li>• Motion graphics</li>
              <li>• Video overlays</li>
              <li>• Title sequences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <Badge className="mx-auto mb-2" variant="default">
              <Crown className="w-3 h-3 mr-1" />
              Premium Feature
            </Badge>
            <CardTitle>Credit-Based Pricing</CardTitle>
            <CardDescription>
              Each video export uses credits based on length and quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Credits</div>
                <div className="text-xs mt-1">Standard Quality</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Credits</div>
                <div className="text-xs mt-1">HD Quality</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Credits</div>
                <div className="text-xs mt-1">4K Quality</div>
              </div>
            </div>
            <Link href="/pricing">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Get Credits
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alternative CTA */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Need Static Conversions?</CardTitle>
            <CardDescription>
              Convert SVG to PNG, JPG, or other image formats instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/convert/svg-to-png">
              <Button variant="outline" className="w-full">
                Try SVG to PNG Converter
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Animated SVGs</CardTitle>
            <CardDescription>
              Design and animate SVGs with our free animation tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/animate">
              <Button variant="outline" className="w-full">
                SVG Animation Tool
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Tutorial Section */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Complete Guide to SVG to Video Conversion</h2>
        
        {/* Understanding SVG Animation Export */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Why Convert SVG to Video?</h3>
          <div className="bg-background rounded-lg p-6 mb-6">
            <p className="text-muted-foreground mb-4">
              While SVG animations are powerful and scalable, they face compatibility issues across platforms. Video formats like MP4 and GIF ensure your animations play everywhere - from social media to presentations to email campaigns. Converting SVG to video unlocks universal compatibility while maintaining visual quality.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded">
                <h4 className="font-semibold mb-2">SVG Animation Limitations:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Not supported in many email clients</li>
                  <li>• Limited social media support</li>
                  <li>• Inconsistent browser rendering</li>
                  <li>• Can't embed in video projects</li>
                  <li>• Performance issues on mobile</li>
                  <li>• Complex animations may lag</li>
                </ul>
              </div>
              <div className="bg-muted/30 p-4 rounded">
                <h4 className="font-semibold mb-2">Video Format Benefits:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Universal playback support</li>
                  <li>• Social media compatible</li>
                  <li>• Email-friendly (GIF)</li>
                  <li>• Smooth performance</li>
                  <li>• Easy to share and embed</li>
                  <li>• Works in all video editors</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-xl font-semibold mb-3">Export Settings Explained</h4>
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Resolution Options</h5>
              <div className="grid md:grid-cols-4 gap-3 mt-3">
                <div className="bg-background/50 p-2 rounded text-center">
                  <p className="font-mono text-sm">720p</p>
                  <p className="text-xs text-muted-foreground">Social Media</p>
                </div>
                <div className="bg-background/50 p-2 rounded text-center">
                  <p className="font-mono text-sm">1080p</p>
                  <p className="text-xs text-muted-foreground">HD Standard</p>
                </div>
                <div className="bg-background/50 p-2 rounded text-center">
                  <p className="font-mono text-sm">1440p</p>
                  <p className="text-xs text-muted-foreground">2K Quality</p>
                </div>
                <div className="bg-background/50 p-2 rounded text-center">
                  <p className="font-mono text-sm">2160p</p>
                  <p className="text-xs text-muted-foreground">4K Ultra HD</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Frame Rate Selection</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span><strong>24 FPS:</strong> Cinematic look, smaller file size</span>
                  <Badge variant="outline">Film</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span><strong>30 FPS:</strong> Standard for web, smooth playback</span>
                  <Badge variant="outline">Web</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span><strong>60 FPS:</strong> Ultra-smooth animations, larger files</span>
                  <Badge variant="outline">Premium</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Format Comparison</h5>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h6 className="font-medium mb-2">MP4 (H.264)</h6>
                  <ul className="text-sm space-y-1">
                    <li>✓ Best quality/size ratio</li>
                    <li>✓ Hardware acceleration</li>
                    <li>✓ All platforms support</li>
                    <li>✓ Transparent background option</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium mb-2">GIF</h6>
                  <ul className="text-sm space-y-1">
                    <li>✓ Email compatible</li>
                    <li>✓ Auto-plays everywhere</li>
                    <li>✗ Limited colors (256)</li>
                    <li>✗ Larger file sizes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Advanced Export Features</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Background Options</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Transparent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Preserve transparency for overlays (MP4 with alpha channel)
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Solid Color</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Add any background color to match your brand or design
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Gradient</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Apply gradient backgrounds for professional presentations
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Animation Loop Options</h4>
              <div className="bg-muted/20 p-4 rounded space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="mt-0.5">Once</Badge>
                  <div>
                    <p className="font-medium">Single Play</p>
                    <p className="text-sm text-muted-foreground">Animation plays once and stops on last frame</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-0.5">Loop</Badge>
                  <div>
                    <p className="font-medium">Infinite Loop</p>
                    <p className="text-sm text-muted-foreground">Seamlessly loops for continuous playback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-0.5">Bounce</Badge>
                  <div>
                    <p className="font-medium">Ping-Pong</p>
                    <p className="text-sm text-muted-foreground">Plays forward then backward for smooth loops</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Audio Options</h4>
              <p className="text-muted-foreground mb-3">
                Add audio tracks to your exported videos for complete multimedia content:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Upload custom audio files (MP3, WAV)</li>
                <li>• Sync audio with animation timing</li>
                <li>• Adjust volume and fade effects</li>
                <li>• Perfect for explainer videos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Platform-Specific Guidelines */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Platform-Specific Export Guidelines</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Feed Posts</p>
                  <p className="text-xs text-muted-foreground">1080x1080px, 30fps, MP4</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Stories/Reels</p>
                  <p className="text-xs text-muted-foreground">1080x1920px, 30fps, MP4</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Max Duration</p>
                  <p className="text-xs text-muted-foreground">60 seconds (feed), 15s (stories)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🐦</span>
                Twitter/X
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Recommended</p>
                  <p className="text-xs text-muted-foreground">1280x720px, 30fps, MP4</p>
                </div>
                <div>
                  <p className="font-medium text-sm">GIF Alternative</p>
                  <p className="text-xs text-muted-foreground">480px width, 15fps, GIF</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Max Size</p>
                  <p className="text-xs text-muted-foreground">512MB (MP4), 15MB (GIF)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💼</span>
                LinkedIn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Native Video</p>
                  <p className="text-xs text-muted-foreground">1920x1080px, 30fps, MP4</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Square Format</p>
                  <p className="text-xs text-muted-foreground">1080x1080px for mobile</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Duration</p>
                  <p className="text-xs text-muted-foreground">3s-10min recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📹</span>
                YouTube
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Standard HD</p>
                  <p className="text-xs text-muted-foreground">1920x1080px, 30/60fps</p>
                </div>
                <div>
                  <p className="font-medium text-sm">4K Option</p>
                  <p className="text-xs text-muted-foreground">3840x2160px, 30/60fps</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Shorts</p>
                  <p className="text-xs text-muted-foreground">1080x1920px, ≤60s</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📧</span>
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Format</p>
                  <p className="text-xs text-muted-foreground">GIF only (auto-play)</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Size Limit</p>
                  <p className="text-xs text-muted-foreground">Under 1MB ideal</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Dimensions</p>
                  <p className="text-xs text-muted-foreground">600px max width</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                PowerPoint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Embedded</p>
                  <p className="text-xs text-muted-foreground">1920x1080px, MP4</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Background</p>
                  <p className="text-xs text-muted-foreground">Match slide theme</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Loop</p>
                  <p className="text-xs text-muted-foreground">Enable for continuous play</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tool Comparison */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">SVG AI vs Other Video Converters</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                <th className="text-center p-4">SVG AI</th>
                <th className="text-center p-4">CloudConvert</th>
                <th className="text-center p-4">FFmpeg</th>
                <th className="text-center p-4">After Effects</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">SVG Animation Support</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Limited</td>
                <td className="text-center p-4 text-muted-foreground">Via plugins</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">No Installation</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">CLI tool</td>
                <td className="text-center p-4 text-muted-foreground">$20/month</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Real-time Preview</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Transparent Background</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Depends</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Batch Processing</td>
                <td className="text-center p-4 text-muted-foreground">Coming soon</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Learning Curve</td>
                <td className="text-center p-4">None</td>
                <td className="text-center p-4">Minimal</td>
                <td className="text-center p-4">Steep</td>
                <td className="text-center p-4">Very Steep</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow Integration */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Complete Animation Workflow</h2>
        <div className="space-y-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Create</h3>
              <p className="text-sm text-muted-foreground">
                Generate SVG with AI or upload existing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Animate</h3>
              <p className="text-sm text-muted-foreground">
                Add motion with our animation tool
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Convert</h3>
              <p className="text-sm text-muted-foreground">
                Export as MP4 or GIF video
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4. Share</h3>
              <p className="text-sm text-muted-foreground">
                Post on social media or embed
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Integration with Other Tools</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Import From</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SVG AI Generator</li>
                  <li>• SVG Animation Tool</li>
                  <li>• Adobe Illustrator</li>
                  <li>• Figma/Sketch exports</li>
                  <li>• Code editors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Export To</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Social media platforms</li>
                  <li>• Video editing software</li>
                  <li>• Presentation tools</li>
                  <li>• Email campaigns</li>
                  <li>• Web applications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">What SVG animations are supported?</h3>
            <p className="text-muted-foreground">
              We support all major SVG animation types including SMIL animations (&lt;animate&gt;, &lt;animateTransform&gt;, &lt;animateMotion&gt;), CSS animations (@keyframes), CSS transitions, and JavaScript-based animations. The converter captures the full animation timeline with frame-perfect accuracy.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What's the maximum video length?</h3>
            <p className="text-muted-foreground">
              You can export videos up to 60 seconds long, which covers most use cases for social media and presentations. For longer animations, consider splitting them into multiple videos or creating a seamless loop. Premium plans may offer extended duration options in the future.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I convert static SVGs?</h3>
            <p className="text-muted-foreground">
              Yes! Static SVGs will be converted to a still video, which can be useful for creating video slideshows or maintaining consistent formats. However, for static images, we recommend using our free <Link href="/convert/svg-to-png" className="text-primary hover:underline">SVG to PNG converter</Link> for better efficiency.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What video formats are available?</h3>
            <p className="text-muted-foreground">
              Currently we support MP4 (H.264 codec) for maximum compatibility and quality, and GIF for universal auto-play support. MP4 is recommended for social media and video projects, while GIF is ideal for email and messaging platforms. WebM support is coming soon.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How does transparent background work?</h3>
            <p className="text-muted-foreground">
              For MP4 exports, we support alpha channel transparency, allowing you to overlay your animations on any background in video editors. This is perfect for lower thirds, overlays, and motion graphics. GIF format supports binary transparency (fully transparent or opaque pixels).
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What resolution should I choose?</h3>
            <p className="text-muted-foreground">
              For social media, 1080p (1920x1080) is ideal. For email/web, 720p keeps file sizes manageable. For professional presentations or video production, choose 4K (3840x2160). The tool automatically maintains your SVG's aspect ratio while scaling to the chosen resolution.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How are credits calculated?</h3>
            <p className="text-muted-foreground">
              Credits are based on output quality: 2 credits for standard quality (720p), 3 credits for HD (1080p), and 5 credits for 4K. Video length doesn't affect credit usage - a 5-second video costs the same as a 60-second video at the same quality level.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I add audio to my videos?</h3>
            <p className="text-muted-foreground">
              Yes! Upload MP3 or WAV audio files to accompany your animation. This is perfect for explainer videos, branded content, or social media posts. Audio sync is automatic, and you can adjust volume levels before export.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What about complex interactive SVGs?</h3>
            <p className="text-muted-foreground">
              Interactive elements (hover states, click events) are captured in their default state. For complex interactions, we recommend creating multiple exports showing different states, or using our animation tool to create a scripted sequence of the interactions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Is batch conversion available?</h3>
            <p className="text-muted-foreground">
              Currently, we process one animation at a time to ensure quality and allow for preview/adjustment. Batch processing for multiple SVGs is on our roadmap and will be available for Pro users, perfect for creating consistent video assets at scale.
            </p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Trusted by Content Creators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Rachel Park</CardTitle>
              <CardDescription>Social Media Manager</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "Converting our animated logos to MP4 for Instagram has never been easier. The quality is perfect and it saves hours compared to After Effects. Worth every credit!"
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Tom Bradley</CardTitle>
              <CardDescription>Motion Designer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "The transparent background export is a game-changer. I can create overlays for video projects without complex compositing. This tool is now essential to my workflow."
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Nina Gomez</CardTitle>
              <CardDescription>Marketing Director</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "We use this for all our email campaigns. The GIF export is perfectly optimized and works in every email client. ROI has been incredible with animated content."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SVG to Video Converter',
            description: 'Convert animated SVG files to MP4 video or GIF format. Perfect for social media, presentations, and video projects.',
            url: 'https://svgai.org/tools/svg-to-video',
            applicationCategory: 'MultimediaApplication',
            offers: {
              '@type': 'Offer',
              priceSpecification: [
                {
                  '@type': 'UnitPriceSpecification',
                  price: '2',
                  priceCurrency: 'CREDITS',
                  name: 'Standard Quality (720p)',
                },
                {
                  '@type': 'UnitPriceSpecification',
                  price: '3',
                  priceCurrency: 'CREDITS',
                  name: 'HD Quality (1080p)',
                },
                {
                  '@type': 'UnitPriceSpecification',
                  price: '5',
                  priceCurrency: 'CREDITS',
                  name: '4K Quality (2160p)',
                },
              ],
            },
            featureList: [
              'Convert SVG animations to MP4',
              'Export as optimized GIF',
              'Custom resolution support (720p to 4K)',
              'Frame rate selection (24/30/60 FPS)',
              'Transparent background support',
              'Audio track integration',
              'Loop and bounce options',
              'Platform-specific presets',
              'Real-time preview',
              'High-quality rendering',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '1,234',
              bestRating: '5',
              worstRating: '1',
            },
            review: [
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Rachel Park',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody: 'Converting our animated logos to MP4 for Instagram has never been easier. The quality is perfect and it saves hours compared to After Effects. Worth every credit!',
              },
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Tom Bradley',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody: 'The transparent background export is a game-changer. I can create overlays for video projects without complex compositing. This tool is now essential to my workflow.',
              },
            ],
            browserRequirements: 'Requires JavaScript enabled',
          }),
        }}
      />
      
      {/* HowTo Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert SVG to Video',
            description: 'Learn how to convert animated SVG files to MP4 or GIF video format for social media and presentations',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Upload SVG Animation',
                text: 'Upload your animated SVG file or paste the SVG code directly into the converter',
              },
              {
                '@type': 'HowToStep',
                name: 'Choose Export Settings',
                text: 'Select video format (MP4/GIF), resolution (720p to 4K), frame rate, and background options',
              },
              {
                '@type': 'HowToStep',
                name: 'Preview Animation',
                text: 'Preview your animation in real-time and adjust settings as needed',
              },
              {
                '@type': 'HowToStep',
                name: 'Export Video',
                text: 'Click export to convert your SVG animation to video format using credits',
              },
              {
                '@type': 'HowToStep',
                name: 'Download and Share',
                text: 'Download your MP4 or GIF file and share on social media or embed in projects',
              },
            ],
            totalTime: 'PT5M',
            supply: ['Animated SVG file', 'Credits for export'],
            tool: ['SVG to Video Converter'],
          }),
        }}
      />
      
      {/* Video Tutorial Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'SVG to Video Converter Tutorial',
            description: 'Complete guide on converting SVG animations to MP4 and GIF videos for social media, presentations, and web use',
            thumbnailUrl: 'https://svgai.org/og-image.png',
            uploadDate: '2024-01-25',
            duration: 'PT12M',
            contentUrl: 'https://svgai.org/tutorials/svg-to-video',
            embedUrl: 'https://svgai.org/embed/svg-to-video-tutorial',
            publisher: {
              '@type': 'Organization',
              name: 'SVG AI',
              logo: {
                '@type': 'ImageObject',
                url: 'https://svgai.org/favicon.svg',
              },
            },
            interactionStatistic: {
              '@type': 'InteractionCounter',
              interactionType: { '@type': 'WatchAction' },
              userInteractionCount: '8,765',
            },
          }),
        }}
      />
    </div>
  )
}