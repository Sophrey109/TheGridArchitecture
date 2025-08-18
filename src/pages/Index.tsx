
import React from 'react';
import { Layout } from '@/components/Layout';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { TrendingGrid } from '@/components/home/TrendingGrid';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { JobsWidget } from '@/components/home/JobsWidget';
import { CompetitionsWidget } from '@/components/home/CompetitionsWidget';
import { AwardsWidget } from '@/components/home/AwardsWidget';

const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <FeaturedCarousel />
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-16">
              <TrendingGrid />
              <CategoriesSection />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <JobsWidget />
            </div>
          </div>
        </div>
        
        <NewsletterSection />
      </div>
    </Layout>
  );
};

export default Index;
