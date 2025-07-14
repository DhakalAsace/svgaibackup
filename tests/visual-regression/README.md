# Visual Consistency Testing

This directory contains Playwright tests for verifying visual consistency across gallery and learn pages.

## Overview

The visual consistency tests capture screenshots and measure various metrics to ensure:
- Consistent styling across pages
- Proper responsive behavior
- Accessibility compliance
- Performance standards

## Running Tests

### Quick Start
```bash
# Install Playwright (first time only)
npx playwright install

# Run all visual tests
npm run test:visual

# Run with UI mode (interactive)
npm run test:visual:ui

# Generate comprehensive report
npm run visual
```

### View Results
```bash
# Open HTML report
npm run test:visual:report

# View screenshots
ls tests/visual-regression/screenshots/
```

## Test Coverage

### Gallery Pages Tested
- `/gallery/heart-svg` - Heart SVG Collection
- `/gallery/hello-kitty-svg` - Hello Kitty SVG Collection  
- `/gallery/animal-svg` - Animal SVG Collection
- `/gallery/christmas-svg` - Christmas SVG Collection
- `/gallery/floral-svg` - Floral SVG Collection

### Learn Pages Tested
- `/learn/what-is-svg` - SVG basics
- `/learn/svg-file-format` - File format details
- `/learn/convert-png-to-svg` - Conversion guide
- `/learn/how-to-edit-svg-files` - Editing tutorial
- `/learn/svg-vs-png` - Format comparison

### Viewports Tested
- **Desktop**: 1920x1080
- **Tablet**: 768x1024
- **Mobile**: 375x812

## Metrics Collected

### Visual Metrics
- **Spacing**: Padding, margins for key sections
- **Colors**: Button colors, backgrounds, text colors
- **Typography**: Font sizes, line heights, weights
- **Accessibility**: Alt text, ARIA labels, skip links

### Performance Metrics
- **First Contentful Paint (FCP)**: Target < 3000ms
- **DOM Content Loaded**: Page load completion time
- **Layout Shifts**: Cumulative layout shift count

## File Structure

```
visual-regression/
├── screenshots/           # Captured screenshots
│   ├── desktop/          # Desktop viewport captures
│   ├── tablet/           # Tablet viewport captures
│   └── mobile/           # Mobile viewport captures
├── reports/              # JSON metrics for each test
├── html-report/          # Playwright HTML report
├── visual-consistency.spec.ts    # Main test file
├── visual-consistency-summary.json # Summary data
└── VISUAL_TEST_REPORT.md # Generated markdown report
```

## Common Issues & Solutions

### Performance Issues
- **High FCP**: Optimize images, lazy load content
- **Layout Shifts**: Set explicit dimensions for dynamic content

### Visual Inconsistencies  
- **Button Styles**: Check Tailwind classes consistency
- **Spacing**: Use consistent spacing utilities
- **Typography**: Verify heading hierarchy

### Accessibility Issues
- **Missing Alt Text**: Add descriptive alt attributes
- **Low Contrast**: Adjust color combinations
- **Missing Labels**: Add aria-label to interactive elements

## CI/CD Integration

To run in CI:
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps
  
- name: Run Visual Tests
  run: npm run test:visual
  
- name: Upload Screenshots
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-regression-screenshots
    path: tests/visual-regression/screenshots/
```

## Updating Tests

To add new pages:
1. Edit `visual-consistency.spec.ts`
2. Add to `galleryPages` or `learnPages` arrays
3. Run tests to generate new baselines
4. Review screenshots for accuracy

## Best Practices

1. **Run locally first**: Test changes before pushing
2. **Review screenshots**: Manually verify visual changes
3. **Update baselines**: When intentional changes are made
4. **Monitor trends**: Track performance over time
5. **Fix immediately**: Address issues as they're found