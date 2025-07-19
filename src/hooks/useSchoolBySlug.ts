
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';
import { DatabaseSchool, convertDatabaseSchoolToSchool } from '@/hooks/useSchoolsDatabase';
import { generateSlug } from '@/utils/slugUtils';

export const useSchoolBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['school-by-slug', slug],
    queryFn: async (): Promise<School | null> => {
      console.log('🔍 [useSchoolBySlug] Searching for school with slug:', slug);
      
      if (!slug) {
        console.log('❌ [useSchoolBySlug] No slug provided');
        return null;
      }

      // Step 1: Try direct slug search first
      console.log('🆔 [useSchoolBySlug] Step 1: Trying direct slug search');
      const { data: directSlugData, error: directSlugError } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      console.log('📊 [useSchoolBySlug] Direct slug search result:', { 
        found: !!directSlugData, 
        error: directSlugError?.message,
        schoolName: directSlugData?.name 
      });

      if (directSlugData) {
        console.log('✅ [useSchoolBySlug] Found school by direct slug:', directSlugData.name);
        return convertDatabaseSchoolToSchool(directSlugData as DatabaseSchool);
      }

      if (directSlugError) {
        console.error('❌ [useSchoolBySlug] Direct slug search error:', directSlugError);
      }

      // Step 2: Try legacy_id search (for backward compatibility)
      console.log('🔄 [useSchoolBySlug] Step 2: Trying legacy_id search');
      const { data: legacyData, error: legacyError } = await supabase
        .from('schools')
        .select('*')
        .eq('legacy_id', slug)
        .eq('is_active', true)
        .maybeSingle();
      
      console.log('📊 [useSchoolBySlug] Legacy ID search result:', { 
        found: !!legacyData, 
        error: legacyError?.message,
        schoolName: legacyData?.name 
      });
      
      if (legacyData) {
        console.log('✅ [useSchoolBySlug] Found school by legacy_id:', legacyData.name);
        return convertDatabaseSchoolToSchool(legacyData as DatabaseSchool);
      }

      if (legacyError) {
        console.error('❌ [useSchoolBySlug] Legacy ID search error:', legacyError);
      }

      // Step 3: Try name-based slug generation and comparison
      console.log('🔄 [useSchoolBySlug] Step 3: Trying name-based slug matching');
      const { data: allSchools, error: allError } = await supabase
        .from('schools')
        .select('*')
        .eq('is_active', true);

      if (!allError && allSchools) {
        const matchingSchool = allSchools.find(school => {
          const generatedSlug = generateSlug(school.name);
          console.log(`🏫 [useSchoolBySlug] Comparing "${school.name}" -> "${generatedSlug}" with "${slug}"`);
          return generatedSlug === slug;
        });
        
        if (matchingSchool) {
          console.log('✅ [useSchoolBySlug] Found school by name-based slug matching:', matchingSchool.name);
          return convertDatabaseSchoolToSchool(matchingSchool as DatabaseSchool);
        } else {
          console.log('❌ [useSchoolBySlug] No school found with matching generated slug');
        }
      } else if (allError) {
        console.error('❌ [useSchoolBySlug] Error fetching all schools:', allError);
      }

      console.log('❌ [useSchoolBySlug] No school found for slug:', slug);
      return null;
    },
    enabled: !!slug,
  });
};
