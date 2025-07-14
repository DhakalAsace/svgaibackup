-- Create redirect_logs table for tracking redirects and 404s
CREATE TABLE IF NOT EXISTS redirect_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT NOT NULL,
  destination_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  redirect_type VARCHAR(10), -- '301', '302', '404', '410', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_redirect_logs_source_url ON redirect_logs(source_url);
CREATE INDEX idx_redirect_logs_created_at ON redirect_logs(created_at DESC);
CREATE INDEX idx_redirect_logs_redirect_type ON redirect_logs(redirect_type);

-- Create a view for redirect analytics
CREATE OR REPLACE VIEW redirect_analytics AS
SELECT 
  source_url,
  destination_url,
  redirect_type,
  COUNT(*) as hit_count,
  COUNT(DISTINCT referrer) as unique_referrers,
  MAX(created_at) as last_hit,
  MIN(created_at) as first_hit
FROM redirect_logs
GROUP BY source_url, destination_url, redirect_type;

-- Create a table for soft 404 detections
CREATE TABLE IF NOT EXISTS soft_404_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  reason TEXT,
  confidence DECIMAL(3,2),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create index for soft 404 queries
CREATE INDEX idx_soft_404_url ON soft_404_detections(url);
CREATE INDEX idx_soft_404_detected_at ON soft_404_detections(detected_at DESC);
CREATE INDEX idx_soft_404_resolved ON soft_404_detections(resolved);

-- Add RLS policies
ALTER TABLE redirect_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE soft_404_detections ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert redirect logs
CREATE POLICY "Allow insert redirect logs" ON redirect_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read redirect logs
CREATE POLICY "Allow read redirect logs" ON redirect_logs
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to manage soft 404 detections
CREATE POLICY "Allow manage soft 404 detections" ON soft_404_detections
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to clean up old redirect logs (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_redirect_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM redirect_logs
  WHERE created_at < timezone('utc'::text, now()) - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cleanup function to run daily
-- Note: This requires pg_cron extension to be enabled
-- Run this after enabling pg_cron:
-- SELECT cron.schedule('cleanup-redirect-logs', '0 2 * * *', 'SELECT cleanup_old_redirect_logs();');