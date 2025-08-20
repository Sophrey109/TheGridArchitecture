import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Edit2, Save, Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [storageFiles, setStorageFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loadingStorage, setLoadingStorage] = useState(false);
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

  // Load storage files
  const loadStorageFiles = async () => {
    setLoadingStorage(true);
    try {
      const { data, error } = await supabase.storage
        .from('article-carousel')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;

      // Get public URLs for each file
      const filesWithUrls = await Promise.all(
        (data || [])
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          .map(async (file) => {
            const { data: { publicUrl } } = supabase.storage
              .from('article-carousel')
              .getPublicUrl(file.name);
            
            return {
              ...file,
              publicUrl,
              path: file.name
            };
          })
      );

      setStorageFiles(filesWithUrls);
    } catch (error) {
      console.error('Error loading storage files:', error);
      toast.error('Failed to load storage files');
    } finally {
      setLoadingStorage(false);
    }
  };

  // Load storage files on component mount
  useEffect(() => {
    loadStorageFiles();
  }, []);

  const toggleFileSelection = (filePath: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(filePath)) {
      newSelection.delete(filePath);
    } else {
      newSelection.add(filePath);
    }
    setSelectedFiles(newSelection);
  };

  const addSelectedFiles = async () => {
    if (selectedFiles.size === 0) {
      toast.error('No files selected');
      return;
    }

    if (images.length + selectedFiles.size > 10) {
      toast.error(`Cannot add ${selectedFiles.size} files. Maximum 10 images total.`);
      return;
    }

    try {
      const selectedFileData = storageFiles.filter(file => selectedFiles.has(file.path));
      const newImageUrls = selectedFileData.map(file => file.publicUrl);
      const newCaptions = new Array(selectedFileData.length).fill('');

      const updatedImages = [...images, ...newImageUrls];
      const updatedCaptions = [...captions, ...newCaptions];

      const { error } = await supabase
        .from('Articles')
        .update({
          carousel_images: updatedImages,
          carousel_captions: updatedCaptions
        })
        .eq('id', article.id);

      if (error) throw error;

      toast.success(`Added ${selectedFiles.size} images to carousel`);
      setSelectedFiles(new Set());
      onUpdate();
    } catch (error) {
      console.error('Error adding files:', error);
      toast.error('Failed to add selected files');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload New Images</TabsTrigger>
          <TabsTrigger value="storage">Import from Storage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          {/* Storage Browser */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Storage Browser
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadStorageFiles}
                  disabled={loadingStorage}
                >
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStorage ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading storage files...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      {storageFiles.length} files found | {selectedFiles.size} selected
                    </p>
                    <Button
                      onClick={addSelectedFiles}
                      disabled={selectedFiles.size === 0 || images.length + selectedFiles.size > 10}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Selected ({selectedFiles.size})
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                    {storageFiles.map((file) => (
                      <div
                        key={file.path}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedFiles.has(file.path)
                            ? 'ring-2 ring-primary border-primary'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => toggleFileSelection(file.path)}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={file.publicUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Checkbox
                              checked={selectedFiles.has(file.path)}
                              onChange={() => toggleFileSelection(file.path)}
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground truncate">
                            {file.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {storageFiles.length === 0 && (
                    <div className="text-center py-8">
                      <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No images found in storage</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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