declare module 'heic2any' {
  interface ConvertOptions {
    /** The HEIC blob to convert */
    blob: Blob
    /** Target format (jpeg, png, gif, webp) */
    toType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    /** Quality (0-1, only for JPEG and WebP) */
    quality?: number
    /** Multiple output (for HEIC sequences) */
    multiple?: boolean
  }

  /**
   * Convert HEIC image to other formats
   */
  function convert(options: ConvertOptions): Promise<Blob | Blob[]>
  
  export default convert
}