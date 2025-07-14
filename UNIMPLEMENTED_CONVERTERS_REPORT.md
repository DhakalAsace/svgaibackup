# Unimplemented Converters Report

## Overview
This report identifies converters that are marked as "supported" in the configuration but have implementation issues or limitations.

## Converters with Implementation Issues

### 1. **SVG to HEIC** (`/lib/converters/svg-to-heic.ts`)
- **Status**: Partially implemented with fallback
- **Issue**: HEIC encoding is not supported in browsers
- **Current behavior**: Outputs JPEG instead of HEIC
- **Message**: "Direct HEIC encoding is not supported in browsers. This creates a high-quality JPEG instead."
- **UI Note**: The page explicitly mentions this limitation to users

### 2. **SVG to GIF** (`/lib/converters/svg-to-gif.ts`)
- **Status**: Server-side only
- **Issue**: Requires Sharp library which is not available in browsers
- **Error**: `CLIENT_SIDE_NOT_SUPPORTED` - "SVG to GIF conversion requires server-side processing"
- **Impact**: Cannot be used as a free client-side converter

### 3. **SVG to BMP** (`/lib/converters/svg-to-bmp.ts`)
- **Status**: Likely server-side only (based on pattern)
- **Issue**: Similar to GIF converter, likely requires Sharp

### 4. **SVG to WebP** (`/lib/converters/svg-to-webp.ts`)
- **Status**: Potentially server-side only
- **Issue**: WebP encoding might require server-side libraries

### 5. **CDR to SVG** (`/lib/converters/cdr-to-svg.ts`)
- **Status**: Not implemented for client-side
- **Error**: `CDR_CLIENT_SIDE_NOT_SUPPORTED` - "CDR to SVG conversion requires server-side processing"
- **Reason**: CDR is a proprietary format requiring external tools like Inkscape

### 6. **PDF to SVG** (`/lib/converters/pdf-to-svg.ts`)
- **Status**: Potentially limited implementation
- **Issue**: PDF.js might have limitations for complex PDFs

### 7. **AVIF to SVG** (`/lib/converters/avif-to-svg.ts`)
- **Status**: Placeholder implementation
- **Current behavior**: Returns a placeholder SVG saying "Conversion available soon"
- **Issue**: Needs Sharp for AVIF decoding

### 8. **SVG to MP4** (`/lib/converters/svg-to-mp4.ts`)
- **Status**: Premium feature (as intended)
- **Note**: This is correctly marked as a paid feature

### 9. **SVG to PDF** (`/lib/converters/svg-to-pdf.ts`)
- **Status**: May have limitations
- **Issue**: PDF generation in browser has limitations

### 10. **SVG to AVIF** (`/lib/converters/svg-to-avif.ts`)
- **Status**: Likely server-side only
- **Issue**: AVIF encoding requires server-side libraries

## Summary

### Fully Client-Side Working Converters
- PNG to SVG (using potrace)
- SVG to PNG (using Canvas API)
- JPG to SVG (using potrace)
- WebP to SVG (if using client-side libraries)
- SVG to JPG (using Canvas API)
- SVG to ICO (using Canvas API)
- ICO to SVG
- Image to SVG (generic handler)

### Converters Requiring Server-Side Processing
- SVG to GIF (needs Sharp)
- SVG to BMP (needs Sharp)
- SVG to WebP (encoding)
- SVG to AVIF (encoding)
- CDR to SVG (proprietary format)
- AVIF to SVG (decoding)

### Converters with Limitations/Fallbacks
- SVG to HEIC (outputs JPEG instead)
- PDF to SVG (complex PDFs may fail)
- SVG to PDF (limited features)

## Recommendations

1. **Update Config**: Mark server-side only converters as `isSupported: false` or add a new field `requiresServer: true`

2. **User Communication**: Add clear messages on converter pages about limitations

3. **Progressive Implementation**: 
   - Phase 1: Focus on fully client-side converters
   - Phase 2: Add server endpoints for server-side converters
   - Phase 3: Implement premium features properly

4. **Alternative Approaches**:
   - For GIF/BMP/WebP: Consider using alternative client-side libraries
   - For HEIC: Continue with JPEG fallback but be transparent
   - For CDR: This will always require server-side processing

5. **Testing Priority**: Test all converters marked as working to ensure they actually function properly