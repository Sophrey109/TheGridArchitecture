-- First, let's clean up the existing malformed data
DELETE FROM public.article_carousel_images WHERE article_id = 'buildings-casa-en-tres-rios';

-- Now let's insert the images as separate records
INSERT INTO public.article_carousel_images (article_id, image_url, sort_order) VALUES
('buildings-casa-en-tres-rios', 'https://weyllamkalycvywcurid.supabase.co/storage/v1/object/public/article-carousel/Casa%20En%20Tres%20Rios/casa-en-tres-rios.jpg', 1),
('buildings-casa-en-tres-rios', 'https://weyllamkalycvywcurid.supabase.co/storage/v1/object/public/article-carousel/Casa%20En%20Tres%20Rios/casa-en-tres-rios1.jpg', 2),
('buildings-casa-en-tres-rios', 'https://weyllamkalycvywcurid.supabase.co/storage/v1/object/public/article-carousel/Casa%20En%20Tres%20Rios/casa-en-tres-rios2.jpg', 3);