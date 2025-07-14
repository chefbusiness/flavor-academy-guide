export interface School {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  type: 'university' | 'institute' | 'academy' | 'college';
  specialties: string[];
  founded: number;
  studentsCount: number;
  programsCount: number;
  image: string;
  rating: number;
  tuitionRange: {
    min: number;
    max: number;
    currency: string;
  };
  languages: string[];
  accreditation: string[];
  features: string[];
}

export interface SchoolFilters {
  country: string;
  type: string;
  specialty: string;
  search: string;
}