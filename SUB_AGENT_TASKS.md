# Sub-Agent Task Queue - Ready to Spawn

## How to Use This Queue
1. Copy the exact prompt for each sub-agent task
2. Spawn using Task tool
3. Mark as complete when sub-agent returns
4. Review output before integration

## Priority 1: SEO Content Blitz (0-10% Context)

### 🚀 Sub-Agent Task 1: Top 5 Converter Placeholders
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Create Next.js placeholder pages for these 5 converters:

1. /app/convert/png-to-svg/page.tsx
   - Keyword: 'png to svg' (40,500 searches/month)
   - Also target: 'convert png to svg' (8,100), 'png to svg converter' (8,100)

2. /app/convert/svg-to-png/page.tsx  
   - Keyword: 'svg to png' (33,100 searches/month)
   - Also target: 'convert svg to png' (6,600), 'turn svg into png' (9,900)

3. /app/convert/svg-converter/page.tsx
   - Keyword: 'svg converter' (33,100 searches/month)
   - Also target: 'convert to svg' (5,400)

4. /app/convert/jpg-to-svg/page.tsx
   - Keyword: 'jpg to svg' (12,100 searches/month)
   - Also target: 'jpg to svg converter' (6,600), 'convert jpg to svg' (4,400)

5. /app/convert/image-to-svg/page.tsx
   - Keyword: 'convert image to svg' (8,100 searches/month)
   - Also target: 'image to svg generator' (2,400)

Requirements:
- Full generateMetadata() with SEO optimization
- 2000+ words of content about the conversion process
- HowTo schema markup
- Email capture form with 'Notify when ready' CTA
- Placeholder UI showing 'Converter coming soon'
- Internal links to related converters

Return: 5 complete page.tsx files ready to deploy"
```

### 🚀 Sub-Agent Task 2: Learn Pages Batch 1
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Create MDX educational content for:

1. /content/learn/what-is-svg.mdx
   - Target: 'svg' (33,100 searches/month)
   - Cover: Definition, history, advantages, use cases
   - Include: Interactive examples, comparisons with raster formats

2. /content/learn/svg-file.mdx
   - Target: 'svg file' (14,800 searches/month)
   - Cover: File structure, XML syntax, common elements
   - Include: Downloadable examples, viewer recommendations

3. /content/learn/svg-file-format.mdx
   - Target: 'svg file format' (9,900 searches/month)
   - Cover: Technical specification, attributes, compatibility
   - Include: Browser support table, optimization tips

Requirements:
- 2000+ words each
- Include code examples with syntax highlighting
- Add images from /public/blog/
- Internal links to upcoming converter tools
- FAQ section targeting related queries

Reference: /content/blog/ for MDX structure
Return: 3 complete MDX files with frontmatter"
```

### 🚀 Sub-Agent Task 3: Gallery Placeholders High-Traffic
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Create gallery placeholder pages for top 5 themes:

1. /app/gallery/heart-svg/page.tsx (9,900 searches)
2. /app/gallery/hello-kitty-svg/page.tsx (4,400 searches)
3. /app/gallery/svg-download/page.tsx (4,400 searches)
4. /app/gallery/bluey-svg/page.tsx (2,900 searches)
5. /app/gallery/svg-icons/page.tsx (2,900 searches)

Each page needs:
- SEO title: 'Free [Theme] SVG Files - Download [Year]'
- Meta description focusing on free downloads
- Placeholder grid showing 'Gallery coming soon'
- Email capture: 'Get notified when [theme] SVGs are available'
- Content about the theme and use cases (1000+ words)
- Schema markup for ImageGallery

Return: 5 complete gallery page.tsx files"
```

## Priority 2: Remaining Converters (10-15% Context)

### 🚀 Sub-Agent Task 4: Converters 6-15
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Create placeholder pages for converters 6-15:

6. /app/convert/svg-to-jpg/page.tsx - 'svg to jpg' (5,400 searches)
7. /app/convert/jpeg-to-svg/page.tsx - 'jpeg to svg' (4,400 searches)
8. /app/convert/svg-to-pdf/page.tsx - 'svg to pdf' (2,900 searches)
9. /app/convert/eps-to-svg/page.tsx - 'eps to svg' (2,400 searches)
10. /app/convert/svg-to-dxf/page.tsx - 'svg to dxf' (2,400 searches)
11. /app/convert/best-svg-converters/page.tsx - 'best svg converter' (1,600 searches)
12. /app/convert/svg-to-stl/page.tsx - 'svg to stl' (1,600 searches)
13. /app/convert/webp-to-svg/page.tsx - 'webp to svg' (1,300 searches)
14. /app/convert/svg-to-ico/page.tsx - 'svg to ico' (1,300 searches)
15. /app/convert/svg-to-webp/page.tsx - 'svg to webp' (1,300 searches)

Same requirements as Task 1.
Return: 10 complete page.tsx files"
```

