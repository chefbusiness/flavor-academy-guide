// Import all school images as ES6 modules
import basqueCulinaryCenter from '@/assets/schools/basque-culinary-center.jpg';
import centroAmbrosía from '@/assets/schools/centro-culinario-ambrosia.jpg';
import institutPaulBocuse from '@/assets/schools/institut-paul-bocuse.jpg';
import leCordonBleuParis from '@/assets/schools/le-cordon-bleu-paris.jpg';
import almaColorno from '@/assets/schools/alma-colorno.jpg';
import iedMadrid from '@/assets/schools/ied-madrid.jpg';

// Mapping of school IDs to their corresponding images
export const schoolImageMapping: Record<string, string> = {
  'basque-culinary-center': basqueCulinaryCenter,
  'centro-culinario-ambrosia': centroAmbrosía,
  'institut-paul-bocuse': institutPaulBocuse,
  'le-cordon-bleu-paris': leCordonBleuParis,
  'alma-colorno': almaColorno,
  'ied-madrid': iedMadrid,
};

// Function to get school image URL by ID
export const getSchoolImageUrl = (schoolId: string): string => {
  return schoolImageMapping[schoolId] || '';
};

// Function to get alt text for school images
export const getSchoolImageAltText = (schoolName: string): string => {
  return `${schoolName} - Culinary School Building`;
};