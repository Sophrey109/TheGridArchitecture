import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { Article } from '@/hooks/useArticles';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('Articles')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article?.Content) {
      // Parse content for headings and generate table of contents
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = article.Content;
      
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const toc: TableOfContentsItem[] = [];

      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        const text = heading.textContent || '';
        const level = parseInt(heading.tagName.charAt(1));
        
        // Add ID to heading for navigation
        heading.id = id;
        
        toc.push({ id, text, level });
      });

      setTableOfContents(toc);
      
      // Update the article content with IDs
      setArticle(prev => prev ? { ...prev, Content: tempDiv.innerHTML } : null);
    }
  }, [article?.Content]);

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-24"></div>
            <div className="h-12 bg-muted rounded mb-6"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/articles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/articles')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          {tableOfContents.length > 0 && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left text-sm hover:text-primary transition-colors ${
                          item.level === 1 ? 'font-medium' : 
                          item.level === 2 ? 'ml-3' : 
                          item.level === 3 ? 'ml-6' : 'ml-9'
                        }`}
                        style={{ 
                          paddingLeft: `${(item.level - 1) * 12}px`,
                          fontSize: item.level === 1 ? '14px' : '13px'
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main content */}
          <div className={`${tableOfContents.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
            {/* Article header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={getTypeVariant(article.Title, article.Content)}>
                  {getTypeLabel(article.Title, article.Content)}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(article['Published Date'])}
                </div>
                {article.Author && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1 h-4 w-4" />
                    {article.Author}
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{article.Title}</h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {article.image_url && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img
                    src={article.image_url}
                    alt={article.Title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-24"
              dangerouslySetInnerHTML={{ __html: article.Content || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;