### 🚀 Sub-Agent Task 5: Technical Research - Converter Libraries
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Research and provide implementation examples for:

1. PNG/JPG/JPEG to SVG conversion
   - Library: potrace
   - Create working client-side example
   - Handle image upload and processing

2. SVG to raster formats (PNG/JPG/WebP)
   - Use Canvas API
   - Create conversion functions
   - Handle different output formats

3. SVG to PDF conversion
   - Research best client-side library
   - Provide implementation example
   - Consider file size limitations

4. Format validation
   - Create validators for each file type
   - Error handling examples
   - File size and dimension checks

Return: Working code examples for each converter type with clear integration instructions"
```

## Priority 3: Content & Features (15-20% Context)

### 🚀 Sub-Agent Task 6: Remaining Learn Pages
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Create remaining 9 learn pages:

4. /content/learn/convert-svg-to-png-windows.mdx (1,900 searches)
5. /content/learn/best-svg-converters.mdx (1,600 searches)
6. /content/learn/convert-png-to-svg.mdx (1,000 + 590 searches)
7. /content/learn/batch-svg-to-png.mdx (720 searches)
8. /content/learn/html-string-to-svg-js.mdx (590 searches)
9. /content/learn/check-svg-animation.mdx (320 searches)
10. /content/learn/react-native-svg-animation.mdx (90 searches)
11. /content/learn/svg-css-animation.mdx (90 searches)
12. /content/learn/batch-conversion-guide.mdx (tutorial)

Focus on tutorial-style content with code examples.
Return: 9 MDX files completing the learn section"
```

### 🚀 Sub-Agent Task 7: Remaining Galleries
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Create remaining 14 gallery placeholder pages:

6. /app/gallery/felt-flower-center-svg/page.tsx (2,900 searches)
7. /app/gallery/beavis-butthead-svg/page.tsx (1,900 searches)
8. /app/gallery/graduation-cap-svg/page.tsx (1,300 searches)
9. /app/gallery/happy-birthday-svg/page.tsx (1,300 searches)
10. /app/gallery/mama-svg/page.tsx (1,300 searches)
11. /app/gallery/paw-print-svg/page.tsx (1,300 searches)
12. /app/gallery/stability-ability-svg/page.tsx (1,300 searches)
13. /app/gallery/anime-svg/page.tsx (390 + 260 searches)
14. /app/gallery/bride-to-be-svg/page.tsx (390 searches)
15. /app/gallery/give-it-to-god-svg/page.tsx (320 searches)
16. /app/gallery/give-it-to-god-lion-svg/page.tsx (320 searches)
17. /app/gallery/back-to-school-svg/page.tsx (260 searches)
18. /app/gallery/animal-svg/page.tsx (210 searches)
19. /app/gallery/[theme]/page.tsx (dynamic catch-all)

Return: 14 gallery pages completing the set"
```

### 🚀 Sub-Agent Task 8: SEO Content for Converters
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Write detailed MDX content for each converter:

Create /content/converters/[converter-name].mdx for:
- png-to-svg-guide.mdx
- svg-to-png-guide.mdx
- jpg-to-svg-guide.mdx
- svg-optimization-guide.mdx
- batch-conversion-guide.mdx

Each guide should:
- 3000+ words of comprehensive content
- Step-by-step tutorials
- Troubleshooting sections
- Performance optimization tips
- Links to the converter tool

Return: 5 comprehensive converter guides"
```

## Tracking Template

```markdown
## Sub-Agent Task Tracking

### Completed
- [ ] Task 1: Top 5 Converter Placeholders
- [ ] Task 2: Learn Pages Batch 1
- [ ] Task 3: Gallery Placeholders High-Traffic
- [ ] Task 4: Converters 6-15
- [ ] Task 5: Technical Research
- [ ] Task 6: Remaining Learn Pages
- [ ] Task 7: Remaining Galleries
- [ ] Task 8: SEO Content for Converters

### Metrics
- Total Pages Created: 0/100+
- Search Volume Covered: 0/250,000+
- Sub-Agents Spawned: 0/8
- Content Words Written: 0/200,000+
```

## Integration Checklist

After each sub-agent returns:
1. Review output for quality
2. Check adherence to requirements
3. Validate no modifications to /content/blog/
4. Test build locally
5. Commit with descriptive message
6. Update tracking metrics