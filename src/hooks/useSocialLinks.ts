import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string | null;
  is_active: boolean;
  sort_order: number;
}

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ['social-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as SocialLink[];
    },
  });
};