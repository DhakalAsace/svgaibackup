// Schema validation utilities for structured data
export interface SchemaValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
// Validate that required fields are present and properly formatted
export function validateSchema(schema: any): SchemaValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  // Check for required @context and @type
  if (!schema['@context']) {
    errors.push('Missing @context field')
  }
  if (!schema['@type']) {
    errors.push('Missing @type field')
  }
  // Validate specific schema types
  const schemaType = schema['@type']
  switch (schemaType) {
    case 'Organization':
      validateOrganization(schema, errors, warnings)
      break
    case 'SoftwareApplication':
    case 'WebApplication':
      validateApplication(schema, errors, warnings)
      break
    case 'HowTo':
      validateHowTo(schema, errors, warnings)
      break
    case 'FAQPage':
      validateFAQ(schema, errors, warnings)
      break
    case 'Product':
      validateProduct(schema, errors, warnings)
      break
    case 'VideoObject':
      validateVideo(schema, errors, warnings)
      break
    case 'Article':
    case 'TechArticle':
      validateArticle(schema, errors, warnings)
      break
    case 'ImageGallery':
    case 'CollectionPage':
      validateCollection(schema, errors, warnings)
      break
  }
  // Check aggregate ratings
  if (schema.aggregateRating) {
    validateAggregateRating(schema.aggregateRating, errors, warnings)
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
function validateOrganization(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) errors.push('Organization: Missing name')
  if (!schema.url) errors.push('Organization: Missing url')
  if (!schema.logo) warnings.push('Organization: Missing logo (recommended for E-E-A-T)')
  if (!schema.sameAs || !Array.isArray(schema.sameAs)) {
    warnings.push('Organization: Missing sameAs links (recommended for E-E-A-T)')
  }
}
function validateApplication(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) errors.push('Application: Missing name')
  if (!schema.description) errors.push('Application: Missing description')
  if (!schema.offers) warnings.push('Application: Missing offers information')
  if (!schema.applicationCategory) warnings.push('Application: Missing applicationCategory')
}
function validateHowTo(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) errors.push('HowTo: Missing name')
  if (!schema.step || !Array.isArray(schema.step)) {
    errors.push('HowTo: Missing or invalid step array')
  } else {
    schema.step.forEach((step: any, index: number) => {
      if (!step.name) errors.push(`HowTo: Step ${index + 1} missing name`)
      if (!step.text) errors.push(`HowTo: Step ${index + 1} missing text`)
    })
  }
  if (!schema.totalTime) warnings.push('HowTo: Missing totalTime')
}
function validateFAQ(schema: any, errors: string[], warnings: string[]) {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push('FAQPage: Missing or invalid mainEntity array')
  } else {
    if (schema.mainEntity.length < 3) {
      warnings.push('FAQPage: Less than 3 questions (recommended minimum is 5)')
    }
    schema.mainEntity.forEach((qa: any, index: number) => {
      if (!qa.name) errors.push(`FAQPage: Question ${index + 1} missing name`)
      if (!qa.acceptedAnswer?.text) {
        errors.push(`FAQPage: Question ${index + 1} missing acceptedAnswer.text`)
      }
    })
  }
}
function validateProduct(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) errors.push('Product: Missing name')
  if (!schema.description) errors.push('Product: Missing description')
  if (!schema.offers) {
    errors.push('Product: Missing offers')
  } else {
    const offers = Array.isArray(schema.offers) ? schema.offers : [schema.offers]
    offers.forEach((offer: any, index: number) => {
      if (!offer.price) errors.push(`Product: Offer ${index + 1} missing price`)
      if (!offer.priceCurrency) errors.push(`Product: Offer ${index + 1} missing priceCurrency`)
    })
  }
  if (!schema.brand) warnings.push('Product: Missing brand information')
}
function validateVideo(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) errors.push('VideoObject: Missing name')
  if (!schema.description) errors.push('VideoObject: Missing description')
  if (!schema.thumbnailUrl) errors.push('VideoObject: Missing thumbnailUrl')
  if (!schema.uploadDate) errors.push('VideoObject: Missing uploadDate')
  if (!schema.duration) warnings.push('VideoObject: Missing duration')
  if (!schema.contentUrl && !schema.embedUrl) {
    errors.push('VideoObject: Missing both contentUrl and embedUrl')
  }
}
function validateArticle(schema: any, errors: string[], warnings: string[]) {
  if (!schema.headline) errors.push('Article: Missing headline')
  if (!schema.author) warnings.push('Article: Missing author (important for E-E-A-T)')
  if (!schema.datePublished) errors.push('Article: Missing datePublished')
  if (!schema.image) warnings.push('Article: Missing image')
  if (!schema.publisher) warnings.push('Article: Missing publisher (important for E-E-A-T)')
}
function validateCollection(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) errors.push('Collection: Missing name')
  if (!schema.mainEntity && !schema.image) {
    warnings.push('Collection: Missing mainEntity or image array')
  }
}
function validateAggregateRating(rating: any, errors: string[], warnings: string[]) {
  if (!rating.ratingValue) errors.push('AggregateRating: Missing ratingValue')
  if (!rating.ratingCount && !rating.reviewCount) {
    errors.push('AggregateRating: Missing both ratingCount and reviewCount')
  }
  // Check for realistic values
  const ratingValue = parseFloat(rating.ratingValue)
  const ratingCount = parseInt(rating.ratingCount || rating.reviewCount || '0')
  if (ratingValue > 5 || ratingValue < 1) {
    errors.push('AggregateRating: ratingValue must be between 1 and 5')
  }
  if (ratingValue === 5 && ratingCount > 100) {
    warnings.push('AggregateRating: Perfect 5.0 rating with many reviews may seem unrealistic')
  }
  if (ratingCount < 5) {
    warnings.push('AggregateRating: Very low review count may not be impactful')
  }
}
// Helper to generate JSON-LD script tag
export function generateJsonLdScript(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
}
// Helper to combine multiple schemas
export function combineSchemas(...schemas: any[]): any[] {
  return schemas.filter(Boolean).map(schema => {
    const validation = validateSchema(schema)
    if (!validation.isValid) {
      }
    if (validation.warnings.length > 0) {
      }
    return schema
  })
}