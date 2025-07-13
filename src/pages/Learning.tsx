
import React from 'react';
import { Layout } from '@/components/Layout';
import { DesignEssentials } from '@/components/learning/DesignEssentials';

const Learning = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="hero-text mb-4">Learning Resources</h1>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              Free and premium educational content to advance your skills in architecture and BIM.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-3">
              <div className="text-center py-20">
                <p className="body-text text-muted-foreground">
                  Learning resources with free and premium tabs coming soon...
                </p>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <DesignEssentials />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Learning;
