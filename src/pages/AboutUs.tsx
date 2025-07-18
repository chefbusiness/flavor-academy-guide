import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

const AboutUsContent = () => {
  const { t, language } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems = [
    { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
    { label: language === 'es' ? 'Sobre Nosotros' : 'About Us' }
  ];

  const currentUrl = `/${language === 'es' ? 'sobre-nosotros' : 'about-us'}`;
  const alternateUrls = [
    { lang: 'es', url: 'https://escuelasdecocina.com/sobre-nosotros' },
    { lang: 'en', url: 'https://escuelasdecocina.com/about-us' },
    { lang: 'x-default', url: 'https://escuelasdecocina.com/sobre-nosotros' }
  ];

  const seoTitle = language === 'es'
    ? 'Sobre Nosotros - Directorio de Escuelas de Cocina'
    : 'About Us - Culinary Schools Directory';

  const seoDescription = language === 'es'
    ? 'Conoce más sobre nuestro directorio de escuelas de cocina y nuestra misión de conectar estudiantes con las mejores instituciones culinarias.'
    : 'Learn more about our culinary schools directory and our mission to connect students with the best culinary institutions.';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        url={currentUrl}
        type="website"
        alternateUrls={alternateUrls}
        locale={language === 'es' ? 'es_ES' : 'en_US'}
        siteName="Directorio Global de Escuelas de Cocina"
      />

      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="mt-4">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gradient mb-6">
                {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === 'es'
                  ? 'Descubre cómo nuestro directorio se dedica a conectar a estudiantes apasionados con las mejores escuelas de cocina del mundo.'
                  : 'Discover how our directory is dedicated to connecting passionate students with the best culinary schools in the world.'
                }
              </p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">
                {language === 'es' ? 'Nuestra Misión' : 'Our Mission'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'es'
                  ? 'Facilitar el acceso a información detallada y actualizada sobre escuelas de cocina, programas y oportunidades educativas en gastronomía a nivel global.'
                  : 'To facilitate access to detailed and updated information on culinary schools, programs, and educational opportunities in gastronomy worldwide.'
                }
              </p>
              <p className="text-muted-foreground">
                {language === 'es'
                  ? 'Creemos que la educación culinaria de calidad debe ser accesible para todos los aspirantes a chef, independientemente de su ubicación geográfica o trasfondo económico. Por eso hemos creado esta plataforma integral que reúne las mejores instituciones culinarias del mundo.'
                  : 'We believe that quality culinary education should be accessible to all aspiring chefs, regardless of their geographic location or economic background. That is why we have created this comprehensive platform that brings together the world\'s best culinary institutions.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">
                {language === 'es' ? 'Nuestros Valores' : 'Our Values'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'es' ? 'Excelencia' : 'Excellence'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'es'
                      ? 'Seleccionamos cuidadosamente las mejores escuelas de cocina del mundo, garantizando estándares de calidad excepcionales.'
                      : 'We carefully select the world\'s best culinary schools, ensuring exceptional quality standards.'
                    }
                  </p>
                </div>
                <div className="bg-gradient-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'es' ? 'Transparencia' : 'Transparency'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'es'
                      ? 'Proporcionamos información clara, precisa y actualizada sobre programas, costos y requisitos de admisión.'
                      : 'We provide clear, accurate and updated information about programs, costs and admission requirements.'
                    }
                  </p>
                </div>
                <div className="bg-gradient-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'es' ? 'Accesibilidad' : 'Accessibility'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'es'
                      ? 'Hacemos que la búsqueda de educación culinaria sea fácil y accesible para estudiantes de todo el mundo.'
                      : 'We make the search for culinary education easy and accessible for students from all over the world.'
                    }
                  </p>
                </div>
                <div className="bg-gradient-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'es' ? 'Innovación' : 'Innovation'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'es'
                      ? 'Utilizamos tecnología avanzada para crear la mejor experiencia de búsqueda y comparación de escuelas.'
                      : 'We use advanced technology to create the best search and comparison experience for schools.'
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">
                {language === 'es' ? 'Nuestro Equipo' : 'Our Team'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'es'
                  ? 'Un grupo de profesionales de la gastronomía y la tecnología unidos por la pasión de impulsar la educación culinaria y el talento emergente.'
                  : 'A group of gastronomy and technology professionals united by the passion to promote culinary education and emerging talent.'
                }
              </p>
              <p className="text-muted-foreground">
                {language === 'es'
                  ? 'Nuestro equipo está compuesto por chefs experimentados, educadores culinarios, desarrolladores de software y especialistas en marketing digital, todos comprometidos con la misión de hacer que la educación culinaria sea más accesible y transparente.'
                  : 'Our team is composed of experienced chefs, culinary educators, software developers and digital marketing specialists, all committed to the mission of making culinary education more accessible and transparent.'
                }
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                {language === 'es' ? 'Contáctanos' : 'Contact Us'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'es'
                  ? 'Si tienes preguntas, sugerencias o te gustaría colaborar con nosotros, no dudes en ponerte en contacto.'
                  : 'If you have questions, suggestions, or would like to collaborate with us, please do not hesitate to contact us.'
                }
              </p>
              <a
                href={language === 'es' ? '/contacto' : '/contact'}
                className="inline-block mt-4 text-primary hover:underline"
              >
                {language === 'es' ? 'Ir a la página de contacto' : 'Go to the contact page'}
              </a>
            </section>
          </article>
        </div>
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
