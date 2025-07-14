"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import ConverterUI from "@/components/converter-ui"

export default function SvgToTiffConverter() {
  const [dpi, setDpi] = useState(300)
  const [compression, setCompression] = useState<"none" | "lzw" | "deflate" | "jpeg" | "ccittfax4">("lzw")
  const [predictor, setPredictor] = useState<"none" | "horizontal" | "float">("horizontal")
  const [bitdepth, setBitdepth] = useState<1 | 2 | 4 | 8>(8)

  const handleConvert = async (file: File, options: any) => {
    // Lazy load the converter
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('svg', 'tiff')
    
    if (!converter) {
      throw new Error('SVG to TIFF converter not available')
    }
    
    // Read SVG as text
    const svgContent = await file.text()
    
    // Convert with options
    const result = await converter.handler(svgContent, {
      dpi,
      compression,
      predictor: (compression === "lzw" || compression === "deflate") ? predictor : undefined,
      bitdepth,
      ...options
    })
    
    if (!result.success || !result.data) {
      throw new Error(result.error || "Conversion failed")
    }
    
    // Create blob from result
    const blob = new Blob([result.data], { type: "image/tiff" })
    const url = URL.createObjectURL(blob)
    const filename = file.name.replace(/\.svg$/i, ".tiff")
    
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
          <Label>DPI (Dots Per Inch)</Label>
          <span className="text-sm text-gray-500">{dpi}</span>
        </div>
        <Slider
          value={[dpi]}
          onValueChange={(value) => setDpi(value[0])}
          min={72}
          max={600}
          step={1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Higher DPI results in better quality but larger file size
        </p>
      </div>
      
      <div>
        <Label htmlFor="compression">Compression Method</Label>
        <Select value={compression} onValueChange={(value: any) => setCompression(value)}>
          <SelectTrigger id="compression">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="lzw">LZW (Lossless)</SelectItem>
            <SelectItem value="deflate">Deflate (Lossless)</SelectItem>
            <SelectItem value="jpeg">JPEG (Lossy)</SelectItem>
            <SelectItem value="ccittfax4">CCITT Fax4 (B&W only)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          LZW and Deflate provide good compression without quality loss
        </p>
      </div>
      
      {(compression === "lzw" || compression === "deflate") && (
        <div>
          <Label htmlFor="predictor">Predictor</Label>
          <Select value={predictor} onValueChange={(value: any) => setPredictor(value)}>
            <SelectTrigger id="predictor">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="float">Float</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Improves compression for LZW and Deflate methods
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="bitdepth">Bit Depth</Label>
        <Select value={String(bitdepth)} onValueChange={(value) => setBitdepth(parseInt(value) as any)}>
          <SelectTrigger id="bitdepth">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1-bit (B&W)</SelectItem>
            <SelectItem value="2">2-bit</SelectItem>
            <SelectItem value="4">4-bit</SelectItem>
            <SelectItem value="8">8-bit (Full color)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Lower bit depth reduces file size but may affect quality
        </p>
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="SVG"
      toFormat="TIFF"
      acceptedFormats={[".svg"]}
      onConvert={handleConvert}
      customOptions={customOptions}
      maxFileSize={50} // 50MB limit
    />
  )
}

