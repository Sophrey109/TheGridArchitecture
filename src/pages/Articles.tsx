
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FilterBar } from '@/components/articles/FilterBar';
import { ArticleCard } from '@/components/articles/ArticleCard';

// Sample articles data
const sampleArticles = [
  {
    id: 1,
    title: "The Future of Sustainable Architecture",
    excerpt: "Exploring innovative approaches to eco-friendly building design and their impact on urban environments.",
    type: 'research' as const,
    date: "Jan 15, 2025",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Why BIM is Essential for Modern Architecture",
    excerpt: "An opinion piece on how Building Information Modeling is revolutionizing the architecture industry.",
    type: 'opinion' as const,
    date: "Jan 12, 2025",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "New Zoning Laws Approved for Urban Development",
    excerpt: "City council approves new regulations that will reshape downtown development projects.",
    type: 'news' as const,
    date: "Jan 10, 2025",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "The Oslo Opera House: A Study in Public Architecture",
    excerpt: "Examining how Snøhetta's design created a new model for cultural buildings.",
    type: 'case-studies' as const,
    date: "Jan 8, 2025",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "Rethinking Open Office Spaces Post-Pandemic",
    excerpt: "How workplace design is evolving to meet new health and productivity requirements.",
    type: 'opinion' as const,
    date: "Dec 28, 2024",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    title: "Smart Building Technology Integration Study",
    excerpt: "Research findings on the effectiveness of IoT sensors in commercial building management.",
    type: 'research' as const,
    date: "Dec 25, 2024",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
  }
];

const Articles = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedYear('all');
  };

  const getFilteredArticles = () => {
    return sampleArticles.filter(article => {
      const typeMatch = selectedType === 'all' || article.type === selectedType;
      const yearMatch = selectedYear === 'all' || article.date.includes(selectedYear);
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
                    title={article.title}
                    excerpt={article.excerpt}
                    type={article.type}
                    date={article.date}
                    imageUrl={article.imageUrl}
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
