/**
 * Client-Side Converter Wrapper
 * 
 * Provides a unified interface for all client-side image conversions with
 * file validation, progress tracking, preview generation, batch processing,
 * and memory management capabilities.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('client-converter')
import type {
  ImageFormat,
  ConversionOptions,
  ConversionResult,
  FileValidationResult,
  Converter
} from './types'
import {
  FileValidationError,
  FileSizeError,
  ConversionError,
  handleConverterError,
  ConverterResponse,
  createConverterSuccessResponse
} from './errors'
import {
  validateFile,
  getOutputFilename,
  getMimeTypeFromFormat,
  detectFileTypeFromBuffer
} from './validation'

/**
 * Conversion progress data
 */
export interface ConversionProgress {
  current: number
  total: number
  percentage: number
  currentFile?: string
  status: 'idle' | 'validating' | 'converting' | 'generating-preview' | 'complete' | 'error'
}

/**
 * Batch conversion result
 */
export interface BatchConversionResult {
  successful: ConversionOutput[]
  failed: Array<{ file: string; error: string }>
  totalProcessed: number
}

/**
 * Conversion output with preview and download data
 */
export interface ConversionOutput {
  filename: string
  data: Blob
  mimeType: string
  size: number
  preview?: string
  metadata?: Record<string, any>
}

/**
 * Client converter configuration
 */
export interface ClientConverterConfig {
  maxFileSize?: number
  allowedFormats?: ImageFormat[]
  generatePreview?: boolean
  batchSizeLimit?: number
  memoryThreshold?: number // MB
  onProgress?: (progress: ConversionProgress) => void
  onMemoryWarning?: (usedMemory: number) => void
}

/**
 * File reader utility with progress tracking
 */
async function readFileAsBuffer(
  file: File,
  onProgress?: (loaded: number, total: number) => void
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(Buffer.from(e.target.result))
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'))
      }
    }
    
    reader.onerror = () => reject(new Error('File reading failed'))
    
    if (onProgress) {
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(e.loaded, e.total)
        }
      }
    }
    
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Generate preview URL for converted image
 */
async function generatePreview(
  blob: Blob,
  format: ImageFormat
): Promise<string | undefined> {
  // Skip preview for non-image formats
  if (format === 'pdf' || format === 'ico') {
    return undefined
  }
  
  return URL.createObjectURL(blob)
}

/**
 * Memory usage estimation
 */
function estimateMemoryUsage(files: File[]): number {
  return files.reduce((total, file) => total + file.size, 0) / (1024 * 1024)
}

/**
 * Download file utility
 */
