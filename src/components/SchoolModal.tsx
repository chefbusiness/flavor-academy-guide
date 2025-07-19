import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen, 
  Star, 
  ExternalLink, 
  Mail, 
  Phone,
  Award,
  Globe,
  DollarSign
} from 'lucide-react';
import { School } from '@/types/school';
import { useLanguage } from '@/contexts/LanguageContext';

interface SchoolModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolModal = ({ school, isOpen, onClose }: SchoolModalProps) => {
  const { t, language } = useLanguage();

  if (!school) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">
            {school.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Image and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg h-64 bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={school.image} 
                  alt={school.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1556909114-${school.id.padStart(8, '0')}?w=600&h=400&fit=crop&auto=format`;
                  }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-primary">
                    {t(school.type)}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4 flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-medium">{school.rating}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {school.description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Basic Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-card rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{formatNumber(school.studentsCount)}</div>
                  <div className="text-sm text-muted-foreground">{t('students')}</div>
                </div>
                
                <div className="bg-gradient-card rounded-lg p-4 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{school.programsCount}</div>
                  <div className="text-sm text-muted-foreground">{t('programs')}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Información de Contacto</h4>
                
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{school.address}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{t('founded')} {school.founded}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <a href={`mailto:${school.email}`} className="text-primary hover:underline">
                    {school.email}
                  </a>
                </div>

                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <a href={`tel:${school.phone}`} className="text-primary hover:underline">
                    {school.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              {language === 'en' ? 'Specialties' : 'Especialidades'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(language === 'en' && school.specialties_en ? school.specialties_en : school.specialties).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Idiomas de Instrucción</h4>
            <div className="flex flex-wrap gap-2">
              {school.languages.map((language) => (
                <Badge key={language} variant="secondary" className="text-sm">
                  <Globe className="w-3 h-3 mr-1" />
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tuition */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Rango de Matrícula</h4>
            <div className="flex items-center space-x-2 text-lg">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">
                {formatCurrency(school.tuitionRange.min, school.tuitionRange.currency)} - {formatCurrency(school.tuitionRange.max, school.tuitionRange.currency)}
              </span>
              <span className="text-sm text-muted-foreground">por año</span>
            </div>
          </div>

          {/* Accreditation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              {language === 'en' ? 'Accreditations' : 'Acreditaciones'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(language === 'en' && school.accreditation_en ? school.accreditation_en : school.accreditation).map((accred) => (
                <Badge key={accred} variant="outline" className="text-sm">
                  <Award className="w-3 h-3 mr-1" />
                  {accred}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              {language === 'en' ? 'Featured Characteristics' : 'Características Destacadas'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(language === 'en' && school.features_en ? school.features_en : school.features).map((feature) => (
                <div key={feature} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button 
              onClick={() => window.open(school.website, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visitar Sitio Web
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(`mailto:${school.email}`)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contactar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};