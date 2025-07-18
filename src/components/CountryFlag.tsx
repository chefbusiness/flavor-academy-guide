
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
    sm: 'w-6 h-4', // 24x16px
    md: 'w-8 h-5', // 32x20px  
    lg: 'w-10 h-7' // 40x28px
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
        bg-white/90 backdrop-blur-sm rounded-sm border border-white/20 
        flex items-center justify-center text-xs font-medium shadow-sm
        ${className}
      `}
      title={`${country} flag`}
    >
      <span className="leading-none">
        {getFlagEmoji(isoCode)}
      </span>
    </div>
  );
};
