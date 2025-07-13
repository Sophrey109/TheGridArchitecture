
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TrendingArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  publishDate: string;
  readTime: string;
  views: number;
}

const trendingArticles: TrendingArticle[] = [
  {
    id: '4',
    title: 'Parametric Design: The Mathematics Behind Stunning Architecture',
    excerpt: 'How computational design is revolutionizing the way architects approach complex forms.',
    imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&h=400&fit=crop',
    category: 'Technology',
    publishDate: '2024-01-14',
    readTime: '10 min read',
    views: 12500
  },
  {
    id: '5',
    title: 'Urban Planning in Crisis: Designing Resilient Cities',
    excerpt: 'Strategies for creating adaptive urban environments in the face of climate change.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    category: 'Urban Design',
    publishDate: '2024-01-13',
    readTime: '7 min read',
    views: 9800
  },
  {
    id: '6',
    title: 'Material Innovation: Bio-based Building Materials',
    excerpt: 'Exploring mushroom bricks, bamboo composites, and other sustainable alternatives.',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
    category: 'Materials',
    publishDate: '2024-01-11',
    readTime: '9 min read',
    views: 8900
  },
  {
    id: '7',
    title: 'The Return of Brutalism: Modern Takes on Concrete Architecture',
    excerpt: 'How contemporary architects are reimagining brutalist principles for today.',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&h=400&fit=crop',
    category: 'Architecture History',
    publishDate: '2024-01-09',
    readTime: '6 min read',
    views: 11200
  },
  {
    id: '8',
    title: 'Smart Buildings: IoT Integration in Modern Architecture',
    excerpt: 'The convergence of building automation and architectural design.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    category: 'Smart Technology',
    publishDate: '2024-01-08',
    readTime: '8 min read',
    views: 7600
  },
  {
    id: '9',
    title: 'Adaptive Reuse: Breathing New Life into Historic Buildings',
    excerpt: 'Case studies of successful architectural transformations and preservation.',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
    category: 'Preservation',
    publishDate: '2024-01-07',
    readTime: '11 min read',
    views: 6800
  }
];

export const TrendingGrid = () => {
  return (
    <section className="bg-background">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="hero-text mb-4">Trending Now</h2>
          <p className="body-text text-muted-foreground max-w-2xl">
            The most-read articles and conversations shaping architecture and design today.
          </p>
        </div>
        <Link 
          to="/articles" 
          className="body-text text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All Articles →
        </Link>
      </div>

      <div className="editorial-grid">
        {trendingArticles.map((article, index) => (
          <Card key={article.id} className={`article-card group overflow-hidden ${
            index === 0 ? 'md:col-span-2 md:row-span-2' : ''
          }`}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                  {article.category}
                </span>
              </div>
              {index === 0 && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">#1 Trending</span>
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <Link to={`/articles/${article.id}`} className="group">
                <h3 className={`${index === 0 ? 'article-title' : 'section-title'} mb-3 group-hover:text-primary transition-colors`}>
                  {article.title}
                </h3>
              </Link>
              
              <p className="body-text text-muted-foreground mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <span className="font-medium">{article.views.toLocaleString()} views</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
