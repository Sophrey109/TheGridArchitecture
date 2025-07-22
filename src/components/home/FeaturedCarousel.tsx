
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
    <section className="relative h-[75vh] min-h-[650px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{ backgroundImage: `url(${currentArticle.imageUrl})` }}
      >
        <div className="overlay-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-6 animate-slide-in-up">
              <span className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-xl shadow-lg">
                {currentArticle.category}
              </span>
              <div className="flex items-center space-x-2 text-white/70">
                <Calendar className="h-4 w-4" />
                <span className="small-text">{new Date(currentArticle.publishDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h1 className="hero-text text-white mb-6 animate-slide-in-up drop-shadow-2xl">
              {currentArticle.title}
            </h1>
            
            <p className="subtitle text-white/90 mb-10 animate-fade-in-scale">
              {currentArticle.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-scale">
              <Link to={`/articles/${currentArticle.id}`}>
                <Button variant="glass" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105 shadow-xl">
                  Read Full Article
                </Button>
              </Link>
              <div className="flex items-center space-x-3 text-white/70">
                <Clock className="h-4 w-4" />
                <span className="small-text">{currentArticle.readTime}</span>
                <span className="small-text">•</span>
                <span className="small-text">by {currentArticle.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex space-x-3">
        <Button
          variant="glass"
          size="icon"
          onClick={prevSlide}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-110 shadow-xl rounded-xl"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          onClick={nextSlide}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-110 shadow-xl rounded-xl"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
