
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FilterBar } from '@/components/articles/FilterBar';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { useArticles } from '@/hooks/useArticles';

// Helper function to extract excerpt from content or use stored excerpt
const getExcerpt = (excerpt: string | null, content: string | null): string => {
  if (excerpt) return excerpt;
  if (!content) return "No content available.";
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};

// Helper function to get article type, fallback to determined type if not set
const getArticleType = (article: any): string => {
  return article.article_type || 'research'; // Use database article_type or fallback
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

const Articles = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const { data: articles, isLoading, error } = useArticles();

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedYear('all');
    setSelectedTag('');
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedType('all');
    setSelectedYear('all');
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setSelectedYear('all');
    setSelectedTag('');
  };

  const getFilteredArticles = () => {
    if (!articles) return [];
    
    return articles.filter(article => {
      const articleType = getArticleType(article);
      const formattedDate = formatDate(article['Published Date']);
      
      const typeMatch = selectedType === 'all' || articleType === selectedType;
      const yearMatch = selectedYear === 'all' || formattedDate.includes(selectedYear);
      const tagMatch = !selectedTag || (article.tags && article.tags.includes(selectedTag));
      
      return typeMatch && yearMatch && tagMatch;
    });
  };

  const getFilteredContent = () => {
    const filteredArticles = getFilteredArticles();
    const count = filteredArticles.length;
    
    if (selectedType === 'all' && selectedYear === 'all' && !selectedTag) {
      return `All articles (${count})`;
    }
    
    const typeText = selectedType !== 'all' ? selectedType.replace('-', ' ') : '';
    const yearText = selectedYear !== 'all' ? selectedYear : '';
    const tagText = selectedTag ? `tagged with "${selectedTag}"` : '';
    
    const filters = [typeText, yearText, tagText].filter(Boolean);
    
    if (filters.length > 0) {
      return `Articles ${filters.join(' and ')} (${count})`;
    }
    
    return `Filtered articles (${count})`;
  };

  const filteredArticles = getFilteredArticles();
  
  // Debug logging
  console.log('Articles data:', articles);
  console.log('Filtered articles:', filteredArticles);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="body-text text-muted-foreground">Loading articles...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="body-text text-destructive">Error loading articles. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="hero-text mb-4">Articles</h1>
              <p className="body-text text-muted-foreground max-w-2xl mx-auto">
                In-depth articles on architecture, design trends, BIM technology, and industry insights.
              </p>
            </div>
          </div>
        </div>

        <FilterBar
          selectedType={selectedType}
          selectedYear={selectedYear}
          onTypeChange={setSelectedType}
          onYearChange={setSelectedYear}
          onClearFilters={handleClearFilters}
        />
        
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="body-text text-muted-foreground mb-6">
                Showing: {getFilteredContent()}
              </p>
              {selectedTag && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Currently filtering by tag:</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      #{selectedTag}
                    </span>
                    <button
                      onClick={() => setSelectedTag('')}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear tag filter
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {filteredArticles.length > 0 ? (
                <div className="editorial-grid">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.Title}
                    excerpt={getExcerpt(article.excerpt, article.Content)}
                    type={getArticleType(article)}
                    date={formatDate(article['Published Date'])}
                    imageUrl={article.image_url}
                    tags={article.tags}
                    onTagClick={handleTagClick}
                    onTypeClick={handleTypeClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="body-text text-muted-foreground">
                  No articles found matching your current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Articles;
