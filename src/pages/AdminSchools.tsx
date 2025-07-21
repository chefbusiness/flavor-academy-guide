
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSchoolsPaginated, useDeleteSchool, useToggleSchoolStatus } from '@/hooks/useSchoolsCRUD';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  Search,
  Plus,
  MoreHorizontal,
  Image as ImageIcon,
  Filter,
  Download,
  Wand2
} from 'lucide-react';
import { MigrateStaticDataButton } from '@/components/MigrateStaticDataButton';
import { supabase } from '@/integrations/supabase/client';

export default function AdminSchools() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const { data: paginatedData, isLoading, error } = useSchoolsPaginated(currentPage, pageSize);
  const deleteSchoolMutation = useDeleteSchool();
  const toggleStatusMutation = useToggleSchoolStatus();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      try {
        await deleteSchoolMutation.mutateAsync(id);
        toast({
          title: 'Escuela eliminada',
          description: `"${name}" ha sido eliminada correctamente.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la escuela.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive: !currentStatus });
      toast({
        title: currentStatus ? 'Escuela desactivada' : 'Escuela activada',
        description: `"${name}" ha sido ${currentStatus ? 'desactivada' : 'activada'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado de la escuela.',
        variant: 'destructive',
      });
    }
  };

  const generateImageForSchool = async (schoolId: string, schoolName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-school-images', {
        body: {
          schoolId,
          schoolName,
          regenerate: true
        }
      });

      if (error) throw error;

      toast({
        title: 'Imagen generada',
        description: `Nueva imagen AI creada para ${schoolName}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo generar la imagen',
        variant: 'destructive',
      });
    }
  };

  // Filter schools
  const filteredSchools = paginatedData?.schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = countryFilter === 'all' || school.country === countryFilter;
    const matchesType = typeFilter === 'all' || school.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && school.is_active) ||
                         (statusFilter === 'inactive' && !school.is_active);

    return matchesSearch && matchesCountry && matchesType && matchesStatus;
  }) || [];

  // Get unique countries and types for filters
  const countries = [...new Set(paginatedData?.schools.map(s => s.country) || [])];
  const types = [...new Set(paginatedData?.schools.map(s => s.type) || [])];

  if (isLoading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
          <Header />
          <div className="container mx-auto pt-24 pb-12 px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
          <Footer />
        </div>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
          <Header />
          <div className="container mx-auto pt-24 pb-12 px-4">
            <div className="text-center text-red-500">
              Error al cargar las escuelas: {error.message}
            </div>
          </div>
          <Footer />
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        
        <div className="container mx-auto pt-24 pb-12 px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Gestión Completa de Escuelas
                </h1>
                <p className="text-muted-foreground">
                  Sistema completo de administración con edición total de perfiles
                </p>
              </div>
              <div className="flex gap-2">
                <MigrateStaticDataButton />
                <Button asChild>
                  <Link to="/admin/schools/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Escuela
                  </Link>
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, país o ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhanced Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Escuelas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paginatedData?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Registradas en el sistema
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredSchools.filter(s => s.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Visibles al público
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Países</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {countries.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cobertura global
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Filtradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredSchools.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Resultados actuales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Páginas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPage} / {paginatedData?.totalPages || 1}
                </div>
                <p className="text-xs text-muted-foreground">
                  Navegación
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Schools Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Listado de Escuelas</CardTitle>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="20">20 por página</SelectItem>
                    <SelectItem value="30">30 por página</SelectItem>
                    <SelectItem value="50">50 por página</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>País/Ciudad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estudiantes</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div className="w-8 h-8 bg-muted rounded overflow-hidden">
                          {school.image ? (
                            <img
                              src={school.image}
                              alt={school.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-48 truncate">
                          {school.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{school.country}</div>
                          <div className="text-muted-foreground">{school.city}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {school.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{school.studentsCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{school.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={school.is_active ? "default" : "secondary"}>
                          {school.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/school/${school.slug || school.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/admin/schools/edit/${school.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(school.id, school.is_active, school.name)}
                              >
                                {school.is_active ? (
                                  <>
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="h-4 w-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => generateImageForSchool(school.id, school.name)}
                              >
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generar Imagen AI
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                onClick={() => handleDelete(school.id, school.name)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Enhanced Pagination */}
          {paginatedData && paginatedData.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(paginatedData.totalPages, currentPage + 1))}
                      className={currentPage === paginatedData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
}
