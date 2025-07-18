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
      toast.info('Iniciando migración de datos estáticos...');
      
      await runMigrationIfAdmin();
      
      toast.success('¡Migración completada exitosamente!');
      
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
          {isMigrating ? 'Migrando...' : 'Migrar Datos Estáticos'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Migrar Datos Estáticos a Base de Datos</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción migrará todos los datos del archivo estático (schools.ts) a la base de datos de Supabase.
            Los datos existentes se actualizarán con la información más completa del archivo estático.
            
            <br /><br />
            
            <strong>¿Estás seguro que quieres continuar?</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleMigration} disabled={isMigrating}>
            {isMigrating ? 'Migrando...' : 'Migrar Datos'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};