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