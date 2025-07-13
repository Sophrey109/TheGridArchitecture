
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface AffiliateLink {
  name: string;
  logo: string;
  url: string;
  description: string;
}

const affiliateLinks: AffiliateLink[] = [
  {
    name: 'Notion',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center',
    url: '#', // Replace with your affiliate link
    description: 'All-in-one workspace for notes, docs, and project management'
  },
  {
    name: 'Revit',
    logo: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop&crop=center',
    url: '#', // Replace with your affiliate link
    description: 'BIM software for architectural design and documentation'
  },
  {
    name: 'AutoCAD',
    logo: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop&crop=center',
    url: '#', // Replace with your affiliate link
    description: 'Computer-aided design and drafting software'
  }
];

export const DesignEssentials = () => {
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="section-title flex items-center gap-2">
          Design Essentials
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {affiliateLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group hover:bg-accent/50 rounded-lg p-3 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={link.logo}
                  alt={`${link.name} logo`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {link.name}
                </h4>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
            <p className="caption-text text-xs leading-relaxed">
              {link.description}
            </p>
          </a>
        ))}
        
        <div className="pt-2 mt-4 border-t">
          <p className="caption-text text-xs text-center">
            Support The Grid by using our affiliate links
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
