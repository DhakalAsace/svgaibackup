-- Fix video credits default value to match application code
ALTER TABLE generated_videos 
ALTER COLUMN credits_used SET DEFAULT 6;

-- Create a scheduled job for video cleanup (requires pg_cron extension)
-- Note: pg_cron must be enabled in Supabase dashboard first
DO $$
BEGIN
  -- Check if pg_cron is available
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Schedule video cleanup to run daily at 2 AM UTC
    PERFORM cron.schedule(
      'cleanup-expired-videos',
      '0 2 * * *',
      'SELECT cleanup_expired_videos();'
    );
    
    -- Schedule generation limits cleanup to run daily at 3 AM UTC
    PERFORM cron.schedule(
      'cleanup-old-generation-limits',
      '0 3 * * *',
      'SELECT cleanup_old_generation_limits();'
    );
    
    RAISE NOTICE 'Scheduled jobs created successfully';
  ELSE
    RAISE NOTICE 'pg_cron extension not available. Please enable it in Supabase dashboard or use Edge Functions for scheduling.';
  END IF;
END $$;

-- Create a function to check cleanup status for monitoring
CREATE OR REPLACE FUNCTION get_cleanup_status()
RETURNS TABLE(
  expired_videos_count INTEGER,
  expired_svgs_free_starter INTEGER,
  expired_svgs_pro INTEGER,
  storage_queue_pending INTEGER,
  storage_queue_processed INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM generated_videos WHERE expires_at < NOW())::INTEGER as expired_videos_count,
    (SELECT COUNT(*) FROM svg_designs s 
     JOIN profiles p ON s.user_id = p.id
     WHERE s.created_at < NOW() - INTERVAL '7 days' 
     AND (p.subscription_status != 'active' OR p.subscription_tier IS NULL OR p.subscription_tier IN ('free', 'starter')))::INTEGER as expired_svgs_free_starter,
    (SELECT COUNT(*) FROM svg_designs s 
     JOIN profiles p ON s.user_id = p.id
     WHERE s.created_at < NOW() - INTERVAL '30 days' 
     AND p.subscription_status = 'active' AND p.subscription_tier = 'pro')::INTEGER as expired_svgs_pro,
    (SELECT COUNT(*) FROM storage_cleanup_queue WHERE processed_at IS NULL)::INTEGER as storage_queue_pending,
    (SELECT COUNT(*) FROM storage_cleanup_queue WHERE processed_at IS NOT NULL)::INTEGER as storage_queue_processed;
END;
$$;

-- Grant execute permission to authenticated users for monitoring
GRANT EXECUTE ON FUNCTION get_cleanup_status() TO authenticated;

-- Add comment to document the credit costs
COMMENT ON COLUMN generated_videos.credits_used IS 'Number of credits used for video generation. Current cost: 6 credits per video (as of Kling 2.1 pricing)';