import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MigrationResult {
  success: boolean;
  message?: string;
  summary?: {
    total: number;
    success: number;
    errors: number;
  };
  results?: Array<{
    schoolId: string;
    schoolName: string;
    status: 'success' | 'error';
    url?: string;
    type?: string;
    error?: string;
  }>;
  error?: string;
}

export function ImageMigrationComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🚀 Iniciando migración de imágenes...');
      
      const { data, error } = await supabase.functions.invoke('real-migration-to-storage', {
        body: {}
      });

      if (error) {
        throw new Error(error.message || 'Error calling migration function');
      }

      console.log('✅ Migración completada:', data);
      setResult(data);

    } catch (error) {
      console.error('❌ Error en migración:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Migración de Imágenes a Supabase Storage
        </CardTitle>
        <CardDescription>
          Migra todas las imágenes de las escuelas desde URLs externas de Google a Supabase Storage
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">¿Qué hace esta migración?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Descarga todas las imágenes desde las URLs de Google</li>
            <li>• Las sube al bucket "school-images" de Supabase Storage</li>
            <li>• Actualiza las URLs en la base de datos para que apunten a Supabase</li>
            <li>• Evita problemas futuros de imágenes rotas</li>
          </ul>
        </div>

        <Button
          onClick={handleMigration}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrando imágenes...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Iniciar Migración de Imágenes
            </>
          )}
        </Button>

        {result && (
          <Alert className={result.success !== false ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription>
              {result.success !== false ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      {result.message}
                    </span>
                  </div>
                  
                  {result.summary && (
                    <div className="text-sm text-green-700">
                      <p>Total: {result.summary.total} imágenes</p>
                      <p>Exitosas: {result.summary.success}</p>
                      <p>Errores: {result.summary.errors}</p>
                    </div>
                  )}

                  {result.results && result.results.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto">
                      <h5 className="font-medium text-green-800 mb-2">Resultados detallados:</h5>
                      <div className="space-y-1">
                        {result.results.map((item, index) => (
                          <div key={index} className="text-xs p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              {item.status === 'success' ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                              <span className="font-medium">{item.schoolName}</span>
                              {item.type && (
                                <span className="text-muted-foreground">({item.type})</span>
                              )}
                            </div>
                            {item.url && (
                              <p className="text-muted-foreground mt-1 break-all">
                                {item.url}
                              </p>
                            )}
                            {item.error && (
                              <p className="text-red-600 mt-1">{item.error}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">
                    Error: {result.error}
                  </span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}