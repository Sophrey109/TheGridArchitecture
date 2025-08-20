-- Remove carousel-related database structures
DROP TABLE IF EXISTS public.article_carousel_images CASCADE;

-- Remove carousel_images column from Articles table
ALTER TABLE public."Articles" DROP COLUMN IF EXISTS carousel_images;

-- Remove show_image_carousel column from Articles table  
ALTER TABLE public."Articles" DROP COLUMN IF EXISTS show_image_carousel;