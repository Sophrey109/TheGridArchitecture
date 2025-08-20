-- Add carousel arrays to Articles table
ALTER TABLE public."Articles" 
ADD COLUMN carousel_images text[] DEFAULT '{}',
ADD COLUMN carousel_captions text[] DEFAULT '{}';

-- Migrate existing carousel data to the new structure
UPDATE public."Articles" 
SET carousel_images = ARRAY(
  SELECT image_url 
  FROM public.article_carousel_images 
  WHERE article_id = "Articles".id 
  ORDER BY sort_order
),
carousel_captions = ARRAY(
  SELECT COALESCE(caption, '') 
  FROM public.article_carousel_images 
  WHERE article_id = "Articles".id 
  ORDER BY sort_order
)
WHERE id IN (
  SELECT DISTINCT article_id 
  FROM public.article_carousel_images
);

-- Clean up the old carousel images table since we no longer need it
DROP TABLE IF EXISTS public.article_carousel_images;