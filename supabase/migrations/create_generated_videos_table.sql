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