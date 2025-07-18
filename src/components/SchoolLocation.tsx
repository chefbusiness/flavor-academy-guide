
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Car, Train } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { School } from '@/types/school';

interface SchoolLocationProps {
  school: School;
}

export const SchoolLocation: React.FC<SchoolLocationProps> = ({ school }) => {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For now, we'll show a placeholder map
    // In a real implementation, you would integrate Google Maps API here
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Create a simple visual placeholder
      const mapElement = mapRef.current;
      mapElement.innerHTML = `
        <div class="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <div class="w-full h-full" style="background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23333" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');"></div>
          </div>
          <div class="text-center z-10">
            <div class="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-700">${school.name}</p>
            <p class="text-xs text-gray-500">${school.city}, ${school.country}</p>
          </div>
        </div>
      `;
    };

    initMap();
  }, [school]);

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-primary" />
        {language === 'es' ? 'Ubicación y Acceso' : 'Location & Access'}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'es' ? 'Mapa de Ubicación' : 'Location Map'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="w-full"></div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                <strong>{language === 'es' ? 'Dirección:' : 'Address:'}</strong>
              </p>
              <p className="text-sm">{school.address}</p>
              <p className="text-sm">{school.city}, {school.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Transportation & Access Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'es' ? 'Cómo Llegar' : 'How to Get There'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Train className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">
                  {language === 'es' ? 'Transporte Público' : 'Public Transport'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'es' 
                    ? 'Accesible mediante metro, autobús y tranvía. Estaciones cercanas a 5-10 minutos a pie.'
                    : 'Accessible by metro, bus and tram. Nearby stations 5-10 minutes walk.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Car className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">
                  {language === 'es' ? 'En Vehículo Privado' : 'By Private Vehicle'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'es' 
                    ? 'Parking disponible en las cercanías. Fácil acceso desde las principales vías de la ciudad.'
                    : 'Parking available nearby. Easy access from main city roads.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Navigation className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">
                  {language === 'es' ? 'Información Adicional' : 'Additional Information'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'es' 
                    ? 'Centro accesible para personas con movilidad reducida. Zona segura y bien iluminada.'
                    : 'Center accessible for people with reduced mobility. Safe and well-lit area.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
