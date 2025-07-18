import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';
import { DatabaseSchool, convertDatabaseSchoolToSchool } from '@/hooks/useSchoolsDatabase';

export const useSchoolBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['school-by-slug', slug],
    queryFn: async (): Promise<School | null> => {
      // Buscar por slug primero
      let { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true) // Solo escuelas activas en la página pública
        .maybeSingle();

      // Si no se encuentra por slug, intentar por legacy_id (para compatibilidad)
      if (!data && !error) {
        const { data: legacyData, error: legacyError } = await supabase
          .from('schools')
          .select('*')
          .eq('legacy_id', slug)
          .eq('is_active', true)
          .maybeSingle();
        
        data = legacyData;
        error = legacyError;
      }

      if (error) {
        console.error('Error fetching school by slug:', error);
        throw error;
      }
      
      return data ? convertDatabaseSchoolToSchool(data as DatabaseSchool) : null;
    },
    enabled: !!slug,
  });
};