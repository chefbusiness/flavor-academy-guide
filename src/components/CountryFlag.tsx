
import React from 'react';
import { getCountryISO } from '@/utils/countryMapping';

interface CountryFlagProps {
  country: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ 
  country, 
  size = 'sm', 
  className = '' 
}) => {
  const isoCode = getCountryISO(country);
  
  const sizeClasses = {
    sm: 'w-8 h-6', // 32x24px - Aumentado para mejor visibilidad
    md: 'w-10 h-7', // 40x28px  
    lg: 'w-12 h-8' // 48x32px
  };

  // Using Unicode flag emojis as fallback for better compatibility
  const getFlagEmoji = (iso: string): string => {
    const codePoints = iso
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        bg-white/90 backdrop-blur-sm rounded-md border border-white/20 
        flex items-center justify-center text-sm font-medium shadow-sm
        ${className}
      `}
      title={`${country} flag`}
    >
      <span className="leading-none text-lg">
        {getFlagEmoji(isoCode)}
      </span>
    </div>
  );
};
