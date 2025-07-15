
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
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg border p-8 mb-8">
              <h2 className="heading-lg mb-4 text-center">Submit a Story</h2>
              <p className="body-text text-muted-foreground text-center leading-relaxed mb-4">
                Want to share your story with the world? Email us your design, artwork, building or about an interesting topic. We will be in touch as soon as possible but if we haven't got back to you, please feel free to send us a reminder.
              </p>
              <p className="body-text text-center">
                Email your submissions to:{" "}
                <a 
                  href="mailto:thegridarchitecture.uk@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  thegridarchitecture.uk@gmail.com
                </a>
              </p>
            </div>
            
            <div className="text-center py-12">
              <p className="body-text text-muted-foreground">
                Contact forms for different inquiry types coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
