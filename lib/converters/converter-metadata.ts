/**
 * Converter Metadata
 * 
 * This file exports metadata about which converters use CloudConvert API
 * vs client-side processing. This helps identify which converters require
 * API routes and server-side processing.
 */

export interface ConverterMetadata {
  /** Whether the converter runs entirely client-side */
  isClientSide: boolean
  /** Whether the converter uses CloudConvert API */
  useCloudConvert: boolean
  /** API endpoint for CloudConvert converters */
  apiEndpoint?: string
  /** Brief description of the converter */
  description: string
  /** Processing method details */
  method: 'client' | 'cloudconvert' | 'hybrid'
  /** Libraries or APIs used */
  dependencies?: string[]
}

export const converterMetadata: Record<string, ConverterMetadata> = {
  // CloudConvert-based converters (require API routes)
  'png-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/png-to-svg',
    description: 'Convert PNG to SVG using CloudConvert for high-quality vectorization',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'jpg-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/jpg-to-svg',
    description: 'Convert JPG/JPEG to SVG using CloudConvert for accurate tracing',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'pdf-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/pdf-to-svg',
    description: 'Convert PDF to SVG using CloudConvert, preserving vector elements',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'ai-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert Adobe Illustrator (AI) files to SVG using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'emf-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert Enhanced Metafile (EMF) to SVG using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'wmf-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert Windows Metafile (WMF) to SVG using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'svg-to-emf': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert SVG to Enhanced Metafile (EMF) using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'svg-to-wmf': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert SVG to Windows Metafile (WMF) using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'svg-to-ai': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert SVG to Adobe Illustrator (AI) format using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'avif-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert AVIF to SVG using CloudConvert for modern image format support',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'webp-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert WebP to SVG using CloudConvert for vectorization',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'bmp-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/[converter]',
    description: 'Convert BMP to SVG using CloudConvert for bitmap vectorization',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },
  'svg-to-gif': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/svg-to-gif',
    description: 'Convert SVG images to GIF format using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  },

  // Client-side converters (run entirely in browser)
  'svg-to-png': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to PNG using Canvas API in browser',
    method: 'client',
    dependencies: ['canvas-api']
  },
  'svg-to-jpg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to JPG/JPEG using Canvas API with quality control',
    method: 'client',
    dependencies: ['canvas-api']
  },
  'svg-to-webp': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to WebP using Canvas API (browser support required)',
    method: 'client',
    dependencies: ['canvas-api']
  },
  'svg-to-ico': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to ICO favicon format using Canvas API',
    method: 'client',
    dependencies: ['canvas-api']
  },
  'svg-to-base64': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to Base64 data URI for inline embedding',
    method: 'client',
    dependencies: []
  },
  'svg-to-pdf': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to PDF using jsPDF library in browser',
    method: 'client',
    dependencies: ['jspdf', 'svg2pdf.js']
  },
  'svg-to-html': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to HTML code with proper formatting',
    method: 'client',
    dependencies: []
  },
  'svg-to-bmp': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to BMP bitmap format using Canvas API',
    method: 'client',
    dependencies: ['canvas-api', 'bmp-js']
  },
  'svg-to-tiff': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to TIFF format using UTIF.js library',
    method: 'client',
    dependencies: ['canvas-api', 'utif']
  },
  'ico-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert ICO to SVG by extracting largest icon image',
    method: 'client',
    dependencies: ['ico-to-png']
  },
  'gif-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert GIF to SVG using Canvas API and potrace',
    method: 'client',
    dependencies: ['gif.js', 'potrace']
  },
  'tiff-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert TIFF to SVG using UTIF.js and potrace',
    method: 'client',
    dependencies: ['utif', 'potrace']
  },

  // Complex client-side converters
  'dxf-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert DXF CAD files to SVG using dxf-parser',
    method: 'client',
    dependencies: ['dxf-parser']
  },
  'svg-to-dxf': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to DXF CAD format using custom parser',
    method: 'client',
    dependencies: []
  },
  'stl-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert 3D STL files to 2D SVG projections',
    method: 'client',
    dependencies: []
  },
  'svg-to-stl': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert 2D SVG to 3D STL by extrusion',
    method: 'client',
    dependencies: []
  },
  'eps-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert EPS to SVG using PDF.js for PostScript parsing',
    method: 'client',
    dependencies: ['pdfjs-dist']
  },
  'svg-to-eps': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert SVG to EPS PostScript format',
    method: 'client',
    dependencies: []
  },
  'ttf-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert TTF font glyphs to SVG paths using opentype.js',
    method: 'client',
    dependencies: ['opentype.js']
  },
  'html-to-svg': {
    isClientSide: true,
    useCloudConvert: false,
    description: 'Convert HTML to SVG using html2canvas and Canvas API',
    method: 'client',
    dependencies: ['html2canvas']
  },

  // Special converters
  'svg-to-mp4': {
    isClientSide: false,
    useCloudConvert: true,
    apiEndpoint: '/api/convert/svg-to-video',
    description: 'Convert SVG animations to MP4 video (premium feature)',
    method: 'hybrid',
    dependencies: ['ffmpeg', 'puppeteer']
  },
  'cdr-to-svg': {
    isClientSide: false,
    useCloudConvert: true,
    description: 'Convert CorelDRAW (CDR) files to SVG using CloudConvert',
    method: 'cloudconvert',
    dependencies: ['cloudconvert-api']
  }
}

/**
 * Helper function to get all CloudConvert-based converters
 */
export function getCloudConvertConverters(): string[] {
  return Object.entries(converterMetadata)
    .filter(([_, metadata]) => metadata.useCloudConvert)
    .map(([id]) => id)
}

/**
 * Helper function to get all client-side converters
 */
export function getClientSideConverters(): string[] {
  return Object.entries(converterMetadata)
    .filter(([_, metadata]) => metadata.isClientSide)
    .map(([id]) => id)
}

/**
 * Helper function to check if a converter requires an API route
 */
export function requiresApiRoute(converterId: string): boolean {
  const metadata = converterMetadata[converterId]
  return metadata ? !metadata.isClientSide : false
}

/**
 * Helper function to get converter dependencies
 */
export function getConverterDependencies(converterId: string): string[] {
  const metadata = converterMetadata[converterId]
  return metadata?.dependencies || []
}

/**
 * Export summary statistics
 */
export const converterStats = {
  total: Object.keys(converterMetadata).length,
  clientSide: getClientSideConverters().length,
  cloudConvert: getCloudConvertConverters().length,
  hybrid: Object.values(converterMetadata).filter(m => m.method === 'hybrid').length
}