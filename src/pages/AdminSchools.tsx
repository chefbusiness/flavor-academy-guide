
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSchoolsPaginated, useDeleteSchool, useToggleSchoolStatus } from '@/hooks/useSchoolsCRUD';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  Search,
  Plus
} from 'lucide-react';

export default function AdminSchools() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filtrar escuelas por término de búsqueda
  const filteredSchools = paginatedData?.schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
                  Gestión de Escuelas
                </h1>
                <p className="text-muted-foreground">
                  Administra las escuelas de cocina registradas en el sistema
                </p>
              </div>
              <Button asChild>
                <Link to="/admin/schools/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Escuela
                </Link>
              </Button>
            </div>

            {/* Controles de búsqueda y paginación */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, país o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select 
                value={pageSize.toString()} 
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="30">30 por página</SelectItem>
                  <SelectItem value="40">40 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Escuelas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paginatedData?.total || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Escuelas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredSchools.filter(s => s.id).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Países</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(filteredSchools.map(s => s.country)).size}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Página Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPage} de {paginatedData?.totalPages || 1}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de escuelas */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fundada</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-48 truncate">
                          {school.name}
                        </div>
                      </TableCell>
                      <TableCell>{school.country}</TableCell>
                      <TableCell>{school.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {school.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{school.founded}</TableCell>
                      <TableCell>{school.rating}/5</TableCell>
                      <TableCell>
                        <Badge variant={school.id ? "default" : "secondary"}>
                          {school.id ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/school/${school.id}`}>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(school.id, !!school.id, school.name)}
                            disabled={toggleStatusMutation.isPending}
                          >
                            {school.id ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(school.id, school.name)}
                            disabled={deleteSchoolMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Paginación */}
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
