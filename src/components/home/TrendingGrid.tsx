
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFeaturedArticles } from '@/hooks/useArticles';
import { supabase } from '@/integrations/supabase/client';

// Helper function to extract excerpt from content or use stored excerpt
const getExcerpt = (excerpt: string | null, content: string | null): string => {
  if (excerpt) return excerpt;
  if (!content) return "No content available.";
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};


// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const TrendingGrid = () => {
  const { data: articles, isLoading, error, refetch } = useFeaturedArticles();
  const navigate = useNavigate();

  // Set up real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('articles-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Articles'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Articles'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Limit to 6 most recent articles for the home page
  const recentArticles = articles?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="bg-background">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="hero-text mb-4">Latest Articles</h2>
            <p className="body-text text-muted-foreground max-w-2xl">
              The newest articles and insights on architecture and design.
            </p>
          </div>
        </div>
        <div className="editorial-grid">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="article-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted animate-pulse" />
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded animate-pulse mb-3" />
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse mb-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="hero-text mb-4">Latest Articles</h2>
            <p className="body-text text-destructive">
              Error loading articles. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="hero-text mb-4">Latest Articles</h2>
          <p className="body-text text-muted-foreground max-w-2xl">
            The newest articles and insights on architecture and design.
          </p>
        </div>
        <Link 
          to="/articles" 
          className="body-text text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All Articles →
        </Link>
      </div>

      <div className="editorial-grid">
        {recentArticles.map((article, index) => (
          <Card key={article.id} className="article-card group overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={article.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'}
                alt={article.Title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/articles?type=${article.article_type || 'Article'}`);
                  }}
                  className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {article.article_type || 'Article'}
                </button>
                {article.article_types && article.article_types.length > 0 && (
                  article.article_types.map((subcategory, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/articles?type=${subcategory}`);
                      }}
                      className="bg-white/90 text-primary px-2 py-1 text-xs font-medium border border-primary/20 rounded-full hover:bg-white transition-colors cursor-pointer"
                    >
                      {subcategory}
                    </button>
                  ))
                )}
              </div>
              {index === 0 && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Latest</span>
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <Link to={`/articles/${article.id}`} className="group">
                <h3 className="section-title mb-3 group-hover:text-primary transition-colors">
                  {article.Title}
                </h3>
              </Link>
              
              <p className="body-text text-muted-foreground mb-4 line-clamp-2">
                {getExcerpt(article.excerpt, article.Content)}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article['Published Date'])}</span>
                  </div>
                  {article.Author && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>By {article.Author}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
