"use client"

import { useState } from "react"
import ConverterUI from "@/components/converter-ui"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function JpgToSvgConverter() {
  const [options, setOptions] = useState({
    threshold: 128,
    color: false,
    colorLevels: 4,
    optimization: 5,
    contrast: 0,
    brightness: 0,
    sharpen: false,
    turnPolicy: 'minority'
  })

  const handleConvert = async (file: File, converterOptions: any, reportProgress?: (progress: number) => void) => {
    try {
      // Lazy load the converter
      const { getClientConverter } = await import("@/lib/converters/client-wrapper")
      const converter = await getClientConverter('jpg', 'svg')
      
      if (!converter) {
        throw new Error('JPG to SVG converter not available')
      }
      
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Map optimization (0-10) to quality (1-100)
      const quality = Math.max(1, Math.round(((options.optimization || 5) / 10) * 100))

      // Merge options
      const mergedOptions = { 
        ...options, 
        ...converterOptions,
        quality,
        // Map UI options to imagetracerjs options
        numberofcolors: options.color ? (options.colorLevels || 4) : 2,
        pathomit: Math.floor((10 - (options.optimization || 5)) * 2 + 8), // 8-28 range
        onProgress: reportProgress
      }

      // Use the JPG to SVG handler
      const result = await converter.handler(buffer, mergedOptions)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Conversion failed')
      }

      // Create blob from result
      const blob = new Blob([result.data], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)

      // Generate filename
      const originalName = file.name.replace(/\.(jpg|jpeg)$/i, '')
      const filename = `${originalName}.svg`

      return {
        blob,
        url,
        filename,
        size: blob.size
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Conversion failed')
    }
  }

  const customOptions = (
    <div className="space-y-4">
      {/* Color Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="color-mode" className="flex items-center gap-2">
            Color Mode
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Choose between monochrome (black & white) or color output with posterization</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Switch
            id="color-mode"
            checked={options.color}
            onCheckedChange={(checked) => setOptions(prev => ({ ...prev, color: checked }))}
          />
        </div>
        <p className="text-sm text-gray-500">
          {options.color ? 'Color (posterized)' : 'Monochrome'}
        </p>
      </div>

      {/* Color Levels (only show if color mode is on) */}
      {options.color && (
        <div>
          <div className="flex justify-between mb-2">
            <Label className="flex items-center gap-2">
              Color Levels
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Number of color levels for posterization (2-16). Lower values create more artistic effects.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-sm text-gray-500">{options.colorLevels}</span>
          </div>
          <Slider
            value={[options.colorLevels || 4]}
            onValueChange={(value) => setOptions(prev => ({ ...prev, colorLevels: value[0] }))}
            min={2}
            max={16}
            step={1}
          />
        </div>
      )}

      {/* Threshold */}
      <div>
        <div className="flex justify-between mb-2">
          <Label className="flex items-center gap-2">
            Threshold
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Controls black/white cutoff point. Lower values include more dark areas.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <span className="text-sm text-gray-500">{options.threshold}</span>
        </div>
        <Slider
          value={[options.threshold || 128]}
          onValueChange={(value) => setOptions(prev => ({ ...prev, threshold: value[0] }))}
          min={1}
          max={255}
          step={1}
        />
      </div>

      {/* Path Optimization */}
      <div>
        <div className="flex justify-between mb-2">
          <Label className="flex items-center gap-2">
            Quality / Speed
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Conversion quality vs speed. Lower values (0-3) are faster but lower quality, good for large images. Higher values (7-10) produce better results but take longer.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <span className="text-sm text-gray-500">
            {options.optimization}/10 
            {(options.optimization || 5) <= 3 ? '(Fast)' : (options.optimization || 5) >= 7 ? '(Quality)' : '(Balanced)'}
          </span>
        </div>
        <Slider
          value={[options.optimization || 5]}
          onValueChange={(value) => setOptions(prev => ({ ...prev, optimization: value[0] }))}
          min={0}
          max={10}
          step={1}
        />
      </div>

      {/* Turn Policy */}
      <div>
        <Label htmlFor="turn-policy" className="flex items-center gap-2 mb-2">
          Turn Policy
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-3 w-3 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Determines how the algorithm handles path direction at ambiguous points.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select value={options.turnPolicy} onValueChange={(value: any) => setOptions(prev => ({ ...prev, turnPolicy: value }))}>
          <SelectTrigger id="turn-policy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minority">Minority (recommended)</SelectItem>
            <SelectItem value="majority">Majority</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Options Toggle */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          Advanced Pre-processing Options
        </summary>
        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
          {/* Brightness */}
          <div>
            <div className="flex justify-between mb-2">
              <Label>Brightness</Label>
              <span className="text-sm text-gray-500">{(options.brightness || 0) > 0 ? '+' : ''}{options.brightness || 0}</span>
            </div>
            <Slider
              value={[options.brightness || 0]}
              onValueChange={(value) => setOptions(prev => ({ ...prev, brightness: value[0] }))}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex justify-between mb-2">
              <Label>Contrast</Label>
              <span className="text-sm text-gray-500">{(options.contrast || 0) > 0 ? '+' : ''}{options.contrast || 0}</span>
            </div>
            <Slider
              value={[options.contrast || 0]}
              onValueChange={(value) => setOptions(prev => ({ ...prev, contrast: value[0] }))}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Sharpen */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sharpen">Apply Sharpening</Label>
            <Switch
              id="sharpen"
              checked={options.sharpen}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, sharpen: checked }))}
            />
          </div>
        </div>
      </details>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="jpg"
      toFormat="svg"
      acceptedFormats={[".jpg", ".jpeg"]}
      maxFileSize={100}
      onConvert={handleConvert}
      showQualitySlider={false}
      showDimensionInputs={true}
      showAdvancedOptions={true}
      customOptions={customOptions}
      defaultOptions={options}
    />
  )
}