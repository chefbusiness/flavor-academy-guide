
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStructuredData } from '@/hooks/useStructuredData';
import { Button } from '@/components/ui/button';
import { Mail, Globe, MessageCircle, Clock } from 'lucide-react';

const ContactContent = () => {
  const { language } = useLanguage();
  const { generateOrganizationSchema, generateBreadcrumbSchema } = useStructuredData();

  const seoTitle = language === 'es' 
    ? 'Contacto - Directorio Global de Escuelas de Cocina'
    : 'Contact - Global Culinary Schools Directory';
    
  const seoDescription = language === 'es'
    ? 'Contáctanos para sugerir escuelas, reportar información incorrecta o cualquier consulta sobre nuestro directorio de escuelas de cocina.'
    : 'Contact us to suggest schools, report incorrect information, or any questions about our culinary schools directory.';

  const breadcrumbItems = [
    { name: language === 'es' ? 'Inicio' : 'Home', url: 'https://escuelasdecocina.com/' },
    { name: language === 'es' ? 'Contacto' : 'Contact' }
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
        url={language === 'es' ? '/contacto' : '/contact'}
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
                {language === 'es' ? 'Contacto' : 'Contact'}
              </h1>
              <p className="text-xl text-white/90">
                {language === 'es'
                  ? 'Estamos aquí para ayudarte con cualquier consulta sobre nuestro directorio'
                  : 'We\'re here to help you with any questions about our directory'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Contact Info */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-8">
                    {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {language === 'es' ? 'Correo Electrónico' : 'Email'}
                        </h3>
                        <a 
                          href="mailto:info@escuelasdecocina.com"
                          className="text-primary hover:underline"
                        >
                          info@escuelasdecocina.com
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'es' 
                            ? 'Para consultas generales y sugerencias'
                            : 'For general inquiries and suggestions'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {language === 'es' ? 'Sitio Web' : 'Website'}
                        </h3>
                        <p className="text-primary">escuelasdecocina.com</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'es' 
                            ? 'Directorio global de escuelas de cocina'
                            : 'Global culinary schools directory'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {language === 'es' ? 'Tiempo de Respuesta' : 'Response Time'}
                        </h3>
                        <p className="text-muted-foreground">
                          {language === 'es' 
                            ? 'Respondemos en 24-48 horas'
                            : 'We respond within 24-48 hours'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Reasons */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-8">
                    {language === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help you?'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                          {language === 'es' ? 'Sugerir una Escuela' : 'Suggest a School'}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es'
                          ? '¿Conoces una excelente escuela de cocina que no esté en nuestro directorio?'
                          : 'Do you know an excellent culinary school that\'s not in our directory?'
                        }
                      </p>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                          {language === 'es' ? 'Reportar Información Incorrecta' : 'Report Incorrect Information'}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es'
                          ? 'Ayúdanos a mantener la información actualizada y precisa'
                          : 'Help us keep information updated and accurate'
                        }
                      </p>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                          {language === 'es' ? 'Colaboraciones' : 'Partnerships'}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es'
                          ? '¿Eres una institución educativa interesada en aparecer en nuestro directorio?'
                          : 'Are you an educational institution interested in being featured in our directory?'
                        }
                      </p>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                          {language === 'es' ? 'Soporte Técnico' : 'Technical Support'}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es'
                          ? '¿Experimentas problemas técnicos con el sitio web?'
                          : 'Are you experiencing technical issues with the website?'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-16 text-center p-8 bg-muted/30 rounded-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'es' ? '¿Listo para conectarte?' : 'Ready to connect?'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'es'
                    ? 'No dudes en contactarnos. Estamos aquí para ayudarte a encontrar la mejor formación culinaria.'
                    : 'Don\'t hesitate to contact us. We\'re here to help you find the best culinary training.'
                  }
                </p>
                <Button asChild size="lg">
                  <a href="mailto:info@escuelasdecocina.com">
                    <Mail className="mr-2 h-5 w-5" />
                    {language === 'es' ? 'Enviar Email' : 'Send Email'}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
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
