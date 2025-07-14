import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse } from '@/lib/error-handler'
import { handleOptionsRequest, handleCors } from '@/lib/converters/api-utils'

// GET handler for converter info
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')
  
  // Return converter API information
  const { response, status } = createSuccessResponse({
    message: 'SVG AI Converter API',
    version: '1.0.0',
    endpoints: {
      converters: {
        'png-to-svg': { method: 'POST', description: 'Convert PNG to SVG' },
        'svg-to-png': { method: 'POST', description: 'Convert SVG to PNG' },
        'jpg-to-svg': { method: 'POST', description: 'Convert JPG to SVG' },
        'svg-to-jpg': { method: 'POST', description: 'Convert SVG to JPG' },
        'svg-to-pdf': { method: 'POST', description: 'Convert SVG to PDF' },
        'webp-to-svg': { method: 'POST', description: 'Convert WebP to SVG' },
        'svg-to-webp': { method: 'POST', description: 'Convert SVG to WebP' },
        'bmp-to-svg': { method: 'POST', description: 'Convert BMP to SVG' },
        'svg-to-ico': { method: 'POST', description: 'Convert SVG to ICO' },
      },
      usage: {
        method: 'POST',
        url: '/api/convert/{converter}',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: {
          file: 'File to convert (required)',
          quality: 'Output quality 1-100 (optional)',
          width: 'Output width in pixels (optional)',
          height: 'Output height in pixels (optional)',
          background: 'Background color in hex format (optional)',
          preserveAspectRatio: 'Preserve aspect ratio (optional)'
        }
      },
      limits: {
        maxFileSize: '10MB',
        rateLimit: '30 requests per minute',
        allowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'pdf', 'ico', 'tiff']
      }
    }
  })

  return NextResponse.json(response, { 
    status,
    headers: handleCors(origin)
  })
}

// Handle OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req)
}