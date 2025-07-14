'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Download, Copy, RefreshCw, Upload, FileCode, Sparkles, X, AlertCircle, Zap } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalytics } from '@/hooks/use-analytics'

const DEFAULT_SVG = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Simple star shape - try editing the colors! -->
  <path d="M100 40 L115 80 L155 80 L125 105 L140 145 L100 120 L60 145 L75 105 L45 80 L85 80 Z" 
        fill="#FF7043" 
        stroke="#4E342E" 
        stroke-width="2"/>
</svg>`

// AI-generated example SVGs for suggestions
const AI_EXAMPLES = [
  {
    title: "Modern Logo",
    prompt: "minimalist tech startup logo",
    svg: `<svg viewBox="0 0 100 100"><path d="M50 20 L80 50 L50 80 L20 50 Z" fill="#3b82f6"/></svg>`
  },
  {
    title: "Geometric Pattern",
    prompt: "abstract geometric pattern",
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#10b981"/><rect x="35" y="35" width="30" height="30" fill="#f59e0b" opacity="0.7"/></svg>`
  },
  {
    title: "Icon Design",
    prompt: "modern user interface icon",
    svg: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#3b82f6"/></svg>`
  }
]

// CTA message variants for A/B testing
const CTA_VARIANTS = [
  "Need help? Let AI generate perfect SVGs for you",
  "Skip the complexity - Generate SVGs with AI",
  "Want professional SVGs? Try our AI generator",
  "Create stunning SVGs instantly with AI"
]

