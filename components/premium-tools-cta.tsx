"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Video, Wand2, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { trackPremiumCTA, trackPremiumConversionFunnel } from "@/lib/conversion-tracking"
import { useEffect } from "react"

interface PremiumToolsCTAProps {
  converterType?: {
    from: string
    to: string
    fromFull: string
    toFull: string
  }
  placement?: 'inline' | 'section' | 'sidebar'
  variant?: 'upgrade' | 'explore' | 'video-cta'
}

export default function PremiumToolsCTA({ 
  converterType, 
  placement = 'section',
  variant = 'explore' 
}: PremiumToolsCTAProps) {
  
  // Show video CTA specifically for SVG outputs
  const showVideoCTA = converterType?.to.toLowerCase() === 'svg' || variant === 'video-cta'
  
  // Track CTA view on component mount
  useEffect(() => {
    if (converterType) {
      trackPremiumCTA({
        converterType: `${converterType.from.toLowerCase()}-to-${converterType.to.toLowerCase()}`,
        ctaPlacement: placement,
        ctaVariant: variant,
        targetTool: 'ai-generator', // Default for view tracking
        action: 'view'
      })
      
      trackPremiumConversionFunnel(
        'cta_viewed',
        `${converterType.from.toLowerCase()}-to-${converterType.to.toLowerCase()}`,
        'ai-generator'
      )
    }
  }, [converterType, placement, variant])
  
  // Handle CTA clicks with tracking
  const handleCTAClick = (targetTool: 'ai-generator' | 'icon-generator' | 'svg-to-video' | 'animation-tool') => {
    if (converterType) {
      trackPremiumCTA({
        converterType: `${converterType.from.toLowerCase()}-to-${converterType.to.toLowerCase()}`,
        ctaPlacement: placement,
        ctaVariant: variant,
        targetTool,
        action: 'click'
      })
      
      trackPremiumConversionFunnel(
        'cta_clicked',
        `${converterType.from.toLowerCase()}-to-${converterType.to.toLowerCase()}`,
        targetTool
      )
    }
  }
  
  if (placement === 'inline') {
    return (
      <div className="bg-gradient-to-r from-[#FFF8F6] to-[#FFF0E6] border-l-4 border-[#FF7043] p-6 rounded-lg my-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-[#FF7043] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-[#4E342E] mb-2">Need Custom SVGs?</h3>
            <p className="text-gray-600 mb-3">
              Skip manual conversion - generate exactly what you need with AI in seconds.
            </p>
            <Link href="/" onClick={() => handleCTAClick('ai-generator')}>
              <Button className="bg-[#FF7043] hover:bg-[#E64A19] text-white">
                <Wand2 className="w-4 h-4 mr-2" />
                Try AI Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (placement === 'sidebar') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#FF7043]" />
          </div>
          <h3 className="font-semibold text-[#4E342E] mb-2">Try Our Premium Tools</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create custom SVGs with AI or export to video format
          </p>
          <div className="space-y-2">
            <Link href="/" className="block" onClick={() => handleCTAClick('ai-generator')}>
              <Button size="sm" className="w-full bg-[#FF7043] hover:bg-[#E64A19] text-white">
                AI Generator
              </Button>
            </Link>
            <Link href="/ai-icon-generator" className="block" onClick={() => handleCTAClick('icon-generator')}>
              <Button size="sm" variant="outline" className="w-full">
                Icon Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Full section layout
  return (
    <section className="py-16 bg-gradient-to-br from-[#FFF8F6] via-white to-[#FFF0E6]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF7043] rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#4E342E] mb-4">
            {variant === 'upgrade' ? 'Upgrade to AI Generation' : 'Explore Our Premium Tools'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {variant === 'upgrade' 
              ? 'Stop converting existing files. Create exactly what you need with AI in seconds.'
              : 'Take your SVG workflow to the next level with our AI-powered tools'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI SVG Generator */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 className="w-8 h-8 text-[#FF7043]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4E342E] mb-3">AI SVG Generator</h3>
              <p className="text-gray-600 mb-6">
                Generate custom SVGs from text descriptions. Perfect for logos, illustrations, and graphics.
              </p>
              
              <div className="flex items-center justify-center mb-4 text-sm text-[#FF7043]">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="font-medium">Most Popular</span>
              </div>
              
              <Link href="/" onClick={() => handleCTAClick('ai-generator')}>
                <Button className="w-full bg-[#FF7043] hover:bg-[#E64A19] text-white font-semibold py-3">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Icon Generator */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#4E342E] mb-3">AI Icon Generator</h3>
              <p className="text-gray-600 mb-6">
                Create professional icons for apps, websites, and UI design projects instantly.
              </p>
              
              <div className="flex items-center justify-center mb-4 text-sm text-blue-600">
                <span className="bg-blue-100 px-2 py-1 rounded-full text-xs font-medium">Free Forever</span>
              </div>
              
              <Link href="/ai-icon-generator" onClick={() => handleCTAClick('icon-generator')}>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3">
                  Generate Icons
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* SVG to Video */}
          {showVideoCTA && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F3E5F5] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">SVG to Video</h3>
                <p className="text-gray-600 mb-6">
                  Convert your SVG animations to MP4/GIF format for social media and presentations.
                </p>
                
                <div className="flex items-center justify-center mb-4 text-sm text-purple-600">
                  <span className="bg-purple-100 px-2 py-1 rounded-full text-xs font-medium">Premium Feature</span>
                </div>
                
                <Link href="/convert/svg-to-mp4" onClick={() => handleCTAClick('svg-to-video')}>
                  <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3">
                    Export Video
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Animation Tool for non-SVG outputs */}
          {!showVideoCTA && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E8F5E8] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6 4h6m2-10a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">SVG Animation Tool</h3>
                <p className="text-gray-600 mb-6">
                  Add smooth animations to your SVGs. Perfect for web animations and micro-interactions.
                </p>
                
                <div className="flex items-center justify-center mb-4 text-sm text-green-600">
                  <span className="bg-green-100 px-2 py-1 rounded-full text-xs font-medium">Free Tool</span>
                </div>
                
                <Link href="/animate" onClick={() => handleCTAClick('animation-tool')}>
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3">
                    Animate SVGs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Trusted by 50,000+ designers and developers worldwide
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
            <span>✓ No signup required</span>
            <span>✓ Commercial license included</span>
            <span>✓ Instant results</span>
          </div>
        </div>
      </div>
    </section>
  )
}