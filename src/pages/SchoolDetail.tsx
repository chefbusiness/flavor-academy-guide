import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FloatingSocialShare } from '@/components/FloatingSocialShare';
import { SchoolTestimonials } from '@/components/SchoolTestimonials';
import { SchoolLocation } from '@/components/SchoolLocation';
import { SchoolImageGallery } from '@/components/SchoolImageGallery';
import { SchoolStatistics } from '@/components/SchoolStatistics';
import { CountryFlag } from '@/components/CountryFlag';
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
  GraduationCap,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useStructuredData } from '@/hooks/useStructuredData';
import { useSchoolImageIntegration } from '@/hooks/useSchoolImageIntegration';
import { useSchoolById } from '@/hooks/useSchoolById';

const SchoolDetailContent = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { t, language } = useLanguage();
  const { generateSchoolSchema, generateBreadcrumbSchema } = useStructuredData();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determine the identifier to use (id has priority over slug)
  const identifier = id || slug;
  
  console.log('🎯 [SchoolDetail] Component loaded with params:', { 
    id, 
    slug, 
    identifier,
    currentUrl: window.location.href
  });

  if (!identifier) {
    console.log('❌ [SchoolDetail] No identifier provided, redirecting to home');
    return <Navigate to="/" replace />;
  }

  const { data: school, isLoading, error } = useSchoolById(identifier);

  console.log('📊 [SchoolDetail] Query state:', { 
    schoolFound: !!school,
    schoolName: school?.name, 
    isLoading, 
    error: error?.message,
    identifier: identifier
  });

  // Use the same image integration system as SchoolCard
  const { imageSource, getFallbackImageSource, altText } = useSchoolImageIntegration(school || {
    id: '',
    name: '',
    description: '',
    country: '',
    city: '',
    address: '',
    website: '',
    email: '',
    phone: '',
    type: 'academy' as const,
    specialties: [],
    founded: 0,
    studentsCount: 0,
    programsCount: 0,
    image: '',
    rating: 0,
    tuitionRange: { min: 0, max: 0, currency: 'EUR' },
    languages: [],
    accreditation: [],
    features: []
  });

  if (isLoading) {
    console.log('⏳ [SchoolDetail] Loading school data...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Buscando escuela con identificador: {identifier}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ [SchoolDetail] Error occurred:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">
            Ha ocurrido un error al cargar la escuela.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Identificador buscado: {identifier}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Error: {error.message}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!school) {
    console.log('❌ [SchoolDetail] No school found for identifier:', identifier);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Escuela no encontrada</h1>
          <p className="text-muted-foreground mb-4">
            No se pudo encontrar la escuela solicitada.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Identificador buscado: {identifier}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Volver al directorio
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ [SchoolDetail] School loaded successfully:', school.name);

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallbackSources = getFallbackImageSource;
    
    // Find the next available fallback source
    const currentIndex = fallbackSources.indexOf(target.src);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < fallbackSources.length) {
      target.src = fallbackSources[nextIndex];
    } else {
      // Final fallback to Unsplash
      const unsplashId = parseInt(school.id).toString().padStart(8, '0');
      target.src = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=800&h=600&fit=crop&auto=format`;
    }
  };

  const getSchoolDescription = () => {
    if (language === 'en' && school.description_en) {
      return school.description_en;
    }
    return school.description;
  };

  const getSamplePrograms = () => {
    const programsMap: { [key: string]: string[] } = {
      '1': [
        t('gastronomyDegree'),
        t('culinaryInnovationMaster'),
        t('basqueSpecialization')
      ],
      '2': [
        t('culinaryDesign'),
        t('artAndGastronomy'),
        t('advancedPastry')
      ],
      '3': [
        t('traditionalMexican'),
        t('vanguardTechniques'),
        t('restaurantManagement')
      ],
      '4': [
        t('authenticItalian'),
        t('professionalPasta'),
        t('wineAndPairing')
      ],
      '5': [
        t('classicFrench'),
        t('hotelManagementCourse'),
        t('gastronomicEntrepreneurship')
      ],
      '6': [
        t('grandDiplome'),
        t('advancedPatisserie'),
        t('professionalCuisine')
      ]
    };
    
    return programsMap[school.id] || [t('gastronomyDegree'), t('culinaryDesign'), t('classicFrench')];
  };

  const translateLanguage = (lang: string) => {
    const langMap: { [key: string]: string } = {
      'Español': t('spanish'),
      'English': t('english'),
      'Français': t('french'),
      'Italiano': t('italian'),
      'Euskera': t('basque'),
      'Catalán': t('catalan'),
      'Spanish': t('spanish'),
      'French': t('french'),
      'Italian': t('italian'),
      'Basque': t('basque'),
      'Catalan': t('catalan')
    };
    return langMap[lang] || lang;
  };

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

  const currentUrl = `/${language === 'es' ? 'escuela' : 'school'}/${identifier}`;
  const fullUrl = `https://escuelasdecocina.com${currentUrl}`;
  const alternateUrls = [
    { lang: 'es', url: `https://escuelasdecocina.com/escuela/${identifier}` },
    { lang: 'en', url: `https://escuelasdecocina.com/school/${identifier}` },
    { lang: 'x-default', url: `https://escuelasdecocina.com/escuela/${identifier}` }
  ];

  const seoTitle = language === 'es'
    ? `${school.name} - Escuela de Cocina en ${school.city}, ${t(school.country)} | ${school.founded}`
    : `${school.name} - Culinary School in ${school.city}, ${t(school.country)} | ${school.founded}`;
    
  const schoolDescription = getSchoolDescription();
  
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
        description={schoolDescription}
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
        image={imageSource}
        twitterCard="summary_large_image"
      />
      
      <Header />
      
      <FloatingSocialShare
        schoolName={school.name}
        description={school.description}
        url={fullUrl}
      />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          
          <article className="mt-4 space-y-8">
            <header className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
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
                        ({formatNumber(Math.floor(school.studentsCount / 10))} {t('reviews')})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {schoolDescription}
                  </p>
                </div>

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
                <figure className="relative overflow-hidden rounded-lg h-80 bg-gradient-to-br from-primary/20 to-accent/20">
                  <img 
                    src={imageSource}
                    alt={altText}
                    className="w-full h-full object-cover"
                    itemProp="image"
                    loading="eager"
                    onError={handleImageError}
                  />
                  
                  <div className="absolute top-4 left-4">
                    <CountryFlag country={school.country} size="md" />
                  </div>
                  
                  <figcaption className="sr-only">
                    {school.name} {language === 'es' ? 'instalaciones' : 'facilities'}
                  </figcaption>
                </figure>

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

            <SchoolImageGallery
              schoolName={school.name}
              mainImage={imageSource}
              schoolId={school.id}
            />

            <SchoolStatistics school={school} />

            <section className="bg-gradient-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                {t('featuredPrograms')}
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
                          {t('certifiedProgram')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('specialties')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(language === 'en' && school.specialties_en ? school.specialties_en : school.specialties).map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('instructionLanguages')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {school.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      <Globe className="w-3 h-3 mr-1" />
                      {translateLanguage(lang)}
                    </Badge>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('tuitionRange')}
                </h3>
                <div className="flex items-center space-x-2 text-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary" itemProp="priceRange">
                    {formatCurrency(school.tuitionRange.min, school.tuitionRange.currency)} - {formatCurrency(school.tuitionRange.max, school.tuitionRange.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('perYear')}
                  </span>
                </div>
              </section>

              <section className="bg-gradient-card rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('accreditations')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(language === 'en' && school.accreditation_en ? school.accreditation_en : school.accreditation).map((accred) => (
                    <Badge key={accred} variant="outline">
                      <Award className="w-3 h-3 mr-1" />
                      {accred}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            <section className="bg-gradient-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {t('featuredCharacteristics')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(language === 'en' && school.features_en ? school.features_en : school.features).map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <SchoolTestimonials school={school} />

            <SchoolLocation school={school} />

            <footer className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
              <Button 
                onClick={() => window.open(school.website, '_blank')}
                className="flex-1"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {t('visitOfficialWebsite')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`mailto:${school.email}`)}
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t('contactDirectly')}
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
