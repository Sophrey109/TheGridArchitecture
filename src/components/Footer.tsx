
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  const footerSections = [
    {
      title: 'Content',
      links: [
        { name: 'Articles', path: '/articles' },
      ],
    },
    {
      title: 'Opportunities',
      links: [
        { name: 'Job Board', path: '/jobs' },
        { name: 'Submit Job', path: '/contact?type=job' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Work With Us', path: '/contact' },
        { name: 'Advertise', path: '/contact?type=advertising' },
        { name: 'Privacy Policy', path: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-subtle border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6 group">
              <span className="font-editorial text-2xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                The Grid
              </span>
            </Link>
            <p className="body-text text-muted-foreground mb-6 max-w-md leading-relaxed">
              Your daily source for architecture, design insights, and BIM workflows. 
              Join thousands of professionals staying ahead of industry trends.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md">
              <h3 className="section-title mb-4 text-foreground">Stay Updated</h3>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background/80 backdrop-blur-sm border-border/50 rounded-xl focus:bg-background focus:border-border"
                />
                <Button variant="gradient" className="rounded-xl">Subscribe</Button>
              </div>
              <p className="caption-text mt-2 text-muted-foreground">
                Weekly digest of the best in architecture and design.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="section-title mb-4 text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="body-text text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="caption-text mb-4 md:mb-0 text-muted-foreground">
            © 2024 The Grid. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-2">
            <Button variant="glass" size="icon" className="hover:text-primary transition-all duration-200 hover:scale-110 rounded-xl">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="icon" className="hover:text-primary transition-all duration-200 hover:scale-110 rounded-xl">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="icon" className="hover:text-primary transition-all duration-200 hover:scale-110 rounded-xl">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="icon" className="hover:text-primary transition-all duration-200 hover:scale-110 rounded-xl">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
