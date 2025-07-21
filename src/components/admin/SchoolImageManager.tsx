import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSchoolImageIntegration } from '@/hooks/useSchoolImageIntegration';
import { 
  useSchoolGalleryImages, 
  useUploadSchoolImage, 
  useDeleteSchoolImage,
  useReorderGalleryImages 
} from '@/hooks/useSchoolImages';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  Loader2, 
  Sparkles, 
  Eye,
  ImageIcon,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Grid,
  Wand2
} from 'lucide-react';

interface SchoolImageManagerProps {
  schoolId: string;
  schoolName: string;
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
}

const GALLERY_CATEGORIES = [
  { value: 'kitchen-facilities', label: 'Instalaciones de Cocina', emoji: '🍳' },
  { value: 'classroom', label: 'Aulas', emoji: '📚' },
  { value: 'students-cooking', label: 'Estudiantes Cocinando', emoji: '👨‍🍳' },
  { value: 'dishes-created', label: 'Platos Creados', emoji: '🍽️' },
  { value: 'exterior-building', label: 'Edificio Exterior', emoji: '🏢' },
  { value: 'dining-area', label: 'Área de Degustación', emoji: '🍷' }
];

export const SchoolImageManager = ({ 
  schoolId, 
  schoolName, 
  currentImage, 
  onImageUpdate 
}: SchoolImageManagerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingGallery, setIsGeneratingGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  // Hooks for gallery management
  const { data: galleryImages, refetch: refetchGallery } = useSchoolGalleryImages(schoolId);
  const uploadImageMutation = useUploadSchoolImage();
  const deleteImageMutation = useDeleteSchoolImage();
  const reorderImagesMutation = useReorderGalleryImages();

  // Use the integrated image system to get the proper main image
  const school = { 
    id: schoolId, 
    name: schoolName, 
    image: currentImage 
  } as any;
  
  const { 
    imageSource, 
    isSupabaseImageAvailable, 
    altText 
  } = useSchoolImageIntegration(school);

  // Main image generation
  const generateAIImage = async (regenerate = false) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-school-images', {
        body: {
          schoolId,
          schoolName,
          regenerate
        }
      });

      if (error) throw error;

      if (data.success) {
        onImageUpdate(data.imageUrl);
        toast({
          title: regenerate ? 'Imagen regenerada' : 'Imagen generada',
          description: `Nueva imagen AI creada para ${schoolName}`,
        });
      } else {
        throw new Error(data.error || 'Error generando imagen');
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar la imagen con AI',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Main image upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `${schoolId}-main-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('school-images')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-images')
        .getPublicUrl(fileName);

      // Save to database with main category
      await uploadImageMutation.mutateAsync({
        schoolId,
        imageUrl: publicUrl,
        imageType: 'real',
        altText: `${schoolName} - main image`,
        imageCategory: 'main'
      });

      // Update school's main image
      await supabase
        .from('schools')
        .update({ image: publicUrl })
        .eq('id', schoolId);

      onImageUpdate(publicUrl);
      toast({
        title: 'Imagen subida',
        description: 'La imagen principal se ha subido correctamente',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Gallery image generation with AI
  const generateGalleryImage = async () => {
    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Selecciona una categoría para generar la imagen',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingGallery(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-gallery-images', {
        body: {
          schoolId,
          schoolName,
          category: selectedCategory,
          description: customPrompt || undefined
        }
      });

      if (error) throw error;

      if (data.success) {
        refetchGallery();
        setSelectedCategory('');
        setCustomPrompt('');
        toast({
          title: 'Imagen de galería generada',
          description: `Nueva imagen AI creada para la categoría ${selectedCategory}`,
        });
      } else {
        throw new Error(data.error || 'Error generando imagen de galería');
      }
    } catch (error) {
      console.error('Error generating gallery image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar la imagen de galería',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingGallery(false);
    }
  };

  // Gallery image upload
  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedCategory) return;

    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Selecciona una categoría antes de subir imágenes',
        variant: 'destructive',
      });
      return;
    }

    const uploadPromises = Array.from(files).map(async (file, index) => {
      const fileName = `${schoolId}-gallery-${selectedCategory}-${Date.now()}-${index}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('school-images')
        .upload(`gallery/${fileName}`, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-images')
        .getPublicUrl(`gallery/${fileName}`);

      // Get next display order
      const maxOrder = galleryImages?.filter(img => img.image_category === selectedCategory)
        .reduce((max, img) => Math.max(max, img.display_order || 0), 0) || 0;

      await uploadImageMutation.mutateAsync({
        schoolId,
        imageUrl: publicUrl,
        imageType: 'real',
        altText: `${schoolName} - ${selectedCategory}`,
        imageCategory: selectedCategory,
        displayOrder: maxOrder + index + 1
      });

      return publicUrl;
    });

    try {
      await Promise.all(uploadPromises);
      refetchGallery();
      toast({
        title: 'Imágenes subidas',
        description: `${files.length} imagen(es) subida(s) a la galería`,
      });
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast({
        title: 'Error',
        description: 'Error al subir las imágenes de galería',
        variant: 'destructive',
      });
    }
  };

  // Delete gallery image
  const deleteGalleryImage = async (imageId: string, imageName: string) => {
    try {
      await deleteImageMutation.mutateAsync(imageId);
      refetchGallery();
      toast({
        title: 'Imagen eliminada',
        description: `Imagen ${imageName} eliminada de la galería`,
      });
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la imagen',
        variant: 'destructive',
      });
    }
  };

  // Move image up/down in order
  const moveImage = async (imageId: string, direction: 'up' | 'down') => {
    if (!galleryImages) return;

    const currentIndex = galleryImages.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const updates = [
      { id: galleryImages[currentIndex].id, display_order: galleryImages[targetIndex].display_order || 0 },
      { id: galleryImages[targetIndex].id, display_order: galleryImages[currentIndex].display_order || 0 }
    ];

    try {
      await reorderImagesMutation.mutateAsync(updates);
      refetchGallery();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: 'Error',
        description: 'No se pudo reordenar las imágenes',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Imagen Principal
          </CardTitle>
          <CardDescription>
            Gestiona la imagen principal que se muestra en las tarjetas y páginas de detalle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Image Preview */}
          <div className="space-y-2">
            <Label>Imagen Actual</Label>
            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
              {imageSource ? (
                <>
                  <img
                    src={imageSource}
                    alt={altText}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const placeholder = img.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">No hay imagen</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">No hay imagen</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={isSupabaseImageAvailable ? "default" : "secondary"}>
                  <Eye className="h-3 w-3 mr-1" />
                  {isSupabaseImageAvailable ? 'Supabase' : 'Fallback'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Image Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual Upload */}
            <div className="space-y-2">
              <Label htmlFor="main-image-upload">Subir Imagen Manual</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="main-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  disabled={isUploading}
                  className="shrink-0"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* AI Generation */}
            <div className="space-y-2">
              <Label>Generar con AI</Label>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateAIImage(false)}
                  disabled={isGenerating}
                  variant="outline"
                  className="flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generar
                </Button>
                
                {imageSource && (
                  <Button
                    onClick={() => generateAIImage(true)}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                  >
                    <Loader2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Galería de Imágenes
          </CardTitle>
          <CardDescription>
            Gestiona las imágenes adicionales que se muestran en la galería de la escuela.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gallery Upload Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-3">
              <Label>Categoría de Imagen</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        {category.emoji} {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="custom-prompt">Descripción Personalizada (Opcional)</Label>
              <Textarea
                id="custom-prompt"
                placeholder="Describe específicamente qué quieres que muestre la imagen..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="gallery-upload">Subir Imágenes Manuales</Label>
              <Input
                id="gallery-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={!selectedCategory}
              />
            </div>

            <div className="space-y-3">
              <Label>Generar con AI</Label>
              <Button
                onClick={generateGalleryImage}
                disabled={isGeneratingGallery || !selectedCategory}
                className="w-full"
              >
                {isGeneratingGallery ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generar Imagen AI
              </Button>
            </div>
          </div>

          {/* Gallery Grid */}
          {galleryImages && galleryImages.length > 0 ? (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Imágenes Actuales ({galleryImages.length})</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `Imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Image Info */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {GALLERY_CATEGORIES.find(cat => cat.value === image.image_category)?.emoji || '📸'}
                      </Badge>
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      <Badge variant={image.image_type === 'real' ? 'default' : 'outline'} className="text-xs">
                        {image.image_type === 'real' ? 'Real' : 'AI'}
                      </Badge>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => moveImage(image.id, 'down')}
                        disabled={index === galleryImages.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteGalleryImage(image.id, image.alt_text || 'imagen')}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Category Label */}
                    <div className="mt-1 text-xs text-muted-foreground text-center truncate">
                      {GALLERY_CATEGORIES.find(cat => cat.value === image.image_category)?.label || image.image_category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay imágenes en la galería</p>
              <p className="text-sm">Selecciona una categoría y sube o genera imágenes</p>
            </div>
          )}

          {/* Info */}
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Consejos para la Galería:</p>
            <ul className="space-y-1 text-xs">
              <li>• Sube múltiples imágenes seleccionando varios archivos</li>
              <li>• Las imágenes AI se generan según la categoría seleccionada</li>
              <li>• Usa las flechas para reordenar el orden de aparición</li>
              <li>• Las descripciones personalizadas mejoran la generación AI</li>
              <li>• Cada categoría representa un aspecto diferente de la escuela</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};