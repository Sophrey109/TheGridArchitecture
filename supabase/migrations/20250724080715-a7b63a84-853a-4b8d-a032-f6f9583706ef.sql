-- Add a column to control which articles appear on the homepage
ALTER TABLE public."Articles" 
ADD COLUMN featured_on_homepage boolean DEFAULT false;

-- Update existing published articles to be featured by default (you can change this later)
UPDATE public."Articles" 
SET featured_on_homepage = true 
WHERE is_published = true;