
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';

export interface DatabaseSchool {
  id: string;
  legacy_id: string | null;
  name: string;
  description: string;
  description_en: string | null;
  country: string;
  city: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  type: 'university' | 'institute' | 'academy' | 'college';
  specialties: string | string[]; // Can be JSON string or already parsed array
  founded: number;
  students_count: number;
  programs_count: number;
  image: string | null;
  rating: number;
  tuition_min: number;
  tuition_max: number;
  tuition_currency: string;
  languages: string | string[]; // Can be JSON string or already parsed array
  accreditation: string | string[]; // Can be JSON string or already parsed array
  features: string | string[]; // Can be JSON string or already parsed array
  features_en: string | string[]; // Can be JSON string or already parsed array
  accreditation_en: string | string[]; // Can be JSON string or already parsed array
  specialties_en: string | string[]; // Can be JSON string or already parsed array
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  programs: string | string[]; // Can be JSON string or already parsed array
  gallery: string | string[]; // Can be JSON string or already parsed array
  slug: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Safe JSON parser that handles both strings and already-parsed data
const safeJsonParse = (value: any): any[] => {
  console.log('🔍 [safeJsonParse] Processing value:', { value, type: typeof value });
  
  // If it's null or undefined, return empty array
  if (value === null || value === undefined) {
    console.log('📝 [safeJsonParse] Value is null/undefined, returning empty array');
    return [];
  }
  
  // If it's already an array, return it directly
  if (Array.isArray(value)) {
    console.log('✅ [safeJsonParse] Value is already an array:', value);
    return value;
  }
  
  // If it's a string, try to parse it
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      console.log('✅ [safeJsonParse] Successfully parsed JSON string:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('❌ [safeJsonParse] Failed to parse JSON string:', value, error);
      return [];
    }
  }
  
  // For any other type, return empty array
  console.log('⚠️ [safeJsonParse] Unexpected value type, returning empty array');
  return [];
};

// Función para convertir de formato DB a formato School
export const convertDatabaseSchoolToSchool = (dbSchool: DatabaseSchool): School => {
  console.log('🔄 [convertDatabaseSchoolToSchool] Converting school:', dbSchool.name);
  console.log('📊 [convertDatabaseSchoolToSchool] Raw specialties:', dbSchool.specialties);
  console.log('📊 [convertDatabaseSchoolToSchool] Raw features:', dbSchool.features);
  console.log('📊 [convertDatabaseSchoolToSchool] Raw languages:', dbSchool.languages);
  
  try {
    const convertedSchool: School = {
      id: dbSchool.legacy_id || dbSchool.id,
      name: dbSchool.name,
      description: dbSchool.description,
      description_en: dbSchool.description_en,
      country: dbSchool.country,
      city: dbSchool.city,
      address: dbSchool.address,
      website: dbSchool.website,
      email: dbSchool.email,
      phone: dbSchool.phone,
      type: dbSchool.type,
      specialties: safeJsonParse(dbSchool.specialties),
      specialties_en: dbSchool.specialties_en ? safeJsonParse(dbSchool.specialties_en) : null,
      founded: dbSchool.founded,
      studentsCount: dbSchool.students_count,
      programsCount: dbSchool.programs_count,
      image: dbSchool.image || '/api/placeholder/400/300',
      rating: dbSchool.rating,
      tuitionRange: {
        min: dbSchool.tuition_min,
        max: dbSchool.tuition_max,
        currency: dbSchool.tuition_currency,
      },
      languages: safeJsonParse(dbSchool.languages),
      accreditation: safeJsonParse(dbSchool.accreditation),
      accreditation_en: dbSchool.accreditation_en ? safeJsonParse(dbSchool.accreditation_en) : null,
      features: safeJsonParse(dbSchool.features),
      features_en: dbSchool.features_en ? safeJsonParse(dbSchool.features_en) : null,
      coordinates: dbSchool.coordinates_lat && dbSchool.coordinates_lng ? {
        lat: dbSchool.coordinates_lat,
        lng: dbSchool.coordinates_lng,
      } : undefined,
      programs: safeJsonParse(dbSchool.programs || []),
      gallery: safeJsonParse(dbSchool.gallery || []),
      slug: dbSchool.slug,
      is_active: dbSchool.is_active,
    };
    
    console.log('✅ [convertDatabaseSchoolToSchool] Successfully converted school:', convertedSchool.name);
    console.log('📝 [convertDatabaseSchoolToSchool] Converted specialties:', convertedSchool.specialties);
    
    return convertedSchool;
  } catch (error) {
    console.error('❌ [convertDatabaseSchoolToSchool] Error converting school:', error);
    console.error('🔍 [convertDatabaseSchoolToSchool] Failed for school:', dbSchool);
    throw error;
  }
};

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      const convertedSchools = data.map(school => convertDatabaseSchoolToSchool(school as DatabaseSchool));
      setSchools(convertedSchools);
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return {
    schools,
    loading,
    error,
    refetch: fetchSchools,
  };
};

export const useSchool = (slug: string) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('schools')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setSchool(convertDatabaseSchoolToSchool(data as DatabaseSchool));
        } else {
          setSchool(null);
        }
      } catch (err) {
        console.error('Error fetching school:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSchool();
    }
  }, [slug]);

  return {
    school,
    loading,
    error,
  };
};
