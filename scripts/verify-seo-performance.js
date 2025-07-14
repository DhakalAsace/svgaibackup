#!/usr/bin/env node

/**
 * SEO Performance Verification Script
 * Verifies Core Web Vitals and SEO optimizations using PageSpeed Insights API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = process.env.PAGESPEED_API_KEY || 'YOUR_API_KEY_HERE';
const SITE_URL = process.env.SITE_URL || 'https://svgai.org';

// Core Web Vitals Thresholds (Google's standards)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
  INP: { good: 200, needsImprovement: 500 },   // milliseconds
  CLS: { good: 0.1, needsImprovement: 0.25 },  // score
  FCP: { good: 1800, needsImprovement: 3000 }, // milliseconds
  TTFB: { good: 800, needsImprovement: 1800 }, // milliseconds
};

// Key pages to verify
const PAGES_TO_VERIFY = [
  { path: '/', name: 'Homepage' },
  { path: '/convert/png-to-svg', name: 'PNG to SVG (High Traffic)' },
  { path: '/convert/svg-to-png', name: 'SVG to PNG (High Traffic)' },
  { path: '/convert/jpg-to-svg', name: 'JPG to SVG' },
  { path: '/gallery/heart-svg', name: 'Heart SVG Gallery' },
  { path: '/gallery/hello-kitty-svg', name: 'Hello Kitty Gallery' },
  { path: '/learn/what-is-svg', name: 'What is SVG (Learn)' },
  { path: '/learn/svg-file-format', name: 'SVG File Format' },
  { path: '/tools/svg-editor', name: 'SVG Editor Tool' },
  { path: '/ai-icon-generator', name: 'AI Icon Generator' },
];

/**
 * Fetch PageSpeed Insights data for a URL
 */
