# Production Security Checklist

## Before Deploying to Production

### 1. Source Maps & Debug Info
- [x] Disabled source maps in production (`productionBrowserSourceMaps: false`)
- [x] Disabled webpack devtool in production
- [x] Removed critical `console.log` statements from auth and results pages
- [x] Removed test pages and components
- [x] Archived test scripts

### 2. Environment Variables
- [ ] Move all sensitive keys to server-side only (no `NEXT_PUBLIC_` prefix)
- [ ] Use `.env.production` for production values
- [ ] Never commit `.env.local` or `.env.production` to git

### 3. API Security
- [ ] Add rate limiting to API routes
- [ ] Validate all inputs server-side
- [ ] Use CORS properly
- [ ] Add authentication checks on all protected routes

### 4. Build Optimization
```bash
# Production build command
NODE_ENV=production npm run build

# Check bundle size
npm run analyze
```

### 5. Headers Security
Add to `next.config.mjs`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }
  ]
}
```

### 6. Content Security Policy (CSP)
Consider adding CSP headers to prevent XSS attacks.

### 7. Regular Updates
- Keep Next.js and all dependencies updated
- Run `npm audit` regularly
- Use tools like Snyk or Dependabot

## Testing Production Build Locally
```bash
# Build and run production locally
npm run build
NODE_ENV=production npm start

# Open browser DevTools and verify:
# - No source maps in Sources tab
# - Minified code only
# - No readable component names
```