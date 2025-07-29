-- Enable Row Level Security on cron_job_logs table
-- This prevents unauthorized access while still allowing service role access
ALTER TABLE cron_job_logs ENABLE ROW LEVEL SECURITY;

-- Create a policy that denies all access to regular users
-- Service role will bypass this by design
CREATE POLICY "No public access to cron logs" 
  ON cron_job_logs 
  FOR ALL 
  USING (false);

-- Add comment for documentation
COMMENT ON TABLE cron_job_logs IS 'Stores execution logs for cron jobs. Access restricted to service role only.';