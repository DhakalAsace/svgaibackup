"use client"

import React, { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Upload, Download, FileIcon, AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConverterProgressBar } from "./converter-progress-bar"
import { useConverterProgress } from "@/hooks/use-converter-progress"

export interface ConverterOptions {
  quality?: number
  width?: number
  height?: number
  maintainAspectRatio?: boolean
  backgroundColor?: string
  [key: string]: any
}

export interface ConversionResult {
  blob: Blob
  url: string
  filename: string
  size: number
}

export interface ConverterUIProps {
  // Basic configuration
  fromFormat: string
  toFormat: string
  acceptedFormats: string[]
  maxFileSize?: number // in MB
  
  // Conversion function with progress reporting
  onConvert: (
    file: File, 
    options: ConverterOptions, 
    reportProgress?: (progress: number) => void
  ) => Promise<ConversionResult>
  
  // Options configuration
  showQualitySlider?: boolean
  showDimensionInputs?: boolean
  showAdvancedOptions?: boolean
  customOptions?: React.ReactNode
  defaultOptions?: ConverterOptions
  
  // UI customization
  className?: string
  uploadAreaClassName?: string
  previewClassName?: string
}

export default function ConverterUI({
  fromFormat,
  toFormat,
  acceptedFormats,
  maxFileSize = 100,
  onConvert,
  showQualitySlider = false,
  showDimensionInputs = false,
  showAdvancedOptions = false,
  customOptions,
  defaultOptions = {},
  className,
  uploadAreaClassName,
  previewClassName
}: ConverterUIProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [options, setOptions] = useState<ConverterOptions>(defaultOptions)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Use the progress hook
  const progressState = useConverterProgress()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    setError(null)
    setResult(null)
    
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!acceptedFormats.includes(`.${fileExtension}`)) {
      setError(`Please upload a valid ${fromFormat.toUpperCase()} file`)
      return
    }
    
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      setError(`File size must be less than ${maxFileSize}MB`)
      return
    }
    
    setFile(file)
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [acceptedFormats, fromFormat, maxFileSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  const handleConvert = async () => {
    if (!file) return
    
    setConverting(true)
    setError(null)
    progressState.startProgress(file.size)
    
    try {
      const result = await onConvert(file, options, progressState.reportProgress)
      
      progressState.completeProgress()
      setResult(result)
      setConverting(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Conversion failed'
      setError(errorMessage)
      progressState.setError(errorMessage)
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    
    const a = document.createElement('a')
    a.href = result.url
    a.download = result.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    progressState.resetProgress()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateOption = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <Card>
        <CardContent className="p-6">
          {/* Upload Area */}
          {!file && (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-gray-300",
                uploadAreaClassName
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your {fromFormat.toUpperCase()} file here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse from your computer
                </p>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Supports {acceptedFormats.join(', ')} up to {maxFileSize}MB
                </p>
              </label>
            </div>
          )}

          {/* File Preview & Options */}
          {file && !result && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={converting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className={cn("bg-gray-50 rounded-lg p-4", previewClassName)}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded"
                  />
                </div>
              )}

              {/* Conversion Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Conversion Options</h3>
                
                {/* Format Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from-format">From</Label>
                    <Select value={fromFormat} disabled>
                      <SelectTrigger id="from-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={fromFormat}>{fromFormat.toUpperCase()}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="to-format">To</Label>
                    <Select value={toFormat} disabled>
                      <SelectTrigger id="to-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={toFormat}>{toFormat.toUpperCase()}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quality Slider */}
                {showQualitySlider && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Quality</Label>
                      <span className="text-sm text-gray-500">{options.quality || 90}%</span>
                    </div>
                    <Slider
                      value={[options.quality || 90]}
                      onValueChange={(value) => updateOption('quality', value[0])}
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                )}

                {/* Dimension Inputs */}
                {showDimensionInputs && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width (px)</Label>
                        <input
                          type="number"
                          id="width"
                          value={options.width || ''}
                          onChange={(e) => updateOption('width', parseInt(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Auto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (px)</Label>
                        <input
                          type="number"
                          id="height"
                          value={options.height || ''}
                          onChange={(e) => updateOption('height', parseInt(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Auto"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="aspect-ratio"
                        checked={options.maintainAspectRatio !== false}
                        onCheckedChange={(checked) => updateOption('maintainAspectRatio', checked)}
                      />
                      <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                    </div>
                  </div>
                )}

                {/* Custom Options */}
                {customOptions}
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={converting}
                className="w-full"
                size="lg"
              >
                {converting ? 'Converting...' : `Convert to ${toFormat.toUpperCase()}`}
              </Button>

              {/* Progress Bar */}
              <ConverterProgressBar
                progress={progressState.progress}
                status={progressState.status}
                isVisible={progressState.isVisible}
                estimatedTime={progressState.estimatedTime}
                error={progressState.error}
              />
            </div>
          )}

          {/* Conversion Result */}
          {result && (
            <div className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Conversion successful! Your file is ready to download.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.filename}</p>
                    <p className="text-sm text-gray-500">
                      {(result.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download {toFormat.toUpperCase()}
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Convert Another File
                </Button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}