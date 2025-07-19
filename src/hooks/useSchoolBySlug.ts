
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';
import { DatabaseSchool, convertDatabaseSchoolToSchool } from '@/hooks/useSchoolsDatabase';
import { generateSlug } from '@/utils/slugUtils';

export const useSchoolBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['school-by-slug', slug],
    queryFn: async (): Promise<School | null> => {
      console.log('🔍 Searching for school with slug:', slug);
      
      // Buscar por slug primero
      let { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      console.log('📊 Direct slug search result:', { data: !!data, error });

      // Si no se encuentra por slug, intentar por legacy_id (para compatibilidad)
      if (!data && !error) {
        console.log('🔄 Trying legacy_id search for:', slug);
        const { data: legacyData, error: legacyError } = await supabase
          .from('schools')
          .select('*')
          .eq('legacy_id', slug)
          .eq('is_active', true)
          .maybeSingle();
        
        console.log('📊 Legacy ID search result:', { data: !!legacyData, error: legacyError });
        data = legacyData;
        error = legacyError;
      }

      // Si aún no se encuentra, intentar buscar por nombre y generar slug para comparar
      if (!data && !error) {
        console.log('🔄 Trying name-based slug matching for:', slug);
        const { data: allSchools, error: allError } = await supabase
          .from('schools')
          .select('*')
          .eq('is_active', true);

        if (!allError && allSchools) {
          const matchingSchool = allSchools.find(school => {
            const generatedSlug = generateSlug(school.name);
            console.log(`🏫 Comparing "${school.name}" -> "${generatedSlug}" with "${slug}"`);
            return generatedSlug === slug;
          });
          
          if (matchingSchool) {
            console.log('✅ Found school by name-based slug matching:', matchingSchool.name);
            data = matchingSchool;
          } else {
            console.log('❌ No school found with matching generated slug');
          }
        }
      }

      if (error) {
        console.error('❌ Error fetching school by slug:', error);
        throw error;
      }
      
      if (data) {
        console.log('✅ Successfully found school:', data.name);
      } else {
        console.log('❌ No school found for slug:', slug);
      }
      
      return data ? convertDatabaseSchoolToSchool(data as DatabaseSchool) : null;
    },
    enabled: !!slug,
  });
};
