// Quick test script to identify PDF converter issues
// Run this in browser console to debug

async function testPdfConverter() {
  console.log('Testing PDF to SVG converter...')
  
  try {
    // Test importing the converter
    const { convertPdfToSvgClient } = await import('./lib/converters/pdf-to-svg.js')
    console.log('✅ PDF converter imported successfully')
    
    // Test creating a dummy PDF buffer
    const testBuffer = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, // %PDF-
      0x31, 0x2e, 0x34, 0x0a, // 1.4\n
      // Minimal PDF content...
    ])
    
    console.log('✅ Test buffer created')
    
    // Test file validation
    const file = new File([testBuffer], 'test.pdf', { type: 'application/pdf' })
    console.log('✅ Test file created:', file)
    
    // This would test the actual conversion
    // const result = await convertPdfToSvgClient(file)
    // console.log('Conversion result:', result)
    
  } catch (error) {
    console.error('❌ Error testing PDF converter:', error)
    console.error('Error stack:', error.stack)
  }
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.testPdfConverter = testPdfConverter
  console.log('Run testPdfConverter() in console to test')
}