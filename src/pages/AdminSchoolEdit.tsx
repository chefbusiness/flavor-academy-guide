
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSchoolById, useUpdateSchool, SchoolFormData } from '@/hooks/useSchoolsCRUD';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const schoolFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  country: z.string().min(1, 'El país es requerido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  address: z.string().min(1, 'La dirección es requerida'),
  website: z.string().url('Debe ser una URL válida'),
  email: z.string().email('Debe ser un email válido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  type: z.enum(['university', 'institute', 'academy', 'college']),
  founded: z.number().min(1800).max(new Date().getFullYear()),
  students_count: z.number().min(0),
  programs_count: z.number().min(0),
  rating: z.number().min(0).max(5),
  tuition_min: z.number().min(0),
  tuition_max: z.number().min(0),
  tuition_currency: z.string().min(1),
  coordinates_lat: z.number().optional(),
  coordinates_lng: z.number().optional(),
  is_active: z.boolean(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export default function AdminSchoolEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: school, isLoading, error } = useSchoolById(id!);
  const updateSchoolMutation = useUpdateSchool();

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: '',
      description: '',
      country: '',
      city: '',
      address: '',
      website: '',
      email: '',
      phone: '',
      type: 'institute',
      founded: new Date().getFullYear(),
      students_count: 0,
      programs_count: 0,
      rating: 0,
      tuition_min: 0,
      tuition_max: 0,
      tuition_currency: 'EUR',
      coordinates_lat: undefined,
      coordinates_lng: undefined,
      is_active: true,
    },
  });

  // Llenar el formulario cuando se carga la escuela
  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        description: school.description,
        country: school.country,
        city: school.city,
        address: school.address,
        website: school.website,
        email: school.email,
        phone: school.phone,
        type: school.type,
        founded: school.founded,
        students_count: school.studentsCount,
        programs_count: school.programsCount,
        rating: school.rating,
        tuition_min: school.tuitionRange.min,
        tuition_max: school.tuitionRange.max,
        tuition_currency: school.tuitionRange.currency,
        coordinates_lat: school.coordinates?.lat,
        coordinates_lng: school.coordinates?.lng,
        is_active: true, // Asumimos que está activa si existe
      });
    }
  }, [school, form]);

  const onSubmit = async (values: SchoolFormValues) => {
    if (!id) return;

    try {
      const formData: Partial<SchoolFormData> = {
        ...values,
        specialties: school?.specialties || [],
        languages: school?.languages || [],
        accreditation: school?.accreditation || [],
        features: school?.features || [],
        programs: school?.programs || [],
        gallery: school?.gallery || [],
      };

      await updateSchoolMutation.mutateAsync({ id, data: formData });
      
      toast({
        title: 'Escuela actualizada',
        description: 'Los cambios se han guardado correctamente.',
      });
      
      navigate('/admin/schools');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios.',
        variant: 'destructive',
      });
    }
  };

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

  if (error || !school) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
          <Header />
          <div className="container mx-auto pt-24 pb-12 px-4">
            <div className="text-center text-red-500">
              Error al cargar la escuela
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
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" asChild>
                <Link to="/admin/schools">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a la lista
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Editar Escuela
            </h1>
            <p className="text-muted-foreground">
              Modifica la información de "{school.name}"
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Datos principales de la escuela
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="university">Universidad</SelectItem>
                              <SelectItem value="institute">Instituto</SelectItem>
                              <SelectItem value="academy">Academia</SelectItem>
                              <SelectItem value="college">Colegio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Describe la escuela, sus fortalezas, programas destacados..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                  <CardDescription>
                    Información de localización
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="coordinates_lat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitud</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="any"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coordinates_lng"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitud</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="any"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sitio Web *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Datos Académicos */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Académica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="founded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año de Fundación *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="students_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Estudiantes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="programs_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Programas</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0"
                            max="5"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Matrícula */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Matrícula</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="tuition_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula Mínima</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tuition_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula Máxima</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tuition_currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Moneda</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to="/admin/schools">
                    Cancelar
                  </Link>
                </Button>
                <Button type="submit" disabled={updateSchoolMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateSchoolMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
}
