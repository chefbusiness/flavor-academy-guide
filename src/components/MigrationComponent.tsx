import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Check, AlertTriangle } from 'lucide-react';
import { migrateSchoolsToDatabase } from '@/utils/migrateSchools';

export const MigrationComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setResult(null);

    const migrationResult = await migrateSchoolsToDatabase();
    setResult(migrationResult);
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Migración de Datos Estáticos</span>
        </CardTitle>
        <CardDescription>
          Migra las 26 escuelas de cocina desde archivos estáticos a la base de datos de Supabase.
          Esta operación se ejecuta solo una vez.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.success ? (result.message || 'Migración exitosa') : (result.error || 'Error en la migración')}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>¿Qué incluye la migración?</strong>
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
            <li>26 escuelas de cocina del País Vasco, España, Francia, Italia, México</li>
            <li>Datos completos: ubicación, contacto, programas, ratings, precios</li>
            <li>Generación automática de slugs para URLs amigables</li>
            <li>Mantenimiento de compatibilidad con el frontend existente</li>
          </ul>
        </div>

        <Button 
          onClick={handleMigration}
          disabled={isLoading || (result?.success === true)}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrando datos...
            </>
          ) : result?.success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Migración Completada
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Ejecutar Migración
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};