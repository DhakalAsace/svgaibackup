export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp' | 'bmp' | 'svg' | 'pdf' | 'ico' | 'tiff' | 'eps' | 'ai' | 'dxf' | 'stl' | 'avif' | 'cdr' | 'mp4' | 'html' | 'ttf' | 'emf' | 'wmf' | 'heic'

export interface ConversionOptions {
  quality?: number
  width?: number
  height?: number
  background?: string
  format?: ImageFormat
  preserveAspectRatio?: boolean
  onProgress?: (progress: number) => void
  dpi?: number
  page?: number
  [key: string]: any // Allow additional options
}

export interface ConversionResult {
  success: boolean
  data?: Buffer | string
  mimeType?: string
  error?: string
  warning?: string
  metadata?: {
    width?: number
    height?: number
    format?: string
    size?: number
    premiumFeature?: boolean
    upgradeUrl?: string
    embedMethod?: string
    fallback?: boolean
    fallbackReason?: string
    originalFormat?: string
    [key: string]: any
  }
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
  format?: ImageFormat
  size?: number
}

export interface ConverterConfig {
  maxFileSize: number
  allowedFormats: string[]
  outputQuality: number
  potraceThreshold: number
}

export type ConversionHandler = (
  input: Buffer | string,
  options: ConversionOptions
) => Promise<ConversionResult>

export interface Converter {
  name: string
  from: ImageFormat
  to: ImageFormat
  handler: ConversionHandler
  isClientSide: boolean
  description?: string
  isPremium?: boolean
}