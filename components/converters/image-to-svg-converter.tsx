"use client"

import React, { useState } from "react"
import ConverterUI from "@/components/converter-ui"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { getClientConverter } from "@/lib/converters/client-wrapper"
import type { ConversionResult, ConverterOptions } from "@/components/converter-ui"

export default function ImageToSvgConverter() {
  const [colorOutput, setColorOutput] = useState(true)
  const [colorLevels, setColorLevels] = useState(4)
  const [threshold, setThreshold] = useState(128)
  
  const handleConvert = async (file: File, options: ConverterOptions): Promise<ConversionResult> => {
    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Determine file type and select appropriate handler
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    let fromFormat = fileExtension
    
    // Handle aliases
    if (fromFormat === 'jpeg') {
      fromFormat = 'jpg'
    } else if (fromFormat === 'tif') {
      fromFormat = 'tiff'
    }
    
    // Load the appropriate converter
    const converter = await getClientConverter(fromFormat as any, 'svg')
    
    if (!converter) {
      throw new Error(`No converter available for ${fileExtension?.toUpperCase()} to SVG`)
    }
    
    // Perform conversion
    const result = await converter.handler(buffer, {
      ...options,
      threshold: options.threshold || threshold,
      color: options.color !== false ? colorOutput : false,
      colorLevels: options.colorLevels || colorLevels,
      optimization: options.optimization || 5,
      onProgress: options.onProgress
    })
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Conversion failed')
    }
    
    // Create blob from result
    const outputData = result.data instanceof Buffer 
      ? result.data 
      : Buffer.from(result.data as string, 'utf8')
    const blob = new Blob([outputData], { type: 'image/svg+xml' })
    
    return {
      blob,
      url: URL.createObjectURL(blob),
      filename: file.name.replace(/\.[^/.]+$/, '.svg'),
      size: blob.size
    }
  }

  const customOptions = (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="color-output"
            checked={colorOutput}
            onCheckedChange={setColorOutput}
          />
          <Label htmlFor="color-output">Color Output</Label>
        </div>
        
        {colorOutput && (
          <div>
            <Label htmlFor="color-levels" className="text-sm">
              Color Levels: {colorLevels}
            </Label>
            <Input
              id="color-levels"
              type="range"
              min="2"
              max="16"
              value={colorLevels}
              onChange={(e) => setColorLevels(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {!colorOutput && (
          <div>
            <Label htmlFor="threshold" className="text-sm">
              Black/White Threshold: {threshold}
            </Label>
            <Input
              id="threshold"
              type="range"
              min="0"
              max="255"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>
    </>
  )

  return (
    <ConverterUI
      fromFormat="image"
      toFormat="svg"
      acceptedFormats={['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.tif', '.ico', '.avif']}
      maxFileSize={50}
      onConvert={handleConvert}
      showQualitySlider={false}
      showDimensionInputs={true}
      showAdvancedOptions={true}
      customOptions={customOptions}
    />
  )
}