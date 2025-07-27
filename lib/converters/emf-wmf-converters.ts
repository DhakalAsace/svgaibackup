/**
 * EMF/WMF Converters Index
 * 
 * This module exports all EMF and WMF converters for easy import
 */

// EMF to SVG
export {
  emfToSvgHandler,
  convertEmfToSvgClient,
  convertEmfToSvgServer,
  emfToSvgConverter
} from './emf-to-svg'

// WMF to SVG  
export {
  wmfToSvgHandler,
  convertWmfToSvgClient,
  convertWmfToSvgServer,
  wmfToSvgConverter
} from './wmf-to-svg'

// SVG to EMF
export {
  svgToEmfHandler,
  convertSvgToEmfClient,
  convertSvgToEmfServer,
  svgToEmfConverter
} from './svg-to-emf'

// SVG to WMF
export {
  svgToWmfHandler,
  convertSvgToWmfClient,
  convertSvgToWmfServer,
  svgToWmfConverter
} from './svg-to-wmf'

// Import the converters to export them as an array
import { emfToSvgConverter } from './emf-to-svg'
import { wmfToSvgConverter } from './wmf-to-svg'
import { svgToEmfConverter } from './svg-to-emf'
import { svgToWmfConverter } from './svg-to-wmf'

// Export all converters as an array
export const emfWmfConverters = [
  emfToSvgConverter,
  wmfToSvgConverter,
  svgToEmfConverter,
  svgToWmfConverter
]