#!/usr/bin/env node

/**
 * Schema Validation Script
 * Validates JSON-LD structured data across the site
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface SchemaValidationResult {
  file: string;
  errors: string[];
  warnings: string[];
  schemaTypes: string[];
}

const REQUIRED_PROPERTIES: Record<string, string[]> = {
  Product: ['name', 'description', 'offers'],
  Article: ['headline', 'datePublished', 'author', 'publisher'],
  Organization: ['name', 'url'],
  WebApplication: ['name', 'url', 'applicationCategory'],
  HowTo: ['name', 'step'],
  FAQPage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
};

const RECOMMENDED_PROPERTIES: Record<string, string[]> = {
  Product: ['image', 'aggregateRating', 'brand'],
  Article: ['image', 'dateModified', 'mainEntityOfPage'],
  Organization: ['logo', 'sameAs', 'contactPoint'],
  WebApplication: ['aggregateRating', 'offers', 'screenshot'],
};

function extractSchemaFromFile(filePath: string): any[] {
  const content = readFileSync(filePath, 'utf-8');
  const schemas: any[] = [];
  
  // Extract JSON-LD scripts
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = jsonLdRegex.exec(content)) !== null) {
    try {
      // Clean up the JSON string
      let jsonString = match[1]
        .replace(/^\s*{\s*`/, '') // Remove template literal start
        .replace(/`\s*}\s*$/, '') // Remove template literal end
        .replace(/\\n/g, '')      // Remove newlines
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();
      
      // Try to parse as JSON
      if (jsonString.startsWith('{')) {
        const schema = JSON.parse(jsonString);
        schemas.push(schema);
      }
    } catch (e) {
      // If JSON parsing fails, try to extract from template literal
      try {
        const templateMatch = match[1].match(/`([^`]+)`/);
        if (templateMatch) {
          const schema = JSON.parse(templateMatch[1]);
          schemas.push(schema);
        }
      } catch (e2) {
        console.warn(`Failed to parse schema in ${filePath}: ${e2}`);
      }
    }
  }
  
  return schemas;
}

function validateSchema(schema: any, filePath: string): SchemaValidationResult {
  const result: SchemaValidationResult = {
    file: filePath,
    errors: [],
    warnings: [],
    schemaTypes: []
  };
  
  // Handle @graph
  const schemasToValidate = schema['@graph'] || [schema];
  
  for (const s of schemasToValidate) {
    if (!s['@type']) {
      result.errors.push('Missing @type property');
      continue;
    }
    
    const schemaType = Array.isArray(s['@type']) ? s['@type'][0] : s['@type'];
    result.schemaTypes.push(schemaType);
    
    // Check required properties
    const required = REQUIRED_PROPERTIES[schemaType];
    if (required) {
      for (const prop of required) {
        if (!s[prop]) {
          result.errors.push(`${schemaType}: Missing required property "${prop}"`);
        }
      }
    }
    
    // Check recommended properties
    const recommended = RECOMMENDED_PROPERTIES[schemaType];
    if (recommended) {
      for (const prop of recommended) {
        if (!s[prop]) {
          result.warnings.push(`${schemaType}: Missing recommended property "${prop}"`);
        }
      }
    }
    
    // Validate specific properties
    if (s.offers) {
      if (!s.offers.price && !s.offers.priceSpecification) {
        result.errors.push(`${schemaType}: Offers must include price information`);
      }
      if (!s.offers.priceCurrency) {
        result.errors.push(`${schemaType}: Offers must include priceCurrency`);
      }
    }
    
    if (s.aggregateRating) {
      if (!s.aggregateRating.ratingValue) {
        result.errors.push(`${schemaType}: AggregateRating must include ratingValue`);
      }
      if (!s.aggregateRating.ratingCount && !s.aggregateRating.reviewCount) {
        result.warnings.push(`${schemaType}: AggregateRating should include ratingCount or reviewCount`);
      }
    }
    
    // Check for hardcoded test values
    const jsonString = JSON.stringify(s);
    if (jsonString.includes('example.com') || jsonString.includes('Example')) {
      result.warnings.push('Schema contains example/test values that should be replaced');
    }
  }
  
  return result;
}

function findTsxFiles(dir: string, files: string[] = []): string[] {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function main() {
  console.log('🔍 Validating Schema Implementation...\n');
  
  const appDir = join(process.cwd(), 'app');
  const files = findTsxFiles(appDir);
  
  let totalErrors = 0;
  let totalWarnings = 0;
  const results: SchemaValidationResult[] = [];
  
  for (const file of files) {
    const schemas = extractSchemaFromFile(file);
    
    for (const schema of schemas) {
      const result = validateSchema(schema, file.replace(process.cwd(), '.'));
      if (result.errors.length > 0 || result.warnings.length > 0) {
        results.push(result);
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
      }
    }
  }
  
  // Print results
  if (results.length === 0) {
    console.log('✅ No schema validation issues found!');
  } else {
    for (const result of results) {
      console.log(`\n📄 ${result.file}`);
      console.log(`   Schema types: ${result.schemaTypes.join(', ')}`);
      
      if (result.errors.length > 0) {
        console.log('   ❌ Errors:');
        for (const error of result.errors) {
          console.log(`      - ${error}`);
        }
      }
      
      if (result.warnings.length > 0) {
        console.log('   ⚠️  Warnings:');
        for (const warning of result.warnings) {
          console.log(`      - ${warning}`);
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total errors: ${totalErrors}`);
    console.log(`   Total warnings: ${totalWarnings}`);
    console.log(`   Files with issues: ${results.length}`);
  }
  
  // Exit with error code if errors found
  process.exit(totalErrors > 0 ? 1 : 0);
}

main();