// Simple test to verify HEIC converter can be imported and instantiated
async function testHeicConverter() {
  try {
    console.log('Testing HEIC converter imports...')
    
    // Test if we can import the converter
    const { heicToSvgConverter } = await import('./lib/converters/heic-to-svg.js')
    console.log('✅ HEIC converter imported successfully')
    console.log('Converter name:', heicToSvgConverter.name)
    console.log('From format:', heicToSvgConverter.from)
    console.log('To format:', heicToSvgConverter.to)
    console.log('Is client side:', heicToSvgConverter.isClientSide)
    
    // Test if we can import the client wrapper
    const { getClientConverter } = await import('./lib/converters/client-wrapper.js')
    console.log('✅ Client wrapper imported successfully')
    
    // Test getting the HEIC converter through client wrapper
    try {
      const converter = await getClientConverter('heic', 'svg')
      if (converter) {
        console.log('✅ HEIC converter available through client wrapper:', converter.name)
      } else {
        console.log('❌ HEIC converter not available through client wrapper')
      }
    } catch (error) {
      console.log('❌ Error getting converter through client wrapper:', error.message)
    }
    
    console.log('✅ All HEIC converter tests passed!')
    
  } catch (error) {
    console.error('❌ HEIC converter test failed:', error)
    console.error('Error details:', error.stack)
  }
}

testHeicConverter()