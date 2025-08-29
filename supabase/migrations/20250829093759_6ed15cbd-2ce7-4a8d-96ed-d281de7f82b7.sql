-- Fix profiles table RLS policy to restrict visibility properly

-- Drop the current policy that allows all authenticated users to see all profiles
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows users to see their own profiles
-- or implement a more restricted approach
CREATE POLICY "Users can only view their own profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- For admin/moderator access to profiles (if needed for moderation)
CREATE POLICY "Admins and moderators can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);