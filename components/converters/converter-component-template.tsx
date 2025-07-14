/**
 * Template for Creating New Converter UI Components
 * 
 * This template shows how to properly integrate with the progress bar system
 * Copy this file and modify for each new converter
 */

"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConverterUI from "@/components/converter-ui"
import type { ConversionOptions } from "@/lib/converters/types"

export default function ExampleConverter() {
  // Add converter-specific state here
  const [quality, setQuality] = useState(90)
  const [customOption, setCustomOption] = useState("default")

  const handleConvert = async (
    file: File, 
    options: ConversionOptions, 
    reportProgress?: (progress: number) => void
  ) => {
    // Lazy load the converter
    // Example: const { exampleConverterHandler } = await import("@/lib/converters/example-converter")
    throw new Error("Template converter - implement your own converter handler")
    
    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Template - implement actual conversion logic
    // const result = await exampleConverterHandler(buffer, {
    //   quality,
    //   customOption,
    //   ...options,
    //   onProgress: reportProgress // Pass the progress callback
    // })
    // 
    // if (!result.success || !result.data) {
    //   throw new Error(result.error || "Conversion failed")
    // }
    // 
    // // Create blob from result
    // const blob = new Blob([result.data], { type: result.mimeType || "application/octet-stream" })
    // const url = URL.createObjectURL(blob)
    // const filename = file.name.replace(/\.[^.]+$/, `.${options.format || 'output'}`)
    // 
    // return {
    //   blob,
    //   url,
    //   filename,
    //   size: blob.size
    // }
  }

  const customOptions = (
    <div className="space-y-4">
      {/* Quality Slider Example */}
      <div>
        <div className="flex justify-between mb-2">
          <Label>Quality</Label>
          <span className="text-sm text-gray-500">{quality}%</span>
        </div>
        <Slider
          value={[quality]}
          onValueChange={(value) => setQuality(value[0])}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      
      {/* Custom Option Example */}
      <div>
        <Label htmlFor="custom-option">Custom Option</Label>
        <Select value={customOption} onValueChange={setCustomOption}>
          <SelectTrigger id="custom-option">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Add more converter-specific options here */}
    </div>
  )

  return (
    <ConverterUI
      fromFormat="FORMAT" // Change this
      toFormat="FORMAT"   // Change this
      onConvert={handleConvert}
      customOptions={customOptions}
      acceptedFormats={[".png", ".jpg"]} // Change this
      showQualitySlider={false} // We're using custom quality slider
      showDimensionInputs={true} // Enable if needed
    />
  )
}