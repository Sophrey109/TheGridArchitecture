
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBannerFeaturedArticles } from '@/hooks/useArticles';

// Helper function to extract excerpt from content or use stored excerpt
const getExcerpt = (content: string | null, excerpt: string | null): string => {
  if (excerpt) return excerpt;
  if (!content) return 'No preview available.';
  
  // Remove HTML tags and get first few sentences
  const plainText = content.replace(/<[^>]*>/g, '');
  const sentences = plainText.split('.').slice(0, 2).join('.');
  return sentences.length > 150 ? sentences.substring(0, 150) + '...' : sentences + '.';
};

// Helper function to get category from tags or article_type
const getCategory = (tags: string[] | null, articleType: string | null): string => {
  if (tags && tags.length > 0) return tags[0];
  if (articleType) return articleType;
  return 'Article';
};

// Helper function to calculate read time
const calculateReadTime = (content: string | null): string => {
  if (!content) return '5 min read';
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

export const FeaturedCarousel = () => {
  const { data: articles, isLoading, error } = useBannerFeaturedArticles();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-scroll every 30 seconds
  useEffect(() => {
    if (!articles || articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [articles]);

  const nextSlide = () => {
    if (!articles) return;
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    if (!articles) return;
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (isLoading) {
    return (
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10 animate-pulse">
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-muted-foreground">Loading featured articles...</div>
        </div>
      </section>
    );
  }

  if (error || !articles || articles.length === 0) {
    return (
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-muted-foreground">No featured articles available.</div>
        </div>
      </section>
    );
  }

  const currentArticle = articles[currentSlide];

  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{ backgroundImage: `url(${currentArticle.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop'})` }}
      >
        <div className="overlay-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-6 animate-slide-in-up">
              <span className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-xl shadow-lg">
                {getCategory(currentArticle.tags, currentArticle.article_type)}
              </span>
              <div className="flex items-center space-x-2 text-white/70">
                <Calendar className="h-4 w-4" />
                <span className="small-text">
                  {currentArticle['Published Date'] 
                    ? new Date(currentArticle['Published Date']).toLocaleDateString()
                    : 'Recent'
                  }
                </span>
              </div>
            </div>
            
            <h1 className="hero-text text-white mb-6 animate-slide-in-up drop-shadow-2xl">
              {currentArticle.Title}
            </h1>
            
            <p className="subtitle text-white/90 mb-10 animate-fade-in-scale">
              {getExcerpt(currentArticle.Content, currentArticle.excerpt)}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-scale">
              <Link to={`/articles/${currentArticle.id}`}>
                <Button variant="glass" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105 shadow-xl">
                  Read Full Article
                </Button>
              </Link>
              <div className="flex items-center space-x-3 text-white/70">
                <Clock className="h-4 w-4" />
                <span className="small-text">{calculateReadTime(currentArticle.Content)}</span>
                <span className="small-text">•</span>
                <span className="small-text">by {currentArticle.Author || 'Anonymous'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex space-x-3 z-20">
        <Button
          variant="glass"
          size="icon"
          onClick={prevSlide}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-110 shadow-xl rounded-xl cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          onClick={nextSlide}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-110 shadow-xl rounded-xl cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
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
