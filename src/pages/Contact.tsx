import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const { t, language } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems = [
    { label: t('home'), href: '/' },
    { label: t('contact') }
  ];

  const seoTitle = language === 'es' ? 'Contacto - Escuelas de Cocina' : 'Contact - Culinary Schools';
  const seoDescription = language === 'es' ? 'Página de contacto de Escuelas de Cocina' : 'Contact page of Culinary Schools';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="contacto, escuelas de cocina, culinary schools"
        url="/contacto"
        type="website"
        locale={language === 'es' ? 'es_ES' : 'en_US'}
        siteName="Directorio Global de Escuelas de Cocina"
      />

      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          <section className="mt-8">
            <h1 className="text-3xl font-bold text-gradient mb-4">
              {t('contactUs')}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {t('contactDescription')}
            </p>

            <div className="bg-gradient-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('contactInformation')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <p className="text-muted-foreground">
                    {t('address')}: 123 Main Street, City, Country
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:info@escuelasdecocina.com" className="text-primary hover:underline">
                    info@escuelasdecocina.com
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:+15551234567" className="text-primary hover:underline">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('sendUsAMessage')}
              </h2>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={t('yourName')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={t('yourEmail')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={t('yourMessage')}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {t('sendMessage')}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
