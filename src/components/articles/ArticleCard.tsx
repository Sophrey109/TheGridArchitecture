
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  type: 'opinion' | 'research' | 'news' | 'case-studies';
  date: string;
  imageUrl?: string;
}

const getTypeVariant = (type: string) => {
  switch (type) {
    case 'opinion':
      return 'default';
    case 'research':
      return 'secondary';
    case 'news':
      return 'destructive';
    case 'case-studies':
      return 'outline';
    default:
      return 'default';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'case-studies':
      return 'Case Studies';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const ArticleCard = ({ title, excerpt, type, date, imageUrl }: ArticleCardProps) => {
  // Fallback images for different article types
  const getFallbackImage = (type: string) => {
    const fallbacks = {
      'opinion': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop',
      'research': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop',
      'news': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
      'case-studies': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
    };
    return fallbacks[type as keyof typeof fallbacks] || fallbacks.research;
  };

  const displayImage = imageUrl || getFallbackImage(type);

  return (
    <Card className="article-card h-full group hover-scale animate-fade-in">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={getTypeVariant(type)} className="text-xs animate-scale-in">
            {getTypeLabel(type)}
          </Badge>
          <span className="caption-text text-xs text-muted-foreground">
            {date}
          </span>
        </div>
        <h3 className="article-title text-lg font-medium leading-tight story-link">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="body-text text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
      </CardContent>
    </Card>
  );
};
