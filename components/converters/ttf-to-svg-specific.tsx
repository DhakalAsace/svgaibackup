"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ConverterUI from "@/components/converter-ui"

export default function TtfToSvgConverter() {
  const [text, setText] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")
  const [fontSize, setFontSize] = useState(72)
  const [allGlyphs, setAllGlyphs] = useState(false)
  const [spacing, setSpacing] = useState(10)
  const [fillColor, setFillColor] = useState("#000000")
  const [strokeColor, setStrokeColor] = useState("none")
  const [strokeWidth, setStrokeWidth] = useState(0)
  const [outputFormat, setOutputFormat] = useState("paths")
  const [individualGlyphs, setIndividualGlyphs] = useState(false)

  const handleConvert = async (file: File, options: any) => {
    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('ttf', 'svg')
    
    if (!converter) {
      throw new Error('TTF to SVG converter not available')
    }
    
    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Convert with options
    const result = await converter.handler(buffer, {
      text: allGlyphs ? undefined : text,
      fontSize,
      allGlyphs,
      spacing,
      fillColor,
      strokeColor: strokeColor === "none" ? undefined : strokeColor,
      strokeWidth,
      outputFormat: outputFormat as any,
      individualGlyphs,
      ...options
    })
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    const blob = new Blob([result.data], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.ttf$/i, ".svg")
    
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
      <div>
        <Label htmlFor="output-format">Output Format</Label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger id="output-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paths">Individual Paths</SelectItem>
            <SelectItem value="font">SVG Font Format</SelectItem>
            <SelectItem value="icons">Icon Format</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="all-glyphs">Export All Glyphs</Label>
        <Switch
          id="all-glyphs"
          checked={allGlyphs}
          onCheckedChange={setAllGlyphs}
        />
      </div>
      
      {!allGlyphs && (
        <div>
          <Label className="mb-2">Text to Convert</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert..."
            className="h-20 font-mono text-sm"
            disabled={allGlyphs}
          />
        </div>
      )}
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Font Size</Label>
          <span className="text-sm text-gray-500">{fontSize}px</span>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
          min={12}
          max={200}
          step={1}
          className="w-full"
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Glyph Spacing</Label>
          <span className="text-sm text-gray-500">{spacing}px</span>
        </div>
        <Slider
          value={[spacing]}
          onValueChange={(value) => setSpacing(value[0])}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="fill-color">Fill Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="fill-color"
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="stroke-color">Stroke Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="stroke-color"
            type="color"
            value={strokeColor === "none" ? "#000000" : strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-20 h-10"
            disabled={strokeColor === "none"}
          />
          <Input
            type="text"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            placeholder="none"
            className="flex-1"
          />
        </div>
      </div>
      
      {strokeColor !== "none" && (
        <div>
          <div className="flex justify-between mb-2">
            <Label>Stroke Width</Label>
            <span className="text-sm text-gray-500">{strokeWidth}px</span>
          </div>
          <Slider
            value={[strokeWidth]}
            onValueChange={(value) => setStrokeWidth(value[0])}
            min={0}
            max={10}
            step={0.5}
            className="w-full"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <Label htmlFor="individual-glyphs">Show Character Labels</Label>
        <Switch
          id="individual-glyphs"
          checked={individualGlyphs}
          onCheckedChange={setIndividualGlyphs}
        />
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="ttf"
      toFormat="svg"
      acceptedFormats={[".ttf", ".otf"]}
      customOptions={customOptions}
      onConvert={handleConvert}
      showAdvancedOptions={true}
    />
  )
}