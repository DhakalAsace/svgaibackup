# Enhanced Validation System for SVG AI Converters

## Overview

The validation system provides comprehensive validation and error handling for all 40 converter types, ensuring safe and reliable file conversions with user-friendly error messages.

## Key Features

### 1. Format-Specific Validation

- **Magic Byte Detection**: Validates file headers for all binary formats
- **Structure Validation**: Checks internal file structure (IHDR for PNG, markers for JPEG, etc.)
- **Dimension Limits**: Format-specific maximum dimensions (e.g., 256x256 for ICO, 10000x10000 for PNG)
- **Size Limits**: Appropriate limits per format (1MB for ICO, 200MB for MP4, etc.)

### 2. Security Validation

- **SVG Security**: Blocks scripts, event handlers, external references
- **Content Sanitization**: Removes potentially dangerous elements
- **Path Validation**: Prevents directory traversal attacks
- **MIME Type Verification**: Validates actual content matches declared type

### 3. Enhanced Error Handling

#### Error Classes

```typescript
- FileValidationError: Basic file validation failures
- FileSizeError: File exceeds size limits (includes actual/max sizes)
- UnsupportedFormatError: Format not supported for conversion
- CorruptedFileError: File structure is invalid
- DimensionError: Image dimensions exceed limits
- InvalidParameterError: Invalid conversion parameters
- SecurityError: Security policy violations
```

#### User-Friendly Messages

Each error includes:
- Clear explanation of the problem
- Specific details (actual vs. allowed values)
- Recovery suggestions
- Format-specific tips

### 4. Conversion Parameter Validation

- **Dimensions**: Validates width/height within format limits
- **Quality**: Ensures quality is between 1-100
- **DPI**: Validates DPI between 72-2400
- **Page Numbers**: Validates PDF page selection
- **Format-Specific**: Custom validation per conversion type

## Usage Examples

### Basic File Validation

```typescript
import { validateFile } from './validation'

const validation = validateFile(buffer, {
  allowedFormats: ['png', 'jpg'],
  targetFormat: 'svg'
})

if (!validation.isValid) {
  console.error(validation.error)
}
```

### Comprehensive Validation in Converter

```typescript
import { validateConversion } from './validation-utils'

export const myConverter: ConversionHandler = async (input, options) => {
  // Validates everything: format, size, dimensions, parameters
  const buffer = await validateConversion(input, 'png', 'svg', options)
  
  // Proceed with conversion...
}
```

### Error Handling with Recovery Suggestions

```typescript
import { createDetailedErrorResponse } from './errors'

try {
  // Conversion attempt
} catch (error) {
  const response = createDetailedErrorResponse(error)
  // Returns user-friendly message with recovery suggestions
  return response
}
```

## Format-Specific Limits

### Image Formats
- **PNG**: 20MB, 10000x10000 pixels
- **JPEG**: 15MB, 10000x10000 pixels
- **GIF**: 10MB, 5000x5000 pixels
- **WebP**: 15MB, 16383x16383 pixels
- **BMP**: 50MB, 10000x10000 pixels
- **ICO**: 1MB, 256x256 pixels
- **TIFF**: 50MB, 30000x30000 pixels
- **AVIF**: 10MB, 10000x10000 pixels

### Vector Formats
- **SVG**: 5MB, 100000x100000 units
- **EPS**: 25MB, 20000x20000 units
- **AI**: 50MB, 20000x20000 units
- **PDF**: 100MB, 20000x20000 units
- **DXF**: 25MB, 50000x50000 units
- **CDR**: 50MB, 20000x20000 units

### Special Formats
- **STL**: 100MB (3D models)
- **MP4**: 200MB, 4096x2160 pixels (4K)
- **HTML**: 5MB
- **TTF**: 10MB (fonts)

## Security Considerations

### SVG Files
- Scripts blocked: `<script>`, `javascript:`
- Event handlers blocked: `onclick`, `onload`, etc.
- External references blocked: remote `href`, `src`
- Dangerous elements blocked: `<iframe>`, `<object>`, `<embed>`

### General Security
- File size limits prevent DoS attacks
- Dimension limits prevent memory exhaustion
- Content validation prevents XSS attacks
- Path sanitization prevents directory traversal

## Environment Configuration

```env
# Basic Settings
CONVERTER_MAX_FILE_SIZE=104857600  # 100MB default
CONVERTER_ALLOWED_FORMATS=png,jpg,jpeg,gif,webp,bmp,svg,pdf,ico,tiff,eps,ai,dxf,stl,avif,cdr,mp4,html,ttf

# Advanced Settings
CONVERTER_MAX_DIMENSIONS=10000x10000
CONVERTER_ENABLE_SECURITY_CHECKS=true
CONVERTER_TIMEOUT_MS=30000
CONVERTER_ENABLE_DETAILED_ERRORS=true
```

## Integration Guide

### 1. Update Existing Converters

```typescript
// Before
export const pngToSvgHandler: ConversionHandler = async (input, options) => {
  const buffer = typeof input === 'string' 
    ? Buffer.from(input, 'base64') 
    : input
  // Basic validation...
}

// After
export const pngToSvgHandler: ConversionHandler = async (input, options) => {
  const buffer = await validateConversion(input, 'png', 'svg', options)
  // All validation handled, proceed with conversion
}
```

### 2. Handle Errors Gracefully

```typescript
import { getUserFriendlyError, createDetailedErrorResponse } from './errors'

// In API routes
export async function POST(request: Request) {
  try {
    // Conversion logic
  } catch (error) {
    const response = createDetailedErrorResponse(error)
    return Response.json(response, { 
      status: error instanceof ConverterError ? error.statusCode : 500 
    })
  }
}

// In client components
try {
  // Conversion logic
} catch (error) {
  toast.error(getUserFriendlyError(error))
}
```

### 3. Progress Reporting

```typescript
import { createProgressReporter } from './validation-utils'

const progress = createProgressReporter(options.onProgress)

progress.report(0.1)  // 10%
progress.reportStep(2, 5)  // Step 2 of 5 = 40%
```

## Testing Validation

The validation system handles edge cases:

1. **Empty files**: Clear error message
2. **Corrupted files**: Detects missing markers/chunks
3. **Wrong extension**: Warns but processes by content
4. **Malicious content**: Blocks and reports security issues
5. **Oversized files**: Reports size with limits
6. **Invalid parameters**: Explains valid ranges

## Benefits

1. **Consistency**: Same validation across all 40 converters
2. **Security**: Comprehensive security checks
3. **User Experience**: Clear, actionable error messages
4. **Performance**: Early validation prevents wasted processing
5. **Reliability**: Catches edge cases before they cause crashes
6. **Maintainability**: Centralized validation logic