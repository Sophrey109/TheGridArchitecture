import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/hooks/useArticles';
import { Calendar } from 'lucide-react';

interface RelatedArticlesSidebarProps {
  currentArticle: Article;
}

export const RelatedArticlesSidebar: React.FC<RelatedArticlesSidebarProps> = ({ currentArticle }) => {
  const { data: relatedArticles, isLoading } = useQuery({
    queryKey: ['related-articles', currentArticle.id],
    queryFn: async () => {
      // Get related articles by tags and article types
      const { data, error } = await supabase
        .from('Articles')
        .select('id, Title, excerpt, "Published Date", article_type, article_types, tags')
        .eq('is_published', true)
        .neq('id', currentArticle.id);

      if (error) throw error;

      // Sort articles by relevance - prioritize article_types matches first
      const articles = data || [];
      const currentArticleTypes = currentArticle.article_types || [];
      const currentArticleType = currentArticle.article_type;

      const scored = articles.map(article => {
        let score = 0;
        const articleTypes = article.article_types || [];

        // Highest score for matching article_types (array) - these go at top
        currentArticleTypes.forEach(type => {
          if (articleTypes.includes(type)) score += 100;
        });

        // Lower score for matching article_type (single value) - these go at bottom
        if (article.article_type === currentArticleType) score += 10;

        return { ...article, score };
      });

      // Sort by score and return top 5
      return scored
        .filter(article => article.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    },
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'opinion':
        return 'default';
      case 'research':
        return 'secondary';
      case 'news':
        return 'destructive';
      case 'case-studies':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle className="text-lg">Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">Related Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedArticles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block group"
            >
              <div className="border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {article.Title}
                </h4>
                
                {article.excerpt && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {article.article_type && (
                    <Badge variant={getTypeVariant(article.article_type)} className="text-xs h-5">
                      {article.article_type}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(article['Published Date'])}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};