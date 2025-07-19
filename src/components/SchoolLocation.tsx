
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { School } from '@/types/school';
import { GoogleMap } from './GoogleMap';
import { LocationInfo } from './LocationInfo';

interface SchoolLocationProps {
  school: School;
}

export const SchoolLocation: React.FC<SchoolLocationProps> = ({ school }) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-primary" />
        {t('locationAndAccess')}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('locationMap')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMap school={school} />
          </CardContent>
        </Card>

        {/* Información de ubicación y transporte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('howToGetThere')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationInfo school={school} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
