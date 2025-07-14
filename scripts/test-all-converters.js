const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// All 40 converters to test
const converters = [
  // Popular Converters
  { slug: 'png-to-svg', name: 'PNG to SVG', category: 'Popular' },
  { slug: 'svg-to-png', name: 'SVG to PNG', category: 'Popular' },
  { slug: 'jpg-to-svg', name: 'JPG to SVG', category: 'Popular' },
  { slug: 'svg-to-pdf', name: 'SVG to PDF', category: 'Popular' },
  { slug: 'webp-to-svg', name: 'WebP to SVG', category: 'Popular' },
  
  // Image to SVG Converters
  { slug: 'bmp-to-svg', name: 'BMP to SVG', category: 'Image to SVG' },
  { slug: 'gif-to-svg', name: 'GIF to SVG', category: 'Image to SVG' },
  { slug: 'tiff-to-svg', name: 'TIFF to SVG', category: 'Image to SVG' },
  { slug: 'ico-to-svg', name: 'ICO to SVG', category: 'Image to SVG' },
  { slug: 'heic-to-svg', name: 'HEIC to SVG', category: 'Image to SVG' },
  
  // SVG to Image Converters
  { slug: 'svg-to-jpg', name: 'SVG to JPG', category: 'SVG to Image' },
  { slug: 'svg-to-webp', name: 'SVG to WebP', category: 'SVG to Image' },
  { slug: 'svg-to-bmp', name: 'SVG to BMP', category: 'SVG to Image' },
  { slug: 'svg-to-gif', name: 'SVG to GIF', category: 'SVG to Image' },
  { slug: 'svg-to-tiff', name: 'SVG to TIFF', category: 'SVG to Image' },
  { slug: 'svg-to-ico', name: 'SVG to ICO', category: 'SVG to Image' },
  
  // Vector Format Converters
  { slug: 'svg-to-eps', name: 'SVG to EPS', category: 'Vector Formats' },
  { slug: 'eps-to-svg', name: 'EPS to SVG', category: 'Vector Formats' },
  { slug: 'svg-to-ai', name: 'SVG to AI', category: 'Vector Formats' },
  { slug: 'ai-to-svg', name: 'AI to SVG', category: 'Vector Formats' },
  { slug: 'svg-to-dxf', name: 'SVG to DXF', category: 'Vector Formats' },
  { slug: 'dxf-to-svg', name: 'DXF to SVG', category: 'Vector Formats' },
  { slug: 'svg-to-wmf', name: 'SVG to WMF', category: 'Vector Formats' },
  { slug: 'svg-to-emf', name: 'SVG to EMF', category: 'Vector Formats' },
  
  // Document Converters
  { slug: 'pdf-to-svg', name: 'PDF to SVG', category: 'Document' },
  { slug: 'svg-to-html', name: 'SVG to HTML', category: 'Document' },
  { slug: 'svg-to-canvas', name: 'SVG to Canvas', category: 'Document' },
  
  // Specialized Converters
  { slug: 'svg-to-base64', name: 'SVG to Base64', category: 'Specialized' },
  { slug: 'base64-to-svg', name: 'Base64 to SVG', category: 'Specialized' },
  { slug: 'svg-to-react', name: 'SVG to React', category: 'Specialized' },
  { slug: 'svg-to-vue', name: 'SVG to Vue', category: 'Specialized' },
  { slug: 'svg-to-css', name: 'SVG to CSS', category: 'Specialized' },
  { slug: 'text-to-svg', name: 'Text to SVG', category: 'Specialized' },
  { slug: 'svg-to-font', name: 'SVG to Font', category: 'Specialized' },
  
  // Mobile & App Formats
  { slug: 'svg-to-android', name: 'SVG to Android Vector', category: 'Mobile' },
  { slug: 'svg-to-xaml', name: 'SVG to XAML', category: 'Mobile' },
  { slug: 'svg-to-swiftui', name: 'SVG to SwiftUI', category: 'Mobile' },
  
  // Data Visualization
  { slug: 'csv-to-svg', name: 'CSV to SVG Chart', category: 'Data' },
  { slug: 'json-to-svg', name: 'JSON to SVG', category: 'Data' },
];

