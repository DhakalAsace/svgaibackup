-- Implement separate generation limits for anonymous users
-- SVG: 1 generation from homepage
-- Icons: 2 generations from /ai-icon-generator

-- First, create the daily_generation_limits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.daily_generation_limits (
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL,
  generation_date DATE NOT NULL,
  generation_type TEXT NOT NULL DEFAULT 'any',
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (identifier, identifier_type, generation_date, generation_type)
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_daily_generation_limits_lookup 
ON daily_generation_limits(identifier, identifier_type, generation_date);

-- Drop old check_credits_v3 function
DROP FUNCTION IF EXISTS public.check_credits_v3;

-- Create updated check_credits_v3 function with separate anonymous limits
CREATE OR REPLACE FUNCTION public.check_credits_v3(
  p_user_id UUID,
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_generation_type TEXT -- 'icon' or 'svg'
)
RETURNS TABLE(
  success BOOLEAN,
  current_count INTEGER,
  remaining_credits INTEGER,
  is_subscribed BOOLEAN,
  limit_type TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile RECORD;
  v_credits_needed INTEGER;
  v_total_available INTEGER;
  v_is_subscribed BOOLEAN;
  v_anonymous_limit INTEGER;
  v_anonymous_count INTEGER;
BEGIN
  -- Determine credits needed
  v_credits_needed := CASE 
    WHEN p_generation_type = 'icon' THEN 1
    WHEN p_generation_type = 'svg' THEN 2
    ELSE 2 -- Default to SVG cost
  END;

  -- Anonymous users check
  IF p_user_id IS NULL THEN
    -- Set anonymous limits based on generation type
    v_anonymous_limit := CASE 
      WHEN p_generation_type = 'icon' THEN 2  -- 2 icon generations allowed
      WHEN p_generation_type = 'svg' THEN 1   -- 1 SVG generation allowed
      ELSE 1 -- Default to 1
    END;
    
    -- Check generation count for this specific type
    SELECT COALESCE(count, 0) INTO v_anonymous_count
    FROM daily_generation_limits
    WHERE identifier = p_identifier
      AND identifier_type = p_identifier_type
      AND generation_date = CURRENT_DATE
      AND generation_type = p_generation_type;
    
    -- Check if limit reached
    IF v_anonymous_count >= v_anonymous_limit THEN
      RETURN QUERY SELECT 
        FALSE as success,
        v_anonymous_count as current_count,
        0 as remaining_credits,
        FALSE as is_subscribed,
        'anonymous_daily' as limit_type;
      RETURN;
    END IF;
    
    -- Increment counter for this generation type
    INSERT INTO daily_generation_limits (identifier, identifier_type, generation_date, generation_type, count)
    VALUES (p_identifier, p_identifier_type, CURRENT_DATE, p_generation_type, 1)
    ON CONFLICT (identifier, identifier_type, generation_date, generation_type)
    DO UPDATE SET count = daily_generation_limits.count + 1;
    
    RETURN QUERY SELECT 
      TRUE as success,
      v_anonymous_count + 1 as current_count,
      v_anonymous_limit - (v_anonymous_count + 1) as remaining_credits,
      FALSE as is_subscribed,
      'anonymous_daily' as limit_type;
    RETURN;
  END IF;

  -- Get user profile with row lock to prevent concurrent modifications
  SELECT * INTO v_profile
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Check if subscribed
  v_is_subscribed := v_profile.subscription_status = 'active';

  -- Reset monthly credits if needed
  IF v_is_subscribed AND v_profile.credits_reset_at < date_trunc('month', NOW()) THEN
    UPDATE profiles
    SET 
      monthly_credits_used = 0,
      credits_reset_at = NOW()
    WHERE id = p_user_id;
    
    v_profile.monthly_credits_used := 0;
  END IF;

  -- Calculate total available credits
  IF v_is_subscribed THEN
    -- Subscribed users only use monthly credits
    v_total_available := v_profile.monthly_credits - v_profile.monthly_credits_used;
  ELSE
    -- Free users use lifetime credits
    v_total_available := v_profile.lifetime_credits_granted - v_profile.lifetime_credits_used;
  END IF;

  -- Check if enough credits
  IF v_total_available < v_credits_needed THEN
    RETURN QUERY SELECT 
      FALSE as success,
      CASE 
        WHEN v_is_subscribed THEN v_profile.monthly_credits_used
        ELSE v_profile.lifetime_credits_used
      END as current_count,
      v_total_available as remaining_credits,
      v_is_subscribed,
      CASE 
        WHEN v_is_subscribed THEN 'monthly_credits'
        ELSE 'lifetime_credits'
      END as limit_type;
    RETURN;
  END IF;

  -- Deduct credits
  IF v_is_subscribed THEN
    UPDATE profiles
    SET monthly_credits_used = monthly_credits_used + v_credits_needed
    WHERE id = p_user_id;
  ELSE
    UPDATE profiles
    SET lifetime_credits_used = lifetime_credits_used + v_credits_needed
    WHERE id = p_user_id;
  END IF;

  RETURN QUERY SELECT 
    TRUE as success,
    CASE 
      WHEN v_is_subscribed THEN v_profile.monthly_credits_used + v_credits_needed
      ELSE v_profile.lifetime_credits_used + v_credits_needed
    END as current_count,
    v_total_available - v_credits_needed as remaining_credits,
    v_is_subscribed,
    CASE 
      WHEN v_is_subscribed THEN 'monthly_credits'
      ELSE 'lifetime_credits'
    END as limit_type;
END;
$$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON daily_generation_limits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_generation_limits TO anon;