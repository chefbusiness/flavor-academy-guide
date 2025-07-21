
import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { MigrateStaticDataButton } from '@/components/MigrateStaticDataButton';
import { GenerateEnglishDescriptionsButton } from '@/components/GenerateEnglishDescriptionsButton';
import { GenerateEnglishFieldsButton } from '@/components/GenerateEnglishFieldsButton';
import { SlugSyncButton } from '@/components/SlugSyncButton';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  GraduationCap, 
  Database, 
  Settings, 
  BarChart3,
  Globe,
  RefreshCw
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalUsers: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      // Get school stats
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id, is_active');

      if (schoolsError) throw schoolsError;

      const totalSchools = schools?.length || 0;
      const activeSchools = schools?.filter(s => s.is_active).length || 0;

      // Get user stats (from profiles table since we can't access auth.users directly)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');

      if (profilesError) throw profilesError;

      const totalUsers = profiles?.length || 0;

      setStats({
        totalSchools,
        activeSchools,
        totalUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Gestiona escuelas, usuarios y configuración del sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Escuelas</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSchools}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeSchools} activas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Usuarios registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge variant="default">En Línea</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Todos los sistemas operativos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Gestión de Datos
                </CardTitle>
                <CardDescription>
                  Gestiona datos de escuelas y operaciones de base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="flex-1">
                    <Link to="/admin/schools">Gestionar Escuelas</Link>
                  </Button>
                  <MigrateStaticDataButton />
                </div>
                <div className="pt-2">
                  <SlugSyncButton />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Internacionalización
                </CardTitle>
                <CardDescription>
                  Gestiona traducciones y contenido multiidioma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GenerateEnglishDescriptionsButton />
                <GenerateEnglishFieldsButton />
              </CardContent>
            </Card>
          </div>

          {/* System Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Herramientas del Sistema
              </CardTitle>
              <CardDescription>
                Herramientas avanzadas de configuración y mantenimiento del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" asChild>
                  <Link to="/image-manager">Gestor de Imágenes</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/setup">Configuración Inicial</Link>
                </Button>
                <Button variant="outline" disabled>
                  Panel de Analíticas
                  <Badge variant="secondary" className="ml-2">Próximamente</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
