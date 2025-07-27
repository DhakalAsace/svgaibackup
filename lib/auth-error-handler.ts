export class AuthErrorHandler {
  static getErrorMessage(error: any): string {
    if (!error) return 'An unknown error occurred';
    
    const errorMessage = error?.message || error?.error_description || error?.toString() || 'An unknown error occurred';
    
    // Network/CORS errors
    if (errorMessage === 'Failed to fetch' || errorMessage.includes('NetworkError')) {
      return 'Unable to connect to authentication service. Please check your internet connection and try again.';
    }
    
    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    
    // Email already exists
    if (errorMessage.includes('already registered') || errorMessage.includes('User already registered')) {
      return 'This email is already registered. Please sign in instead.';
    }
    
    // Invalid email
    if (errorMessage.includes('Invalid email') || errorMessage.includes('valid email')) {
      return 'Please enter a valid email address.';
    }
    
    // Password requirements
    if (errorMessage.includes('password') && (errorMessage.includes('short') || errorMessage.includes('characters'))) {
      return 'Password must be at least 6 characters long.';
    }
    
    // Invalid credentials
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    
    // Email not confirmed
    if (errorMessage.includes('Email not confirmed')) {
      return 'Please check your email to confirm your account before signing in.';
    }
    
    // OAuth errors
    if (errorMessage.includes('OAuth') || errorMessage.includes('provider')) {
      return 'Error connecting with Google. Please try again or use email/password.';
    }
    
    // Server errors
    if (errorMessage.includes('500') || errorMessage.includes('server error')) {
      return 'Server error. Please try again later.';
    }
    
    // Default to original message if no match
    return errorMessage;
  }
  
  static isNetworkError(error: any): boolean {
    const errorMessage = error?.message || error?.toString() || '';
    return errorMessage === 'Failed to fetch' || 
           errorMessage.includes('NetworkError') ||
           errorMessage.includes('ERR_NETWORK') ||
           errorMessage.includes('ERR_INTERNET_DISCONNECTED');
  }
}