import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems = [
    { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
    { label: language === 'es' ? 'Política de Privacidad' : 'Privacy Policy' }
  ];

  const currentUrl = `/${language === 'es' ? 'politica-privacidad' : 'privacy-policy'}`;
  const alternateUrls = [
    { lang: 'es', url: 'https://escuelasdecocina.com/politica-privacidad' },
    { lang: 'en', url: 'https://escuelasdecocina.com/privacy-policy' },
    { lang: 'x-default', url: 'https://escuelasdecocina.com/politica-privacidad' }
  ];

  const seoTitle = language === 'es'
    ? 'Política de Privacidad - Directorio de Escuelas de Cocina'
    : 'Privacy Policy - Culinary Schools Directory';

  const seoDescription = language === 'es'
    ? 'Política de privacidad del directorio de escuelas de cocina. Información sobre cómo protegemos y utilizamos tus datos personales.'
    : 'Privacy policy of the culinary schools directory. Information about how we protect and use your personal data.';

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
                {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'es' ? 'Última actualización: Enero 2024' : 'Last updated: January 2024'}
              </p>
            </header>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '1. Introducción' : '1. Introduction'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal cuando utilizas nuestro directorio de escuelas de cocina.'
                    : 'This Privacy Policy describes how we collect, use and protect your personal information when you use our culinary schools directory.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '2. Información que Recopilamos' : '2. Information We Collect'}
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    {language === 'es'
                      ? '• Información de contacto cuando nos envías un mensaje'
                      : '• Contact information when you send us a message'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Datos de navegación y cookies técnicas'
                      : '• Navigation data and technical cookies'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Información de uso del sitio web'
                      : '• Website usage information'
                    }
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '3. Cómo Utilizamos tu Información' : '3. How We Use Your Information'}
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    {language === 'es'
                      ? '• Para responder a tus consultas y solicitudes'
                      : '• To respond to your inquiries and requests'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Para mejorar nuestros servicios'
                      : '• To improve our services'
                    }
                  </li>
                  <li>
                    {language === 'es'
                      ? '• Para mantener la seguridad del sitio web'
                      : '• To maintain website security'
                    }
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '4. Protección de Datos' : '4. Data Protection'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso no autorizado, alteración, divulgación o destrucción.'
                    : 'We implement technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure or destruction.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '5. Tus Derechos' : '5. Your Rights'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Tienes derecho a acceder, rectificar, suprimir y limitar el tratamiento de tus datos personales. Para ejercer estos derechos, contacta con nosotros a través de nuestra página de contacto.'
                    : 'You have the right to access, rectify, delete and limit the processing of your personal data. To exercise these rights, contact us through our contact page.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === 'es' ? '6. Contacto' : '6. Contact'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'es'
                    ? 'Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en: info@escuelasdecocina.com'
                    : 'If you have questions about this Privacy Policy, you can contact us at: info@escuelasdecocina.com'
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

export default PrivacyPolicy;