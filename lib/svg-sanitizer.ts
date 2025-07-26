/**
 * SVG Sanitizer Utility
 *
 * This module sanitizes SVG content to prevent XSS and other attacks.
 * It uses a lightweight approach compatible with Edge Runtime environments.
 */

/**
 * Simple SVG sanitization for Edge Runtime environments
 * This implementation uses regex patterns to remove potentially dangerous content
 * without relying on DOM APIs or the window object.
 * 
 * @param svgContent - Raw SVG content to sanitize
 * @returns Sanitized SVG content safe for rendering
 */
export function sanitizeSvg(svgContent: string): string {
  if (!svgContent || typeof svgContent !== 'string') {
    return '';
  }

  // Basic SVG validation - must start with <svg
  if (!svgContent.trim().toLowerCase().startsWith('<svg')) {
    return '';
  }

  // Remove potentially dangerous elements and attributes
  const sanitized = svgContent
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove onclick and similar event handlers (both double and single quotes)
    .replace(/\s(on\w+)=["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/\b(href|xlink:href|src)="javascript:[^"]*"/gi, '')
    // Remove data: URLs except for safe image types
    .replace(/\b(href|xlink:href|src)="data:(?!image\/(png|jpeg|jpg|gif|svg\+xml))[^"]*"/gi, '')
    // Remove external references that could be used for data exfiltration
    .replace(/\b(href|xlink:href|src)="https?:[^"]*"/gi, '')
    // Remove potentially dangerous tags
    .replace(/<(iframe|object|embed|form|input|style|meta|base|link)\b[^>]*>/gi, '')
    // Remove XML processing instructions
    .replace(/<\?[^>]*\?>/g, '')
    // Remove XML DTD declarations
    .replace(/<!DOCTYPE[^>]*>/g, '')
    // Remove XML entity declarations
    .replace(/<!ENTITY[^>]*>/g, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '');

  return sanitized;
}

/**
 * Converts an SVG string to a data URL for embedding in HTML
 * 
 * @param svgContent - SVG content to convert
 * @returns Data URL containing the SVG
 */
export function svgToDataUrl(svgContent: string): string {
  const sanitized = sanitizeSvg(svgContent);
  
  // Use Buffer in Node.js environments or TextEncoder in Edge
  try {
    // Node.js environment
    if (typeof Buffer !== 'undefined') {
      return `data:image/svg+xml;base64,${Buffer.from(sanitized).toString('base64')}`;
    }
    
    // Edge/Browser environment
    const encoder = new TextEncoder();
    const bytes = encoder.encode(sanitized);
    const base64 = btoa(
      Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join('')
    );
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    // Fallback for any environment
    const encoded = encodeURIComponent(sanitized)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    return `data:image/svg+xml,${encoded}`;
  }
}
