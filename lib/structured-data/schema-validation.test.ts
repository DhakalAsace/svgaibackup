/**
 * Schema Validation Tests
 * 
 * Ensures all generated schemas are valid and contain required fields
 */

import {
  generateConverterSchema,
  generateToolSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateConverterPageSchemas,
  generateToolPageSchemas,
  organizationSchema,
  websiteSchema
} from './tool-schemas'
import { ConverterConfig } from '@/app/convert/converter-config'

// Sample converter config for testing
const sampleConverter: ConverterConfig = {
  id: 'png-to-svg',
  urlSlug: 'png-to-svg',
  fromFormat: 'PNG',
  toFormat: 'SVG',
  title: 'PNG to SVG Converter',
  metaTitle: 'PNG to SVG Converter - Free Online Tool',
  metaDescription: 'Convert PNG to SVG online for free',
  keywords: ['png to svg', 'convert png to svg'],
  searchVolume: 40500,
  priority: 'high',
  routeType: 'convert',
  isSupported: true
}

// Validation helper
function validateSchema(schema: any, requiredType: string) {
  if (!schema['@context']) {
    throw new Error('Schema missing @context')
  }
  if (schema['@type'] !== requiredType) {
    throw new Error(`Expected @type ${requiredType}, got ${schema['@type']}`)
  }
  return true
}

// Test converter schema generation
export function testConverterSchema() {
  const schema = generateConverterSchema(sampleConverter)
  
  // Validate required fields
  validateSchema(schema, 'SoftwareApplication')
  
  if (!schema.name || !schema.description || !schema.url) {
    throw new Error('Converter schema missing required fields')
  }
  
  if (!schema.offers || schema.offers.price !== '0') {
    throw new Error('Converter should be free')
  }
  
  if (!schema.aggregateRating || !schema.featureList) {
    throw new Error('Converter schema missing rating or features')
  }
  
  console.log('✓ Converter schema validation passed')
}

// Test tool schema generation
export function testToolSchemas() {
  const toolTypes: Array<'editor' | 'optimizer' | 'animator' | 'video-converter'> = [
    'editor',
    'optimizer', 
    'animator',
    'video-converter'
  ]
  
  toolTypes.forEach(toolType => {
    const isPaid = toolType === 'video-converter'
    const schema = generateToolSchema(toolType, isPaid)
    
    validateSchema(schema, 'SoftwareApplication')
    
    if (isPaid && schema.offers.price !== '5') {
      throw new Error('Video converter should be paid')
    }
    
    if (!isPaid && schema.offers.price !== '0') {
      throw new Error(`${toolType} should be free`)
    }
    
    console.log(`✓ ${toolType} schema validation passed`)
  })
}

// Test breadcrumb schema
export function testBreadcrumbSchema() {
  const schema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Converters', url: '/convert' },
    { name: 'PNG to SVG' }
  ])
  
  validateSchema(schema, 'BreadcrumbList')
  
  if (!schema.itemListElement || schema.itemListElement.length !== 3) {
    throw new Error('Breadcrumb schema has wrong number of items')
  }
  
  console.log('✓ Breadcrumb schema validation passed')
}

// Test FAQ schema
export function testFAQSchema() {
  const schema = generateFAQSchema([
    {
      question: 'Is it free?',
      answer: 'Yes, completely free.'
    }
  ])
  
  validateSchema(schema, 'FAQPage')
  
  if (!schema.mainEntity || schema.mainEntity.length === 0) {
    throw new Error('FAQ schema missing questions')
  }
  
  console.log('✓ FAQ schema validation passed')
}

// Test HowTo schema
export function testHowToSchema() {
  const schema = generateHowToSchema(
    'How to Convert PNG to SVG',
    'Step by step guide',
    [
      { name: 'Upload', text: 'Upload your PNG file' },
      { name: 'Convert', text: 'Click convert' },
      { name: 'Download', text: 'Download SVG' }
    ]
  )
  
  validateSchema(schema, 'HowTo')
  
  if (!schema.step || schema.step.length !== 3) {
    throw new Error('HowTo schema has wrong number of steps')
  }
  
  console.log('✓ HowTo schema validation passed')
}

// Test complete page schema generation
export function testPageSchemaGeneration() {
  // Test converter page schemas
  const converterSchemas = generateConverterPageSchemas(sampleConverter)
  if (converterSchemas.length < 3) {
    throw new Error('Converter page should have at least 3 schemas')
  }
  console.log('✓ Converter page schemas validation passed')
  
  // Test tool page schemas  
  const toolSchemas = generateToolPageSchemas('editor', false)
  if (toolSchemas.length < 2) {
    throw new Error('Tool page should have at least 2 schemas')
  }
  console.log('✓ Tool page schemas validation passed')
}

// Test organization and website schemas
export function testGlobalSchemas() {
  validateSchema(organizationSchema, 'Organization')
  validateSchema(websiteSchema, 'WebSite')
  
  if (!websiteSchema.potentialAction) {
    throw new Error('Website schema missing search action')
  }
  
  console.log('✓ Global schemas validation passed')
}

// Run all tests
export function runAllTests() {
  console.log('Running schema validation tests...\n')
  
  try {
    testConverterSchema()
    testToolSchemas()
    testBreadcrumbSchema()
    testFAQSchema()
    testHowToSchema()
    testPageSchemaGeneration()
    testGlobalSchemas()
    
    console.log('\n✅ All schema validation tests passed!')
  } catch (error) {
    console.error('\n❌ Schema validation failed:', error)
    throw error
  }
}

// Example: Validate a specific converter
export function validateConverterImplementation(config: ConverterConfig) {
  try {
    const schemas = generateConverterPageSchemas(config)
    
    // Check we have the expected schemas
    const schemaTypes = schemas.map(s => s['@type'])
    const expectedTypes = ['SoftwareApplication', 'BreadcrumbList', 'HowTo']
    
    expectedTypes.forEach(type => {
      if (!schemaTypes.includes(type)) {
        throw new Error(`Missing expected schema type: ${type}`)
      }
    })
    
    console.log(`✓ ${config.title} schemas are valid`)
    return true
  } catch (error) {
    console.error(`❌ ${config.title} schema validation failed:`, error)
    return false
  }
}