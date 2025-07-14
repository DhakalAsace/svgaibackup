-- Add extended history cleanup for Pro users
-- This migration updates the cleanup logic to keep designs for 30 days for Pro users

-- First, create a function to clean up old SVG designs based on user subscription
CREATE OR REPLACE FUNCTION clean_old_svg_designs() 
RETURNS void AS $$
BEGIN
  -- Delete SVGs older than 7 days for free users
  DELETE FROM svg_designs
  WHERE created_at < NOW() - INTERVAL '7 days'
  AND user_id IN (
    SELECT id FROM profiles 
    WHERE subscription_status != 'active' 
    OR subscription_tier IS NULL 
    OR subscription_tier = 'free'
  );

  -- Delete SVGs older than 30 days for Pro users
  DELETE FROM svg_designs
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND user_id IN (
    SELECT id FROM profiles 
    WHERE subscription_status = 'active' 
    AND subscription_tier IN ('starter', 'pro', 'team')
  );
  
  -- Also delete designs for users who no longer exist
  DELETE FROM svg_designs
  WHERE user_id NOT IN (SELECT id FROM profiles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run cleanup daily (requires pg_cron extension)
-- Note: If pg_cron is not available, this cleanup function should be called from an external cron job

-- Alternative: Create a trigger that runs periodically on any insert/update
-- This ensures cleanup happens even without external cron
CREATE OR REPLACE FUNCTION trigger_cleanup_old_designs()
RETURNS trigger AS $$
BEGIN
  -- Only run cleanup occasionally (random 1% chance on each operation)
  IF random() < 0.01 THEN
    PERFORM clean_old_svg_designs();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on svg_designs table
DROP TRIGGER IF EXISTS cleanup_old_designs_trigger ON svg_designs;
CREATE TRIGGER cleanup_old_designs_trigger
AFTER INSERT ON svg_designs
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_cleanup_old_designs();

-- Add index on created_at for better cleanup performance
CREATE INDEX IF NOT EXISTS idx_svg_designs_created_at ON svg_designs(created_at);

-- Grant execute permission on cleanup function
GRANT EXECUTE ON FUNCTION clean_old_svg_designs() TO service_role;
GRANT EXECUTE ON FUNCTION trigger_cleanup_old_designs() TO service_role;

-- Run initial cleanup
SELECT clean_old_svg_designs();