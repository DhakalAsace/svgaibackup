"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConverterUI from "@/components/converter-ui"

export default function PngToSvgConverter() {
  const [threshold, setThreshold] = useState(128)
  const [colorMode, setColorMode] = useState(false)
  const [optimization, setOptimization] = useState(5)
  const [turnPolicy, setTurnPolicy] = useState("minority")

  const handleConvert = async (file: File, options: any, reportProgress?: (progress: number) => void) => {
    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('png', 'svg')
    
    if (!converter) {
      throw new Error('PNG to SVG converter not available')
    }
    
    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Convert with options, including progress callback
    const result = await converter.handler(buffer, {
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
    const blob = new Blob([result.data], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.png$/i, ".svg")
    
    return {
      blob,
      url,
      filename,
      size: blob.size
    }
  }

  const customOptions = (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <Label>Threshold</Label>
          <span className="text-sm text-gray-500">{threshold}</span>
        </div>
        <Slider
          value={[threshold]}
          onValueChange={(value) => setThreshold(value[0])}
          min={0}
          max={255}
          step={1}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="color-mode">Color Mode</Label>
        <Switch
          id="color-mode"
          checked={colorMode}
          onCheckedChange={setColorMode}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Path Optimization</Label>
          <span className="text-sm text-gray-500">{optimization}</span>
        </div>
        <Slider
          value={[optimization]}
          onValueChange={(value) => setOptimization(value[0])}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
      </div>
      
      <div>
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
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="PNG"
      toFormat="SVG"
      onConvert={handleConvert}
      customOptions={customOptions}
      acceptedFormats={[".png"]}
    />
  )
}