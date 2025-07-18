import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simple validation
      if (!formData.name || !formData.email || !formData.message) {
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es' ? 'Por favor completa todos los campos' : 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: language === 'es' ? 'Mensaje enviado' : 'Message sent',
        description: language === 'es' ? 'Gracias por contactarnos. Te responderemos pronto.' : 'Thank you for contacting us. We will reply soon.',
      });
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' ? 'Hubo un error al enviar el mensaje' : 'There was an error sending the message',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={t('yourName')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={t('yourEmail')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={t('yourMessage')}
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting 
                      ? (language === 'es' ? 'Enviando...' : 'Sending...')
                      : t('sendMessage')
                    }
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
