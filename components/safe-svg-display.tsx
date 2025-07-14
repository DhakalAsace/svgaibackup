"use client";

import { useState, useEffect } from 'react';
import { sanitizeSvg } from '@/lib/svg-sanitizer';

interface SafeSvgDisplayProps {
  svgContent: string;
  className?: string;
  alt?: string;
}

/**
 * Safely renders SVG content inline after sanitization.
 * Relies on parent container and CSS classes for sizing.
 */
export function SafeSvgDisplay({ 
  svgContent, 
  className = '',
  alt = "SVG Image"
}: SafeSvgDisplayProps) {
  
  const [sanitizedContent, setSanitizedContent] = useState<string | null>(null);

  useEffect(() => {
    if (svgContent) {
      try {
        // Sanitize the SVG content
        const sanitized = sanitizeSvg(svgContent);
        setSanitizedContent(sanitized);
      } catch (error) {
        console.error("Error sanitizing SVG:", error);
        setSanitizedContent("<p>Error displaying SVG</p>"); // Display error message
      }
    } else {
      setSanitizedContent(null);
    }
  }, [svgContent]);

  if (!sanitizedContent) {
    // Optionally return a placeholder or null while loading/sanitizing
    return null; 
  }

  // Render the sanitized SVG inline within a div
  // Apply the passed className to this div for styling control
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      role="img" // Add role for accessibility
      aria-label={alt} // Use alt prop for aria-label
    />
  );
}
