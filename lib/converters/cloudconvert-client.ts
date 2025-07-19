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
    // Debug environment variables
    console.log('[CloudConvert] Environment check:', {
      hasCloudConvertKey: !!process.env.CLOUDCONVERT_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      keyLength: process.env.CLOUDCONVERT_API_KEY?.length || 0
    })
    
    this.apiKey = apiKey || process.env.CLOUDCONVERT_API_KEY || ''
    if (!this.apiKey) {
      console.error('[CloudConvert] Available environment variables:', Object.keys(process.env).filter(key => key.includes('CLOUD')))
      throw new Error('CloudConvert API key not found in environment variables')
    }
    
    console.log('[CloudConvert] Client initialized with API key length:', this.apiKey.length)
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
      console.log('[CloudConvert] convertFile called with:', {
        bufferLength: inputBuffer?.length,
        fromFormat,
        toFormat,
        filename,
        hasOptions: !!options
      })

      // Report initial progress
      options.onProgress?.(0.1)

      // Step 1: Upload file
      console.log('[CloudConvert] Starting upload...')
      const uploadUrl = await this.uploadFile(inputBuffer, filename)
      console.log('[CloudConvert] Upload completed, task ID:', uploadUrl)
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
      options.onProgress?.(0.7)

      // Step 4: Create export task to get download URL
      console.log('[CloudConvert] Creating export task...')
      const exportTaskId = await this.createExportTask(taskId)
      options.onProgress?.(0.8)

      // Step 5: Wait for export to complete
      const exportTask = await this.waitForCompletion(exportTaskId, options)
      options.onProgress?.(0.9)

      // Step 6: Download result
      if (!exportTask.result?.files?.[0]?.url) {
        throw new ConversionError('No download URL generated', 'NO_DOWNLOAD_URL')
      }

      const outputBuffer = await this.downloadFile(exportTask.result.files[0].url)
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
    console.log('[CloudConvert] Starting file upload...')
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/import/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeout)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[CloudConvert] Upload initialization failed:', response.status, errorText)
        throw new Error(`Upload initialization failed: ${response.statusText} - ${errorText}`)
      }

      const uploadData = await response.json()
      console.log('[CloudConvert] Upload initialization successful, uploading file...')
      
      if (!uploadData?.data?.result?.form?.url) {
        console.error('[CloudConvert] Invalid upload response structure:', uploadData)
        throw new Error('Invalid upload response from CloudConvert')
      }
      
      const uploadUrl = uploadData.data.result.form.url
      const formData = new FormData()

      // Add form fields if they exist
      if (uploadData.data.result.form.parameters) {
        // CloudConvert uses specific S3 parameters for upload
        const params = uploadData.data.result.form.parameters
        
        // Important: Add parameters in the correct order
        if (params.acl) formData.append('acl', params.acl)
        if (params.key) {
          // Replace ${filename} placeholder with actual filename
          formData.append('key', params.key.replace('${filename}', filename))
        }
        if (params.success_action_status) formData.append('success_action_status', params.success_action_status)
        if (params['X-Amz-Credential']) formData.append('X-Amz-Credential', params['X-Amz-Credential'])
        if (params['X-Amz-Algorithm']) formData.append('X-Amz-Algorithm', params['X-Amz-Algorithm'])
        if (params['X-Amz-Date']) formData.append('X-Amz-Date', params['X-Amz-Date'])
        if (params.Policy) formData.append('Policy', params.Policy)
        if (params['X-Amz-Signature']) formData.append('X-Amz-Signature', params['X-Amz-Signature'])
      }

      // Add file - MUST be last in the form data
      formData.append('file', new Blob([buffer], { type: 'application/octet-stream' }), filename)

      // Upload file with timeout
      const uploadController = new AbortController()
      const uploadTimeout = setTimeout(() => uploadController.abort(), 20000) // 20 second timeout
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: uploadController.signal
      })
      
      clearTimeout(uploadTimeout)

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('[CloudConvert] File upload failed:', uploadResponse.status, errorText)
        throw new Error(`File upload failed: ${uploadResponse.statusText} - ${errorText}`)
      }

      console.log('[CloudConvert] File upload completed successfully')
      return uploadData.data.id
      
    } catch (error) {
      clearTimeout(timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('CloudConvert upload timeout')
      }
      throw error
    }
  }

  /**
   * Create conversion task
   */
  private async createConversionTask(
    inputTaskId: string,
    fromFormat: string,
    toFormat: string,
    options: CloudConvertOptions & any
  ): Promise<string> {
    console.log(`[CloudConvert] Creating conversion task: ${fromFormat} → ${toFormat}`)
    
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

    // Add video-specific options
    if (['mp4', 'webm', 'gif'].includes(toFormat)) {
      // Video codec
      if (options.video_codec) {
        convertOptions.video_codec = options.video_codec
      }
      
      // Frame rate
      if (options.fps) {
        convertOptions.fps = options.fps
      }
      
      // Video bitrate
      if (options.video_bitrate) {
        convertOptions.video_bitrate = options.video_bitrate
      }
      
      // Audio codec (for disabling audio)
      if (options.audio_codec) {
        convertOptions.audio_codec = options.audio_codec
      }
      
      // Duration (if specified)
      if (options.duration) {
        convertOptions.duration = options.duration
      }
      
      // GIF-specific options
      if (toFormat === 'gif') {
        if (options.optimize !== undefined) {
          convertOptions.optimize = options.optimize
        }
        if (options.delay) {
          convertOptions.delay = options.delay
        }
      }
    }

    console.log('[CloudConvert] Conversion options:', convertOptions)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/convert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(convertOptions),
        signal: controller.signal
      })
      
      clearTimeout(timeout)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[CloudConvert] Conversion task creation failed:', response.status, errorText)
        throw new Error(`Conversion task creation failed: ${response.statusText} - ${errorText}`)
      }

      const taskData = await response.json()
      console.log('[CloudConvert] Conversion task created:', taskData.data.id)
      return taskData.data.id
      
    } catch (error) {
      clearTimeout(timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('CloudConvert task creation timeout')
      }
      throw error
    }
  }

  /**
   * Create export task to get download URL
   */
  private async createExportTask(inputTaskId: string): Promise<string> {
    console.log(`[CloudConvert] Creating export task for: ${inputTaskId}`)
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/export/url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: inputTaskId,
          inline: false,
          archive_multiple_files: false
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeout)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[CloudConvert] Export task creation failed:', response.status, errorText)
        throw new Error(`Export task creation failed: ${response.statusText} - ${errorText}`)
      }

      const exportData = await response.json()
      console.log('[CloudConvert] Export task created:', exportData.data.id)
      return exportData.data.id
      
    } catch (error) {
      clearTimeout(timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('CloudConvert export task creation timeout')
      }
      throw error
    }
  }

  /**
   * Wait for task completion
   */
  private async waitForCompletion(
    taskId: string,
    options: CloudConvertOptions,
    timeout = 60000 // Increased to 60 seconds
  ): Promise<CloudConvertTask> {
    console.log(`[CloudConvert] Waiting for task completion: ${taskId}`)
    const startTime = Date.now()
    let progressReported = 0.4

    while (Date.now() - startTime < timeout) {
      const controller = new AbortController()
      const requestTimeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout per request
      
      try {
        const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          signal: controller.signal
        })
        
        clearTimeout(requestTimeout)

        if (!response.ok) {
          console.warn(`[CloudConvert] Status check failed: ${response.statusText}, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }

        const taskData = await response.json()
        const task: CloudConvertTask = taskData.data

        console.log(`[CloudConvert] Task status: ${task.status}`)

        // Report progress
        if (task.status === 'processing' && progressReported < 0.8) {
          progressReported = Math.min(0.8, progressReported + 0.1)
          options.onProgress?.(progressReported)
        }

        if (task.status === 'finished') {
          console.log('[CloudConvert] Task completed successfully')
          return task
        }

        if (task.status === 'error') {
          console.error('[CloudConvert] Task failed:', task.message)
          throw new ConversionError(
            `CloudConvert task failed: ${task.message || 'Unknown error'}`,
            'CLOUDCONVERT_TASK_FAILED'
          )
        }

        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        clearTimeout(requestTimeout)
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('[CloudConvert] Status check timeout, retrying...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        if (error instanceof ConversionError) {
          throw error
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.warn('[CloudConvert] Status check error:', errorMessage, 'retrying...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.error('[CloudConvert] Overall task timeout')
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
      'wmf': 'image/x-wmf',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime'
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