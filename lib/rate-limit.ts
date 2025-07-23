// Simple in-memory rate limiter as a fallback when Upstash is not configured
// This is sufficient for development and small-scale production use

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

class SimpleRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.requests.get(identifier);
    
    // Clean up old entries periodically
    if (this.requests.size > 1000) {
      for (const [key, value] of this.requests.entries()) {
        if (value.resetTime < now) {
          this.requests.delete(key);
        }
      }
    }
    
    if (!record || record.resetTime < now) {
      // New window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: now + this.windowMs
      };
    }
    
    if (record.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: record.resetTime
      };
    }
    
    record.count++;
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime
    };
  }
}

// Always use simple in-memory rate limiter for now
// Upstash can be added later if needed for production scaling
console.log('Using in-memory rate limiter');
const rateLimiters = {
  checkout: new SimpleRateLimiter(10, 60 * 1000), // 10 requests per minute
  portal: new SimpleRateLimiter(5, 60 * 1000), // 5 requests per minute
  webhook: new SimpleRateLimiter(100, 60 * 1000), // 100 requests per minute
};

export { rateLimiters };