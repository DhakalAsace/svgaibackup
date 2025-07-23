/**
 * Lazy Loading System for Converter Libraries
 * 
 * Provides dynamic import functionality for converter-specific libraries
 * to minimize initial bundle size and improve performance.
 */

import { ConversionError } from './errors'

/**
 * Library loader configuration
 */
interface LibraryConfig {
  name: string
  importFn: () => Promise<any>
  global?: string // Global variable name if library sets one
  retries?: number
  timeout?: number
}

/**
 * Loaded library cache
 */
const loadedLibraries = new Map<string, any>()
const loadingPromises = new Map<string, Promise<any>>()

/**
 * Load a library with caching and error handling
 */
export async function loadLibrary<T = any>(config: LibraryConfig): Promise<T> {
  const { name, importFn, global, retries = 3, timeout = 30000 } = config
  
  // Return cached library if already loaded
  if (loadedLibraries.has(name)) {
    return loadedLibraries.get(name) as T
  }
  
  // If already loading, return the existing promise
  if (loadingPromises.has(name)) {
    return loadingPromises.get(name) as Promise<T>
  }
  
  // Create loading promise
  const loadingPromise = loadWithRetries(name, importFn, retries, timeout, global)
    .then((library) => {
      loadedLibraries.set(name, library)
      loadingPromises.delete(name)
      return library as T
    })
    .catch((error) => {
      loadingPromises.delete(name)
      throw error
    })
  
  loadingPromises.set(name, loadingPromise)
  return loadingPromise
}

/**
 * Load library with retry logic
 */
async function loadWithRetries(
  name: string,
  importFn: () => Promise<any>,
  retries: number,
  timeout: number,
  global?: string
): Promise<any> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Loading ${name} timed out after ${timeout}ms`))
        }, timeout)
      })
      
      // Race between import and timeout
      const loadedModule = await Promise.race([importFn(), timeoutPromise])
      
      // Check if global variable was set (for non-module libraries)
      if (global && typeof window !== 'undefined' && (window as any)[global]) {
        return (window as any)[global]
      }
      
      return loadedModule
      
    } catch (error) {
      lastError = error as Error
      
      // If not the last attempt, wait before retrying
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        continue
      }
    }
  }
  
  throw new ConversionError(
    `Failed to load ${name} library after ${retries + 1} attempts: ${lastError?.message}`,
    'LIBRARY_LOAD_FAILED'
  )
}

/**
 * Preload multiple libraries in parallel
 */
export async function preloadLibraries(configs: LibraryConfig[]): Promise<void> {
  await Promise.all(configs.map(config => loadLibrary(config)))
}

/**
 * Check if a library is loaded
 */
export function isLibraryLoaded(name: string): boolean {
  return loadedLibraries.has(name)
}

/**
 * Clear library cache (useful for testing)
 */
export function clearLibraryCache(): void {
  loadedLibraries.clear()
  loadingPromises.clear()
}

/**
 * Common library configurations
 */
export const LIBRARY_CONFIGS = {
  // Image processing libraries
  potrace: {
    name: 'potrace',
    importFn: () => import('potrace')
  },
  sharp: {
    name: 'sharp',
    importFn: () => import('sharp')
  },
  pdfjs: {
    name: 'pdfjs-dist',
    importFn: async () => {
      const pdfjsLib = await import('pdfjs-dist')
      // Set worker path for client-side usage
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js?v=5.3.93'
      }
      return pdfjsLib
    }
  },
  jimp: {
    name: 'jimp',
    importFn: () => import('jimp')
  },
  
  // CAD/3D libraries
  dxfParser: {
    name: 'dxf-parser',
    importFn: () => import('dxf-parser')
  },
  dxfWriter: {
    name: 'dxf-writer',
    importFn: () => import('dxf-writer')
  },
  
  // Font libraries
  opentype: {
    name: 'opentype.js',
    importFn: () => import('opentype.js')
  },
  
  // Image format libraries
  utif: {
    name: 'utif',
    importFn: () => import('utif')
  },
  
  // Web libraries
  html2canvas: {
    name: 'html2canvas',
    importFn: () => import('html2canvas')
  },
  
  // Compression libraries
  pako: {
    name: 'pako',
    importFn: () => import('pako')
  }
} as const

/**
 * Type-safe library loader functions
 */
export const loadPotrace = () => loadLibrary(LIBRARY_CONFIGS.potrace)
export const loadSharp = () => loadLibrary(LIBRARY_CONFIGS.sharp)
export const loadPdfjs = () => loadLibrary(LIBRARY_CONFIGS.pdfjs)
export const loadJimp = () => loadLibrary(LIBRARY_CONFIGS.jimp)
export const loadDxfParser = () => loadLibrary(LIBRARY_CONFIGS.dxfParser)
export const loadDxfWriter = () => loadLibrary(LIBRARY_CONFIGS.dxfWriter)
export const loadOpentype = () => loadLibrary(LIBRARY_CONFIGS.opentype)
export const loadUtif = () => loadLibrary(LIBRARY_CONFIGS.utif)
export const loadHtml2canvas = () => loadLibrary(LIBRARY_CONFIGS.html2canvas)
export const loadPako = () => loadLibrary(LIBRARY_CONFIGS.pako)

/**
 * Create a custom library loader
 */
export function createLibraryLoader<T = any>(
  name: string,
  importFn: () => Promise<T>,
  options?: Partial<LibraryConfig>
): () => Promise<T> {
  const config: LibraryConfig = {
    name,
    importFn,
    ...options
  }
  
  return () => loadLibrary<T>(config)
}