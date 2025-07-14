"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import ConverterUI, { ConverterOptions, ConversionResult } from "@/components/converter-ui"

export default function SvgToBmpConverter() {
  const [bitDepth, setBitDepth] = useState<24 | 32>(24)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [background, setBackground] = useState("#ffffff")
  const [dpi, setDpi] = useState(96)
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true)

  const handleConvert = async (file: File, options: ConverterOptions): Promise<ConversionResult> => {
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('svg', 'bmp')
    
    if (!converter) {
      throw new Error('SVG to BMP converter not available')
    }
    
    // Read file as array buffer and convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Parse dimensions if provided
    const convertOptions = {
      bitDepth,
      dpi,
      background,
      preserveAspectRatio,
      ...(width && { width: parseInt(width) }),
      ...(height && { height: parseInt(height) }),
      ...options
    }
    
    // Convert using the client wrapper
    const result = await converter.handler(buffer, convertOptions)
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    const blob = new Blob([result.data], { type: result.mimeType || "image/bmp" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.svg$/i, ".bmp")
    
    return {
      blob,
      url,
      filename,
      size: blob.size
    }
  }

  return (
    <ConverterUI
      acceptedFormats={[".svg"]}
      maxFileSize={10}
      onConvert={handleConvert}
      fromFormat="SVG"
      toFormat="BMP"
      customOptions={
        <div className="space-y-4">
        <div>
          <Label htmlFor="bitDepth">Bit Depth</Label>
          <Select value={bitDepth.toString()} onValueChange={(value) => setBitDepth(parseInt(value) as 24 | 32)}>
            <SelectTrigger id="bitDepth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24-bit (RGB)</SelectItem>
              <SelectItem value="32">32-bit (RGBA)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            24-bit is standard, 32-bit includes alpha channel
          </p>
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
              max="10000"
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
              max="10000"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="preserveAspectRatio"
            checked={preserveAspectRatio}
            onCheckedChange={setPreserveAspectRatio}
          />
          <Label htmlFor="preserveAspectRatio">Preserve aspect ratio</Label>
        </div>

        <div>
          <Label htmlFor="dpi">DPI (dots per inch)</Label>
          <Input
            id="dpi"
            type="number"
            value={dpi}
            onChange={(e) => setDpi(parseInt(e.target.value) || 96)}
            min="72"
            max="600"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Standard screen: 96, Print: 300
          </p>
        </div>

        <div>
          <Label htmlFor="background">Background Color</Label>
          <div className="flex space-x-2">
            <Input
              id="background"
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-20"
            />
            <Input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            BMP format doesn't support transparency well
          </p>
        </div>
      </div>
      }
    />
  )
}