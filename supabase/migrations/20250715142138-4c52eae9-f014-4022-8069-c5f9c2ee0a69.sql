-- Add tags column to Articles table
ALTER TABLE public.Articles 
ADD COLUMN tags TEXT[];