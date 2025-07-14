# Debug Steps for "sharp is not defined" Error

## Current Status
The error "sharp is not defined" is appearing when trying to convert WebP to SVG, but this converter doesn't use sharp at all - it uses imagetracerjs.

## What We've Done
1. Created client-wrapper.ts to dynamically load converters
2. Updated all components to use the client wrapper
3. Added extensive logging to track the error source
4. Verified WebP to SVG converter doesn't import sharp

## Debugging Steps to Try

### 1. Check Browser Console
When you see the error, check the browser console (F12) for any additional error messages or stack traces.

### 2. Test with Console Command
In the browser console, try:
```javascript
// Check if sharp is being referenced globally
console.log(typeof sharp)
console.log(typeof window.sharp)

// Check what modules are loaded
console.log(Object.keys(window).filter(k => k.includes('sharp')))
```

### 3. Add Global Error Interceptor
Add this to your browser console before testing:
```javascript
window.addEventListener('error', (e) => {
  console.error('Global error caught:', e);
  console.error('Error object:', e.error);
  console.error('Stack trace:', e.error?.stack);
  return false;
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e);
  console.error('Reason:', e.reason);
  console.error('Stack:', e.reason?.stack);
});
```

### 4. Test Direct Converter
In browser console:
```javascript
// Test loading the converter directly
import('/lib/converters/client-wrapper.js').then(module => {
  console.log('Module loaded:', module);
  module.getClientConverter('webp', 'svg').then(converter => {
    console.log('Converter loaded:', converter);
  }).catch(err => {
    console.error('Failed to load converter:', err);
  });
});
```

### 5. Check Network Tab
1. Open DevTools Network tab
2. Try the conversion
3. Look for any failed module loads or 404s

### 6. Possible Causes
1. **Build-time bundling**: Next.js might be bundling all converters together during build
2. **Polyfill issue**: Buffer polyfill might be referencing sharp somehow
3. **Third-party library**: imagetracerjs or another library might have a sharp reference
4. **Service Worker**: Check if there's a service worker intercepting requests

### 7. Quick Fix to Try
Try converting with a very simple test file:
1. Create a 10x10 pixel WebP image
2. Try converting that
3. See if the error still occurs

### 8. Alternative Approach
If the issue persists, we could create a completely isolated converter that doesn't use the base classes:

```typescript
// test-webp-converter.ts
export async function testWebpToSvg(file: File): Promise<string> {
  console.log('Test converter started');
  
  try {
    // Direct import without any wrappers
    const ImageTracer = await import('imagetracerjs');
    console.log('ImageTracer loaded');
    
    // Convert file to data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Convert to SVG
    return new Promise((resolve, reject) => {
      ImageTracer.imageToSVG(dataUrl, (svg: string) => {
        console.log('Conversion complete');
        resolve(svg);
      });
    });
  } catch (error) {
    console.error('Test converter error:', error);
    throw error;
  }
}
```

## Next Steps
1. Check browser console with the debugging steps above
2. Look for any patterns in when the error occurs
3. Try the isolated test converter
4. Check if other conversions work (PNG to SVG, JPG to SVG)