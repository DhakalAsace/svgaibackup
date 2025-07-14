-- Create web vitals logs table
CREATE TABLE IF NOT EXISTS web_vitals_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  user_agent TEXT,
  metrics JSONB NOT NULL,
  evaluation JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create performance alerts table
CREATE TABLE IF NOT EXISTS performance_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  issues JSONB NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'critical')),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_web_vitals_logs_url ON web_vitals_logs(url);
CREATE INDEX idx_web_vitals_logs_timestamp ON web_vitals_logs(timestamp DESC);
CREATE INDEX idx_web_vitals_logs_evaluation ON web_vitals_logs USING GIN (evaluation);

CREATE INDEX idx_performance_alerts_url ON performance_alerts(url);
CREATE INDEX idx_performance_alerts_severity ON performance_alerts(severity);
CREATE INDEX idx_performance_alerts_resolved ON performance_alerts(resolved);
CREATE INDEX idx_performance_alerts_timestamp ON performance_alerts(timestamp DESC);

-- RLS policies
ALTER TABLE web_vitals_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_alerts ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert web vitals logs
CREATE POLICY "Authenticated users can insert web vitals logs"
  ON web_vitals_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only admins can view web vitals logs
CREATE POLICY "Admins can view web vitals logs"
  ON web_vitals_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can manage performance alerts
CREATE POLICY "Admins can manage performance alerts"
  ON performance_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to clean up old web vitals logs (keep 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_web_vitals_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM web_vitals_logs
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  DELETE FROM performance_alerts
  WHERE resolved = true
  AND resolved_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-web-vitals', '0 2 * * *', 'SELECT cleanup_old_web_vitals_logs();');