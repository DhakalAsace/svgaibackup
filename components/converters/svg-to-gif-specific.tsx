'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Settings, Play, Pause, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { convertSvgToGifClient } from '@/lib/converters/svg-to-gif'

const qualityPresets = {
  'high': { quality: 1, workers: 4, colors: 256 },
  'medium': { quality: 10, workers: 2, colors: 128 },
  'low': { quality: 20, workers: 1, colors: 64 },
  'animation': { quality: 15, workers: 2, colors: 64 }
}

interface SvgToGifSpecificProps {
  svgContent: string
  onConversionStart?: () => void
  onConversionComplete?: (result: { success: boolean; data?: Buffer; error?: string }) => void
}

export function SvgToGifSpecific({ 
  svgContent, 
  onConversionStart, 
  onConversionComplete 
}: SvgToGifSpecificProps) {
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Conversion options
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [quality, setQuality] = useState<string>('medium')
  const [frameRate, setFrameRate] = useState<number>(12)
  const [duration, setDuration] = useState<number>(2)
  const [colors, setColors] = useState<number>(256)
  const [enableDither, setEnableDither] = useState(false)
  const [workers, setWorkers] = useState<number>(2)

  const handleConvert = useCallback(async () => {
    if (!svgContent) {
      setError('No SVG content provided')
      return
    }

    setIsConverting(true)
    setProgress(0)
    setError(null)
    onConversionStart?.()

    try {
      const preset = qualityPresets[quality as keyof typeof qualityPresets]
      
      const result = await convertSvgToGifClient(svgContent, {
        width,
        height,
        frameRate,
        duration,
        colors: colors || preset.colors,
        dither: enableDither,
        workers: workers || preset.workers,
        quality: preset.quality,
        qualityPreset: quality as 'high' | 'medium' | 'low' | 'animation',
        onProgress: (progressValue) => {
          setProgress(Math.round(progressValue * 100))
        }
      })

      if (result.success && result.data) {
        // Create download
        const blob = new Blob([result.data], { type: 'image/gif' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `converted-${Date.now()}.gif`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        onConversionComplete?.({ success: true, data: result.data instanceof Buffer ? result.data : undefined })
      } else {
        throw new Error('Conversion failed: No data returned')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown conversion error'
      setError(errorMessage)
      onConversionComplete?.({ success: false, error: errorMessage })
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }, [svgContent, width, height, quality, frameRate, duration, colors, enableDither, workers, onConversionStart, onConversionComplete])

  const resetOptions = () => {
    setWidth(800)
    setHeight(600)
    setQuality('medium')
    setFrameRate(12)
    setDuration(2)
    setColors(256)
    setEnableDither(false)
    setWorkers(2)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              SVG to GIF Converter
            </CardTitle>
            <CardDescription>
              Convert SVG files to animated GIF format with customizable settings
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Options
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min="1"
                max="4096"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min="1"
                max="4096"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quality">Quality Preset</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (Best quality)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="low">Low (Smallest file)</SelectItem>
                  <SelectItem value="animation">Animation (Optimized)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frameRate">Frame Rate (fps)</Label>
              <Input
                id="frameRate"
                type="number"
                value={frameRate}
                onChange={(e) => setFrameRate(Number(e.target.value))}
                min="1"
                max="60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="0.1"
                max="30"
                step="0.1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="colors">Colors (2-256)</Label>
              <Input
                id="colors"
                type="number"
                value={colors}
                onChange={(e) => setColors(Number(e.target.value))}
                min="2"
                max="256"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workers">Worker Threads</Label>
              <Input
                id="workers"
                type="number"
                value={workers}
                onChange={(e) => setWorkers(Number(e.target.value))}
                min="0"
                max="8"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dither"
                checked={enableDither}
                onCheckedChange={(checked) => setEnableDither(checked as boolean)}
              />
              <Label htmlFor="dither">Enable Dithering</Label>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={resetOptions}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConverting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Converting SVG to GIF...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleConvert}
            disabled={isConverting || !svgContent}
            className="flex-1"
          >
            {isConverting ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isConverting ? 'Converting...' : 'Convert & Download GIF'}
          </Button>
        </div>

        {!isConverting && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Supports both static SVG and animated SVG with CSS/SMIL animations</p>
            <p>• Client-side conversion - your files never leave your browser</p>
            <p>• Larger images and longer animations will take more time to process</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}