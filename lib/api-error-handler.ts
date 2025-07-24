import { createLogger } from '@/lib/logger';

const logger = createLogger('api-error-handler');

export interface APIError {
  message: string;
  statusCode: number;
  userMessage: string;
  shouldRefundCredits?: boolean;
}

/**
 * Maps API errors to user-friendly messages
 */
export function handleAPIError(error: any): APIError {
  // Log the full error for debugging
  logger.error('API Error encountered', { error });

  // Default error response
  let apiError: APIError = {
    message: error?.message || 'An unexpected error occurred',
    statusCode: 500,
    userMessage: 'Something went wrong. Please try again.',
    shouldRefundCredits: true
  };

  // Handle specific error types
  if (error?.message?.includes('402') || error?.status === 402) {
    apiError = {
      message: 'Payment Required - API limit reached',
      statusCode: 503,
      userMessage: 'Our AI service has temporarily reached its usage limit. This usually resets within a few hours. Please try again later or contact support if this persists.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('401') || error?.status === 401) {
    apiError = {
      message: 'Unauthorized - Invalid API credentials',
      statusCode: 503,
      userMessage: 'The AI service is temporarily unavailable. Our team has been notified and is working on it.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('429') || error?.status === 429) {
    apiError = {
      message: 'Too Many Requests - Rate limit exceeded',
      statusCode: 429,
      userMessage: 'The AI service is experiencing high demand. Please wait a few minutes and try again.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('timeout') || error?.message?.includes('timed out')) {
    apiError = {
      message: 'Request timeout',
      statusCode: 504,
      userMessage: 'The AI model is taking longer than expected. This can happen during peak times. Please try again.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('504') || error?.status === 504) {
    apiError = {
      message: 'Gateway timeout',
      statusCode: 504,
      userMessage: 'The AI service is currently slow to respond. Please try again in a moment.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('503') || error?.status === 503) {
    apiError = {
      message: 'Service unavailable',
      statusCode: 503,
      userMessage: 'The AI service is temporarily down for maintenance. Please try again in a few minutes.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
    apiError = {
      message: 'Network error',
      statusCode: 503,
      userMessage: 'Unable to connect to the AI service. Please check your connection and try again.',
      shouldRefundCredits: true
    };
  } else if (error?.message?.includes('Invalid prompt') || error?.message?.includes('validation')) {
    apiError = {
      message: 'Invalid input',
      statusCode: 400,
      userMessage: 'Please check your input and try again. Make sure your prompt is descriptive and appropriate.',
      shouldRefundCredits: false
    };
  } else if (error?.message?.includes('NSFW') || error?.message?.includes('safety')) {
    apiError = {
      message: 'Content policy violation',
      statusCode: 400,
      userMessage: 'Your prompt was flagged by our content filter. Please try a different description.',
      shouldRefundCredits: false
    };
  }

  return apiError;
}

/**
 * Checks if an error is from Replicate API
 */
export function isReplicateError(error: any): boolean {
  return error?.message?.includes('replicate.com') || 
         error?.response?.headers?.get('x-powered-by')?.includes('Replicate');
}

/**
 * Checks if an error is from Fal AI API
 */
export function isFalError(error: any): boolean {
  return error?.message?.includes('fal.ai') || 
         error?.response?.headers?.get('x-powered-by')?.includes('Fal');
}

/**
 * Extract error details from various error formats
 */
export function extractErrorDetails(error: any): { message: string; code?: string; status?: number } {
  // Handle Replicate error format
  if (error?.detail) {
    return {
      message: error.detail,
      status: error.status
    };
  }

  // Handle standard Error object
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }

  // Handle response error format
  if (error?.response) {
    return {
      message: error.response.statusText || error.response.data?.message || 'API request failed',
      status: error.response.status
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error
    };
  }

  // Default
  return {
    message: 'An unexpected error occurred'
  };
}