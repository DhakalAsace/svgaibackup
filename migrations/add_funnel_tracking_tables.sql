-- Create funnel_conversions table to track user journey from free tools to premium features
CREATE TABLE IF NOT EXISTS funnel_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  from_tool TEXT NOT NULL,
  to_feature TEXT NOT NULL,
  journey_steps TEXT[] NOT NULL,
  journey_duration INTEGER NOT NULL, -- milliseconds
  device TEXT,
  browser TEXT,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_funnel_conversions_session ON funnel_conversions(session_id);
CREATE INDEX idx_funnel_conversions_user ON funnel_conversions(user_id);
CREATE INDEX idx_funnel_conversions_from_tool ON funnel_conversions(from_tool);
CREATE INDEX idx_funnel_conversions_to_feature ON funnel_conversions(to_feature);
CREATE INDEX idx_funnel_conversions_created_at ON funnel_conversions(created_at DESC);

-- Create funnel_events table for detailed step tracking
CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  tool TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for funnel events
CREATE INDEX idx_funnel_events_session ON funnel_events(session_id);
CREATE INDEX idx_funnel_events_user ON funnel_events(user_id);
CREATE INDEX idx_funnel_events_tool ON funnel_events(tool);
CREATE INDEX idx_funnel_events_type ON funnel_events(event_type);
CREATE INDEX idx_funnel_events_timestamp ON funnel_events(timestamp DESC);

-- Create cta_performance table for A/B testing results
CREATE TABLE IF NOT EXISTS cta_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  location TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  metadata JSONB,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique constraint for daily aggregation
CREATE UNIQUE INDEX idx_cta_performance_unique ON cta_performance(test_name, variant_id, location, date);

-- Create indexes for CTA performance
CREATE INDEX idx_cta_performance_test ON cta_performance(test_name);
CREATE INDEX idx_cta_performance_variant ON cta_performance(variant_id);
CREATE INDEX idx_cta_performance_date ON cta_performance(date DESC);

-- Create materialized view for funnel metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS funnel_metrics_daily AS
WITH daily_sessions AS (
  SELECT 
    date_trunc('day', created_at) as date,
    from_tool,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as conversions,
    AVG(journey_duration) as avg_journey_duration,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY journey_duration) as median_journey_duration
  FROM funnel_conversions
  GROUP BY date_trunc('day', created_at), from_tool
),
cta_stats AS (
  SELECT
    date,
    test_name,
    variant_id,
    SUM(impressions) as total_impressions,
    SUM(clicks) as total_clicks,
    SUM(conversions) as total_conversions,
    CASE 
      WHEN SUM(impressions) > 0 
      THEN SUM(clicks)::FLOAT / SUM(impressions) 
      ELSE 0 
    END as ctr,
    CASE 
      WHEN SUM(clicks) > 0 
      THEN SUM(conversions)::FLOAT / SUM(clicks) 
      ELSE 0 
    END as click_to_conversion_rate
  FROM cta_performance
  GROUP BY date, test_name, variant_id
)
SELECT 
  ds.*,
  cs.test_name,
  cs.variant_id,
  cs.total_impressions,
  cs.total_clicks,
  cs.total_conversions as cta_conversions,
  cs.ctr,
  cs.click_to_conversion_rate
FROM daily_sessions ds
LEFT JOIN cta_stats cs ON ds.date = cs.date;

-- Create index on materialized view
CREATE INDEX idx_funnel_metrics_daily_date ON funnel_metrics_daily(date DESC);
CREATE INDEX idx_funnel_metrics_daily_tool ON funnel_metrics_daily(from_tool);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_funnel_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY funnel_metrics_daily;
END;
$$ LANGUAGE plpgsql;

-- RLS policies
ALTER TABLE funnel_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_performance ENABLE ROW LEVEL SECURITY;

-- Public read access for authenticated users
CREATE POLICY "Public read funnel conversions"
  ON funnel_conversions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read funnel events"
  ON funnel_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read CTA performance"
  ON cta_performance
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert
CREATE POLICY "Service role insert funnel conversions"
  ON funnel_conversions
  FOR INSERT
  TO service_role
  USING (true);

CREATE POLICY "Service role insert funnel events"
  ON funnel_events
  FOR INSERT
  TO service_role
  USING (true);

CREATE POLICY "Service role manage CTA performance"
  ON cta_performance
  FOR ALL
  TO service_role
  USING (true);

-- Function to calculate funnel drop-off rates
CREATE OR REPLACE FUNCTION calculate_funnel_dropoff(
  p_tool TEXT,
  p_start_date TIMESTAMPTZ DEFAULT now() - interval '7 days',
  p_end_date TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
  step_from TEXT,
  step_to TEXT,
  total_users INTEGER,
  continued_users INTEGER,
  dropoff_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH journey_steps AS (
    SELECT 
      session_id,
      unnest(journey_steps) as step,
      generate_subscripts(journey_steps, 1) as step_order
    FROM funnel_conversions
    WHERE from_tool = p_tool
      AND created_at BETWEEN p_start_date AND p_end_date
  ),
  step_transitions AS (
    SELECT 
      js1.step as step_from,
      js2.step as step_to,
      COUNT(DISTINCT js1.session_id) as transition_count
    FROM journey_steps js1
    JOIN journey_steps js2 
      ON js1.session_id = js2.session_id 
      AND js2.step_order = js1.step_order + 1
    GROUP BY js1.step, js2.step
  ),
  step_totals AS (
    SELECT 
      step,
      COUNT(DISTINCT session_id) as total_count
    FROM journey_steps
    GROUP BY step
  )
  SELECT 
    st.step_from,
    st.step_to,
    t1.total_count as total_users,
    st.transition_count as continued_users,
    ROUND(100.0 * (1 - (st.transition_count::NUMERIC / t1.total_count)), 2) as dropoff_rate
  FROM step_transitions st
  JOIN step_totals t1 ON st.step_from = t1.step
  ORDER BY dropoff_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get top conversion paths
CREATE OR REPLACE FUNCTION get_top_conversion_paths(
  p_tool TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  path TEXT[],
  count BIGINT,
  conversion_rate NUMERIC,
  avg_duration INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    journey_steps as path,
    COUNT(*) as count,
    ROUND(100.0 * COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER(), 2) as conversion_rate,
    AVG(journey_duration)::INTEGER as avg_duration
  FROM funnel_conversions
  WHERE from_tool = p_tool
  GROUP BY journey_steps
  ORDER BY count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;