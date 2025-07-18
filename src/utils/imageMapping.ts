
// Import all school images as ES6 modules
import basqueCulinaryCenter from '@/assets/schools/basque-culinary-center.jpg';
import centroAmbrosía from '@/assets/schools/centro-culinario-ambrosia.jpg';
import institutPaulBocuse from '@/assets/schools/institut-paul-bocuse.jpg';
import leCordonBleuParis from '@/assets/schools/le-cordon-bleu-paris.jpg';
import almaColorno from '@/assets/schools/alma-colorno.jpg';
import iedMadrid from '@/assets/schools/ied-madrid.jpg';
// Basque schools
import onEginAcademia from '@/assets/schools/on-egin-academia.jpg';
import haztenEtaJolasten from '@/assets/schools/hazten-eta-jolasten.jpg';
import aingeruEtxebarria from '@/assets/schools/aingeru-etxebarria.jpg';
import gamarraHosteleria from '@/assets/schools/gamarra-hosteleria.jpg';
import egibideMendizorrotza from '@/assets/schools/egibide-mendizorrotza.jpg';
import sualai from '@/assets/schools/sualai.jpg';
import koilaraGastronomia from '@/assets/schools/koilara-gastronomia.jpg';
import eshbiRibera from '@/assets/schools/eshbi-ribera.jpg';

// Mapping of school IDs to their corresponding images - using correct numeric IDs
export const schoolImageMapping: Record<string, string> = {
  '1': basqueCulinaryCenter,     // Basque Culinary Center
  '2': iedMadrid,                // Instituto Europeo di Design - Madrid
  '3': centroAmbrosía,           // Centro Culinario Ambrosía
  '4': almaColorno,              // ALMA - La Scuola Internazionale di Cucina Italiana
  '5': institutPaulBocuse,       // Institut Paul Bocuse
  '6': leCordonBleuParis,        // Le Cordon Bleu Paris
  // Basque schools
  '10': onEginAcademia,          // On - Egin Academia De Cocina
  '11': haztenEtaJolasten,       // Hazten eta Jolasten
  '12': aingeruEtxebarria,       // Escuela de Cocina Aingeru Etxebarria
  '13': gamarraHosteleria,       // Escuela de Hostelería de Gamarra
  '14': egibideMendizorrotza,    // Egibide - Mendizorrotza
  '15': sualai,                  // Sualai
  '16': koilaraGastronomia,      // Koilara Gastronomía
  '17': eshbiRibera,             // Escuela de cocina - ESHBI Ribera
};

// Function to get school image URL by ID
export const getSchoolImageUrl = (schoolId: string): string => {
  return schoolImageMapping[schoolId] || '';
};

// Function to get alt text for school images
export const getSchoolImageAltText = (schoolName: string): string => {
  return `${schoolName} - Culinary School Building`;
};
