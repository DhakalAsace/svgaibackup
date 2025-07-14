"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConverterUI from "@/components/converter-ui"

export default function JpegToSvgConverter() {
  const [threshold, setThreshold] = useState(128)
  const [colorMode, setColorMode] = useState(false)
  const [optimization, setOptimization] = useState(5)
  const [turnPolicy, setTurnPolicy] = useState("minority")

  const handleConvert = async (file: File, options: any, reportProgress?: (progress: number) => void) => {
    // Lazy load the converter
    const { jpgToSvgHandler } = await import("@/lib/converters/jpg-to-svg")
    
    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Convert with options, including progress callback
    const result = await jpgToSvgHandler(buffer, {
      threshold,
      color: colorMode,
      optimization,
      turnPolicy: turnPolicy as any,
      ...options,
      onProgress: reportProgress
    })
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    const blob = new Blob([result.data], { type: result.mimeType || "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.(jpeg|jpg)$/i, '.svg')
    
    return {
      blob,
      url,
      filename,
      size: blob.size
    }
  }

  const specificOptions = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="threshold">Threshold ({threshold})</Label>
        <Slider
          id="threshold"
          min={0}
          max={255}
          step={1}
          value={[threshold]}
          onValueChange={(value) => setThreshold(value[0])}
          className="w-full"
        />
        <p className="text-sm text-gray-600">
          Controls the cutoff between black and white. Lower values include more detail.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="color-mode"
          checked={colorMode}
          onCheckedChange={setColorMode}
        />
        <Label htmlFor="color-mode">Color Mode</Label>
      </div>
      <p className="text-sm text-gray-600">
        Enable for posterized color output, disable for monochrome.
      </p>

      <div className="space-y-2">
        <Label htmlFor="optimization">Optimization Level ({optimization})</Label>
        <Slider
          id="optimization"
          min={0}
          max={10}
          step={1}
          value={[optimization]}
          onValueChange={(value) => setOptimization(value[0])}
          className="w-full"
        />
        <p className="text-sm text-gray-600">
          Higher values create smoother curves but may lose detail.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="turn-policy">Turn Policy</Label>
        <Select value={turnPolicy} onValueChange={setTurnPolicy}>
          <SelectTrigger id="turn-policy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minority">Minority</SelectItem>
            <SelectItem value="majority">Majority</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">
          Determines how corners are traced. Minority works best for most images.
        </p>
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="JPEG"
      toFormat="SVG"
      acceptedFormats={[".jpeg", ".jpg"]}
      maxFileSize={100}
      onConvert={handleConvert}
      customOptions={specificOptions}
    />
  )
}