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
      const relatedArticleIds = currentArticle.related_articles || [];
      const currentArticleTypes = currentArticle.article_types || [];
      const currentArticleType = currentArticle.article_type;
      
      let finalArticles: any[] = [];
      let usedIds = new Set<string>();

      // 1. First priority: Articles from related_articles column
      if (relatedArticleIds.length > 0) {
        const { data: directlyRelated, error: directError } = await supabase
          .from('Articles')
          .select('id, Title, image_url, "Published Date", article_type, article_types')
          .eq('is_published', true)
          .in('id', relatedArticleIds)
          .neq('id', currentArticle.id);

        if (directError) throw directError;
        
        if (directlyRelated) {
          // Maintain the order from related_articles array
          const orderedDirectlyRelated = relatedArticleIds
            .map(id => directlyRelated.find(article => article.id === id))
            .filter(Boolean);
          
          finalArticles.push(...orderedDirectlyRelated);
          orderedDirectlyRelated.forEach(article => usedIds.add(article.id));
        }
      }

      // 2. Second priority: Articles matching article_types
      if (currentArticleTypes.length > 0 && finalArticles.length < 5) {
        const { data: typeMatched, error: typeError } = await supabase
          .from('Articles')
          .select('id, Title, image_url, "Published Date", article_type, article_types')
          .eq('is_published', true)
          .neq('id', currentArticle.id)
          .not('id', 'in', `(${Array.from(usedIds).join(',')})`);

        if (typeError) throw typeError;

        if (typeMatched) {
          const articleTypeMatches = typeMatched.filter(article => {
            const articleTypes = article.article_types || [];
            return currentArticleTypes.some(type => articleTypes.includes(type));
          });

          const remainingSlots = 5 - finalArticles.length;
          const articlesToAdd = articleTypeMatches.slice(0, remainingSlots);
          finalArticles.push(...articlesToAdd);
          articlesToAdd.forEach(article => usedIds.add(article.id));
        }
      }

      // 3. Third priority: Articles matching article_type (single value)
      if (currentArticleType && finalArticles.length < 5) {
        const { data: singleTypeMatched, error: singleTypeError } = await supabase
          .from('Articles')
          .select('id, Title, image_url, "Published Date", article_type, article_types')
          .eq('is_published', true)
          .eq('article_type', currentArticleType)
          .neq('id', currentArticle.id)
          .not('id', 'in', `(${Array.from(usedIds).join(',')})`);

        if (singleTypeError) throw singleTypeError;

        if (singleTypeMatched) {
          const remainingSlots = 5 - finalArticles.length;
          const articlesToAdd = singleTypeMatched.slice(0, remainingSlots);
          finalArticles.push(...articlesToAdd);
        }
      }

      return finalArticles.slice(0, 5);
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {relatedArticles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block group"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Title */}
                <div className="p-4 pb-2">
                  <h4 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-3">
                    {article.Title}
                  </h4>
                </div>
                
                {/* Large image */}
                <div className="w-full aspect-square bg-muted overflow-hidden">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};