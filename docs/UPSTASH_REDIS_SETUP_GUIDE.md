# Upstash Redis Setup Guide - Step by Step

## Overview
Upstash Redis is used in this application for rate limiting. It's a serverless Redis service that works perfectly with Vercel's serverless functions.

## Step 1: Create an Upstash Account

1. **Go to Upstash Website**
   - Navigate to https://upstash.com
   - Click "Start Free" or "Sign Up" button

2. **Choose Sign-up Method**
   - You can sign up using:
     - GitHub account (recommended for developers)
     - Google account
     - Amazon account
     - Email and password

3. **Complete Registration**
   - If using social auth, authorize Upstash
   - If using email, verify your email address

## Step 2: Create a Redis Database

1. **Access the Console**
   - After login, you'll be in the Upstash Console
   - URL: https://console.upstash.com

2. **Create New Database**
   - Click "Create Database" button
   - Choose "Redis" (not Kafka or Vector)

3. **Configure Your Database**
   - **Name**: Give it a name (e.g., "svgai-ratelimit")
   - **Type**: Select "Regional" (not Global)
   - **Region**: Choose closest to your Vercel deployment
     - For US: `us-east-1` or `us-west-1`
     - For Europe: `eu-west-1`
   - **Eviction**: Enable eviction (recommended for rate limiting)
   - Click "Create"

## Step 3: Get Your REST Credentials

1. **Navigate to Your Database**
   - Click on your newly created database name
   - You'll see the database details page

2. **Find the REST API Section**
   - Scroll down to find "REST API" section
   - Or look for a tab labeled "REST API"

3. **Copy Your Credentials**
   
   You'll see two important values:
   
   ```
   UPSTASH_REDIS_REST_URL=https://YOUR-DATABASE-NAME.upstash.io
   UPSTASH_REDIS_REST_TOKEN=YOUR-LONG-TOKEN-HERE
   ```

   - **REST URL**: Looks like `https://excited-caribou-12345.upstash.io`
   - **REST Token**: A long string starting with something like `AX...`

4. **Copy Both Values**
   - Click the copy button next to each value
   - Save them securely - you'll need them for your `.env.local`

## Step 4: Add to Your Environment Variables

1. **Local Development**
   Add to your `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Vercel Deployment**
   Add the same variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

## Step 5: Test Your Connection

You can test if your credentials work by creating a simple test file:

```javascript
// test-redis.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function test() {
  try {
    await redis.set('test', 'Hello Upstash!');
    const value = await redis.get('test');
    console.log('Success! Value:', value);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
```

Run with: `node test-redis.js`

## Important Notes

### Free Tier Limits
- **10,000 commands/day** (plenty for development)
- **256MB storage**
- **No credit card required**

### Security Best Practices
1. **Never commit tokens** to your repository
2. **Use environment variables** for all credentials
3. **Rotate tokens** if exposed (in Upstash Console > Security)

### Rate Limiting Implementation
Your app uses Upstash Redis for:
- Tracking API requests per user/IP
- Enforcing rate limits
- Preventing abuse

The implementation is in `/lib/rate-limit.ts`

## Troubleshooting

### Common Issues

1. **"WRONGPASS invalid or missing auth token"**
   - Double-check your token is copied correctly
   - Ensure no extra spaces or quotes
   - Verify token hasn't been revoked

2. **Connection timeouts**
   - Check if database is active (not paused)
   - Verify the URL is correct
   - Check your internet connection

3. **Rate limit errors in development**
   - The free tier has 10K commands/day
   - Reset counters in Upstash Console if needed

### Getting Help
- Upstash Documentation: https://upstash.com/docs
- Upstash Discord: https://upstash.com/discord
- Support: support@upstash.com

## Alternative: Skip Redis (Development Only)

If you want to skip Redis setup for local development, you can modify the rate limiting code to bypass Redis checks. However, this is NOT recommended for production as it removes rate limiting protection.

```javascript
// In your rate limiting code, add a bypass for development
if (process.env.NODE_ENV === 'development' && !process.env.UPSTASH_REDIS_REST_URL) {
  console.warn('Redis not configured - rate limiting disabled');
  return { success: true };
}
```