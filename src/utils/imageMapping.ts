
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
// New Basque schools
import hosteleriaLeioa from '@/assets/schools/hosteleria-de-leioa.jpg';
import escuelaBilbaoLaratz from '@/assets/schools/escuela-de-cocina-bilbao-laratz.jpg';
import farmacook from '@/assets/schools/farmacook.jpg';
import keicook from '@/assets/schools/keicook.jpg';
import escuelaHosteleriaBilbao from '@/assets/schools/escuela-superior-de-hosteleria-bilbao.jpg';
import aulaGastronomicaRibera from '@/assets/schools/aula-gastronomica-mercado-de-la-ribera.jpg';
import escuelaMalaespera from '@/assets/schools/escuela-de-cocina-malaespera.jpg';
import sukaldikas from '@/assets/schools/sukaldikas-escuela-de-cocina-macrobiotica.jpg';
import bscFormacion from '@/assets/schools/bsc-formacion.jpg';
// New schools added recently
import enekoSukaldari from '@/assets/schools/eneko-sukaldari.jpg';
import kitxen from '@/assets/schools/kitxen.jpg';
import mimoBiteTheExperience from '@/assets/schools/mimo-bite-the-experience.jpg';
import fleischmannsCookingGroup from '@/assets/schools/fleischmanns-cooking-group.jpg';
import osoaSukaldaritza from '@/assets/schools/osoa-sukaldaritza.jpg';
import gastronomiaBilbao from '@/assets/schools/gastronomia-bilbao.jpg';
import goeGastronomyOpenEcosystem from '@/assets/schools/goe-gastronomy-open-ecosystem.jpg';
import cofradiaVascaGastronomia from '@/assets/schools/cofradia-vasca-gastronomia.jpg';

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
  // New Basque schools
  '18': hosteleriaLeioa,         // HOSTELERIA DE LEIOA
  '19': escuelaBilbaoLaratz,     // Escuela de cocina Bilbao Laratz
  '20': farmacook,               // FARMACOOK
  '21': keicook,                 // Keicook
  '22': escuelaHosteleriaBilbao, // Escuela Superior de Hostelería Bilbao
  '23': aulaGastronomicaRibera,  // Aula Gastronómica Mercado de La Ribera
  '24': escuelaMalaespera,       // Escuela de Cocina Malaespera
  '25': sukaldikas,              // Sukaldikas Escuela de Cocina Macrobiótica
  '26': bscFormacion,            // BSC FORMACIÓN
  // New schools with UUID IDs
  '451764d3-bca1-4ba8-880c-f900e0055de2': enekoSukaldari,  // Eneko Sukaldari
  'f76befb8-b55a-4391-ba81-d13bdd10b320': kitxen,          // KITXEN
  'f44a1c3a-0d73-4b87-8cb7-893f29144e36': mimoBiteTheExperience, // Mimo Bite The Experience
  '626f1f4d-ed5c-4e69-9917-9b122a16d0a0': fleischmannsCookingGroup, // Fleischmann´s Cooking Group
  '3bb82b6a-8567-4d17-b350-e9f055b70457': osoaSukaldaritza,       // Osoa Sukaldaritza eta Ikaskuntza
  '76089d57-8f78-416f-927d-643de6ae6ee2': gastronomiaBilbao,      // Gastronomía Bilbao
  'a5d81fea-80b4-4b3e-87a1-1ff450283cdd': goeGastronomyOpenEcosystem, // GOe Gastronomy Open Ecosystem
  '50d80600-b6ea-46f8-9aa2-83a522647ac6': cofradiaVascaGastronomia, // Cofradía Vasca de Gastronomía
};

// Function to get school image URL by ID
export const getSchoolImageUrl = (schoolId: string): string => {
  return schoolImageMapping[schoolId] || '';
};

// Function to get alt text for school images
export const getSchoolImageAltText = (schoolName: string): string => {
  return `${schoolName} - Culinary School Building`;
};
