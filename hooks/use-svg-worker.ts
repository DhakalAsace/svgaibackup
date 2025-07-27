import { useEffect, useRef, useCallback } from 'react';

export function useSvgWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Only initialize worker in browser
    if (typeof window !== 'undefined' && window.Worker) {
      workerRef.current = new Worker('/svg-worker.js');
      
      return () => {
        workerRef.current?.terminate();
      };
    }
  }, []);

  const parseSVG = useCallback((svgContent: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        // Fallback to main thread
        resolve(svgContent.includes('<svg') && svgContent.includes('</svg>'));
        return;
      }

      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'svgParsed') {
          workerRef.current?.removeEventListener('message', handleMessage);
          resolve(e.data.isValid);
        } else if (e.data.type === 'error') {
          workerRef.current?.removeEventListener('message', handleMessage);
          reject(new Error(e.data.error));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({ type: 'parseSVG', data: svgContent });
    });
  }, []);

  const optimizeSVG = useCallback((svgContent: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        // Fallback to main thread
        const optimized = svgContent
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .trim();
        resolve(optimized);
        return;
      }

      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'svgOptimized') {
          workerRef.current?.removeEventListener('message', handleMessage);
          resolve(e.data.data);
        } else if (e.data.type === 'error') {
          workerRef.current?.removeEventListener('message', handleMessage);
          reject(new Error(e.data.error));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({ type: 'optimizeSVG', data: svgContent });
    });
  }, []);

  return { parseSVG, optimizeSVG };
}