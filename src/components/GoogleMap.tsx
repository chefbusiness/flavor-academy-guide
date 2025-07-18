
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { School } from '@/types/school';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapProps {
  school: School;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ school }) => {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(`🗺️ ${message}`);
    setDebugInfo(prev => [...prev, message]);
  };

  // Coordenadas predefinidas para las escuelas
  const getSchoolCoordinates = (schoolId: string) => {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      '1': { lat: 43.2627, lng: -2.9253 }, // Basque Culinary Center - Bilbao
      '2': { lat: 43.3038, lng: -1.9729 }, // Instituto Paul Bocuse - San Sebastián
      '3': { lat: 19.4326, lng: -99.1332 }, // Ciudad de México
      '4': { lat: 45.4642, lng: 9.1900 }, // Milán, Italia
      '5': { lat: 48.8566, lng: 2.3522 }, // París, Francia
      '6': { lat: 48.8566, lng: 2.3522 }, // Le Cordon Bleu París
    };
    
    return coordinates[schoolId] || null;
  };

  const createFallbackMap = (errorMessage: string) => {
    if (!mapRef.current) return;
    
    const coords = getSchoolCoordinates(school.id);
    const coordsText = coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Coordenadas no disponibles';
    
    mapRef.current.innerHTML = `
      <div class="w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">${school.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${school.address}</p>
        <p class="text-sm text-gray-600 mb-3">${school.city}, ${school.country}</p>
        <p class="text-xs text-gray-500 mb-2">${coordsText}</p>
        <p class="text-xs text-red-500">${errorMessage}</p>
        <a href="https://maps.google.com/?q=${encodeURIComponent(school.address + ', ' + school.city)}" 
           target="_blank" 
           class="mt-3 inline-flex items-center px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Ver en Google Maps
        </a>
      </div>
    `;
  };

  const initializeMap = async () => {
    if (!mapRef.current) return;
    
    setIsLoading(true);
    setError(null);
    addDebugInfo('Iniciando carga del mapa');

    try {
      // Paso 1: Obtener coordenadas predefinidas
      const predefinedCoords = getSchoolCoordinates(school.id);
      let coordinates = predefinedCoords;
      let addressUsed = '';

      if (predefinedCoords) {
        addDebugInfo(`Usando coordenadas predefinidas: ${predefinedCoords.lat}, ${predefinedCoords.lng}`);
        addressUsed = 'Coordenadas predefinidas';
      } else {
        addDebugInfo('No hay coordenadas predefinidas, intentando geocodificación');
      }

      // Paso 2: Obtener API key
      addDebugInfo('Obteniendo API key de Google Maps');
      const { data: apiKeyData, error: apiKeyError } = await supabase.functions.invoke('get-secret', {
        body: { name: 'GOOGLE_MAPS_API_KEY' }
      });

      if (apiKeyError || !apiKeyData?.GOOGLE_MAPS_API_KEY) {
        throw new Error('No se pudo obtener la API key de Google Maps');
      }

      addDebugInfo('API key obtenida correctamente');

      // Paso 3: Cargar Google Maps API
      if (!window.google) {
        addDebugInfo('Cargando API de Google Maps');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeyData.GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => {
            addDebugInfo('API de Google Maps cargada');
            resolve();
          };
          script.onerror = () => reject(new Error('Error al cargar Google Maps API'));
          document.head.appendChild(script);
        });
      }

      // Paso 4: Geocodificar si no tenemos coordenadas
      if (!coordinates) {
        addDebugInfo('Iniciando geocodificación');
        const geocoder = new (window.google as any).maps.Geocoder();
        
        const addressOptions = [
          `${school.address}, ${school.city}, ${school.country}`,
          `${school.city}, ${school.country}`,
          `${school.city}, España`,
          school.city
        ];

        for (const address of addressOptions) {
          try {
            const result = await new Promise<any>((resolve, reject) => {
              geocoder.geocode({ address }, (results: any[], status: string) => {
                if (status === 'OK' && results && results.length > 0) {
                  resolve(results[0]);
                } else {
                  reject(new Error(`Geocoding failed: ${status}`));
                }
              });
            });

            coordinates = result.geometry.location;
            addressUsed = address;
            addDebugInfo(`Geocodificación exitosa con: ${address}`);
            break;
          } catch (error) {
            addDebugInfo(`Falló geocodificación con: ${address}`);
            continue;
          }
        }

        if (!coordinates) {
          throw new Error('No se pudieron obtener coordenadas para esta escuela');
        }
      }

      // Paso 5: Crear el mapa
      addDebugInfo('Creando mapa');
      const mapOptions = {
        zoom: predefinedCoords ? 16 : (addressUsed.includes(school.address) ? 16 : 12),
        center: coordinates,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi.school',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      };

      const map = new (window.google as any).maps.Map(mapRef.current, mapOptions);

      // Paso 6: Añadir marcador
      const marker = new (window.google as any).maps.Marker({
        position: coordinates,
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

      // Paso 7: Info window
      const infoWindow = new (window.google as any).maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-sm mb-1">${school.name}</h3>
            <p class="text-xs text-gray-600 mb-1">${school.address}</p>
            <p class="text-xs text-gray-600 mb-2">${school.city}, ${school.country}</p>
            ${!predefinedCoords ? `<p class="text-xs text-orange-500">Ubicación basada en: ${addressUsed}</p>` : ''}
            <a href="https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.address + ', ' + school.city)}" 
               target="_blank" 
               class="text-xs text-blue-600 hover:underline">
              Cómo llegar
            </a>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      addDebugInfo('Mapa creado exitosamente');
      setIsLoading(false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      addDebugInfo(`Error: ${errorMessage}`);
      setError(errorMessage);
      createFallbackMap(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeMap();
  }, [school.id]);

  return (
    <div className="space-y-4">
      {/* Estado de carga */}
      {isLoading && (
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-gray-600">
              {language === 'es' ? 'Cargando mapa...' : 'Loading map...'}
            </span>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {language === 'es' 
              ? 'Error al cargar el mapa. Se muestra información básica de ubicación.' 
              : 'Error loading map. Basic location information is shown.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Contenedor del mapa */}
      <div 
        ref={mapRef} 
        className="w-full h-80 rounded-lg overflow-hidden border"
        style={{ minHeight: '320px' }}
      />

      {/* Botón de debug */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs"
        >
          {showDebug ? 'Ocultar' : 'Mostrar'} Debug
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={initializeMap}
          className="text-xs"
        >
          <MapPin className="w-3 h-3 mr-1" />
          Reintentar
        </Button>
      </div>

      {/* Panel de debug */}
      {showDebug && (
        <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono max-h-40 overflow-y-auto">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          {debugInfo.map((info, index) => (
            <div key={index} className="text-gray-700">{info}</div>
          ))}
        </div>
      )}
    </div>
  );
};
