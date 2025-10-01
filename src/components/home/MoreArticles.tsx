import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { useFeaturedArticles } from '@/hooks/useArticles';

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
    month: 'short'
  });
};

export const MoreArticles = () => {
  const { data: articles, isLoading, error } = useFeaturedArticles();
  const navigate = useNavigate();

  // Show articles 7-12 (after the first 6 shown in TrendingGrid)
  const moreArticles = articles?.slice(6, 12) || [];

  if (isLoading) {
    return (
      <section className="bg-background">
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

  if (error || moreArticles.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="editorial-grid">
        {moreArticles.map((article) => (
          <Link key={article.id} to={`/articles/${article.id}`} className="block">
            <Card className="article-card group overflow-hidden cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden">
                <LazyImage
                  src={article.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'}
                  alt={article.Title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fallbackSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/articles?type=${article.article_type || 'Article'}`);
                    }}
                    className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-full hover:opacity-90 transition-opacity cursor-pointer relative z-10"
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
                        className="bg-white/90 text-primary px-2 py-1 text-xs font-medium border border-primary/20 rounded-full hover:bg-white transition-colors cursor-pointer relative z-10"
                      >
                        {subcategory}
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-sans text-base md:text-lg font-semibold tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.Title}
                </h3>
                
                <p className="body-text text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
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
          </Link>
        ))}
      </div>
    </section>
  );
};