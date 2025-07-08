
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
        { name: 'Learning Resources', path: '/learning' },
        { name: 'Competitions', path: '/competitions' },
        { name: 'Exhibitions', path: '/exhibitions' },
      ],
    },
    {
      title: 'Opportunities',
      links: [
        { name: 'Job Board', path: '/jobs' },
        { name: 'Freelance Work', path: '/jobs?type=freelance' },
        { name: 'Internships', path: '/jobs?type=internship' },
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
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <span className="font-editorial text-2xl font-semibold text-foreground">
                The Grid
              </span>
            </Link>
            <p className="body-text text-muted-foreground mb-6 max-w-md">
              Your daily source for architecture, design insights, and BIM workflows. 
              Join thousands of professionals staying ahead of industry trends.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md">
              <h3 className="section-title mb-4">Newsletter</h3>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
              </div>
              <p className="caption-text mt-2">
                Weekly digest of the best in architecture and design.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="section-title mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="body-text text-muted-foreground hover:text-primary transition-colors"
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
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="caption-text mb-4 md:mb-0">
            © 2024 The Grid. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
