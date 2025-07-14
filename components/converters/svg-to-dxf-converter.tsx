/**
 * SVG to DXF Converter UI Component
 * 
 * This component provides the user interface for converting SVG files to DXF format.
 * It handles file uploads, conversion options, and provides download functionality.
 */

'use client'

import React, { useState } from 'react'
import { Upload, Download, AlertCircle, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { convertSvgToDxfClient } from '@/lib/converters/svg-to-dxf'
import type { ConversionResult } from '@/lib/converters/types'

interface SvgToDxfConverterProps {
  className?: string
}

export function SvgToDxfConverter({ className }: SvgToDxfConverterProps) {
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [svgContent, setSvgContent] = useState<string>('')
  
  // Conversion options
  const [dxfVersion, setDxfVersion] = useState('AC1015')
  const [units, setUnits] = useState<'mm' | 'cm' | 'in' | 'ft'>('mm')
  const [preserveLayers, setPreserveLayers] = useState(false)

  const handleFileChange = async (file: File) => {
    if (!file) return

    setError(null)
    setResult(null)
    setFileName(file.name)

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.svg')) {
      setError('Please select a valid SVG file')
      return
    }

    // Read and display SVG content
    const content = await file.text()
    setSvgContent(content)

    // Convert the file
    setIsConverting(true)
    try {
      const conversionResult = await convertSvgToDxfClient(file, {
        version: dxfVersion,
        units,
        preserveLayers
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
    
    const blob = new Blob([dataStr], { type: 'application/dxf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace(/\.svg$/i, '.dxf')
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
              accept=".svg,image/svg+xml"
              onChange={(e) => handleFileChange(e.target.files?.[0]!)}
              className="hidden"
              id="svg-file-input"
            />
            <label
              htmlFor="svg-file-input"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Drop your SVG file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Converts SVG shapes to DXF CAD format
                </p>
              </div>
            </label>
          </div>

          {/* Conversion Options */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="dxf-version">DXF Version</Label>
              <Select value={dxfVersion} onValueChange={setDxfVersion}>
                <SelectTrigger id="dxf-version" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC1015">AutoCAD 2000 (AC1015)</SelectItem>
                  <SelectItem value="AC1018">AutoCAD 2004 (AC1018)</SelectItem>
                  <SelectItem value="AC1021">AutoCAD 2007 (AC1021)</SelectItem>
                  <SelectItem value="AC1024">AutoCAD 2010 (AC1024)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={(value) => setUnits(value as any)}>
                <SelectTrigger id="units" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">Millimeters (mm)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="in">Inches (in)</SelectItem>
                  <SelectItem value="ft">Feet (ft)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-layers"
                checked={preserveLayers}
                onCheckedChange={setPreserveLayers}
              />
              <Label htmlFor="preserve-layers">
                Preserve SVG groups as DXF layers
              </Label>
            </div>
          </div>

          {/* SVG Preview */}
          {svgContent && !error && (
            <div className="space-y-2">
              <Label>SVG Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/10 max-h-64 overflow-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  className="max-w-full"
                />
              </div>
            </div>
          )}

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
                <FileCode className="h-4 w-4" />
                <AlertDescription>
                  Successfully converted {fileName} to DXF format
                  {result.metadata?.elementCount && (
                    <span className="block text-sm mt-1">
                      Converted {result.metadata.elementCount} elements
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              <Button 
                onClick={downloadResult} 
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download DXF
              </Button>
            </div>
          )}

          {/* Converting State */}
          {isConverting && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Converting SVG to DXF...</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}