export function downloadFile(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Client-side converter class
 */
export class ClientConverter {
  private config: Required<ClientConverterConfig>
  private converters: Map<string, Converter> = new Map()
  private memoryUsage: number = 0

  constructor(config: ClientConverterConfig = {}) {
    this.config = {
      maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB default
      allowedFormats: config.allowedFormats || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'],
      generatePreview: config.generatePreview ?? true,
      batchSizeLimit: config.batchSizeLimit || 10,
      memoryThreshold: config.memoryThreshold || 500, // 500MB default
      onProgress: config.onProgress || (() => {}),
      onMemoryWarning: config.onMemoryWarning || (() => {})
    }
  }

  /**
   * Register a converter
   */
  registerConverter(converter: Converter): void {
    const key = `${converter.from}-${converter.to}`
    this.converters.set(key, converter)
  }

  /**
   * Get converter for format pair
   */
  private getConverter(from: ImageFormat, to: ImageFormat): Converter | null {
    return this.converters.get(`${from}-${to}`) || null
  }

  /**
   * Validate file for conversion
   */
  private validateFileForConversion(
    file: File,
    targetFormat: ImageFormat
  ): FileValidationResult {
    const validation = validateFile(file, {
      allowedFormats: this.config.allowedFormats,
      maxSize: this.config.maxFileSize
    })

    if (!validation.isValid) {
      return validation
    }

    // Check if converter exists
    if (validation.format) {
      const converter = this.getConverter(validation.format, targetFormat)
      if (!converter) {
        return {
          isValid: false,
          error: `No converter available for ${validation.format} to ${targetFormat}`,
          format: validation.format,
          size: validation.size
        }
      }
      
      if (!converter.isClientSide) {
        return {
          isValid: false,
          error: `${validation.format} to ${targetFormat} conversion requires server-side processing`,
          format: validation.format,
          size: validation.size
        }
      }
    }

    return validation
  }

  /**
   * Convert single file
   */
  async convertFile(
    file: File,
    targetFormat: ImageFormat,
    options: ConversionOptions = {}
  ): Promise<ConversionOutput> {
    try {
      // Update progress
      this.config.onProgress({
        current: 0,
        total: 1,
        percentage: 0,
        currentFile: file.name,
        status: 'validating'
      })

      // Validate file
      const validation = this.validateFileForConversion(file, targetFormat)
      if (!validation.isValid || !validation.format) {
        throw new FileValidationError(validation.error || 'Invalid file')
      }

      // Get converter
      const converter = this.getConverter(validation.format, targetFormat)
      if (!converter) {
        throw new ConversionError(`No converter for ${validation.format} to ${targetFormat}`)
      }

      // Update progress
      this.config.onProgress({
        current: 0,
        total: 1,
        percentage: 20,
        currentFile: file.name,
        status: 'converting'
      })

      // Read file
      const buffer = await readFileAsBuffer(file, (loaded, total) => {
        const percentage = 20 + (loaded / total) * 30
        this.config.onProgress({
          current: 0,
          total: 1,
          percentage,
          currentFile: file.name,
          status: 'converting'
        })
      })

      // Check memory
      this.memoryUsage += buffer.length / (1024 * 1024)
      if (this.memoryUsage > this.config.memoryThreshold) {
        this.config.onMemoryWarning(this.memoryUsage)
      }

      // Perform conversion
      const result = await converter.handler(buffer, {
        ...options,
        onProgress: (progress: number) => {
          const percentage = 50 + progress * 40
          this.config.onProgress({
            current: 0,
            total: 1,
            percentage,
            currentFile: file.name,
            status: 'converting'
          })
        }
      })

      if (!result.success || !result.data) {
        throw new ConversionError(result.error || 'Conversion failed')
      }

      // Create blob
      const outputData = typeof result.data === 'string'
        ? new TextEncoder().encode(result.data)
        : result.data as Buffer
      const blob = new Blob([outputData], { type: result.mimeType || getMimeTypeFromFormat(targetFormat) })

      // Generate preview if needed
      let preview: string | undefined
      if (this.config.generatePreview) {
        this.config.onProgress({
          current: 0,
          total: 1,
          percentage: 90,
          currentFile: file.name,
          status: 'generating-preview'
        })
        preview = await generatePreview(blob, targetFormat)
      }

      // Create output
      const output: ConversionOutput = {
        filename: getOutputFilename(file.name, validation.format, targetFormat),
        data: blob,
        mimeType: result.mimeType || getMimeTypeFromFormat(targetFormat),
        size: blob.size,
        preview,
        metadata: result.metadata
      }

      // Update progress
      this.config.onProgress({
        current: 1,
        total: 1,
        percentage: 100,
        currentFile: file.name,
        status: 'complete'
      })

      // Clean up memory tracking
      this.memoryUsage -= buffer.length / (1024 * 1024)

      return output

    } catch (error) {
      this.config.onProgress({
        current: 0,
        total: 1,
        percentage: 0,
        currentFile: file.name,
        status: 'error'
      })
      throw error
    }
  }

  /**
   * Convert multiple files in batch
   */
  async convertBatch(
    files: File[],
    targetFormat: ImageFormat,
    options: ConversionOptions = {}
  ): Promise<BatchConversionResult> {
    const successful: ConversionOutput[] = []
    const failed: Array<{ file: string; error: string }> = []
    
    // Limit batch size
    const filesToProcess = files.slice(0, this.config.batchSizeLimit)
    
    // Check estimated memory usage
    const estimatedMemory = estimateMemoryUsage(filesToProcess)
    if (estimatedMemory > this.config.memoryThreshold) {
      this.config.onMemoryWarning(estimatedMemory)
    }

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i]
      
      try {
        // Update overall progress
        this.config.onProgress({
          current: i,
          total: filesToProcess.length,
          percentage: (i / filesToProcess.length) * 100,
          currentFile: file.name,
          status: 'converting'
        })

        const output = await this.convertFile(file, targetFormat, options)
        successful.push(output)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        failed.push({ file: file.name, error: errorMessage })
      }
    }

    return {
      successful,
      failed,
      totalProcessed: filesToProcess.length
    }
  }

  /**
   * Clean up resources
   */
  cleanup(outputs: ConversionOutput[]): void {
    outputs.forEach(output => {
      if (output.preview) {
        URL.revokeObjectURL(output.preview)
      }
    })
    this.memoryUsage = 0
  }
}

/**
 * React hook for client-side conversion
 */
