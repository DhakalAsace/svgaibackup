# Schema Implementation TODO List

## 🔴 Critical Fixes (Completed)

- [x] **SVG to Video Tool** - Added Product schema with pricing
- [x] **MDX Blog Posts** - Added Article schema to both blog templates
- [x] **Organization Schema** - Fixed in root layout with proper @graph

## 🟡 High Priority Fixes Needed

### 1. AI Icon Generator Page
**File**: `/app/ai-icon-generator/page.tsx`  
**Current**: SoftwareApplication  
**Need**: Product schema
```json
{
  "@type": "Product",
  "name": "AI Icon Generator",
  "category": "Software > Graphics & Design > Icon Generators",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 2. SVG Editor Tool
**File**: `/app/tools/svg-editor/page.tsx`  
**Need**: Add SoftwareApplication schema

### 3. SVG Optimizer Tool
**File**: `/app/tools/svg-optimizer/page.tsx`  
**Need**: Add SoftwareApplication schema

## 🟢 Enhancement Opportunities

### Gallery Pages Schema
Add to all gallery pages (`/app/gallery/[theme]/page.tsx`):
```json
{
  "@type": "ImageGallery",
  "numberOfItems": 50,
  "associatedMedia": []
}
```

### Learn/Guide Pages
Add HowTo schema where appropriate

## 📝 Schema Validation Checklist

Before deploying:
1. [ ] Run `npm run validate-schema` (after adding script)
2. [ ] Test with Google Rich Results Test
3. [ ] Check Search Console for errors
4. [ ] Verify ratings are realistic
5. [ ] Ensure prices are accurate

## 🎯 Quick Wins

1. **Converter Pages**: Already have excellent schema ✅
2. **Blog Posts**: Now fixed with Article schema ✅
3. **Premium Tools**: SVG to Video now has Product schema ✅
4. **AI Tools**: Need Product schema for consistency

## 🚨 Common Mistakes to Avoid

1. Don't mix SoftwareApplication and Product schemas
2. Always include pricing info (even if free)
3. Use realistic ratings (4.7-4.9, not 5.0)
4. Include images for all Product schemas
5. Don't duplicate Organization schema