# Sitemap & Robots.txt Coherence Report

## 🚨 Issues Found

### 1. **Incorrect sourceDir**
- **Issue**: Line 4 has `sourceDir: '.next-build'` but we changed the build to use default `.next`
- **Fix**: Should be removed or changed to `.next`

### 2. **Gallery Incoherence**
- **Sitemap**: Excludes `/gallery/*` (line 37)
- **Transform**: Still has gallery priority logic (lines 120-128)
- **Issue**: The transform function will never run for galleries since they're excluded

### 3. **Duplicate Converter Logic**
- **additionalPaths** (lines 181-193): Manually adds 'ai-to-svg' and 'svg-to-png'
- **Transform** (lines 92-118): Has converter priority logic
- **Issue**: This creates duplicate entries or conflicts

### 4. **Missing Disallow Entries in Robots.txt**
Not in robots.txt but excluded from sitemap:
- `/404`, `/500`, `/_error`, `/_app`, `/_document`
- `/privacy-policy`, `/terms-of-service` (redirects)
- `/converters/`, `/convert/` (except specific ones)

### 5. **Convert Pages Confusion**
- Excludes all `/convert/*` then uses `!` to include specific ones
- Also uses `additionalPaths` to add the same converters
- This is redundant and confusing

## ✅ Recommendations

### 1. Fix sourceDir
```javascript
sourceDir: '.next', // or remove this line entirely
```

### 2. Remove Dead Code
Remove the gallery transform logic since galleries are excluded:
```javascript
// Remove lines 120-128 (gallery transform logic)
```

### 3. Simplify Converter Logic
Either use exclusion pattern OR additionalPaths, not both:
```javascript
// Option A: Keep exclusion pattern, remove additionalPaths
exclude: [
  // ... other exclusions
  '/convert/*',
  '!/convert/ai-to-svg',
  '!/convert/svg-to-png',
],
// Remove additionalPaths function

// Option B: Remove exclusion pattern, use additionalPaths only
```

### 4. Align Robots.txt
Add missing paths to robots.txt disallow:
```javascript
disallow: [
  // ... existing
  '/404',
  '/500',
  '/_error',
  '/converters/',
  '/convert/', // Then allow specific ones
],
```

### 5. Clean Up Transform Function
Remove logic for excluded paths (galleries) to avoid confusion.

The configuration works but has redundant and confusing patterns that should be cleaned up.