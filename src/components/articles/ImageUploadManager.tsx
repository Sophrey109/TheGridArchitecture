import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/hooks/useArticles';
import { useQueryClient } from '@tanstack/react-query';

interface ImageUploadManagerProps {
  article: Article;
  onUpdate: () => void;
}

export const ImageUploadManager = ({ article, onUpdate }: ImageUploadManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [tempCaption, setTempCaption] = useState('');
  const queryClient = useQueryClient();

  const images = article.carousel_images || [];
  const captions = article.carousel_captions || [];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (images.length >= 10) {
      toast.error('Maximum 10 images allowed per article');
      return;
    }

    setUploading(true);
    const file = acceptedFiles[0];

    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${article.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-carousel')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-carousel')
        .getPublicUrl(filePath);

      // Update the article with new image
      const newImages = [...images, publicUrl];
      const newCaptions = [...captions, ''];

      const { error: dbError } = await supabase
        .from('Articles')
        .update({
          carousel_images: newImages,
          carousel_captions: newCaptions
        })
        .eq('id', article.id);

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully!');
      onUpdate();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [article.id, images, captions, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const deleteImage = async (index: number) => {
    try {
      const imageUrl = images[index];
      
      // Extract file path from URL for storage deletion
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get articleId/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('article-carousel')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion failed:', storageError);

      // Update arrays by removing the item at index
      const newImages = images.filter((_, i) => i !== index);
      const newCaptions = captions.filter((_, i) => i !== index);

      const { error: dbError } = await supabase
        .from('Articles')
        .update({
          carousel_images: newImages,
          carousel_captions: newCaptions
        })
        .eq('id', article.id);

      if (dbError) throw dbError;

      toast.success('Image deleted successfully!');
      onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const updateCaption = async (index: number, caption: string) => {
    try {
      const newCaptions = [...captions];
      newCaptions[index] = caption;

      const { error } = await supabase
        .from('Articles')
        .update({ carousel_captions: newCaptions })
        .eq('id', article.id);

      if (error) throw error;

      toast.success('Caption updated successfully!');
      setEditingCaption(null);
      onUpdate();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update caption');
    }
  };

  const moveImage = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    try {
      const newImages = [...images];
      const newCaptions = [...captions];
      
      // Swap elements
      [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
      [newCaptions[fromIndex], newCaptions[toIndex]] = [newCaptions[toIndex], newCaptions[fromIndex]];

      const { error } = await supabase
        .from('Articles')
        .update({
          carousel_images: newImages,
          carousel_captions: newCaptions
        })
        .eq('id', article.id);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      console.error('Move error:', error);
      toast.error('Failed to reorder images');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Carousel Images</h3>
            <p className="text-muted-foreground mb-4">
              {isDragActive
                ? 'Drop the image here...'
                : `Drag & drop an image here, or click to select (${images.length}/10)`}
            </p>
            <Button disabled={uploading || images.length >= 10}>
              {uploading ? 'Uploading...' : images.length >= 10 ? 'Max images reached' : 'Select Image'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={imageUrl}
                  alt={captions[index] || `Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => deleteImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Position: {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
                
                {editingCaption === index ? (
                  <div className="space-y-2">
                    <Input
                      value={tempCaption}
                      onChange={(e) => setTempCaption(e.target.value)}
                      placeholder="Enter caption..."
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateCaption(index, tempCaption)}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCaption(null);
                          setTempCaption('');
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground flex-1">
                      {captions[index] || 'No caption'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCaption(index);
                        setTempCaption(captions[index] || '');
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No carousel images uploaded yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};