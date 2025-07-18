
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useSchools } from '@/hooks/useSchoolsDatabase';
import { Database, Users, School, Settings, BarChart3, FileText } from 'lucide-react';
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

  const adminActions = [
    {
      title: 'Configuración Inicial',
      description: 'Migrar datos estáticos a la base de datos',
      icon: Database,
      href: '/admin/setup',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gestión de Imágenes',
      description: 'Administrar imágenes de las escuelas',
      icon: FileText,
      href: '/image-manager',
      color: 'bg-green-500 hover:bg-green-600'
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

          {/* Acciones de Administración */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <action.icon className="h-5 w-5" />
                      <span>{action.title}</span>
                    </CardTitle>
                    <CardDescription>
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={action.href}>
                      <Button className={`w-full ${action.color} text-white`}>
                        Acceder
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
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
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
}
