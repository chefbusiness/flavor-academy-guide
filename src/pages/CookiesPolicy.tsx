import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

const CookiesPolicyContent = () => {
  const { language } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems = [
    { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
    { label: language === 'es' ? 'Política de Cookies' : 'Cookies Policy' }
  ];

  const currentUrl = `/${language === 'es' ? 'politica-cookies' : 'cookies-policy'}`;
  const alternateUrls = [
    { lang: 'es', url: 'https://escuelasdecocina.com/politica-cookies' },
    { lang: 'en', url: 'https://escuelasdecocina.com/cookies-policy' },
    { lang: 'x-default', url: 'https://escuelasdecocina.com/politica-cookies' }
  ];

  const seoTitle = language === 'es'
    ? 'Política de Cookies - Directorio de Escuelas de Cocina'
    : 'Cookies Policy - Culinary Schools Directory';

  const seoDescription = language === 'es'
    ? 'Política de cookies del directorio de escuelas de cocina. Información sobre el uso de cookies en nuestro sitio web.'
    : 'Cookies policy of the culinary schools directory. Information about the use of cookies on our website.';

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
                {language === 'es' ? 'Política de Cookies' : 'Cookies Policy'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === 'es' ? 'Última actualización: Enero 2024' : 'Last updated: January 2024'}
              </p>
            </header>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '1. ¿Qué son las Cookies?' : '1. What are Cookies?'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia de navegación.'
                    : 'Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences and improve your browsing experience.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '2. Tipos de Cookies que Utilizamos' : '2. Types of Cookies We Use'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-gradient-card rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      {language === 'es' ? 'Cookies Técnicas' : 'Technical Cookies'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'es'
                        ? 'Necesarias para el funcionamiento básico del sitio web, como preferencias de idioma.'
                        : 'Necessary for the basic functioning of the website, such as language preferences.'
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-card rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      {language === 'es' ? 'Cookies de Rendimiento' : 'Performance Cookies'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'es'
                        ? 'Nos ayudan a entender cómo los visitantes interactúan con el sitio web.'
                        : 'Help us understand how visitors interact with the website.'
                      }
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '3. Cookies de Terceros' : '3. Third-Party Cookies'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Podemos utilizar servicios de terceros como Google Analytics para obtener estadísticas de uso del sitio web. Estos servicios pueden establecer sus propias cookies.'
                    : 'We may use third-party services such as Google Analytics to obtain website usage statistics. These services may set their own cookies.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '4. Gestión de Cookies' : '4. Cookie Management'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {language === 'es'
                    ? 'Puedes controlar y gestionar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar cookies puede afectar la funcionalidad del sitio web.'
                    : 'You can control and manage cookies through your browser settings. Note that disabling cookies may affect website functionality.'
                  }
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    {language === 'es'
                      ? '• Chrome: Configuración > Privacidad y seguridad > Cookies'
                      : '• Chrome: Settings > Privacy and security > Cookies'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Firefox: Preferencias > Privacidad y seguridad'
                      : '• Firefox: Preferences > Privacy and security'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Safari: Preferencias > Privacidad'
                      : '• Safari: Preferences > Privacy'
                    }
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '5. Actualizaciones de la Política' : '5. Policy Updates'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Podemos actualizar esta política de cookies ocasionalmente. Te recomendamos revisar esta página periódicamente para estar al tanto de cualquier cambio.'
                    : 'We may update this cookie policy occasionally. We recommend reviewing this page periodically to stay informed of any changes.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '6. Contacto' : '6. Contact'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en: info@escuelasdecocina.com'
                    : 'If you have questions about our cookie policy, you can contact us at: info@escuelasdecocina.com'
                  }
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const CookiesPolicy = () => {
  return (
    <LanguageProvider>
      <CookiesPolicyContent />
    </LanguageProvider>
  );
};

export default CookiesPolicy;