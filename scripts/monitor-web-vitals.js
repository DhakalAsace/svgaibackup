#!/usr/bin/env node

/**
 * Web Vitals Monitoring Script
 * Monitors Core Web Vitals and reports performance issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
};

// Pages to monitor
const PAGES_TO_MONITOR = [
  '/',
  '/ai-icon-generator',
  '/pricing',
  '/blog',
  '/results',
  '/convert/png-to-svg',
  '/gallery/icons'
];

async function measureWebVitals(url) {
  try {
    // Run Lighthouse
    const result = execSync(
      `npx lighthouse ${url} --output=json --quiet --chrome-flags="--headless"`,
      { encoding: 'utf8' }
    );
    
    const data = JSON.parse(result);
    const metrics = data.audits;
    
    return {
      url,
      timestamp: new Date().toISOString(),
      metrics: {
        LCP: metrics['largest-contentful-paint']?.numericValue || 0,
        CLS: metrics['cumulative-layout-shift']?.numericValue || 0,
        TBT: metrics['total-blocking-time']?.numericValue || 0,
        FCP: metrics['first-contentful-paint']?.numericValue || 0,
        TTI: metrics['interactive']?.numericValue || 0,
        SI: metrics['speed-index']?.numericValue || 0,
        score: data.categories.performance.score * 100
      }
    };
  } catch (error) {
    console.error(`Error measuring ${url}:`, error.message);
    return null;
  }
}

function evaluateMetric(value, thresholds) {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      averageScore: 0,
      issueCount: 0
    },
    pages: [],
    recommendations: []
  };
  
  let totalScore = 0;
  const issues = [];
  
  results.forEach(result => {
    if (!result) return;
    
    totalScore += result.metrics.score;
    const pageReport = {
      url: result.url,
      score: result.metrics.score,
      metrics: {},
      issues: []
    };
    
    // Evaluate each metric
    Object.entries(result.metrics).forEach(([metric, value]) => {
      if (metric === 'score') return;
      
      const threshold = THRESHOLDS[metric];
      if (threshold) {
        const rating = evaluateMetric(value, threshold);
        pageReport.metrics[metric] = {
          value,
          rating
        };
        
        if (rating !== 'good') {
          const issue = `${metric} is ${rating} (${value}ms)`;
          pageReport.issues.push(issue);
          issues.push({ url: result.url, metric, value, rating });
        }
      }
    });
    
    report.pages.push(pageReport);
  });
  
  report.summary.averageScore = Math.round(totalScore / results.filter(r => r).length);
  report.summary.issueCount = issues.length;
  
  // Generate recommendations
  if (issues.some(i => i.metric === 'LCP')) {
    report.recommendations.push(
      'Optimize largest contentful paint by:',
      '- Preloading critical images',
      '- Optimizing server response times',
      '- Using CDN for static assets'
    );
  }
  
  if (issues.some(i => i.metric === 'CLS')) {
    report.recommendations.push(
      'Fix cumulative layout shift by:',
      '- Setting explicit dimensions on images and videos',
      '- Avoiding inserting content above existing content',
      '- Using CSS transform for animations'
    );
  }
  
  if (issues.some(i => i.metric === 'TBT' || i.metric === 'INP')) {
    report.recommendations.push(
      'Improve interactivity by:',
      '- Code splitting large bundles',
      '- Deferring non-critical JavaScript',
      '- Using web workers for heavy computations'
    );
  }
  
  return report;
}

async function main() {
  console.log('🔍 Starting Web Vitals monitoring...\n');
  
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const results = [];
  
  for (const page of PAGES_TO_MONITOR) {
    const url = `${baseUrl}${page}`;
    console.log(`Measuring: ${url}`);
    const result = await measureWebVitals(url);
    results.push(result);
  }
  
  const report = generateReport(results);
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n📊 Performance Report Summary:');
  console.log(`Average Score: ${report.summary.averageScore}/100`);
  console.log(`Issues Found: ${report.summary.issueCount}`);
  
  // Print issues
  if (report.summary.issueCount > 0) {
    console.log('\n⚠️  Performance Issues:');
    report.pages.forEach(page => {
      if (page.issues.length > 0) {
        console.log(`\n${page.url}:`);
        page.issues.forEach(issue => console.log(`  - ${issue}`));
      }
    });
    
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  ${rec}`));
  } else {
    console.log('\n✅ All pages meet performance targets!');
  }
  
  console.log(`\nFull report saved to: ${reportPath}`);
}

// Run the monitoring
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { measureWebVitals, generateReport };