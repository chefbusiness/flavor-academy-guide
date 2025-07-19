
import React from 'react';
import { MapPin, Train, Car, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { School } from '@/types/school';

interface LocationInfoProps {
  school: School;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({ school }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Dirección */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm mb-1">
              {t('address')}:
            </p>
            <p className="text-sm text-gray-700">{school.address}</p>
            <p className="text-sm text-gray-700">{school.city}, {t(school.country)}</p>
          </div>
        </div>
      </div>

      {/* Información de transporte */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Train className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm mb-1">
              {t('publicTransport')}
            </h4>
            <p className="text-sm text-gray-600">
              {t('publicTransportInfo')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Car className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm mb-1">
              {t('privateVehicle')}
            </h4>
            <p className="text-sm text-gray-600">
              {t('privateVehicleInfo')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Navigation className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm mb-1">
              {t('additionalInfo')}
            </h4>
            <p className="text-sm text-gray-600">
              {t('additionalInfoText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
