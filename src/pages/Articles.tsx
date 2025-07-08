
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FilterBar } from '@/components/articles/FilterBar';

const Articles = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedYear('all');
  };

  const getFilteredContent = () => {
    if (selectedType === 'all' && selectedYear === 'all') {
      return "All articles";
    }
    
    const typeText = selectedType !== 'all' ? selectedType : '';
    const yearText = selectedYear !== 'all' ? selectedYear : '';
    
    if (typeText && yearText) {
      return `${typeText} articles from ${yearText}`;
    } else if (typeText) {
      return `${typeText} articles`;
    } else if (yearText) {
      return `Articles from ${yearText}`;
    }
    
    return "All articles";
  };

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
            <div className="text-center">
              <p className="body-text text-muted-foreground mb-4">
                Showing: {getFilteredContent()}
              </p>
              <p className="body-text text-muted-foreground">
                Article content and filtering system ready for implementation...
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Articles;
