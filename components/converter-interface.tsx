"use client"

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Download, 
  FileIcon, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Settings2,
  Info,
  HelpCircle,
  Star,
  Sparkles,
  Eye,
  Share2,
  Zap,
  Clock,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useConversionTracking } from "@/hooks/use-conversion-tracking"
import type { 
  ConversionOptions,
  ConversionResult as ConverterResult,
  ImageFormat,
  ConversionHandler
} from "@/lib/converters/types"
import { getMimeTypeFromFormat } from "@/lib/converters/validation"
import { getClientConverter } from "@/lib/converters/client-wrapper"
import type { PublicConverterConfig } from "@/app/convert/public-converter-config"

interface ConversionResult {
  blob: Blob
  url: string
  filename: string
  size: number
}

interface ConverterInterfaceProps {
  config: PublicConverterConfig
  className?: string
  onConversionComplete?: (result: ConversionResult) => void
}

export default function ConverterInterface({
  config,
  className,
  onConversionComplete
}: ConverterInterfaceProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [options, setOptions] = useState<ConversionOptions>({
    quality: 90,
    maintainAspectRatio: true
  })
  const [dragActive, setDragActive] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [conversionTip, setConversionTip] = useState<string>("")
  const [showHelpTooltip, setShowHelpTooltip] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    trackFileSelected,
    trackConversionStarted,
    trackConversionCompleted,
    trackDownload,
    trackError
  } = useConversionTracking()

  // Converter will be loaded dynamically when needed
  const [converter, setConverter] = useState<{ handler: ConversionHandler; name: string } | null>(null)
  const [converterLoading, setConverterLoading] = useState(false)
  
  // Load converter when component mounts or formats change
  useEffect(() => {
    let mounted = true
    
    async function loadConverter() {
      setConverterLoading(true)
      try {
        const conv = await getClientConverter(
          config.fromFormat.toLowerCase() as ImageFormat,
          config.toFormat.toLowerCase() as ImageFormat
        )
        if (mounted) {
          setConverter(conv)
        }
      } catch (error) {
        console.error('Failed to load converter:', error)
        if (mounted) {
          setConverter(null)
        }
      } finally {
        if (mounted) {
          setConverterLoading(false)
        }
      }
    }
    
    loadConverter()
    
    return () => {
      mounted = false
    }
  }, [config.fromFormat, config.toFormat])

  // Determine accepted file formats
  const acceptedFormats = useMemo(() => {
    if (config.fromFormat === 'Multiple' || config.fromFormat === 'Image') {
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg']
    } else if (config.fromFormat === 'AI' || config.fromFormat === 'ai') {
      // AI files can be detected as PDF, so accept both .ai and .pdf
      return ['.ai', '.pdf']
    } else {
      return [`.${config.fromFormat.toLowerCase()}`, config.fromFormat === 'JPG' ? '.jpeg' : null].filter(Boolean) as string[]
    }
  }, [config.fromFormat])

  const maxFileSize = 100 // MB

  // Conversion tips for progress feedback
  const conversionTips = [
    `Converting ${config.fromFormat} to ${config.toFormat} with professional quality...`,
    "Optimizing for web performance and compatibility...",
    "Preserving quality while reducing file size...",
    "Applying advanced vectorization algorithms...",
    "Processing with industry-standard conversion tools..."
  ]

  // Format information for tooltips
  const formatInfo = {
    PNG: "Portable Network Graphics - Best for images with transparency",
    SVG: "Scalable Vector Graphics - Perfect for logos and icons",
    JPG: "JPEG format - Ideal for photographs and complex images",
    PDF: "Portable Document Format - Universal document standard",
    WebP: "Modern web format - Superior compression",
    GIF: "Graphics Interchange Format - Supports animation",
    BMP: "Bitmap format - Uncompressed raster graphics",
    AI: "Adobe Illustrator format - Professional vector graphics files"
  }

  // Premium features that could be highlighted
  const premiumFeatures = [
    "Batch conversion of multiple files",
    "Advanced quality settings",
    "Custom watermark removal",
    "Priority processing speed",
    "Extended file size limits (500MB+)"
  ]

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
    console.log('[ConverterInterface] handleFile called')
    console.log('[ConverterInterface] File:', file.name, file.type, file.size)
    console.log('[ConverterInterface] Config fromFormat:', config.fromFormat)
    console.log('[ConverterInterface] Accepted formats:', acceptedFormats)
    
    setError(null)
    setResult(null)
    
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    console.log('[ConverterInterface] File extension:', fileExtension)
    
    let isValidFormat = acceptedFormats.some(format => 
      format.toLowerCase() === `.${fileExtension}`
    )
    console.log('[ConverterInterface] Initial format check:', isValidFormat)
    
    // Special case for AI files: if this is an AI converter and the file has .pdf extension,
    // check if it might be an AI file based on the content or original name
    if (!isValidFormat && (config.fromFormat === 'AI' || config.fromFormat === 'ai') && fileExtension === 'pdf') {
      // Allow PDF files for AI converter since AI files are often PDF-based
      isValidFormat = true
      console.log('[ConverterInterface] Allowing PDF for AI converter')
    }
    
    // Also allow .ai files if this is an AI converter but the extension check failed
    if (!isValidFormat && (config.fromFormat === 'AI' || config.fromFormat === 'ai') && fileExtension === 'ai') {
      isValidFormat = true
      console.log('[ConverterInterface] Allowing AI file for AI converter')
    }
    
    if (!isValidFormat) {
      console.log('[ConverterInterface] Format validation failed')
      if (config.fromFormat === 'AI' || config.fromFormat === 'ai') {
        setError(`Please upload a valid Adobe Illustrator (.ai) file or PDF file that was created by Illustrator`)
      } else {
        setError(`Please upload a valid ${config.fromFormat} file`)
      }
      return
    }
    
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      setError(`File size must be less than ${maxFileSize}MB`)
      return
    }
    
    setFile(file)
    trackFileSelected(file)
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [acceptedFormats, config.fromFormat, trackFileSelected])

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
    if (!file || !converter) return
    
    console.log('[ConverterInterface] handleConvert called')
    console.log('[ConverterInterface] File:', file.name)
    console.log('[ConverterInterface] Converter:', converter.name)
    
    setConverting(true)
    setError(null)
    setProgress(0)
    setConversionTip(conversionTips[0])
    trackConversionStarted()
    
    const startTime = Date.now()
    
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      console.log('[ConverterInterface] Buffer created, size:', buffer.length)
      
      // Prepare conversion options
      const conversionOptions: ConversionOptions = {
        ...options,
        onProgress: (p) => {
          const progressPercent = Math.round(p * 100)
          setProgress(progressPercent)
          
          // Cycle through conversion tips based on progress
          const tipIndex = Math.min(Math.floor(p * conversionTips.length), conversionTips.length - 1)
          setConversionTip(conversionTips[tipIndex])
        }
      }
      
      console.log('[ConverterInterface] Calling converter.handler...')
      console.log('[ConverterInterface] Converter handler type:', typeof converter.handler)
      
      // Perform conversion
      let result: ConverterResult
      try {
        result = await converter.handler(buffer, conversionOptions)
        console.log('[ConverterInterface] Conversion result:', {
          success: result.success,
          error: result.error,
          dataLength: result.data?.length,
          mimeType: result.mimeType
        })
      } catch (handlerError) {
        console.error('[ConverterInterface] Handler threw error:', handlerError)
        console.error('[ConverterInterface] Handler error stack:', handlerError instanceof Error ? handlerError.stack : 'No stack')
        throw handlerError
      }
      
      if (!result.success || !result.data) {
        console.error('[ConverterInterface] Conversion failed with result:', result)
        throw new Error(result.error || 'Conversion failed')
      }
      
      // Create blob from result
      const outputMimeType = getMimeTypeFromFormat(config.toFormat.toLowerCase() as ImageFormat)
      const blob = result.data instanceof Buffer
        ? new Blob([result.data], { type: outputMimeType })
        : new Blob([result.data], { type: outputMimeType })
      
      const url = URL.createObjectURL(blob)
      const outputFilename = file.name.replace(/\.[^/.]+$/, `.${config.toFormat.toLowerCase()}`)
      
      const conversionResult: ConversionResult = {
        blob,
        url,
        filename: outputFilename,
        size: blob.size
      }
      
      setResult(conversionResult)
      setProgress(100)
      
      const conversionTime = Date.now() - startTime
      trackConversionCompleted(true, blob.size, conversionTime)
      
      // Show upsell after 3 seconds for certain file types or sizes
      if (blob.size > 5 * 1024 * 1024 || conversionTime > 3000) { // 5MB+ or 3s+ conversion
        setTimeout(() => setShowUpsell(true), 3000)
      }
      
      if (onConversionComplete) {
        onConversionComplete(conversionResult)
      }
    } catch (err) {
      console.error('[ConverterInterface] Conversion error:', err)
      console.error('[ConverterInterface] Error stack:', err instanceof Error ? err.stack : 'No stack')
      const errorMessage = err instanceof Error ? err.message : 'Conversion failed'
      setError(errorMessage)
      trackError(errorMessage, { file: file.name })
      trackConversionCompleted(false)
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    
    trackDownload()
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
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateOption = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      if (result?.url && result.url.startsWith('blob:')) {
        URL.revokeObjectURL(result.url)
      }
    }
  }, [previewUrl, result])

  if (converterLoading) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading converter...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!converter) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardContent className="p-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This converter is not yet available. Please check back soon!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <Card className="shadow-xl">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Format Information Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {config.fromFormat}
                </Badge>
                <span className="text-sm text-gray-400">→</span>
                <Badge variant="outline" className="text-xs">
                  {config.toFormat}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p><strong>{config.fromFormat}:</strong> {formatInfo[config.fromFormat as keyof typeof formatInfo] || "File format"}</p>
                    <p className="mt-1"><strong>{config.toFormat}:</strong> {formatInfo[config.toFormat as keyof typeof formatInfo] || "Target format"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>100% Private • Client-side Processing</span>
              </div>
            </div>

            {/* Upload Area */}
            {!file && (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 sm:p-8 lg:p-12 text-center transition-all duration-300",
                  dragActive 
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-lg" 
                    : "border-gray-300 dark:border-gray-600",
                  "hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 relative overflow-hidden"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {/* Animated background effect */}
                {dragActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-shimmer" />
                )}
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer relative z-10">
                <Upload className={cn(
                  "mx-auto h-12 sm:h-16 w-12 sm:w-16 mb-4 transition-all duration-300",
                  dragActive ? "text-primary scale-110" : "text-gray-400"
                )} />
                <p className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {dragActive ? 'Drop your file now!' : `Drop your ${config.fromFormat} file here`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse from your computer
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select {config.fromFormat} File
                </Button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>Supports {acceptedFormats.join(', ')}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Max: {maxFileSize}MB</span>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Instant conversion</span>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* File Preview & Options */}
          {file && !result && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded"
                  />
                </div>
              )}

              {/* Conversion Options */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <Settings2 className="h-4 w-4" />
                  Conversion Options
                  <span className="text-xs text-gray-500">
                    {showOptions ? '(hide)' : '(show)'}
                  </span>
                </button>
                
                {showOptions && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {/* Quality Slider (for formats that support it) */}
                    {['jpg', 'jpeg', 'webp'].includes(config.toFormat.toLowerCase()) && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Quality</Label>
                          <span className="text-sm text-gray-500">{options.quality}%</span>
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width">Width (px)</Label>
                          <Input
                            type="number"
                            id="width"
                            value={options.width || ''}
                            onChange={(e) => updateOption('width', parseInt(e.target.value) || undefined)}
                            placeholder="Auto"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height (px)</Label>
                          <Input
                            type="number"
                            id="height"
                            value={options.height || ''}
                            onChange={(e) => updateOption('height', parseInt(e.target.value) || undefined)}
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

                    {/* Background Color (for formats that support it) */}
                    {['jpg', 'jpeg', 'bmp'].includes(config.toFormat.toLowerCase()) && (
                      <div>
                        <Label htmlFor="background">Background Color</Label>
                        <Input
                          type="color"
                          id="background"
                          value={options.background || '#FFFFFF'}
                          onChange={(e) => updateOption('background', e.target.value)}
                          className="h-10 w-20"
                        />
                      </div>
                    )}

                    {/* Additional format-specific options */}
                    {config.fromFormat.toLowerCase() === 'png' && config.toFormat.toLowerCase() === 'svg' && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label>Threshold</Label>
                            <span className="text-sm text-gray-500">{options.threshold || 128}</span>
                          </div>
                          <Slider
                            value={[options.threshold || 128]}
                            onValueChange={(value) => updateOption('threshold', value[0])}
                            min={0}
                            max={255}
                            step={1}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Adjust for better black/white conversion
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={converting}
                className="w-full"
                size="lg"
              >
                {converting ? 'Converting...' : `Convert to ${config.toFormat}`}
              </Button>

              {/* Enhanced Progress Bar */}
              {converting && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Converting...</span>
                      <span className="text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full h-2" />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="animate-spin">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                          {conversionTip}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                          Professional quality conversion • All processing happens locally
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Conversion Result */}
          {result && (
            <div className="space-y-6">
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  🎉 Conversion successful! Your file is ready to download.
                </AlertDescription>
              </Alert>

              {/* Enhanced File Info */}
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <FileIcon className="h-8 w-8 text-gray-400" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.filename}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{(result.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{config.toFormat} format</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </div>

                {/* Preview Option for supported formats */}
                {['SVG', 'PNG', 'JPG', 'WebP'].includes(config.toFormat) && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <Eye className="h-3 w-3" />
                    <button 
                      onClick={() => setShowPreview(!showPreview)}
                      className="hover:text-primary transition-colors"
                    >
                      {showPreview ? 'Hide preview' : 'Preview converted file'}
                    </button>
                  </div>
                )}

                {/* File Preview */}
                {showPreview && ['SVG', 'PNG', 'JPG', 'WebP'].includes(config.toFormat) && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded border">
                    <img
                      src={result.url}
                      alt="Converted file preview"
                      className="max-w-full max-h-40 mx-auto rounded"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={handleDownload} 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white" 
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {config.toFormat}
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg">
                  Convert Another File
                </Button>
              </div>

              {/* Success Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Pro Tip
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Use your converted {config.toFormat} file in any project. No attribution required!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Share2 className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                      Share the Tool
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Found this useful? Bookmark or share with your team!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Upsell */}
          {showUpsell && (
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Need More Power?
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Upgrade to our premium tools for advanced features like batch conversion, video export, and AI-powered SVG generation.
                  </p>
                  <div className="space-y-2 mb-4">
                    {premiumFeatures.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-3 w-3 text-orange-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                      onClick={() => window.open('/pricing', '_blank')}
                    >
                      <Zap className="mr-2 h-3 w-3" />
                      View Premium
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowUpsell(false)}
                      className="text-gray-500"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpsell(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
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
    </TooltipProvider>
  )
}