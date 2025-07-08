
import React from 'react';
import { Layout } from '@/components/Layout';

const Articles = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="hero-text mb-4">Articles</h1>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              In-depth articles on architecture, design trends, BIM technology, and industry insights.
            </p>
          </div>
          
          <div className="text-center py-20">
            <p className="body-text text-muted-foreground">
              Article content and filtering system coming soon...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Articles;
