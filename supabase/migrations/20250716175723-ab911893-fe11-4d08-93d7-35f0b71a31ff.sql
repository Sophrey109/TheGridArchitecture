-- Add related_articles column to Articles table
ALTER TABLE public.Articles 
ADD COLUMN related_articles text[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN public.Articles.related_articles IS 'Array of article IDs for the "read next" section';