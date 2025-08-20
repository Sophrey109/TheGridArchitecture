-- Update carousel_images column to support the new format
-- This will allow storing image references like {image01, image02, image03}
ALTER TABLE public."Articles" 
ALTER COLUMN carousel_images SET DEFAULT '{}';

-- Create a table to manage carousel images with proper references
CREATE TABLE IF NOT EXISTS public.article_carousel_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (article_id) REFERENCES public."Articles"(id) ON DELETE CASCADE
);

-- Enable RLS on the new table
ALTER TABLE public.article_carousel_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to carousel images
CREATE POLICY "Allow public read access to carousel images" 
ON public.article_carousel_images 
FOR SELECT 
USING (true);

-- Allow authenticated users to manage carousel images
CREATE POLICY "Allow authenticated users to manage carousel images" 
ON public.article_carousel_images 
FOR ALL 
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create trigger for updating timestamps
CREATE TRIGGER update_article_carousel_images_updated_at
BEFORE UPDATE ON public.article_carousel_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();