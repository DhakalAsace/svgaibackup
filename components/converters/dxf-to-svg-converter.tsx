/**
 * DXF to SVG Converter UI Component
 * 
 * This component provides the user interface for converting DXF files to SVG format.
 * It handles file uploads, conversion options, and displays the converted result.
 */

'use client'

import React, { useState } from 'react'
import { Upload, Download, AlertCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { convertDxfToSvgClient } from '@/lib/converters/dxf-to-svg'
import type { ConversionResult } from '@/lib/converters/types'

interface DxfToSvgConverterProps {
  className?: string
}

export function DxfToSvgConverter({ className }: DxfToSvgConverterProps) {
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [scale, setScale] = useState(1)
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  const handleFileChange = async (file: File) => {
    if (!file) return

    setError(null)
    setResult(null)
    setFileName(file.name)

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.dxf')) {
      setError('Please select a valid DXF file')
      return
    }

    // Convert the file
    setIsConverting(true)
    try {
      const conversionResult = await convertDxfToSvgClient(file, {
        scale,
        strokeWidth,
        defaultColor: '#000000'
      })
      
      setResult(conversionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const downloadResult = () => {
    if (!result || !result.data) return

    // Convert data to string if it's not already
    let dataStr: string
    if (typeof result.data === 'string') {
      dataStr = result.data
    } else if (result.data instanceof ArrayBuffer) {
      dataStr = new TextDecoder().decode(result.data)
    } else if (result.data instanceof Uint8Array) {
      dataStr = new TextDecoder().decode(result.data)
    } else {
      dataStr = String(result.data)
    }
    
    // Check if dataStr is defined before creating Blob
    if (!dataStr) {
      setError('No data to download')
      return
    }
    
    const blob = new Blob([dataStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace(/\.dxf$/i, '.svg')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
          >
            <input
              type="file"
              accept=".dxf"
              onChange={(e) => handleFileChange(e.target.files?.[0]!)}
              className="hidden"
              id="dxf-file-input"
            />
            <label
              htmlFor="dxf-file-input"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Drop your DXF file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports AutoCAD DXF files with basic shapes
                </p>
              </div>
            </label>
          </div>

          {/* Conversion Options */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="scale">Scale Factor: {scale}x</Label>
              <Slider
                id="scale"
                min={0.1}
                max={5}
                step={0.1}
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="stroke-width">Stroke Width: {strokeWidth}px</Label>
              <Slider
                id="stroke-width"
                min={0.5}
                max={5}
                step={0.5}
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                className="mt-2"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Successfully converted {fileName} to SVG format
                  {result?.metadata?.width && result?.metadata?.height && (
                    <span className="block text-sm mt-1">
                      Dimensions: {Math.round(result.metadata.width)} × {Math.round(result.metadata.height)}
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              {/* SVG Preview */}
              <div className="border rounded-lg p-4 bg-muted/10">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      if (!result?.data) return ''
                      if (typeof result.data === 'string') return result.data
                      if (result.data instanceof ArrayBuffer) return new TextDecoder().decode(result.data)
                      if (result.data instanceof Uint8Array) return new TextDecoder().decode(result.data)
                      // Handle Buffer type (Node.js environment)
                      if (result.data && typeof result.data === 'object' && 'buffer' in result.data) {
                        return new TextDecoder().decode(new Uint8Array((result.data as any).buffer))
                      }
                      return String(result.data)
                    })()
                  }}
                  className="max-w-full overflow-auto"
                />
              </div>

              <Button 
                onClick={downloadResult} 
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download SVG
              </Button>
            </div>
          )}

          {/* Converting State */}
          {isConverting && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Converting DXF to SVG...</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}