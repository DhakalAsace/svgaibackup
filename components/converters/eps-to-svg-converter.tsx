"use client"

import React from "react"
import ConverterUI from "@/components/converter-ui"
import type { ConversionResult, ConverterOptions } from "@/components/converter-ui"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function EpsToSvgConverter() {
  const handleConvert = async (file: File, options: ConverterOptions): Promise<ConversionResult> => {
    // Use client wrapper to safely load the converter
    const { getClientConverter } = await import("@/lib/converters/client-wrapper")
    const converter = await getClientConverter('eps', 'svg')
    
    if (!converter) {
      throw new Error('EPS to SVG converter not available')
    }
    
    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Prepare conversion options
    const conversionOptions = {
      width: options.width,
      height: options.height,
      preserveAspectRatio: options.preserveAspectRatio !== false,
      onProgress: options.onProgress
    }
    
    // Use the EPS to SVG converter
    const result = await converter.handler(buffer, conversionOptions)
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Conversion failed')
    }
    
    // Create blob from SVG data
    const svgBlob = new Blob([result.data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    return {
      blob: svgBlob,
      url,
      filename: file.name.replace(/\.[^/.]+$/, '') + '.svg',
      size: svgBlob.size
    }
  }

  return (
    <ConverterUI
      fromFormat="eps"
      toFormat="svg"
      acceptedFormats={['.eps']}
      maxFileSize={50}
      onConvert={handleConvert}
      showQualitySlider={false}
      showDimensionInputs={true}
      showAdvancedOptions={true}
      customOptions={
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This converter supports both PDF-compatible EPS files (using PDF.js) and pure PostScript EPS files with basic parsing.
              For best results, ensure your EPS file contains vector graphics rather than embedded raster images.
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">EPS Conversion Options</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="preserveFonts" name="preserveFonts" defaultChecked />
                <Label htmlFor="preserveFonts" className="text-sm font-normal cursor-pointer">Preserve font information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="simplifyPaths" name="simplifyPaths" />
                <Label htmlFor="simplifyPaths" className="text-sm font-normal cursor-pointer">Simplify complex paths</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="convertTextToPath" name="convertTextToPath" />
                <Label htmlFor="convertTextToPath" className="text-sm font-normal cursor-pointer">Convert text to paths</Label>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            EPS (Encapsulated PostScript) files will be converted to SVG format while attempting to preserve vector quality.
          </div>
        </div>
      }
    />
  )
}