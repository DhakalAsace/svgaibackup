# Supabase Edge Functions

This directory contains Edge Functions for the SVG AI application.

## Functions

### 1. scheduled-storage-cleanup
- **Purpose**: Processes the storage cleanup queue to delete expired files
- **Schedule**: Can be triggered via pg_cron or manually
- **Behavior**: 
  - Processes items in batches of 50
  - Marks items as processed after deletion
  - Cleans up old processed items after 7 days

### 2. cleanup-storage
- **Purpose**: Manual cleanup endpoint with status checking
- **Methods**:
  - GET: Returns queue statistics (pending/processed items)
  - POST: Processes up to 100 items from the cleanup queue
- **Use Case**: Can be called from admin panel or external services

## Deployment

Deploy these functions to Supabase:

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy scheduled-storage-cleanup
supabase functions deploy cleanup-storage
```

## Already Deployed Status

⚠️ **Note**: These functions have already been deployed to your Supabase project via MCP. The source files are kept here for:
- Version control
- Future updates
- Documentation
- Local development

## How They Work

1. When videos/files expire, they are added to `storage_cleanup_queue` table
2. These Edge Functions process that queue:
   - Delete files from Supabase storage
   - Mark queue items as processed
   - Clean up old queue entries

## Scheduling

To schedule automatic cleanup, run this in Supabase SQL Editor:

```sql
-- Schedule cleanup to run daily at 3 AM
SELECT cron.schedule(
  'trigger-storage-cleanup',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/scheduled-storage-cleanup',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object('trigger', 'scheduled')
  );
  $$
);
```