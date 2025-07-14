'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Film, Crown, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCredits } from '@/contexts/CreditContext'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface ConversionSettings {
  format: 'mp4' | 'gif'
  quality: 'standard' | 'hd' | '4k'
  fps: '24' | '30' | '60'
  duration: number
}

const CREDIT_COSTS = {
  standard: 2,
  hd: 3,
  '4k': 5,
}

const QUALITY_DIMENSIONS = {
  standard: { width: 640, height: 480 },
  hd: { width: 1280, height: 720 },
  '4k': { width: 3840, height: 2160 },
}

export default function SVGToVideoComponent() {
  const [svgFile, setSvgFile] = useState<File | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'mp4',
    quality: 'hd',
    fps: '30',
    duration: 5,
  })
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

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSvgContent(content)
      setSvgFile(file)
      toast.success('SVG file loaded')
      
      // Try to detect animation duration
      detectAnimationDuration(content)
    }
    reader.readAsText(file)
  }

  const detectAnimationDuration = (svg: string) => {
    // Simple detection of animation duration from SMIL or CSS
    const durMatch = svg.match(/dur="(\d+)s?"/i)
    const animationDurMatch = svg.match(/animation-duration:\s*(\d+)s/i)
    
    if (durMatch) {
      setSettings(prev => ({ ...prev, duration: parseInt(durMatch[1]) }))
    } else if (animationDurMatch) {
      setSettings(prev => ({ ...prev, duration: parseInt(animationDurMatch[1]) }))
    }
  }

  const handleConvert = async () => {
    if (!user) {
      toast.error('Please sign in to use this feature')
      router.push('/login')
      return
    }

    if (!svgFile) {
      toast.error('Please upload an SVG file')
      return
    }

    const creditCost = CREDIT_COSTS[settings.quality]
    
    if (credits < creditCost) {
      toast.error(`Not enough credits. You need ${creditCost} credits for this conversion.`)
      router.push('/pricing')
      return
    }

    setIsConverting(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', svgFile)
      formData.append('format', settings.format)
      formData.append('quality', settings.quality)
      formData.append('fps', settings.fps)
      formData.append('duration', settings.duration.toString())

      // Call conversion API
      const response = await fetch('/api/convert/svg-to-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Conversion failed')
      }

      // Get the video blob
      const blob = await response.blob()
      
      // Download the file
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converted.${settings.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Video converted successfully!')
      
      // Refresh credits
      await refreshCredits()
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error(error instanceof Error ? error.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const creditCost = CREDIT_COSTS[settings.quality]

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Animated SVG</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop SVG file here or click to upload</p>
            <p className="text-sm text-muted-foreground">Animated SVGs work best for video conversion</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          {svgFile && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">{svgFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for conversion
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Output Format</Label>
            <RadioGroup
              value={settings.format}
              onValueChange={(value) => 
                setSettings({ ...settings, format: value as 'mp4' | 'gif' })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp4" id="mp4" />
                <Label htmlFor="mp4" className="cursor-pointer">
                  MP4 Video (Recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gif" id="gif" />
                <Label htmlFor="gif" className="cursor-pointer">
                  Animated GIF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Quality Selection */}
          <div className="space-y-3">
            <Label>Quality</Label>
            <RadioGroup
              value={settings.quality}
              onValueChange={(value) => 
                setSettings({ ...settings, quality: value as 'standard' | 'hd' | '4k' })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer flex items-center gap-2">
                  Standard (640×480) - 2 credits
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hd" id="hd" />
                <Label htmlFor="hd" className="cursor-pointer flex items-center gap-2">
                  HD (1280×720) - 3 credits
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4k" id="4k" />
                <Label htmlFor="4k" className="cursor-pointer flex items-center gap-2">
                  4K (3840×2160) - 5 credits
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Frame Rate */}
          <div className="space-y-3">
            <Label htmlFor="fps">Frame Rate</Label>
            <Select
              value={settings.fps}
              onValueChange={(value) => 
                setSettings({ ...settings, fps: value as '24' | '30' | '60' })
              }
            >
              <SelectTrigger id="fps">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 FPS</SelectItem>
                <SelectItem value="30">30 FPS</SelectItem>
                <SelectItem value="60">60 FPS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Select
              value={settings.duration.toString()}
              onValueChange={(value) => 
                setSettings({ ...settings, duration: parseInt(value) })
              }
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 10, 15, 20, 30, 45, 60].map(seconds => (
                  <SelectItem key={seconds} value={seconds.toString()}>
                    {seconds} second{seconds > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Button */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Credits Required</p>
                    <p className="text-sm text-muted-foreground">
                      Your balance: {credits} credits
                    </p>
                  </div>
                  <div className="text-2xl font-bold">{creditCost}</div>
                </div>
                
                <Button
                  onClick={handleConvert}
                  disabled={!svgFile || isConverting || credits < creditCost}
                  size="lg"
                  className="w-full"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : credits < creditCost ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Insufficient Credits
                    </>
                  ) : (
                    <>
                      <Film className="mr-2 h-4 w-4" />
                      Convert to {settings.format.toUpperCase()}
                    </>
                  )}
                </Button>
                
                {credits < creditCost && (
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full">
                      Get More Credits
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium mb-1">Premium Feature</p>
                  <p className="text-sm text-muted-foreground">
                    Sign in to convert SVG to video
                  </p>
                </div>
                <Link href="/login" className="block">
                  <Button size="lg" className="w-full">
                    Sign In to Continue
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}