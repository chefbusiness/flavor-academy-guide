
import { useParams, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
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
  Share2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { schools } from '@/data/schools';
import { findSchoolBySlug } from '@/utils/slugUtils';

const SchoolDetailContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const school = findSchoolBySlug(slug, schools);

  if (!school) {
    return <Navigate to="/" replace />;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
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
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": school.name,
    "description": school.description,
    "url": school.website,
    "email": school.email,
    "telephone": school.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": school.address,
      "addressLocality": school.city,
      "addressCountry": t(school.country)
    },
    "foundingDate": school.founded.toString(),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": school.rating,
      "bestRating": "5"
    },
    "image": school.image
  };

  const breadcrumbItems = [
    { label: t('directory'), href: '/' },
    { label: school.name }
  ];

  const seoTitle = `${school.name} - ${t('directory')}`;
  const seoDescription = `${school.description} Ubicada en ${school.city}, ${t(school.country)}. Fundada en ${school.founded}. ${formatNumber(school.studentsCount)} estudiantes.`;
  const seoKeywords = `${school.name}, escuela de cocina, ${school.city}, ${t(school.country)}, ${school.specialties.map(s => t(s)).join(', ')}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`/${language === 'es' ? 'escuela' : 'school'}/${slug}`}
        type="website"
        structuredData={structuredData}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {school.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary">
                      {t(school.type)}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-amber-500 fill-current" />
                      <span className="font-medium">{school.rating}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="flex-shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {school.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <span>{school.address}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <span>{t('founded')} {school.founded}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <a href={`mailto:${school.email}`} className="text-primary hover:underline">
                    {school.email}
                  </a>
                </div>

                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <a href={`tel:${school.phone}`} className="text-primary hover:underline">
                    {school.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg h-80 bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={school.image} 
                  alt={school.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1556909114-${school.id.padStart(8, '0')}?w=800&h=600&fit=crop&auto=format`;
                  }}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-card rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{formatNumber(school.studentsCount)}</div>
                  <div className="text-sm text-muted-foreground">{t('students')}</div>
                </div>
                
                <div className="bg-gradient-card rounded-lg p-4 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{school.programsCount}</div>
                  <div className="text-sm text-muted-foreground">{t('programs')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specialties */}
            <div className="bg-gradient-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {school.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline">
                    {t(specialty)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-gradient-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Idiomas de Instrucción</h3>
              <div className="flex flex-wrap gap-2">
                {school.languages.map((language) => (
                  <Badge key={language} variant="secondary">
                    <Globe className="w-3 h-3 mr-1" />
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tuition */}
            <div className="bg-gradient-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Rango de Matrícula</h3>
              <div className="flex items-center space-x-2 text-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">
                  {formatCurrency(school.tuitionRange.min, school.tuitionRange.currency)} - {formatCurrency(school.tuitionRange.max, school.tuitionRange.currency)}
                </span>
                <span className="text-sm text-muted-foreground">por año</span>
              </div>
            </div>

            {/* Accreditation */}
            <div className="bg-gradient-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Acreditaciones</h3>
              <div className="flex flex-wrap gap-2">
                {school.accreditation.map((accred) => (
                  <Badge key={accred} variant="outline">
                    <Award className="w-3 h-3 mr-1" />
                    {accred}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-card rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4">Características Destacadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {school.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
            <Button 
              onClick={() => window.open(school.website, '_blank')}
              className="flex-1"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visitar Sitio Web Oficial
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(`mailto:${school.email}`)}
              size="lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contactar Directamente
            </Button>
          </div>
        </div>
      </main>
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
