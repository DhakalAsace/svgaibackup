// INTERNAL USE ONLY - Contains search volume data for performance optimization
// For user-facing components, use PublicConverterConfig from public-converter-config.ts
export interface ConverterConfig {
  id: string
  urlSlug: string
  fromFormat: string
  toFormat: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  searchVolume: number
  priority: 'high' | 'medium' | 'low'
  routeType: 'convert' | 'generate' | 'learn'
  isSupported: boolean
}

// Complete list of 37 converters with SEO metadata
export const converterConfigs: ConverterConfig[] = [
  // High priority converters (>10k searches)
  {
    id: 'png-to-svg',
    urlSlug: 'png-to-svg',
    fromFormat: 'PNG',
    toFormat: 'SVG',
    title: 'PNG to SVG Converter',
    metaTitle: 'PNG to SVG Converter - Free Online Vectorization Tool',
    metaDescription: 'Convert PNG to SVG instantly with our free online vectorizer. Transform raster images into scalable vectors with AI-powered tracing. No signup, unlimited use.',
    keywords: ['png to svg', 'convert png to svg', 'png to svg converter', 'free png to svg', 'png to svg online', 'turn png into svg', 'png to vector converter', 'png to svg without losing quality', 'best png to svg converter', 'png svg converter online', 'convert png to svg free', 'no signup png to svg', 'png vectorizer online', 'raster to vector converter', 'image tracing tool', 'png to scalable graphics'],
    searchVolume: 40500,
    priority: 'high',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-png',
    urlSlug: 'svg-to-png',
    fromFormat: 'SVG',
    toFormat: 'PNG',
    title: 'SVG to PNG Converter',
    metaTitle: 'SVG to PNG Converter - Export Vector Graphics as Images',
    metaDescription: 'Convert SVG to PNG with custom dimensions & DPI settings. Free online tool preserves transparency & quality. Perfect for web, print & social media exports.',
    keywords: ['svg to png', 'convert svg to png', 'turn svg into png', 'svg to png converter', 'svg png converter', 'convert svg png online', 'free svg to png', 'svg to png online', 'svg to raster converter', 'svg png conversion tool', 'export svg as png', 'svg to png high quality', 'svg to image converter', 'vector to raster online', 'svg export tool', 'scalable to pixel converter'],
    searchVolume: 33100,
    priority: 'high',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-converter',
    urlSlug: 'svg-converter',
    fromFormat: 'Multiple',
    toFormat: 'SVG',
    title: 'SVG Converter',
    metaTitle: 'Universal SVG Converter - Any Format to Vector Graphics',
    metaDescription: 'Convert any image to SVG format instantly. Supports PNG, JPG, GIF, WebP & more. Free online vectorization with AI-powered tracing. No registration needed.',
    keywords: ['svg converter', 'convert to svg', 'free svg converter', 'online svg converter', 'best svg converter', 'universal svg converter', 'multi format to svg', 'image to svg converter', 'convert any file to svg', 'svg conversion tool', 'all formats to svg', 'vector converter online', 'bulk svg converter', 'automatic vectorization', 'image vectorizer free', 'convert multiple formats svg'],
    searchVolume: 33100,
    priority: 'high',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'jpg-to-svg',
    urlSlug: 'jpg-to-svg',
    fromFormat: 'JPG',
    toFormat: 'SVG',
    title: 'JPG to SVG Converter',
    metaTitle: 'JPG to SVG Converter - Transform Photos to Vectors Free',
    metaDescription: 'Convert JPG/JPEG to SVG vectors with intelligent edge detection. Free online tool for logos, illustrations & graphics. High-quality tracing, instant results.',
    keywords: ['jpg to svg', 'convert jpg to svg', 'jpg to svg converter', 'jpeg to vector', 'jpg svg converter online', 'free jpg to svg', 'jpg to svg online', 'jpeg to svg converter', 'jpg to vector converter', 'photo to svg converter', 'image to vector online', 'jpg vectorization tool', 'jpeg vectorizer free', 'photo tracing tool', 'jpg to scalable vector', 'convert photo to svg art'],
    searchVolume: 12100,
    priority: 'high',
    routeType: 'convert',
    isSupported: true
  },

  // Medium priority converters (1k-10k searches)
  {
    id: 'image-to-svg',
    urlSlug: 'image-to-svg',
    fromFormat: 'Image',
    toFormat: 'SVG',
    title: 'Image to SVG Converter',
    metaTitle: 'Image to SVG Converter - Vectorize Any Photo or Picture',
    metaDescription: 'Convert images to SVG vectors instantly. Supports PNG, JPG, GIF, WebP, BMP & more. Free AI-powered vectorization with customizable settings. No watermarks.',
    keywords: ['convert image to svg', 'image to svg', 'photo to svg', 'picture to vector', 'image vectorization', 'bitmap to svg', 'raster to vector', 'any image to svg', 'free image to svg', 'online image converter', 'image to svg online', 'vectorize image online', 'photo vectorizer tool', 'picture to scalable graphics', 'automatic image tracing', 'convert any picture svg'],
    searchVolume: 8100,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-jpg',
    urlSlug: 'svg-to-jpg',
    fromFormat: 'SVG',
    toFormat: 'JPG',
    title: 'SVG to JPG Converter',
    metaTitle: 'SVG to JPG Converter - Export Vectors as JPEG Images',
    metaDescription: 'Convert SVG to JPG with adjustable quality & compression. Free tool for web optimization, social media & email. White or custom background colors available.',
    keywords: ['svg to jpg', 'convert svg to jpg', 'svg to jpeg', 'svg jpg converter', 'export svg as jpg', 'svg to photo', 'vector to jpg', 'svg jpg conversion', 'free svg to jpg', 'svg to image converter', 'svg rasterization', 'svg to jpg online', 'svg to jpeg quality', 'vector graphics to photo', 'svg compression tool', 'scalable to jpeg format'],
    searchVolume: 5400,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'jpeg-to-svg',
    urlSlug: 'jpeg-to-svg',
    fromFormat: 'JPEG',
    toFormat: 'SVG',
    title: 'JPEG to SVG Converter',
    metaTitle: 'JPEG to SVG Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert JPEG images to SVG vector format. Free online conversion with high-quality results.',
    keywords: ['jpeg to svg', 'jpeg to svg converter', 'jpeg to vector', 'jpeg vectorization', 'photo to svg', 'convert jpeg to svg', 'free jpeg to svg', 'jpeg svg converter', 'jpeg to svg online', 'image to vector converter', 'jpeg tracing tool', 'vectorize jpeg online'],
    searchVolume: 4400,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-pdf',
    urlSlug: 'svg-to-pdf',
    fromFormat: 'SVG',
    toFormat: 'PDF',
    title: 'SVG to PDF Converter',
    metaTitle: 'SVG to PDF Converter - Create Print-Ready Documents',
    metaDescription: 'Convert SVG to PDF while preserving vector quality. Perfect for printing, archiving & sharing. Free online tool with custom page sizes & orientation options.',
    keywords: ['svg to pdf', 'convert svg to pdf', 'svg pdf converter', 'export svg as pdf', 'svg to pdf online', 'vector to pdf', 'svg pdf conversion', 'free svg to pdf', 'svg to document', 'svg pdf export', 'print svg as pdf', 'svg to pdf converter', 'svg document creator', 'vector to printable pdf', 'svg archiving tool', 'scalable graphics pdf export'],
    searchVolume: 2900,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'eps-to-svg',
    urlSlug: 'eps-to-svg',
    fromFormat: 'EPS',
    toFormat: 'SVG',
    title: 'EPS to SVG Converter',
    metaTitle: 'EPS to SVG Converter - PostScript to Web Graphics',
    metaDescription: 'Convert EPS to SVG while preserving vector paths & colors. Free tool for designers converting Illustrator files to web-ready formats. Instant processing.',
    keywords: ['eps to svg', 'eps to svg converter', 'convert eps to svg', 'eps vector converter', 'postscript to svg', 'eps svg conversion', 'free eps to svg', 'eps to svg online', 'illustrator eps to svg', 'eps file converter', 'vector format converter', 'eps svg online tool', 'encapsulated postscript converter', 'adobe eps to svg', 'eps to web format', 'convert eps files online'],
    searchVolume: 2400,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-dxf',
    urlSlug: 'svg-to-dxf',
    fromFormat: 'SVG',
    toFormat: 'DXF',
    title: 'SVG to DXF Converter',
    metaTitle: 'SVG to DXF Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert SVG files to DXF format for CAD applications. Free online conversion tool.',
    keywords: ['svg to dxf', 'svg to dxf converter', 'convert svg to dxf', 'svg dxf conversion', 'vector to cad', 'svg autocad converter', 'free svg to dxf', 'svg to cad format', 'web to cad converter', 'svg dxf export', 'vector to autocad', 'svg drawing converter'],
    searchVolume: 2400,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-stl',
    urlSlug: 'svg-to-stl',
    fromFormat: 'SVG',
    toFormat: 'STL',
    title: 'SVG to STL Converter',
    metaTitle: 'SVG to STL Converter - Free 3D Conversion | SVG AI',
    metaDescription: 'Convert SVG files to STL format for 3D printing. Free online conversion tool.',
    keywords: ['svg to stl', 'svg to stl converter', 'convert svg to stl', 'svg 3d printing', 'vector to 3d model', 'svg stl conversion', 'free svg to stl', 'svg to 3d printer', '2d to 3d converter', 'svg extrusion tool', 'vector to stl file', 'svg 3d export'],
    searchVolume: 1600,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'webp-to-svg',
    urlSlug: 'webp-to-svg',
    fromFormat: 'WebP',
    toFormat: 'SVG',
    title: 'WebP to SVG Converter',
    metaTitle: 'WebP to SVG Converter - Modern Image Vectorization',
    metaDescription: 'Convert WebP to SVG vectors for infinite scalability. Free tool optimized for logos, icons & graphics. AI-powered tracing preserves quality perfectly.',
    keywords: ['webp to svg', 'convert webp to svg', 'webp to svg converter', 'webp image to vector', 'webp to scalable vector', 'transform webp to svg', 'webp vectorization tool', 'convert webp online', 'webp to svg free', 'modern image converter', 'next-gen format converter', 'webp to vector graphics', 'google webp converter', 'webp vectorizer online', 'webp to svg no watermark', 'convert webp files free'],
    searchVolume: 1300,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-ico',
    urlSlug: 'svg-to-ico',
    fromFormat: 'SVG',
    toFormat: 'ICO',
    title: 'SVG to ICO Converter',
    metaTitle: 'SVG to ICO Converter - Create Favicons & App Icons',
    metaDescription: 'Convert SVG to ICO with multiple sizes (16x16 to 256x256). Perfect for website favicons, Windows icons & app shortcuts. Free tool with transparency support.',
    keywords: ['svg to ico', 'svg to ico converter', 'convert svg to ico', 'svg favicon converter', 'svg to icon', 'svg ico conversion', 'free svg to ico', 'svg to windows icon', 'vector to icon', 'favicon generator svg', 'svg icon converter', 'svg to ico online', 'svg to favicon free', 'create ico from svg', 'svg to multi-size ico', 'website icon generator'],
    searchVolume: 1300,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-webp',
    urlSlug: 'svg-to-webp',
    fromFormat: 'SVG',
    toFormat: 'WebP',
    title: 'SVG to WebP Converter',
    metaTitle: 'SVG to WebP Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert SVG files to WebP format for modern web optimization. Free and fast conversion.',
    keywords: ['svg to webp', 'svg to webp converter', 'convert svg to webp', 'svg webp conversion', 'vector to webp', 'svg to modern format', 'free svg to webp', 'svg web optimization', 'svg to next gen format', 'webp converter svg', 'svg to webp online', 'optimize svg to webp'],
    searchVolume: 1300,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'ai-to-svg',
    urlSlug: 'ai-to-svg',
    fromFormat: 'AI',
    toFormat: 'SVG',
    title: 'AI to SVG Converter',
    metaTitle: 'AI to SVG Converter - Adobe Illustrator to SVG | SVG AI',
    metaDescription: 'Convert Adobe Illustrator AI files to SVG format online. Preserve vector quality. Free tool.',
    keywords: ['ai to svg', 'ai to svg converter', 'adobe illustrator to svg', 'convert ai to svg', 'illustrator svg export', 'ai file to svg', 'free ai to svg', 'ai svg conversion', 'vector ai to svg', 'illustrator to web format', 'ai to svg online', 'convert illustrator file'],
    searchVolume: 1000,
    priority: 'medium',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-ai',
    urlSlug: 'svg-to-ai',
    fromFormat: 'SVG',
    toFormat: 'AI',
    title: 'SVG to AI Converter',
    metaTitle: 'SVG to AI Converter - SVG to Adobe Illustrator | SVG AI',
    metaDescription: 'Convert SVG files to Adobe Illustrator AI format online. Create AI-compatible files with metadata. Free tool.',
    keywords: ['svg to ai', 'svg to adobe illustrator', 'svg to ai converter', 'convert svg to ai', 'svg illustrator export', 'svg to ai file', 'web to illustrator', 'free svg to ai', 'svg ai conversion', 'vector to illustrator', 'svg to ai online', 'import svg to illustrator'],
    searchVolume: 720,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },

  // Low priority converters (<1k searches)
  {
    id: 'pdf-to-svg',
    urlSlug: 'pdf-to-svg',
    fromFormat: 'PDF',
    toFormat: 'SVG',
    title: 'PDF to SVG Converter',
    metaTitle: 'PDF to SVG Converter - Extract Vector Graphics Free',
    metaDescription: 'Convert PDF to SVG & extract vector graphics from documents. Perfect for logos, diagrams & illustrations. Preserves text as paths. Free unlimited tool.',
    keywords: ['pdf to svg', 'convert pdf to svg', 'pdf to svg converter', 'pdf document to vector', 'pdf to scalable vector', 'extract svg from pdf', 'pdf vectorization tool', 'convert pdf online', 'pdf to svg free', 'document converter', 'pdf graphics extractor', 'pdf to vector graphics', 'pdf logo extractor', 'pdf diagram to svg', 'acrobat to svg', 'pdf vector extraction tool'],
    searchVolume: 880,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'dxf-to-svg',
    urlSlug: 'dxf-to-svg',
    fromFormat: 'DXF',
    toFormat: 'SVG',
    title: 'DXF to SVG Converter',
    metaTitle: 'DXF to SVG Converter - CAD to Web Format | SVG AI',
    metaDescription: 'Convert DXF CAD files to SVG format online. Perfect for web display of CAD drawings.',
    keywords: ['dxf to svg', 'dxf to svg converter', 'convert dxf to svg', 'cad to svg', 'dxf vector converter', 'autocad to svg', 'cad to web format', 'free dxf to svg', 'dxf svg conversion', 'dwg to svg', 'cad drawing converter', 'engineering to svg'],
    searchVolume: 880,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-eps',
    urlSlug: 'svg-to-eps',
    fromFormat: 'SVG',
    toFormat: 'EPS',
    title: 'SVG to EPS Converter',
    metaTitle: 'SVG to EPS Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert SVG files to EPS format for print and design work. Free online conversion.',
    keywords: ['svg to eps', 'svg to eps converter', 'convert svg to eps', 'svg postscript export', 'vector to eps', 'svg to print format', 'free svg to eps', 'svg eps conversion', 'web to postscript', 'svg print preparation', 'vector to postscript', 'svg eps online'],
    searchVolume: 720,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'stl-to-svg',
    urlSlug: 'stl-to-svg',
    fromFormat: 'STL',
    toFormat: 'SVG',
    title: 'STL to SVG Converter',
    metaTitle: 'STL to SVG Converter - 3D to 2D | SVG AI',
    metaDescription: 'Convert STL 3D files to SVG 2D format. Create flat projections from 3D models.',
    keywords: ['stl to svg', 'stl to svg converter', 'convert stl to svg', '3d to 2d converter', 'stl to vector', '3d model to svg', 'stl svg conversion', 'free stl to svg', '3d print to svg', 'stl flattening tool', 'mesh to vector', 'stl projection svg'],
    searchVolume: 590,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  
  {
    id: 'html-to-svg',
    urlSlug: 'html-to-svg',
    fromFormat: 'HTML',
    toFormat: 'SVG',
    title: 'HTML to SVG Converter',
    metaTitle: 'HTML to SVG Online Converter | SVG AI',
    metaDescription: 'Convert HTML content to SVG format online. Useful for creating visual representations of web content.',
    keywords: ['html online to svg', 'html to svg converter', 'convert html to svg', 'web page to svg', 'html content to vector', 'dom to svg', 'html svg conversion', 'free html to svg', 'webpage to svg', 'html element to svg', 'html to svg online', 'capture html as svg'],
    searchVolume: 480,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'avif-to-svg',
    urlSlug: 'avif-to-svg',
    fromFormat: 'AVIF',
    toFormat: 'SVG',
    title: 'AVIF to SVG Converter',
    metaTitle: 'AVIF to SVG Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert AVIF images to SVG format online. Modern image format conversion made easy.',
    keywords: ['avif to svg'],
    searchVolume: 390,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'ttf-to-svg',
    urlSlug: 'ttf-to-svg',
    fromFormat: 'TTF',
    toFormat: 'SVG',
    title: 'TTF to SVG Converter',
    metaTitle: 'TTF to SVG Font Converter - Extract Glyphs as Vectors',
    metaDescription: 'Convert TTF fonts to SVG paths for web typography & logos. Extract individual characters or full fonts. Free tool supports all TrueType font features.',
    keywords: ['ttf to svg', 'ttf to svg converter', 'font to svg', 'convert ttf to svg', 'truetype to svg', 'font glyphs to svg', 'ttf font converter', 'font to vector', 'free ttf to svg', 'extract font paths', 'font to svg paths', 'typography to svg', 'font glyph extractor', 'truetype vectorizer', 'web font converter', 'font to svg online'],
    searchVolume: 390,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },

  // Additional converters to reach 40 total
  {
    id: 'gif-to-svg',
    urlSlug: 'gif-to-svg',
    fromFormat: 'GIF',
    toFormat: 'SVG',
    title: 'GIF to SVG Converter',
    metaTitle: 'GIF to SVG Converter - Animated GIF Vectorization',
    metaDescription: 'Convert GIF to SVG including animations. Free tool extracts frames & creates scalable vectors. Perfect for logos, icons & simple animations. No limits.',
    keywords: ['gif to svg', 'convert gif to svg', 'gif to svg converter', 'animated gif to svg', 'gif animation to vector', 'gif to scalable vector', 'transform gif to svg', 'gif vectorization tool', 'convert gif animation', 'gif to svg online free', 'animated gif converter', 'gif to vector graphics', 'gif frame extraction', 'animated logo converter', 'gif to svg animation', 'vectorize gif online'],
    searchVolume: 320,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-gif',
    urlSlug: 'svg-to-gif',
    fromFormat: 'SVG',
    toFormat: 'GIF',
    title: 'SVG to GIF Converter',
    metaTitle: 'SVG to GIF Converter - Free Online Animation Export | SVG AI',
    metaDescription: 'Convert SVG to GIF instantly in your browser. Free online tool transforms SVG graphics and animations into animated GIF format. No upload required.',
    keywords: ['svg to gif', 'svg to gif converter', 'convert svg to gif', 'svg gif export', 'vector to gif', 'svg gif conversion', 'free svg to gif', 'svg to gif online', 'svg image to gif', 'svg graphics to gif', 'svg file to gif', 'transform svg to gif'],
    searchVolume: 320,
    priority: 'low',
    routeType: 'convert',
    isSupported: true // Uses browser-based gif.js implementation
  },
  {
    id: 'bmp-to-svg',
    urlSlug: 'bmp-to-svg',
    fromFormat: 'BMP',
    toFormat: 'SVG',
    title: 'BMP to SVG Converter',
    metaTitle: 'BMP to SVG Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert BMP bitmap images to SVG vector format. Free online conversion tool.',
    keywords: ['bmp to svg', 'bmp to svg converter', 'convert bmp to svg', 'bitmap to svg', 'bmp vectorization', 'bmp to vector', 'windows bitmap to svg', 'free bmp to svg', 'bmp svg conversion', 'legacy image to svg', 'bmp tracing tool', 'bmp to svg online'],
    searchVolume: 260,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-bmp',
    urlSlug: 'svg-to-bmp',
    fromFormat: 'SVG',
    toFormat: 'BMP',
    title: 'SVG to BMP Converter',
    metaTitle: 'SVG to BMP Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert SVG files to BMP bitmap format. Simple and fast conversion.',
    keywords: ['svg to bmp'],
    searchVolume: 210,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'ico-to-svg',
    urlSlug: 'ico-to-svg',
    fromFormat: 'ICO',
    toFormat: 'SVG',
    title: 'ICO to SVG Converter',
    metaTitle: 'ICO to SVG Converter - Icon to Vector | SVG AI',
    metaDescription: 'Convert ICO icon files to SVG format. Transform favicons to scalable vectors.',
    keywords: ['ico to svg', 'ico to svg converter', 'icon to svg', 'convert ico to svg', 'favicon to svg', 'ico icon to vector', 'windows icon to svg', 'free ico to svg', 'ico svg conversion', 'icon vectorization', 'ico to scalable vector', 'icon to svg online'],
    searchVolume: 170,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'tiff-to-svg',
    urlSlug: 'tiff-to-svg',
    fromFormat: 'TIFF',
    toFormat: 'SVG',
    title: 'TIFF to SVG Converter',
    metaTitle: 'TIFF to SVG Converter - Free Online Tool | SVG AI',
    metaDescription: 'Convert TIFF images to SVG vector format. High-quality conversion for professional use.',
    keywords: ['tiff to svg'],
    searchVolume: 140,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-tiff',
    urlSlug: 'svg-to-tiff',
    fromFormat: 'SVG',
    toFormat: 'TIFF',
    title: 'SVG to TIFF Converter',
    metaTitle: 'SVG to TIFF Converter - Professional Export | SVG AI',
    metaDescription: 'Convert SVG files to TIFF format for professional printing and archival.',
    keywords: ['svg to tiff'],
    searchVolume: 110,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'emf-to-svg',
    urlSlug: 'emf-to-svg',
    fromFormat: 'EMF',
    toFormat: 'SVG',
    title: 'EMF to SVG Converter',
    metaTitle: 'EMF to SVG Converter - Windows Metafile | SVG AI',
    metaDescription: 'Convert EMF Windows metafiles to SVG format. Preserve vector quality.',
    keywords: ['emf to svg'],
    searchVolume: 90,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-emf',
    urlSlug: 'svg-to-emf',
    fromFormat: 'SVG',
    toFormat: 'EMF',
    title: 'SVG to EMF Converter',
    metaTitle: 'SVG to EMF Converter - Export for Windows | SVG AI',
    metaDescription: 'Convert SVG files to EMF format for use in Windows applications.',
    keywords: ['svg to emf'],
    searchVolume: 70,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'wmf-to-svg',
    urlSlug: 'wmf-to-svg',
    fromFormat: 'WMF',
    toFormat: 'SVG',
    title: 'WMF to SVG Converter',
    metaTitle: 'WMF to SVG Converter - Legacy Format | SVG AI',
    metaDescription: 'Convert WMF Windows metafiles to modern SVG format. Free conversion tool.',
    keywords: ['wmf to svg'],
    searchVolume: 50,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  },
  {
    id: 'svg-to-wmf',
    urlSlug: 'svg-to-wmf',
    fromFormat: 'SVG',
    toFormat: 'WMF',
    title: 'SVG to WMF Converter',
    metaTitle: 'SVG to WMF Converter - Legacy Export | SVG AI',
    metaDescription: 'Convert SVG files to WMF format for compatibility with older Windows applications.',
    keywords: ['svg to wmf'],
    searchVolume: 40,
    priority: 'low',
    routeType: 'convert',
    isSupported: true
  }
]

// Helper function to get converter by URL slug
export function getConverterBySlug(slug: string): ConverterConfig | undefined {
  return converterConfigs.find(config => config.urlSlug === slug)
}

// Helper function to get all supported converters
export function getSupportedConverters(): ConverterConfig[] {
  return converterConfigs.filter(config => config.isSupported)
}

// Helper function to get converters by priority
export function getConvertersByPriority(priority: 'high' | 'medium' | 'low'): ConverterConfig[] {
  return converterConfigs.filter(config => config.priority === priority)
}

// Helper function to get converters by route type
export function getConvertersByRouteType(routeType: 'convert' | 'generate' | 'learn'): ConverterConfig[] {
  return converterConfigs.filter(config => config.routeType === routeType)
}

// URL mapping for duplicate keywords
export const urlMappings: Record<string, string> = {
  'convert-png-to-svg': 'png-to-svg',
  'png-to-svg-converter': 'png-to-svg',
  'turn-svg-into-png': 'svg-to-png',
  'convert-svg-to-png': 'svg-to-png',
  'svg-to-png-converter': 'svg-to-png',
  'convert-svg-file-to-png': 'svg-to-png',
  'convert-to-svg': 'svg-converter',
  'jpg-to-svg-converter': 'jpg-to-svg',
  'convert-jpg-to-svg': 'jpg-to-svg',
  'convert-svg-to-jpg': 'svg-to-jpg',
  'jpeg-to-svg-converter': 'jpeg-to-svg',
  'convert-svg-to-pdf': 'svg-to-pdf',
  'best-svg-converter': 'best-svg-converters',
  'convert-a-png-to-svg': 'png-to-svg',
  'batch-svg-to-png': 'svg-to-png',
}