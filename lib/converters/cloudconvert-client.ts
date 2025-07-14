/**
 * CloudConvert API Client
 * 
 * Provides a wrapper around CloudConvert API for file format conversions
 * that cannot be performed client-side efficiently.
 */

import type { ConversionResult, ConversionOptions } from './types'
import { ConversionError } from './errors'

export interface CloudConvertOptions {
  /** Quality setting for lossy formats (1-100) */
  quality?: number
  /** Width for image resizing */
  width?: number
  /** Height for image resizing */
  height?: number
  /** Whether to preserve aspect ratio during resize */
  preserveAspectRatio?: boolean
  /** Background color for formats that don't support transparency */
  background?: string
  /** Progress callback */
  onProgress?: (progress: number) => void
}

interface CloudConvertTask {
  id: string
  status: 'waiting' | 'processing' | 'finished' | 'error'
  result?: {
    files: Array<{
      filename: string
      url: string
      size: number
    }>
  }
  message?: string
}

/**
 * CloudConvert API client for server-side conversions
 */
export class CloudConvertClient {
  private apiKey: string
  private baseUrl = 'https://api.cloudconvert.com/v2'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CLOUDCONVERT_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('CloudConvert API key not found in environment variables')
    }
  }

  /**
   * Convert file using CloudConvert API
   */
  async convertFile(
    inputBuffer: Buffer,
    fromFormat: string,
    toFormat: string,
    filename: string,
    options: CloudConvertOptions = {}
  ): Promise<ConversionResult> {
    try {
      // Report initial progress
      options.onProgress?.(0.1)

      // Step 1: Upload file
      const uploadUrl = await this.uploadFile(inputBuffer, filename)
      options.onProgress?.(0.3)

      // Step 2: Create conversion task
      const taskId = await this.createConversionTask(
        uploadUrl,
        fromFormat,
        toFormat,
        options
      )
      options.onProgress?.(0.4)

      // Step 3: Wait for conversion to complete
      const task = await this.waitForCompletion(taskId, options)
      options.onProgress?.(0.9)

      // Step 4: Download result
      if (!task.result?.files?.[0]) {
        throw new ConversionError('No output file generated', 'NO_OUTPUT_FILE')
      }

      const outputBuffer = await this.downloadFile(task.result.files[0].url)
      options.onProgress?.(1.0)

      // Determine MIME type
      const mimeType = this.getMimeType(toFormat)

      return {
        success: true,
        data: outputBuffer,
        mimeType,
        metadata: {
          size: outputBuffer.length,
          format: toFormat,
          method: 'cloudconvert'
        }
      }

    } catch (error) {
      console.error('CloudConvert conversion failed:', error)
      
      if (error instanceof ConversionError) {
        throw error
      }

      throw new ConversionError(
        `CloudConvert conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLOUDCONVERT_FAILED'
      )
    }
  }

  /**
   * Upload file to CloudConvert
   */
  private async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/import/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename
      })
    })

    if (!response.ok) {
      throw new Error(`Upload initialization failed: ${response.statusText}`)
    }

    const uploadData = await response.json()
    const uploadUrl = uploadData.data.result.form.url
    const formData = new FormData()

    // Add form fields
    Object.entries(uploadData.data.result.form.parameters).forEach(([key, value]) => {
      formData.append(key, value as string)
    })

    // Add file
    formData.append('file', new Blob([buffer]), filename)

    // Upload file
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error(`File upload failed: ${uploadResponse.statusText}`)
    }

    return uploadData.data.id
  }

  /**
   * Create conversion task
   */
  private async createConversionTask(
    inputTaskId: string,
    fromFormat: string,
    toFormat: string,
    options: CloudConvertOptions
  ): Promise<string> {
    const convertOptions: any = {
      input: inputTaskId,
      output_format: toFormat
    }

    // Add format-specific options
    if (options.quality && ['jpg', 'jpeg', 'webp'].includes(toFormat)) {
      convertOptions.quality = options.quality
    }

    if (options.width || options.height) {
      convertOptions.width = options.width
      convertOptions.height = options.height
      convertOptions.fit = options.preserveAspectRatio ? 'max' : 'crop'
    }

    if (options.background && ['jpg', 'jpeg'].includes(toFormat)) {
      convertOptions.background = options.background
    }

    const response = await fetch(`${this.baseUrl}/convert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(convertOptions)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Conversion task creation failed: ${errorText}`)
    }

    const taskData = await response.json()
    return taskData.data.id
  }

  /**
   * Wait for task completion
   */
  private async waitForCompletion(
    taskId: string,
    options: CloudConvertOptions,
    timeout = 30000
  ): Promise<CloudConvertTask> {
    const startTime = Date.now()
    let progressReported = 0.4

    while (Date.now() - startTime < timeout) {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`Task status check failed: ${response.statusText}`)
      }

      const taskData = await response.json()
      const task: CloudConvertTask = taskData.data

      // Report progress
      if (task.status === 'processing' && progressReported < 0.8) {
        progressReported = Math.min(0.8, progressReported + 0.1)
        options.onProgress?.(progressReported)
      }

      if (task.status === 'finished') {
        return task
      }

      if (task.status === 'error') {
        throw new ConversionError(
          `CloudConvert task failed: ${task.message || 'Unknown error'}`,
          'CLOUDCONVERT_TASK_FAILED'
        )
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    throw new ConversionError('CloudConvert task timeout', 'CLOUDCONVERT_TIMEOUT')
  }

  /**
   * Download converted file
   */
  private async downloadFile(url: string): Promise<Buffer> {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`File download failed: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Get MIME type for format
   */
  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      'webp': 'image/webp',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'emf': 'image/x-emf',
      'wmf': 'image/x-wmf'
    }

    return mimeTypes[format.toLowerCase()] || 'application/octet-stream'
  }
}

/**
 * Singleton CloudConvert client instance
 */
let cloudConvertClient: CloudConvertClient | null = null

/**
 * Get CloudConvert client instance
 */
export function getCloudConvertClient(): CloudConvertClient {
  if (!cloudConvertClient) {
    cloudConvertClient = new CloudConvertClient()
  }
  return cloudConvertClient
}

/**
 * Quick conversion helper
 */
export async function convertWithCloudConvert(
  buffer: Buffer,
  fromFormat: string,
  toFormat: string,
  filename: string,
  options: CloudConvertOptions = {}
): Promise<ConversionResult> {
  const client = getCloudConvertClient()
  return client.convertFile(buffer, fromFormat, toFormat, filename, options)
}