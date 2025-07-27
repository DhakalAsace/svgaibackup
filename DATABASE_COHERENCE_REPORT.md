# Database Coherence Report

## Summary
After comparing the actual Supabase database schema with the TypeScript types and code operations, I've identified several discrepancies that need to be fixed.

## Key Findings

### 1. Profiles Table Discrepancies

**Database has these columns:**
- `name` (text) - but TypeScript has `username`, `email`, `full_name`, `avatar_url`
- Missing `email`, `username`, `full_name`, `avatar_url` columns in database
- Missing `subscription_interval` column in database

**Type fixes needed:**
- The profiles table in the database doesn't match the TypeScript types
- Need to either update the database schema or fix the types

### 2. Missing Tables in TypeScript Types

The following tables exist in the code but not in the types:
- `monitoring_metrics`
- `funnel_conversions`
- `monitoring_alerts`
- `web_vitals_logs`
- `performance_alerts`
- `error_groups`
- `error_events`
- `synthetic_checks`
- `uptime_metrics`
- `analytics_events`
- `conversion_metrics`
- `redirect_logs`

### 3. Webhook Events Table

**Database structure:**
- `stripe_event_id` (text, NOT NULL)
- `idempotency_key` (text, NOT NULL)
- `processed_at` (timestamptz)
- No `payload`, `status`, `error_message`, `processing_time` columns

**TypeScript has these extra columns that don't exist:**
- `payload`
- `status`
- `error_message`
- `processing_time`

### 4. Payment Audit Log Table

**Database structure:**
- `event_data` (jsonb) - but TypeScript has it as `metadata`
- `ip_address` (inet)
- `user_agent` (text)
- Missing `amount`, `currency` columns

### 5. Storage Cleanup Queue Table

This table exists in the database but is missing from TypeScript types entirely.

## Recommended Actions

1. **Update TypeScript types to match actual database schema**
2. **Create missing monitoring/analytics tables** or remove references from code
3. **Fix profiles table** - either migrate database or update code to use correct columns
4. **Update webhook handling** to match actual table structure

## Critical Issues

1. **Profiles table mismatch is critical** - the code expects `email`, `username`, etc. but database only has `name`
2. **Webhook events insertion will fail** - trying to insert non-existent columns
3. **Payment audit log references wrong column name** (`metadata` vs `event_data`)