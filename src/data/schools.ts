import { School } from '@/types/school';

export const schools: School[] = [
  {
    id: '1',
    name: 'Basque Culinary Center',
    description: 'Universidad de Ciencias Gastronómicas líder mundial en innovación culinaria y gestión gastronómica ubicada en San Sebastián.',
    country: 'spain',
    city: 'San Sebastián',
    address: 'Paseo Juan Avelino Barriola, 101, 20009 Donostia',
    website: 'http://www.bculinary.com/',
    email: 'psanjose@bculinary.com',
    phone: '+34 943 57 45 00',
    type: 'university',
    specialties: ['culinaryArts', 'hospitality', 'wineGastronomy'],
    founded: 2011,
    studentsCount: 1500,
    programsCount: 15,
    image: '/api/placeholder/400/300',
    rating: 4.5,
    tuitionRange: {
      min: 15000,
      max: 25000,
      currency: 'EUR'
    },
    languages: ['Español', 'English', 'Euskera'],
    accreditation: ['ANECA', 'EFMD'],
    features: ['Research Center', 'Innovation Lab', 'Industry Partnerships'],
    coordinates: {
      lat: 43.2881809,
      lng: -1.9871252
    }
  },
  {
    id: '10',
    name: 'On - Egin Academia De Cocina',
    description: 'Academia de cocina especializada en cursos y talleres de panadería, pastelería y otros servicios culinarios con titulación.',
    country: 'spain',
    city: 'Vitoria-Gasteiz',
    address: 'Canciller Ayala Kalea, 5, 01005 Vitoria-Gasteiz, Araba',
    website: 'https://academiaonegin.wordpress.com/',
    email: 'dvbath@yahoo.com',
    phone: '+34 945 03 10 12',
    type: 'academy',
    specialties: ['culinaryArts', 'pastry'],
    founded: 2010,
    studentsCount: 200,
    programsCount: 8,
    image: '/api/placeholder/400/300',
    rating: 4.7,
    tuitionRange: {
      min: 800,
      max: 2500,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Titulación Propia'],
    features: ['Clases online', 'Servicios en las instalaciones', 'Acceso para sillas de ruedas'],
    coordinates: {
      lat: 42.8434371,
      lng: -2.6664684
    }
  },
  {
    id: '11',
    name: 'Hazten eta Jolasten',
    description: 'Escuela de cocina especializada en actividades culinarias y educación gastronómica infantil y familiar.',
    country: 'spain',
    city: 'País Vasco',
    address: 'País Vasco, España',
    website: 'https://www.instagrama.com/haztenetajolasten',
    email: 'info@haztenetajolasten.com',
    phone: '+34 622 45 07 06',
    type: 'academy',
    specialties: ['culinaryArts'],
    founded: 2015,
    studentsCount: 150,
    programsCount: 5,
    image: '/api/placeholder/400/300',
    rating: 5.0,
    tuitionRange: {
      min: 500,
      max: 1500,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Local'],
    features: ['Adecuado para niños', 'Servicios familiares'],
    coordinates: {
      lat: 42.9648034,
      lng: -2.5898364
    }
  },
  {
    id: '12',
    name: 'Escuela de Cocina Aingeru Etxebarria',
    description: 'Escuela de cocina dirigida por el chef Aingeru Etxebarria, especializada en técnicas culinarias avanzadas y cocina vasca.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Errekakoetxe Kalea, nº 2, Abando, 48010 Bilbao, Bizkaia',
    website: 'https://www.escuelaaingeru.com',
    email: 'info@escuelaaingeru.com',
    phone: '+34 944 24 16 42',
    type: 'academy',
    specialties: ['culinaryArts', 'pastry'],
    founded: 2008,
    studentsCount: 300,
    programsCount: 10,
    image: '/api/placeholder/400/300',
    rating: 4.7,
    tuitionRange: {
      min: 1200,
      max: 3500,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Profesional'],
    features: ['Acceso para sillas de ruedas', 'Adecuado para niños', 'Chef especializado'],
    coordinates: {
      lat: 43.2594376,
      lng: -2.9353409
    }
  },
  {
    id: '13',
    name: 'Escuela de Hostelería de Gamarra',
    description: 'Centro de formación en hostelería y gastronomía con restaurante propio y servicios gastronómicos especializados.',
    country: 'spain',
    city: 'Vitoria-Gasteiz',
    address: 'C. Presagana, 1, 01013 Vitoria-Gasteiz, Araba',
    website: 'http://www.gamarra.eus/',
    email: 'gamarra@gamarraeskola.com',
    phone: '+34 945 25 80 25',
    type: 'institute',
    specialties: ['hospitality', 'culinaryArts', 'hotelManagement'],
    founded: 1995,
    studentsCount: 500,
    programsCount: 12,
    image: '/api/placeholder/400/300',
    rating: 4.6,
    tuitionRange: {
      min: 2000,
      max: 5000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Oficial', 'Homologación FP'],
    features: ['Acceso para sillas de ruedas', 'Aparcamiento adaptado', 'Restaurante propio'],
    coordinates: {
      lat: 42.8790075,
      lng: -2.6614157
    }
  },
  {
    id: '14',
    name: 'Egibide - Mendizorrotza',
    description: 'Centro de formación profesional especializado en hostelería y gastronomía con programas integrales de E.S.O, Bachillerato y FP.',
    country: 'spain',
    city: 'Vitoria-Gasteiz',
    address: 'Amadeo Garcia de Salazar Plaza, 2, 01007 Vitoria-Gasteiz, Araba',
    website: 'https://www.egibide.org/escuela-de-hosteleria/',
    email: 'jijimenez@egibide.org',
    phone: '+34 945 01 01 40',
    type: 'college',
    specialties: ['hospitality', 'culinaryArts', 'hotelManagement'],
    founded: 1985,
    studentsCount: 800,
    programsCount: 15,
    image: '/api/placeholder/400/300',
    rating: 4.3,
    tuitionRange: {
      min: 1500,
      max: 4000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera', 'English'],
    accreditation: ['Homologación FP', 'Certificación Oficial'],
    features: ['Acceso para sillas de ruedas', 'Aparcamiento adaptado', 'Formación integral'],
    coordinates: {
      lat: 42.8373495,
      lng: -2.6861827
    }
  },
  {
    id: '15',
    name: 'Sualai',
    description: 'Escuela de hostelería especializada en formación profesional culinaria y servicios gastronómicos.',
    country: 'spain',
    city: 'Vitoria-Gasteiz',
    address: 'Badaia Kalea, 15, 01012 Vitoria-Gasteiz, Araba',
    website: 'https://www.sualai.com',
    email: 'info@sualai.com',
    phone: '+34 945 77 07 20',
    type: 'institute',
    specialties: ['hospitality', 'culinaryArts'],
    founded: 2000,
    studentsCount: 250,
    programsCount: 8,
    image: '/api/placeholder/400/300',
    rating: 5.0,
    tuitionRange: {
      min: 1000,
      max: 3000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Profesional'],
    features: ['Acceso para sillas de ruedas', 'Formación especializada'],
    coordinates: {
      lat: 42.8505482,
      lng: -2.676696
    }
  },
  {
    id: '16',
    name: 'Koilara Gastronomía',
    description: 'Escuela de cocina especializada en gastronomía moderna con enfoque inclusivo y amigable con la comunidad LGTBI+.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Errege Katolikoen Etorb., Errekalde, 48012 Bilbao, Bizkaia',
    website: 'https://www.koilaragastronomia.com',
    email: 'info@koilaragastronomia.com',
    phone: '+34 944 000 000',
    type: 'academy',
    specialties: ['culinaryArts', 'pastry'],
    founded: 2012,
    studentsCount: 180,
    programsCount: 6,
    image: '/api/placeholder/400/300',
    rating: 5.0,
    tuitionRange: {
      min: 900,
      max: 2800,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Local'],
    features: ['Acceso para sillas de ruedas', 'Amigable con la comunidad LGTBI+', 'Espacio seguro'],
    coordinates: {
      lat: 43.2543413,
      lng: -2.9357008
    }
  },
  {
    id: '17',
    name: 'Escuela de cocina - ESHBI Ribera',
    description: 'Escuela de cocina especializada en formación culinaria profesional con cursos especializados en Bilbao.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Erribera Kalea, s/n, Ibaiondo, 48005 Bilbao, Bizkaia',
    website: 'https://www.escuelahosteleria.com/cursos-cocina-bilbao/',
    email: 'rcenteno@escuelahosteleria.com',
    phone: '+34 944 74 51 10',
    type: 'academy',
    specialties: ['culinaryArts', 'pastry'],
    founded: 2005,
    studentsCount: 220,
    programsCount: 7,
    image: '/api/placeholder/400/300',
    rating: 4.9,
    tuitionRange: {
      min: 1500,
      max: 4000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Profesional'],
    features: ['Acceso para sillas de ruedas', 'Formación especializada', 'Ubicación céntrica'],
    coordinates: {
      lat: 43.2554854,
      lng: -2.9241602
    }
  },
  {
    id: '18',
    name: 'HOSTELERIA DE LEIOA',
    description: 'Centro de formación profesional especializado en hostelería ubicado en el campus universitario de Leioa, con amplias instalaciones y programas integrales.',
    country: 'spain',
    city: 'Leioa',
    address: 'Campus Universitario, s/n, 48940 Leioa, Biscay',
    website: 'http://www.hostelerialeioa.net/',
    email: 'compras@hostelerialeioa.net',
    phone: '+34 946 01 24 46',
    type: 'institute',
    specialties: ['hospitality', 'culinaryArts'],
    founded: 1995,
    studentsCount: 800,
    programsCount: 12,
    image: '/api/placeholder/400/300',
    rating: 4.5,
    tuitionRange: {
      min: 3000,
      max: 8000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Gobierno Vasco', 'FP Oficial'],
    features: ['Servicios en las instalaciones', 'Acceso para sillas de ruedas', 'Aparcamiento adaptado'],
    coordinates: {
      lat: 43.3321956,
      lng: -2.9709277
    }
  },
  {
    id: '19',
    name: 'Escuela de cocina Bilbao Laratz',
    description: 'Centro de formación culinaria con titulación privada, amplitud de horarios y prácticas en restaurantes, dirigida por mujeres emprendedoras.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Nicolás Alcorta Kalea, 5, Errekalde, 48003 Bilbao, Bizkaia',
    website: 'https://www.escueladecocinabilbao.com/',
    email: 'info@escueladecocinabilbao.com',
    phone: '+34 688 65 05 54',
    type: 'academy',
    specialties: ['culinaryArts'],
    founded: 2008,
    studentsCount: 120,
    programsCount: 6,
    image: '/api/placeholder/400/300',
    rating: 4.9,
    tuitionRange: {
      min: 1200,
      max: 3500,
      currency: 'EUR'
    },
    languages: ['Español'],
    accreditation: ['Titulación Privada'],
    features: ['Horarios flexibles', 'Prácticas en restaurantes', 'De propietarias mujeres', 'Acceso para sillas de ruedas'],
    coordinates: {
      lat: 43.2562409,
      lng: -2.9346859
    }
  },
  {
    id: '20',
    name: 'FARMACOOK',
    description: 'Escuela de cocina ubicada en Eibar, especializada en formación culinaria con enfoque práctico y moderno.',
    country: 'spain',
    city: 'Eibar',
    address: 'Ego-Gain Kalea, 16, 20600 Eibar, Gipuzkoa',
    website: '',
    email: '',
    phone: '+34 690 30 29 25',
    type: 'academy',
    specialties: ['culinaryArts'],
    founded: 2012,
    studentsCount: 80,
    programsCount: 4,
    image: '/api/placeholder/400/300',
    rating: 4.2,
    tuitionRange: {
      min: 800,
      max: 2000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Local'],
    features: ['Horarios amplios', 'Clases prácticas'],
    coordinates: {
      lat: 43.1844558,
      lng: -2.4770932
    }
  },
  {
    id: '21',
    name: 'Keicook',
    description: 'Iniciativa gastronómica ubicada en el Mercado de Abastos de Vitoria-Gasteiz, que busca dar valor y prestigio social al núcleo comercial local.',
    country: 'spain',
    city: 'Vitoria-Gasteiz',
    address: 'Gasteizko Merkatua, C. Jesús Guridi, 1-A, 2ª planta Edificio, 01004 Vitoria-Gasteiz, Álava',
    website: 'https://keicook.com/',
    email: 'info@keicook.com',
    phone: '+34 945 60 30 00',
    type: 'academy',
    specialties: ['culinaryArts', 'hospitality'],
    founded: 2018,
    studentsCount: 100,
    programsCount: 8,
    image: '/api/placeholder/400/300',
    rating: 4.0,
    tuitionRange: {
      min: 600,
      max: 1800,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Fundación Abastos'],
    features: ['Amigable con LGTBI+', 'Espacio seguro transgénero', 'Adecuado para niños', 'Acceso para sillas de ruedas'],
    coordinates: {
      lat: 42.8444967,
      lng: -2.6666428
    }
  },
  {
    id: '22',
    name: 'Escuela Superior de Hostelería Bilbao',
    description: 'Centro de formación en hostelería con amplia experiencia, instalaciones completas y aparcamiento propio en Bilbao.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Enekuri Artxanda Errepidea, 3, Deusto, 48015 Bilbao, Bizkaia',
    website: 'http://www.escuelahosteleria.com/',
    email: 'rcenteno@escuelahosteleria.com',
    phone: '+34 944 74 51 10',
    type: 'institute',
    specialties: ['hospitality', 'culinaryArts'],
    founded: 1985,
    studentsCount: 600,
    programsCount: 15,
    image: '/api/placeholder/400/300',
    rating: 4.7,
    tuitionRange: {
      min: 4000,
      max: 9000,
      currency: 'EUR'
    },
    languages: ['Español', 'English'],
    accreditation: ['FP Oficial', 'Gobierno Vasco'],
    features: ['Aparcamiento gratuito', 'Servicios en instalaciones', 'Acceso para sillas de ruedas'],
    coordinates: {
      lat: 43.2794458,
      lng: -2.9409914
    }
  },
  {
    id: '23',
    name: 'Aula Gastronómica Mercado de La Ribera',
    description: 'Aula gastronómica ubicada en el famoso Mercado de La Ribera de Bilbao, ofreciendo cursos de cocina en un entorno histórico único.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Erribera Kalea, Ibaiondo, 48005 Bilbao, Bizkaia',
    website: 'https://www.escuelahosteleria.com/cursos-cocina-bilbao/',
    email: 'rcenteno@escuelahosteleria.com',
    phone: '+34 944 74 51 10',
    type: 'academy',
    specialties: ['culinaryArts', 'hospitality'],
    founded: 2010,
    studentsCount: 200,
    programsCount: 6,
    image: '/api/placeholder/400/300',
    rating: 4.8,
    tuitionRange: {
      min: 800,
      max: 2500,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Ayuntamiento de Bilbao'],
    features: ['Ubicación histórica', 'Mercado tradicional', 'Acceso para sillas de ruedas'],
    coordinates: {
      lat: 43.2555217,
      lng: -2.9239506
    }
  },
  {
    id: '24',
    name: 'Escuela de Cocina Malaespera',
    description: 'Escuela de cocina ubicada en el corazón de Bilbao, especializada en cursos gastronómicos con horarios amplios y ambiente acogedor.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Santiago de Compostela Kalea, 15, Ibaiondo, 48003 Bilbao, Bizkaia',
    website: 'https://txokomalaespera.com/cursos-de-cocina/',
    email: '',
    phone: '+34 650 61 80 54',
    type: 'academy',
    specialties: ['culinaryArts'],
    founded: 2015,
    studentsCount: 60,
    programsCount: 4,
    image: '/api/placeholder/400/300',
    rating: 5.0,
    tuitionRange: {
      min: 500,
      max: 1500,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Local'],
    features: ['Horarios amplios', 'Ambiente acogedor', 'Acceso para sillas de ruedas'],
    coordinates: {
      lat: 43.2495737,
      lng: -2.9289751
    }
  },
  {
    id: '25',
    name: 'Sukaldikas Escuela de Cocina Macrobiótica y Saludable',
    description: 'Escuela especializada en cocina energética macrobiótica y vegana, donde la cocina se convierte en alquimia saludable.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Bilbao, Bizkaia',
    website: 'http://www.sukaldikas.com/',
    email: 'info@sukaldikas.com',
    phone: '+34 616 20 34 07',
    type: 'academy',
    specialties: ['culinaryArts'],
    founded: 2013,
    studentsCount: 150,
    programsCount: 8,
    image: '/api/placeholder/400/300',
    rating: 4.2,
    tuitionRange: {
      min: 600,
      max: 2000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Certificación Macrobiótica'],
    features: ['Cocina macrobiótica', 'Alimentación vegana', 'Enfoque energético'],
    coordinates: {
      lat: 43.2194496,
      lng: -2.9314664
    }
  },
  {
    id: '26',
    name: 'BSC FORMACIÓN',
    description: 'Centro de formación gastronómica especializado en cocina vasca, dirigido por mujeres emprendedoras con apoyo integral a empresas del sector hostelero.',
    country: 'spain',
    city: 'Bilbao',
    address: 'Bilbao, Bizkaia',
    website: 'http://www.bscformacion.com/',
    email: 'info@bscformacion.com',
    phone: '+34 946 34 21 91',
    type: 'institute',
    specialties: ['culinaryArts', 'hospitality'],
    founded: 2016,
    studentsCount: 300,
    programsCount: 10,
    image: '/api/placeholder/400/300',
    rating: 5.0,
    tuitionRange: {
      min: 1500,
      max: 4000,
      currency: 'EUR'
    },
    languages: ['Español', 'Euskera'],
    accreditation: ['Gobierno Vasco', 'Cámara de Comercio'],
    features: ['De propietarias mujeres', 'Clases online', 'Amigable con LGTBI+', 'Apoyo empresarial'],
    coordinates: {
      lat: 43.263664,
      lng: -2.9357266
    }
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