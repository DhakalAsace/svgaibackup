'use client';

import Script from 'next/script';

export function PerformanceScript() {
  return (
    <Script 
      id="performance-optimizations"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // Preload critical resources
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              // Preload fonts
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'font';
              link.type = 'font/woff2';
              link.crossOrigin = 'anonymous';
              link.href = '/_next/static/media/';
              
              // Prefetch next likely navigation
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.href = '/convert';
              document.head.appendChild(prefetchLink);
            });
          }
          
          // Remove legacy polyfills check
          if (!window.Promise || !window.fetch || !Array.prototype.includes) {
            console.warn('Legacy browser detected');
          }
        `
      }}
    />
  );
}