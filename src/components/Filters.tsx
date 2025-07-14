import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { SchoolFilters } from '@/types/school';
import { useLanguage } from '@/contexts/LanguageContext';
import { countries, types, specialties } from '@/data/schools';

interface FiltersProps {
  filters: SchoolFilters;
  onFiltersChange: (filters: SchoolFilters) => void;
  resultsCount: number;
}

export const Filters = ({ filters, onFiltersChange, resultsCount }: FiltersProps) => {
  const { t } = useLanguage();

  const updateFilter = (key: keyof SchoolFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const clearFilter = (key: keyof SchoolFilters) => {
    updateFilter(key, '');
  };

  const clearAllFilters = () => {
    onFiltersChange({
      country: '',
      type: '',
      specialty: '',
      search: ''
    });
  };

  const activeFiltersCount = [filters.country, filters.type, filters.specialty].filter(Boolean).length;

  return (
    <div className="bg-card border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Country Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('filterByCountry')}
          </label>
          <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('allCountries')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCountries')}</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {t(country)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('filterByType')}
          </label>
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialty Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('filterBySpecialty')}
          </label>
          <Select value={filters.specialty} onValueChange={(value) => updateFilter('specialty', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('allSpecialties')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allSpecialties')}</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {t(specialty)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Filtros activos:</div>
          <div className="flex flex-wrap gap-2">
            {filters.country && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>{t(filters.country)}</span>
                <button onClick={() => clearFilter('country')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>{t(filters.type)}</span>
                <button onClick={() => clearFilter('type')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.specialty && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>{t(filters.specialty)}</span>
                <button onClick={() => clearFilter('specialty')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-primary">{resultsCount}</span> resultados
        </p>
      </div>
    </div>
  );
};