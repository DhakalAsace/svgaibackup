import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Crown, FileDown, Film, Sparkles, Zap, ArrowRight, Check } from 'lucide-react'
import { getCardStyles, getButtonStyles, getSectionStyles } from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'Free SVG Tools - Editor, Optimizer, Converter | SVG AI',
  description: 'Professional SVG tools for designers and developers. Free SVG editor, optimizer, and premium video converter. No signup required for free tools.',
  keywords: 'svg tools, svg editor, svg optimizer, svg converter, free svg tools, online svg tools',
  openGraph: {
    title: 'Free SVG Tools Collection',
    description: 'Professional SVG editor, optimizer, and converter tools. Free to use, no signup required.',
    type: 'website',
    url: 'https://svgai.org/tools',
  },
  alternates: {
    canonical: 'https://svgai.org/tools',
  },
}

const tools = [
  {
    title: 'SVG Editor',
    description: 'Edit SVG code with real-time preview and syntax highlighting',
    icon: Code,
    href: '/tools/svg-editor',
    badge: 'Free',
    features: ['Syntax highlighting', 'Live preview', 'Code validation'],
  },
  {
    title: 'SVG Optimizer',
    description: 'Reduce file size by up to 80% without quality loss',
    icon: FileDown,
    href: '/tools/svg-optimizer',
    badge: 'Free',
    features: ['Size reduction', 'Path optimization', 'Safe processing'],
  },
  {
    title: 'SVG to Video',
    description: 'Convert animated SVGs to MP4 or GIF format',
    icon: Film,
    href: '/tools/svg-to-video',
    badge: 'Premium',
    isPremium: true,
    features: ['MP4 export', 'GIF export', 'Custom quality'],
  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className={`${getSectionStyles('gradient')} py-16`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <Badge className="mb-4 border-green-500 text-green-600 inline-flex" variant="outline">
              <Zap className="w-3 h-3 mr-1" />
              Free & Premium Tools
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-[#4E342E] mb-6 leading-tight">
              SVG Tools Collection
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Professional tools for working with SVG files. Edit, optimize, and convert 
              your vector graphics with our powerful free and premium tools.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className={`${getButtonStyles('primary', 'lg')} transform hover:scale-105`}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try AI SVG Generator
                </Button>
              </Link>
              <Link href="/ai-icon-generator">
                <Button className={`${getButtonStyles('secondary', 'lg')}`}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try AI Icon Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className={`${getSectionStyles('white')} py-16`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4E342E] mb-4">
              Professional SVG Tools Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, edit, and optimize SVG files
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="block group">
                <Card className={`${getCardStyles('hover')} h-full ${tool.isPremium ? 'border-[#FF7043]/20 bg-gradient-to-br from-[#FFF8F6] to-white' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FF7043]/10 to-[#FFA726]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <tool.icon className="w-6 h-6 text-[#FF7043]" />
                      </div>
                      <Badge 
                        variant={tool.isPremium ? 'default' : 'outline'} 
                        className={tool.isPremium ? 'bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white border-0' : 'border-green-500 text-green-600'}
                      >
                        {tool.isPremium && <Crown className="w-3 h-3 mr-1" />}
                        {tool.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-[#4E342E] group-hover:text-[#FF7043] transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tool.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium group-hover:text-[#FF7043] transition-colors">
                        {tool.isPremium ? 'Try Premium Tool' : 'Use Free Tool'}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* More Tools Coming Soon */}
      <section className={`${getSectionStyles('muted')} py-16`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <div className="text-3xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-[#4E342E] mb-4">More Tools Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're constantly adding new tools based on user feedback. Have a suggestion for an SVG tool you'd like to see?
            </p>
            <Link href="mailto:hello@svgai.org?subject=Tool%20Suggestion">
              <Button className={getButtonStyles('outline', 'md')}>
                Suggest a Tool
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`${getSectionStyles('white')} py-16`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#4E342E] mb-6">Why Choose Our Tools?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#FF7043]/10 to-[#FFA726]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-[#FF7043]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#4E342E] mb-1">No Installation Required</h3>
                    <p className="text-sm text-gray-600">
                      All tools work directly in your browser on any device
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#FF7043]/10 to-[#FFA726]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-[#FF7043]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#4E342E] mb-1">Privacy First</h3>
                    <p className="text-sm text-gray-600">
                      Files are processed locally when possible, never stored
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#FF7043]/10 to-[#FFA726]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-[#FF7043]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#4E342E] mb-1">Professional Quality</h3>
                    <p className="text-sm text-gray-600">
                      Industry-standard algorithms for best results
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#FF7043]/10 to-[#FFA726]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-[#FF7043]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#4E342E] mb-1">Unlimited Usage</h3>
                    <p className="text-sm text-gray-600">
                      Free tools have no limits on conversions or file sizes
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-[#4E342E] mb-4">Popular Converters</h3>
              <div className="space-y-3 mb-6">
                <Link href="/convert/png-to-svg" className="block">
                  <Card className="hover:border-[#FF7043]/50 transition-all hover:shadow-sm cursor-pointer">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        PNG to SVG Converter
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/convert/svg-to-png" className="block">
                  <Card className="hover:border-[#FF7043]/50 transition-all hover:shadow-sm cursor-pointer">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        SVG to PNG Converter
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/convert/jpg-to-svg" className="block">
                  <Card className="hover:border-[#FF7043]/50 transition-all hover:shadow-sm cursor-pointer">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        JPG to SVG Converter
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
              <Link href="/convert">
                <Button variant="link" className="p-0 text-[#FF7043] hover:text-[#FF7043]/80">
                  View all 40 converters →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}