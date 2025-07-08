
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FeaturedArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  publishDate: string;
  readTime: string;
  author: string;
}

const featuredArticles: FeaturedArticle[] = [
  {
    id: '1',
    title: 'The Future of Sustainable Architecture: Net-Zero Buildings in 2024',
    excerpt: 'Exploring innovative approaches to carbon-neutral design and the latest in green building technology.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
    category: 'Sustainability',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    author: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'BIM Revolution: How AI is Transforming Building Information Modeling',
    excerpt: 'Discover the latest AI integrations in BIM workflows and their impact on architectural efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=800&fit=crop',
    category: 'BIM Technology',
    publishDate: '2024-01-12',
    readTime: '12 min read',
    author: 'Marcus Rodriguez'
  },
  {
    id: '3',
    title: 'Minimalist Marvels: Scandinavian Design Principles in Modern Architecture',
    excerpt: 'An in-depth look at how Nordic design philosophy continues to influence contemporary buildings.',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
    category: 'Design Trends',
    publishDate: '2024-01-10',
    readTime: '6 min read',
    author: 'Elena Johansson'
  }
];

export const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const currentArticle = featuredArticles[currentSlide];

  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentArticle.imageUrl})` }}
      >
        <div className="overlay-text" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                {currentArticle.category}
              </span>
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span className="caption-text">{new Date(currentArticle.publishDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h1 className="hero-text text-white mb-6 animate-slide-up">
              {currentArticle.title}
            </h1>
            
            <p className="body-text text-white/90 mb-8 text-lg leading-relaxed animate-fade-in">
              {currentArticle.excerpt}
            </p>
            
            <div className="flex items-center space-x-6">
              <Link to={`/articles/${currentArticle.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Read Full Article
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span className="caption-text">{currentArticle.readTime}</span>
                <span className="caption-text">by {currentArticle.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
