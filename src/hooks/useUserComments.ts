import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserComment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  article_id: string;
}

export const useUserComments = () => {
  const { user } = useAuth();

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['user-comments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          is_approved,
          article_id
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserComment[];
    },
    enabled: !!user,
  });

  return {
    comments: comments || [],
    isLoading,
    error,
  };
};