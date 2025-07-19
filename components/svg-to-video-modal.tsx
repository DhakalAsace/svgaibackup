'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Upload, Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCredits } from '@/contexts/CreditContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const CREDIT_COST = 6

interface SVGToVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SVGToVideoModal({ open, onOpenChange }: SVGToVideoModalProps) {
  const [step, setStep] = useState(1)
  const [svgFile, setSvgFile] = useState<File | null>(null)
  const [svgPreview, setSvgPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { creditInfo, refreshCredits } = useCredits()
  const router = useRouter()
  
  const credits = creditInfo?.creditsRemaining || 0

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'image/svg+xml') {
      toast.error('Please upload an SVG file')
      return
    }

    setSvgFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setSvgPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    setStep(2)
  }

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please sign in to generate videos')
      onOpenChange(false)
      router.push('/login')
      return
    }

    if (!svgFile || !prompt.trim()) {
      toast.error('Please complete all steps')
      return
    }

    if (credits < CREDIT_COST) {
      toast.error(`You need ${CREDIT_COST} credits. You have ${credits}.`)
      onOpenChange(false)
      router.push('/pricing')
      return
    }

    setIsGenerating(true)
    setStep(3) // Move to processing step

    try {
      const formData = new FormData()
      formData.append('file', svgFile)
      formData.append('prompt', prompt.trim())

      const response = await fetch('/api/convert/svg-to-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Video generation failed')
      }

      // Don't download the video, just consume the response
      await response.blob()
      
      // Refresh credits
      await refreshCredits()
      
      // Show success state
      setIsProcessing(true)
      setIsGenerating(false)
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Video generation failed')
      setIsGenerating(false)
      setStep(2) // Go back to previous step on error
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleClose = () => {
    if (!isGenerating || isProcessing) {
      setSvgFile(null)
      setSvgPreview(null)
      setPrompt('')
      setStep(1)
      setIsProcessing(false)
      setIsGenerating(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onOpenChange(false)
    }
  }

  const goToDashboard = () => {
    handleClose()
    router.push('/dashboard')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Convert SVG to MP4 Video</DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="mb-4">
          <Progress value={step * 33.33} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={step >= 1 ? 'text-primary' : ''}>Upload SVG</span>
            <span className={step >= 2 ? 'text-primary' : ''}>Describe Animation</span>
            <span className={step >= 3 ? 'text-primary' : ''}>Processing</span>
          </div>
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto min-h-0 px-1">

        {/* Step 1: Upload SVG */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium text-lg mb-2">
                Click to upload SVG
              </p>
              <p className="text-sm text-muted-foreground">
                Static SVGs work best for AI animation
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Output: 5-second HD MP4 video • 1080p resolution
            </div>
          </div>
        )}

        {/* Step 2: Describe Animation */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <span className="font-medium">Selected:</span> {svgFile?.name}
              </div>
              
              {/* SVG Preview */}
              {svgPreview && (
                <div className="border rounded-lg p-4 bg-white">
                  <img 
                    src={svgPreview} 
                    alt="SVG Preview" 
                    className="w-full h-32 object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Describe how you want it to animate:
              </label>
              <Textarea
                placeholder="Example: Logo spins 360 degrees with a glowing effect and particles..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Be specific about motion, effects, and timing
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Credits Required</p>
                <p className="text-xs text-muted-foreground">
                  You have {credits} credits
                </p>
              </div>
              <div className="text-xl font-bold">{CREDIT_COST}</div>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <div className="space-y-4 text-center py-8">
            {isGenerating ? (
              <>
                <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                <h3 className="text-lg font-semibold">Generating Your Video</h3>
                <p className="text-muted-foreground">
                  This typically takes 1-2 minutes. Your video will be available in your dashboard when ready.
                </p>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm mb-2">
                    You can close this window and check your dashboard later, or wait here for the video to complete.
                  </p>
                </div>
              </>
            ) : isProcessing ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Video Generation Started!</h3>
                <p className="text-muted-foreground">
                  Your video is being processed and will appear in your dashboard within 1-2 minutes.
                </p>
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={goToDashboard}
                    className="w-full"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleClose}
                    className="w-full"
                  >
                    Generate Another Video
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}
        </div>

        {/* Actions - Fixed at bottom */}
        {step < 3 && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isGenerating}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          {step === 1 && (
            <Button
              className="ml-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose SVG
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {step === 2 && (
            <>
              <div className="flex-1" />
              {user ? (
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating || credits < CREDIT_COST}
                  className="ml-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate MP4 Video
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    router.push('/login')
                  }}
                  className="ml-auto"
                >
                  Sign In to Generate
                </Button>
              )}
            </>
          )}
        </div>
        )}
      </DialogContent>
    </Dialog>
  )
}