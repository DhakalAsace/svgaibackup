// Detailed test of CloudConvert API integration

require('dotenv').config({ path: '.env.local' });

async function testCloudConvertDetailed() {
  console.log('=== CloudConvert Detailed Test ===\n');

  // Check environment
  console.log('1. Environment Check:');
  console.log('API Key present:', !!process.env.CLOUDCONVERT_API_KEY);
  console.log('API Key length:', process.env.CLOUDCONVERT_API_KEY?.length || 0);
  console.log('API Key prefix:', process.env.CLOUDCONVERT_API_KEY?.substring(0, 20) + '...');

  // Import CloudConvert client
  console.log('\n2. Importing CloudConvert client...');
  try {
    const { CloudConvertClient } = require('./lib/converters/cloudconvert-client');
    console.log('✅ CloudConvert client imported successfully');

    // Create client instance
    console.log('\n3. Creating client instance...');
    const client = new CloudConvertClient();
    console.log('✅ Client created successfully');

    // Test convertFile method
    console.log('\n4. Testing convertFile method...');
    const testBuffer = Buffer.from('Test content');
    
    try {
      await client.convertFile(testBuffer, 'txt', 'pdf', 'test.txt', {});
    } catch (error) {
      console.log('❌ convertFile error:', error.message);
      console.log('Error stack:', error.stack);
    }

  } catch (error) {
    console.error('❌ Import/initialization error:', error.message);
    console.error('Stack:', error.stack);
  }

  // Test the actual AI to SVG handler
  console.log('\n5. Testing AI to SVG handler...');
  try {
    const { aiToSvgHandler } = require('./lib/converters/ai-to-svg');
    console.log('✅ AI to SVG handler imported');

    const testPdf = Buffer.from('%PDF-1.4\n%Test');
    const result = await aiToSvgHandler(testPdf, {});
    console.log('Result:', result);

  } catch (error) {
    console.error('❌ AI handler error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCloudConvertDetailed();