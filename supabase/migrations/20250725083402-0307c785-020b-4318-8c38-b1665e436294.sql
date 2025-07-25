-- Add a column to control which articles appear in the top banner carousel
ALTER TABLE public."Articles" 
ADD COLUMN featured_in_banner boolean DEFAULT false;

-- Set up to 3 existing published articles as banner featured (you can change these later)
UPDATE public."Articles" 
SET featured_in_banner = true 
WHERE is_published = true 
AND id IN (
  SELECT id 
  FROM public."Articles" 
  WHERE is_published = true 
  ORDER BY "Published Date" DESC 
  LIMIT 3
);