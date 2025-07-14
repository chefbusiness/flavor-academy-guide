import { School } from '@/types/school';

export const schools: School[] = [
  {
    id: '1',
    name: 'Basque Culinary Center',
    description: 'Universidad de Ciencias Gastronómicas líder mundial en innovación culinaria y gestión gastronómica.',
    country: 'spain',
    city: 'San Sebastián',
    address: 'Paseo Juan Arana 15, 20009 Donostia-San Sebastián',
    website: 'https://www.bculinary.com',
    email: 'info@bculinary.com',
    phone: '+34 943 574 500',
    type: 'university',
    specialties: ['culinaryArts', 'hospitality', 'wineGastronomy'],
    founded: 2011,
    studentsCount: 1500,
    programsCount: 15,
    image: '/api/placeholder/400/300',
    rating: 4.8,
    tuitionRange: {
      min: 15000,
      max: 25000,
      currency: 'EUR'
    },
    languages: ['Español', 'English', 'Euskera'],
    accreditation: ['ANECA', 'EFMD'],
    features: ['Research Center', 'Innovation Lab', 'Industry Partnerships']
  },
  {
    id: '2',
    name: 'Instituto Europeo di Design - Madrid',
    description: 'Escuela de diseño y gastronomía con enfoque creativo e innovador en las artes culinarias.',
    country: 'spain',
    city: 'Madrid',
    address: 'Calle Flor Baja, 3, 28013 Madrid',
    website: 'https://www.ied.es',
    email: 'madrid@ied.es',
    phone: '+34 91 448 04 44',
    type: 'institute',
    specialties: ['culinaryArts', 'pastry'],
    founded: 1966,
    studentsCount: 800,
    programsCount: 8,
    image: '/api/placeholder/400/300',
    rating: 4.6,
    tuitionRange: {
      min: 12000,
      max: 18000,
      currency: 'EUR'
    },
    languages: ['Español', 'English'],
    accreditation: ['ANECA'],
    features: ['Design Focus', 'Creative Labs', 'Industry Connections']
  },
  {
    id: '3',
    name: 'Centro Culinario Ambrosía',
    description: 'Instituto mexicano especializado en alta cocina y tradiciones gastronómicas latinoamericanas.',
    country: 'mexico',
    city: 'Ciudad de México',
    address: 'Av. Insurgentes Sur 1605, Benito Juárez, CDMX',
    website: 'https://www.ambrosia.mx',
    email: 'info@ambrosia.mx',
    phone: '+52 55 5555 0123',
    type: 'institute',
    specialties: ['culinaryArts', 'pastry'],
    founded: 1995,
    studentsCount: 600,
    programsCount: 12,
    image: '/api/placeholder/400/300',
    rating: 4.5,
    tuitionRange: {
      min: 180000,
      max: 280000,
      currency: 'MXN'
    },
    languages: ['Español', 'English'],
    accreditation: ['SEP', 'CONACULTA'],
    features: ['Traditional Techniques', 'Modern Innovation', 'Restaurant Training']
  },
  {
    id: '4',
    name: 'ALMA - La Scuola Internazionale di Cucina Italiana',
    description: 'La escuela internacional de cocina italiana más prestigiosa, ubicada en el corazón de Emilia-Romagna.',
    country: 'italy',
    city: 'Colorno',
    address: 'Palazzo Ducale, Via Soncino, 7, 43052 Colorno PR',
    website: 'https://www.alma.scuolacucina.it',
    email: 'info@alma.scuolacucina.it',
    phone: '+39 0521 815 111',
    type: 'academy',
    specialties: ['culinaryArts', 'pastry', 'wineGastronomy'],
    founded: 2004,
    studentsCount: 1200,
    programsCount: 20,
    image: '/api/placeholder/400/300',
    rating: 4.9,
    tuitionRange: {
      min: 18000,
      max: 35000,
      currency: 'EUR'
    },
    languages: ['Italiano', 'English'],
    accreditation: ['MIUR', 'Regione Emilia-Romagna'],
    features: ['Historic Palace', 'Michelin Partnerships', 'International Programs']
  },
  {
    id: '5',
    name: 'Institut Paul Bocuse',
    description: 'Escuela de excelencia culinaria y gestión hotelera, heredera del legado del chef Paul Bocuse.',
    country: 'france',
    city: 'Lyon',
    address: 'Château du Vivier, Écully, 69131 Lyon',
    website: 'https://www.institutpaulbocuse.com',
    email: 'contact@institutpaulbocuse.com',
    phone: '+33 4 72 18 02 20',
    type: 'institute',
    specialties: ['culinaryArts', 'hospitality', 'hotelManagement'],
    founded: 1990,
    studentsCount: 900,
    programsCount: 18,
    image: '/api/placeholder/400/300',
    rating: 4.8,
    tuitionRange: {
      min: 16000,
      max: 30000,
      currency: 'EUR'
    },
    languages: ['Français', 'English'],
    accreditation: ['CGE', 'AACSB'],
    features: ['Château Campus', 'Bocuse Legacy', 'Industry Excellence']
  },
  {
    id: '6',
    name: 'Le Cordon Bleu Paris',
    description: 'La institución culinaria más famosa del mundo, pionera en la enseñanza de la cocina francesa clásica.',
    country: 'france',
    city: 'Paris',
    address: '13-15 Quai André Citroën, 75015 Paris',
    website: 'https://www.cordonbleu.edu',
    email: 'paris@cordonbleu.edu',
    phone: '+33 1 85 65 15 00',
    type: 'institute',
    specialties: ['culinaryArts', 'pastry', 'hospitality'],
    founded: 1895,
    studentsCount: 2000,
    programsCount: 25,
    image: '/api/placeholder/400/300',
    rating: 4.9,
    tuitionRange: {
      min: 20000,
      max: 40000,
      currency: 'EUR'
    },
    languages: ['Français', 'English'],
    accreditation: ['RNCP', 'CGE'],
    features: ['Historic Institution', 'Global Network', 'Master Chefs']
  }
];

export const countries = ['spain', 'mexico', 'italy', 'france', 'usa', 'argentina'];
export const types = ['university', 'institute', 'academy', 'college'];
export const specialties = ['culinaryArts', 'hospitality', 'pastry', 'wineGastronomy', 'hotelManagement'];