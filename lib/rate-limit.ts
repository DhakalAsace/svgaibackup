import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// NOTE: You need to set up Upstash Redis and add these environment variables:
// UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
// UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
// 
// Also install the required packages:
// npm install @upstash/ratelimit @upstash/redis

// Validate Redis environment variables early to avoid runtime surprises
if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('Environment variable UPSTASH_REDIS_REST_URL is not defined');
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Environment variable UPSTASH_REDIS_REST_TOKEN is not defined');
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiters = {
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
  }),
  portal: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    analytics: true,
  }),
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
  }),
};