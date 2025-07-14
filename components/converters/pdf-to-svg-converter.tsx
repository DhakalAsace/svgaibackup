"use client"

import React, { useState } from "react"
import ConverterUI from "@/components/converter-ui"
import { convertPdfToSvgClient } from "@/lib/converters/pdf-to-svg"
import type { ConversionResult, ConverterOptions } from "@/components/converter-ui"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function PdfToSvgConverter() {
  const [pageNumber, setPageNumber] = useState(1)
  const [conversionMethod, setConversionMethod] = useState<'client' | 'api' | 'unknown'>('unknown')
  
  const handleConvert = async (file: File, options: ConverterOptions): Promise<ConversionResult> => {
    try {
      // Use the improved client converter with API fallback
      const result = await convertPdfToSvgClient(file, {
        page: pageNumber,
        scale: options.scale || 2.0,
        extractText: options.extractText || false,
        onProgress: options.onProgress
      })
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Conversion failed')
      }

      // Track which conversion method was used
      setConversionMethod(result.metadata?.method === 'cloudconvert-api' ? 'api' : 'client')
      
      // Create blob from result
      const outputData = result.data instanceof Buffer 
        ? result.data 
        : Buffer.from(result.data as string, 'utf8')
      const blob = new Blob([outputData], { type: 'image/svg+xml' })
      
      return {
        blob,
        url: URL.createObjectURL(blob),
        filename: file.name.replace(/\.[^/.]+$/, `_page${pageNumber}.svg`),
        size: blob.size
      }
    } catch (error) {
      setConversionMethod('unknown')
      throw error
    }
  }

  const customOptions = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="page-number" className="text-sm font-medium">
          Page Number
        </Label>
        <Input
          id="page-number"
          type="number"
          min="1"
          value={pageNumber}
          onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
          className="w-full mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select which page to convert (default: 1)
        </p>
      </div>

      {conversionMethod !== 'unknown' && (
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Conversion Method:</Label>
          <Badge variant={conversionMethod === 'client' ? 'default' : 'secondary'}>
            {conversionMethod === 'client' ? 'Client-side (PDF.js)' : 'Server-side (CloudConvert)'}
          </Badge>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Client-side: Fast, uses PDF.js library in your browser</p>
        <p>• Server-side: Fallback using CloudConvert API for complex PDFs</p>
        <p>• Automatic fallback ensures reliable conversion</p>
      </div>
    </div>
  )

  return (
    <ConverterUI
      fromFormat="pdf"
      toFormat="svg"
      acceptedFormats={['.pdf']}
      onConvert={handleConvert}
      customOptions={customOptions}
    />
  )
}