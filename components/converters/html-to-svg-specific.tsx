"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import ConverterUI from "@/components/converter-ui"

export default function HtmlToSvgConverter() {
  const [viewportWidth, setViewportWidth] = useState(800)
  const [viewportHeight, setViewportHeight] = useState(600)
  const [scale, setScale] = useState(2)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [includeStyles, setIncludeStyles] = useState(true)
  const [embedImages, setEmbedImages] = useState(true)
  const [htmlContent, setHtmlContent] = useState("")

  const handleConvert = async (file: File, options: any) => {
    // Use html content if provided, otherwise use file
    let htmlString = htmlContent
    
    if (!htmlString && file) {
      htmlString = await file.text()
    }
    
    if (!htmlString) {
      throw new Error("No HTML content provided")
    }
    
    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('html', 'svg')
    
    if (!converter) {
      throw new Error('HTML to SVG converter not available')
    }
    
    // Convert with options
    const result = await converter.handler(htmlString, {
      viewportWidth,
      viewportHeight,
      scale,
      backgroundColor,
      includeStyles,
      embedImages,
      ...options
    })
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    const blob = new Blob([result.data], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const filename = file ? file.name.replace(/\.html?$/i, ".svg") : "html-output.svg"
    
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
        <Label className="mb-2">HTML Content (optional - paste HTML here or upload file)</Label>
        <Textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="<div>Your HTML content here...</div>"
          className="h-32 font-mono text-sm"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="viewport-width">Width (px)</Label>
          <Input
            id="viewport-width"
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(Number(e.target.value))}
            min={100}
            max={2000}
          />
        </div>
        
        <div>
          <Label htmlFor="viewport-height">Height (px)</Label>
          <Input
            id="viewport-height"
            type="number"
            value={viewportHeight}
            onChange={(e) => setViewportHeight(Number(e.target.value))}
            min={100}
            max={2000}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Render Scale</Label>
          <span className="text-sm text-gray-500">{scale}x</span>
        </div>
        <Slider
          value={[scale]}
          onValueChange={(value) => setScale(value[0])}
          min={1}
          max={4}
          step={0.5}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="bg-color"
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="include-styles">Include CSS Styles</Label>
        <Switch
          id="include-styles"
          checked={includeStyles}
          onCheckedChange={setIncludeStyles}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="embed-images">Embed Images</Label>
        <Switch
          id="embed-images"
          checked={embedImages}
          onCheckedChange={setEmbedImages}
        />
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="HTML"
      toFormat="SVG"
      acceptedFormats={[".html", ".htm"]}
      onConvert={handleConvert}
      customOptions={customOptions}
      showAdvancedOptions={true}
    />
  )
}