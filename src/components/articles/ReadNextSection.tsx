import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '@/hooks/useArticles';

interface ReadNextSectionProps {
  currentArticleId: string;
  relatedArticleIds: string[];
}

export const ReadNextSection: React.FC<ReadNextSectionProps> = ({ 
  currentArticleId, 
  relatedArticleIds 
}) => {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!relatedArticleIds || relatedArticleIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('Articles')
          .select('*')
          .in('id', relatedArticleIds)
          .eq('is_published', true)
          .neq('id', currentArticleId)
          .limit(4);

        if (error) throw error;
        setRelatedArticles(data || []);
      } catch (error) {
        console.error('Error fetching related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [relatedArticleIds, currentArticleId]);

  const getTypeVariant = (title: string, content: string | null) => {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content?.toLowerCase() || '';
    
    if (lowerTitle.includes('opinion') || lowerContent.includes('opinion')) return 'default';
    if (lowerTitle.includes('research') || lowerContent.includes('research')) return 'secondary';
    if (lowerTitle.includes('news') || lowerContent.includes('news')) return 'destructive';
    if (lowerTitle.includes('case') || lowerContent.includes('case study')) return 'outline';
    return 'default';
  };

  const getTypeLabel = (title: string, content: string | null) => {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content?.toLowerCase() || '';
    
    if (lowerTitle.includes('opinion') || lowerContent.includes('opinion')) return 'Opinion';
    if (lowerTitle.includes('research') || lowerContent.includes('research')) return 'Research';
    if (lowerTitle.includes('news') || lowerContent.includes('news')) return 'News';
    if (lowerTitle.includes('case') || lowerContent.includes('case study')) return 'Case Studies';
    return 'Article';
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Read Next</h3>
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-20 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Read Next</h3>
      {relatedArticles.map((article) => (
        <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <Link to={`/articles/${encodeURIComponent(article.Title)}`}>
            <CardContent className="p-4">
              {/* Article Image */}
              {article.image_url && (
                <div className="aspect-video w-full mb-3 overflow-hidden rounded-md">
                  <img
                    src={article.image_url}
                    alt={article.Title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              
               {/* Article Type Badges */}
               <div className="flex flex-wrap items-center gap-2 mb-2">
                 {/* Primary type */}
                 <Badge 
                   variant={getTypeVariant(article.article_type || article.Title, article.Content)}
                   className="text-xs"
                 >
                   {article.article_type || getTypeLabel(article.Title, article.Content)}
                 </Badge>
                 
                 {/* Subcategories */}
                 {article.article_types && article.article_types.length > 0 && (
                   article.article_types.map((subcategory, index) => (
                     <Badge key={index} variant="outline" className="text-xs text-muted-foreground">
                       {subcategory}
                     </Badge>
                   ))
                 )}
               </div>

              {/* Article Title */}
              <h4 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                {article.Title}
              </h4>

              {/* Article Excerpt */}
              {article.excerpt && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {article.excerpt}
                </p>
              )}

              {/* Article Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article['Published Date'])}
                </div>
                {article.Author && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {article.Author}
                  </div>
                )}
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};