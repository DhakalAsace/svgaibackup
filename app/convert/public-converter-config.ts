export interface PublicConverterConfig {
  id: string
  urlSlug: string
  fromFormat: string
  toFormat: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  priority: 'high' | 'medium' | 'low'
  routeType: 'convert' | 'generate' | 'learn'
  isSupported: boolean
}

// Type-compatible version for public use
export interface PublicConverterContent {
  introduction: string
  whatIsSection: {
    fromFormat: string
    toFormat: string
  }
  whyConvertSection: string
  howToConvertSteps: Array<{
    title: string
    description: string
    tip?: string
  }>
  benefitsSection: Array<{
    title: string
    description: string
  }>
  useCasesSection: Array<{
    industry: string
    description: string
    example: string
  }>
  technicalDetailsSection: {
    fromFormatDetails: string
    toFormatDetails: string
    conversionProcess: string
  }
  commonProblemsSection: Array<{
    problem: string
    solution: string
  }>
  bestPracticesSection: Array<{
    practice: string
    explanation: string
  }>
  comparisonSection: {
    title: string
    comparisons: Array<{
      aspect: string
      fromFormat: string
      toFormat: string
    }>
  }
  faqs: Array<{
    question: string
    answer: string
  }>
  howToSchema: {
    name: string
    description: string
    supply: string[]
    tool: string[]
    steps: Array<{
      name: string
      text: string
    }>
  }
  relatedTools: Array<{
    title: string
    description: string
    href: string
  }>
}

// Type definitions for imported functions to fix implicit any
type GetConverterBySlugFn = (slug: string) => import('./converter-config').ConverterConfig | undefined
type GetSupportedConvertersFn = () => import('./converter-config').ConverterConfig[]
type GetConvertersByPriorityFn = (priority: 'high' | 'medium' | 'low') => import('./converter-config').ConverterConfig[]
type GetConvertersByRouteTypeFn = (routeType: 'convert' | 'generate' | 'learn') => import('./converter-config').ConverterConfig[]

// Helper function to get converter by URL slug (public version)
export function getPublicConverterBySlug(slug: string): PublicConverterConfig | undefined {
  const { getConverterBySlug }: { getConverterBySlug: GetConverterBySlugFn } = require('./converter-config')
  const converter = getConverterBySlug(slug)
  if (!converter) return undefined
  
  // Remove searchVolume from public interface
  const { searchVolume, ...publicConverter } = converter
  return publicConverter as PublicConverterConfig
}

// Helper function to get all supported converters (public version)
export function getPublicSupportedConverters(): PublicConverterConfig[] {
  const { getSupportedConverters }: { getSupportedConverters: GetSupportedConvertersFn } = require('./converter-config')
  const converters = getSupportedConverters()
  
  // Remove searchVolume from all public interfaces
  return converters.map(converter => {
    const { searchVolume, ...publicConverter } = converter
    return publicConverter as PublicConverterConfig
  })
}

// Helper function to get converters by priority (public version)
export function getPublicConvertersByPriority(priority: 'high' | 'medium' | 'low'): PublicConverterConfig[] {
  const { getConvertersByPriority }: { getConvertersByPriority: GetConvertersByPriorityFn } = require('./converter-config')
  const converters = getConvertersByPriority(priority)
  
  // Remove searchVolume from all public interfaces
  return converters.map(converter => {
    const { searchVolume, ...publicConverter } = converter
    return publicConverter as PublicConverterConfig
  })
}

// Helper function to get converters by route type (public version)
export function getPublicConvertersByRouteType(routeType: 'convert' | 'generate' | 'learn'): PublicConverterConfig[] {
  const { getConvertersByRouteType }: { getConvertersByRouteType: GetConvertersByRouteTypeFn } = require('./converter-config')
  const converters = getConvertersByRouteType(routeType)
  
  // Remove searchVolume from all public interfaces
  return converters.map(converter => {
    const { searchVolume, ...publicConverter } = converter
    return publicConverter as PublicConverterConfig
  })
}

// Public-compatible content generation function
export function getPublicConverterContent(config: PublicConverterConfig): PublicConverterContent {
  // Add default searchVolume for content generation since it's required internally
  // Use priority-based estimation to maintain content quality without exposing actual search data
  const searchVolumeByPriority = {
    'high': 20000,
    'medium': 5000, 
    'low': 1000
  }
  
  const internalConfig = {
    ...config,
    searchVolume: searchVolumeByPriority[config.priority]
  }
  
  // Import and use the internal content generation function
  const { getConverterContent }: { getConverterContent: (config: any) => any } = require('../../lib/converter-content')
  return getConverterContent(internalConfig) as PublicConverterContent
}