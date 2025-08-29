-- Add parent_comment_id to enable comment replies
ALTER TABLE public.comments 
ADD COLUMN parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Create index for better performance when fetching comment threads
CREATE INDEX idx_comments_parent_comment_id ON public.comments(parent_comment_id);

-- Create index for better performance when fetching comments by article
CREATE INDEX idx_comments_article_id ON public.comments(article_id);