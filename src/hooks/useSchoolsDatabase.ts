import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';

export interface DatabaseSchool {
  id: string;
  legacy_id: string | null;
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  type: 'university' | 'institute' | 'academy' | 'college';
  specialties: string; // JSON string
  founded: number;
  students_count: number;
  programs_count: number;
  image: string | null;
  rating: number;
  tuition_min: number;
  tuition_max: number;
  tuition_currency: string;
  languages: string; // JSON string
  accreditation: string; // JSON string
  features: string; // JSON string
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  programs: string; // JSON string
  gallery: string; // JSON string
  slug: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Función para convertir de formato DB a formato School
export const convertDatabaseSchoolToSchool = (dbSchool: DatabaseSchool): School => {
  return {
    id: dbSchool.legacy_id || dbSchool.id,
    name: dbSchool.name,
    description: dbSchool.description,
    country: dbSchool.country,
    city: dbSchool.city,
    address: dbSchool.address,
    website: dbSchool.website,
    email: dbSchool.email,
    phone: dbSchool.phone,
    type: dbSchool.type,
    specialties: JSON.parse(dbSchool.specialties),
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
    languages: JSON.parse(dbSchool.languages),
    accreditation: JSON.parse(dbSchool.accreditation),
    features: JSON.parse(dbSchool.features),
    coordinates: dbSchool.coordinates_lat && dbSchool.coordinates_lng ? {
      lat: dbSchool.coordinates_lat,
      lng: dbSchool.coordinates_lng,
    } : undefined,
    programs: JSON.parse(dbSchool.programs || '[]'),
    gallery: JSON.parse(dbSchool.gallery || '[]'),
    slug: dbSchool.slug,
    is_active: dbSchool.is_active,
  };
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