# Supabase + Vercel Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the SVG AI application with proper content expiration and cleanup functionality.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required variables are set in Vercel:

```env
# Supabase Core (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Database URLs (Required)
DATABASE_URL=your_postgres_url
DIRECT_URL=your_direct_postgres_url

# Other Required Keys
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Supabase Setup

#### A. Run Database Migrations
```bash
# Apply all migrations in order
supabase db push
```

#### B. Deploy Edge Functions
```bash
# Deploy storage cleanup functions
supabase functions deploy scheduled-storage-cleanup
supabase functions deploy cleanup-storage
```

#### C. Configure Cron Jobs
In Supabase Dashboard → SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanups
SELECT cron.schedule('cleanup-svgs', '0 0 * * *', 'SELECT cleanup_old_svg_designs()');
SELECT cron.schedule('cleanup-videos', '0 2 * * *', 'SELECT cleanup_expired_videos_improved()');
SELECT cron.schedule('storage-cleanup', '0 3 * * *', 'SELECT trigger_storage_cleanup()');
```

### 3. Vercel Deployment

```bash
# Deploy to Vercel
vercel --prod
```

## 🧪 Post-Deployment Verification

### 1. Run Verification Script
```bash
# Install dependencies if needed
npm install

# Run verification
npx tsx scripts/verify-deployment.ts
```

Expected output:
```
🔍 Verifying Supabase deployment...

📊 Checking database tables...
  ✅ Table: profiles
  ✅ Table: svg_designs
  ✅ Table: generated_videos
  ✅ Table: storage_cleanup_queue

⏰ Checking scheduled jobs...
  ✅ SVG Cleanup
  ✅ Video Cleanup
  ✅ Storage Cleanup

🚀 Checking Edge Functions...
  ✅ Edge Function: scheduled-storage-cleanup (Status: 200)
  ✅ Edge Function: cleanup-storage (Status: 200)

🗑️ Checking retention policy enforcement...
  ✅ All users within retention limits

📦 Checking storage cleanup queue...
  📊 Pending cleanup items: 0
  ✅ Cleanup queue is healthy
```

### 2. Run Playwright Tests
```bash
# Run expiration tests
npx playwright test tests/e2e/content-expiration.spec.ts
```

## 🔄 Automated Cleanup Schedule

| Task | Schedule | Function | Description |
|------|----------|----------|-------------|
| SVG Cleanup | Daily 00:00 UTC | `cleanup_old_svg_designs()` | Removes SVGs older than 7 days (free/starter) or 30 days (pro) |
| Video Cleanup | Daily 02:00 UTC | `cleanup_expired_videos_improved()` | Removes expired videos and queues storage cleanup |
| Storage Cleanup | Daily 03:00 UTC | `trigger_storage_cleanup()` | Processes storage deletion queue |
| Edge Function | On-demand | `scheduled-storage-cleanup` | Batch processes storage deletions |

## 🚨 Monitoring & Alerts

### 1. Check Cleanup Status
```sql
-- In Supabase SQL Editor
-- Check recent cleanup activity
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;

-- Check pending storage cleanup
SELECT COUNT(*) as pending_items 
FROM storage_cleanup_queue 
WHERE processed_at IS NULL;
```

### 2. Monitor Edge Function Logs
In Supabase Dashboard → Functions → Logs

Look for:
- `[Scheduled Cleanup] Starting storage cleanup`
- `[Scheduled Cleanup] Completed with X deletions`

## 🛠️ Troubleshooting

### Issue: Old content not being deleted

1. **Check cron job status:**
```sql
SELECT * FROM cron.job WHERE active = true;
```

2. **Manually trigger cleanup:**
```sql
SELECT cleanup_old_svg_designs();
SELECT cleanup_expired_videos_improved();
```

3. **Check Edge Function deployment:**
```bash
supabase functions list
```

### Issue: Storage not being cleaned

1. **Check cleanup queue:**
```sql
SELECT * FROM storage_cleanup_queue 
WHERE processed_at IS NULL 
LIMIT 10;
```

2. **Manually trigger Edge Function:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/scheduled-storage-cleanup \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

### Issue: Edge Functions not accessible

1. **Redeploy functions:**
```bash
supabase functions deploy --no-verify-jwt scheduled-storage-cleanup
```

2. **Check function logs:**
```bash
supabase functions logs scheduled-storage-cleanup
```

## 📊 Testing Different Scenarios

### Test Free User Retention (7 days)
```sql
-- Create test SVG older than 7 days for free user
INSERT INTO svg_designs (user_id, title, svg_content, created_at)
SELECT id, 'Test Old SVG', '<svg></svg>', NOW() - INTERVAL '8 days'
FROM profiles 
WHERE subscription_tier IS NULL 
LIMIT 1;

-- Run cleanup
SELECT cleanup_old_svg_designs();

-- Verify deletion
SELECT COUNT(*) FROM svg_designs 
WHERE title = 'Test Old SVG';
```

### Test Video Expiration
```sql
-- Check videos nearing expiration
SELECT id, expires_at, 
  EXTRACT(hours FROM expires_at - NOW()) as hours_until_expiry
FROM generated_videos
WHERE expires_at > NOW()
ORDER BY expires_at ASC
LIMIT 10;
```

## ✅ Deployment Complete!

Your application is now deployed with automatic content expiration and cleanup:

- ✅ SVGs expire based on user plan (7 or 30 days)
- ✅ Videos expire based on `expires_at` timestamp
- ✅ Storage is automatically cleaned up
- ✅ All cleanup runs on schedule via pg_cron

Monitor the cleanup jobs and Edge Function logs to ensure everything runs smoothly!