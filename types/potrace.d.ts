declare module 'potrace' {
  export interface PotraceOptions {
    threshold?: number
    turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority'
    turdSize?: number
    alphaMax?: number
    optCurve?: boolean
    optTolerance?: number
    color?: string
    background?: string
  }

  export interface Potrace {
    loadImage(buffer: Buffer, callback: (err?: Error) => void): void
    setParameter(params: PotraceOptions): void
    getSVG(): string
    trace(callback: (err: Error | null, svg?: string) => void): void
  }

  export interface Posterize {
    loadImage(buffer: Buffer, callback: (err?: Error) => void): void
    setParameter(params: PotraceOptions & { steps?: number; fillStrategy?: string }): void
    getSVG(): string
  }

  export function trace(
    data: Buffer | string,
    options: PotraceOptions,
    callback: (err: Error | null, svg?: string) => void
  ): void

  export function trace(
    data: Buffer | string,
    callback: (err: Error | null, svg?: string) => void
  ): void

  export function posterize(
    data: Buffer | string,
    options: PotraceOptions & { steps?: number },
    callback: (err: Error | null, svg?: string) => void
  ): void

  export function posterize(
    data: Buffer | string,
    callback: (err: Error | null, svg?: string) => void
  ): void

  export class Potrace {
    static TURNPOLICY_BLACK: string
    static TURNPOLICY_WHITE: string
    static TURNPOLICY_LEFT: string
    static TURNPOLICY_RIGHT: string
    static TURNPOLICY_MINORITY: string
    static TURNPOLICY_MAJORITY: string
    
    constructor()
    loadImage(buffer: Buffer, callback: (err?: Error) => void): void
    setParameter(params: PotraceOptions): void
    getSVG(): string
    trace(callback: (err: Error | null, svg?: string) => void): void
  }

  export class Posterize {
    constructor()
    loadImage(buffer: Buffer, callback: (err?: Error) => void): void
    setParameter(params: PotraceOptions & { steps?: number; fillStrategy?: string }): void
    getSVG(): string
  }
}