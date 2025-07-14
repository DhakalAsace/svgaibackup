declare module 'imagetracerjs' {
  interface TraceOptions {
    /** Number of colors for color quantization (2-256, default: 16) */
    numberofcolors?: number
    /** Color quantization method (0-3, default: 2) */
    colorquantcycles?: number
    /** Path smoothing (0-100, default: 1) */
    pathomit?: number
    /** Blur radius (0-5, default: 0) */
    blurradius?: number
    /** Blur delta (0-1024, default: 20) */
    blurdelta?: number
    /** Stroke width (0-1000, default: 1) */
    strokewidth?: number
    /** Line threshold (0-100, default: 10) */
    linethereshold?: number
    /** Quadratic spline threshold (0-100, default: 10) */
    quadthreshold?: number
    /** Right angle enhance (default: true) */
    rightangleenhance?: boolean
    /** View box for SVG output */
    viewbox?: boolean
    /** Description in SVG output */
    desc?: boolean
    /** LCPR value */
    lcpr?: number
    /** QCPR value */
    qcpr?: number
  }

  interface ImageTracer {
    /**
     * Convert image to SVG from data URL
     */
    imageToSVG(
      dataUrl: string,
      callback: (svg: string) => void,
      options?: TraceOptions
    ): void

    /**
     * Convert image to SVG from data URL (async)
     */
    imageToSVGAsync(
      dataUrl: string,
      options?: TraceOptions
    ): Promise<string>

    /**
     * Trace image to paths
     */
    imagedataToTracedata(
      imagedata: ImageData,
      options?: TraceOptions
    ): any

    /**
     * Convert tracedata to SVG string
     */
    getsvgstring(
      tracedata: any,
      options?: TraceOptions
    ): string
  }

  const ImageTracer: ImageTracer
  export default ImageTracer
}