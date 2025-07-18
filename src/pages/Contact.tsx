import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactContent = () => {
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
    { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
    { label: language === 'es' ? 'Contacto' : 'Contact' }
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

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          <section className="mt-4">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gradient mb-6">
                {language === 'es' ? 'Contacto' : 'Contact Us'}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {language === 'es' 
                  ? 'Ponte en contacto con nosotros para cualquier consulta sobre nuestro directorio de escuelas de cocina. Estamos aquí para ayudarte a encontrar la institución culinaria perfecta para tu formación.'
                  : 'Get in touch with us for any inquiries about our culinary schools directory. We are here to help you find the perfect culinary institution for your education.'
                }
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-card rounded-lg p-6 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6">
                  {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{language === 'es' ? 'Dirección' : 'Address'}</p>
                      <p className="text-muted-foreground text-sm">Madrid, España</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{language === 'es' ? 'Email' : 'Email'}</p>
                      <a href="mailto:info@escuelasdecocina.com" className="text-primary hover:underline text-sm">
                        info@escuelasdecocina.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{language === 'es' ? 'Teléfono' : 'Phone'}</p>
                      <a href="tel:+34744717942" className="text-primary hover:underline text-sm">
                        +34 744 717 942
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-card rounded-lg p-6 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6">
                  {language === 'es' ? 'Envíanos un Mensaje' : 'Send Us a Message'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {language === 'es' ? 'Nombre' : 'Name'}
                    </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                    required
                  />
                </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {language === 'es' ? 'Email' : 'Email'}
                    </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                    required
                  />
                </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {language === 'es' ? 'Mensaje' : 'Message'}
                    </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder={language === 'es' ? 'Tu mensaje aquí...' : 'Your message here...'}
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
                        : (language === 'es' ? 'Enviar Mensaje' : 'Send Message')
                      }
                  </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Contact = () => {
  return (
    <LanguageProvider>
      <ContactContent />
    </LanguageProvider>
  );
};

export default Contact;
