import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const AboutUs = () => {
  const { t, language } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems = [
    { label: t('home'), href: '/' },
    { label: t('aboutUs') }
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="mt-8">
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gradient mb-4">
                {t('aboutUs')}
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
              <p className="text-muted-foreground">
                {language === 'es'
                  ? 'Facilitar el acceso a información detallada y actualizada sobre escuelas de cocina, programas y oportunidades educativas en gastronomía a nivel global.'
                  : 'To facilitate access to detailed and updated information on culinary schools, programs, and educational opportunities in gastronomy worldwide.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">
                {language === 'es' ? 'Nuestro Equipo' : 'Our Team'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'es'
                  ? 'Un grupo de profesionales de la gastronomía y la tecnología unidos por la pasión de impulsar la educación culinaria y el talento emergente.'
                  : 'A group of gastronomy and technology professionals united by the passion to promote culinary education and emerging talent.'
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

export default AboutUs;
