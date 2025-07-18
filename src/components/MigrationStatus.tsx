import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Upload, Clock, Loader2 } from 'lucide-react';

export const MigrationStatus: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [migrationResults, setMigrationResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [currentSchool, setCurrentSchool] = useState<string>('');

  useEffect(() => {
    // Check if migration is running by listening to console logs
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      
      if (message.includes('🚀 EJECUTANDO MIGRACIÓN REAL')) {
        setMigrationStatus('running');
        setProgress(0);
      } else if (message.includes('🔄 Procesando')) {
        const match = message.match(/🔄 Procesando (.+?) \(/);
        if (match) {
          setCurrentSchool(match[1]);
          setProgress(prev => Math.min(prev + 7, 90));
        }
      } else if (message.includes('🎉 MIGRACIÓN REAL EXITOSA')) {
        setMigrationStatus('completed');
        setMigrationResults(args[1]);
        setProgress(100);
      } else if (message.includes('💥 MIGRACIÓN REAL FALLÓ')) {
        setMigrationStatus('error');
        setProgress(0);
      } else if (message.includes('🔄 Recargando página')) {
        setMigrationStatus('completed');
        setProgress(100);
      }
      
      originalConsoleLog(...args);
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  if (migrationStatus === 'idle') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-card border shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {migrationStatus === 'running' && (
              <>
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Migrando imágenes a Supabase Storage</p>
                    <p className="text-sm text-muted-foreground">
                      Descargando y subiendo imágenes reales...
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {currentSchool && (
                    <p className="text-xs text-muted-foreground">
                      Procesando: {currentSchool}
                    </p>
                  )}
                </div>
              </>
            )}
            
            {migrationStatus === 'completed' && (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium">¡Migración completada!</p>
                    <p className="text-sm text-muted-foreground">
                      {migrationResults?.summary?.success || 'Todas las'} imágenes subidas a Supabase Storage
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    ✅ Imágenes reales descargadas
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    🎨 Imágenes AI generadas
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Recargando página para mostrar las nuevas imágenes...
                </p>
              </>
            )}
            
            {migrationStatus === 'error' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div>
                    <p className="font-medium">Error en migración</p>
                    <p className="text-sm text-muted-foreground">
                      Revisa la consola para más detalles
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};