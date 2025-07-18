
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Mail, Globe } from 'lucide-react';

export const Footer = () => {
  const { language } = useLanguage();

  const projectLinks = [
    {
      name: 'AI Chef.Pro',
      url: 'https://aichef.pro',
      description: language === 'es' ? 'Inteligencia Artificial Culinaria' : 'Culinary Artificial Intelligence'
    },
    {
      name: 'GastroSEO.com',
      url: 'https://gastroseo.com',
      description: language === 'es' ? 'Marketing Digital Gastronómico' : 'Gastronomic Digital Marketing'
    },
    {
      name: 'ChefBusiness.co',
      url: 'https://chefbusiness.co',
      description: language === 'es' ? 'Consultoría de Negocios Culinarios' : 'Culinary Business Consulting'
    },
    {
      name: 'IngredientsIndex.pro',
      url: 'https://ingredientsindex.pro',
      description: language === 'es' ? 'Diccionario de Ingredientes' : 'Ingredients Dictionary'
    }
  ];

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Primera columna - Información principal */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-accent">
              {language === 'es' ? 'Directorio Global de Escuelas de Cocina' : 'Global Culinary Schools Directory'}
            </h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              {language === 'es'
                ? 'La herramienta profesional para encontrar las mejores escuelas de cocina del mundo. Conectamos aspirantes a chef con instituciones de excelencia culinaria.'
                : 'The professional tool to find the world\'s best culinary schools. We connect aspiring chefs with culinary excellence institutions.'
              }
            </p>
            <div className="text-xs text-gray-400 mt-6">
              <p className="mb-1">
                {language === 'es' ? 'Una idea original del' : 'An original idea by'}
              </p>
              <p className="font-semibold text-accent">Chef John Guerrero</p>
            </div>
          </div>

          {/* Segunda columna - Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">
              {language === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Inicio' : 'Home'}
                </a>
              </li>
              <li>
                <a href="#directory" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Directorio' : 'Directory'}
                </a>
              </li>
              <li>
                <a href={language === 'es' ? '/sobre-nosotros' : '/about-us'} className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
                </a>
              </li>
              <li>
                <a href={language === 'es' ? '/contacto' : '/contact'} className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Contacto' : 'Contact'}
                </a>
              </li>
            </ul>
          </div>

          {/* Tercera columna - Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">
              {language === 'es' ? 'Legal' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={language === 'es' ? '/politica-privacidad' : '/privacy-policy'} className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href={language === 'es' ? '/politica-cookies' : '/cookies-policy'} className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Política de Cookies' : 'Cookies Policy'}
                </a>
              </li>
              <li>
                <a href={language === 'es' ? '/terminos-uso' : '/terms-of-use'} className="text-gray-300 hover:text-white transition-colors">
                  {language === 'es' ? 'Términos de Uso' : 'Terms of Use'}
                </a>
              </li>
            </ul>
          </div>

          {/* Cuarta columna - Nuestros Aliados */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">
              {language === 'es' ? 'Nuestros Aliados' : 'Our Partners'}
            </h4>
            <ul className="space-y-3 text-sm">
              {projectLinks.map((project) => (
                <li key={project.name}>
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300">
                        {project.description}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © 2024 {language === 'es' ? 'Directorio Global de Escuelas de Cocina' : 'Global Culinary Schools Directory'}. 
              {language === 'es' ? ' Todos los derechos reservados.' : ' All rights reserved.'}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a 
                href="mailto:info@escuelasdecocina.com"
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>info@escuelasdecocina.com</span>
              </a>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>escuelasdecocina.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
