
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen, 
  Star, 
  ExternalLink, 
  Mail, 
  Phone,
  Award,
  Globe,
  DollarSign,
  Share2,
  GraduationCap,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useStructuredData } from '@/hooks/useStructuredData';
import { useSchoolImage } from '@/hooks/useSchoolImages';
import { getSchoolImageUrl, getSchoolImageAltText } from '@/utils/imageMapping';
import { schools } from '@/data/schools';
import { findSchoolBySlug } from '@/utils/slugUtils';

const SchoolDetailContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const { generateSchoolSchema, generateBreadcrumbSchema } = useStructuredData();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const school = findSchoolBySlug(slug, schools);

  if (!school) {
    return <Navigate to="/" replace />;
  }

  // Use the new image system
  const { data: schoolImageData, isLoading: imageLoading } = useSchoolImage(school.id);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US').format(num);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: school.name,
          text: school.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Enhanced image source logic with the new system
  const getImageSource = () => {
    // First try Supabase image
    if (schoolImageData?.image_url) {
      return schoolImageData.image_url;
    }
    
    // Then try local mapping
    const localImage = getSchoolImageUrl(school.id);
    if (localImage) {
      return localImage;
    }
    
    // Finally fallback to Unsplash
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    return `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=800&h=600&fit=crop&auto=format`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    
    // If Supabase image fails, try local mapping
    if (schoolImageData?.image_url && target.src === schoolImageData.image_url) {
      const localImage = getSchoolImageUrl(school.id);
      if (localImage) {
        target.src = localImage;
        return;
      }
    }
    
    // If local image fails, use Unsplash fallback
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    target.src = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=800&h=600&fit=crop&auto=format`;
  };

  // Sample programs data - will be replaced with real data from CSV
  const getSamplePrograms = () => {
    const programsMap: { [key: string]: string[] } = {
      '1': ['Grado en Gastronomía', 'Máster en Innovación Culinaria', 'Especialización en Cocina Vasca'],
      '2': ['Diseño Culinario', 'Arte y Gastronomía', 'Técnicas Avanzadas de Pastelería'],
      '3': ['Cocina Tradicional Mexicana', 'Técnicas de Vanguardia', 'Gestión de Restaurantes'],
      '4': ['Cocina Italiana Auténtica', 'Pasta y Risotto Profesional', 'Enología y Maridaje'],
      '5': ['Cocina Francesa Clásica', 'Gestión Hotelera', 'Emprendimiento Gastronómico'],
      '6': ['Grand Diplôme', 'Pâtisserie Avancée', 'Cuisine Professionnelle']
    };
    
    return programsMap[school.id] || ['Programa Principal', 'Especialización Avanzada', 'Certificación Profesional'];
  };

  // Generate comprehensive structured data
  const schoolStructuredData = generateSchoolSchema(school);
  
  const breadcrumbStructuredData = generateBreadcrumbSchema([
    { name: t('home'), url: 'https://escuelasdecocina.com/' },
    { name: t('directory'), url: 'https://escuelasdecocina.com/' },
    { name: school.name }
  ]);

  const combinedStructuredData = [schoolStructuredData, breadcrumbStructuredData];

  const breadcrumbItems = [
    { label: t('directory'), href: '/' },
    { label: school.name }
  ];

  // Enhanced SEO optimization
  const currentUrl = `/${language === 'es' ? 'escuela' : 'school'}/${slug}`;
  const alternateUrls = [
    { lang: 'es', url: `https://escuelasdecocina.com/escuela/${slug}` },
    { lang: 'en', url: `https://escuelasdecocina.com/school/${slug}` },
    { lang: 'x-default', url: `https://escuelasdecocina.com/escuela/${slug}` }
  ];

  const seoTitle = language === 'es'
    ? `${school.name} - Escuela de Cocina en ${school.city}, ${t(school.country)} | ${school.founded}`
    : `${school.name} - Culinary School in ${school.city}, ${t(school.country)} | ${school.founded}`;
    
  const seoDescription = language === 'es'
    ? `${school.description} Ubicada en ${school.city}, ${t(school.country)}. Fundada en ${school.founded}. ${formatNumber(school.studentsCount)} estudiantes. Especialidades: ${school.specialties.map(s => t(s)).join(', ')}. Rating: ${school.rating}/5 estrellas.`
    : `${school.description} Located in ${school.city}, ${t(school.country)}. Founded in ${school.founded}. ${formatNumber(school.studentsCount)} students. Specialties: ${school.specialties.map(s => t(s)).join(', ')}. Rating: ${school.rating}/5 stars.`;

  const seoKeywords = [
    school.name,
    `escuela de cocina ${school.city}`,
    `culinary school ${school.city}`,
    school.city,
    t(school.country),
    `escuela cocina ${t(school.country)}`,
    `culinary school ${t(school.country)}`,
    ...school.specialties.map(s => t(s)),
    ...school.specialties.map(s => `${t(s)} ${school.city}`),
    `gastronomía ${school.city}`,
    `gastronomy ${school.city}`,
    `chef profesional ${school.city}`,
    `professional chef ${school.city}`,
    school.founded.toString(),
    school.type,
    t(school.type)
  ].join(', ');

  const additionalMeta = [
    { name: 'geo.region', content: school.country === 'spain' ? 'ES' : 'XX' },
    { name: 'geo.placename', content: school.city },
    { name: 'ICBM', content: '40.4168,-3.7038' },
    { property: 'business:contact_data:street_address', content: school.address },
    { property: 'business:contact_data:locality', content: school.city },
    { property: 'business:contact_data:country_name', content: t(school.country) },
    { property: 'business:contact_data:email', content: school.email },
    { property: 'business:contact_data:phone_number', content: school.phone },
    { property: 'business:contact_data:website', content: school.website },
    { name: 'rating', content: school.rating.toString() },
    { name: 'priceRange', content: `${school.tuitionRange.currency} ${school.tuitionRange.min}-${school.tuitionRange.max}` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={currentUrl}
        type="article"
        structuredData={combinedStructuredData}
        alternateUrls={alternateUrls}
        locale={language === 'es' ? 'es_ES' : 'en_US'}
        siteName="Directorio Global de Escuelas de Cocina"
        author={`${school.name} - Directorio Global de Escuelas de Cocina`}
        publishedTime={`${school.founded}-01-01T00:00:00Z`}
        modifiedTime={new Date().toISOString()}
        additionalMeta={additionalMeta}
        image={getImageSource()}
        twitterCard="summary_large_image"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Hero Section with enhanced SEO structure */}
          <article className="mt-8">
            <header className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                      {school.name}
                    </h1>
                    <h2 className="text-xl text-muted-foreground mb-4">
                      {language === 'es'
                        ? `Escuela de Cocina en ${school.city}, ${t(school.country)}`
                        : `Culinary School in ${school.city}, ${t(school.country)}`
                      }
                    </h2>
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="secondary">
                        {t(school.type)}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-amber-500 fill-current" />
                        <span className="font-medium">{school.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({formatNumber(Math.floor(school.studentsCount / 10))} {language === 'es' ? 'reseñas' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="flex-shrink-0"
                    aria-label={language === 'es' ? 'Compartir escuela' : 'Share school'}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {school.description}
                  </p>
                </div>

                {/* Contact Info with Schema markup considerations */}
                <address className="space-y-3 not-italic">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <span itemProp="address">{school.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <span>
                      <time dateTime={school.founded.toString()}>
                        {t('founded')} {school.founded}
                      </time>
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <a 
                      href={`mailto:${school.email}`} 
                      className="text-primary hover:underline"
                      itemProp="email"
                    >
                      {school.email}
                    </a>
                  </div>

                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <a 
                      href={`tel:${school.phone}`} 
                      className="text-primary hover:underline"
                      itemProp="telephone"
                    >
                      {school.phone}
                    </a>
                  </div>
                </address>
              </div>

              <div className="space-y-6">
                {/* Main Image with improved loading and fallback system */}
                <figure className="relative overflow-hidden rounded-lg h-80 bg-gradient-to-br from-primary/20 to-accent/20">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="animate-pulse text-muted-foreground">
                        {language === 'es' ? 'Cargando imagen...' : 'Loading image...'}
                      </div>
                    </div>
                  )}
                  <img 
                    src={getImageSource()} 
                    alt={getSchoolImageAltText(school.name)}
                    className="w-full h-full object-cover"
                    itemProp="image"
                    loading="eager"
                    onError={handleImageError}
                  />
                  <figcaption className="sr-only">
                    {school.name} {language === 'es' ? 'instalaciones' : 'facilities'}
                  </figcaption>
                </figure>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-card rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary" itemProp="numberOfStudents">
                      {formatNumber(school.studentsCount)}
                    </div>
                    <div className="text-sm text-muted-foreground">{t('students')}</div>
                  </div>
                  
                  <div className="bg-gradient-card rounded-lg p-4 text-center">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">
                      {school.programsCount}
                    </div>
                    <div className="text-sm text-muted-foreground">{t('programs')}</div>
                  </div>
                </div>
              </div>
            </header>

            {/* New Programs Section */}
            <section className="bg-gradient-card rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                {language === 'es' ? 'Programas Destacados' : 'Featured Programs'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSamplePrograms().map((program, index) => (
                  <div key={index} className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{program}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'es' ? 'Programa certificado' : 'Certified program'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Specialties */}
              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'es' ? 'Especialidades' : 'Specialties'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {school.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {t(specialty)}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Languages */}
              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'es' ? 'Idiomas de Instrucción' : 'Languages of Instruction'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {school.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      <Globe className="w-3 h-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Tuition */}
              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'es' ? 'Rango de Matrícula' : 'Tuition Range'}
                </h3>
                <div className="flex items-center space-x-2 text-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary" itemProp="priceRange">
                    {formatCurrency(school.tuitionRange.min, school.tuitionRange.currency)} - {formatCurrency(school.tuitionRange.max, school.tuitionRange.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {language === 'es' ? 'por año' : 'per year'}
                  </span>
                </div>
              </section>

              {/* Accreditation */}
              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'es' ? 'Acreditaciones' : 'Accreditations'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {school.accreditation.map((accred) => (
                    <Badge key={accred} variant="outline">
                      <Award className="w-3 h-3 mr-1" />
                      {accred}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Features */}
            <section className="bg-gradient-card rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'es' ? 'Características Destacadas' : 'Featured Characteristics'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {school.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <footer className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
              <Button 
                onClick={() => window.open(school.website, '_blank')}
                className="flex-1"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {language === 'es' ? 'Visitar Sitio Web Oficial' : 'Visit Official Website'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`mailto:${school.email}`)}
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                {language === 'es' ? 'Contactar Directamente' : 'Contact Directly'}
              </Button>
            </footer>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const SchoolDetail = () => {
  return (
    <LanguageProvider>
      <SchoolDetailContent />
    </LanguageProvider>
  );
};

export default SchoolDetail;
