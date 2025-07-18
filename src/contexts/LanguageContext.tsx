
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    directory: 'Directorio',
    about: 'Sobre Nosotros',
    contact: 'Contacto',
    
    // Hero Section
    heroTitle: 'Directorio Global de Escuelas de Cocina',
    heroSubtitle: 'Descubre las mejores escuelas de cocina, universidades gastronómicas y institutos de hospitalidad del mundo',
    searchPlaceholder: 'Buscar escuelas, ciudades o países...',
    exploreButton: 'Explorar Escuelas',
    
    // Filters
    filterByCountry: 'Filtrar por país',
    filterByType: 'Tipo de institución',
    filterBySpecialty: 'Especialidad',
    allCountries: 'Todos los países',
    allTypes: 'Todos los tipos',
    allSpecialties: 'Todas las especialidades',
    
    // School Types
    university: 'Universidad',
    institute: 'Instituto',
    academy: 'Academia',
    college: 'Colegio',
    
    // Specialties
    culinaryArts: 'Artes Culinarias',
    hospitality: 'Hospitalidad',
    pastry: 'Pastelería',
    wineGastronomy: 'Enología y Gastronomía',
    hotelManagement: 'Gestión Hotelera',
    
    // School Card
    viewDetails: 'Ver Detalles',
    location: 'Ubicación',
    founded: 'Fundada en',
    students: 'estudiantes',
    programs: 'programas',
    
    // Countries
    spain: 'España',
    mexico: 'México',
    italy: 'Italia',
    france: 'Francia',
    usa: 'Estados Unidos',
    argentina: 'Argentina',
    
    // Cities
    madrid: 'Madrid',
    barcelona: 'Barcelona',
    mexico_city: 'Ciudad de México',
    rome: 'Roma',
    paris: 'París',
    
    // Stats
    totalSchools: 'escuelas registradas',
    countries: 'países',
    specialties: 'especialidades',

    // FAQ
    faqTitle: 'Preguntas Frecuentes',
    faqSubtitle: 'Resolvemos las dudas más comunes sobre nuestro directorio de escuelas de cocina',

    // CTA Section
    ctaTitle: '¿Listo para profesionalizar tu carrera culinaria?',
    ctaSubtitle: 'Accede a información detallada de las mejores escuelas de cocina del mundo',
    
    // Footer
    footerDescription: 'La herramienta profesional para encontrar las mejores escuelas de cocina del mundo',
    footerIdea: 'Una idea original del Chef John Guerrero',
    quickLinks: 'Enlaces Rápidos',
    legal: 'Legal',
    ourPartners: 'Nuestros Aliados',
    privacyPolicy: 'Política de Privacidad',
    cookiesPolicy: 'Política de Cookies',
    termsOfUse: 'Términos de Uso',
    allRightsReserved: 'Todos los derechos reservados'
  },
  en: {
    // Navigation
    home: 'Home',
    directory: 'Directory',
    about: 'About Us',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Global Culinary Schools Directory',
    heroSubtitle: 'Discover the best culinary schools, gastronomic universities and hospitality institutes worldwide',
    searchPlaceholder: 'Search schools, cities or countries...',
    exploreButton: 'Explore Schools',
    
    // Filters
    filterByCountry: 'Filter by country',
    filterByType: 'Institution type',
    filterBySpecialty: 'Specialty',
    allCountries: 'All countries',
    allTypes: 'All types',
    allSpecialties: 'All specialties',
    
    // School Types
    university: 'University',
    institute: 'Institute',
    academy: 'Academy',
    college: 'College',
    
    // Specialties
    culinaryArts: 'Culinary Arts',
    hospitality: 'Hospitality',
    pastry: 'Pastry',
    wineGastronomy: 'Wine & Gastronomy',
    hotelManagement: 'Hotel Management',
    
    // School Card
    viewDetails: 'View Details',
    location: 'Location',
    founded: 'Founded in',
    students: 'students',
    programs: 'programs',
    
    // Countries
    spain: 'Spain',
    mexico: 'Mexico',
    italy: 'Italy',
    france: 'France',
    usa: 'United States',
    argentina: 'Argentina',
    
    // Cities
    madrid: 'Madrid',
    barcelona: 'Barcelona',
    mexico_city: 'Mexico City',
    rome: 'Rome',
    paris: 'Paris',
    
    // Stats
    totalSchools: 'registered schools',
    countries: 'countries',
    specialties: 'specialties',

    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'We answer the most common questions about our culinary schools directory',

    // CTA Section
    ctaTitle: 'Ready to professionalize your culinary career?',
    ctaSubtitle: 'Access detailed information from the world\'s best culinary schools',
    
    // Footer
    footerDescription: 'The professional tool to find the world\'s best culinary schools',
    footerIdea: 'An original idea by Chef John Guerrero',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    ourPartners: 'Our Partners',
    privacyPolicy: 'Privacy Policy',
    cookiesPolicy: 'Cookies Policy',
    termsOfUse: 'Terms of Use',
    allRightsReserved: 'All rights reserved'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
