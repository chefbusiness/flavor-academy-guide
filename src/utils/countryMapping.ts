
// Mapping from our internal country codes to ISO country codes for flags
export const countryToISO: Record<string, string> = {
  'spain': 'ES',
  'mexico': 'MX',
  'france': 'FR',
  'italy': 'IT',
  'usa': 'US',
  'united-states': 'US',
  'argentina': 'AR',
  'peru': 'PE',
  'colombia': 'CO',
  'chile': 'CL',
  'uk': 'GB',
  'united-kingdom': 'GB',
  'germany': 'DE',
  'japan': 'JP',
  'canada': 'CA',
  'australia': 'AU',
  'brazil': 'BR',
  'netherlands': 'NL',
  'belgium': 'BE',
  'switzerland': 'CH',
  'portugal': 'PT'
};

export const getCountryISO = (country: string): string => {
  return countryToISO[country.toLowerCase()] || 'ES'; // Default to Spain if not found
};
