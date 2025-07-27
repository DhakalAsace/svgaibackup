// SVG Worker for offloading heavy SVG processing tasks
self.addEventListener('message', function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'parseSVG':
      try {
        // Basic SVG validation
        const isValid = data.includes('<svg') && data.includes('</svg>');
        self.postMessage({ type: 'svgParsed', isValid });
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
      }
      break;
      
    case 'optimizeSVG':
      try {
        // Simple SVG optimization (remove comments, extra spaces)
        let optimized = data
          .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
          .replace(/\s+/g, ' ') // Collapse spaces
          .replace(/>\s+</g, '><') // Remove spaces between tags
          .trim();
        
        self.postMessage({ type: 'svgOptimized', data: optimized });
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
      }
      break;
      
    default:
      self.postMessage({ type: 'error', error: 'Unknown message type' });
  }
});