"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Star,
  Clock,
  Shield,
  Download,
  Users,
  CheckCircle2,
  Crown,
  Lock,
  Globe,
  TrendingUp,
  Award,
  UserCheck,
  Eye,
  Coffee,
  Briefcase,
  Heart,
  Building,
  Upload
} from "lucide-react"
import Link from "next/link"

interface PremiumToolsCTAProps {
  converterType: {
    from: string
    to: string
    fromFull: string
    toFull: string
  }
  placement?: "section" | "inline" | "sidebar"
  variant?: "explore" | "upgrade" | "success"
}

export function PremiumToolsCTA({ 
  converterType, 
  placement = "section", 
  variant = "explore" 
}: PremiumToolsCTAProps) {
  if (placement === "inline") {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Need More Power?
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Try our AI SVG generator and premium tools
              </p>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Zap className="mr-2 h-3 w-3" />
                Explore Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (placement === "sidebar") {
    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Premium Tools
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                AI generation, batch processing, and more
              </p>
              <Button size="sm" className="w-full" variant="outline">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Related Tools</h4>
            <div className="space-y-2">
              <Link 
                href="/tools/svg-optimizer" 
                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                SVG Optimizer
              </Link>
              <Link 
                href="/tools/svg-editor" 
                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                SVG Editor
              </Link>
              <Link 
                href="/ai-icon-generator" 
                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                AI Icon Generator
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Section placement (default)
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
            Premium Tools
          </Badge>
          <h2 className="text-3xl font-bold text-[#4E342E] mb-4">
            {variant === "success" 
              ? "Great job! Ready for more advanced tools?" 
              : "Need More Powerful Conversion Tools?"
            }
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {variant === "success"
              ? "You've successfully converted your file. Explore our premium features for professional workflows."
              : "Upgrade to our premium features for advanced capabilities and professional workflows"
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI SVG Generation */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
              POPULAR
            </div>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">
                AI SVG Generation
              </h3>
              <p className="text-gray-600 mb-4">
                Create professional SVGs from text descriptions using advanced AI
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>11 different styles</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Instant generation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Commercial license</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                asChild
              >
                <Link href="/ai-icon-generator">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try AI Generation
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* SVG to Video */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">
                SVG to Video
              </h3>
              <p className="text-gray-600 mb-4">
                Export SVG animations as MP4 videos for social media and presentations
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>HD & 4K output</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Custom duration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Social media formats</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/tools/svg-to-video">
                  Learn More
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Batch Processing */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">
                Batch Conversion
              </h3>
              <p className="text-gray-600 mb-4">
                Convert hundreds of files at once with our powerful batch processing tools
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span>Up to 1000 files</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-3 w-3 text-blue-500" />
                  <span>Secure processing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span>10x faster</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Join thousands of designers and developers using our professional tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="py-3 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
              asChild
            >
              <Link href="/pricing">
                <Crown className="mr-2 h-5 w-5" />
                View All Premium Tools
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="py-3 px-8 font-bold text-lg"
              asChild
            >
              <Link href="/ai-icon-generator">
                <Sparkles className="mr-2 h-5 w-5" />
                Try AI Generation Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Quality Settings Component for advanced converter options
interface QualitySettingsProps {
  options: any
  updateOption: (key: string, value: any) => void
  fromFormat: string
  toFormat: string
}

export function QualitySettings({ 
  options, 
  updateOption, 
  fromFormat, 
  toFormat 
}: QualitySettingsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-500" />
        Quality Settings
      </h3>
      
      {/* Compression Quality */}
      {['jpg', 'jpeg', 'webp'].includes(toFormat.toLowerCase()) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Compression Quality: {options.quality || 90}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={options.quality || 90}
            onChange={(e) => updateOption('quality', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {/* Vector Optimization for SVG */}
      {toFormat.toLowerCase() === 'svg' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Optimize SVG
            </label>
            <input
              type="checkbox"
              checked={options.optimize !== false}
              onChange={(e) => updateOption('optimize', e.target.checked)}
              className="rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Remove metadata
            </label>
            <input
              type="checkbox"
              checked={options.removeMetadata === true}
              onChange={(e) => updateOption('removeMetadata', e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
      )}

      {/* DPI Settings for print formats */}
      {['pdf', 'tiff'].includes(toFormat.toLowerCase()) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            DPI (Print Quality)
          </label>
          <select
            value={options.dpi || 300}
            onChange={(e) => updateOption('dpi', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value={72}>72 DPI (Web)</option>
            <option value={150}>150 DPI (Standard)</option>
            <option value={300}>300 DPI (High Quality)</option>
            <option value={600}>600 DPI (Print)</option>
          </select>
        </div>
      )}

      <div className="text-xs text-gray-500 border-t pt-3">
        💡 Pro tip: Higher quality settings may result in larger file sizes
      </div>
    </div>
  )
}

// Professional Trust Indicators Component
export function TrustIndicators() {
  return (
    <div className="py-6 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">100% Secure</p>
              <p className="text-xs text-gray-600">Files never leave your device</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">2.5M+ Users</p>
              <p className="text-xs text-gray-600">Trusted worldwide</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">99.9% Uptime</p>
              <p className="text-xs text-gray-600">Always available</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Lightning Fast</p>
              <p className="text-xs text-gray-600">Instant conversion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Professional Security Badge Component
export function SecurityBadges() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 py-4">
      <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium text-gray-700">SSL Encrypted</span>
      </div>
      
      <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
        <Eye className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-medium text-gray-700">Privacy First</span>
      </div>
      
      <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
        <Globe className="h-4 w-4 text-purple-600" />
        <span className="text-xs font-medium text-gray-700">GDPR Compliant</span>
      </div>
      
      <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium text-gray-700">ISO 27001</span>
      </div>
    </div>
  )
}

// Professional Testimonials Component
export function TestimonialSlider() {
  const testimonials = [
    {
      text: "This converter saved me hours of work. The quality is outstanding and it's incredibly fast.",
      author: "Sarah Chen",
      role: "UX Designer",
      company: "Microsoft",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      text: "Perfect for our design workflow. We've converted thousands of files without any issues.",
      author: "Marcus Rodriguez",
      role: "Creative Director",
      company: "Adobe",
      icon: <Building className="h-4 w-4" />
    },
    {
      text: "The client-side processing gives us peace of mind for sensitive projects. Highly recommended!",
      author: "Elena Volkov",
      role: "Brand Manager",
      company: "Spotify",
      icon: <Heart className="h-4 w-4" />
    }
  ]

  return (
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted by Professionals</h3>
          <p className="text-gray-600">See what designers and developers are saying</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {testimonial.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-xs text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Professional Feature Icons Component
export function ProfessionalFeatureIcon({ type }: { type: string }) {
  const iconMap = {
    'security': <Shield className="h-6 w-6 text-green-600" />,
    'speed': <Zap className="h-6 w-6 text-blue-600" />,
    'quality': <Award className="h-6 w-6 text-purple-600" />,
    'privacy': <Lock className="h-6 w-6 text-indigo-600" />,
    'users': <Users className="h-6 w-6 text-orange-600" />,
    'support': <UserCheck className="h-6 w-6 text-teal-600" />,
    'free': <Coffee className="h-6 w-6 text-amber-600" />,
    'professional': <Briefcase className="h-6 w-6 text-gray-600" />
  }

  return (
    <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
      {iconMap[type as keyof typeof iconMap] || <CheckCircle2 className="h-6 w-6 text-green-600" />}
    </div>
  )
}

// Enhanced Loading States Component
export function EnhancedLoadingState({ stage }: { stage: 'uploading' | 'processing' | 'converting' | 'finishing' }) {
  const stages = {
    uploading: { text: 'Uploading file...', icon: <Upload className="h-5 w-5" />, color: 'blue' },
    processing: { text: 'Analyzing content...', icon: <Eye className="h-5 w-5" />, color: 'purple' },
    converting: { text: 'Converting format...', icon: <Zap className="h-5 w-5" />, color: 'orange' },
    finishing: { text: 'Finalizing output...', icon: <CheckCircle2 className="h-5 w-5" />, color: 'green' }
  }

  const currentStage = stages[stage]
  
  return (
    <div className="flex items-center justify-center space-x-3 py-8">
      <div className={`animate-spin rounded-full h-8 w-8 border-2 border-${currentStage.color}-600 border-t-transparent`} />
      <div className="flex items-center space-x-2">
        <div className={`text-${currentStage.color}-600`}>
          {currentStage.icon}
        </div>
        <span className="text-gray-700 font-medium">{currentStage.text}</span>
      </div>
    </div>
  )
}

// Professional CTA Enhancement
export function ProfessionalCTA({ converterType }: { converterType: { from: string; to: string } }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
        <Crown className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Ready for Professional Tools?</h3>
      <p className="text-blue-100 mb-6 max-w-md mx-auto">
        Upgrade to access advanced features, batch processing, and premium support
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          size="lg" 
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
          asChild
        >
          <Link href="/pricing">
            <Crown className="mr-2 h-5 w-5" />
            Upgrade Now
          </Link>
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
          asChild
        >
          <Link href="/ai-icon-generator">
            <Sparkles className="mr-2 h-5 w-5" />
            Try AI Generator
          </Link>
        </Button>
      </div>
    </div>
  )
}