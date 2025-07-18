
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStructuredData } from '@/hooks/useStructuredData';
import { Award, Users, Globe, BookOpen } from 'lucide-react';

const AboutUsContent = () => {
  const { language } = useLanguage();
  const { generateOrganizationSchema, generateBreadcrumbSchema } = useStructuredData();

  const seoTitle = language === 'es' 
    ? 'Sobre Nosotros - Directorio Global de Escuelas de Cocina'
    : 'About Us - Global Culinary Schools Directory';
    
  const seoDescription = language === 'es'
    ? 'Conoce la historia y misión del Directorio Global de Escuelas de Cocina. Una idea original del Chef John Guerrero para conectar aspirantes a chef con las mejores instituciones culinarias del mundo.'
    : 'Learn about the history and mission of the Global Culinary Schools Directory. An original idea by Chef John Guerrero to connect aspiring chefs with the world\'s best culinary institutions.';

  const breadcrumbItems = [
    { name: language === 'es' ? 'Inicio' : 'Home', url: 'https://escuelasdecocina.com/' },
    { name: language === 'es' ? 'Sobre Nosotros' : 'About Us' }
  ];

  const structuredData = [
    generateOrganizationSchema,
    generateBreadcrumbSchema(breadcrumbItems)
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        url={language === 'es' ? '/sobre-nosotros' : '/about-us'}
        structuredData={structuredData}
        locale={language === 'es' ? 'es_ES' : 'en_US'}
      />
      
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
              </h1>
              <p className="text-xl text-white/90">
                {language === 'es'
                  ? 'Conectando aspirantes a chef con las mejores instituciones culinarias del mundo'
                  : 'Connecting aspiring chefs with the world\'s best culinary institutions'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {language === 'es' ? 'Nuestra Misión' : 'Our Mission'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === 'es'
                    ? 'Democratizar el acceso a la educación culinaria de excelencia, proporcionando información confiable y actualizada sobre las mejores escuelas de cocina del mundo. Creemos que cada persona apasionada por la gastronomía merece encontrar la formación perfecta para desarrollar su talento.'
                    : 'Democratize access to culinary education excellence by providing reliable and updated information about the world\'s best culinary schools. We believe that every person passionate about gastronomy deserves to find the perfect training to develop their talent.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'es' ? 'Calidad Verificada' : 'Verified Quality'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Solo incluimos instituciones con acreditación oficial'
                      : 'We only include institutions with official accreditation'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'es' ? 'Alcance Global' : 'Global Reach'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Instituciones de todos los continentes'
                      : 'Institutions from all continents'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'es' ? 'Información Completa' : 'Complete Information'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Datos detallados de programas y requisitos'
                      : 'Detailed program and requirement data'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'es' ? 'Comunidad' : 'Community'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Conectamos estudiantes y profesionales'
                      : 'We connect students and professionals'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chef John Guerrero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {language === 'es' ? 'El Creador' : 'The Creator'}
                </h2>
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-semibold text-primary mb-4">Chef John Guerrero</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {language === 'es'
                      ? 'Chef profesional, emprendedor gastronómico y visionario de la educación culinaria digital. Con más de una década de experiencia en la industria gastronómica, John Guerrero ha dedicado su carrera a democratizar el acceso a la información culinaria de calidad.'
                      : 'Professional chef, gastronomic entrepreneur, and digital culinary education visionary. With over a decade of experience in the gastronomic industry, John Guerrero has dedicated his career to democratizing access to quality culinary information.'
                    }
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'es'
                      ? 'Su ecosistema de proyectos gastronómicos incluye AI Chef.Pro, GastroSEO.com, ChefBusiness.co e IngredientsIndex.pro, todos enfocados en apoyar a profesionales y aspirantes del sector culinario con herramientas y recursos de vanguardia.'
                      : 'His ecosystem of gastronomic projects includes AI Chef.Pro, GastroSEO.com, ChefBusiness.co, and IngredientsIndex.pro, all focused on supporting culinary professionals and aspirants with cutting-edge tools and resources.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {language === 'es' ? 'Nuestros Valores' : 'Our Values'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {language === 'es' ? 'Transparencia' : 'Transparency'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'es'
                      ? 'Proporcionamos información clara, honesta y verificada sobre cada institución, sin sesgos ni intereses ocultos.'
                      : 'We provide clear, honest, and verified information about each institution, without bias or hidden interests.'
                    }
                  </p>
                </div>

                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {language === 'es' ? 'Excelencia' : 'Excellence'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'es'
                      ? 'Mantenemos los más altos estándares de calidad en la selección y evaluación de instituciones educativas.'
                      : 'We maintain the highest quality standards in the selection and evaluation of educational institutions.'
                    }
                  </p>
                </div>

                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {language === 'es' ? 'Accesibilidad' : 'Accessibility'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'es'
                      ? 'Creemos que la información educativa de calidad debe estar disponible para todos, sin barreras económicas.'
                      : 'We believe that quality educational information should be available to everyone, without economic barriers.'
                    }
                  </p>
                </div>

                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {language === 'es' ? 'Innovación' : 'Innovation'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'es'
                      ? 'Utilizamos tecnología de vanguardia para mejorar continuamente la experiencia del usuario.'
                      : 'We use cutting-edge technology to continuously improve the user experience.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const AboutUs = () => {
  return (
    <LanguageProvider>
      <AboutUsContent />
    </LanguageProvider>
  );
};

export default AboutUs;
