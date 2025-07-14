#!/usr/bin/env node

/**
 * OG Image Testing Script
 * Tests all OG image endpoints to ensure they're working correctly
 */

const TEST_CASES = [
  // Converter OG images
  { 
    name: 'PNG to SVG Converter',
    url: '/api/og-image/png-to-svg',
    expectedStatus: 200
  },
  { 
    name: 'SVG to PNG Converter',
    url: '/api/og-image/svg-to-png',
    expectedStatus: 200
  },
  
  // Tool OG images
  {
    name: 'SVG Editor Tool',
    url: '/api/og?type=tool&name=SVG Editor&desc=Edit SVG code&feat=Real-time preview',
    expectedStatus: 200
  },
  {
    name: 'SVG Optimizer (Premium)',
    url: '/api/og?type=tool&name=SVG Optimizer&desc=Optimize SVG files&premium=true',
    expectedStatus: 200
  },
  
  // Learn page OG images
  {
    name: 'Learn Page - What is SVG',
    url: '/api/og?type=learn&title=What is SVG?&cat=Basics&time=5 min&topic=SVG fundamentals',
    expectedStatus: 200
  },
  
  // Gallery OG images
  {
    name: 'Heart SVG Gallery',
    url: '/api/og?type=gallery&theme=Hearts&title=Heart SVG Collection&desc=Beautiful heart designs&count=100',
    expectedStatus: 200
  },
  
  // AI Generation OG image
  {
    name: 'AI SVG Generator',
    url: '/api/og?type=ai',
    expectedStatus: 200
  },
  
  // Default OG image
  {
    name: 'Homepage Default',
    url: '/api/og',
    expectedStatus: 200
  }
];

async function testOGImages() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing OG Images...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TEST_CASES) {
    try {
      const url = `${baseUrl}${testCase.url}`;
      const response = await fetch(url);
      
      if (response.status === testCase.expectedStatus) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('image/')) {
          console.log(`✅ ${testCase.name}`);
          console.log(`   URL: ${testCase.url}`);
          console.log(`   Status: ${response.status}`);
          console.log(`   Content-Type: ${contentType}\n`);
          passed++;
        } else {
          console.log(`❌ ${testCase.name}`);
          console.log(`   URL: ${testCase.url}`);
          console.log(`   Error: Invalid content type: ${contentType}\n`);
          failed++;
        }
      } else {
        console.log(`❌ ${testCase.name}`);
        console.log(`   URL: ${testCase.url}`);
        console.log(`   Expected: ${testCase.expectedStatus}, Got: ${response.status}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}`);
      console.log(`   URL: ${testCase.url}`);
      console.log(`   Error: ${error}\n`);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📁 Total: ${TEST_CASES.length}`);
  
  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>OG Image Test Report</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; }
    .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .test-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .test-card img { width: 100%; height: auto; }
    .test-card h3 { padding: 10px; margin: 0; background: #f0f0f0; }
    .test-url { padding: 10px; font-size: 12px; color: #666; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <h1>OG Image Test Report</h1>
    <p>Generated: ${new Date().toISOString()}</p>
    <div class="test-grid">
      ${TEST_CASES.map(test => `
        <div class="test-card">
          <h3>${test.name}</h3>
          <img src="${baseUrl}${test.url}" alt="${test.name}" />
          <div class="test-url">${test.url}</div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `;
  
  // Write report to file
  const fs = require('fs').promises;
  await fs.writeFile('og-image-test-report.html', htmlReport);
  console.log('\n📄 HTML report generated: og-image-test-report.html');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
testOGImages().catch(console.error);