async function fetchPageSpeedData(url, strategy = 'mobile') {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${API_KEY}`;
    
    https.get(apiUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(result.error.message));
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Extract Core Web Vitals from PageSpeed data
 */
function extractWebVitals(data) {
  const metrics = data.lighthouseResult?.audits || {};
  const fieldData = data.loadingExperience?.metrics || {};
  
  return {
    // Lab Data (Lighthouse)
    lab: {
      LCP: metrics['largest-contentful-paint']?.numericValue || null,
      CLS: metrics['cumulative-layout-shift']?.numericValue || null,
      TBT: metrics['total-blocking-time']?.numericValue || null,
      FCP: metrics['first-contentful-paint']?.numericValue || null,
      TTI: metrics['interactive']?.numericValue || null,
      SI: metrics['speed-index']?.numericValue || null,
      score: (data.lighthouseResult?.categories?.performance?.score || 0) * 100,
    },
    // Field Data (CrUX)
    field: {
      LCP: fieldData.LARGEST_CONTENTFUL_PAINT_MS?.percentile || null,
      CLS: fieldData.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || null,
      INP: fieldData.INTERACTION_TO_NEXT_PAINT?.percentile || null,
      FCP: fieldData.FIRST_CONTENTFUL_PAINT_MS?.percentile || null,
      TTFB: fieldData.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile || null,
    },
  };
}

/**
 * Evaluate metric against thresholds
 */
function evaluateMetric(value, thresholds) {
  if (value === null) return 'no-data';
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Extract SEO audit results
 */
function extractSEOAudits(data) {
  const audits = data.lighthouseResult?.audits || {};
  
  return {
    metaDescription: audits['meta-description']?.score === 1,
    titleElement: audits['document-title']?.score === 1,
    hreflang: audits['hreflang']?.score === 1,
    canonical: audits['canonical']?.score === 1,
    robots: audits['robots-txt']?.score === 1,
    imageAlt: audits['image-alt']?.score === 1,
    linkText: audits['link-text']?.score === 1,
    crawlable: audits['is-crawlable']?.score === 1,
    structuredData: audits['structured-data']?.score === 1,
    viewport: audits['viewport']?.score === 1,
  };
}

/**
 * Extract optimization opportunities
 */
function extractOpportunities(data) {
  const audits = data.lighthouseResult?.audits || {};
  const opportunities = [];
  
  // Check render-blocking resources
  if (audits['render-blocking-resources']?.score < 1) {
    opportunities.push({
      title: 'Eliminate render-blocking resources',
      impact: audits['render-blocking-resources']?.details?.overallSavingsMs || 0,
      description: 'Remove or defer CSS/JS that blocks rendering',
    });
  }
  
  // Check unused code
  if (audits['unused-javascript']?.score < 1) {
    opportunities.push({
      title: 'Remove unused JavaScript',
      impact: audits['unused-javascript']?.details?.overallSavingsMs || 0,
      description: 'Remove unused JavaScript to reduce bytes consumed by network activity',
    });
  }
  
  // Check image optimization
  if (audits['uses-optimized-images']?.score < 1) {
    opportunities.push({
      title: 'Optimize images',
      impact: audits['uses-optimized-images']?.details?.overallSavingsMs || 0,
      description: 'Serve images in next-gen formats with proper compression',
    });
  }
  
  // Check caching
  if (audits['uses-long-cache-ttl']?.score < 0.9) {
    opportunities.push({
      title: 'Serve static assets with efficient cache policy',
      impact: 100,
      description: 'Configure proper caching headers for static resources',
    });
  }
  
  return opportunities.sort((a, b) => b.impact - a.impact);
}

/**
 * Generate detailed report for a page
 */
async function verifyPage(pageConfig) {
  const url = `${SITE_URL}${pageConfig.path}`;
  console.log(`\n📊 Verifying: ${pageConfig.name} (${url})`);
  
  try {
    // Test both mobile and desktop
    const [mobileData, desktopData] = await Promise.all([
      fetchPageSpeedData(url, 'mobile'),
      fetchPageSpeedData(url, 'desktop'),
    ]);
    
    const mobileVitals = extractWebVitals(mobileData);
    const desktopVitals = extractWebVitals(desktopData);
    const seoAudits = extractSEOAudits(mobileData);
    const opportunities = extractOpportunities(mobileData);
    
    // Evaluate Core Web Vitals
    const mobileAssessment = evaluateCoreWebVitals(mobileVitals);
    const desktopAssessment = evaluateCoreWebVitals(desktopVitals);
    
    return {
      url,
      name: pageConfig.name,
      timestamp: new Date().toISOString(),
      mobile: {
        score: mobileVitals.lab.score,
        vitals: mobileVitals,
        assessment: mobileAssessment,
      },
      desktop: {
        score: desktopVitals.lab.score,
        vitals: desktopVitals,
        assessment: desktopAssessment,
      },
      seo: seoAudits,
      opportunities,
      passed: mobileAssessment.passed && desktopAssessment.passed,
    };
  } catch (error) {
    console.error(`❌ Error verifying ${pageConfig.name}:`, error.message);
    return {
      url,
      name: pageConfig.name,
      error: error.message,
      passed: false,
    };
  }
}

/**
 * Evaluate Core Web Vitals against thresholds
 */
function evaluateCoreWebVitals(vitals) {
  const assessment = {
    metrics: {},
    passed: true,
    issues: [],
  };
  
  // Use field data if available, otherwise fall back to lab data
  const data = vitals.field.LCP ? vitals.field : vitals.lab;
  
  // LCP
  if (data.LCP !== null) {
    const lcpRating = evaluateMetric(data.LCP, THRESHOLDS.LCP);
    assessment.metrics.LCP = { value: data.LCP, rating: lcpRating };
    if (lcpRating !== 'good') {
      assessment.passed = false;
      assessment.issues.push(`LCP: ${data.LCP}ms (${lcpRating})`);
    }
  }
  
  // INP (or TBT as proxy in lab data)
  const inpValue = data.INP || data.TBT;
  if (inpValue !== null) {
    const inpRating = evaluateMetric(inpValue, THRESHOLDS.INP);
    assessment.metrics.INP = { value: inpValue, rating: inpRating };
    if (inpRating !== 'good') {
      assessment.passed = false;
      assessment.issues.push(`INP/TBT: ${inpValue}ms (${inpRating})`);
    }
  }
  
  // CLS
  if (data.CLS !== null) {
    const clsRating = evaluateMetric(data.CLS, THRESHOLDS.CLS);
    assessment.metrics.CLS = { value: data.CLS, rating: clsRating };
    if (clsRating !== 'good') {
      assessment.passed = false;
      assessment.issues.push(`CLS: ${data.CLS} (${clsRating})`);
    }
  }
  
  return assessment;
}

/**
 * Generate summary report
 */
function generateSummaryReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    summary: {
      totalPages: results.length,
      passedPages: results.filter(r => r.passed).length,
      failedPages: results.filter(r => !r.passed).length,
      averageMobileScore: 0,
      averageDesktopScore: 0,
    },
    coreWebVitals: {
      mobile: { passed: 0, needsImprovement: 0, poor: 0 },
      desktop: { passed: 0, needsImprovement: 0, poor: 0 },
    },
    seoIssues: [],
    topOpportunities: [],
    failedPages: [],
  };
  
  let totalMobileScore = 0;
  let totalDesktopScore = 0;
  const opportunityMap = new Map();
  
  results.forEach(result => {
    if (result.error) return;
    
    // Calculate average scores
    totalMobileScore += result.mobile.score;
    totalDesktopScore += result.desktop.score;
    
    // Count Core Web Vitals status
    if (result.mobile.assessment.passed) {
      report.coreWebVitals.mobile.passed++;
    } else if (result.mobile.assessment.issues.length <= 2) {
      report.coreWebVitals.mobile.needsImprovement++;
    } else {
      report.coreWebVitals.mobile.poor++;
    }
    
    if (result.desktop.assessment.passed) {
      report.coreWebVitals.desktop.passed++;
    } else if (result.desktop.assessment.issues.length <= 2) {
      report.coreWebVitals.desktop.needsImprovement++;
    } else {
      report.coreWebVitals.desktop.poor++;
    }
    
    // Collect SEO issues
    Object.entries(result.seo).forEach(([audit, passed]) => {
      if (!passed) {
        const issue = report.seoIssues.find(i => i.audit === audit);
        if (issue) {
          issue.pages.push(result.name);
        } else {
          report.seoIssues.push({ audit, pages: [result.name] });
        }
      }
    });
    
    // Aggregate opportunities
    result.opportunities.forEach(opp => {
      const key = opp.title;
      if (opportunityMap.has(key)) {
        const existing = opportunityMap.get(key);
        existing.totalImpact += opp.impact;
        existing.pageCount++;
      } else {
        opportunityMap.set(key, {
          ...opp,
          totalImpact: opp.impact,
          pageCount: 1,
        });
      }
    });
    
    // Track failed pages
    if (!result.passed) {
      report.failedPages.push({
        name: result.name,
        url: result.url,
        mobileScore: result.mobile.score,
        desktopScore: result.desktop.score,
        issues: [
          ...result.mobile.assessment.issues.map(i => `Mobile: ${i}`),
          ...result.desktop.assessment.issues.map(i => `Desktop: ${i}`),
        ],
      });
    }
  });
  
  // Calculate averages
  const validResults = results.filter(r => !r.error).length;
  report.summary.averageMobileScore = Math.round(totalMobileScore / validResults);
  report.summary.averageDesktopScore = Math.round(totalDesktopScore / validResults);
  
  // Sort opportunities by total impact
  report.topOpportunities = Array.from(opportunityMap.values())
    .sort((a, b) => b.totalImpact - a.totalImpact)
    .slice(0, 5);
  
  return report;
}

/**
 * Save report to file
 */
function saveReport(report, results) {
  const reportDir = path.join(__dirname, '..', 'performance-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const summaryPath = path.join(reportDir, `seo-performance-summary-${timestamp}.json`);
  const detailPath = path.join(reportDir, `seo-performance-details-${timestamp}.json`);
  
  fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(detailPath, JSON.stringify(results, null, 2));
  
  return { summaryPath, detailPath };
}

/**
 * Main verification function
 */
async function main() {
  console.log('🔍 SEO Performance Verification System');
  console.log('=====================================\n');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Pages to verify: ${PAGES_TO_VERIFY.length}`);
  
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('\n❌ Error: PageSpeed Insights API key not configured');
    console.error('Set PAGESPEED_API_KEY environment variable or update the script');
    process.exit(1);
  }
  
  console.log('\nStarting verification...');
  
  const results = [];
  for (const page of PAGES_TO_VERIFY) {
    const result = await verifyPage(page);
    results.push(result);
    
    // Brief result
    if (result.passed) {
      console.log(`✅ PASSED - Mobile: ${result.mobile.score}/100, Desktop: ${result.desktop.score}/100`);
    } else {
      console.log(`❌ FAILED - Mobile: ${result.mobile.score}/100, Desktop: ${result.desktop.score}/100`);
      if (result.mobile.assessment.issues.length > 0) {
        console.log(`   Issues: ${result.mobile.assessment.issues.join(', ')}`);
      }
    }
  }
  
  // Generate summary report
  const summaryReport = generateSummaryReport(results);
  
  // Save reports
  const { summaryPath, detailPath } = saveReport(summaryReport, results);
  
  // Print summary
  console.log('\n📊 Verification Summary');
  console.log('======================');
  console.log(`Total Pages: ${summaryReport.summary.totalPages}`);
  console.log(`Passed: ${summaryReport.summary.passedPages}`);
  console.log(`Failed: ${summaryReport.summary.failedPages}`);
  console.log(`Average Mobile Score: ${summaryReport.summary.averageMobileScore}/100`);
  console.log(`Average Desktop Score: ${summaryReport.summary.averageDesktopScore}/100`);
  
  console.log('\n🎯 Core Web Vitals Status');
  console.log('Mobile:');
  console.log(`  Good: ${summaryReport.coreWebVitals.mobile.passed} pages`);
  console.log(`  Needs Improvement: ${summaryReport.coreWebVitals.mobile.needsImprovement} pages`);
  console.log(`  Poor: ${summaryReport.coreWebVitals.mobile.poor} pages`);
  console.log('Desktop:');
  console.log(`  Good: ${summaryReport.coreWebVitals.desktop.passed} pages`);
  console.log(`  Needs Improvement: ${summaryReport.coreWebVitals.desktop.needsImprovement} pages`);
  console.log(`  Poor: ${summaryReport.coreWebVitals.desktop.poor} pages`);
  
  if (summaryReport.failedPages.length > 0) {
    console.log('\n❌ Failed Pages:');
    summaryReport.failedPages.forEach(page => {
      console.log(`\n${page.name} (${page.url})`);
      console.log(`  Mobile: ${page.mobileScore}/100, Desktop: ${page.desktopScore}/100`);
      page.issues.forEach(issue => console.log(`  - ${issue}`));
    });
  }
  
  if (summaryReport.topOpportunities.length > 0) {
    console.log('\n💡 Top Performance Opportunities:');
    summaryReport.topOpportunities.forEach((opp, index) => {
      console.log(`${index + 1}. ${opp.title}`);
      console.log(`   Impact: ${opp.totalImpact}ms across ${opp.pageCount} pages`);
      console.log(`   ${opp.description}`);
    });
  }
  
  if (summaryReport.seoIssues.length > 0) {
    console.log('\n⚠️  SEO Issues:');
    summaryReport.seoIssues.forEach(issue => {
      console.log(`- ${issue.audit}: ${issue.pages.join(', ')}`);
    });
  }
  
  console.log('\n📁 Reports saved:');
  console.log(`Summary: ${summaryPath}`);
  console.log(`Details: ${detailPath}`);
  
  // Exit with error code if any pages failed
  process.exit(summaryReport.summary.failedPages > 0 ? 1 : 0);
}

// Run verification
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { fetchPageSpeedData, extractWebVitals, verifyPage };