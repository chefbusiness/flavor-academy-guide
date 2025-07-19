import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { runMigrationIfAdmin } from '@/utils/migrateStaticSchoolsData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const MigrateStaticDataButton = () => {
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      toast.info('Generando descripciones enriquecidas para SEO...');
      
      await runMigrationIfAdmin();
      
      toast.success('¡Descripciones enriquecidas generadas exitosamente!');
      
      // Refresh the page to see updated data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error durante la migración:', error);
      toast.error('Error durante la migración. Revisa la consola para más detalles.');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" disabled={isMigrating}>
          {isMigrating ? 'Enriqueciendo...' : 'Enriquecer Descripciones'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enriquecer Descripciones de Escuelas</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción generará descripciones enriquecidas de 400-500 caracteres para todas las escuelas,
            optimizadas para SEO. Las descripciones incluirán información sobre fundación, metodología, 
            instalaciones y especialidades.
            
            <br /><br />
            
            <strong>¿Estás seguro que quieres continuar?</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleMigration} disabled={isMigrating}>
            {isMigrating ? 'Enriqueciendo...' : 'Enriquecer Descripciones'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};