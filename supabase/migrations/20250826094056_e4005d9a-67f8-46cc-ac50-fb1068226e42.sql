-- Add back the related_articles column to Articles table
ALTER TABLE public."Articles" 
ADD COLUMN related_articles text[] DEFAULT NULL;