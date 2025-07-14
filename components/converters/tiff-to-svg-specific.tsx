"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import ConverterUI from "@/components/converter-ui"

export default function TiffToSvgConverter() {
  const [page, setPage] = useState(0)
  const [threshold, setThreshold] = useState(128)
  const [colorMode, setColorMode] = useState(false)
  const [optimization, setOptimization] = useState(5)
  const [turnPolicy, setTurnPolicy] = useState("minority")

  const handleConvert = async (file: File, options: any) => {
    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('tiff', 'svg')
    
    if (!converter) {
      throw new Error('TIFF to SVG converter not available')
    }
    
    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Convert with options
    const result = await converter.handler(buffer, {
      page,
      threshold,
      color: colorMode,
      optimization,
      turnPolicy: turnPolicy as any,
      ...options
    })
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    const blob = new Blob([result.data], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.tiff?$/i, ".svg")
    
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
        <Label htmlFor="page-number">Page Number (for multi-page TIFF)</Label>
        <Input
          id="page-number"
          type="number"
          value={page}
          onChange={(e) => setPage(Math.max(0, parseInt(e.target.value) || 0))}
          min={0}
          placeholder="0"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Page index starts from 0
        </p>
      </div>

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
        <p className="text-xs text-muted-foreground mt-1">
          Adjust threshold for black/white conversion
        </p>
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
        <p className="text-xs text-muted-foreground mt-1">
          Higher values produce more optimized paths
        </p>
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
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Affects how paths are generated around corners
        </p>
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="TIFF"
      toFormat="SVG"
      acceptedFormats={[".tif", ".tiff"]}
      onConvert={handleConvert}
      customOptions={customOptions}
      maxFileSize={50} // 50MB limit for TIFF files
    />
  )
}