
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';
import { DatabaseSchool, convertDatabaseSchoolToSchool } from '@/hooks/useSchoolsDatabase';

export const useSchoolById = (identifier: string) => {
  return useQuery({
    queryKey: ['school-by-identifier', identifier],
    queryFn: async (): Promise<School | null> => {
      console.log('🔍 [useSchoolById] Starting search for identifier:', identifier);
      console.log('🔍 [useSchoolById] Identifier type:', typeof identifier);
      console.log('🔍 [useSchoolById] Identifier length:', identifier?.length);
      
      if (!identifier) {
        console.log('❌ [useSchoolById] No identifier provided');
        return null;
      }

      // Step 1: Try direct UUID search first
      console.log('🆔 [useSchoolById] Step 1: Trying direct UUID search');
      const { data: uuidData, error: uuidError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', identifier)
        .eq('is_active', true)
        .maybeSingle();
      
      console.log('📊 [useSchoolById] UUID search result:', { 
        found: !!uuidData, 
        error: uuidError?.message,
        schoolName: uuidData?.name 
      });
      
      if (uuidData) {
        console.log('✅ [useSchoolById] Found school by UUID:', uuidData.name);
        return convertDatabaseSchoolToSchool(uuidData as DatabaseSchool);
      }

      if (uuidError) {
        console.error('❌ [useSchoolById] UUID search error:', uuidError);
      }

      // Step 2: Try legacy_id search
      console.log('🔄 [useSchoolById] Step 2: Trying legacy_id search');
      const { data: legacyData, error: legacyError } = await supabase
        .from('schools')
        .select('*')
        .eq('legacy_id', identifier)
        .eq('is_active', true)
        .maybeSingle();
      
      console.log('📊 [useSchoolById] Legacy ID search result:', { 
        found: !!legacyData, 
        error: legacyError?.message,
        schoolName: legacyData?.name 
      });
      
      if (legacyData) {
        console.log('✅ [useSchoolById] Found school by legacy_id:', legacyData.name);
        return convertDatabaseSchoolToSchool(legacyData as DatabaseSchool);
      }

      if (legacyError) {
        console.error('❌ [useSchoolById] Legacy ID search error:', legacyError);
      }

      // Step 3: Try slug search
      console.log('🔄 [useSchoolById] Step 3: Trying slug search');
      const { data: slugData, error: slugError } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', identifier)
        .eq('is_active', true)
        .maybeSingle();
      
      console.log('📊 [useSchoolById] Slug search result:', { 
        found: !!slugData, 
        error: slugError?.message,
        schoolName: slugData?.name 
      });
      
      if (slugData) {
        console.log('✅ [useSchoolById] Found school by slug:', slugData.name);
        return convertDatabaseSchoolToSchool(slugData as DatabaseSchool);
      }

      if (slugError) {
        console.error('❌ [useSchoolById] Slug search error:', slugError);
      }

      console.log('❌ [useSchoolById] No school found for identifier:', identifier);
      return null;
    },
    enabled: !!identifier,
  });
};
