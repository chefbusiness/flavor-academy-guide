import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Languages } from 'lucide-react';

export const GenerateEnglishDescriptionsButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneration = async () => {
    try {
      setIsGenerating(true);
      toast.info('Generando descripciones en inglés...');
      
      const { data, error } = await supabase.functions.invoke('generate-english-descriptions');
      
      if (error) {
        throw error;
      }

      const result = data as { message: string; processed: number; errors: number; total: number };
      
      if (result.processed > 0) {
        toast.success(`¡Éxito! ${result.processed} descripciones generadas en inglés`);
      } else if (result.total === 0) {
        toast.info('Todas las escuelas ya tienen descripciones en inglés');
      } else {
        toast.warning(`Completado con advertencias: ${result.processed} éxitos, ${result.errors} errores`);
      }
      
      // Refresh the page to see updated data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error generando descripciones en inglés:', error);
      toast.error('Error al generar descripciones. Revisa la consola para más detalles.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" disabled={isGenerating} className="gap-2">
          <Languages className="h-4 w-4" />
          {isGenerating ? 'Generando...' : 'Generar Descripciones en Inglés'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generar Descripciones en Inglés</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción generará descripciones en inglés para todas las escuelas que aún no las tengan,
            utilizando IA para traducir desde las descripciones en español de manera profesional y optimizada para SEO.
            
            <br /><br />
            
            <strong>¿Estás seguro que quieres continuar?</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleGeneration} disabled={isGenerating}>
            {isGenerating ? 'Generando...' : 'Generar Descripciones'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};