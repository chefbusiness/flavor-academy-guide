
import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Filters } from '@/components/Filters';
import { SchoolCard } from '@/components/SchoolCard';
import { SEOHead } from '@/components/SEOHead';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStructuredData } from '@/hooks/useStructuredData';
import { School, SchoolFilters } from '@/types/school';
import { schools } from '@/data/schools';

const IndexContent = () => {
  const { language, t } = useLanguage();
  const { generateOrganizationSchema, generateWebsiteSchema } = useStructuredData();
  
  const [filters, setFilters] = useState<SchoolFilters>({
    country: '',
    type: '',
    specialty: '',
    search: ''
  });

  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      const matchesCountry = !filters.country || school.country === filters.country;
      const matchesType = !filters.type || school.type === filters.type;
      const matchesSpecialty = !filters.specialty || school.specialties.includes(filters.specialty);
      const matchesSearch = !filters.search || 
        school.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        school.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        school.country.toLowerCase().includes(filters.search.toLowerCase()) ||
        school.description.toLowerCase().includes(filters.search.toLowerCase());

      return matchesCountry && matchesType && matchesSpecialty && matchesSearch;
    });
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate comprehensive SEO data
  const seoTitle = language === 'es' 
    ? 'Directorio Global de Escuelas de Cocina - Encuentra la Mejor Escuela Culinaria 2024'
    : 'Global Culinary Schools Directory - Find the Best Culinary School 2024';
    
  const seoDescription = language === 'es'
    ? `Descubre las mejores escuelas de cocina, universidades gastronómicas e institutos de hospitalidad del mundo. Más de ${schools.length} instituciones culinarias en España, México, Italia, Francia y más países. Encuentra tu escuela ideal.`
    : `Discover the world's best culinary schools, gastronomic universities and hospitality institutes. Over ${schools.length} culinary institutions in Spain, Mexico, Italy, France and more countries. Find your ideal school.`;

  const seoKeywords = language === 'es'
    ? 'escuelas de cocina, universidades gastronómicas, institutos culinarios, formación culinaria, chef profesional, gastronomía, hospitalidad, escuelas cocina España, escuelas cocina México, escuelas cocina Italia, escuelas cocina Francia, directorio gastronómico'
    : 'culinary schools, gastronomic universities, culinary institutes, culinary training, professional chef, gastronomy, hospitality, culinary schools Spain, culinary schools Mexico, culinary schools Italy, culinary schools France, gastronomic directory';

  // Multiple structured data schemas
  const combinedStructuredData = [
    generateOrganizationSchema,
    generateWebsiteSchema,
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": seoTitle,
      "description": seoDescription,
      "numberOfItems": schools.length,
      "itemListElement": schools.slice(0, 20).map((school, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "EducationalOrganization",
          "name": school.name,
          "description": school.description,
          "url": `https://escuelasdecocina.com/${language === 'es' ? 'escuela' : 'school'}/${school.id}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": school.city,
            "@country": t(school.country)
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": school.rating,
            "bestRating": "5"
          }
        }
      }))
    }
  ];

  // Alternate language URLs
  const alternateUrls = [
    { lang: 'es', url: 'https://escuelasdecocina.com/' },
    { lang: 'en', url: 'https://escuelasdecocina.com/' }
  ];

  // Additional meta tags for enhanced SEO
  const additionalMeta = [
    { name: 'application-name', content: 'Directorio Global de Escuelas de Cocina' },
    { name: 'apple-mobile-web-app-title', content: 'Escuelas de Cocina' },
    { name: 'msapplication-TileColor', content: '#0EA5E9' },
    { name: 'category', content: 'Education' },
    { name: 'coverage', content: 'Worldwide' },
    { name: 'distribution', content: 'Global' },
    { name: 'rating', content: 'General' },
    { name: 'revisit-after', content: '7 days' },
    { property: 'business:contact_data:locality', content: 'Global' },
    { property: 'business:contact_data:country_name', content: 'International' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url="/"
        type="website"
        structuredData={combinedStructuredData}
        alternateUrls={alternateUrls}
        locale={language === 'es' ? 'es_ES' : 'en_US'}
        siteName="Directorio Global de Escuelas de Cocina"
        additionalMeta={additionalMeta}
        twitterCard="summary_large_image"
      />
      
      <Header />
      
      <Hero onSearch={handleSearch} />
      
      <section id="directory" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* SEO-optimized section heading */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'es' 
                  ? `Descubre ${schools.length}+ Escuelas de Cocina Worldwide`
                  : `Discover ${schools.length}+ Culinary Schools Worldwide`
                }
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                {language === 'es'
                  ? 'Explora nuestra completa base de datos de instituciones culinarias, desde prestigiosas universidades gastronómicas hasta academias especializadas en todo el mundo.'
                  : 'Explore our comprehensive database of culinary institutions, from prestigious gastronomic universities to specialized academies worldwide.'
                }
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <Filters 
                filters={filters}
                onFiltersChange={setFilters}
                resultsCount={filteredSchools.length}
              />
            </div>

            {/* Schools Grid */}
            {filteredSchools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSchools.map((school) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-muted-foreground">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {language === 'es' ? 'No se encontraron resultados' : 'No results found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'es'
                      ? 'Intenta ajustar los filtros o buscar con términos diferentes.'
                      : 'Try adjusting the filters or searching with different terms.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
