-- Create error_logs table for monitoring 404s and other errors
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_type VARCHAR(50) NOT NULL, -- '404', '500', etc.
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(45),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Indexes for performance
  INDEX idx_error_logs_error_type (error_type),
  INDEX idx_error_logs_path (path),
  INDEX idx_error_logs_created_at (created_at),
  INDEX idx_error_logs_user_id (user_id)
);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy
CREATE POLICY "Admin users can view error logs"
  ON public.error_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Service role can insert (for API endpoints)
CREATE POLICY "Service role can insert error logs"
  ON public.error_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create view for common 404 patterns
CREATE OR REPLACE VIEW public.frequent_404s AS
SELECT 
  path,
  COUNT(*) as error_count,
  MAX(created_at) as last_seen,
  MIN(created_at) as first_seen,
  COUNT(DISTINCT ip_address) as unique_visitors
FROM public.error_logs
WHERE error_type = '404'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY path
HAVING COUNT(*) > 5
ORDER BY error_count DESC;

-- Grant permissions
GRANT SELECT ON public.frequent_404s TO authenticated;

-- Add comment
COMMENT ON TABLE public.error_logs IS 'Logs for tracking 404 errors and other site errors for monitoring and SEO improvement';