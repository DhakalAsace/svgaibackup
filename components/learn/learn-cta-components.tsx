'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Sparkles, Clock, Zap, Palette, Code, FileImage, Video } from 'lucide-react'

interface CTAProps {
  variant?: 'primary' | 'secondary' | 'subtle'
  className?: string
}

// Top CTA - After introduction
export function TopLearnCTA({ variant = 'primary', className = '' }: CTAProps) {
  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 my-8 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Skip the Learning Curve</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Generate professional SVGs instantly with our AI-powered tool. No design skills required.
        </p>
        <Link href="/">
          <Button className="gap-2">
            Create SVG with AI <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Mid-article value proposition
export function ValuePropCTA({ 
  title = "Save Hours of Design Time",
  description = "Why spend hours learning complex design tools? Our AI generates perfect SVGs in seconds.",
  buttonText = "Try AI SVG Generator",
  href = "/",
  className = ''
}: CTAProps & { title?: string; description?: string; buttonText?: string; href?: string }) {
  return (
    <div className={`bg-muted/50 rounded-lg p-6 my-8 border ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Link href={href}>
            <Button variant="outline" size="sm" className="gap-2">
              {buttonText} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// End of article action CTA
export function EndActionCTA({ className = '' }: CTAProps) {
  return (
    <Card className={`bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 my-12 ${className}`}>
      <CardContent className="p-8 text-center">
        <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Ready to Create Amazing SVGs?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Now that you understand SVG, put your knowledge into action. Generate professional SVGs instantly with our AI-powered tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Create SVG with AI
            </Button>
          </Link>
          <Link href="/tools">
            <Button size="lg" variant="outline" className="gap-2">
              Browse Free Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Tool recommendation sidebar
export function ToolRecommendations({ 
  tools,
  title = "Try These Tools",
  className = ''
}: { 
  tools: Array<{ name: string; href: string; icon: React.ReactNode; description: string }>
  title?: string
  className?: string 
}) {
  return (
    <Card className={`my-8 ${className}`}>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          {title}
        </h3>
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <Link key={index} href={tool.href} className="block group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Inline tool mention
export function InlineToolLink({ 
  href, 
  children,
  icon
}: { 
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <Link 
      href={href} 
      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
    >
      {icon}
      {children}
      <ArrowRight className="h-3 w-3" />
    </Link>
  )
}

// Try it yourself section
export function TryItYourselfSection({ 
  title = "Try It Yourself",
  examples,
  className = ''
}: {
  title?: string
  examples: Array<{ prompt: string; description: string }>
  className?: string
}) {
  return (
    <div className={`bg-primary/5 rounded-lg p-6 my-8 ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Code className="h-5 w-5 text-primary" />
        {title}
      </h3>
      <p className="text-muted-foreground mb-4">
        Put your knowledge into practice with these AI prompts:
      </p>
      <div className="space-y-3">
        {examples.map((example, index) => (
          <div key={index} className="bg-background/80 rounded-lg p-4">
            <p className="font-mono text-sm mb-2">"{example.prompt}"</p>
            <p className="text-sm text-muted-foreground">{example.description}</p>
          </div>
        ))}
      </div>
      <Link href="/">
        <Button className="mt-4 gap-2" variant="secondary">
          Try These Prompts <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}

// Related guides section
export function RelatedGuides({ 
  guides,
  className = ''
}: {
  guides: Array<{ title: string; href: string; description: string }>
  className?: string
}) {
  return (
    <div className={`border-t pt-8 mt-12 ${className}`}>
      <h3 className="text-xl font-semibold mb-6">Related Learning Guides</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <Link key={index} href={guide.href}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 line-clamp-2">{guide.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Converter recommendation based on content
export function ConverterRecommendation({ 
  converters,
  title = "Recommended Converters",
  className = ''
}: {
  converters: Array<{ name: string; href: string; from: string; to: string }>
  title?: string
  className?: string
}) {
  return (
    <Card className={`my-8 bg-muted/30 ${className}`}>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileImage className="h-5 w-5 text-primary" />
          {title}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {converters.map((converter, index) => (
            <Link key={index} href={converter.href}>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium">{converter.from}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{converter.to}</span>
                </div>
                <span className="text-xs text-primary">Try Now</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Quick action floating CTA
export function FloatingCTA({ className = '' }: CTAProps) {
  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <Link href="/">
        <Button size="lg" className="shadow-lg gap-2 group">
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          Generate SVG
        </Button>
      </Link>
    </div>
  )
}

// Video/Animation specific CTA
export function AnimationCTA({ className = '' }: CTAProps) {
  return (
    <Card className={`border-primary/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5 my-8 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Video className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Create Animated SVGs</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Turn your SVGs into stunning animations or export them as videos with our premium tools.
        </p>
        <div className="flex gap-3">
          <Link href="/animate">
            <Button variant="outline" size="sm">
              Try Animation Tool
            </Button>
          </Link>
          <Link href="/tools/svg-to-video">
            <Button size="sm" className="gap-2">
              Export as Video <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}