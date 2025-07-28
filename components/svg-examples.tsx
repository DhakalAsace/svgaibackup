'use client';

import { useEffect, useState } from 'react';

export type SVGExample = {
  src: string;
  alt: string;
  type: string;
  description: string;
  svgContent?: string;
};

// Lazy load SVG examples only when needed
async function loadSVGExamples(): Promise<SVGExample[]> {
  const { exampleSVGs } = await import('@/lib/svg-examples');
  return exampleSVGs;
}

// Client component that provides SVG examples data
export function SVGExamples() {
  return null; // Don't render anything, just for side effects
}

// Helper function to extract SVG examples data on the client side
export function useSVGExamples(): SVGExample[] {
  const [examples, setExamples] = useState<SVGExample[]>([]);

  useEffect(() => {
    // Lazy load examples only when component mounts
    loadSVGExamples().then(setExamples);
  }, []);

  return examples;
}