
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

// Helper function to determine article type based on content or title
const determineArticleType = (title: string, content: string | null): 'opinion' | 'research' | 'news' | 'case-studies' => {
  const text = `${title} ${content || ''}`.toLowerCase();
  
  if (text.includes('opinion') || text.includes('think') || text.includes('believe')) {
    return 'opinion';
  } else if (text.includes('research') || text.includes('study') || text.includes('findings')) {
    return 'research';
  } else if (text.includes('news') || text.includes('approved') || text.includes('announced')) {
    return 'news';
  } else if (text.includes('case study') || text.includes('examining') || text.includes('analysis')) {
    return 'case-studies';
  }
  
  return 'research'; // default
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
  const { data: articles, isLoading, error } = useArticles();

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedYear('all');
  };

  const getFilteredArticles = () => {
    if (!articles) return [];
    
    return articles.filter(article => {
      const articleType = determineArticleType(article.Title, article.Content);
      const formattedDate = formatDate(article['Published Date']);
      
      const typeMatch = selectedType === 'all' || articleType === selectedType;
      const yearMatch = selectedYear === 'all' || formattedDate.includes(selectedYear);
      return typeMatch && yearMatch;
    });
  };

  const getFilteredContent = () => {
    const filteredArticles = getFilteredArticles();
    const count = filteredArticles.length;
    
    if (selectedType === 'all' && selectedYear === 'all') {
      return `All articles (${count})`;
    }
    
    const typeText = selectedType !== 'all' ? selectedType.replace('-', ' ') : '';
    const yearText = selectedYear !== 'all' ? selectedYear : '';
    
    if (typeText && yearText) {
      return `${typeText} articles from ${yearText} (${count})`;
    } else if (typeText) {
      return `${typeText} articles (${count})`;
    } else if (yearText) {
      return `Articles from ${yearText} (${count})`;
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
            </div>
            
            {filteredArticles.length > 0 ? (
              <div className="editorial-grid">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.Title}
                    excerpt={getExcerpt(article.excerpt, article.Content)}
                    type={determineArticleType(article.Title, article.Content)}
                    date={formatDate(article['Published Date'])}
                    imageUrl={article.image_url}
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
