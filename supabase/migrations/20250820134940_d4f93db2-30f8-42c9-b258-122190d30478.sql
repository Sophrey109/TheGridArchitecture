-- Add carousel option to Articles table
ALTER TABLE public."Articles" 
ADD COLUMN show_image_carousel boolean DEFAULT false;

-- Create table for article carousel images
CREATE TABLE public.article_carousel_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id text NOT NULL,
  image_url text NOT NULL,
  caption text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (article_id) REFERENCES public."Articles"(id) ON DELETE CASCADE
);

-- Enable RLS on article_carousel_images
ALTER TABLE public.article_carousel_images ENABLE ROW LEVEL SECURITY;

-- Create policies for article_carousel_images
CREATE POLICY "Anyone can view carousel images for published articles" 
ON public.article_carousel_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public."Articles" 
    WHERE "Articles".id = article_carousel_images.article_id 
    AND "Articles".is_published = true
  )
);

CREATE POLICY "Authenticated users can insert carousel images" 
ON public.article_carousel_images 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update carousel images" 
ON public.article_carousel_images 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete carousel images" 
ON public.article_carousel_images 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_article_carousel_images_updated_at
BEFORE UPDATE ON public.article_carousel_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for carousel images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-carousel', 'article-carousel', true);

-- Create storage policies for carousel images
CREATE POLICY "Anyone can view carousel images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'article-carousel');

CREATE POLICY "Authenticated users can upload carousel images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'article-carousel' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update carousel images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'article-carousel' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete carousel images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'article-carousel' AND auth.role() = 'authenticated');