
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, BookOpen, Star, ExternalLink } from 'lucide-react';
import { School } from '@/types/school';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateSlug } from '@/utils/slugUtils';
import { useNavigate } from 'react-router-dom';
import { useSchoolImageIntegration } from '@/hooks/useSchoolImageIntegration';
import { CountryFlag } from '@/components/CountryFlag';

interface SchoolCardProps {
  school: School;
  onViewDetails?: (school: School) => void;
}

export const SchoolCard = ({ school }: SchoolCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { imageSource, getFallbackImageSource, altText } = useSchoolImageIntegration(school);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const handleViewDetails = () => {
    const slug = generateSlug(school.name);
    const route = language === 'es' ? `/escuela/${slug}` : `/school/${slug}`;
    navigate(route);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallbackSources = getFallbackImageSource;
    
    // Find the next available fallback source
    const currentIndex = fallbackSources.indexOf(target.src);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < fallbackSources.length) {
      target.src = fallbackSources[nextIndex];
    } else {
      // Final fallback to Unsplash
      const unsplashId = parseInt(school.id).toString().padStart(8, '0');
      target.src = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=400&h=300&fit=crop&auto=format`;
    }
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 gradient-card border-0 h-full">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-primary/20 to-accent/20">
          <img 
            src={imageSource}
            alt={altText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          
          {/* Country Flag - Top Left */}
          <div className="absolute top-3 left-3">
            <CountryFlag country={school.country} size="sm" />
          </div>
          
          {/* Type Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-primary h-6 px-2 text-xs">
              {t(school.type)}
            </Badge>
          </div>
          
          {/* Rating - Bottom Left */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 h-6 shadow-sm">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-xs font-medium">{school.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {school.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {school.description}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span>{school.city}, {t(school.country)}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span>{t('founded')} {school.founded}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>{formatNumber(school.studentsCount)} {t('students')}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 mr-2 text-primary" />
              <span>{school.programsCount} {t('programs')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {school.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">
              {t(specialty)}
            </Badge>
          ))}
          {school.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{school.specialties.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            {t('viewDetails')}
          </Button>
          <Button 
            size="icon"
            variant="outline"
            onClick={() => window.open(school.website, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
