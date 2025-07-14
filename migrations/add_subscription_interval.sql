-- Add interval column to track billing period
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_interval TEXT DEFAULT 'monthly';

-- Update subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS interval TEXT DEFAULT 'monthly';