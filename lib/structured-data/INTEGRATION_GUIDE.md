# Structured Data Integration Guide

## Overview

This guide explains how to integrate the structured data schemas into SVG AI's pages. The implementation provides comprehensive JSON-LD structured data for better SEO and rich results in search engines.

## Quick Start

### 1. For Converter Pages

Update `/app/convert/[converter]/page.tsx`:

```tsx
import { generateConverterPageSchemas, StructuredData } from '@/lib/structured-data'

export default async function ConverterPage({ params }: ConverterPageProps) {
  const { converter: converterSlug } = await params
  const converter = getConverterBySlug(converterSlug)
  
  if (!converter) {
    notFound()
  }

  // Generate structured data schemas
  const schemas = generateConverterPageSchemas(converter)

  return (
    <>
      {/* Add structured data */}
      <StructuredData schemas={schemas} />
      
      {/* Existing converter component */}
      <ConverterPageWrapper config={converter} />
    </>
  )
}
```

### 2. For Tool Pages

Update tool page components (e.g., `/app/tools/svg-editor/page.tsx`):

```tsx
import { generateToolPageSchemas, StructuredData } from '@/lib/structured-data'

export default function SVGEditorPage() {
  const schemas = generateToolPageSchemas('editor', false)
  
  return (
    <>
      <StructuredData schemas={schemas} />
      <EditorWrapper />
    </>
  )
}
```

### 3. For Pages with FAQs

```tsx
import { generateFAQSchema, StructuredData } from '@/lib/structured-data'

const faqs = [
  {
    question: 'How does the converter work?',
    answer: 'Our converter uses advanced algorithms...'
  }
]

const faqSchema = generateFAQSchema(faqs)

return <StructuredData schemas={[faqSchema]} />
```

## Schemas Included

### 1. SoftwareApplication Schema
- Applied to all 40 converters
- Applied to all tools (Editor, Optimizer, Animation, Video)
- Includes ratings, features, pricing, and requirements

### 2. Organization Schema
- Defines SVG AI as the publisher
- Includes logo, contact info, and social profiles

### 3. WebSite Schema
- Includes search action for site search
- Links to organization

### 4. BreadcrumbList Schema
- Automatically generated for all tool/converter pages
- Improves navigation in search results

### 5. HowTo Schema
- Added to converter pages
- Step-by-step conversion instructions

### 6. FAQPage Schema
- Can be added to any page with FAQs
- Improves visibility in search results

## Implementation Checklist

### Converter Pages (40 total)
- [ ] png-to-svg
- [ ] svg-to-png
- [ ] jpg-to-svg
- [ ] svg-to-jpg
- [ ] svg-converter
- [ ] webp-to-svg
- [ ] svg-to-pdf
- [ ] gif-to-svg
- [ ] svg-to-webp
- [ ] bmp-to-svg
- [ ] svg-to-gif
- [ ] svg-to-base64
- [ ] ico-to-svg
- [ ] svg-to-ico
- [ ] svg-to-bmp
- [ ] tiff-to-svg
- [ ] svg-to-tiff
- [ ] eps-to-svg
- [ ] svg-to-eps
- [ ] svg-to-dxf
- [ ] dxf-to-svg
- [ ] ai-to-svg
- [ ] cdr-to-svg
- [ ] pdf-to-svg
- [ ] svg-to-html
- [ ] html-to-svg
- [ ] svg-to-mp4
- [ ] avif-to-svg
- [ ] svg-to-avif
- [ ] ttf-to-svg
- [ ] stl-to-svg
- [ ] svg-to-stl
- [ ] image-to-svg
- [ ] batch-svg-to-png
- [ ] batch-png-to-svg
- [ ] svg-optimizer
- [ ] svg-to-lottie
- [ ] svg-to-font
- [ ] svg-to-react
- [ ] svg-to-xml

### Tool Pages
- [ ] /tools/svg-editor
- [ ] /tools/svg-optimizer
- [ ] /animate (SVG Animation Tool)
- [ ] /tools/svg-to-video (Paid)

### Other Pages
- [ ] Homepage (Organization + WebSite schemas)
- [ ] Learn pages (with relevant schemas)
- [ ] Gallery pages (with ImageGallery schema)

## Advanced Usage

### Combining Multiple Schemas

```tsx
import { 
  generateConverterPageSchemas,
  generateFAQSchema,
  combineSchemas,
  StructuredData
} from '@/lib/structured-data'

const converterSchemas = generateConverterPageSchemas(config)
const faqSchema = generateFAQSchema(faqs)
const allSchemas = combineSchemas([...converterSchemas, faqSchema])

return <StructuredData schemas={allSchemas} />
```

### Dynamic Schema Generation

```tsx
// Based on page content
const schemas = []

// Always add base schemas
schemas.push(...generateToolPageSchemas('editor'))

// Conditionally add schemas
if (pageHasFAQ) {
  schemas.push(generateFAQSchema(faqData))
}

if (pageHasVideo) {
  schemas.push(generateVideoSchema(videoData))
}

return <StructuredData schemas={schemas} />
```

## Testing

### 1. Google Rich Results Test
- Visit: https://search.google.com/test/rich-results
- Enter your page URL
- Verify all schemas are detected

### 2. Schema Markup Validator
- Visit: https://validator.schema.org/
- Paste the generated JSON-LD
- Check for validation errors

### 3. Browser DevTools
- Inspect the page source
- Look for `<script type="application/ld+json">`
- Verify the JSON structure

## Best Practices

1. **Keep schemas up to date** - Update dateModified when content changes
2. **Use real data** - Ratings and reviews should reflect actual user feedback
3. **Test thoroughly** - Use Google's testing tools before deployment
4. **Monitor performance** - Check Search Console for schema errors
5. **Be accurate** - Don't include features or properties that don't exist

## Performance Considerations

- Schemas are generated at build time for static pages
- Minimal runtime overhead (just JSON serialization)
- No external requests required
- Schemas are cached with the page

## Future Enhancements

1. **Review Schema** - Add individual reviews to tools
2. **Event Schema** - For webinars or tutorials
3. **Course Schema** - For learning content
4. **Product Schema** - For premium features
5. **LocalBusiness Schema** - If physical presence added