-- Fix RLS on storage_cleanup_queue table
-- This table should only be accessible by service role

-- Enable RLS
ALTER TABLE public.storage_cleanup_queue ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies (only service role can access)
-- No policies = no access for regular users

-- Optional: If you need authenticated users to read their own cleanup jobs
-- CREATE POLICY "Users can view their own cleanup jobs"
-- ON public.storage_cleanup_queue
-- FOR SELECT
-- USING (auth.uid()::text = user_id);

-- For now, we'll keep it completely restricted
-- Only service_role (backend functions) can access this table

-- Add a comment explaining the security model
COMMENT ON TABLE public.storage_cleanup_queue IS 'Internal queue for storage cleanup tasks. Only accessible by service role through backend functions.';