/**
 * Test script for SVG to Video conversion API
 * 
 * This script tests the SVG to Video conversion functionality
 * including authentication, credit system, and file conversion.
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Test SVG content with animation
const animatedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" fill="#FF7043">
    <animate attributeName="r" values="50;80;50" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="fill" values="#FF7043;#FFA726;#FF7043" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="20" fill="white">
    SVG AI
    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
  </text>
</svg>`;

// Test configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123456';

async function signIn() {
  console.log('🔐 Signing in...');
  
  const response = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sign in failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.session;
}

async function testSVGToVideoConversion(authToken) {
  console.log('\n🎬 Testing SVG to Video Conversion...');
  
  // Test different configurations
  const testCases = [
    { format: 'mp4', quality: 'standard', fps: '30', duration: '5' },
    { format: 'mp4', quality: 'hd', fps: '30', duration: '10' },
    { format: 'gif', quality: 'standard', fps: '24', duration: '3' },
  ];

  for (const testCase of testCases) {
    console.log(`\n📹 Testing: ${testCase.format.toUpperCase()} - ${testCase.quality} quality`);
    
    try {
      // Create form data
      const formData = new FormData();
      const svgBuffer = Buffer.from(animatedSVG, 'utf-8');
      formData.append('file', svgBuffer, {
        filename: 'test-animation.svg',
        contentType: 'image/svg+xml',
      });
      formData.append('format', testCase.format);
      formData.append('quality', testCase.quality);
      formData.append('fps', testCase.fps);
      formData.append('duration', testCase.duration);

      // Make conversion request
      const response = await fetch(`${API_URL}/api/convert/svg-to-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error(`❌ Conversion failed: ${error.error || response.statusText}`);
        continue;
      }

      // Check if demo mode
      const isDemoMode = response.headers.get('X-Demo-Mode') === 'true';
      
      // Get the video data
      const buffer = await response.buffer();
      console.log(`✅ Conversion successful!`);
      console.log(`   - Size: ${(buffer.length / 1024).toFixed(2)} KB`);
      console.log(`   - Demo mode: ${isDemoMode ? 'Yes' : 'No'}`);
      console.log(`   - Content-Type: ${response.headers.get('Content-Type')}`);
      
      // Save to file for inspection
      const outputDir = path.join(__dirname, 'test-output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      
      const filename = `test-${testCase.quality}-${Date.now()}.${testCase.format}`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, buffer);
      console.log(`   - Saved to: ${filepath}`);
      
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`);
    }
  }
}

async function testInsufficientCredits(authToken) {
  console.log('\n💳 Testing insufficient credits handling...');
  
  // This test assumes the test account has limited credits
  // You may need to adjust based on your test setup
  
  const formData = new FormData();
  const svgBuffer = Buffer.from(animatedSVG, 'utf-8');
  formData.append('file', svgBuffer, {
    filename: 'test-animation.svg',
    contentType: 'image/svg+xml',
  });
  formData.append('format', 'mp4');
  formData.append('quality', '4k'); // Most expensive option
  formData.append('fps', '60');
  formData.append('duration', '30');

  const response = await fetch(`${API_URL}/api/convert/svg-to-video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  if (response.status === 402) {
    console.log('✅ Correctly returned 402 Payment Required for insufficient credits');
  } else {
    console.log(`⚠️  Unexpected status: ${response.status}`);
  }
}

async function testInvalidInput(authToken) {
  console.log('\n🚫 Testing invalid input handling...');
  
  // Test with non-SVG file
  const formData = new FormData();
  formData.append('file', Buffer.from('Not an SVG'), {
    filename: 'test.txt',
    contentType: 'text/plain',
  });
  formData.append('format', 'mp4');
  formData.append('quality', 'hd');
  formData.append('fps', '30');
  formData.append('duration', '5');

  const response = await fetch(`${API_URL}/api/convert/svg-to-video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  if (response.status === 400) {
    console.log('✅ Correctly rejected invalid SVG file');
  } else {
    console.log(`⚠️  Unexpected status: ${response.status}`);
  }
}

async function testUnauthenticated() {
  console.log('\n🔒 Testing unauthenticated access...');
  
  const formData = new FormData();
  formData.append('file', Buffer.from(animatedSVG), {
    filename: 'test.svg',
    contentType: 'image/svg+xml',
  });
  formData.append('format', 'mp4');
  formData.append('quality', 'hd');

  const response = await fetch(`${API_URL}/api/convert/svg-to-video`, {
    method: 'POST',
    body: formData,
    headers: formData.getHeaders(),
  });

  if (response.status === 401) {
    console.log('✅ Correctly blocked unauthenticated access');
  } else {
    console.log(`⚠️  Unexpected status: ${response.status}`);
  }
}

async function runTests() {
  console.log('🚀 Starting SVG to Video API Tests');
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`📧 Test Email: ${TEST_EMAIL}`);
  
  try {
    // Test unauthenticated access first
    await testUnauthenticated();
    
    // Sign in for authenticated tests
    const session = await signIn();
    console.log('✅ Sign in successful');
    
    // Run authenticated tests
    await testSVGToVideoConversion(session.access_token);
    await testInvalidInput(session.access_token);
    await testInsufficientCredits(session.access_token);
    
    console.log('\n✨ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Check if required packages are installed
try {
  require('node-fetch');
  require('form-data');
} catch (error) {
  console.error('❌ Missing dependencies. Please run:');
  console.error('npm install node-fetch@2 form-data');
  process.exit(1);
}

// Run tests
runTests();