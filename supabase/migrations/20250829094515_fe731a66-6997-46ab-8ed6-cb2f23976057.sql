-- Fix critical comment moderation RLS issue
-- Remove the conflicting policy that allows users to edit approved comments
DROP POLICY IF EXISTS "Admins and moderators can manage comments" ON public.comments;

-- Create separate policies for different operations to avoid conflicts
CREATE POLICY "Admins and moderators can update any comment" 
ON public.comments 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Users can only update their own unapproved comments" 
ON public.comments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND is_approved = false)
WITH CHECK (auth.uid() = user_id AND is_approved = false);

-- Remove duplicate SELECT policies (keep the most comprehensive one)
DROP POLICY IF EXISTS "Users can view approved comments" ON public.comments;

-- Add unique constraint to saved_articles to prevent duplicates
ALTER TABLE public.saved_articles 
ADD CONSTRAINT unique_user_article UNIQUE (user_id, article_id);