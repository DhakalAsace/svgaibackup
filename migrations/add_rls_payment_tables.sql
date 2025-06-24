-- Enable Row Level Security on payment_audit_log table
ALTER TABLE payment_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own payment audit logs
CREATE POLICY "Users can view own payment logs" ON payment_audit_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Only service role can insert payment audit logs
CREATE POLICY "Service role can insert payment logs" ON payment_audit_log
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Only service role can update payment audit logs
CREATE POLICY "Service role can update payment logs" ON payment_audit_log
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Nobody can delete payment audit logs (for audit integrity)
-- No DELETE policy means no one can delete, including service role

-- Enable RLS on webhook_events table if it exists
DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'webhook_events') THEN
    ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
    
    -- Only service role can access webhook_events (admin only table)
    CREATE POLICY "Service role only access" ON webhook_events
      FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;