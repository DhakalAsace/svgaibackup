"use client"

import React from "react"
import ConverterUI from "@/components/converter-ui"
import type { ConversionResult, ConverterOptions } from "@/components/converter-ui"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function SvgToEpsConverter() {
  const handleConvert = async (file: File, options: ConverterOptions): Promise<ConversionResult> => {
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('svg', 'eps')
    
    if (!converter) {
      throw new Error('SVG to EPS converter not available')
    }
    
    // Read SVG file
    const text = await file.text()
    
    // Prepare conversion options
    const conversionOptions = {
      width: options.width,
      height: options.height,
      preserveAspectRatio: options.preserveAspectRatio !== false,
      psLevel: 3, // PostScript Level 3
      colorMode: 'rgb' as const,
      onProgress: options.onProgress
    }
    
    // Use the SVG to EPS converter
    const result = await converter.handler(text, conversionOptions)
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Conversion failed')
    }
    
    // Create blob from EPS data
    const epsBlob = new Blob([result.data], { type: 'application/postscript' })
    const url = URL.createObjectURL(epsBlob)
    
    return {
      blob: epsBlob,
      url,
      filename: file.name.replace(/\.[^/.]+$/, '') + '.eps',
      size: epsBlob.size
    }
  }

  return (
    <ConverterUI
      fromFormat="svg"
      toFormat="eps"
      acceptedFormats={['.svg']}
      maxFileSize={50}
      onConvert={handleConvert}
      showQualitySlider={false}
      showDimensionInputs={false}
      showAdvancedOptions={true}
      customOptions={
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This converter translates SVG elements to PostScript commands. 
              Complex SVG features like filters and gradients may be simplified in the EPS output.
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">PostScript Options</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="embedFonts" name="embedFonts" />
                <Label htmlFor="embedFonts" className="text-sm font-normal cursor-pointer">Embed fonts (when available)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="convertTextToOutlines" name="convertTextToOutlines" defaultChecked />
                <Label htmlFor="convertTextToOutlines" className="text-sm font-normal cursor-pointer">Convert text to outlines</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="preserveTransparency" name="preserveTransparency" />
                <Label htmlFor="preserveTransparency" className="text-sm font-normal cursor-pointer">Preserve transparency (where supported)</Label>
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">PostScript Level</Label>
            <Select name="psLevel" defaultValue="3">
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">PostScript Level 2</SelectItem>
                <SelectItem value="3">PostScript Level 3 (Recommended)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-gray-500">
            EPS (Encapsulated PostScript) is ideal for print workflows and professional design applications.
          </div>
        </div>
      }
    />
  )
}