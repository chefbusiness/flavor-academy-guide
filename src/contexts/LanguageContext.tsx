
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
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    adminPanel: 'Panel Admin',
    
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
    
    // School Card & Details
    viewDetails: 'Ver Detalles',
    location: 'Ubicación',
    founded: 'Fundada en',
    students: 'estudiantes',
    programs: 'programas',
    loading: 'Cargando',
    
    // School Detail Page
    locationAndAccess: 'Ubicación y Acceso',
    locationMap: 'Mapa de Ubicación',
    howToGetThere: 'Cómo Llegar',
    address: 'Dirección',
    publicTransport: 'Transporte Público',
    publicTransportInfo: 'Accesible mediante metro, autobús y tranvía. Estaciones cercanas a 5-10 minutos a pie.',
    privateVehicle: 'En Vehículo Privado',
    privateVehicleInfo: 'Parking disponible en las cercanías. Fácil acceso desde las principales vías de la ciudad.',
    additionalInfo: 'Información Adicional',
    additionalInfoText: 'Centro accesible para personas con movilidad reducida. Zona segura y bien iluminada.',
    
    // Programs & Features
    featuredPrograms: 'Programas Destacados',
    certifiedProgram: 'Programa certificado',
    specialties: 'Especialidades',
    instructionLanguages: 'Idiomas de Instrucción',
    tuitionRange: 'Rango de Matrícula',
    perYear: 'por año',
    accreditations: 'Acreditaciones',
    featuredCharacteristics: 'Características Destacadas',
    
    // Testimonials
    communityReviews: 'Opiniones de la Comunidad',
    reviews: 'reseñas',
    
    // Sample Programs
    gastronomyDegree: 'Grado en Gastronomía',
    culinaryInnovationMaster: 'Máster en Innovación Culinaria',
    basqueSpecialization: 'Especialización en Cocina Vasca',
    culinaryDesign: 'Diseño Culinario',
    artAndGastronomy: 'Arte y Gastronomía',
    advancedPastry: 'Técnicas Avanzadas de Pastelería',
    traditionalMexican: 'Cocina Tradicional Mexicana',
    vanguardTechniques: 'Técnicas de Vanguardia',
    restaurantManagement: 'Gestión de Restaurantes',
    authenticItalian: 'Cocina Italiana Auténtica',
    professionalPasta: 'Pasta y Risotto Profesional',
    wineAndPairing: 'Enología y Maridaje',
    classicFrench: 'Cocina Francesa Clásica',
    hotelManagementCourse: 'Gestión Hotelera',
    gastronomicEntrepreneurship: 'Emprendimiento Gastronómico',
    grandDiplome: 'Grand Diplôme',
    advancedPatisserie: 'Pâtisserie Avancée',
    professionalCuisine: 'Cuisine Professionnelle',
    
    // Action Buttons
    visitOfficialWebsite: 'Visitar Sitio Web Oficial',
    contactDirectly: 'Contactar Directamente',
    
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
    
    // Languages
    spanish: 'Español',
    english: 'Inglés',
    french: 'Francés',
    italian: 'Italiano',
    basque: 'Euskera',
    catalan: 'Catalán',
    
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
    login: 'Sign In',
    logout: 'Sign Out',
    adminPanel: 'Admin Panel',
    
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
    
    // School Card & Details
    viewDetails: 'View Details',
    location: 'Location',
    founded: 'Founded in',
    students: 'students',
    programs: 'programs',
    loading: 'Loading',
    
    // School Detail Page
    locationAndAccess: 'Location & Access',
    locationMap: 'Location Map',
    howToGetThere: 'How to Get There',
    address: 'Address',
    publicTransport: 'Public Transport',
    publicTransportInfo: 'Accessible by metro, bus and tram. Nearby stations 5-10 minutes walk.',
    privateVehicle: 'By Private Vehicle',
    privateVehicleInfo: 'Parking available nearby. Easy access from main city roads.',
    additionalInfo: 'Additional Information',
    additionalInfoText: 'Center accessible for people with reduced mobility. Safe and well-lit area.',
    
    // Programs & Features
    featuredPrograms: 'Featured Programs',
    certifiedProgram: 'Certified program',
    specialties: 'Specialties',
    instructionLanguages: 'Languages of Instruction',
    tuitionRange: 'Tuition Range',
    perYear: 'per year',
    accreditations: 'Accreditations',
    featuredCharacteristics: 'Featured Characteristics',
    
    // Testimonials
    communityReviews: 'Community Reviews',
    reviews: 'reviews',
    
    // Sample Programs
    gastronomyDegree: 'Gastronomy Degree',
    culinaryInnovationMaster: 'Master in Culinary Innovation',
    basqueSpecialization: 'Basque Cuisine Specialization',
    culinaryDesign: 'Culinary Design',
    artAndGastronomy: 'Art and Gastronomy',
    advancedPastry: 'Advanced Pastry Techniques',
    traditionalMexican: 'Traditional Mexican Cuisine',
    vanguardTechniques: 'Vanguard Techniques',
    restaurantManagement: 'Restaurant Management',
    authenticItalian: 'Authentic Italian Cuisine',
    professionalPasta: 'Professional Pasta and Risotto',
    wineAndPairing: 'Wine and Pairing',
    classicFrench: 'Classic French Cuisine',
    hotelManagementCourse: 'Hotel Management',
    gastronomicEntrepreneurship: 'Gastronomic Entrepreneurship',
    grandDiplome: 'Grand Diplôme',
    advancedPatisserie: 'Advanced Pâtisserie',
    professionalCuisine: 'Professional Cuisine',
    
    // Action Buttons
    visitOfficialWebsite: 'Visit Official Website',
    contactDirectly: 'Contact Directly',
    
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
    
    // Languages
    spanish: 'Spanish',
    english: 'English',
    french: 'French',
    italian: 'Italian',
    basque: 'Basque',
    catalan: 'Catalan',
    
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