// Test a single converter
async function testConverter(browser, converter, index) {
  const page = await browser.newPage();
  const results = {
    converter: converter.name,
    slug: converter.slug,
    category: converter.category,
    url: `http://localhost:3000/convert/${converter.slug}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
    checks: {}
  };

  try {
    // Navigate to converter page
    await page.goto(results.url, { waitUntil: 'networkidle0', timeout: 30000 });
    results.status = 'loaded';

    // Take screenshot
    const screenshotDir = path.join(__dirname, '../test-results/converter-screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });
    await page.screenshot({ 
      path: path.join(screenshotDir, `${converter.slug}.png`),
      fullPage: true 
    });

    // Check for key elements
    results.checks.hasTitle = await page.$('h1') !== null;
    results.checks.titleText = await page.$eval('h1', el => el.textContent).catch(() => 'No title found');
    
    // Check for upload interface
    results.checks.hasUploadZone = await page.$('[data-testid="upload-zone"], .upload-zone, [class*="upload"], [class*="dropzone"]') !== null;
    results.checks.hasFileInput = await page.$('input[type="file"]') !== null;
    
    // Check for conversion settings
    results.checks.hasSettings = await page.$('[class*="settings"], [class*="options"], [class*="config"]') !== null;
    
    // Check availability status
    const pageContent = await page.content();
    results.checks.isComingSoon = pageContent.includes('Coming Soon') || pageContent.includes('coming soon');
    results.checks.isAvailable = !results.checks.isComingSoon && results.checks.hasUploadZone;
    
    // Check for SEO content
    results.checks.hasDescription = await page.$('meta[name="description"]') !== null;
    results.checks.hasFAQ = await page.$('[class*="faq"], [class*="FAQ"], h2:has-text("FAQ"), h2:has-text("Frequently Asked Questions")') !== null;
    
    // Check responsive design (mobile view)
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: path.join(screenshotDir, `${converter.slug}-mobile.png`) 
    });
    results.checks.mobileResponsive = true;

    // Performance metrics
    const metrics = await page.metrics();
    results.performance = {
      domContentLoaded: metrics.DOMContentLoaded,
      jsHeapUsed: Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + 'MB'
    };

    results.status = 'completed';
    
  } catch (error) {
    results.status = 'error';
    results.error = error.message;
  } finally {
    await page.close();
  }

  return results;
}

// Test hub page
async function testHubPage(browser) {
  const page = await browser.newPage();
  const results = {
    url: 'http://localhost:3000/convert',
    timestamp: new Date().toISOString(),
    status: 'pending',
    checks: {}
  };

  try {
    await page.goto(results.url, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshotDir = path.join(__dirname, '../test-results/converter-screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });
    await page.screenshot({ 
      path: path.join(screenshotDir, 'hub-page.png'),
      fullPage: true 
    });

    // Count converter links
    const converterLinks = await page.$$('a[href^="/convert/"]');
    results.checks.totalConverters = converterLinks.length;
    results.checks.expectedConverters = 40;
    results.checks.allConvertersListed = converterLinks.length === 40;

    // Check categories
    const categories = await page.$$eval('h2, h3', elements => 
      elements.map(el => el.textContent).filter(text => 
        ['Popular', 'Image', 'Vector', 'Document', 'Specialized', 'Mobile', 'Data'].some(cat => 
          text.includes(cat)
        )
      )
    );
    results.checks.categories = categories;

    results.status = 'completed';
  } catch (error) {
    results.status = 'error';
    results.error = error.message;
  } finally {
    await page.close();
  }

  return results;
}

// Main function to run all tests in parallel
async function runAllTests() {
  console.log('Starting parallel converter tests...');
  const startTime = Date.now();
  
  // Launch multiple browser instances for parallel testing
  const browserCount = 5; // Number of parallel browsers
  const browsers = await Promise.all(
    Array(browserCount).fill().map(() => 
      puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    )
  );

  try {
    // Test hub page first
    console.log('Testing hub page...');
    const hubResults = await testHubPage(browsers[0]);
    
    // Distribute converters across browsers
    const converterPromises = converters.map((converter, index) => {
      const browserIndex = index % browserCount;
      return testConverter(browsers[browserIndex], converter, index);
    });

    // Run all converter tests in parallel
    console.log(`Testing ${converters.length} converters in parallel...`);
    const converterResults = await Promise.all(converterPromises);

    // Save results
    const resultsDir = path.join(__dirname, '../test-results');
    await fs.mkdir(resultsDir, { recursive: true });
    
    const allResults = {
      testRun: {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: `${(Date.now() - startTime) / 1000}s`,
        totalConverters: converters.length,
        parallelBrowsers: browserCount
      },
      hubPage: hubResults,
      converters: converterResults,
      summary: {
        total: converterResults.length,
        completed: converterResults.filter(r => r.status === 'completed').length,
        errors: converterResults.filter(r => r.status === 'error').length,
        available: converterResults.filter(r => r.checks.isAvailable).length,
        comingSoon: converterResults.filter(r => r.checks.isComingSoon).length,
        withUploadInterface: converterResults.filter(r => r.checks.hasUploadZone).length,
        withSettings: converterResults.filter(r => r.checks.hasSettings).length,
        withFAQ: converterResults.filter(r => r.checks.hasFAQ).length
      }
    };

    await fs.writeFile(
      path.join(resultsDir, 'converter-test-results.json'),
      JSON.stringify(allResults, null, 2)
    );

    // Generate summary report
    const report = generateReport(allResults);
    await fs.writeFile(
      path.join(resultsDir, 'converter-test-report.md'),
      report
    );

    console.log('\nTest Results Summary:');
    console.log(`Total converters tested: ${allResults.summary.total}`);
    console.log(`Successfully tested: ${allResults.summary.completed}`);
    console.log(`Errors: ${allResults.summary.errors}`);
    console.log(`Available converters: ${allResults.summary.available}`);
    console.log(`Coming soon: ${allResults.summary.comingSoon}`);
    console.log(`\nFull results saved to test-results/`);

  } finally {
    // Close all browsers
    await Promise.all(browsers.map(browser => browser.close()));
  }
}

// Generate markdown report
function generateReport(results) {
  let report = `# Converter Testing Report\n\n`;
  report += `**Test Date:** ${results.testRun.startTime}\n`;
  report += `**Duration:** ${results.testRun.duration}\n`;
  report += `**Parallel Browsers:** ${results.testRun.parallelBrowsers}\n\n`;

  report += `## Summary\n\n`;
  report += `- Total Converters: ${results.summary.total}\n`;
  report += `- Successfully Tested: ${results.summary.completed}\n`;
  report += `- Errors: ${results.summary.errors}\n`;
  report += `- Available: ${results.summary.available}\n`;
  report += `- Coming Soon: ${results.summary.comingSoon}\n`;
  report += `- With Upload Interface: ${results.summary.withUploadInterface}\n`;
  report += `- With Settings: ${results.summary.withSettings}\n`;
  report += `- With FAQ: ${results.summary.withFAQ}\n\n`;

  report += `## Hub Page\n\n`;
  report += `- Status: ${results.hubPage.status}\n`;
  report += `- Converters Listed: ${results.hubPage.checks.totalConverters}/${results.hubPage.checks.expectedConverters}\n`;
  report += `- Categories Found: ${results.hubPage.checks.categories?.join(', ') || 'None'}\n\n`;

  report += `## Converter Details\n\n`;

  // Group by category
  const byCategory = {};
  results.converters.forEach(converter => {
    if (!byCategory[converter.category]) {
      byCategory[converter.category] = [];
    }
    byCategory[converter.category].push(converter);
  });

  Object.entries(byCategory).forEach(([category, converters]) => {
    report += `### ${category}\n\n`;
    converters.forEach(converter => {
      const status = converter.checks.isAvailable ? '✅ Available' : 
                     converter.checks.isComingSoon ? '🔜 Coming Soon' : 
                     '❓ Unknown';
      report += `- **${converter.converter}** (${converter.slug}): ${status}\n`;
      if (converter.status === 'error') {
        report += `  - Error: ${converter.error}\n`;
      }
    });
    report += '\n';
  });

  return report;
}

// Run tests
runAllTests().catch(console.error);