
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Car, Train } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { School } from '@/types/school';
import { supabase } from '@/integrations/supabase/client';

interface SchoolLocationProps {
  school: School;
}

export const SchoolLocation: React.FC<SchoolLocationProps> = ({ school }) => {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
      
      try {
        console.log('🗺️ Iniciando carga del mapa de Google Maps...');
        
        // Get the Google Maps API key from Supabase secrets
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GOOGLE_MAPS_API_KEY' }
        });

        console.log('🔑 Respuesta del edge function:', { data, error });

        if (error) {
          console.error('❌ Error al obtener la API key:', error);
          throw new Error('Error al obtener la API key de Google Maps');
        }

        if (!data?.GOOGLE_MAPS_API_KEY) {
          console.error('❌ API key no encontrada en la respuesta:', data);
          throw new Error('Google Maps API key not found');
        }

        console.log('✅ API key obtenida correctamente');

        // Load Google Maps API if not already loaded
        if (!window.google) {
          console.log('📦 Cargando API de Google Maps...');
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log('✅ API de Google Maps cargada correctamente');
              resolve();
            };
            script.onerror = (error) => {
              console.error('❌ Error al cargar API de Google Maps:', error);
              reject(error);
            };
            document.head.appendChild(script);
          });
        } else {
          console.log('✅ API de Google Maps ya estaba cargada');
        }

        // Geocode the school address to get coordinates
        console.log('🔍 Geocodificando dirección:', `${school.address}, ${school.city}, ${school.country}`);
        const geocoder = new (window.google as any).maps.Geocoder();
        const address = `${school.address}, ${school.city}, ${school.country}`;
        
        geocoder.geocode({ address }, (results: any[], status: string) => {
          console.log('📍 Resultado de geocodificación:', { status, results, resultsLength: results?.length });
          
          if (status === 'OK' && results && results.length > 0) {
            const location = results[0].geometry.location;
            console.log('✅ Coordenadas encontradas:', location.lat(), location.lng());
            
            // Create the map
            const map = new (window.google as any).maps.Map(mapRef.current!, {
              zoom: 15,
              center: location,
              mapTypeId: 'roadmap',
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'on' }]
                }
              ]
            });

            // Add a marker for the school
            const marker = new (window.google as any).maps.Marker({
              position: location,
              map: map,
              title: school.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                    <path fill="#ef4444" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                `),
                scaledSize: new (window.google as any).maps.Size(32, 32)
              }
            });

            // Add info window
            const infoWindow = new (window.google as any).maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-semibold text-sm">${school.name}</h3>
                  <p class="text-xs text-gray-600">${school.address}</p>
                  <p class="text-xs text-gray-600">${school.city}, ${school.country}</p>
                </div>
              `
            });

            // Show info window when marker is clicked
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            console.log('✅ Mapa creado exitosamente');

          } else {
            console.error('❌ Error en geocodificación:', status);
            throw new Error('Geocoding failed: ' + status);
          }
        });

      } catch (error) {
        console.error('❌ Error general al cargar Google Maps:', error);
        // Fallback to placeholder map
        const mapElement = mapRef.current;
        if (mapElement) {
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
                <p class="text-xs text-red-500 mt-1">Error cargando mapa: ${error.message}</p>
              </div>
            </div>
          `;
        }
      }
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
