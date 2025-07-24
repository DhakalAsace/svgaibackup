-- Add marketing consent fields to profiles table for CASL compliance
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS marketing_consent_date TIMESTAMP WITH TIME ZONE;

-- Create index for efficient queries on marketing consent
CREATE INDEX IF NOT EXISTS idx_profiles_marketing_consent 
ON profiles(marketing_consent) 
WHERE marketing_consent = true;

-- Add comment for documentation
COMMENT ON COLUMN profiles.marketing_consent IS 'User consent for marketing emails (CASL compliance)';
COMMENT ON COLUMN profiles.marketing_consent_date IS 'Timestamp when user gave marketing consent';

-- Update RLS policies to allow users to update their own marketing preferences
-- First, drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policy that allows users to update their profile including marketing consent
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Ensure users can insert their own profile (needed for signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);