-- Security fixes migration (without duplicate constraint)

-- 1. Fix profiles table RLS policy - restrict to authenticated users only
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- 2. Update Articles RLS policies to require admin/moderator roles
DROP POLICY IF EXISTS "Only admins and moderators can insert articles" ON public."Articles";
DROP POLICY IF EXISTS "Only admins and moderators can update articles" ON public."Articles";
DROP POLICY IF EXISTS "Only admins can delete articles" ON public."Articles";

CREATE POLICY "Only admins and moderators can insert articles" 
ON public."Articles" 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

CREATE POLICY "Only admins and moderators can update articles" 
ON public."Articles" 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

CREATE POLICY "Only admins can delete articles" 
ON public."Articles" 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Update Comments RLS policies for proper moderation
DROP POLICY IF EXISTS "Users can view approved comments only" ON public.comments;
DROP POLICY IF EXISTS "Only admins and moderators can approve comments" ON public.comments;

-- Users can view approved comments OR their own comments OR if they're admin/moderator
CREATE POLICY "Users can view approved comments or own comments" 
ON public.comments 
FOR SELECT 
TO authenticated
USING (
  is_approved = true OR 
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- Only admins and moderators can approve/manage comments
CREATE POLICY "Admins and moderators can manage comments" 
ON public.comments 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role) OR
  (auth.uid() = user_id AND is_approved = false) -- Users can edit their own unapproved comments
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role) OR
  (auth.uid() = user_id AND is_approved = false) -- Users can edit their own unapproved comments
);

-- 4. Remove redundant RLS policies on Job Adverts
DROP POLICY IF EXISTS "Active" ON public."Job Adverts";