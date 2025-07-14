"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import ConverterUI from "@/components/converter-ui"

export default function SvgToHeicConverter() {
  const [quality, setQuality] = useState(90)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [background, setBackground] = useState("#ffffff")
  const [dpi, setDpi] = useState(150)

  const handleConvert = async (file: File, options: any) => {
    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('svg', 'heic')
    
    if (!converter) {
      throw new Error('SVG to HEIC converter not available')
    }
    
    // Read file as text (SVG is text-based)
    const svgContent = await file.text()
    
    // Parse dimensions if provided
    const convertOptions = {
      quality,
      dpi,
      background: background === "#ffffff" ? "white" : background,
      ...(width && { width: parseInt(width) }),
      ...(height && { height: parseInt(height) }),
      ...options
    }
    
    // Convert
    const result = await converter.handler(svgContent, convertOptions)
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    // Note: Actually creates JPEG since HEIC encoding is not available
    const blob = new Blob([result.data], { type: result.mimeType || "image/jpeg" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.svg$/i, ".heic")
    
    return {
      blob,
      url,
      filename,
      size: blob.size,
      metadata: result.metadata
    }
  }

  const customOptions = (
    <div className="space-y-4">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Limited HEIC Support</AlertTitle>
        <AlertDescription>
          Direct HEIC encoding is not available in browsers. This converter creates a high-quality JPEG 
          that can be renamed to .heic for compatibility with Apple devices.
        </AlertDescription>
      </Alert>

      <div>
        <div className="flex justify-between mb-2">
          <Label>Quality</Label>
          <span className="text-sm text-gray-500">{quality}%</span>
        </div>
        <Slider
          value={[quality]}
          onValueChange={(value) => setQuality(value[0])}
          min={50}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label>DPI</Label>
          <span className="text-sm text-gray-500">{dpi}</span>
        </div>
        <Slider
          value={[dpi]}
          onValueChange={(value) => setDpi(value[0])}
          min={72}
          max={300}
          step={1}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width (optional)</Label>
          <Input
            id="width"
            type="number"
            placeholder="Auto"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (optional)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Auto"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="background">Background Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="background"
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="SVG"
      toFormat="HEIC"
      onConvert={handleConvert}
      customOptions={customOptions}
      acceptedFormats={[".svg"]}
    />
  )
}