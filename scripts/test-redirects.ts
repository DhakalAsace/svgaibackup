#!/usr/bin/env node

import { 
  findRedirect, 
  findGoneRule, 
  normalizeTrailingSlash, 
  findSimilarUrls,
  getCategoryRecommendations,
  redirectRules,
  goneRules
} from '../lib/redirects';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test cases for redirects
const redirectTests = [
  // Legacy converter URLs
  { path: '/tools/png-to-svg', expected: '/convert/png-to-svg', permanent: true },
  { path: '/tools/svg-to-png', expected: '/convert/svg-to-png', permanent: true },
  
  // Common misspellings
  { path: '/convert/svg-conveter', expected: '/convert/svg-converter', permanent: true },
  { path: '/convert/svg-convertor', expected: '/convert/svg-converter', permanent: true },
  
  // Alternative patterns
  { path: '/converter/png-to-svg', expected: '/convert/png-to-svg', permanent: true },
  { path: '/svg-converter', expected: '/convert/svg-converter', permanent: true },
  
  // Gallery redirects
  { path: '/svg-gallery', expected: '/gallery', permanent: true },
  { path: '/svg-gallery/heart-svg', expected: '/gallery/heart-svg', permanent: true },
  
  // Learn redirects
  { path: '/docs/what-is-svg', expected: '/learn/what-is-svg', permanent: true },
  { path: '/tutorials/svg-file-format', expected: '/learn/svg-file-format', permanent: true },
  
  // Tool redirects
  { path: '/svg-editor', expected: '/tools/svg-editor', permanent: true },
  { path: '/animation-tool', expected: '/animate', permanent: true },
];

// Test cases for trailing slash normalization
const trailingSlashTests = [
  { path: '/convert/', expected: '/convert' },
  { path: '/gallery/', expected: '/gallery' },
  { path: '/learn/', expected: '/learn' },
  { path: '/', expected: null }, // Root should not be normalized
  { path: '/api/test/', expected: null }, // API routes should not be normalized
  { path: '/file.svg/', expected: null }, // Files should not be normalized
];

// Test cases for 410 Gone pages
const goneTests = [
  { path: '/beta', expectedMessage: 'The beta program has ended. Please visit our main site.' },
  { path: '/old-api', expectedMessage: 'This API version is no longer supported.' },
  { path: '/v1/users', expectedMessage: 'Version 1 has been discontinued.' },
];

// Test cases for fuzzy URL matching
const fuzzyMatchTests = [
  { 
    path: '/convert/png-svg', 
    expectedIncludes: ['/convert/png-to-svg', '/convert/svg-to-png'] 
  },
  { 
    path: '/galery', 
    expectedIncludes: ['/gallery'] 
  },
  { 
    path: '/lern/svg', 
    expectedIncludes: ['/learn', '/learn/what-is-svg'] 
  },
];

// Test category recommendations
const categoryTests = [
  {
    path: '/convert/unknown',
    expectedCategory: 'converter',
    expectedIncludes: ['/convert/png-to-svg', '/convert/svg-converter']
  },
  {
    path: '/gallery/unknown',
    expectedCategory: 'gallery',
    expectedIncludes: ['/gallery', '/gallery/heart-svg']
  },
  {
    path: '/learn/unknown',
    expectedCategory: 'learn',
    expectedIncludes: ['/learn', '/learn/what-is-svg']
  },
];

// Run tests
function runTests() {
  let passed = 0;
  let failed = 0;

  console.log(`${colors.blue}Running Redirect Tests...${colors.reset}\n`);

  // Test redirects
  console.log(`${colors.yellow}Testing Redirects:${colors.reset}`);
  redirectTests.forEach(test => {
    const result = findRedirect(test.path);
    if (result && result.destination === test.expected && result.permanent === test.permanent) {
      console.log(`${colors.green}✓${colors.reset} ${test.path} → ${test.expected}`);
      passed++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${test.path} → Expected: ${test.expected}, Got: ${result?.destination || 'null'}`);
      failed++;
    }
  });

  console.log(`\n${colors.yellow}Testing Trailing Slash Normalization:${colors.reset}`);
  trailingSlashTests.forEach(test => {
    const result = normalizeTrailingSlash(test.path);
    if (result === test.expected) {
      console.log(`${colors.green}✓${colors.reset} ${test.path} → ${test.expected || 'null (no normalization)'}`);
      passed++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${test.path} → Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  });

  console.log(`\n${colors.yellow}Testing 410 Gone Rules:${colors.reset}`);
  goneTests.forEach(test => {
    const result = findGoneRule(test.path);
    if (result && result.message === test.expectedMessage) {
      console.log(`${colors.green}✓${colors.reset} ${test.path} → 410 Gone`);
      passed++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${test.path} → Expected message: ${test.expectedMessage}, Got: ${result?.message || 'null'}`);
      failed++;
    }
  });

  console.log(`\n${colors.yellow}Testing Fuzzy URL Matching:${colors.reset}`);
  fuzzyMatchTests.forEach(test => {
    const results = findSimilarUrls(test.path, 5);
    const hasExpected = test.expectedIncludes.every(url => results.includes(url));
    if (hasExpected) {
      console.log(`${colors.green}✓${colors.reset} ${test.path} → Found expected URLs`);
      passed++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${test.path} → Missing expected URLs. Got: ${results.join(', ')}`);
      failed++;
    }
  });

  console.log(`\n${colors.yellow}Testing Category Recommendations:${colors.reset}`);
  categoryTests.forEach(test => {
    const results = getCategoryRecommendations(test.path);
    const hasExpected = test.expectedIncludes.some(url => results.includes(url));
    if (hasExpected) {
      console.log(`${colors.green}✓${colors.reset} ${test.path} → Found category recommendations`);
      passed++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${test.path} → Missing expected recommendations. Got: ${results.join(', ')}`);
      failed++;
    }
  });

  // Summary
  console.log(`\n${colors.blue}Test Summary:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);

  // Configuration summary
  console.log(`\n${colors.blue}Configuration Summary:${colors.reset}`);
  console.log(`Total redirect rules: ${redirectRules.length}`);
  console.log(`Total gone rules: ${goneRules.length}`);

  process.exit(failed > 0 ? 1 : 0);
}

// Performance test for fuzzy matching
function performanceTest() {
  console.log(`\n${colors.blue}Performance Test - Fuzzy Matching:${colors.reset}`);
  
  const testUrls = [
    '/conver/png-svg',
    '/gallry/hart',
    '/lern/svg-fil',
    '/tool/editr',
    '/animat'
  ];

  testUrls.forEach(url => {
    const start = process.hrtime.bigint();
    const results = findSimilarUrls(url, 5);
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1000000;
    
    console.log(`${url} → ${ms.toFixed(2)}ms (${results.length} results)`);
  });
}

// Run tests
runTests();
performanceTest();