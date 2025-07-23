"use client"
import ConverterUI from "@/components/converter-ui"
import { svgToPngHandler } from "@/lib/converters/svg-to-png"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
export default function SvgToPngConverter() {
  const [dpi, setDpi] = useState("96")
  const [backgroundColor, setBackgroundColor] = useState("transparent")
  // Set default DPI in defaultOptions
  const handleConvert = async (file: File, options: any) => {
    try {
      // Read file as text for SVG
      const text = await file.text()
      // Convert using the svg-to-png handler
      const result = await svgToPngHandler(text, {
        width: options.width,
        height: options.height,
        preserveAspectRatio: options.maintainAspectRatio,
        quality: options.quality,
        dpi: parseInt(dpi) || 96,
        background: backgroundColor || 'transparent'
      })
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Conversion failed')
      }
      // Create blob and download URL
      const blob = new Blob([result.data], { type: 'image/png' })
      const url = URL.createObjectURL(blob)
      const filename = file.name.replace(/\.svg$/i, '.png')
      return {
        blob,
        url,
        filename,
        size: blob.size
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to convert SVG to PNG')
    }
  }
  return (
    <ConverterUI
      fromFormat="svg"
      toFormat="png"
      acceptedFormats={[".svg"]}
      maxFileSize={50}
      onConvert={handleConvert}
      showQualitySlider={true}
      showDimensionInputs={true}
      showAdvancedOptions={true}
      defaultOptions={{
        quality: 90,
        maintainAspectRatio: true,
        dpi: 96,
        backgroundColor: 'transparent'
      }}
      customOptions={(
        <div className="space-y-4">
          <div>
            <Label htmlFor="dpi">DPI (Dots Per Inch)</Label>
            <Select value={dpi} onValueChange={setDpi}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="72">72 DPI (Web)</SelectItem>
                <SelectItem value="96">96 DPI (Default)</SelectItem>
                <SelectItem value="150">150 DPI (Medium)</SelectItem>
                <SelectItem value="300">300 DPI (Print)</SelectItem>
                <SelectItem value="600">600 DPI (High Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="background">Background Color</Label>
            <Select value={backgroundColor} onValueChange={setBackgroundColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transparent">Transparent</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="#f5f5f5">Light Gray</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    />
  )
}