import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Filters } from '@/components/Filters';
import { SchoolCard } from '@/components/SchoolCard';
import { SchoolModal } from '@/components/SchoolModal';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { School, SchoolFilters } from '@/types/school';
import { schools } from '@/data/schools';

const Index = () => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleViewDetails = (school: School) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <Hero onSearch={handleSearch} />
        
        <section id="directory" className="py-16">
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
                      onViewDetails={handleViewDetails}
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

        {/* School Details Modal */}
        <SchoolModal
          school={selectedSchool}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </LanguageProvider>
  );
};

export default Index;
