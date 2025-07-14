/**
 * Structured Data Module
 * 
 * Central export point for all structured data schemas and utilities
 */

export * from './tool-schemas'

// Re-export commonly used schemas and functions for convenience
export {
  organizationSchema,
  websiteSchema,
  generateConverterSchema,
  generateToolSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateConverterPageSchemas,
  generateToolPageSchemas,
  combineSchemas,
  StructuredData
} from './tool-schemas'