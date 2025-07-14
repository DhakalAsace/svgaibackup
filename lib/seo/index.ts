// Export all SEO-related functions and configurations
export * from './learn-page-seo';
export * from './structured-data';
export * from './category-structured-data';
export * from './schema-validation';

// Re-export commonly used functions for convenience
export {
  generateConverterStructuredData,
  generateConverterMetadata,
  generateGalleryStructuredData,
  generateLearnPageStructuredData,
  generateToolStructuredData,
  generateBreadcrumbSchema,
  generateWebSiteSchema
} from './structured-data';

export {
  generateCategoryStructuredData,
  generateHomepageStructuredData
} from './category-structured-data';

export {
  validateSchema,
  generateJsonLdScript,
  combineSchemas
} from './schema-validation';