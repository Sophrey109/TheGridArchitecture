-- Add image_url column to Articles table
ALTER TABLE public."Articles" 
ADD COLUMN image_url TEXT;

-- Add a description/excerpt column for better content management
ALTER TABLE public."Articles" 
ADD COLUMN excerpt TEXT;