
import React from 'react';
import { Layout } from '@/components/Layout';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { TrendingGrid } from '@/components/home/TrendingGrid';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <FeaturedCarousel />
        <TrendingGrid />
        <CategoriesSection />
        <NewsletterSection />
      </div>
    </Layout>
  );
};

export default Index;
