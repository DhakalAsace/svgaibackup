-- Migration: Create video generation infrastructure
-- Description: Creates tables and functions for AI-powered video generation feature

-- Create table for storing generated videos
CREATE TABLE IF NOT EXISTS generated_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  video_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 5,
  resolution TEXT NOT NULL DEFAULT '720p',
  credits_used INTEGER NOT NULL DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE generated_videos ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own videos
CREATE POLICY "Users can view their own videos" ON generated_videos
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for inserting videos (only through service role)
CREATE POLICY "Service role can insert videos" ON generated_videos
  FOR INSERT TO service_role WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_generated_videos_user_id ON generated_videos(user_id);
CREATE INDEX idx_generated_videos_expires_at ON generated_videos(expires_at);

-- Add comment
COMMENT ON TABLE generated_videos IS 'Stores AI-generated videos from SVG with expiration dates';

-- Create cleanup queue table for storage cleanup
CREATE TABLE IF NOT EXISTS storage_cleanup_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(storage_path, bucket_name)
);

-- Create function to clean up expired videos
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

-- Add comment about scheduling
COMMENT ON FUNCTION cleanup_expired_videos() IS 'Cleans up expired videos. Should be scheduled to run daily using pg_cron or external scheduler';

-- Note: To schedule this function to run daily at 2 AM UTC, execute the following in Supabase SQL Editor:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('cleanup-expired-videos', '0 2 * * *', 'SELECT cleanup_expired_videos();');