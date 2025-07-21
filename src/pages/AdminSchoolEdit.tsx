
import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { useSchoolById, useUpdateSchool, SchoolFormData } from '@/hooks/useSchoolsCRUD';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, MapPin, GraduationCap, DollarSign, Globe, Settings } from 'lucide-react';
import { SchoolImageManager } from '@/components/admin/SchoolImageManager';

const schoolFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  description_en: z.string().optional(),
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
  slug: z.string().optional(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export default function AdminSchoolEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [accreditation, setAccreditation] = useState<string[]>([]);

  const { data: school, isLoading, error } = useSchoolById(id!);
  const updateSchoolMutation = useUpdateSchool();

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: '',
      description: '',
      description_en: '',
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
      slug: '',
    },
  });

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        description: school.description,
        description_en: school.description_en || '',
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
        is_active: school.is_active ?? true,
        slug: school.slug || '',
      });
      
      setCurrentImage(school.image);
      setSpecialties(school.specialties);
      setLanguages(school.languages);
      setFeatures(school.features);
      setAccreditation(school.accreditation);
    }
  }, [school, form]);

  const onSubmit = async (values: SchoolFormValues) => {
    if (!id) return;

    try {
      const formData: Partial<SchoolFormData> = {
        ...values,
        specialties,
        languages,
        accreditation,
        features,
        programs: school?.programs || [],
        gallery: school?.gallery || [],
        image: currentImage,
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

  const addToArray = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    if (value.trim() && !array.includes(value.trim())) {
      setArray([...array, value.trim()]);
    }
  };

  const removeFromArray = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    setArray(array.filter(item => item !== value));
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
        
        <div className="container mx-auto pt-24 pb-12 px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" asChild>
                <Link to="/admin/schools">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a la lista
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/school/${school.slug || school.id}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver página pública
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Editor Completo de Escuela
            </h1>
            <p className="text-muted-foreground">
              Edición total del perfil de "{school.name}" - Todos los datos, imágenes y configuraciones
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="location">Ubicación</TabsTrigger>
                  <TabsTrigger value="academic">Académico</TabsTrigger>
                  <TabsTrigger value="images">Imágenes</TabsTrigger>
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="settings">Config</TabsTrigger>
                </TabsList>

                {/* Basic Information */}
                <TabsContent value="basic">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Información Básica
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de la Escuela *</FormLabel>
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
                              <FormLabel>Tipo de Institución *</FormLabel>
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
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contacto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                  </div>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Descripción</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción (Español) *</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={6}
                                placeholder="Describe la escuela, sus fortalezas, programas destacados..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción (Inglés)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={6}
                                placeholder="English description..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Location */}
                <TabsContent value="location">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Ubicación y Dirección
                      </CardTitle>
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
                            <FormLabel>Dirección Completa *</FormLabel>
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
                              <FormDescription>
                                Para mostrar en mapas
                              </FormDescription>
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
                </TabsContent>

                {/* Academic Information */}
                <TabsContent value="academic">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Datos Académicos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Información de Matrícula
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        
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
                                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                  <SelectItem value="USD">USD (Dólar)</SelectItem>
                                  <SelectItem value="GBP">GBP (Libra)</SelectItem>
                                  <SelectItem value="CAD">CAD (Dólar Canadiense)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Images Management */}
                <TabsContent value="images">
                  <SchoolImageManager
                    schoolId={id!}
                    schoolName={school.name}
                    currentImage={currentImage}
                    onImageUpdate={setCurrentImage}
                  />
                </TabsContent>

                {/* Content Management */}
                <TabsContent value="content">
                  <div className="space-y-6">
                    {/* Specialties */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Especialidades</CardTitle>
                        <CardDescription>
                          Áreas de especialización de la escuela
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Agregar especialidad..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addToArray(specialties, setSpecialties, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button 
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addToArray(specialties, setSpecialties, input.value);
                                input.value = '';
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer">
                                {specialty}
                                <button
                                  type="button"
                                  onClick={() => removeFromArray(specialties, setSpecialties, specialty)}
                                  className="ml-2 text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Idiomas</CardTitle>
                        <CardDescription>
                          Idiomas en los que se imparten las clases
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Agregar idioma..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addToArray(languages, setLanguages, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button 
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addToArray(languages, setLanguages, input.value);
                                input.value = '';
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {languages.map((language, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer">
                                {language}
                                <button
                                  type="button"
                                  onClick={() => removeFromArray(languages, setLanguages, language)}
                                  className="ml-2 text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Características y Servicios</CardTitle>
                        <CardDescription>
                          Instalaciones y servicios que ofrece la escuela
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Agregar característica..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addToArray(features, setFeatures, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button 
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addToArray(features, setFeatures, input.value);
                                input.value = '';
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer">
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => removeFromArray(features, setFeatures, feature)}
                                  className="ml-2 text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Accreditations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Acreditaciones</CardTitle>
                        <CardDescription>
                          Certificaciones y acreditaciones oficiales
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Agregar acreditación..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addToArray(accreditation, setAccreditation, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button 
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addToArray(accreditation, setAccreditation, input.value);
                                input.value = '';
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {accreditation.map((cert, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer">
                                {cert}
                                <button
                                  type="button"
                                  onClick={() => removeFromArray(accreditation, setAccreditation, cert)}
                                  className="ml-2 text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configuración y Estado
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL amigable)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="nombre-de-escuela" />
                            </FormControl>
                            <FormDescription>
                              URL personalizada para la escuela (ej: /school/basque-culinary-center)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Estado de la Escuela
                              </FormLabel>
                              <FormDescription>
                                Controla si la escuela es visible públicamente
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Información del Sistema</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>ID:</strong> {school.id}</p>
                          <p><strong>Creada:</strong> Escuela en el sistema</p>
                          <p><strong>Última actualización:</strong> Se actualizará al guardar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 sticky bottom-4 bg-background p-4 border rounded-lg shadow-sm">
                <Button variant="outline" asChild>
                  <Link to="/admin/schools">
                    Cancelar
                  </Link>
                </Button>
                <Button type="submit" disabled={updateSchoolMutation.isPending} className="min-w-32">
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
