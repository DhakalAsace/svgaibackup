-- Fix video insert policy to allow authenticated users to insert their own videos
-- This allows the API route to insert videos without needing service role

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Service role can insert videos" ON generated_videos;

-- Create a new policy that allows users to insert their own videos
CREATE POLICY "Users can insert their own videos" ON generated_videos
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also ensure users can update their own videos (if needed)
CREATE POLICY "Users can update their own videos" ON generated_videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Keep the existing select policy
-- CREATE POLICY "Users can view their own videos" ON generated_videos
--   FOR SELECT USING (auth.uid() = user_id);

-- Add a comment explaining the change
COMMENT ON POLICY "Users can insert their own videos" ON generated_videos IS 
  'Allows authenticated users to insert videos where they are the owner. This enables the API route to save video metadata without requiring service role permissions.';