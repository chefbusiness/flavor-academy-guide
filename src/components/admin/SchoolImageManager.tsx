
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSchoolImageIntegration } from '@/hooks/useSchoolImageIntegration';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  Wand2, 
  Trash2, 
  RefreshCw, 
  Eye,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

interface SchoolImageManagerProps {
  schoolId: string;
  schoolName: string;
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
}

export const SchoolImageManager = ({ 
  schoolId, 
  schoolName, 
  currentImage, 
  onImageUpdate 
}: SchoolImageManagerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Use the integrated image system to get the proper image
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `${schoolId}-custom-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('school-images')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-images')
        .getPublicUrl(fileName);

      // Save to database
      await supabase
        .from('school_images')
        .upsert({
          school_id: schoolId,
          image_url: publicUrl,
          image_type: 'real',
          alt_text: `${schoolName} - uploaded image`,
          updated_at: new Date().toISOString(),
        });

      // Update school's main image
      await supabase
        .from('schools')
        .update({ image: publicUrl })
        .eq('id', schoolId);

      onImageUpdate(publicUrl);
      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha subido correctamente',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gestión de Imagen Principal
        </CardTitle>
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

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manual Upload */}
          <div className="space-y-2">
            <Label htmlFor="image-upload">Subir Imagen Manual</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image-upload"
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
                  <RefreshCw className="h-4 w-4 animate-spin" />
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
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
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
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Consejos:</p>
          <ul className="space-y-1 text-xs">
            <li>• Las imágenes AI se generan automáticamente basadas en el nombre de la escuela</li>
            <li>• Puedes subir imágenes reales para mayor precisión</li>
            <li>• Las imágenes se optimizan automáticamente para web</li>
            <li>• Las imágenes de Supabase Storage tienen prioridad sobre otras fuentes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
