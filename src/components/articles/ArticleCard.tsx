
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  type: string; // Single article type (for backward compatibility)
  types?: string[]; // Multiple article types (new field)
  date: string;
  imageUrl?: string;
  tags?: string[];
  onTagClick?: (tag: string) => void;
  onTypeClick?: (type: string) => void;
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

export const ArticleCard = ({ id, title, excerpt, type, types, date, imageUrl, tags, onTagClick, onTypeClick }: ArticleCardProps) => {
  // Use the main type as primary, and types array as subcategories
  const primaryType = type;
  const subcategories = types && types.length > 0 ? types : [];
  
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

  const displayImage = imageUrl || getFallbackImage(primaryType);

  return (
    <Link to={`/articles/${id}`}>
      <Card className="article-card h-full group hover-scale animate-fade-in">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <LazyImage
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-wrap gap-1 items-center">
              {/* Primary type - larger badge */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTypeClick?.(primaryType);
                }}
                className="inline-block"
              >
                <Badge variant={getTypeVariant(primaryType)} className="text-sm animate-scale-in hover:opacity-80 transition-opacity cursor-pointer">
                  {getTypeLabel(primaryType)}
                </Badge>
              </button>
              
              {/* Subcategories - smaller badges */}
              {subcategories.map((subcategory, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTypeClick?.(subcategory);
                  }}
                  className="inline-block"
                >
                  <Badge variant="outline" className="text-xs animate-scale-in hover:opacity-80 transition-opacity cursor-pointer text-muted-foreground">
                    {getTypeLabel(subcategory)}
                  </Badge>
                </button>
              ))}
            </div>
            <span className="caption-text text-xs text-muted-foreground">
              {date}
            </span>
          </div>
          <h3 className="article-title text-lg font-medium leading-tight story-link">
            {title}
          </h3>
        </CardHeader>
      <CardContent className="pt-0">
        <p className="body-text text-muted-foreground line-clamp-3 mb-3">
          {excerpt}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <button
                key={index}
                onClick={() => onTagClick?.(tag)}
                className="text-xs px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
};
