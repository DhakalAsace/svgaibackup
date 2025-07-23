import { test, expect, Page } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
// Configuration
const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];
const galleryPages = [
  { url: '/gallery/heart-svg', name: 'heart-svg' },
  { url: '/gallery/hello-kitty-svg', name: 'hello-kitty-svg' },
  { url: '/gallery/animal-svg', name: 'animal-svg' },
  { url: '/gallery/christmas-svg', name: 'christmas-svg' },
  { url: '/gallery/floral-svg', name: 'floral-svg' }
];
const learnPages = [
  { url: '/learn/what-is-svg', name: 'what-is-svg' },
  { url: '/learn/svg-file-format', name: 'svg-file-format' },
  { url: '/learn/convert-png-to-svg', name: 'convert-png-to-svg' },
  { url: '/learn/how-to-edit-svg-files', name: 'how-to-edit-svg-files' },
  { url: '/learn/svg-vs-png', name: 'svg-vs-png' }
];
// Helper functions
async function captureElementScreenshot(
  page: Page,
  selector: string,
  filename: string,
  viewport: typeof viewports[0]
) {
  const element = await page.locator(selector).first();
  if (await element.count() > 0) {
    await element.screenshot({
      path: `tests/visual-regression/screenshots/${viewport.name}/${filename}`,
      animations: 'disabled'
    });
  }
}
async function measureVisualMetrics(page: Page) {
  return await page.evaluate(() => {
    const metrics = {
      spacing: {} as Record<string, number>,
      colors: {} as Record<string, string>,
      typography: {} as Record<string, any>,
      accessibility: {} as Record<string, any>
    };
    // Measure spacing consistency
    const elements = {
      heroSection: document.querySelector('.hero-section'),
      ctaSection: document.querySelector('[class*="cta"]'),
      gridSection: document.querySelector('[class*="grid"]'),
      contentSection: document.querySelector('main > div')
    };
    for (const [name, element] of Object.entries(elements)) {
      if (element) {
        const styles = window.getComputedStyle(element);
        metrics.spacing[name] = {
          paddingTop: parseInt(styles.paddingTop),
          paddingBottom: parseInt(styles.paddingBottom),
          marginTop: parseInt(styles.marginTop),
          marginBottom: parseInt(styles.marginBottom)
        };
      }
    }
    // Measure color consistency
    const buttons = document.querySelectorAll('button, a[class*="button"]');
    buttons.forEach((button, index) => {
      const styles = window.getComputedStyle(button);
      metrics.colors[`button${index}`] = {
        background: styles.backgroundColor,
        color: styles.color,
        border: styles.borderColor
      };
    });
    // Measure typography consistency
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach((heading, index) => {
      const styles = window.getComputedStyle(heading);
      metrics.typography[`${heading.tagName.toLowerCase()}${index}`] = {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        fontWeight: styles.fontWeight,
        marginBottom: styles.marginBottom
      };
    });
    // Check accessibility
    metrics.accessibility.hasSkipLink = !!document.querySelector('a[href="#main"]');
    metrics.accessibility.imagesWithAlt = document.querySelectorAll('img:not([alt])').length === 0;
    metrics.accessibility.buttonsWithAriaLabels = Array.from(document.querySelectorAll('button')).every(
      btn => btn.textContent?.trim() || btn.getAttribute('aria-label')
    );
    return metrics;
  });
}
async function checkPerformanceMetrics(page: Page) {
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      // Check for layout shifts
      layoutShifts: performance.getEntriesByType('layout-shift').length
    };
  });
  return metrics;
}
// Test setup
test.describe('Visual Consistency Tests', () => {
  // Create screenshot directories
  test.beforeAll(async () => {
    for (const viewport of viewports) {
      const dir = `tests/visual-regression/screenshots/${viewport.name}`;
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
    // Create reports directory
    if (!existsSync('tests/visual-regression/reports')) {
      mkdirSync('tests/visual-regression/reports', { recursive: true });
    }
  });
  // Gallery Pages Tests
  test.describe('Gallery Pages', () => {
    for (const page of galleryPages) {
      for (const viewport of viewports) {
        test(`${page.name} - ${viewport.name}`, async ({ page: playwrightPage }) => {
          // Set viewport
          await playwrightPage.setViewportSize(viewport);
          // Navigate to page
          await playwrightPage.goto(page.url, { waitUntil: 'networkidle' });
          // Capture full page screenshot
          await playwrightPage.screenshot({
            path: `tests/visual-regression/screenshots/${viewport.name}/${page.name}-full.png`,
            fullPage: true,
            animations: 'disabled'
          });
          // Capture specific sections
          await captureElementScreenshot(
            playwrightPage, 
            'h1', 
            `${page.name}-hero.png`, 
            viewport
          );
          await captureElementScreenshot(
            playwrightPage,
            '[class*="grid"]',
            `${page.name}-grid.png`,
            viewport
          );
          await captureElementScreenshot(
            playwrightPage,
            '[class*="cta"], [class*="CTA"]',
            `${page.name}-cta.png`,
            viewport
          );
          // Measure visual metrics
          const metrics = await measureVisualMetrics(playwrightPage);
          // Check performance
          const perfMetrics = await checkPerformanceMetrics(playwrightPage);
          // Store metrics for reporting
          const reportData = {
            page: page.name,
            viewport: viewport.name,
            metrics,
            performance: perfMetrics,
            timestamp: new Date().toISOString()
          };
          writeFileSync(
            `tests/visual-regression/reports/${page.name}-${viewport.name}.json`,
            JSON.stringify(reportData, null, 2)
          );
          // Visual assertions
          expect(perfMetrics.firstContentfulPaint).toBeLessThan(3000);
          expect(perfMetrics.layoutShifts).toBeLessThan(5);
        });
      }
    }
  });
  // Learn Pages Tests
  test.describe('Learn Pages', () => {
    for (const page of learnPages) {
      for (const viewport of viewports) {
        test(`${page.name} - ${viewport.name}`, async ({ page: playwrightPage }) => {
          // Set viewport
          await playwrightPage.setViewportSize(viewport);
          // Navigate to page
          await playwrightPage.goto(page.url, { waitUntil: 'networkidle' });
          // Capture full page screenshot
          await playwrightPage.screenshot({
            path: `tests/visual-regression/screenshots/${viewport.name}/${page.name}-full.png`,
            fullPage: true,
            animations: 'disabled'
          });
          // Capture specific sections
          await captureElementScreenshot(
            playwrightPage,
            'article > h1, main > h1',
            `${page.name}-header.png`,
            viewport
          );
          await captureElementScreenshot(
            playwrightPage,
            '[class*="table-of-contents"], nav[aria-label*="contents"]',
            `${page.name}-toc.png`,
            viewport
          );
          await captureElementScreenshot(
            playwrightPage,
            'pre, [class*="code"]',
            `${page.name}-code.png`,
            viewport
          );
          await captureElementScreenshot(
            playwrightPage,
            '[class*="cta"], [class*="CTA"]',
            `${page.name}-cta.png`,
            viewport
          );
          // Measure visual metrics
          const metrics = await measureVisualMetrics(playwrightPage);
          // Check performance
          const perfMetrics = await checkPerformanceMetrics(playwrightPage);
          // Store metrics for reporting
          const reportData = {
            page: page.name,
            viewport: viewport.name,
            metrics,
            performance: perfMetrics,
            timestamp: new Date().toISOString()
          };
          writeFileSync(
            `tests/visual-regression/reports/${page.name}-${viewport.name}.json`,
            JSON.stringify(reportData, null, 2)
          );
          // Visual assertions
          expect(perfMetrics.firstContentfulPaint).toBeLessThan(3000);
          expect(perfMetrics.layoutShifts).toBeLessThan(5);
        });
      }
    }
  });
  // Cross-page consistency tests
  test.describe('Cross-Page Consistency', () => {
    test('Button styles consistency', async ({ page }) => {
      const buttonStyles: Record<string, any> = {};
      // Check gallery pages
      for (const galleryPage of galleryPages.slice(0, 3)) {
        await page.goto(galleryPage.url);
        const styles = await page.evaluate(() => {
          const button = document.querySelector('button, a[class*="button"]');
          if (button) {
            const computed = window.getComputedStyle(button);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              padding: computed.padding,
              borderRadius: computed.borderRadius,
              fontSize: computed.fontSize
            };
          }
          return null;
        });
        if (styles) {
          buttonStyles[galleryPage.name] = styles;
        }
      }
      // Compare styles
      const styleValues = Object.values(buttonStyles);
      if (styleValues.length > 1) {
        const firstStyle = styleValues[0];
        for (const style of styleValues.slice(1)) {
          expect(style.backgroundColor).toBe(firstStyle.backgroundColor);
          expect(style.borderRadius).toBe(firstStyle.borderRadius);
          expect(style.fontSize).toBe(firstStyle.fontSize);
        }
      }
    });
    test('Typography hierarchy consistency', async ({ page }) => {
      const typographyStyles: Record<string, any> = {};
      // Check all pages
      const allPages = [...galleryPages.slice(0, 3), ...learnPages.slice(0, 3)];
      for (const testPage of allPages) {
        await page.goto(testPage.url);
        const styles = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          const h2 = document.querySelector('h2');
          const h3 = document.querySelector('h3');
          const getStyles = (el: Element | null) => {
            if (!el) return null;
            const computed = window.getComputedStyle(el);
            return {
              fontSize: computed.fontSize,
              lineHeight: computed.lineHeight,
              fontWeight: computed.fontWeight,
              marginBottom: computed.marginBottom
            };
          };
          return {
            h1: getStyles(h1),
            h2: getStyles(h2),
            h3: getStyles(h3)
          };
        });
        typographyStyles[testPage.name] = styles;
      }
      // Verify consistent hierarchy
      for (const [pageName, styles] of Object.entries(typographyStyles)) {
        if (styles.h1 && styles.h2) {
          const h1Size = parseFloat(styles.h1.fontSize);
          const h2Size = parseFloat(styles.h2.fontSize);
          expect(h1Size).toBeGreaterThan(h2Size);
        }
        if (styles.h2 && styles.h3) {
          const h2Size = parseFloat(styles.h2.fontSize);
          const h3Size = parseFloat(styles.h3.fontSize);
          expect(h2Size).toBeGreaterThan(h3Size);
        }
      }
    });
    test('Color contrast accessibility', async ({ page }) => {
      const contrastIssues: any[] = [];
      const testPages = [...galleryPages.slice(0, 2), ...learnPages.slice(0, 2)];
      for (const testPage of testPages) {
        await page.goto(testPage.url);
        const issues = await page.evaluate(() => {
          const getContrastRatio = (color1: string, color2: string) => {
            // Simplified contrast calculation
            const getLuminance = (color: string) => {
              const rgb = color.match(/\d+/g);
              if (!rgb) return 0;
              const [r, g, b] = rgb.map(n => parseInt(n) / 255);
              return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };
            const l1 = getLuminance(color1);
            const l2 = getLuminance(color2);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
          };
          const issues = [];
          const elements = document.querySelectorAll('*');
          elements.forEach((el) => {
            const styles = window.getComputedStyle(el);
            const bgColor = styles.backgroundColor;
            const textColor = styles.color;
            if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor) {
              const ratio = getContrastRatio(bgColor, textColor);
              if (ratio < 4.5) {
                issues.push({
                  element: el.tagName,
                  class: el.className,
                  ratio: ratio.toFixed(2),
                  bgColor,
                  textColor
                });
              }
            }
          });
          return issues.slice(0, 5); // Limit to first 5 issues
        });
        if (issues.length > 0) {
          contrastIssues.push({
            page: testPage.name,
            issues
          });
        }
      }
      // Report but don't fail on contrast issues
      if (contrastIssues.length > 0) {
        console.warn('Contrast issues found:', contrastIssues);
      }
    });
  });
});
// Generate summary report
test.afterAll(async () => {
  const fs = require('fs');
  const path = require('path');
  const reportsDir = 'tests/visual-regression/reports';
  const files = fs.readdirSync(reportsDir).filter((f: string) => f.endsWith('.json'));
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: files.length,
    pages: {} as Record<string, any>
  };
  files.forEach((file: string) => {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
    const pageKey = data.page;
    if (!summary.pages[pageKey]) {
      summary.pages[pageKey] = {
        viewports: {},
        averagePerformance: {
          firstContentfulPaint: 0,
          domContentLoaded: 0,
          layoutShifts: 0
        }
      };
    }
    summary.pages[pageKey].viewports[data.viewport] = {
      performance: data.performance,
      hasAccessibilityIssues: !data.metrics.accessibility.imagesWithAlt || 
                             !data.metrics.accessibility.buttonsWithAriaLabels
    };
  });
  // Calculate averages
  Object.entries(summary.pages).forEach(([page, data]: [string, any]) => {
    const perfMetrics = Object.values(data.viewports).map((v: any) => v.performance);
    const count = perfMetrics.length;
    if (count > 0) {
      data.averagePerformance.firstContentfulPaint = 
        perfMetrics.reduce((sum, m) => sum + m.firstContentfulPaint, 0) / count;
      data.averagePerformance.domContentLoaded = 
        perfMetrics.reduce((sum, m) => sum + m.domContentLoaded, 0) / count;
      data.averagePerformance.layoutShifts = 
        perfMetrics.reduce((sum, m) => sum + m.layoutShifts, 0) / count;
    }
  });
  fs.writeFileSync(
    'tests/visual-regression/visual-consistency-summary.json',
    JSON.stringify(summary, null, 2)
  );
  console.log(`Total tests: ${files.length}`);
  Object.entries(summary.pages).forEach(([page, data]: [string, any]) => {
    console.log(`${page} - Avg FCP: ${data.averagePerformance.firstContentfulPaint}ms`);
    console.log(`${page} - Avg DOM: ${data.averagePerformance.domContentLoaded}ms`);
    console.log(`${page} - Avg Layout Shifts: ${data.averagePerformance.layoutShifts}`);
  });
});