import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse } from '@/lib/error-handler'
import { convertWithCloudConvert } from '@/lib/converters/cloudconvert-client'
import { validateFile } from '@/lib/converters/validation'
import { createLogger } from '@/lib/logger'

const logger = createLogger('pdf-to-svg-api')

export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const pageNumber = Number(formData.get('page')) || 1
    
    if (!file) {
      const { response, status } = createErrorResponse('No file provided', 400)
      return NextResponse.json(response, { status })
    }

    // Validate the PDF file
    const validation = validateFile(file, {
      allowedFormats: ['pdf'],
      maxSize: 100 * 1024 * 1024 // 100MB
    })

    if (!validation.isValid) {
      const { response, status } = createErrorResponse(validation.error || 'Invalid file', 400)
      return NextResponse.json(response, { status })
    }

    logger.info('Converting PDF to SVG', {
      filename: file.name,
      size: file.size,
      page: pageNumber
    })

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use CloudConvert for PDF to SVG conversion
    const result = await convertWithCloudConvert(
      buffer,
      'pdf',
      'svg',
      file.name,
      {
        onProgress: (progress) => {
          logger.info(`Conversion progress: ${Math.round(progress * 100)}%`)
        }
      }
    )

    if (!result.success) {
      const { response, status } = createErrorResponse(result.error || 'Conversion failed', 500)
      return NextResponse.json(response, { status })
    }

    // Return the SVG result
    const svgContent = result.data instanceof Buffer ? result.data.toString('utf8') : result.data as string
    
    const { response, status } = createSuccessResponse({
      data: svgContent,
      mimeType: 'image/svg+xml',
      filename: file.name.replace(/\.pdf$/i, '.svg'),
      size: Buffer.byteLength(svgContent, 'utf8')
    })

    return NextResponse.json(response, { status })

  } catch (error) {
    logger.error('PDF to SVG conversion failed', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const { response, status } = createErrorResponse(`Conversion failed: ${errorMessage}`, 500)
    
    return NextResponse.json(response, { status })
  }
}

export async function GET(req: NextRequest) {
  const { response, status } = createSuccessResponse({
    message: 'PDF to SVG Converter API',
    method: 'POST',
    contentType: 'multipart/form-data',
    parameters: {
      file: {
        type: 'file',
        required: true,
        description: 'PDF file to convert to SVG'
      },
      page: {
        type: 'number',
        required: false,
        description: 'Page number to convert (default: 1)',
        default: 1
      }
    },
    description: 'Convert PDF pages to SVG using CloudConvert API with high fidelity vector conversion'
  })

  return NextResponse.json(response, { status })
}