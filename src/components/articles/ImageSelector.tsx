import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useArticleCarouselImages } from '@/hooks/useArticles';

interface ImageSelectorProps {
  articleId: string;
}

interface StorageImage {
  name: string;
  publicUrl: string;
}

export const ImageSelector = ({ articleId }: ImageSelectorProps) => {
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { data: carouselImages, refetch } = useArticleCarouselImages(articleId);

  useEffect(() => {
    loadStorageImages();
  }, []);

  const loadStorageImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('article-images')
        .list('', { limit: 100 });

      if (error) throw error;

      const images = data
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .map(file => ({
          name: file.name,
          publicUrl: supabase.storage
            .from('article-images')
            .getPublicUrl(file.name).data.publicUrl
        }));

      setStorageImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images from storage');
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl)
        ? prev.filter(url => url !== imageUrl)
        : prev.length < 10 
          ? [...prev, imageUrl]
          : prev
    );
  };

  const addSelectedImages = async () => {
    if (selectedImages.length === 0) return;

    setAdding(true);
    try {
      const currentMaxOrder = Math.max(0, ...(carouselImages?.map(img => img.sort_order || 0) || []));
      
      const insertData = selectedImages.map((imageUrl, index) => ({
        article_id: articleId,
        image_url: imageUrl,
        sort_order: currentMaxOrder + index + 1
      }));

      const { error } = await supabase
        .from('article_carousel_images')
        .insert(insertData);

      if (error) throw error;

      toast.success(`${selectedImages.length} images added to carousel!`);
      setSelectedImages([]);
      refetch();
    } catch (error) {
      console.error('Error adding images:', error);
      toast.error('Failed to add images to carousel');
    } finally {
      setAdding(false);
    }
  };

  const isImageInCarousel = (imageUrl: string) => {
    return carouselImages?.some(img => img.image_url === imageUrl) || false;
  };

  if (loading) {
    return <div className="p-6">Loading images from storage...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Select Images from Storage</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {selectedImages.length}/10 selected
          </span>
          <Button 
            onClick={addSelectedImages}
            disabled={selectedImages.length === 0 || adding}
          >
            {adding ? 'Adding...' : `Add ${selectedImages.length} Images`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {storageImages.map((image) => {
          const inCarousel = isImageInCarousel(image.publicUrl);
          const isSelected = selectedImages.includes(image.publicUrl);
          
          return (
            <Card 
              key={image.name} 
              className={`overflow-hidden cursor-pointer transition-all ${
                inCarousel ? 'opacity-50 bg-muted' : 
                isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => !inCarousel && toggleImageSelection(image.publicUrl)}
            >
              <div className="relative aspect-square">
                <img
                  src={image.publicUrl}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                {!inCarousel && (
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={isSelected}
                      disabled={!isSelected && selectedImages.length >= 10}
                    />
                  </div>
                )}
                {inCarousel && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/70 rounded">
                      Already in carousel
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground truncate">
                  {image.name}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {storageImages.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No images found in article-images storage.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};