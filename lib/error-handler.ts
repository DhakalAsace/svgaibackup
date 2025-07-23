/**
 * Error Handler Utility
 * 
 * This module provides standardized error handling functionality for API routes.
 * It creates appropriate error responses based on the environment (development/production)
 * to prevent information leakage in production while providing detailed errors during development.
 *
 * SECURITY: This module is critical for preventing sensitive information leakage,
 * including API keys and credentials, through error responses.
 */
// Import shared sanitization utility to avoid circular dependencies
import { sanitizeData, createSafeErrorObject } from './sanitize-utils';
/**
 * Response structure returned by createErrorResponse
 */
export interface ErrorResponseResult {
  response: {
    success: false;
    error: string;
    stack?: string;
    details?: unknown;
  };
  status: number;
}
/**
 * Response structure for successful API responses
 */
export interface SuccessResponseResult<T> {
  response: {
    success: true;
    data: T;
  };
  status: number;
}
/**
 * Creates a standardized API error response
 * 
 * @param error - The original error object or message
 * @param genericMessage - User-friendly error message to show in production
 * @param statusCode - HTTP status code for the response
 * @returns Structured error response with appropriate level of detail
 */
export function createErrorResponse(
  error: unknown,
  genericMessage = 'An error occurred',
  statusCode = 500
): ErrorResponseResult {
  // Sanitize error before logging to prevent leaking sensitive information
  const sanitizedError = sanitizeData(error);
  // Direct console error logging without circular dependency
  // In development, return detailed error information (still sanitized)
  if (process.env.NODE_ENV !== 'production') {
    return {
      response: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        // Provide sanitized details to prevent token leakage even in development
        details: sanitizedError
      },
      status: statusCode
    };
  }
  // In production, return only generic information to prevent leaking implementation details
  return {
    response: {
      success: false,
      error: genericMessage
    },
    status: statusCode
  };
}
/**
 * Handles common error scenarios in API routes
 * 
 * @param status - HTTP status code
 * @param message - Error message
 * @returns Response object
 */
export function createApiError(status: number, message: string): Response {
  return Response.json({ success: false, error: message }, { status });
}
/**
 * Creates a 401 Unauthorized response
 */
export function unauthorized(message = 'Authentication required'): Response {
  return createApiError(401, message);
}
/**
 * Creates a 403 Forbidden response
 */
export function forbidden(message = 'Insufficient privileges'): Response {
  return createApiError(403, message);
}
/**
 * Creates a 404 Not Found response
 */
export function notFound(message = 'Resource not found'): Response {
  return createApiError(404, message);
}
/**
 * Creates a 429 Too Many Requests response
 */
export function tooManyRequests(message = 'Rate limit exceeded'): Response {
  return createApiError(429, message);
}
/**
 * Creates a 400 Bad Request response
 */
export function badRequest(message = 'Invalid request'): Response {
  return createApiError(400, message);
}
/**
 * Creates a standardized successful API response
 * 
 * @param data - The data to include in the response
 * @param statusCode - HTTP status code for the response (default 200)
 * @returns Structured success response
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode = 200
): SuccessResponseResult<T> {
  return {
    response: {
      success: true,
      data
    },
    status: statusCode
  };
}
/**
 * Converts a success response result to an actual Response object
 * 
 * @param result - Success response result object
 * @returns Response object
 */
export function successResponse<T>(result: SuccessResponseResult<T>): Response {
  return Response.json(result.response, { status: result.status });
}