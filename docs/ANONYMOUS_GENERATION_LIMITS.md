# Anonymous User Generation Limits

## Overview
Anonymous users can generate a limited number of SVGs and icons before being required to sign up.

## Limits
- **SVG Generation**: 1 per day (from homepage)
- **Icon Generation**: 2 per day (from /ai-icon-generator)
- Limits reset daily at midnight UTC

## Privacy Implementation

### IP Hashing
- IPs are hashed using SHA-256 with a salt before storage
- Hash function: `SHA256(IP + 'svgai-salt-2025')`
- One-way hash - cannot be reversed to original IP
- GDPR-compliant pseudonymization

### Data Retention
- Anonymous records are automatically deleted after 7 days
- Cleanup runs randomly (1% chance) on each new generation
- Ensures minimal data retention for privacy compliance

## Technical Details

### Database Structure
```sql
daily_generation_limits (
  identifier: TEXT,        -- Hashed IP for anonymous users
  identifier_type: TEXT,   -- 'ip_address' or 'user_id'
  generation_date: DATE,   -- Date of generation
  generation_type: TEXT,   -- 'svg' or 'icon'
  count: INTEGER          -- Number of generations
)
```

### API Endpoints
- `/api/generate-svg` - Passes 'svg' as generation_type
- `/api/generate-icon` - Passes 'icon' as generation_type

### Error Messages
When limit is reached: "Sign up to continue generating for free and get 6 bonus credits!"

## Why Not Use Cookies/Sessions?

1. **Easy to Bypass**: Users can:
   - Clear cookies
   - Use incognito/private mode
   - Switch browsers
   - Use different devices

2. **IP Hashing Benefits**:
   - More reliable rate limiting
   - Privacy-preserving (hashed)
   - Automatic cleanup after 7 days
   - Prevents automated abuse

## Legal Compliance

### GDPR Compliance
- ✅ Legitimate interest (preventing abuse)
- ✅ Data minimization (only hash stored)
- ✅ Limited retention (7 days)
- ✅ Pseudonymization (one-way hash)
- ✅ No personal data stored

### Best Practices
1. Never store raw IP addresses
2. Use consistent salting for hashes
3. Implement automatic cleanup
4. Document retention periods
5. Provide clear user notices