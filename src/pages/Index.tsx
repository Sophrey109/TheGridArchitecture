
import React from 'react';
import { Layout } from '@/components/Layout';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { TrendingGrid } from '@/components/home/TrendingGrid';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { JobsWidget } from '@/components/home/JobsWidget';
import { CompetitionsWidget } from '@/components/home/CompetitionsWidget';
import { AwardsWidget } from '@/components/home/AwardsWidget';
import { ExhibitionsEvents } from '@/components/home/ExhibitionsEvents';
import { MoreArticles } from '@/components/home/MoreArticles';


const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <FeaturedCarousel />
        
        <div className="max-w-7xl pl-2 sm:pl-4 lg:pl-6 pr-2 sm:pr-4 lg:pr-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-12">
              <TrendingGrid />
              <ExhibitionsEvents />
              <MoreArticles />
              <CategoriesSection />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
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
