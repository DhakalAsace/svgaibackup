-- Helper functions for testing content expiration

-- Get SVG retention statistics
CREATE OR REPLACE FUNCTION get_svg_retention_stats()
RETURNS TABLE (
  user_id UUID,
  subscription_tier TEXT,
  subscription_status TEXT,
  svg_count BIGINT,
  max_age_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH user_svg_ages AS (
    SELECT 
      s.user_id,
      p.subscription_tier,
      p.subscription_status,
      COUNT(*) as svg_count,
      EXTRACT(day FROM NOW() - MIN(s.created_at)) as max_age_days
    FROM svg_designs s
    JOIN profiles p ON s.user_id = p.id
    GROUP BY s.user_id, p.subscription_tier, p.subscription_status
  )
  SELECT * FROM user_svg_ages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get active cron jobs
CREATE OR REPLACE FUNCTION get_active_cron_jobs()
RETURNS TABLE (
  jobid BIGINT,
  schedule TEXT,
  command TEXT,
  active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.jobid,
    j.schedule,
    j.command,
    j.active
  FROM cron.job j
  WHERE j.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_svg_retention_stats() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_active_cron_jobs() TO service_role;