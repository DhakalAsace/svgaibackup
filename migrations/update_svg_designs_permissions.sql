-- Update SVG designs table permissions to allow public access for viewing and downloading

-- First, check if the svg_designs table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'svg_designs') THEN
    -- Drop existing RLS policies if they exist
    DROP POLICY IF EXISTS "Users can view their own SVGs" ON public.svg_designs;
    DROP POLICY IF EXISTS "Users can insert their own SVGs" ON public.svg_designs;
    DROP POLICY IF EXISTS "Users can update their own SVGs" ON public.svg_designs;
    DROP POLICY IF EXISTS "Users can delete their own SVGs" ON public.svg_designs;
    DROP POLICY IF EXISTS "SVGs are viewable by everyone" ON public.svg_designs;
    
    -- Create new policies
    -- Allow anyone to view any SVG
    CREATE POLICY "SVGs are viewable by everyone" 
      ON public.svg_designs 
      FOR SELECT 
      USING (true);
    
    -- Allow authenticated users to insert their own SVGs
    CREATE POLICY "Users can insert their own SVGs" 
      ON public.svg_designs 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
    
    -- Allow authenticated users to update their own SVGs
    CREATE POLICY "Users can update their own SVGs" 
      ON public.svg_designs 
      FOR UPDATE 
      USING (auth.uid() = user_id);
    
    -- Allow authenticated users to delete their own SVGs
    CREATE POLICY "Users can delete their own SVGs" 
      ON public.svg_designs 
      FOR DELETE 
      USING (auth.uid() = user_id);
    
    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'svg_designs' AND column_name = 'is_public') THEN
      ALTER TABLE public.svg_designs ADD COLUMN is_public BOOLEAN DEFAULT true;
    END IF;
    
    -- Update existing records to be public by default
    UPDATE public.svg_designs SET is_public = true WHERE is_public IS NULL;
  ELSE
    -- Create svg_designs table if it doesn't exist
    CREATE TABLE public.svg_designs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      svg_content TEXT NOT NULL,
      prompt TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      is_public BOOLEAN DEFAULT true,
      tags TEXT[]
    );
    
    -- Enable RLS on the table
    ALTER TABLE public.svg_designs ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "SVGs are viewable by everyone" 
      ON public.svg_designs 
      FOR SELECT 
      USING (true);
    
    CREATE POLICY "Users can insert their own SVGs" 
      ON public.svg_designs 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own SVGs" 
      ON public.svg_designs 
      FOR UPDATE 
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own SVGs" 
      ON public.svg_designs 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;