
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
  return (
    <Card className="article-card h-full">
      {imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={getTypeVariant(type)} className="text-xs">
            {getTypeLabel(type)}
          </Badge>
          <span className="caption-text text-xs text-muted-foreground">
            {date}
          </span>
        </div>
        <h3 className="article-title text-lg font-medium leading-tight">
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
