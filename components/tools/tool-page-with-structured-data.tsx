/**
 * Tool Page Components with Structured Data Integration
 * 
 * Wrapper components that add structured data to all tool pages
 */

import { generateToolPageSchemas, StructuredData } from '@/lib/structured-data'

// SVG Editor with Structured Data
export function SVGEditorWithStructuredData({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const schemas = generateToolPageSchemas('editor', false)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      {children}
    </>
  )
}

// SVG Optimizer with Structured Data
export function SVGOptimizerWithStructuredData({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const schemas = generateToolPageSchemas('optimizer', false)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      {children}
    </>
  )
}

// SVG Animation Tool with Structured Data
export function SVGAnimatorWithStructuredData({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const schemas = generateToolPageSchemas('animator', false)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      {children}
    </>
  )
}

// SVG to Video Converter with Structured Data (Paid Tool)
export function SVGToVideoWithStructuredData({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const schemas = generateToolPageSchemas('video-converter', true)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      {children}
    </>
  )
}