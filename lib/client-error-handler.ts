/**
 * Client-side error message formatter
 * Extracts user-friendly error messages from API responses
 */

export function formatErrorMessage(error: any): string {
  // If it's already a string, check if it's a raw API error
  if (typeof error === 'string') {
    // Check for common API error patterns
    if (error.includes('402') || error.includes('Payment Required')) {
      return 'Our AI service has temporarily reached its usage limit. This usually resets within a few hours. Please try again later.';
    }
    // Check if it's a user limit message (not an API rate limit)
    if (error.includes('Sign up to continue') || error.includes('used all your') || error.includes('credits') || error.includes('sign up for a free account')) {
      return error; // Return the original message about signing up
    }
    // Handle device verification error
    if (error.includes('Unable to verify') && error.includes('device')) {
      return 'Please sign up for a free account to continue generating. You\'ll get 6 bonus credits!';
    }
    if (error.includes('429') || error.includes('rate limit')) {
      return 'The AI service is experiencing high demand. Please wait a moment and try again.';
    }
    if (error.includes('timeout') || error.includes('504')) {
      return 'The AI service is taking longer than expected. This can happen during peak times. Please try again.';
    }
    if (error.includes('503') || error.includes('unavailable')) {
      return 'The AI service is temporarily down for maintenance. Please try again in a few minutes.';
    }
    return error;
  }

  // If it's an Error object
  if (error instanceof Error) {
    return formatErrorMessage(error.message);
  }

  // If it's an object with error property
  if (error?.error) {
    return formatErrorMessage(error.error);
  }

  // If it's an object with message property
  if (error?.message) {
    return formatErrorMessage(error.message);
  }

  // Default fallback
  return 'Something went wrong. Please try again.';
}

/**
 * Checks if an error is likely a temporary service issue
 */
export function isTemporaryError(error: any): boolean {
  const errorMsg = typeof error === 'string' ? error : error?.message || error?.error || '';
  
  return errorMsg.includes('402') || 
         errorMsg.includes('429') || 
         errorMsg.includes('503') || 
         errorMsg.includes('timeout') ||
         errorMsg.includes('service') ||
         errorMsg.includes('limit reached');
}

/**
 * Gets a retry suggestion based on the error type
 */
export function getRetrySuggestion(error: any): string {
  const errorMsg = typeof error === 'string' ? error : error?.message || error?.error || '';
  
  if (errorMsg.includes('402') || errorMsg.includes('limit reached')) {
    return 'This usually resets within a few hours.';
  }
  if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
    return 'Please wait a minute before trying again.';
  }
  if (errorMsg.includes('timeout')) {
    return 'Try again when the service is less busy.';
  }
  
  return 'Please try again in a moment.';
}