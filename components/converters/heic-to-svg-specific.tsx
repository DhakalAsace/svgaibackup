"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import ConverterUI from "@/components/converter-ui"

export default function HeicToSvgConverter() {
  const [threshold, setThreshold] = useState(128)
  const [colorMode, setColorMode] = useState(false)
  const [optimization, setOptimization] = useState(5)
  const [turnPolicy, setTurnPolicy] = useState("minority")
  const [jpegQuality, setJpegQuality] = useState(92)

  const handleConvert = async (file: File, options: any) => {
    // Check browser support
    if (typeof window === 'undefined') {
      throw new Error("HEIC conversion requires a browser environment")
    }

    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('heic', 'svg')
    
    if (!converter) {
      throw new Error('HEIC to SVG converter not available')
    }
    
    try {
      // Read file
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Convert with options
      const result = await converter.handler(buffer, {
        threshold,
        color: colorMode,
        optimization,
        turnPolicy: turnPolicy as any,
        jpegQuality: jpegQuality / 100,
        ...options
      })
      
      if (!result.success || !result.data) {
        throw new Error(result.error || "Conversion failed")
      }
      
      // Create blob from result
      const blob = new Blob([result.data], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const filename = file.name.replace(/\.heic$/i, ".svg")
      
      return {
        blob,
        url,
        filename,
        size: blob.size
      }
    } catch (error) {
      // Provide helpful error messages for HEIC-specific issues
      if (error instanceof Error) {
        if (error.message.includes('not supported')) {
          throw new Error('HEIC format is not supported in this browser. Please try Chrome, Firefox, or Safari.')
        }
        if (error.message.includes('ftyp')) {
          throw new Error('The file does not appear to be a valid HEIC image.')
        }
      }
      throw error
    }
  }

  const customOptions = (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          HEIC conversion requires a modern browser (Chrome, Firefox, or Safari).
          The file will be converted to JPEG internally before vectorization.
        </AlertDescription>
      </Alert>

      <div>
        <div className="flex justify-between mb-2">
          <Label>JPEG Quality</Label>
          <span className="text-sm text-gray-500">{jpegQuality}%</span>
        </div>
        <Slider
          value={[jpegQuality]}
          onValueChange={(value) => setJpegQuality(value[0])}
          min={50}
          max={100}
          step={1}
          className="w-full"
        />
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
      fromFormat="HEIC"
      toFormat="SVG"
      onConvert={handleConvert}
      customOptions={customOptions}
      acceptedFormats={[".heic", ".heif"]}
    />
  )
}