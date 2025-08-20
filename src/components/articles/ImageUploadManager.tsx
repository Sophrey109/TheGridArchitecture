import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useArticleCarouselImages, CarouselImage } from '@/hooks/useArticles';
import { useQueryClient } from '@tanstack/react-query';

interface ImageUploadManagerProps {
  articleId: string;
}

export const ImageUploadManager = ({ articleId }: ImageUploadManagerProps) => {
  const { data: images, isLoading, refetch } = useArticleCarouselImages(articleId);
  const [uploading, setUploading] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [tempCaption, setTempCaption] = useState('');
  const queryClient = useQueryClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const file = acceptedFiles[0];

    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${articleId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-carousel')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-carousel')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('article_carousel_images')
        .insert({
          article_id: articleId,
          image_url: publicUrl,
          sort_order: (images?.length || 0) + 1
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully!');
      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [articleId, images?.length, refetch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const deleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get articleId/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('article-carousel')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('article_carousel_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      toast.success('Image deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const updateCaption = async (imageId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('article_carousel_images')
        .update({ caption })
        .eq('id', imageId);

      if (error) throw error;

      toast.success('Caption updated successfully!');
      setEditingCaption(null);
      refetch();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update caption');
    }
  };

  const updateSortOrder = async (imageId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('article_carousel_images')
        .update({ sort_order: newOrder })
        .eq('id', imageId);

      if (error) throw error;

      refetch();
    } catch (error) {
      console.error('Sort error:', error);
      toast.error('Failed to update image order');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading images...</div>;
  }

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
                : 'Drag & drop an image here, or click to select'}
            </p>
            <Button disabled={uploading}>
              {uploading ? 'Uploading...' : 'Select Image'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={image.image_url}
                  alt={image.caption || `Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => deleteImage(image.id, image.image_url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Position: {image.sort_order}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSortOrder(image.id, image.sort_order - 1)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSortOrder(image.id, image.sort_order + 1)}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
                
                {editingCaption === image.id ? (
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
                        onClick={() => updateCaption(image.id, tempCaption)}
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
                      {image.caption || 'No caption'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCaption(image.id);
                        setTempCaption(image.caption || '');
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

      {(!images || images.length === 0) && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No carousel images uploaded yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};