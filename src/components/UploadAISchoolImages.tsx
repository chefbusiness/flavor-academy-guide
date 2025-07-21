
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, XCircle, Sparkles } from 'lucide-react';

interface UploadResult {
  school: string;
  id: string;
  slug: string;
  status: 'success' | 'error';
  publicUrl?: string;
  error?: string;
}

export const UploadAISchoolImages = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [summary, setSummary] = useState<{total: number, success: number, errors: number} | null>(null);

  const handleUpload = async () => {
    setIsUploading(true);
    setResults([]);
    setSummary(null);

    try {
      console.log('🚀 Iniciando subida de imágenes AI de nuevas escuelas...');
      
      const { data, error } = await supabase.functions.invoke('upload-ai-school-images', {
        body: {}
      });

      if (error) {
        throw error;
      }

      console.log('✅ Función ejecutada exitosamente:', data);
      
      if (data.results) {
        setResults(data.results);
      }
      
      if (data.summary) {
        setSummary(data.summary);
      }

      toast.success(`Proceso completado: ${data.summary?.success || 0} éxitos, ${data.summary?.errors || 0} errores`);

    } catch (error) {
      console.error('Error al subir imágenes AI:', error);
      toast.error(`Error al subir imágenes AI: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Subir Imágenes AI de Nuevas Escuelas
        </h3>
        <p className="text-sm text-muted-foreground">
          Generar y subir imágenes AI para las 8 nuevas escuelas del País Vasco a Supabase Storage
        </p>
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={isUploading}
        className="w-full"
        variant="default"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando y subiendo imágenes AI...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generar y Subir Imágenes AI
          </>
        )}
      </Button>

      {summary && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Resumen del Proceso AI</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{summary.total}</div>
              <div className="text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.success}</div>
              <div className="text-muted-foreground">Éxitos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.errors}</div>
              <div className="text-muted-foreground">Errores</div>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Resultados AI:</h4>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md border text-sm ${
                  result.status === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{result.school}</div>
                      <div className="text-xs opacity-75">UUID: {result.id}</div>
                      <div className="text-xs opacity-75">Slug: {result.slug}</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium">
                    {result.status === 'success' ? 'ÉXITO' : 'ERROR'}
                  </span>
                </div>
                {result.error && (
                  <div className="mt-1 text-xs opacity-75">{result.error}</div>
                )}
                {result.publicUrl && (
                  <div className="mt-1 text-xs opacity-75 break-all">
                    URL: {result.publicUrl}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
