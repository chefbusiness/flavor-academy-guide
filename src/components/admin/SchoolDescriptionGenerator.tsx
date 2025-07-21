
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Wand2, RefreshCw, Languages, FileText } from 'lucide-react';

interface SchoolDescriptionGeneratorProps {
  schoolId: string;
  schoolName: string;
  currentDescriptionEs?: string;
  currentDescriptionEn?: string;
  onDescriptionUpdate: (field: 'description' | 'description_en', value: string) => void;
}

export const SchoolDescriptionGenerator = ({
  schoolId,
  schoolName,
  currentDescriptionEs,
  currentDescriptionEn,
  onDescriptionUpdate
}: SchoolDescriptionGeneratorProps) => {
  const [loadingStates, setLoadingStates] = useState({
    generate_spanish: false,
    regenerate_spanish: false,
    generate_english: false,
    regenerate_english: false,
  });
  
  const { toast } = useToast();

  const handleGenerate = async (action: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [action]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-school-descriptions', {
        body: { schoolId, action }
      });

      if (error) {
        throw error;
      }

      const result = data;
      
      if (result.success) {
        // Update the form with the new description
        const field = result.field as 'description' | 'description_en';
        onDescriptionUpdate(field, result.description);
        
        toast({
          title: '✅ Descripción generada',
          description: `Nueva descripción de ${result.length} caracteres creada exitosamente.`,
        });
      } else {
        throw new Error(result.error || 'Error desconocido');
      }

    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar la descripción. Verifica la consola para más detalles.',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [action]: false }));
    }
  };

  const getCharacterCount = (text?: string) => {
    const count = text?.length || 0;
    const isOptimal = count >= 400 && count <= 500;
    const color = isOptimal ? 'text-green-600' : count < 400 ? 'text-orange-500' : 'text-red-500';
    return { count, isOptimal, color };
  };

  const esCharCount = getCharacterCount(currentDescriptionEs);
  const enCharCount = getCharacterCount(currentDescriptionEn);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Generador de Descripciones IA
        </CardTitle>
        <CardDescription>
          Genera o mejora descripciones optimizadas de 400-500 caracteres para "{schoolName}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spanish Description Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descripción en Español
            </h4>
            <Badge variant={esCharCount.isOptimal ? 'default' : 'secondary'} className={esCharCount.color}>
              {esCharCount.count}/500 caracteres
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate('generate_spanish')}
              disabled={Object.values(loadingStates).some(Boolean)}
              className="flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {loadingStates.generate_spanish ? 'Generando...' : 'Generar Nueva'}
            </Button>
            
            {currentDescriptionEs && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={Object.values(loadingStates).some(Boolean)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {loadingStates.regenerate_spanish ? 'Mejorando...' : 'Mejorar Existente'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Mejorar descripción española?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esto mejorará la descripción actual manteniendo la información clave. 
                      La descripción actual se reemplazará.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleGenerate('regenerate_spanish')}>
                      Mejorar Descripción
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* English Description Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Descripción en Inglés
            </h4>
            <Badge variant={enCharCount.isOptimal ? 'default' : 'secondary'} className={enCharCount.color}>
              {enCharCount.count}/500 caracteres
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate('generate_english')}
              disabled={Object.values(loadingStates).some(Boolean) || !currentDescriptionEs}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              {loadingStates.generate_english ? 'Traduciendo...' : 'Generar Traducción'}
            </Button>
            
            {currentDescriptionEn && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={Object.values(loadingStates).some(Boolean)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {loadingStates.regenerate_english ? 'Mejorando...' : 'Mejorar Inglés'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Mejorar descripción en inglés?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esto mejorará la traducción actual manteniendo el sentido original. 
                      La descripción en inglés actual se reemplazará.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleGenerate('regenerate_english')}>
                      Mejorar Traducción
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          {!currentDescriptionEs && (
            <p className="text-sm text-muted-foreground">
              Necesitas una descripción en español primero para generar la versión en inglés
            </p>
          )}
        </div>

        {/* Quick tips */}
        <div className="bg-muted p-3 rounded-lg text-sm">
          <h5 className="font-medium mb-1">💡 Consejos:</h5>
          <ul className="text-muted-foreground space-y-1">
            <li>• Las descripciones óptimas tienen 400-500 caracteres</li>
            <li>• Primero genera/mejora la versión en español</li>
            <li>• Luego crea la traducción al inglés</li>
            <li>• Puedes regenerar tantas veces como necesites</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
