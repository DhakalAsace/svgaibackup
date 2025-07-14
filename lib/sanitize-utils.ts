/**
 * Shared Utility for Sanitizing Data
 * 
 * This module provides common sanitization functions used by both
 * the logger and error handler to prevent circular dependencies.
 */

/**
 * Sanitizes potentially sensitive data for logging purposes
 * Masks fields that might contain tokens, keys, passwords, etc.
 */
export function sanitizeData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Error objects
  if (data instanceof Error) {
    const sanitized: Record<string, unknown> = {
      name: data.name,
      message: data.message,
    };
    
    // Only include stack traces in development
    if (process.env.NODE_ENV !== 'production') {
      sanitized.stack = data.stack;
    }
    
    // Handle error cause if present
    if ('cause' in data && data.cause) {
      sanitized.cause = sanitizeData(data.cause);
    }
    
    return sanitized;
  }
  
  // Handle object types (including arrays)
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }
    
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // List of sensitive fields to mask
      if (
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('key') ||
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('credential') ||
        key.toLowerCase().includes('cookie') ||
        key.toLowerCase().includes('session')
      ) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  // For primitive values
  return data;
}

/**
 * Utility to create a standard error object with sanitized fields
 */
export function createSafeErrorObject(error: unknown, includeDetails = false): Record<string, unknown> {
  const sanitized = sanitizeData(error);
  
  return {
    message: error instanceof Error ? error.message : String(error),
    ...(includeDetails ? { details: sanitized } : {}),
    ...(error instanceof Error && process.env.NODE_ENV !== 'production' 
      ? { stack: error.stack } 
      : {})
  };
}
