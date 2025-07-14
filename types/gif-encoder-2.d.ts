declare module 'gif-encoder-2' {
  export default class GIFEncoder {
    constructor(width: number, height: number);
    
    createReadStream(): NodeJS.ReadableStream;
    createWriteStream(options?: any): NodeJS.WritableStream;
    
    start(): void;
    finish(): void;
    
    setRepeat(repeat: number): void;
    setDelay(delay: number): void;
    setQuality(quality: number): void;
    setTransparent(color: number | null): void;
    setFrameRate(fps: number): void;
    
    addFrame(imageData: Buffer | Uint8Array | Uint8ClampedArray): void;
    
    read(): Buffer | null;
    out: any;
    
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
  }
}