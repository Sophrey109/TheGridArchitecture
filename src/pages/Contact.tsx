
import React from 'react';
import { Layout } from '@/components/Layout';

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="hero-text mb-4">Contact & Work With Us</h1>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              Get in touch for press inquiries, partnerships, or collaboration opportunities.
            </p>
          </div>
          
          <div className="text-center py-20">
            <p className="body-text text-muted-foreground">
              Contact forms for different inquiry types coming soon...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
