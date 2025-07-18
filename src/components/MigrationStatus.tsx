import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Upload, Clock } from 'lucide-react';

export const MigrationStatus: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'running' | 'completed' | 'error' | null>(null);
  const [migrationResults, setMigrationResults] = useState<any>(null);

  useEffect(() => {
    // Check if migration is running by listening to console logs
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('🚀 Ejecutando migración')) {
        setMigrationStatus('running');
      } else if (message.includes('🎉 Migración automática completada')) {
        setMigrationStatus('completed');
        setMigrationResults(args[1]);
      } else if (message.includes('💥 Error en migración')) {
        setMigrationStatus('error');
      }
      originalConsoleLog(...args);
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  if (!migrationStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-card border shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {migrationStatus === 'running' && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <div>
                  <p className="text-sm font-medium">Migrando imágenes...</p>
                  <p className="text-xs text-muted-foreground">Subiendo a Supabase Storage</p>
                </div>
              </>
            )}
            
            {migrationStatus === 'completed' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">¡Migración completada!</p>
                  <p className="text-xs text-muted-foreground">
                    {migrationResults?.summary?.success || 0} imágenes subidas
                  </p>
                </div>
              </>
            )}
            
            {migrationStatus === 'error' && (
              <>
                <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Error en migración</p>
                  <p className="text-xs text-muted-foreground">Revisa la consola</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};