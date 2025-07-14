// Global type definitions

// Type declarations for packages without TypeScript support

declare module 'dxf-parser' {
  export interface DxfParserOptions {
    /** Optional configuration */
  }
  
  export interface DxfEntity {
    type: string
    layer?: string
    handle?: string
    ownerHandle?: string
    lineType?: string
    visible?: boolean
    color?: number
    [key: string]: any
  }
  
  export interface DxfHeader {
    [variable: string]: any
  }
  
  export interface DxfResult {
    entities: DxfEntity[]
    header: DxfHeader
    tables?: any
    blocks?: any
  }
  
  export default class DxfParser {
    constructor()
    parseSync(source: string): DxfResult
    parse(source: string): Promise<DxfResult>
  }
}

declare module 'dxf-writer' {
  export class Drawing {
    constructor()
    setUnits(units: string): void
    addLayer(name: string, color?: number, lineType?: string): void
    setActiveLayer(name: string): void
    drawLine(x1: number, y1: number, x2: number, y2: number): void
    drawCircle(x: number, y: number, radius: number): void
    drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void
    drawPolyline(points: Array<[number, number]>, closed?: boolean): void
    drawText(x: number, y: number, height: number, rotation: number, text: string): void
    toDxfString(): string
  }
}

declare module 'opentype.js' {
  export interface Font {
    unitsPerEm: number
    ascender: number
    descender: number
    glyphs: {
      length: number
      get(index: number): Glyph
    }
    charToGlyph(char: string): Glyph
    getPath(text: string, x: number, y: number, fontSize: number, options?: any): Path
    getPaths(text: string, x: number, y: number, fontSize: number, options?: any): Path[]
    draw(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, options?: any): void
    getAdvanceWidth(text: string, fontSize: number, options?: any): number
    kerningPairs: any
    tables: any
  }
  
  export interface Glyph {
    index: number
    name: string
    unicode?: number
    path: Path
    advanceWidth: number
    getPath(x: number, y: number, fontSize: number): Path
  }
  
  export interface Path {
    commands: Array<{ type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number }>
    toPathData(decimalPlaces?: number): string
    toSVG(decimalPlaces?: number): string
    toDOMElement(decimalPlaces?: number): SVGPathElement
    draw(ctx: CanvasRenderingContext2D): void
  }
  
  export function load(url: string, callback: (err: Error | null, font?: Font) => void): void
  export function loadSync(url: string): Font
  export function parse(arrayBuffer: ArrayBuffer): Font
}

declare module 'utif' {
  export interface IFD {
    width: number
    height: number
    data: Uint8Array
    t256?: number[] // ImageWidth
    t257?: number[] // ImageLength
    t258?: number[] // BitsPerSample
    t259?: number[] // Compression
    t262?: number[] // PhotometricInterpretation
    t273?: number[] // StripOffsets
    t277?: number[] // SamplesPerPixel
    t278?: number[] // RowsPerStrip
    t279?: number[] // StripByteCounts
    [key: string]: any
  }
  
  export function decode(buffer: ArrayBuffer): IFD[]
  export function decodeImage(buffer: ArrayBuffer, ifd: IFD): void
  export function toRGBA8(ifd: IFD): Uint8Array
  export function encode(rgba: ArrayBuffer[], w: number, h: number, metadata?: any): ArrayBuffer
}

declare module 'gif-encoder-2' {
  export default class GIFEncoder {
    constructor(width: number, height: number, algorithm?: string, useOptimizer?: boolean, totalFrames?: number)
    
    start(): void
    finish(): Uint8Array
    
    setRepeat(repeat: number): void
    setDelay(delay: number): void
    setQuality(quality: number): void
    setTransparent(color: number): void
    setDispose(dispose: number): void
    
    addFrame(data: ImageData | Uint8ClampedArray): void
  }
}

declare module 'pako' {
  export function deflate(data: Uint8Array | ArrayBuffer | string, options?: any): Uint8Array
  export function inflate(data: Uint8Array | ArrayBuffer, options?: any): Uint8Array
  export function deflateRaw(data: Uint8Array | ArrayBuffer | string, options?: any): Uint8Array
  export function inflateRaw(data: Uint8Array | ArrayBuffer, options?: any): Uint8Array
  export function gzip(data: Uint8Array | ArrayBuffer | string, options?: any): Uint8Array
  export function ungzip(data: Uint8Array | ArrayBuffer, options?: any): Uint8Array
}

// Export to make this a module
export {}