export function useClientConverter(config: ClientConverterConfig = {}) {
  const [progress, setProgress] = useState<ConversionProgress>({
    current: 0,
    total: 0,
    percentage: 0,
    status: 'idle'
  })
  
  const [outputs, setOutputs] = useState<ConversionOutput[]>([])
  const [errors, setErrors] = useState<Array<{ file: string; error: string }>>([])
  const [isConverting, setIsConverting] = useState(false)
  
  const converterRef = useRef<ClientConverter | null>(null)
  
  // Initialize converter
  useEffect(() => {
    converterRef.current = new ClientConverter({
      ...config,
      onProgress: setProgress,
      onMemoryWarning: (memory) => {
        logger.warn(`High memory usage: ${memory.toFixed(2)}MB`)
        if (config.onMemoryWarning) {
          config.onMemoryWarning(memory)
        }
      }
    })
    
    return () => {
      if (converterRef.current && outputs.length > 0) {
        converterRef.current.cleanup(outputs)
      }
    }
  }, [config, outputs])
  
  // Register converter
  const registerConverter = useCallback((converter: Converter) => {
    converterRef.current?.registerConverter(converter)
  }, [])
  
  // Convert single file
  const convertFile = useCallback(async (
    file: File,
    targetFormat: ImageFormat,
    options: ConversionOptions = {}
  ): Promise<ConversionOutput | null> => {
    if (!converterRef.current) return null
    
    setIsConverting(true)
    setErrors([])
    
    try {
      const output = await converterRef.current.convertFile(file, targetFormat, options)
      setOutputs(prev => [...prev, output])
      return output
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setErrors([{ file: file.name, error: errorMessage }])
      return null
    } finally {
      setIsConverting(false)
    }
  }, [])
  
  // Convert batch
  const convertBatch = useCallback(async (
    files: File[],
    targetFormat: ImageFormat,
    options: ConversionOptions = {}
  ): Promise<BatchConversionResult | null> => {
    if (!converterRef.current) return null
    
    setIsConverting(true)
    setErrors([])
    
    try {
      const result = await converterRef.current.convertBatch(files, targetFormat, options)
      setOutputs(prev => [...prev, ...result.successful])
      setErrors(result.failed)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setErrors(files.map(f => ({ file: f.name, error: errorMessage })))
      return null
    } finally {
      setIsConverting(false)
    }
  }, [])
  
  // Download output
  const download = useCallback((output: ConversionOutput) => {
    downloadFile(output.filename, output.data)
  }, [])
  
  // Download all outputs
  const downloadAll = useCallback(() => {
    outputs.forEach(output => downloadFile(output.filename, output.data))
  }, [outputs])
  
  // Clear outputs and free memory
  const clear = useCallback(() => {
    if (converterRef.current) {
      converterRef.current.cleanup(outputs)
    }
    setOutputs([])
    setErrors([])
    setProgress({
      current: 0,
      total: 0,
      percentage: 0,
      status: 'idle'
    })
  }, [outputs])
  
  return {
    // State
    progress,
    outputs,
    errors,
    isConverting,
    
    // Actions
    registerConverter,
    convertFile,
    convertBatch,
    download,
    downloadAll,
    clear
  }
}

/**
 * File input component props
 */
export interface FileInputProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

/**
 * File input hook for easy file selection
 */
export function useFileInput({ 
  accept, 
  multiple = false, 
  maxSize,
  onFilesSelected,
  disabled = false
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (maxSize) {
      const validFiles = files.filter(file => file.size <= maxSize)
      if (validFiles.length < files.length) {
        logger.warn(`${files.length - validFiles.length} files exceeded size limit`)
      }
      onFilesSelected(validFiles)
    } else {
      onFilesSelected(files)
    }
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [maxSize, onFilesSelected])
  
  const openFileDialog = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }, [disabled])
  
  const FileInputComponent = useCallback(() => (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={handleChange}
      style={{ display: 'none' }}
      disabled={disabled}
    />
  ), [accept, multiple, handleChange, disabled])
  
  return {
    FileInput: FileInputComponent,
    openFileDialog
  }
}

// Export all types and utilities
export type {
  ImageFormat,
  ConversionOptions,
  ConversionResult,
  FileValidationResult,
  Converter,
  ConverterConfig
} from './types'

export {
  FileValidationError,
  FileSizeError,
  ConversionError,
  handleConverterError,
  type ConverterResponse,
  createConverterSuccessResponse
} from './errors'

export {
  validateFile,
  getOutputFilename,
  getMimeTypeFromFormat,
  detectFileTypeFromBuffer
} from './validation'