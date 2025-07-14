-- A/B Testing Tables Migration

-- Table for A/B test configurations
CREATE TABLE IF NOT EXISTS ab_tests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  variants JSONB NOT NULL,
  targeting_rules JSONB DEFAULT '[]'::jsonb,
  success_metrics JSONB NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  minimum_sample_size INTEGER,
  confidence_level INTEGER DEFAULT 95,
  traffic_allocation INTEGER DEFAULT 100 CHECK (traffic_allocation >= 0 AND traffic_allocation <= 100),
  winner_selection_mode TEXT DEFAULT 'manual' CHECK (winner_selection_mode IN ('manual', 'automatic')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for user variant assignments
CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  user_id TEXT,
  session_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_properties JSONB DEFAULT '{}'::jsonb,
  device_info JSONB DEFAULT '{}'::jsonb,
  location_info JSONB DEFAULT '{}'::jsonb,
  UNIQUE(test_id, COALESCE(user_id, session_id))
);

-- Table for conversion tracking
CREATE TABLE IF NOT EXISTS ab_test_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  user_id TEXT,
  session_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  metric_id TEXT NOT NULL,
  metric_value NUMERIC,
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  properties JSONB DEFAULT '{}'::jsonb
);

-- Table for aggregated test results (for performance)
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  participants INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  total_value NUMERIC DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(test_id, variant_id)
);

-- Table for feature flags
CREATE TABLE IF NOT EXISTS feature_flags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  targeting_rules JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for A/B testing events log
CREATE TABLE IF NOT EXISTS ab_test_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id TEXT,
  event_type TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  variant_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_ab_test_assignments_test_id ON ab_test_assignments(test_id);
CREATE INDEX idx_ab_test_assignments_user_id ON ab_test_assignments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_ab_test_assignments_session_id ON ab_test_assignments(session_id);
CREATE INDEX idx_ab_test_assignments_assigned_at ON ab_test_assignments(assigned_at);

CREATE INDEX idx_ab_test_conversions_test_id ON ab_test_conversions(test_id);
CREATE INDEX idx_ab_test_conversions_user_id ON ab_test_conversions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_ab_test_conversions_session_id ON ab_test_conversions(session_id);
CREATE INDEX idx_ab_test_conversions_metric_id ON ab_test_conversions(metric_id);
CREATE INDEX idx_ab_test_conversions_converted_at ON ab_test_conversions(converted_at);

CREATE INDEX idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX idx_ab_test_events_test_id ON ab_test_events(test_id) WHERE test_id IS NOT NULL;
CREATE INDEX idx_ab_test_events_created_at ON ab_test_events(created_at);

-- Function to update results aggregation
CREATE OR REPLACE FUNCTION update_ab_test_results()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert aggregated results
  INSERT INTO ab_test_results (test_id, variant_id, variant_name, conversions, total_value)
  VALUES (
    NEW.test_id,
    NEW.variant_id,
    NEW.variant_id, -- Will be updated by application
    1,
    COALESCE(NEW.metric_value, 0)
  )
  ON CONFLICT (test_id, variant_id)
  DO UPDATE SET
    conversions = ab_test_results.conversions + 1,
    total_value = ab_test_results.total_value + COALESCE(NEW.metric_value, 0),
    last_updated = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic result aggregation
CREATE TRIGGER update_results_on_conversion
AFTER INSERT ON ab_test_conversions
FOR EACH ROW
EXECUTE FUNCTION update_ab_test_results();

-- Function to update participant count
CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert participant count
  INSERT INTO ab_test_results (test_id, variant_id, variant_name, participants)
  VALUES (
    NEW.test_id,
    NEW.variant_id,
    NEW.variant_name,
    1
  )
  ON CONFLICT (test_id, variant_id)
  DO UPDATE SET
    participants = ab_test_results.participants + 1,
    variant_name = NEW.variant_name,
    last_updated = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for participant counting
CREATE TRIGGER update_participants_on_assignment
AFTER INSERT ON ab_test_assignments
FOR EACH ROW
EXECUTE FUNCTION update_participant_count();

-- Row Level Security (RLS)
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_events ENABLE ROW LEVEL SECURITY;

-- Public read access for active tests
CREATE POLICY "Public can view active tests" ON ab_tests
  FOR SELECT
  USING (status IN ('active', 'completed'));

-- Authenticated users can view their assignments
CREATE POLICY "Users can view own assignments" ON ab_test_assignments
  FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Authenticated users can track conversions
CREATE POLICY "Users can track conversions" ON ab_test_conversions
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

-- Public read access for test results
CREATE POLICY "Public can view test results" ON ab_test_results
  FOR SELECT
  USING (true);

-- Public read access for feature flags
CREATE POLICY "Public can view feature flags" ON feature_flags
  FOR SELECT
  USING (enabled = true);

-- Service role full access
CREATE POLICY "Service role full access" ON ab_tests
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access assignments" ON ab_test_assignments
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access conversions" ON ab_test_conversions
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access results" ON ab_test_results
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access flags" ON feature_flags
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access events" ON ab_test_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- Insert default experiments (optional)
-- These can be uncommented to add the predefined experiments
/*
INSERT INTO ab_tests (id, name, description, status, variants, success_metrics)
VALUES 
  (
    'converter_layout_2024',
    'Converter Page Layout Test',
    'Test sidebar vs inline tools layout for converter pages',
    'active',
    '[
      {"id": "sidebar", "name": "Sidebar Layout", "weight": 50, "isControl": true, "properties": {"layout": "sidebar", "toolsPosition": "left"}},
      {"id": "inline", "name": "Inline Layout", "weight": 50, "properties": {"layout": "inline", "toolsPosition": "top"}}
    ]'::jsonb,
    '[
      {"id": "conversion_rate", "name": "Conversion Rate", "type": "conversion", "eventName": "converter_conversion_completed", "higherIsBetter": true},
      {"id": "engagement_time", "name": "Time on Page", "type": "engagement", "eventName": "page_engagement_time", "higherIsBetter": true}
    ]'::jsonb
  );
*/