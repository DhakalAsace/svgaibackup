/**
 * Enhanced Converter Page Component with Structured Data
 * 
 * This component shows how to integrate structured data schemas
 * into the existing converter page architecture.
 */

import { ConverterConfig } from '@/app/convert/converter-config'
import { generateConverterPageSchemas, StructuredData } from '@/lib/structured-data'
import ConverterPageOptimized from './converter-page-optimized'

interface ConverterPageWithStructuredDataProps {
  config: ConverterConfig
}

export default function ConverterPageWithStructuredData({ 
  config 
}: ConverterPageWithStructuredDataProps) {
  // Generate all structured data schemas for this converter
  const schemas = generateConverterPageSchemas(config)
  
  return (
    <>
      {/* Add structured data to the page */}
      <StructuredData schemas={schemas} />
      
      {/* Render the existing converter page component */}
      <ConverterPageOptimized config={config} />
    </>
  )
}

// Example of how to update the converter page route
export function UpdatedConverterPageRoute({ config }: { config: ConverterConfig }) {
  return (
    <div className="min-h-screen">
      {/* Structured data is now included automatically */}
      <ConverterPageWithStructuredData config={config} />
    </div>
  )
}