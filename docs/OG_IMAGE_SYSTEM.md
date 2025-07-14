# SVG AI - Open Graph Image System Documentation

## Overview

The SVG AI OG Image System provides dynamic, visually compelling social media preview images for all pages across the platform. These images are generated on-the-fly using SVG templates and converted to PNG format for maximum compatibility.

## Architecture

### Components

1. **SVG Templates** (`/components/seo/og-image-templates.tsx`)
   - `ConverterOGImageTemplate` - For converter pages
   - `ToolOGImageTemplate` - For tool pages
   - `LearnOGImageTemplate` - For educational content
   - `GalleryOGImageTemplate` - For gallery pages
   - `AIGenerationOGImageTemplate` - For AI generation features

2. **API Endpoints**
   - `/api/og-image/[converter]` - Dynamic converter OG images
   - `/api/og` - Generic OG images with query parameters

3. **Metadata Helpers** (`/lib/seo/social-meta.ts`)
   - `generateSocialMeta()` - Generic social metadata
   - `generateToolSocialMeta()` - Tool-specific metadata
   - `generateLearnSocialMeta()` - Learn page metadata
   - `generateGallerySocialMeta()` - Gallery metadata

## Usage Examples

### 1. Converter Pages

Converter pages automatically get OG images through the metadata generator:

```typescript
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("png-to-svg")!
export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)
```

This generates:
- OG image: `https://svgai.org/api/og-image/png-to-svg`
- Twitter card: Large image format
- All social meta tags

### 2. Tool Pages

```typescript
import { generateToolSocialMeta } from '@/lib/seo/social-meta'

export const metadata = generateToolSocialMeta(
  'SVG Editor',
  'Edit SVG code with real-time preview',
  ['Syntax highlighting', 'Instant validation', 'Code completion'],
  false // isPremium
)
```

### 3. Learn Pages

```typescript
import { generateLearnSocialMeta } from '@/lib/seo/social-meta'

export const metadata = generateLearnSocialMeta(
  'What is SVG? Complete Guide',
  'Fundamentals',
  '10 min',
  ['SVG basics', 'File format', 'Browser support']
)
```

### 4. Gallery Pages

```typescript
import { generateGallerySocialMeta } from '@/lib/seo/social-meta'

export const metadata = generateGallerySocialMeta(
  'Hearts',
  'Heart SVG Collection',
  'Beautiful heart designs for any project',
  100
)
```

## API Reference

### Generic OG Image Endpoint

`GET /api/og`

Query Parameters:
- `type`: 'tool' | 'learn' | 'gallery' | 'ai'
- Tool params:
  - `name`: Tool name
  - `desc`: Description
  - `feat`: Features (can be repeated)
  - `premium`: 'true' | 'false'
- Learn params:
  - `title`: Page title
  - `cat`: Category
  - `time`: Read time
  - `topic`: Topics (can be repeated)
- Gallery params:
  - `theme`: Gallery theme
  - `title`: Gallery title
  - `desc`: Description
  - `count`: Number of examples

Example:
```
/api/og?type=tool&name=SVG Editor&desc=Edit SVG code&feat=Real-time preview&feat=Syntax highlighting
```

### Converter OG Image Endpoint

`GET /api/og-image/[converter]`

Parameters:
- `converter`: URL slug of the converter (e.g., 'png-to-svg')

Example:
```
/api/og-image/png-to-svg
```

## Design Guidelines

### Visual Hierarchy

1. **Brand Consistency**
   - Always include SVG AI logo and brand colors
   - Use consistent typography (Montserrat)
   - Maintain brand accent line on left edge

2. **Content Focus**
   - Clear, large title text
   - Descriptive subtitle
   - Visual representation of functionality
   - Call-to-action elements (FREE/PREMIUM badges)

3. **Color Scheme**
   - Primary: #FF7043 (Orange)
   - Secondary: #4E342E (Brown)
   - Success: #00B894 (Green)
   - Info: #2196F3 (Blue)
   - Background: #FFF8E1 (Cream)

### Template Specifications

- **Dimensions**: 1200x630px (Facebook/Twitter standard)
- **File Format**: PNG (converted from SVG)
- **Optimization**: Edge runtime for fast generation
- **Caching**: Automatic via Vercel Edge Network

## Testing

### Local Testing

1. Start development server:
   ```bash
   npm run dev
   ```

2. View OG image preview page:
   ```
   http://localhost:3000/api/og/preview
   ```

3. Run automated tests:
   ```bash
   npm run test:og-images
   ```

### Social Media Validators

Test your OG images with these tools:

1. **Facebook Debugger**
   - https://developers.facebook.com/tools/debug/
   - Tests Open Graph tags
   - Shows preview

2. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Tests Twitter Cards
   - Preview different card types

3. **LinkedIn Inspector**
   - https://www.linkedin.com/post-inspector/
   - Tests LinkedIn previews
   - Cache clearing option

4. **OpenGraph.xyz**
   - https://www.opengraph.xyz/
   - General OG testing
   - Multiple platform previews

## Best Practices

1. **Performance**
   - Use edge runtime for fastest generation
   - Implement proper caching headers
   - Optimize SVG complexity

2. **SEO Impact**
   - Increases click-through rates from social shares
   - Improves brand recognition
   - Enhances content discoverability

3. **Accessibility**
   - Include descriptive alt text
   - Ensure sufficient color contrast
   - Use readable font sizes

4. **Maintenance**
   - Regular testing of all endpoints
   - Monitor generation performance
   - Update templates seasonally

## Troubleshooting

### Common Issues

1. **Images not updating**
   - Social platforms cache OG images
   - Use platform debuggers to clear cache
   - Add cache-busting query parameters

2. **Generation errors**
   - Check console logs in `/api/og` endpoints
   - Verify all required parameters
   - Ensure SVG syntax is valid

3. **Performance issues**
   - Monitor edge function execution time
   - Simplify complex SVG paths
   - Use static generation where possible

## Future Enhancements

1. **A/B Testing**
   - Multiple template variations
   - Performance tracking
   - Conversion optimization

2. **Personalization**
   - User-specific previews
   - Localized content
   - Dynamic data integration

3. **Advanced Features**
   - Animated SVG to GIF conversion
   - Multiple aspect ratios
   - Dark mode variants

## Support

For issues or questions:
- Create an issue in the repository
- Contact: support@svgai.org
- Documentation: https://svgai.org/docs/og-images