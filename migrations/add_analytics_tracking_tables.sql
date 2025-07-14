-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  properties JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_analytics_events_user_id (user_id),
  INDEX idx_analytics_events_session_id (session_id),
  INDEX idx_analytics_events_event_name (event_name),
  INDEX idx_analytics_events_created_at (created_at),
  INDEX idx_analytics_events_processed (processed)
);

-- Funnel Conversions Table
CREATE TABLE IF NOT EXISTS funnel_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  from_tool VARCHAR(255),
  to_feature VARCHAR(255) NOT NULL,
  journey_steps TEXT[],
  journey_duration INTEGER, -- milliseconds
  device VARCHAR(50),
  browser VARCHAR(50),
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_funnel_conversions_user_id (user_id),
  INDEX idx_funnel_conversions_session_id (session_id),
  INDEX idx_funnel_conversions_from_tool (from_tool),
  INDEX idx_funnel_conversions_to_feature (to_feature),
  INDEX idx_funnel_conversions_created_at (created_at)
);

-- Conversion Metrics Table (aggregated data)
CREATE TABLE IF NOT EXISTS conversion_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  converter_type VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  file_selections INTEGER DEFAULT 0,
  conversions_started INTEGER DEFAULT 0,
  conversions_completed INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  avg_conversion_time FLOAT,
  avg_file_size FLOAT,
  total_data_processed BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicates
  UNIQUE(converter_type, date),
  
  -- Indexes
  INDEX idx_conversion_metrics_converter_type (converter_type),
  INDEX idx_conversion_metrics_date (date)
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type VARCHAR(255) NOT NULL,
  metric_name VARCHAR(255) NOT NULL,
  value FLOAT NOT NULL,
  rating VARCHAR(50), -- good, needs-improvement, poor
  session_id VARCHAR(255),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_performance_metrics_page_type (page_type),
  INDEX idx_performance_metrics_metric_name (metric_name),
  INDEX idx_performance_metrics_created_at (created_at)
);

-- A/B Test Results Table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name VARCHAR(255) NOT NULL,
  variant VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_ab_test_results_test_name (test_name),
  INDEX idx_ab_test_results_variant (variant),
  INDEX idx_ab_test_results_user_id (user_id)
);

-- User Journey Table
CREATE TABLE IF NOT EXISTS user_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  steps JSONB[] DEFAULT ARRAY[]::JSONB[],
  current_tool VARCHAR(255),
  entry_page VARCHAR(255),
  exit_page VARCHAR(255),
  referrer TEXT,
  device VARCHAR(50),
  browser VARCHAR(50),
  total_duration INTEGER, -- milliseconds
  converted BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_user_journeys_user_id (user_id),
  INDEX idx_user_journeys_session_id (session_id),
  INDEX idx_user_journeys_converted (converted)
);

-- Revenue Tracking Table
CREATE TABLE IF NOT EXISTS revenue_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(255) NOT NULL, -- subscription, credits, one-time
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  source VARCHAR(255), -- converter, gallery, pricing, etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_revenue_events_user_id (user_id),
  INDEX idx_revenue_events_event_type (event_type),
  INDEX idx_revenue_events_created_at (created_at)
);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_conversion_metrics_updated_at BEFORE UPDATE ON conversion_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_test_results_updated_at BEFORE UPDATE ON ab_test_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_journeys_updated_at BEFORE UPDATE ON user_journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events
CREATE POLICY "Service role can manage all analytics events" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for funnel_conversions
CREATE POLICY "Service role can manage all funnel conversions" ON funnel_conversions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own funnel conversions" ON funnel_conversions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for performance_metrics
CREATE POLICY "Service role can manage all performance metrics" ON performance_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view performance metrics" ON performance_metrics
  FOR SELECT USING (true);

-- Policies for other tables (service role only for now)
CREATE POLICY "Service role can manage conversion metrics" ON conversion_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage AB test results" ON ab_test_results
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage user journeys" ON user_journeys
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage revenue events" ON revenue_events
  FOR ALL USING (auth.role() = 'service_role');

-- Create materialized view for dashboard metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_dashboard_metrics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(CASE WHEN event_name = 'converter_conversion_completed' THEN 1 END) as conversions,
  COUNT(CASE WHEN event_name = 'premium_subscription_started' THEN 1 END) as new_subscriptions,
  SUM(CASE WHEN event_name = 'revenue' THEN (properties->>'amount')::DECIMAL ELSE 0 END) as revenue
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create index on materialized view
CREATE INDEX idx_analytics_dashboard_metrics_date ON analytics_dashboard_metrics(date);

-- Refresh materialized view function
CREATE OR REPLACE FUNCTION refresh_analytics_dashboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_dashboard_metrics;
END;
$$ LANGUAGE plpgsql;

-- Schedule periodic refresh (requires pg_cron extension)
-- SELECT cron.schedule('refresh-analytics-dashboard', '*/15 * * * *', 'SELECT refresh_analytics_dashboard();');