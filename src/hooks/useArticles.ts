import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  Title: string;
  Content: string | null;
  Author: string | null;
  'Published Date': string | null;
  is_published: boolean | null;
  image_url: string | null;
  excerpt: string | null;
  tags: string[] | null;
  related_articles: string[] | null;
  article_type: string | null;
  article_types: string[] | null;
  show_image_carousel: boolean | null;
  carousel_images: string[] | null;
  carousel_captions: string[] | null;
}

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Articles')
        .select('*')
        .eq('is_published', true)
        .order('Published Date', { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: ['featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Articles')
        .select('*')
        .eq('is_published', true)
        .eq('featured_on_homepage', true)
        .order('Published Date', { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useBannerFeaturedArticles = () => {
  return useQuery({
    queryKey: ['banner-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Articles')
        .select('*')
        .eq('is_published', true)
        .eq('featured_in_banner', true)
        .order('Published Date', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useArticleById = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Articles')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });
};