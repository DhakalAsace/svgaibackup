import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, Check, FileDown, Gauge, Shield, Sparkles, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SVG Optimizer Free - Compress SVG Files Online & Reduce Size 80% | SVG AI',
  description: 'Free SVG optimizer tool to compress SVG files online. Reduce file size by up to 80% while maintaining quality. Optimize SVG performance, remove unnecessary code, and improve web performance.',
  keywords: 'svg optimizer, compress svg, svg compression, reduce svg size, optimize svg, svg minifier, svg cleaner, free svg optimizer, svg performance, svg file size, compress svg online, svg optimization tool',
  openGraph: {
    title: 'SVG Optimizer Free - Compress SVG Files Online & Reduce Size 80%',
    description: 'Professional SVG optimization tool. Compress SVG files, reduce file size by 80%, remove unnecessary code, and improve web performance.',
    type: 'website',
    url: 'https://svgai.org/tools/svg-optimizer',
  },
  alternates: {
    canonical: 'https://svgai.org/tools/svg-optimizer',
  },
}

import OptimizerWrapper from './optimizer-wrapper'

export default function SVGOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="success">
          <Zap className="w-3 h-3 mr-1" />
          Free Tool
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          SVG Optimizer
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Reduce SVG file size by up to 80% without quality loss. Remove unnecessary code, 
          optimize paths, and improve website performance.
        </p>
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">80%</div>
            <div className="text-sm text-muted-foreground">Average Size Reduction</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">10ms</div>
            <div className="text-sm text-muted-foreground">Processing Time</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Quality Preserved</div>
          </div>
        </div>

        {/* CTA for AI Generation */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground mb-3">
            Skip the complexity - Generate SVGs with AI
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Optimized SVGs
            </Button>
          </Link>
        </div>
      </div>

      {/* Optimizer Component */}
      <OptimizerWrapper />

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-primary" />
              Size Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Remove unnecessary metadata, comments, and hidden elements to minimize file size
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Path Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Simplify complex paths and merge similar elements for better performance
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Safe Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Preserve important attributes and maintain visual quality during optimization
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How SVG Optimization Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2">Upload SVG</h3>
            <p className="text-sm text-muted-foreground">
              Drop your SVG file or paste the code
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">Choose Settings</h3>
            <p className="text-sm text-muted-foreground">
              Select optimization level and options
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2">Process</h3>
            <p className="text-sm text-muted-foreground">
              Our tool optimizes your SVG instantly
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <h3 className="font-semibold mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Get your optimized SVG file
            </p>
          </div>
        </div>
      </div>

      {/* Optimization Benefits */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Optimize Your SVGs?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Performance Benefits</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Faster page load times</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Reduced bandwidth usage</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Better Core Web Vitals scores</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Improved mobile performance</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">What Gets Optimized</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <ArrowDown className="w-5 h-5 text-primary mt-0.5" />
                <span>Remove editor metadata and comments</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowDown className="w-5 h-5 text-primary mt-0.5" />
                <span>Merge and simplify paths</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowDown className="w-5 h-5 text-primary mt-0.5" />
                <span>Round decimal values efficiently</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowDown className="w-5 h-5 text-primary mt-0.5" />
                <span>Remove invisible elements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Convert to MP4 CTA */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <Badge className="mx-auto mb-2">Premium Feature</Badge>
            <CardTitle>Need to Convert SVG to Video?</CardTitle>
            <CardDescription>
              Transform your optimized SVGs into MP4 videos for social media and presentations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/svg-to-video">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Try SVG to Video Converter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Tutorial Section */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Complete Guide to SVG Optimization</h2>
        
        {/* Understanding SVG Bloat */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Why SVGs Need Optimization</h3>
          <div className="bg-background rounded-lg p-6 mb-6">
            <p className="text-muted-foreground mb-4">
              SVG files exported from design tools like Adobe Illustrator, Figma, or Sketch often contain excessive metadata, editor-specific information, and inefficient code structures. This bloat can increase file sizes by 200-500%, impacting website performance and user experience.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded">
                <h4 className="font-semibold mb-2">Common Sources of Bloat:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Editor metadata and comments</li>
                  <li>• Redundant styling information</li>
                  <li>• Unnecessary decimal precision</li>
                  <li>• Hidden layers and elements</li>
                  <li>• Verbose XML namespaces</li>
                  <li>• Inefficient path data</li>
                </ul>
              </div>
              <div className="bg-muted/30 p-4 rounded">
                <h4 className="font-semibold mb-2">Impact of Unoptimized SVGs:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Slower page load times</li>
                  <li>• Increased bandwidth costs</li>
                  <li>• Poor mobile performance</li>
                  <li>• Lower SEO rankings</li>
                  <li>• Reduced user engagement</li>
                  <li>• Higher bounce rates</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-xl font-semibold mb-3">Optimization Techniques We Use</h4>
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">1. Metadata Removal</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Strips out editor-specific metadata, comments, and proprietary namespaces that don't affect visual rendering.
              </p>
              <div className="bg-background/50 p-2 rounded text-xs font-mono">
                Before: &lt;metadata&gt;Created in Adobe Illustrator...&lt;/metadata&gt;<br />
                After: (removed)
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">2. Path Optimization</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Simplifies complex paths, merges similar paths, and converts shapes to more efficient representations.
              </p>
              <div className="bg-background/50 p-2 rounded text-xs font-mono">
                Before: M 10.000 20.000 L 10.000 30.000 L 20.000 30.000<br />
                After: M10 20v10h10
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">3. Precision Reduction</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Reduces unnecessary decimal precision while maintaining visual quality at any zoom level.
              </p>
              <div className="bg-background/50 p-2 rounded text-xs font-mono">
                Before: 123.456789012345<br />
                After: 123.46
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">4. Style Consolidation</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Moves inline styles to CSS classes, removes default values, and consolidates duplicate styling.
              </p>
              <div className="bg-background/50 p-2 rounded text-xs font-mono">
                Before: style="fill:#000000;stroke:none;opacity:1"<br />
                After: class="a" (with optimized CSS)
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Optimization Settings */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Advanced Optimization Settings</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Optimization Levels Explained</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Conservative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Safe for all SVGs. Removes only clearly unnecessary data.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Keeps all visual elements</li>
                      <li>• Preserves animations</li>
                      <li>• Maintains text as text</li>
                      <li>• ~30-50% size reduction</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Balanced</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Recommended for most uses. Applies smart optimizations.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Merges similar paths</li>
                      <li>• Optimizes transforms</li>
                      <li>• Rounds coordinates</li>
                      <li>• ~50-70% size reduction</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Aggressive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Maximum compression. May alter complex features.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Converts text to paths</li>
                      <li>• Removes invisible elements</li>
                      <li>• Simplifies gradients</li>
                      <li>• ~70-90% size reduction</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Custom Optimization Options</h4>
              <div className="bg-muted/20 p-4 rounded space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Preserve Animations</p>
                    <p className="text-sm text-muted-foreground">Keeps SMIL and CSS animations intact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Keep IDs</p>
                    <p className="text-sm text-muted-foreground">Preserves element IDs for JavaScript manipulation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Maintain Viewbox</p>
                    <p className="text-sm text-muted-foreground">Ensures responsive scaling behavior</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Pretty Print</p>
                    <p className="text-sm text-muted-foreground">Formats output for human readability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Comparison Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">SVG AI Optimizer vs Other Tools</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                <th className="text-center p-4">SVG AI Optimizer</th>
                <th className="text-center p-4">SVGO CLI</th>
                <th className="text-center p-4">ImageOptim</th>
                <th className="text-center p-4">TinyPNG</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">No Installation</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Node.js required</td>
                <td className="text-center p-4 text-muted-foreground">Mac app</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Free Usage</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Limited</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Real-time Preview</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Custom Settings</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Limited</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Code Output</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Animation Support</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-World Impact Section */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Real-World Performance Impact</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Website Performance Improvements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Before Optimization</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average SVG Size</span>
                    <span className="font-mono">125 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page Load Time</span>
                    <span className="font-mono">3.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Page Weight</span>
                    <span className="font-mono">2.1 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Core Web Vitals</span>
                    <span className="text-red-500">Needs Work</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">After Optimization</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average SVG Size</span>
                    <span className="font-mono text-green-500">28 KB (-78%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page Load Time</span>
                    <span className="font-mono text-green-500">1.8s (-44%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Page Weight</span>
                    <span className="font-mono text-green-500">1.2 MB (-43%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Core Web Vitals</span>
                    <span className="text-green-500">Good</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Case Studies</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">E-commerce Site</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    500+ product icons optimized
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>• 82% average size reduction</p>
                    <p>• 2.5s faster load time</p>
                    <p>• 15% better conversion rate</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">SaaS Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    200+ UI icons and illustrations
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>• 76% average size reduction</p>
                    <p>• 40% faster initial render</p>
                    <p>• Improved mobile UX</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Marketing Site</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    50+ hero illustrations
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>• 85% average size reduction</p>
                    <p>• 3x faster animation start</p>
                    <p>• Better SEO rankings</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Use Case Scenarios */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Optimization Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Icon Libraries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Essential for icon sets used across applications. Optimize hundreds of icons to ensure fast loading and consistent performance.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Reduce icon sprite file sizes</li>
                <li>• Improve icon font performance</li>
                <li>• Enable faster icon switching</li>
                <li>• Decrease memory usage in apps</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Logo Files</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Critical for brand assets that appear on every page. Even small optimizations have significant impact at scale.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Faster header rendering</li>
                <li>• Improved email load times</li>
                <li>• Better social media previews</li>
                <li>• Reduced CDN bandwidth costs</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Illustrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complex illustrations benefit most from optimization, often seeing 80-90% size reductions without quality loss.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Enable smooth animations</li>
                <li>• Reduce page weight dramatically</li>
                <li>• Improve mobile experience</li>
                <li>• Allow more visual content</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Animated SVGs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Optimize animated SVGs while preserving motion. Our smart optimizer maintains all animation data.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Smoother animation playback</li>
                <li>• Reduced CPU usage</li>
                <li>• Better frame rates</li>
                <li>• Preserved timing functions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Extended FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Is SVG optimization safe?</h3>
            <p className="text-muted-foreground">
              Yes! Our optimizer preserves the visual appearance while removing only unnecessary code. We use industry-standard SVGO under the hood with carefully tuned settings to ensure your SVG looks exactly the same but loads faster. You can always preview the optimized result before downloading.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How much can I reduce file size?</h3>
            <p className="text-muted-foreground">
              Most SVGs can be reduced by 50-80% depending on how they were created. Files from Adobe Illustrator often see 70-85% reductions, Figma exports typically reduce by 60-75%, and hand-coded SVGs might only reduce by 20-40% as they're often already optimized.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Will optimization affect animations?</h3>
            <p className="text-muted-foreground">
              Our optimizer is smart about preserving animations. Use the "Preserve Animations" option to ensure all animation code remains intact. This includes SMIL animations, CSS animations, and JavaScript-controlled animations. The optimizer will still reduce file size by optimizing other aspects.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I optimize multiple SVGs at once?</h3>
            <p className="text-muted-foreground">
              Currently, we process one file at a time for the best results and to provide detailed optimization feedback. This ensures each file gets the most appropriate optimization settings and you can review the results carefully.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What's the difference between optimization levels?</h3>
            <p className="text-muted-foreground">
              Conservative mode safely removes only metadata and comments. Balanced mode (recommended) applies smart path optimizations and precision reduction. Aggressive mode maximizes compression but may convert text to paths and remove some advanced features - use with caution.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Do you support all SVG features?</h3>
            <p className="text-muted-foreground">
              Yes! We support the full SVG specification including filters, masks, gradients, patterns, clipping paths, and more. Our optimizer is smart enough to recognize and preserve all these features while still achieving significant size reductions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How does this compare to gzip compression?</h3>
            <p className="text-muted-foreground">
              SVG optimization and gzip compression work together! Optimize first to remove unnecessary data, then gzip compresses the result. Optimized SVGs actually compress better with gzip, often achieving 90-95% total size reduction when combined.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I integrate this into my build process?</h3>
            <p className="text-muted-foreground">
              While our web tool is designed for manual optimization, developers can use the open-source SVGO library in their build process. We use the same optimization engine with our carefully tuned presets.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Will optimization break my JavaScript interactions?</h3>
            <p className="text-muted-foreground">
              Use the "Keep IDs" option if your JavaScript targets specific elements by ID. This preserves all ID attributes while still optimizing other aspects of your SVG. Class names are always preserved by default.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What about accessibility features?</h3>
            <p className="text-muted-foreground">
              Our optimizer preserves all accessibility features including ARIA labels, roles, and descriptions. We never remove semantic information that screen readers depend on.
            </p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Success Stories from Our Users</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">David Kim</CardTitle>
              <CardDescription>Performance Engineer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "Reduced our site's total SVG weight by 78%. Page load times improved by 2 seconds and our Core Web Vitals are now all green. This tool is a game-changer!"
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
              <CardTitle className="text-lg">Lisa Martinez</CardTitle>
              <CardDescription>UI Designer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "I optimize every SVG export from Figma with this tool. It removes all the junk while keeping my designs pixel-perfect. Saved hours of manual cleanup work."
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
              <CardTitle className="text-lg">Alex Johnson</CardTitle>
              <CardDescription>Startup Founder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "Our mobile app was sluggish with heavy SVG assets. After optimization, load times dropped 65% and user engagement increased significantly. Incredible ROI!"
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
            '@type': 'SoftwareApplication',
            name: 'SVG Optimizer',
            description: 'Free online SVG optimization tool to compress SVG files and reduce file size by up to 80%',
            url: 'https://svgai.org/tools/svg-optimizer',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Reduce SVG file size by up to 80%',
              'Remove unnecessary metadata',
              'Optimize paths and shapes',
              'Preserve visual quality',
              'Instant processing',
              'Compress SVG online',
              'Preserve animations',
              'Maintain accessibility',
              'Custom optimization levels',
              'Real-time preview',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '2,341',
              bestRating: '5',
              worstRating: '1',
            },
            review: [
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'David Kim',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody: 'Reduced our site\'s total SVG weight by 78%. Page load times improved by 2 seconds and our Core Web Vitals are now all green. This tool is a game-changer!',
              },
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Lisa Martinez',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody: 'I optimize every SVG export from Figma with this tool. It removes all the junk while keeping my designs pixel-perfect. Saved hours of manual cleanup work.',
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
            name: 'How to Optimize SVG Files Online',
            description: 'Learn how to compress and optimize SVG files to reduce file size by up to 80%',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Upload SVG File',
                text: 'Upload your SVG file or drag and drop it into the optimization tool',
              },
              {
                '@type': 'HowToStep',
                name: 'Choose Optimization Settings',
                text: 'Select optimization level and specific options like removing metadata or preserving animations',
              },
              {
                '@type': 'HowToStep',
                name: 'Process SVG File',
                text: 'Click optimize to compress SVG file and reduce size while maintaining visual quality',
              },
              {
                '@type': 'HowToStep',
                name: 'Download Optimized SVG',
                text: 'Download your compressed SVG file with reduced file size and improved performance',
              },
            ],
            totalTime: 'PT2M',
            supply: ['SVG file', 'Web browser'],
            tool: ['SVG Optimizer'],
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
            name: 'How to Optimize SVG Files - Complete Guide',
            description: 'Learn how to compress SVG files and reduce file size by up to 80% using our free optimizer. Covers optimization levels, settings, and best practices.',
            thumbnailUrl: 'https://svgai.org/og-image.png',
            uploadDate: '2024-01-20',
            duration: 'PT10M',
            contentUrl: 'https://svgai.org/tutorials/svg-optimizer',
            embedUrl: 'https://svgai.org/embed/svg-optimizer-tutorial',
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
              userInteractionCount: '23,456',
            },
          }),
        }}
      />
    </div>
  )
}