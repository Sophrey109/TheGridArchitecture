-- Add new article_types array field to Articles table
ALTER TABLE public."Articles" 
ADD COLUMN article_types text[] DEFAULT '{}';

-- Add index for better performance on the new array field
CREATE INDEX idx_articles_article_types ON public."Articles" USING GIN(article_types);