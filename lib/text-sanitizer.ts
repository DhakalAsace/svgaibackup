/**
 * Text Sanitizer Utility
 * 
 * This module provides functionality to sanitize user-provided text
 * to prevent XSS attacks when the text is rendered in HTML contexts.
 */

/**
 * Sanitizes text for safe rendering in HTML contexts by encoding
 * special characters that could be used in XSS attacks
 * 
 * @param input - User-provided text to sanitize
 * @returns Sanitized text safe for rendering in HTML
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')    // & -> &amp;
    .replace(/</g, '&lt;')     // < -> &lt;
    .replace(/>/g, '&gt;')     // > -> &gt;
    .replace(/"/g, '&quot;')   // " -> &quot;
    .replace(/'/g, '&#39;');   // ' -> &#39;
}

/**
 * Sanitizes and trims text to a maximum length
 * Useful for titles, descriptions, etc.
 * 
 * @param input - User-provided text to sanitize
 * @param maxLength - Maximum length of the returned string
 * @returns Sanitized and trimmed text
 */
export function sanitizeAndTrimText(input: string, maxLength = 50): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim whitespace and limit length
  const trimmed = input.trim().substring(0, maxLength);
  
  // Sanitize the trimmed text
  return sanitizeText(trimmed);
}
