import { NextRequest, NextResponse } from 'next/server'
import { createConverterHandler, handleOptionsRequest, handleCors } from '@/lib/converters/api-utils'
import { createErrorResponse, notFound } from '@/lib/error-handler'
import { ImageFormat } from '@/lib/converters/types'
import { createLogger } from '@/lib/logger'

// Import converters
import { pngToSvgHandler } from '@/lib/converters/png-to-svg'
import { svgToPngHandler } from '@/lib/converters/svg-to-png'
import { jpgToSvgHandler } from '@/lib/converters/jpg-to-svg'
import { svgToJpgHandler } from '@/lib/converters/svg-to-jpg'
import { svgToPdfHandler } from '@/lib/converters/svg-to-pdf'
import { webpToSvgHandler } from '@/lib/converters/webp-to-svg'
import { svgToWebpHandler } from '@/lib/converters/svg-to-webp'
import { bmpToSvgHandler } from '@/lib/converters/bmp-to-svg'
import { svgToIcoHandler } from '@/lib/converters/svg-to-ico'

const logger = createLogger('converters:api')

// Define converter mappings
const converters: Record<string, {
  from: ImageFormat
  to: ImageFormat
  handler: ReturnType<typeof createConverterHandler>
}> = {
  'png-to-svg': {
    from: 'png',
    to: 'svg',
    handler: createConverterHandler('png', 'svg', pngToSvgHandler)
  },
  'svg-to-png': {
    from: 'svg',
    to: 'png',
    handler: createConverterHandler('svg', 'png', svgToPngHandler)
  },
  'jpg-to-svg': {
    from: 'jpg',
    to: 'svg',
    handler: createConverterHandler('jpg', 'svg', jpgToSvgHandler)
  },
  'jpeg-to-svg': {
    from: 'jpeg',
    to: 'svg',
    handler: createConverterHandler('jpeg', 'svg', jpgToSvgHandler)
  },
  'svg-to-jpg': {
    from: 'svg',
    to: 'jpg',
    handler: createConverterHandler('svg', 'jpg', svgToJpgHandler)
  },
  'svg-to-jpeg': {
    from: 'svg',
    to: 'jpeg',
    handler: createConverterHandler('svg', 'jpeg', svgToJpgHandler)
  },
  'svg-to-pdf': {
    from: 'svg',
    to: 'pdf',
    handler: createConverterHandler('svg', 'pdf', svgToPdfHandler)
  },
  'webp-to-svg': {
    from: 'webp',
    to: 'svg',
    handler: createConverterHandler('webp', 'svg', webpToSvgHandler)
  },
  'svg-to-webp': {
    from: 'svg',
    to: 'webp',
    handler: createConverterHandler('svg', 'webp', svgToWebpHandler)
  },
  'bmp-to-svg': {
    from: 'bmp',
    to: 'svg',
    handler: createConverterHandler('bmp', 'svg', bmpToSvgHandler)
  },
  'svg-to-ico': {
    from: 'svg',
    to: 'ico',
    handler: createConverterHandler('svg', 'ico', svgToIcoHandler)
  }
}

// GET handler for converter info
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ converter: string }> }
) {
  const { converter: converterName } = await params
  const converter = converters[converterName]
  const origin = req.headers.get('origin')

  if (!converter) {
    logger.warn('Converter not found', { converter: converterName })
    return notFound('Converter not found')
  }

  const response = NextResponse.json({
    converter: converterName,
    from: converter.from,
    to: converter.to,
    endpoint: `/api/convert/${converterName}`,
    method: 'POST',
    contentType: 'multipart/form-data',
    parameters: {
      file: {
        type: 'file',
        required: true,
        description: `${converter.from.toUpperCase()} file to convert`
      },
      quality: {
        type: 'number',
        required: false,
        description: 'Output quality (1-100)',
        default: 85
      },
      width: {
        type: 'number',
        required: false,
        description: 'Output width in pixels'
      },
      height: {
        type: 'number',
        required: false,
        description: 'Output height in pixels'
      },
      background: {
        type: 'string',
        required: false,
        description: 'Background color in hex format (e.g., #ffffff)'
      },
      preserveAspectRatio: {
        type: 'boolean',
        required: false,
        description: 'Preserve aspect ratio when resizing',
        default: true
      }
    }
  })

  return NextResponse.json(response, { 
    status: Number(status),
    headers: handleCors(origin)
  })
}

// POST handler for conversion
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ converter: string }> }
) {
  const { converter: converterName } = await params
  const converter = converters[converterName]

  if (!converter) {
    logger.warn('Converter not found', { converter: converterName })
    return notFound('Converter not found')
  }

  logger.info('Processing conversion request', { converter: converterName })
  
  // Delegate to the specific converter handler
  return converter.handler(req)
}

// Handle OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req)
}