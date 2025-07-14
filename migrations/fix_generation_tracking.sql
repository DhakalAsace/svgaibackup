-- Fix generation tracking issues
-- 1. Create trigger to auto-create profiles on user signup
-- 2. Initialize missing profiles for existing users
-- 3. Fix generation reset logic

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, monthly_generation_limit, monthly_generations_used, last_generation_reset, subscription_status)
  VALUES (
    NEW.id,
    3, -- Default free tier limit
    0,
    NOW(),
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Initialize profiles for any existing users who don't have one
INSERT INTO public.profiles (id, monthly_generation_limit, monthly_generations_used, last_generation_reset, subscription_status)
SELECT 
  au.id,
  3, -- Default free tier limit
  0,
  NOW(),
  'free'
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Update the reset function to properly reset generations at the start of each month
CREATE OR REPLACE FUNCTION public.reset_monthly_generations()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    monthly_generations_used = 0,
    last_generation_reset = NOW()
  WHERE 
    last_generation_reset < date_trunc('month', NOW())
    OR last_generation_reset IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the reset function immediately to fix any stale data
SELECT reset_monthly_generations();

-- Create a scheduled job to run monthly reset (if pg_cron is available)
-- This would need to be set up separately in Supabase dashboard
-- SELECT cron.schedule('reset-monthly-generations', '0 0 1 * *', 'SELECT reset_monthly_generations();');