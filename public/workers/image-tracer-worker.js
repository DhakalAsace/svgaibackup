/**
 * Web Worker for Image Tracing
 * Runs ImageTracerJS in a separate thread to prevent UI blocking
 */

// Import ImageTracerJS in the worker
importScripts('https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracerjs.js');

// Handle messages from main thread
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  if (type === 'TRACE_IMAGE') {
    const { dataUrl, options, jobId } = data;
    
    try {
      // Send progress update
      self.postMessage({
        type: 'PROGRESS',
        jobId,
        progress: 0.1
      });
      
      // Check if ImageTracer is available
      if (typeof ImageTracer === 'undefined') {
        throw new Error('ImageTracer not loaded in worker');
      }
      
      // Send progress update
      self.postMessage({
        type: 'PROGRESS', 
        jobId,
        progress: 0.3
      });
      
      const startTime = Date.now();
      
      // Perform the actual tracing (this will block the worker thread, not main thread)
      ImageTracer.imageToSVG(
        dataUrl,
        function(svgString) {
          const processingTime = Date.now() - startTime;
          
          // Send completion message
          self.postMessage({
            type: 'COMPLETE',
            jobId,
            result: svgString,
            processingTime
          });
        },
        options
      );
      
    } catch (error) {
      // Send error message
      self.postMessage({
        type: 'ERROR',
        jobId,
        error: error.message
      });
    }
  }
};

// Send ready message when worker is initialized
self.postMessage({ type: 'READY' });