export default function SVGEditorComponentEnhanced() {
  const [svgCode, setSvgCode] = useState(DEFAULT_SVG)
  const [error, setError] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [ctaVariant] = useState(() => Math.floor(Math.random() * CTA_VARIANTS.length))
  const [dismissedCTAs, setDismissedCTAs] = useState<string[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sessionStartRef = useRef(Date.now())
  
  const analytics = useAnalytics('svg-editor')

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartRef.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Track session start
  useEffect(() => {
    const sessionStart = sessionStartRef.current
    analytics.startSession()
    const loadTime = performance.now()
    analytics.trackPerformance('load_time', loadTime)
    
    return () => {
      const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000)
      analytics.endSession(sessionDuration)
    }
  }, [analytics])

  // Show floating CTA after 30 seconds
  useEffect(() => {
    if (sessionTime >= 30 && !dismissedCTAs.includes('floating')) {
      setShowFloatingCTA(true)
      analytics.trackEngagement('cta_shown')
      analytics.trackEvent('cta_shown', { type: 'floating', variant: ctaVariant })
    }
  }, [sessionTime, dismissedCTAs, ctaVariant, analytics])

  // Show AI suggestions after 45 seconds
  useEffect(() => {
    if (sessionTime >= 45 && !dismissedCTAs.includes('suggestions')) {
      setShowAISuggestions(true)
      analytics.trackEngagement('cta_shown')
      analytics.trackEvent('cta_shown', { type: 'suggestions' })
    }
  }, [sessionTime, dismissedCTAs, analytics])

  // Validate SVG and detect complexity
  useEffect(() => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgCode, 'image/svg+xml')
      const errorNode = doc.querySelector('parsererror')
      
      if (errorNode) {
        setError('Invalid SVG: ' + errorNode.textContent)
        setErrorCount(prev => prev + 1)
        
        // Show CTA after 5+ errors
        if (errorCount >= 5 && !dismissedCTAs.includes('error')) {
          toast(
            <div className="flex items-center justify-between">
              <span>Having trouble? Let AI help you create perfect SVGs</span>
              <Link href="/ai-icon-generator">
                <Button size="sm" className="ml-2">
                  Try AI <Sparkles className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>,
            { duration: 10000 }
          )
          analytics.trackEvent('cta_shown', { type: 'error_prompt' })
          analytics.trackError('parse_error', errorNode.textContent || 'Unknown error')
        }
      } else {
        setError(null)
        
        // Detect complex SVGs
        const paths = doc.querySelectorAll('path')
        const gradients = doc.querySelectorAll('linearGradient, radialGradient')
        const animations = doc.querySelectorAll('animate, animateTransform')
        
        if (paths.length > 10 || gradients.length > 0 || animations.length > 0) {
          if (!dismissedCTAs.includes('complexity')) {
            toast(
              <div className="flex items-center justify-between">
                <span>Complex SVG detected! AI can handle this easily</span>
                <Link href="/ai-icon-generator">
                  <Button size="sm" variant="outline" className="ml-2">
                    <Zap className="w-3 h-3 mr-1" /> Simplify with AI
                  </Button>
                </Link>
              </div>,
              { duration: 8000 }
            )
            analytics.trackEvent('cta_shown', { type: 'complexity_detected' })
            analytics.trackFeature('complex_svg_detected', { paths: paths.length, gradients: gradients.length, animations: animations.length })
          }
        }
      }
    } catch (e) {
      setError('Error parsing SVG')
    }
  }, [svgCode, errorCount, dismissedCTAs, analytics])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'image/svg+xml') {
      toast.error('Please upload an SVG file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSvgCode(content)
      toast.success('SVG file loaded')
      analytics.trackEvent('file_uploaded', { size: file.size })
      analytics.trackFeature('file_upload', { fileSize: file.size, fileType: file.type })
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'edited-svg.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('SVG downloaded')
    analytics.trackEvent('svg_downloaded')
    analytics.trackFeature('download', { size: svgCode.length })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgCode)
      toast.success('Copied to clipboard')
      analytics.trackEvent('svg_copied')
      analytics.trackFeature('copy_to_clipboard', { size: svgCode.length })
    } catch (e) {
      toast.error('Failed to copy')
    }
  }

  const handleReset = () => {
    setSvgCode(DEFAULT_SVG)
    setErrorCount(0)
    toast.success('Reset to default')
    analytics.trackEvent('editor_reset')
    analytics.trackFeature('reset_to_default')
  }

  const dismissCTA = (type: string) => {
    setDismissedCTAs([...dismissedCTAs, type])
    if (type === 'floating') setShowFloatingCTA(false)
    if (type === 'suggestions') setShowAISuggestions(false)
    analytics.trackEngagement('cta_dismissed')
    analytics.trackEvent('cta_dismissed', { type })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current?.selectionStart || 0
      const end = textareaRef.current?.selectionEnd || 0
      const newCode = svgCode.substring(0, start) + '  ' + svgCode.substring(end)
      setSvgCode(newCode)
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                SVG Code Editor
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono text-sm min-h-[500px] resize-none"
                placeholder="Paste your SVG code here..."
                spellCheck={false}
              />
              {error && (
                <div className="absolute bottom-2 left-2 right-2 bg-destructive/10 text-destructive text-xs p-2 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
              {error ? (
                <div className="text-muted-foreground text-center">
                  <p className="text-lg mb-2">Invalid SVG</p>
                  <p className="text-sm">Fix the errors to see preview</p>
                </div>
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                />
              )}
            </div>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Quick Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use Tab key for indentation</li>
                <li>• Ctrl/Cmd + A to select all</li>
                <li>• Changes appear instantly</li>
                <li>• Upload SVG files with the Upload button</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating CTA */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="shadow-xl border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <button
                  onClick={() => dismissCTA('floating')}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="pr-6">
                  <p className="font-semibold mb-2">{CTA_VARIANTS[ctaVariant]}</p>
                  <Link href="/ai-icon-generator">
                    <Button 
                      className="gap-2" 
                      onClick={() => {
                        analytics.trackEngagement('cta_clicked')
                        analytics.trackUpgrade('ai-icon-generator', 'floating-cta')
                        analytics.trackEvent('cta_clicked', { type: 'floating', variant: ctaVariant })
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestions Sidebar */}
      <AnimatePresence>
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-0 z-40 w-80"
          >
            <Card className="shadow-xl border-primary/20 mr-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI-Powered Suggestions
                  </span>
                  <button
                    onClick={() => dismissCTA('suggestions')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Skip the manual work! Check out these AI-generated examples:
                </p>
                {AI_EXAMPLES.map((example, index) => (
                  <Link
                    key={index}
                    href={`/ai-icon-generator?prompt=${encodeURIComponent(example.prompt)}`}
                    onClick={() => {
                      analytics.trackEngagement('cta_clicked')
                      analytics.trackUpgrade('ai-icon-generator', 'suggestion-card')
                      analytics.trackEvent('cta_clicked', { type: 'suggestion', example: example.title })
                    }}
                  >
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 bg-muted rounded flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: example.svg }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{example.title}</p>
                            <p className="text-xs text-muted-foreground">"{example.prompt}"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                <Link href="/ai-icon-generator">
                  <Button variant="outline" className="w-full mt-2">
                    Create Your Own →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}