import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useSavedArticles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedArticles, isLoading } = useQuery({
    queryKey: ['saved-articles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_articles')
        .select('article_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => item.article_id);
    },
    enabled: !!user,
  });

  const saveArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_articles')
        .insert({
          user_id: user.id,
          article_id: articleId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-articles', user?.id] });
      toast({
        title: "Article saved",
        description: "Article has been added to your saved list.",
      });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({
          title: "Already saved",
          description: "This article is already in your saved list.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save article. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const removeSavedArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-articles', user?.id] });
      toast({
        title: "Article removed",
        description: "Article has been removed from your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isArticleSaved = (articleId: string) => {
    return savedArticles?.includes(articleId) || false;
  };

  const toggleSaveArticle = (articleId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save articles.",
        variant: "destructive",
      });
      return;
    }

    if (isArticleSaved(articleId)) {
      removeSavedArticleMutation.mutate(articleId);
    } else {
      saveArticleMutation.mutate(articleId);
    }
  };

  return {
    savedArticles: savedArticles || [],
    isLoading,
    isArticleSaved,
    toggleSaveArticle,
    isSaving: saveArticleMutation.isPending || removeSavedArticleMutation.isPending,
  };
};