'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Upload, Download, FileText, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { convertSvgToDxfClient } from '@/lib/converters/svg-to-dxf'
import type { SvgToDxfOptions } from '@/lib/converters/svg-to-dxf-browser'

export function SvgToDxfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [options, setOptions] = useState<SvgToDxfOptions>({
    units: 'mm',
    preserveLayers: false,
    version: 'AC1015',
    precision: 6
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.includes('svg') && !selectedFile.name.endsWith('.svg')) {
        toast.error('Please select an SVG file')
        return
      }
      setFile(selectedFile)
      setProgress(0)
    }
  }

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please select an SVG file first')
      return
    }

    setConverting(true)
    setProgress(0)

    try {
      const result = await convertSvgToDxfClient(file, {
        ...options,
        onProgress: (p: number) => setProgress(Math.round(p * 100))
      })

      if (result.success && result.data) {
        // Create download link
        const blob = new Blob([result.data], { type: 'application/dxf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.svg$/i, '.dxf')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success('SVG converted to DXF successfully!')
      }
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error(error instanceof Error ? error.message : 'Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SVG to DXF Converter</CardTitle>
          <CardDescription>
            Convert SVG files to DXF format for use in AutoCAD and other CAD applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & Convert</TabsTrigger>
              <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-12 w-12 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">SVG files only</span>
                </label>
              </div>

              {file && (
                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="units">Output Units</Label>
                  <Select
                    value={options.units}
                    onValueChange={(value) => 
                      setOptions({ ...options, units: value as any })
                    }
                  >
                    <SelectTrigger id="units">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">Millimeters</SelectItem>
                      <SelectItem value="cm">Centimeters</SelectItem>
                      <SelectItem value="in">Inches</SelectItem>
                      <SelectItem value="ft">Feet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-layers"
                    checked={options.preserveLayers}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, preserveLayers: checked })
                    }
                  />
                  <Label htmlFor="preserve-layers">
                    Preserve SVG groups as DXF layers
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleConvert}
                disabled={!file || converting}
                className="w-full"
              >
                {converting ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-spin" />
                    Converting... {progress}%
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Convert to DXF
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="version">DXF Version</Label>
                  <Select
                    value={options.version}
                    onValueChange={(value) => 
                      setOptions({ ...options, version: value })
                    }
                  >
                    <SelectTrigger id="version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC1015">AutoCAD 2000 (AC1015)</SelectItem>
                      <SelectItem value="AC1018">AutoCAD 2004 (AC1018)</SelectItem>
                      <SelectItem value="AC1021">AutoCAD 2007 (AC1021)</SelectItem>
                      <SelectItem value="AC1024">AutoCAD 2010 (AC1024)</SelectItem>
                      <SelectItem value="AC1027">AutoCAD 2013 (AC1027)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose the DXF version based on your CAD software compatibility
                  </p>
                </div>

                <div>
                  <Label htmlFor="precision">Coordinate Precision</Label>
                  <Select
                    value={options.precision?.toString()}
                    onValueChange={(value) => 
                      setOptions({ ...options, precision: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="precision">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 decimal places</SelectItem>
                      <SelectItem value="4">4 decimal places</SelectItem>
                      <SelectItem value="6">6 decimal places (default)</SelectItem>
                      <SelectItem value="8">8 decimal places</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Higher precision may increase file size
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About DXF Format</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            DXF (Drawing Exchange Format) is a CAD data file format developed by Autodesk 
            for enabling data interoperability between AutoCAD and other programs.
          </p>
          <h4>Supported SVG Elements:</h4>
          <ul>
            <li><code>&lt;line&gt;</code> → LINE entity</li>
            <li><code>&lt;circle&gt;</code> → CIRCLE entity</li>
            <li><code>&lt;rect&gt;</code> → POLYLINE entity (closed)</li>
            <li><code>&lt;polyline&gt;</code> → POLYLINE entity</li>
            <li><code>&lt;polygon&gt;</code> → POLYLINE entity (closed)</li>
            <li><code>&lt;path&gt;</code> → POLYLINE entity (approximated)</li>
            <li><code>&lt;ellipse&gt;</code> → ELLIPSE or POLYLINE approximation</li>
            <li><code>&lt;text&gt;</code> → TEXT entity</li>
          </ul>
          <p className="text-sm text-gray-600">
            Complex paths and curves are converted to polylines for maximum compatibility.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}