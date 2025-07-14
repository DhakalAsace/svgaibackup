-- Create monitoring_alerts table to store tool performance alerts
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  threshold NUMERIC NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'error', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_monitoring_alerts_tool ON monitoring_alerts(tool);
CREATE INDEX idx_monitoring_alerts_severity ON monitoring_alerts(severity);
CREATE INDEX idx_monitoring_alerts_created_at ON monitoring_alerts(created_at DESC);
CREATE INDEX idx_monitoring_alerts_acknowledged ON monitoring_alerts(acknowledged);

-- Create monitoring_metrics table for aggregated metrics
CREATE TABLE IF NOT EXISTS monitoring_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  metadata JSONB,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for metrics
CREATE INDEX idx_monitoring_metrics_tool ON monitoring_metrics(tool);
CREATE INDEX idx_monitoring_metrics_metric ON monitoring_metrics(metric);
CREATE INDEX idx_monitoring_metrics_created_at ON monitoring_metrics(created_at DESC);
CREATE INDEX idx_monitoring_metrics_session ON monitoring_metrics(session_id);

-- Create a view for recent alerts (last 24 hours)
CREATE OR REPLACE VIEW recent_alerts AS
SELECT 
  tool,
  metric,
  severity,
  COUNT(*) as alert_count,
  AVG(value) as avg_value,
  MAX(value) as max_value,
  MIN(value) as min_value,
  MAX(created_at) as last_alert_at
FROM monitoring_alerts
WHERE created_at > now() - interval '24 hours'
GROUP BY tool, metric, severity
ORDER BY alert_count DESC, severity DESC;

-- Create a view for tool health status
CREATE OR REPLACE VIEW tool_health_status AS
WITH recent_metrics AS (
  SELECT 
    tool,
    metric,
    AVG(value) as avg_value,
    COUNT(*) as metric_count,
    MAX(created_at) as last_metric_at
  FROM monitoring_metrics
  WHERE created_at > now() - interval '1 hour'
  GROUP BY tool, metric
),
recent_alert_counts AS (
  SELECT 
    tool,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count,
    COUNT(CASE WHEN severity = 'error' THEN 1 END) as error_count,
    COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_count
  FROM monitoring_alerts
  WHERE created_at > now() - interval '1 hour'
  GROUP BY tool
)
SELECT 
  COALESCE(m.tool, a.tool) as tool,
  CASE 
    WHEN a.critical_count > 0 THEN 'critical'
    WHEN a.error_count > 0 THEN 'error'
    WHEN a.warning_count > 0 THEN 'warning'
    ELSE 'healthy'
  END as status,
  a.critical_count,
  a.error_count,
  a.warning_count,
  COUNT(DISTINCT m.metric) as active_metrics,
  MAX(m.last_metric_at) as last_activity
FROM recent_metrics m
FULL OUTER JOIN recent_alert_counts a ON m.tool = a.tool
GROUP BY COALESCE(m.tool, a.tool), a.critical_count, a.error_count, a.warning_count;

-- RLS policies for monitoring tables
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access for alerts (for dashboards)
CREATE POLICY "Public read access for alerts"
  ON monitoring_alerts
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert alerts
CREATE POLICY "Service role insert alerts"
  ON monitoring_alerts
  FOR INSERT
  TO service_role
  USING (true);

-- Authenticated users can acknowledge alerts
CREATE POLICY "Users can acknowledge alerts"
  ON monitoring_alerts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public read access for metrics
CREATE POLICY "Public read access for metrics"
  ON monitoring_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert metrics
CREATE POLICY "Service role insert metrics"
  ON monitoring_metrics
  FOR INSERT
  TO service_role
  USING (true);

-- Function to clean up old monitoring data
CREATE OR REPLACE FUNCTION cleanup_old_monitoring_data()
RETURNS void AS $$
BEGIN
  -- Delete alerts older than 30 days
  DELETE FROM monitoring_alerts 
  WHERE created_at < now() - interval '30 days';
  
  -- Delete metrics older than 7 days
  DELETE FROM monitoring_metrics 
  WHERE created_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-monitoring-data', '0 2 * * *', 'SELECT cleanup_old_monitoring_data();');