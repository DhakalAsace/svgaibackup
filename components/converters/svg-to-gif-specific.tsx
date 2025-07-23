'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Settings, Image, RotateCcw, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { svgToGifHandler } from '@/lib/converters/svg-to-gif-client'
import Link from 'next/link'

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
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [fit, setFit] = useState<'max' | 'crop' | 'scale'>('max')
  const [stripMetadata, setStripMetadata] = useState(true)
  const [pixelDensity, setPixelDensity] = useState<number>(300)

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
      const result = await svgToGifHandler(Buffer.from(svgContent, 'utf-8'), {
        width,
        height,
        fit,
        strip: stripMetadata,
        pixelDensity,
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
  }, [svgContent, width, height, fit, stripMetadata, pixelDensity, onConversionStart, onConversionComplete])

  const resetOptions = () => {
    setWidth(undefined)
    setHeight(undefined)
    setFit('max')
    setStripMetadata(true)
    setPixelDensity(300)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="w-5 h-5" />
              SVG to GIF Converter
            </CardTitle>
            <CardDescription>
              Convert SVG images to GIF format with customizable resolution and quality settings
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
                value={width || ''}
                onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Auto"
                min="1"
                max="4096"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height || ''}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Auto"
                min="1"
                max="4096"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fit">Resize Mode</Label>
              <Select value={fit} onValueChange={(value) => setFit(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resize mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Max (Fit within bounds)</SelectItem>
                  <SelectItem value="crop">Crop (Fill and crop excess)</SelectItem>
                  <SelectItem value="scale">Scale (Exact dimensions)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pixelDensity">Pixel Density (DPI)</Label>
              <Input
                id="pixelDensity"
                type="number"
                value={pixelDensity}
                onChange={(e) => setPixelDensity(Number(e.target.value))}
                min="72"
                max="600"
                step="1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stripMetadata"
                checked={stripMetadata}
                onCheckedChange={(checked) => setStripMetadata(checked as boolean)}
              />
              <Label htmlFor="stripMetadata">Remove metadata</Label>
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
              <>Processing...</>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Convert & Download GIF
              </>
            )}
          </Button>
        </div>

        {!isConverting && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Converts static SVG images to GIF format</p>
              <p>• High-quality conversion using ImageMagick engine</p>
              <p>• Secure cloud-based processing</p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Video className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <strong>Looking for video export?</strong> Try our{' '}
                <Link 
                  href="/tools/svg-to-video" 
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  SVG to MP4 converter
                </Link>{' '}
                for high-quality video output with advanced features.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}