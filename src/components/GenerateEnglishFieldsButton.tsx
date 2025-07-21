import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Languages, Loader2 } from 'lucide-react';

export const GenerateEnglishFieldsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateEnglishFields = async () => {
    setIsLoading(true);
    
    try {
      toast({
        title: "Iniciando traducción",
        description: "Generando traducciones en inglés para especialidades, características y acreditaciones...",
      });

      const { data, error } = await supabase.functions.invoke('generate-english-fields', {});

      if (error) {
        throw error;
      }

      const result = data;
      
      toast({
        title: "✅ Traducciones completadas",
        description: `Se procesaron ${result.processed} escuelas. ${result.errors > 0 ? `${result.errors} errores encontrados.` : ''}`,
      });

    } catch (error) {
      console.error('Error generating English fields:', error);
      toast({
        title: "Error",
        description: "Error al generar las traducciones en inglés",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={generateEnglishFields}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Languages className="h-4 w-4" />
      )}
      {isLoading ? 'Generando...' : 'Generar Campos en Inglés'}
    </Button>
  );
};