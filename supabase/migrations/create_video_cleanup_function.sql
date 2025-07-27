-- Function to clean up expired videos
CREATE OR REPLACE FUNCTION cleanup_expired_videos()
RETURNS void AS $$
DECLARE
  video_record RECORD;
BEGIN
  -- Find all expired videos
  FOR video_record IN 
    SELECT id, storage_path 
    FROM generated_videos 
    WHERE expires_at < NOW()
  LOOP
    -- Delete from storage (this would need to be done via Edge Function or external service)
    -- For now, we'll just mark them for deletion by adding to a cleanup queue
    INSERT INTO storage_cleanup_queue (storage_path, bucket_name, created_at)
    VALUES (video_record.storage_path, 'generated-svgs', NOW())
    ON CONFLICT DO NOTHING;
    
    -- Delete the database record
    DELETE FROM generated_videos WHERE id = video_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create cleanup queue table
CREATE TABLE IF NOT EXISTS storage_cleanup_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(storage_path, bucket_name)
);

-- Schedule the cleanup to run daily (requires pg_cron extension)
-- This would need to be set up in Supabase dashboard or via their API
-- SELECT cron.schedule('cleanup-expired-videos', '0 2 * * *', 'SELECT cleanup_expired_videos();');