-- Security Updates Migration
-- This migration adds security-related database functions and RLS policies

-- 1. Atomic rate limiting function
-- This function checks and increments the daily generation limit in a single transaction
CREATE OR REPLACE FUNCTION check_and_increment_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_generation_date DATE,
  p_limit INTEGER
)
RETURNS TABLE (
  success BOOLEAN,
  current_count INTEGER,
  remaining INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Run with privileges of the function creator (typically superuser)
AS $$
DECLARE
  v_current_count INTEGER;
  v_new_count INTEGER;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT count INTO v_current_count
  FROM daily_generation_limits
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND generation_date = p_generation_date
  FOR UPDATE;
  
  -- If no record exists, set count to 0
  IF v_current_count IS NULL THEN
    v_current_count := 0;
    
    -- Insert new record
    INSERT INTO daily_generation_limits
      (identifier, identifier_type, generation_date, count)
    VALUES
      (p_identifier, p_identifier_type, p_generation_date, 1);
    
    v_new_count := 1;
  ELSE
    -- Check if we're under the limit
    IF v_current_count >= p_limit THEN
      RETURN QUERY SELECT 
        FALSE as success, 
        v_current_count as current_count,
        0 as remaining;
      RETURN;
    END IF;
    
    -- Increment count
    UPDATE daily_generation_limits
    SET count = count + 1
    WHERE identifier = p_identifier
      AND identifier_type = p_identifier_type
      AND generation_date = p_generation_date;
      
    v_new_count := v_current_count + 1;
  END IF;
  
  -- Return success status and counts
  RETURN QUERY SELECT 
    TRUE as success, 
    v_new_count as current_count,
    (p_limit - v_new_count) as remaining;
END;
$$;

-- 2. Helper function to check if a table exists 
-- Used in the apply-migration route to safely check table existence
CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = table_name
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- 3. Add Row Level Security to svg_designs table
-- First enable RLS on the table
ALTER TABLE IF EXISTS svg_designs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own designs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'svg_designs' AND policyname = 'Users can view their own designs'
  ) THEN
    CREATE POLICY "Users can view their own designs"
      ON svg_designs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create policy for users to insert their own designs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'svg_designs' AND policyname = 'Users can insert their own designs'
  ) THEN
    CREATE POLICY "Users can insert their own designs"
      ON svg_designs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create policy for users to update their own designs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'svg_designs' AND policyname = 'Users can update their own designs'
  ) THEN
    CREATE POLICY "Users can update their own designs"
      ON svg_designs
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create policy for users to delete their own designs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'svg_designs' AND policyname = 'Users can delete their own designs'
  ) THEN
    CREATE POLICY "Users can delete their own designs"
      ON svg_designs
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Optional policy to allow public access to designs marked as public
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'svg_designs' AND policyname = 'Public access to public designs'
  ) THEN
    -- First make sure the is_public column exists
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'svg_designs' AND column_name = 'is_public'
    ) THEN
      CREATE POLICY "Public access to public designs"
        ON svg_designs
        FOR SELECT
        USING (is_public = true);
    END IF;
  END IF;
END
$$;
