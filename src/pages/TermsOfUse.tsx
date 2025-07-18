import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsOfUse = () => {
  const { language } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems = [
    { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
    { label: language === 'es' ? 'Términos de Uso' : 'Terms of Use' }
  ];

  const currentUrl = `/${language === 'es' ? 'terminos-uso' : 'terms-of-use'}`;
  const alternateUrls = [
    { lang: 'es', url: 'https://escuelasdecocina.com/terminos-uso' },
    { lang: 'en', url: 'https://escuelasdecocina.com/terms-of-use' },
    { lang: 'x-default', url: 'https://escuelasdecocina.com/terminos-uso' }
  ];

  const seoTitle = language === 'es'
    ? 'Términos de Uso - Directorio de Escuelas de Cocina'
    : 'Terms of Use - Culinary Schools Directory';

  const seoDescription = language === 'es'
    ? 'Términos de uso del directorio de escuelas de cocina. Condiciones y términos para el uso de nuestros servicios.'
    : 'Terms of use of the culinary schools directory. Conditions and terms for the use of our services.';

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
              <h1 className="text-3xl font-bold text-gradient mb-4">
                {language === 'es' ? 'Términos de Uso' : 'Terms of Use'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'es' ? 'Última actualización: Enero 2024' : 'Last updated: January 2024'}
              </p>
            </header>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '1. Aceptación de Términos' : '1. Acceptance of Terms'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Al acceder y utilizar este directorio de escuelas de cocina, aceptas cumplir con estos términos de uso y todas las leyes y regulaciones aplicables.'
                    : 'By accessing and using this culinary schools directory, you agree to comply with these terms of use and all applicable laws and regulations.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '2. Uso del Servicio' : '2. Use of Service'}
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    {language === 'es'
                      ? '• Este directorio es solo para uso informativo y educativo'
                      : '• This directory is for informational and educational use only'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• No garantizamos la exactitud completa de toda la información'
                      : '• We do not guarantee the complete accuracy of all information'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Los usuarios deben verificar la información directamente con las escuelas'
                      : '• Users should verify information directly with schools'
                    }
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '3. Contenido del Usuario' : '3. User Content'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Al enviar contenido a través de formularios de contacto, otorgas permiso para usar dicha información para responder a tus consultas y mejorar nuestros servicios.'
                    : 'By submitting content through contact forms, you grant permission to use such information to respond to your inquiries and improve our services.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '4. Limitación de Responsabilidad' : '4. Limitation of Liability'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'No seremos responsables por daños directos, indirectos, incidentales o consecuentes que resulten del uso de este directorio.'
                    : 'We will not be responsible for direct, indirect, incidental or consequential damages resulting from the use of this directory.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '5. Propiedad Intelectual' : '5. Intellectual Property'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'El contenido, diseño y estructura de este sitio web están protegidos por derechos de autor y otras leyes de propiedad intelectual.'
                    : 'The content, design and structure of this website are protected by copyright and other intellectual property laws.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '6. Modificaciones' : '6. Modifications'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.'
                    : 'We reserve the right to modify these terms at any time. Changes will take effect immediately after publication.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '7. Contacto' : '7. Contact'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Para preguntas sobre estos términos de uso, contacta con nosotros en: info@escuelasdecocina.com'
                    : 'For questions about these terms of use, contact us at: info@escuelasdecocina.com'
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

export default TermsOfUse;