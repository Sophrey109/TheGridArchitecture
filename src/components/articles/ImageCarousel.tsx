import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useArticleCarouselImages, CarouselImage } from '@/hooks/useArticles';

interface ImageCarouselProps {
  articleId: string;
}

export const ImageCarousel = ({ articleId }: ImageCarouselProps) => {
  const { data: images, isLoading } = useArticleCarouselImages(articleId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading || !images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8 text-center">Gallery</h2>
          
          {/* Main Carousel */}
          <div className="relative max-w-5xl mx-auto mb-8">
            <div className="relative overflow-hidden rounded-lg shadow-lg bg-muted/20">
              <img
                src={images[currentIndex].image_url}
                alt={images[currentIndex].caption || `Gallery image ${currentIndex + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain cursor-pointer transition-transform duration-300 hover:scale-105 mx-auto block"
                onClick={() => openModal(currentIndex)}
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-white/20"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
            
            {/* Caption */}
            {images[currentIndex].caption && (
              <p className="text-center text-muted-foreground mt-4 italic">
                {images[currentIndex].caption}
              </p>
            )}
          </div>
          
          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex justify-center space-x-2 overflow-x-auto pb-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                    index === currentIndex 
                      ? 'ring-2 ring-primary opacity-100' 
                      : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full max-h-full p-0 bg-black/90">
          <div className="relative w-full h-screen flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <img
              src={images[currentIndex].image_url}
              alt={images[currentIndex].caption || `Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Modal Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
            
            {/* Modal Caption */}
            {images[currentIndex].caption && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg max-w-2xl text-center">
                <p className="text-lg">{images[currentIndex].caption}</p>
              </div>
            )}
            
            {/* Modal Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};