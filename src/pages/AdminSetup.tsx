import { useAdminRole } from '@/hooks/useAdminRole';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MigrationComponent } from '@/components/MigrationComponent';

export default function AdminSetup() {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        
        <div className="container mx-auto pt-24 pb-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Configuración Inicial del Sistema
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bienvenido al panel de administración. Para comenzar, necesitas migrar 
              los datos estáticos de las escuelas a la base de datos.
            </p>
          </div>
          
          <MigrationComponent />
        </div>
        
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
}