/**
 * Client-side converter wrapper
 * 
 * This module provides a client-safe way to access converters,
 * ensuring that server-side dependencies like 'sharp' are never
 * loaded in the browser environment.
 */

import type { ImageFormat, ConversionHandler, ConversionResult, ConversionOptions } from './types'

// Map of converters that will be loaded dynamically
const converterMap: Map<string, ConversionHandler> = new Map()

/**
 * Get converter key from formats
 */
function getConverterKey(from: ImageFormat, to: ImageFormat): string {
  return `${from}-to-${to}`
}

/**
 * Dynamically load a converter for client-side use
 */
async function loadConverter(from: ImageFormat, to: ImageFormat): Promise<ConversionHandler | null> {
  const key = getConverterKey(from, to)
  
  // Check if already loaded
  if (converterMap.has(key)) {
    return converterMap.get(key)!
  }
  
  try {
    // Dynamically import the specific converter
    switch (key) {
      case 'png-to-svg':
        const { pngToSvgHandler } = await import('./png-to-svg')
        converterMap.set(key, pngToSvgHandler)
        return pngToSvgHandler
        
      case 'svg-to-png':
        const { svgToPngHandler } = await import('./svg-to-png')
        converterMap.set(key, svgToPngHandler)
        return svgToPngHandler
        
      case 'jpg-to-svg':
      case 'jpeg-to-svg':
        const { jpgToSvgHandler } = await import('./jpg-to-svg')
        converterMap.set(key, jpgToSvgHandler)
        return jpgToSvgHandler
        
      case 'svg-to-jpg':
      case 'svg-to-jpeg':
        const { svgToJpgHandler } = await import('./svg-to-jpg')
        converterMap.set(key, svgToJpgHandler)
        return svgToJpgHandler
        
      case 'webp-to-svg':
        const { webpToSvgHandler } = await import('./webp-to-svg')
        converterMap.set(key, webpToSvgHandler)
        return webpToSvgHandler
        
      case 'svg-to-webp':
        const { svgToWebpHandler } = await import('./svg-to-webp')
        converterMap.set(key, svgToWebpHandler)
        return svgToWebpHandler
        
      case 'gif-to-svg':
        const { gifToSvgHandler } = await import('./gif-to-svg')
        converterMap.set(key, gifToSvgHandler)
        return gifToSvgHandler
        
      case 'svg-to-gif':
        try {
          const { svgToGifHandler } = await import('./svg-to-gif-client')
          converterMap.set(key, svgToGifHandler)
          return svgToGifHandler
        } catch (svgGifError) {
          throw svgGifError
        }
        
      case 'bmp-to-svg':
        const { bmpToSvgHandler } = await import('./bmp-to-svg')
        converterMap.set(key, bmpToSvgHandler)
        return bmpToSvgHandler
        
      case 'svg-to-bmp':
        const { svgToBmpHandler } = await import('./svg-to-bmp')
        converterMap.set(key, svgToBmpHandler)
        return svgToBmpHandler
        
      case 'pdf-to-svg':
        const { pdfToSvgHandler } = await import('./pdf-to-svg')
        converterMap.set(key, pdfToSvgHandler)
        return pdfToSvgHandler
        
      case 'svg-to-pdf':
        const { svgToPdfHandler } = await import('./svg-to-pdf')
        converterMap.set(key, svgToPdfHandler)
        return svgToPdfHandler
        
      case 'ico-to-svg':
        const { icoToSvgHandler } = await import('./ico-to-svg')
        converterMap.set(key, icoToSvgHandler)
        return icoToSvgHandler
        
      case 'svg-to-ico':
        const { svgToIcoHandler } = await import('./svg-to-ico')
        converterMap.set(key, svgToIcoHandler)
        return svgToIcoHandler
        
      case 'tiff-to-svg':
        const { tiffToSvgHandler } = await import('./tiff-to-svg')
        converterMap.set(key, tiffToSvgHandler)
        return tiffToSvgHandler
        
      case 'svg-to-tiff':
        const { svgToTiffHandler } = await import('./svg-to-tiff')
        converterMap.set(key, svgToTiffHandler)
        return svgToTiffHandler
        
      case 'image-to-svg':
        const { imageToSvgHandler } = await import('./image-to-svg')
        converterMap.set(key, imageToSvgHandler)
        return imageToSvgHandler
        
      case 'svg-optimizer':
        const { svgOptimizerHandler } = await import('./svg-optimizer')
        converterMap.set(key, svgOptimizerHandler)
        return svgOptimizerHandler
        
      case 'svg-to-base64':
        const { svgToBase64Handler } = await import('./svg-to-base64')
        converterMap.set(key, svgToBase64Handler)
        return svgToBase64Handler
        
      case 'eps-to-svg':
        const { epsToSvgHandler } = await import('./eps-to-svg')
        converterMap.set(key, epsToSvgHandler)
        return epsToSvgHandler
        
      case 'ai-to-svg':
        try {
          const { aiToSvgHandler } = await import('./ai-to-svg-client')
          converterMap.set(key, aiToSvgHandler)
          return aiToSvgHandler
        } catch (aiError) {
          throw aiError
        }
        
      case 'dxf-to-svg':
        const { dxfToSvgHandler } = await import('./dxf-to-svg')
        converterMap.set(key, dxfToSvgHandler)
        return dxfToSvgHandler
        
      case 'stl-to-svg':
        const { stlToSvgHandler } = await import('./stl-to-svg')
        converterMap.set(key, stlToSvgHandler)
        return stlToSvgHandler
        
      case 'svg-to-avif':
        const { svgToAvifHandler } = await import('./svg-to-avif')
        converterMap.set(key, svgToAvifHandler)
        return svgToAvifHandler
        
      case 'cdr-to-svg':
        const { cdrToSvgHandler } = await import('./cdr-to-svg')
        converterMap.set(key, cdrToSvgHandler)
        return cdrToSvgHandler
        
      case 'svg-to-dxf':
        const { svgToDxfHandler } = await import('./svg-to-dxf')
        converterMap.set(key, svgToDxfHandler)
        return svgToDxfHandler
        
      case 'svg-to-stl':
        const { svgToStlHandler } = await import('./svg-to-stl')
        converterMap.set(key, svgToStlHandler)
        return svgToStlHandler
        
      case 'svg-to-eps':
        const { svgToEpsHandler } = await import('./svg-to-eps')
        converterMap.set(key, svgToEpsHandler)
        return svgToEpsHandler
        
      case 'svg-to-mp4':
        const { svgToMp4Handler } = await import('./svg-to-mp4')
        converterMap.set(key, svgToMp4Handler)
        return svgToMp4Handler
        
      case 'html-to-svg':
        const { htmlToSvgHandler } = await import('./html-to-svg')
        converterMap.set(key, htmlToSvgHandler)
        return htmlToSvgHandler
        
      case 'avif-to-svg':
        try {
          const { avifToSvgHandler } = await import('./avif-to-svg-client')
          converterMap.set(key, avifToSvgHandler)
          return avifToSvgHandler
        } catch (avifError) {
          throw avifError
        }
        
      case 'ttf-to-svg':
        const { ttfToSvgHandler } = await import('./ttf-to-svg')
        converterMap.set(key, ttfToSvgHandler)
        return ttfToSvgHandler
        
      case 'svg-to-html':
        const { svgToHtmlHandler } = await import('./svg-to-html')
        converterMap.set(key, svgToHtmlHandler)
        return svgToHtmlHandler
        
      case 'svg-to-emf':
        try {
          const { svgToEmfHandler } = await import('./svg-to-emf-client')
          converterMap.set(key, svgToEmfHandler)
          return svgToEmfHandler
        } catch (svgEmfError) {
          throw svgEmfError
        }
        
      case 'svg-to-ai':
        const { svgToAiHandler } = await import('./svg-to-ai')
        converterMap.set(key, svgToAiHandler)
        return svgToAiHandler
        
      case 'wmf-to-svg':
        try {
          const { wmfToSvgHandler } = await import('./wmf-to-svg-client')
          converterMap.set(key, wmfToSvgHandler)
          return wmfToSvgHandler
        } catch (wmfError) {
          throw wmfError
        }
        
      case 'svg-to-wmf':
        try {
          const { svgToWmfHandler } = await import('./svg-to-wmf-client')
          converterMap.set(key, svgToWmfHandler)
          return svgToWmfHandler
        } catch (svgWmfError) {
          throw svgWmfError
        }
        
      case 'emf-to-svg':
        try {
          const { emfToSvgHandler } = await import('./emf-to-svg-client')
          converterMap.set(key, emfToSvgHandler)
          return emfToSvgHandler
        } catch (emfError) {
          throw emfError
        }
        
      default:
        return null
    }
  } catch (error) {
    // Return a more helpful error handler that includes the actual error
    return async (input: string | Buffer, options: ConversionOptions = {}) => {
      return {
        success: false,
        error: `Failed to load converter: ${error instanceof Error ? error.message : 'Unknown error'}`,
        mimeType: '',
        data: Buffer.from('')
      }
    }
  }
}

/**
 * Client-safe converter getter
 */
export async function getClientConverter(
  from: ImageFormat, 
  to: ImageFormat
): Promise<{ handler: ConversionHandler; name: string } | null> {
  const handler = await loadConverter(from, to)
  
  if (!handler) {
    return null
  }
  
  return {
    handler,
    name: `${from.toUpperCase()} to ${to.toUpperCase()}`
  }
}

/**
 * Convert a file using client-safe converter
 */
export async function convertFileClient(
  file: File | Buffer,
  from: ImageFormat,
  to: ImageFormat,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const converter = await getClientConverter(from, to)
  
  if (!converter) {
    return {
      success: false,
      error: `No converter available for ${from} to ${to}`,
      mimeType: '',
      data: Buffer.from('')
    }
  }
  
  try {
    // If file is a File object, convert to Buffer
    let buffer: Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      buffer = file
    }
    
    return await converter.handler(buffer, options)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
      mimeType: '',
      data: Buffer.from('')
    }
  }
}