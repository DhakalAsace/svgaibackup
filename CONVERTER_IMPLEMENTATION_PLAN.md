# Converter Implementation Plan

## Can Be Fixed (Client-Side Compatible)

### High Priority
1. **PDF to SVG** (Task 21) - Use PDF.js
2. **SVG to GIF** (Task 22) - Use gif.js library
3. **AI to SVG** (Task 27) - Fix file detection for .ai files

### Medium Priority
4. **SVG to BMP** (Task 23) - Use Canvas API
5. **WebP to SVG** (Task 25) - Canvas API + potrace
6. **SVG to WebP** (Task 25) - Canvas toBlob API
7. **DXF to SVG** (Task 28) - Improve parser
8. **SVG to ICO Multi-size** (Task 29) - Fix Canvas API usage

### Low Priority
9. **SVG to EMF** (Task 26) - Implement binary format
10. **Image to SVG Duplicate** (Task 30) - Remove from /tools page

## Cannot Be Fixed (Not Browser Compatible)

### Remove These
1. **CDR to SVG** - Proprietary format, needs server tools
2. **SVG to HEIC** - No browser encoding support (keep JPEG fallback)
3. **AVIF to SVG** - No browser decoding support yet
4. **SVG to AVIF** - No browser encoding support yet

## Deployment Strategy

Deploy 8 parallel sub-agents for the fixable converters:
- Agent 1: PDF to SVG (Task 21)
- Agent 2: SVG to GIF (Task 22)
- Agent 3: SVG to BMP (Task 23)
- Agent 4: WebP converters (Task 25)
- Agent 5: SVG to EMF (Task 26)
- Agent 6: AI to SVG fix (Task 27)
- Agent 7: DXF parser enhancement (Task 28)
- Agent 8: ICO multi-size fix (Task 29)