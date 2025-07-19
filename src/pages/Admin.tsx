
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useSchools } from '@/hooks/useSchoolsDatabase';
import { GenerateEnglishDescriptionsButton } from '@/components/GenerateEnglishDescriptionsButton';
import { School, Settings, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { isSuperAdmin } = useAdminRole();
  const { schools, loading } = useSchools();

  const stats = [
    {
      title: 'Escuelas Totales',
      value: loading ? '...' : schools?.length || 0,
      icon: School,
      description: 'Escuelas registradas en el sistema'
    },
    {
      title: 'Países',
      value: loading ? '...' : new Set(schools?.map(s => s.country)).size || 0,
      icon: BarChart3,
      description: 'Países con escuelas registradas'
    },
    {
      title: 'Estado del Sistema',
      value: 'Activo',
      icon: Settings,
      description: 'Sistema funcionando correctamente'
    }
  ];

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        
        <div className="container mx-auto pt-24 pb-12 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Gestiona el sistema de escuelas de cocina desde este dashboard central
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Panel de Gestión Principal */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Gestión de Contenido</h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="h-5 w-5" />
                  <span>Gestión de Escuelas</span>
                </CardTitle>
                <CardDescription>
                  Administra todas las escuelas de cocina: crear, editar, eliminar y gestionar contenido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/admin/schools" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Ver Todas las Escuelas
                    </Button>
                  </Link>
                  <Link to="/admin/schools/create" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <School className="mr-2 h-4 w-4" />
                      Crear Nueva Escuela
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <GenerateEnglishDescriptionsButton />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Información del Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Rol de Usuario</h4>
                  <p className="text-sm">
                    {isSuperAdmin ? 'Super Administrador' : 'Administrador'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Base de Datos</h4>
                  <p className="text-sm">Supabase PostgreSQL</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Almacenamiento</h4>
                  <p className="text-sm">Supabase Storage</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Autenticación</h4>
                  <p className="text-sm">Supabase Auth</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Estado del MVP:</strong> Sistema listo para deployment en Netlify y conexión de dominio personalizado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
}
