-- Create error groups table for grouping similar errors
CREATE TABLE IF NOT EXISTS error_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE,
  service TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('error', 'warning', 'info')),
  message TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'resolved', 'ignored')),
  first_seen TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create error events table for individual error occurrences
CREATE TABLE IF NOT EXISTS error_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL REFERENCES error_groups(fingerprint),
  service TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('error', 'warning', 'info')),
  message TEXT NOT NULL,
  stack TEXT,
  context JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_error_groups_service ON error_groups(service);
CREATE INDEX idx_error_groups_status ON error_groups(status);
CREATE INDEX idx_error_groups_fingerprint ON error_groups(fingerprint);
CREATE INDEX idx_error_groups_last_seen ON error_groups(last_seen DESC);

CREATE INDEX idx_error_events_fingerprint ON error_events(fingerprint);
CREATE INDEX idx_error_events_service ON error_events(service);
CREATE INDEX idx_error_events_created_at ON error_events(created_at DESC);

-- Create synthetic monitoring results table
CREATE TABLE IF NOT EXISTS synthetic_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
  response_time INTEGER,
  status_code INTEGER,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for synthetic checks
CREATE INDEX idx_synthetic_checks_name ON synthetic_checks(name);
CREATE INDEX idx_synthetic_checks_status ON synthetic_checks(status);
CREATE INDEX idx_synthetic_checks_created_at ON synthetic_checks(created_at DESC);

-- Create uptime tracking table
CREATE TABLE IF NOT EXISTS uptime_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  check_time TIMESTAMPTZ DEFAULT now(),
  is_up BOOLEAN NOT NULL,
  response_time INTEGER,
  status_code INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for uptime metrics
CREATE INDEX idx_uptime_metrics_service ON uptime_metrics(service);
CREATE INDEX idx_uptime_metrics_check_time ON uptime_metrics(check_time DESC);
CREATE INDEX idx_uptime_metrics_is_up ON uptime_metrics(is_up);

-- Create a view for error statistics
CREATE OR REPLACE VIEW error_statistics AS
WITH hourly_errors AS (
  SELECT 
    service,
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as error_count,
    COUNT(DISTINCT fingerprint) as unique_errors
  FROM error_events
  WHERE created_at > now() - interval '24 hours'
  GROUP BY service, hour
)
SELECT 
  service,
  SUM(error_count) as total_errors_24h,
  SUM(unique_errors) as unique_errors_24h,
  AVG(error_count) as avg_errors_per_hour,
  MAX(error_count) as max_errors_per_hour
FROM hourly_errors
GROUP BY service;

-- Create a view for uptime statistics
CREATE OR REPLACE VIEW uptime_statistics AS
WITH service_checks AS (
  SELECT 
    service,
    COUNT(*) as total_checks,
    COUNT(CASE WHEN is_up THEN 1 END) as successful_checks,
    AVG(CASE WHEN is_up THEN response_time END) as avg_response_time,
    MAX(check_time) as last_check
  FROM uptime_metrics
  WHERE check_time > now() - interval '24 hours'
  GROUP BY service
)
SELECT 
  service,
  total_checks,
  successful_checks,
  ROUND((successful_checks::numeric / total_checks::numeric * 100), 2) as uptime_percentage,
  ROUND(avg_response_time::numeric, 2) as avg_response_time,
  last_check
FROM service_checks;

-- RLS policies for error tracking
ALTER TABLE error_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthetic_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE uptime_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access for error groups (authenticated users)
CREATE POLICY "Authenticated users can view error groups"
  ON error_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert error groups
CREATE POLICY "Service role can insert error groups"
  ON error_groups
  FOR INSERT
  TO service_role
  USING (true);

-- Authenticated users can update error groups (for resolving/ignoring)
CREATE POLICY "Authenticated users can update error groups"
  ON error_groups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public read access for error events
CREATE POLICY "Authenticated users can view error events"
  ON error_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert error events
CREATE POLICY "Service role can insert error events"
  ON error_events
  FOR INSERT
  TO service_role
  USING (true);

-- Public read access for synthetic checks
CREATE POLICY "Authenticated users can view synthetic checks"
  ON synthetic_checks
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert synthetic checks
CREATE POLICY "Service role can insert synthetic checks"
  ON synthetic_checks
  FOR INSERT
  TO service_role
  USING (true);

-- Public read access for uptime metrics
CREATE POLICY "Authenticated users can view uptime metrics"
  ON uptime_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert uptime metrics
CREATE POLICY "Service role can insert uptime metrics"
  ON uptime_metrics
  FOR INSERT
  TO service_role
  USING (true);

-- Function to update error group counts
CREATE OR REPLACE FUNCTION update_error_group_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE error_groups 
  SET 
    count = count + 1,
    last_seen = now()
  WHERE fingerprint = NEW.fingerprint;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update error group counts
CREATE TRIGGER update_error_count_trigger
AFTER INSERT ON error_events
FOR EACH ROW
EXECUTE FUNCTION update_error_group_count();

-- Function to clean up old error data
CREATE OR REPLACE FUNCTION cleanup_old_error_data()
RETURNS void AS $$
BEGIN
  -- Delete error events older than 30 days
  DELETE FROM error_events 
  WHERE created_at < now() - interval '30 days';
  
  -- Delete resolved error groups older than 90 days
  DELETE FROM error_groups 
  WHERE status = 'resolved' AND resolved_at < now() - interval '90 days';
  
  -- Delete synthetic checks older than 7 days
  DELETE FROM synthetic_checks 
  WHERE created_at < now() - interval '7 days';
  
  -- Delete uptime metrics older than 30 days
  DELETE FROM uptime_metrics 
  WHERE created_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-error-data', '0 3 * * *', 'SELECT cleanup_old_error_data();');