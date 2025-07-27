"use client"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { ArrowRight, Sparkles } from "lucide-react"

// Lazy load heavy components
const GenerationSignupModal = dynamic(
  () => import('@/components/auth/generation-signup-modal').then(mod => ({ default: mod.GenerationSignupModal })),
  { ssr: false, loading: () => null }
)

const UpgradeModal = dynamic(
  () => import('@/components/generation-upsells').then(mod => ({ default: mod.UpgradeModal })),
  { ssr: false, loading: () => null }
)

const AdvancedOptions = dynamic(
  () => import('./hero-advanced-options'),
  { ssr: false, loading: () => null }
)

const SamplePromptsSection = dynamic(
  () => import('./hero-sample-prompts'),
  { ssr: false, loading: () => null }
)

export default function HeroMinimal() {
  const [prompt, setPrompt] = useState("")
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const router = useRouter()

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // Check auth status (simplified)
    const hasAuth = document.cookie.includes('sb-auth-token')
    
    if (!hasAuth) {
      setShowSignupModal(true)
      setIsGenerating(false)
      return
    }
    
    // Navigate to generator with prompt
    router.push(`/ai-icon-generator?prompt=${encodeURIComponent(prompt)}`)
  }, [prompt, router])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }, [handleGenerate])

  return (
    <section className="hero-gradient py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight">
          AI SVG Generator: Effortless Text to SVG Conversion
        </h1>
        
        <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Transform your ideas into stunning SVG graphics instantly with our AI-powered generator.
        </p>

        {/* Generation Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Textarea
              placeholder="Describe your ideal SVG image... (e.g., 'A minimalist mountain logo with sunset colors')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] text-lg mb-4"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
              
              <span className="text-sm text-gray-500">
                {prompt.length}/500
              </span>
            </div>

            {showAdvanced && <AdvancedOptions />}

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-6 text-lg font-medium"
            >
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate SVG
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sample Prompts */}
        <SamplePromptsSection onSelectPrompt={setPrompt} />

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">50K+</div>
            <div className="text-sm text-gray-600">SVGs Generated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">10K+</div>
            <div className="text-sm text-gray-600">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">4.9/5</div>
            <div className="text-sm text-gray-600">User Rating</div>
          </div>
        </div>

        {/* CTA for converters */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Already have images? Try our free converters:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/convert/png-to-svg" className="text-blue-600 hover:underline">
              PNG to SVG
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/convert/jpg-to-svg" className="text-blue-600 hover:underline">
              JPG to SVG
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/convert" className="text-blue-600 hover:underline flex items-center">
              View All Converters <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSignupModal && (
        <GenerationSignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          generationsUsed={0}
          preservePrompt={true}
        />
      )}
      
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </section>
  )
}