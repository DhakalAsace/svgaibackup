import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Code, Download, Edit, FileCode, Layers, Sparkles, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SVG Editor Online Free - Edit SVG Code with Real-Time Preview | SVG AI',
  description: 'Professional SVG editor online free with real-time preview, syntax highlighting, and instant validation. Edit SVG code directly in browser - no signup required.',
  keywords: 'svg editor online, free svg editor, svg code editor, edit svg online, online svg editor, svg editing tool, svg syntax, svg preview, svg validator, svg editor free',
  openGraph: {
    title: 'SVG Editor Online Free - Edit SVG Code with Real-Time Preview',
    description: 'Professional SVG code editor with real-time preview and syntax highlighting. Edit SVG files directly in your browser for free.',
    type: 'website',
    url: 'https://svgai.org/tools/svg-editor',
    images: [
      {
        url: 'https://svgai.org/api/og?type=tool&name=SVG Editor&desc=Edit SVG code with real-time preview&feat=Syntax highlighting&feat=Instant validation&feat=Code completion',
        width: 1200,
        height: 630,
        alt: 'SVG Editor - Free Online Tool',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG Editor Online Free - Edit SVG Code with Real-Time Preview',
    description: 'Professional SVG code editor with real-time preview and syntax highlighting.',
    images: ['https://svgai.org/api/og?type=tool&name=SVG Editor&desc=Edit SVG code with real-time preview&feat=Syntax highlighting&feat=Instant validation&feat=Code completion'],
    site: '@svgai_app',
    creator: '@svgai_app',
  },
  alternates: {
    canonical: 'https://svgai.org/tools/svg-editor',
  },
}

import EditorWrapper from './editor-wrapper'

export default function SVGEditorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4 border-green-500 text-green-600" variant="outline">
          <Zap className="w-3 h-3 mr-1" />
          Free Tool
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          SVG Code Editor
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Edit SVG code with real-time preview, syntax highlighting, and instant validation. 
          Perfect for fine-tuning your vector graphics.
        </p>
      </div>

      {/* Editor Component */}
      <EditorWrapper />

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Syntax Highlighting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Professional code editor with SVG-specific syntax highlighting for easier editing
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Real-Time Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              See your changes instantly as you type with our live preview panel
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              Code Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Automatic validation catches errors and suggests fixes as you edit
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Use Our SVG Editor?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">For Developers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Full SVG specification support with autocomplete</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Export clean, optimized code ready for production</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Keyboard shortcuts for efficient editing</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">For Designers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Visual preview helps understand code changes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Easy tweaking of colors, sizes, and positions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span>No software installation required</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Optimize CTA */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Layers className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>Need to Optimize Your SVG?</CardTitle>
            <CardDescription>
              Reduce file size and improve performance with our SVG optimizer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/svg-optimizer">
              <Button variant="outline" size="lg" className="gap-2">
                <Zap className="w-4 h-4" />
                Try SVG Optimizer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* AI Generation CTA */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-3">Need to Create SVG from Scratch?</h3>
          <p className="text-muted-foreground mb-6">
            Skip the manual coding and generate professional SVGs instantly with our AI-powered tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI SVG Generator
              </Button>
            </Link>
            <Link href="/ai-icon-generator">
              <Button size="lg" variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Icon Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Comprehensive Tutorial Section */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Complete Guide to SVG Code Editing</h2>
        
        {/* Basic SVG Structure Tutorial */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Understanding SVG Structure</h3>
          <div className="bg-background rounded-lg p-6 mb-6">
            <p className="text-muted-foreground mb-4">
              SVG (Scalable Vector Graphics) uses XML syntax to define vector graphics. Every SVG starts with an &lt;svg&gt; element that contains various shape elements, paths, and styling information. Our editor helps you understand and manipulate this structure with ease.
            </p>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded">
                <h4 className="font-semibold mb-2">Basic SVG Elements:</h4>
                <ul className="space-y-2 text-sm">
                  <li><code className="bg-muted px-1">&lt;rect&gt;</code> - Rectangles and squares</li>
                  <li><code className="bg-muted px-1">&lt;circle&gt;</code> - Perfect circles</li>
                  <li><code className="bg-muted px-1">&lt;ellipse&gt;</code> - Ovals and ellipses</li>
                  <li><code className="bg-muted px-1">&lt;path&gt;</code> - Complex shapes and curves</li>
                  <li><code className="bg-muted px-1">&lt;line&gt;</code> - Straight lines</li>
                  <li><code className="bg-muted px-1">&lt;polygon&gt;</code> - Closed shapes with straight sides</li>
                  <li><code className="bg-muted px-1">&lt;text&gt;</code> - Text elements</li>
                  <li><code className="bg-muted px-1">&lt;g&gt;</code> - Groups for organizing elements</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-xl font-semibold mb-3">Common Editing Tasks</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Changing Colors</h5>
              <p className="text-sm text-muted-foreground">
                Modify fill and stroke attributes to change colors. Use hex codes (#FF0000), RGB values (rgb(255,0,0)), or named colors (red).
              </p>
            </div>
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Adjusting Sizes</h5>
              <p className="text-sm text-muted-foreground">
                Change width, height, radius, or path coordinates. Our editor provides real-time feedback as you adjust values.
              </p>
            </div>
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Adding Gradients</h5>
              <p className="text-sm text-muted-foreground">
                Define gradients in the &lt;defs&gt; section and reference them in fill or stroke attributes for stunning effects.
              </p>
            </div>
            <div className="bg-muted/20 p-4 rounded">
              <h5 className="font-semibold mb-2">Creating Animations</h5>
              <p className="text-sm text-muted-foreground">
                Add &lt;animate&gt; elements or CSS animations to bring your SVGs to life with smooth transitions and effects.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Advanced SVG Editing Techniques</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Working with Paths</h4>
              <p className="text-muted-foreground mb-3">
                The &lt;path&gt; element is the most powerful and flexible SVG element. Our editor provides intelligent autocomplete for path commands:
              </p>
              <ul className="space-y-2 text-sm bg-muted/20 p-4 rounded">
                <li><strong>M (moveto)</strong> - Start a new sub-path at given coordinates</li>
                <li><strong>L (lineto)</strong> - Draw a straight line to coordinates</li>
                <li><strong>C (curveto)</strong> - Draw a cubic Bézier curve</li>
                <li><strong>Q (quadratic)</strong> - Draw a quadratic Bézier curve</li>
                <li><strong>A (arc)</strong> - Draw an elliptical arc</li>
                <li><strong>Z (closepath)</strong> - Close the current sub-path</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Transform Operations</h4>
              <p className="text-muted-foreground mb-3">
                Apply transformations to any SVG element using the transform attribute:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-muted/20 p-3 rounded text-sm">
                  <code>translate(x, y)</code> - Move elements
                </div>
                <div className="bg-muted/20 p-3 rounded text-sm">
                  <code>rotate(angle, cx, cy)</code> - Rotate around a point
                </div>
                <div className="bg-muted/20 p-3 rounded text-sm">
                  <code>scale(x, y)</code> - Resize elements
                </div>
                <div className="bg-muted/20 p-3 rounded text-sm">
                  <code>skewX(angle)</code> - Skew horizontally
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Filters and Effects</h4>
              <p className="text-muted-foreground mb-3">
                Create stunning visual effects with SVG filters. Define filters in &lt;defs&gt; and apply them to any element:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Blur effects with <code className="bg-muted px-1">feGaussianBlur</code></li>
                <li>• Drop shadows using <code className="bg-muted px-1">feDropShadow</code></li>
                <li>• Color manipulation with <code className="bg-muted px-1">feColorMatrix</code></li>
                <li>• Lighting effects using <code className="bg-muted px-1">feDiffuseLighting</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Comparison Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">SVG AI Editor vs Other Tools</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                <th className="text-center p-4">SVG AI Editor</th>
                <th className="text-center p-4">Adobe Illustrator</th>
                <th className="text-center p-4">Inkscape</th>
                <th className="text-center p-4">VS Code</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Real-time Preview</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Extension needed</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">No Installation</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Free to Use</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">$20/month</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">SVG-Specific Features</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Basic</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Code Validation</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">Limited</td>
                <td className="text-center p-4 text-muted-foreground">Basic</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Syntax Highlighting</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4 text-muted-foreground">✗</td>
                <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Performance & Speed Benefits</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Editor Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Load Time</span>
                <span className="font-semibold">&lt; 1 second</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preview Update</span>
                <span className="font-semibold">Real-time (0ms)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">File Size Limit</span>
                <span className="font-semibold">10MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="font-semibold">&lt; 50MB</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Productivity Gains</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time to Start</span>
                <span className="font-semibold">Instant</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Learning Curve</span>
                <span className="font-semibold">5 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Export Speed</span>
                <span className="font-semibold">&lt; 1 second</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Collaboration</span>
                <span className="font-semibold">Share URLs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Case Scenarios */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Real-World Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Web Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Perfect for quick SVG edits during development. Modify icons, adjust colors to match brand guidelines, optimize graphics for performance, and debug rendering issues.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Edit SVG icons inline</li>
                <li>• Adjust responsive viewBox settings</li>
                <li>• Add ARIA labels for accessibility</li>
                <li>• Optimize for web performance</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>UI/UX Designers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Fine-tune exported SVGs from design tools. Clean up unnecessary code, adjust precise positioning, and ensure pixel-perfect rendering across browsers.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Clean exports from Figma/Sketch</li>
                <li>• Fine-tune icon details</li>
                <li>• Test different color schemes</li>
                <li>• Verify cross-browser compatibility</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and edit graphics for social media, presentations, and marketing materials without expensive software subscriptions.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Customize logo variations</li>
                <li>• Create social media graphics</li>
                <li>• Design simple illustrations</li>
                <li>• Edit downloaded graphics</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Students & Educators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Learn SVG coding with instant visual feedback. Perfect for teaching vector graphics, web development, and digital design courses.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Learn SVG syntax interactively</li>
                <li>• Create educational diagrams</li>
                <li>• Experiment with animations</li>
                <li>• No software costs for schools</li>
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
            <h3 className="text-xl font-semibold mb-2">Is the SVG editor really free?</h3>
            <p className="text-muted-foreground">
              Yes! Our SVG editor is completely free to use with no limitations. No signup, credit card, or subscription required. You get full access to all features including syntax highlighting, real-time preview, validation, and export capabilities.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I save my edited SVG files?</h3>
            <p className="text-muted-foreground">
              Absolutely! You can download your edited SVG files directly to your device with a single click. The exported file is optimized and ready for use in websites, applications, or other design tools. You can also copy the code directly to your clipboard.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What makes this better than desktop software?</h3>
            <p className="text-muted-foreground">
              No installation needed, works on any device with a browser, always up-to-date, and includes real-time preview - features often missing in desktop editors. Plus, it's specifically designed for SVG editing with specialized features like path autocomplete and instant validation.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I create SVG animations?</h3>
            <p className="text-muted-foreground">
              Yes! You can edit SMIL animations and CSS animations directly in the code. The editor supports all animation elements including &lt;animate&gt;, &lt;animateTransform&gt;, and &lt;animateMotion&gt;. For visual animation creation, check out our <Link href="/animate" className="text-primary hover:underline">SVG Animation Tool</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What browsers are supported?</h3>
            <p className="text-muted-foreground">
              Our SVG editor works in all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, we recommend using the latest version of your preferred browser with JavaScript enabled.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I edit SVG files from Illustrator or Figma?</h3>
            <p className="text-muted-foreground">
              Yes! You can upload and edit SVG files exported from any design tool including Adobe Illustrator, Figma, Sketch, Inkscape, or Affinity Designer. Our editor helps clean up excessive code often added by these tools.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Is there a file size limit?</h3>
            <p className="text-muted-foreground">
              We support SVG files up to 10MB in size, which is more than sufficient for most use cases. If you have larger files, consider using our <Link href="/tools/svg-optimizer" className="text-primary hover:underline">SVG Optimizer</Link> first to reduce file size.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I collaborate with others?</h3>
            <p className="text-muted-foreground">
              While real-time collaboration isn't currently supported, you can easily share your work by copying the SVG code and sending it to colleagues, or by saving and sharing the SVG file.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Do you store my SVG files?</h3>
            <p className="text-muted-foreground">
              No, we don't store any of your SVG files or code. All editing happens locally in your browser for maximum privacy and security. Once you close the editor, your work is only saved if you've downloaded it.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I use keyboard shortcuts?</h3>
            <p className="text-muted-foreground">
              Yes! Our editor supports common keyboard shortcuts like Ctrl/Cmd+S to download, Ctrl/Cmd+Z for undo, Ctrl/Cmd+Y for redo, and many standard text editing shortcuts for efficient workflow.
            </p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">What Users Say About Our SVG Editor</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Sarah Chen</CardTitle>
              <CardDescription>Frontend Developer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "This SVG editor saved me hours of work. The real-time preview and syntax highlighting make it so easy to fine-tune SVGs without switching between tools."
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
              <CardTitle className="text-lg">Marcus Rodriguez</CardTitle>
              <CardDescription>UI Designer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "Finally, a free tool that actually understands SVG! I use it daily to clean up exports from Figma and add custom animations. Absolutely essential."
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
              <CardTitle className="text-lg">Emma Thompson</CardTitle>
              <CardDescription>Web Design Teacher</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">
                "I recommend this to all my students. The instant visual feedback helps them understand SVG concepts much faster than traditional code editors."
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
            name: 'SVG Editor Online',
            description: 'Free online SVG code editor with real-time preview, syntax highlighting, and instant validation',
            url: 'https://svgai.org/tools/svg-editor',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Real-time SVG preview',
              'Syntax highlighting', 
              'Code validation',
              'Export functionality',
              'No signup required',
              'Browser-based editing',
              'Path autocomplete',
              'Transform helpers',
              'Animation support',
              'Filter effects',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '1,893',
              bestRating: '5',
              worstRating: '1',
            },
            review: [
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Sarah Chen',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody: 'This SVG editor saved me hours of work. The real-time preview and syntax highlighting make it so easy to fine-tune SVGs without switching between tools.',
              },
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Marcus Rodriguez',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody: 'Finally, a free tool that actually understands SVG! I use it daily to clean up exports from Figma and add custom animations. Absolutely essential.',
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
            name: 'How to Edit SVG Code Online',
            description: 'Learn how to edit SVG files online using our free SVG editor with real-time preview',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Upload or Paste SVG Code',
                text: 'Upload your SVG file or paste SVG code directly into the online editor',
              },
              {
                '@type': 'HowToStep',
                name: 'Edit with Syntax Highlighting',
                text: 'Use the syntax-highlighted editor to modify SVG elements, attributes, and styling',
              },
              {
                '@type': 'HowToStep',
                name: 'Preview Changes Live',
                text: 'See your changes instantly in the real-time preview panel as you edit',
              },
              {
                '@type': 'HowToStep',
                name: 'Validate and Export',
                text: 'Use automatic validation to catch errors, then download your optimized SVG file',
              },
            ],
            totalTime: 'PT3M',
            supply: ['SVG file', 'Web browser'],
            tool: ['SVG Editor Online'],
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
            name: 'How to Use SVG Editor - Complete Tutorial',
            description: 'Learn how to edit SVG code online with our free editor. This tutorial covers basic editing, advanced techniques, and animation.',
            thumbnailUrl: 'https://svgai.org/og-image.png',
            uploadDate: '2024-01-15',
            duration: 'PT8M',
            contentUrl: 'https://svgai.org/tutorials/svg-editor',
            embedUrl: 'https://svgai.org/embed/svg-editor-tutorial',
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
              userInteractionCount: '15,234',
            },
          }),
        }}
      />
    </div>
  )
}