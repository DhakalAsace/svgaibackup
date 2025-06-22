-- Correct SVG retention policy
-- Free & Starter: 7-day history
-- Pro: 30-day history

-- Replace the existing cleanup function with corrected logic
CREATE OR REPLACE FUNCTION clean_old_svg_designs()
RETURNS void AS $$
BEGIN
  -- Delete SVGs older than 7 days for Free & Starter users (and anyone without an active subscription)
  DELETE FROM svg_designs
  WHERE created_at < NOW() - INTERVAL '7 days'
    AND user_id IN (
      SELECT id FROM profiles
      WHERE subscription_status != 'active'
         OR subscription_tier IS NULL
         OR subscription_tier IN ('free', 'starter')
    );

  -- Delete SVGs older than 30 days for Pro users
  DELETE FROM svg_designs
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND user_id IN (
      SELECT id FROM profiles
      WHERE subscription_status = 'active'
        AND subscription_tier = 'pro'
    );

  -- Clean up designs for users that no longer exist (safety)
  DELETE FROM svg_designs
  WHERE user_id NOT IN (SELECT id FROM profiles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger remains in place (re-create to be safe)
DROP TRIGGER IF EXISTS cleanup_old_designs_trigger ON svg_designs;
CREATE TRIGGER cleanup_old_designs_trigger
AFTER INSERT ON svg_designs
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_cleanup_old_designs();

-- Run initial cleanup with the corrected rules
SELECT clean_old_svg_designs(); 