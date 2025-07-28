'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical fonts
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload font files
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = '/_next/static/media/4f05ba3a6752a328-s.p.woff2';
        document.head.appendChild(link);
      });
    }

    // Resource hints for common user paths
    const prefetchPaths = [
      '/dashboard',
      '/convert/png-to-svg',
      '/convert/svg-to-png',
      '/convert/jpg-to-svg'
    ];

    // Prefetch after page load
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchPaths.forEach(path => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = path;
          document.head.appendChild(link);
        });
      }, { timeout: 2000 });
    }
  }, []);

  return null;
}