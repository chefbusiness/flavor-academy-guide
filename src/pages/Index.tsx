
import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Filters } from '@/components/Filters';
import { SchoolCard } from '@/components/SchoolCard';
import { SEOHead } from '@/components/SEOHead';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { School, SchoolFilters } from '@/types/school';
import { schools } from '@/data/schools';

const IndexContent = () => {
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
    // Scroll to directory section
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Directorio Global de Escuelas de Cocina - Encuentra la Mejor Escuela Culinaria"
        description="Descubre las mejores escuelas de cocina, universidades gastronómicas e institutos de hospitalidad del mundo. Más de 200 instituciones culinarias en España, México, Italia, Francia y más países."
        keywords="escuelas de cocina, universidades gastronómicas, institutos culinarios, formación culinaria, chef profesional, gastronomía, hospitalidad"
        url="/"
      />
      
      <Header />
      
      <Hero onSearch={handleSearch} />
      
      <section id="directory" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
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
                    No se encontraron resultados
                  </h3>
                  <p className="text-muted-foreground">
                    Intenta ajustar los filtros o buscar con términos diferentes.
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
