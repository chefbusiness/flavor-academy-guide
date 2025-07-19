
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';
import { DatabaseSchool, convertDatabaseSchoolToSchool } from '@/hooks/useSchoolsDatabase';
import { generateSlug } from '@/utils/slugUtils';

export const useSchoolById = (identifier: string) => {
  return useQuery({
    queryKey: ['school-by-identifier', identifier],
    queryFn: async (): Promise<School | null> => {
      console.log('🔍 Searching for school with identifier:', identifier);
      
      let data = null;
      let error = null;

      // First try: Search by UUID (new ID format)
      if (identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('🆔 Trying UUID search');
        const result = await supabase
          .from('schools')
          .select('*')
          .eq('id', identifier)
          .eq('is_active', true)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
        console.log('📊 UUID search result:', { found: !!data, error });
      }

      // Second try: Search by legacy_id (original numeric ID)
      if (!data && !error) {
        console.log('🔄 Trying legacy_id search');
        const result = await supabase
          .from('schools')
          .select('*')
          .eq('legacy_id', identifier)
          .eq('is_active', true)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
        console.log('📊 Legacy ID search result:', { found: !!data, error });
      }

      // Third try: Search by slug
      if (!data && !error) {
        console.log('🔄 Trying slug search');
        const result = await supabase
          .from('schools')
          .select('*')
          .eq('slug', identifier)
          .eq('is_active', true)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
        console.log('📊 Slug search result:', { found: !!data, error });
      }

      // Fourth try: Search by name-generated slug
      if (!data && !error) {
        console.log('🔄 Trying name-generated slug search');
        const { data: allSchools, error: allError } = await supabase
          .from('schools')
          .select('*')
          .eq('is_active', true);

        if (!allError && allSchools) {
          const matchingSchool = allSchools.find(school => {
            const generatedSlug = generateSlug(school.name);
            console.log(`🏫 Comparing "${school.name}" -> "${generatedSlug}" with "${identifier}"`);
            return generatedSlug === identifier;
          });
          
          if (matchingSchool) {
            console.log('✅ Found school by name-generated slug:', matchingSchool.name);
            data = matchingSchool;
          }
        }
        error = allError;
      }

      if (error) {
        console.error('❌ Error fetching school:', error);
        throw error;
      }
      
      if (data) {
        console.log('✅ Successfully found school:', data.name);
      } else {
        console.log('❌ No school found for identifier:', identifier);
      }
      
      return data ? convertDatabaseSchoolToSchool(data as DatabaseSchool) : null;
    },
    enabled: !!identifier,
  });
};
