"use client"

import React from "react"
import ConverterUI from "@/components/converter-ui"
import type { ConversionResult, ConverterOptions } from "@/components/converter-ui"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function AiToSvgConverter() {
  const handleConvert = async (file: File, options: ConverterOptions): Promise<ConversionResult> => {
    console.log('[AiToSvgConverter] Starting conversion for file:', file.name)
    
    try {
      // Use client wrapper to safely load the converter
      const { getClientConverter } = await import("@/lib/converters/client-wrapper")
      const converter = await getClientConverter('ai', 'svg')
      
      console.log('[AiToSvgConverter] Converter loaded:', converter ? 'success' : 'failed')
      
      if (!converter) {
        throw new Error('AI to SVG converter not available')
      }
      
      // Read file
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      console.log('[AiToSvgConverter] File buffer created, size:', buffer.length)
      
      // Prepare conversion options
      const conversionOptions = {
        width: options.width,
        height: options.height,
        preserveAspectRatio: options.preserveAspectRatio !== false,
        artboard: 1, // Default to first artboard
        preserveLayers: true, // Default to preserving layers
        onProgress: (progress: number) => {
          console.log('[AiToSvgConverter] Progress:', progress)
          if (options.onProgress) {
            options.onProgress(progress)
          }
        }
      }
      
      console.log('[AiToSvgConverter] Calling converter.handler...')
      
      // Use the AI to SVG converter
      console.log('[AiToSvgConverter] About to call converter.handler')
      console.log('[AiToSvgConverter] Converter object:', converter)
      
      let result
      try {
        result = await converter.handler(buffer, conversionOptions)
      } catch (handlerError) {
        console.error('[AiToSvgConverter] Handler error:', handlerError)
        throw handlerError
      }
      
      console.log('[AiToSvgConverter] Conversion result:', {
        success: result.success,
        hasData: !!result.data,
        dataType: typeof result.data,
        dataLength: result.data ? result.data.length : 0,
        error: result.error
      })
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Conversion failed')
      }
      
      console.log('[AiToSvgConverter] Creating blob from SVG data...')
      
      // Create blob from SVG data
      const svgBlob = new Blob([result.data], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      
      console.log('[AiToSvgConverter] Conversion complete, blob size:', svgBlob.size)
      
      return {
        blob: svgBlob,
        url,
        filename: file.name.replace(/\.[^/.]+$/, '') + '.svg',
        size: svgBlob.size
      }
    } catch (error) {
      console.error('[AiToSvgConverter] Conversion error:', error)
      console.error('[AiToSvgConverter] Error stack:', error instanceof Error ? error.stack : 'No stack')
      throw error
    }
  }

  return (
    <ConverterUI
      fromFormat="ai"
      toFormat="svg"
      acceptedFormats={['.ai', '.pdf']}
      maxFileSize={100}
      onConvert={handleConvert}
      showQualitySlider={false}
      showDimensionInputs={true}
      showAdvancedOptions={true}
      customOptions={
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For best results, save your Adobe Illustrator file with 
              "Create PDF Compatible File" option enabled. Both .ai and .pdf files from 
              Adobe Illustrator are accepted.
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Adobe Illustrator Options</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="preserveLayers" name="preserveLayers" defaultChecked />
                <Label htmlFor="preserveLayers" className="text-sm font-normal cursor-pointer">Preserve layer structure</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="expandAppearances" name="expandAppearances" />
                <Label htmlFor="expandAppearances" className="text-sm font-normal cursor-pointer">Expand appearances</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="convertTextToOutlines" name="convertTextToOutlines" />
                <Label htmlFor="convertTextToOutlines" className="text-sm font-normal cursor-pointer">Convert text to outlines</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="preserveEditability" name="preserveEditability" defaultChecked />
                <Label htmlFor="preserveEditability" className="text-sm font-normal cursor-pointer">Preserve editability where possible</Label>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Adobe Illustrator (.ai) files will be converted to SVG format. Complex effects and filters may be simplified.
          </div>
        </div>
      }
    />
  )
}