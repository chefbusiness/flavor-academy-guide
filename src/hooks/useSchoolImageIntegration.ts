
import { useMemo } from 'react';
import { useSchoolImage } from '@/hooks/useSchoolImages';
import { getSchoolImageUrl } from '@/utils/imageMapping';
import { generateSlug } from '@/utils/slugUtils';
import { School } from '@/types/school';

// Mapping of school IDs to their slugs for Supabase lookup
const schoolIdToSlug: Record<string, string> = {
  '1': 'basque-culinary-center',
  '2': 'instituto-europeo-design-madrid', 
  '3': 'centro-culinario-ambrosia',
  '4': 'alma-colorno',
  '5': 'institut-paul-bocuse',
  '6': 'le-cordon-bleu-paris',
  '10': 'on-egin-academia-de-cocina',
  '11': 'hazten-eta-jolasten',
  '12': 'escuela-de-cocina-aingeru-etxebarria',
  '13': 'escuela-de-hosteleria-de-gamarra',
  '14': 'egibide-mendizorrotza',
  '15': 'sualai',
  '16': 'koilara-gastronomia',
  '17': 'escuela-de-cocina-eshbi-ribera',
  '18': 'hosteleria-de-leioa',
  '19': 'escuela-de-cocina-bilbao-laratz',
  '20': 'farmacook',
  '21': 'keicook',
  '22': 'escuela-superior-de-hosteleria-bilbao',
  '23': 'aula-gastronomica-mercado-de-la-ribera',
  '24': 'escuela-de-cocina-malaespera',
  '25': 'sukaldikas-escuela-de-cocina-macrobiotica',
  '26': 'bsc-formacion',
  // UUID schools - need to map by their actual school_id used in database
  '451764d3-bca1-4ba8-880c-f900e0055de2': 'eneko-sukaldari',
  'f76befb8-b55a-4391-ba81-d13bdd10b320': 'kitxen',
  'f44a1c3a-0d73-4b87-8cb7-893f29144e36': 'mimo-bite-the-experience',
  '626f1f4d-ed5c-4e69-9917-9b122a16d0a0': 'fleischmanns-cooking-group',
  '3bb82b6a-8567-4d17-b350-e9f055b70457': 'osoa-sukaldaritza',
  '76089d57-8f78-416f-927d-643de6ae6ee2': 'gastronomia-bilbao',
  'a5d81fea-80b4-4b3e-87a1-1ff450283cdd': 'goe-gastronomy-open-ecosystem',
  '50d80600-b6ea-46f8-9aa2-83a522647ac6': 'cofradia-vasca-gastronomia',
  // Add alternative slug mappings for schools that might use different formats
  'cofradia-vasca-gastronomia': 'cofradia-vasca-gastronomia',
  'cofradia-vasca-de-gastronomia': 'cofradia-vasca-gastronomia'
};

export const useSchoolImageIntegration = (school: School) => {
  // Try multiple approaches to get the correct slug
  const getSchoolSlug = () => {
    // First try direct mapping
    if (schoolIdToSlug[school.id]) {
      return schoolIdToSlug[school.id];
    }
    
    // If school.id is already a slug format, try using it directly
    if (typeof school.id === 'string' && school.id.includes('-')) {
      return school.id;
    }
    
    // Fallback to generating slug from name
    return generateSlug(school.name);
  };

  const schoolSlug = getSchoolSlug();
  const { data: schoolImageData, isLoading, error, refetch } = useSchoolImage(schoolSlug);

  console.log(`🔍 SCHOOL DEBUG:`, {
    schoolId: school.id,
    schoolName: school.name,
    resolvedSlug: schoolSlug,
    hasMapping: !!schoolIdToSlug[school.id],
    imageData: schoolImageData,
    isLoading,
    error
  });

  // FIXED: Now returns the URL directly as a string, not a function
  const imageSource = useMemo(() => {
    console.log(`🚀 PROCESANDO ${school.name} (ID: ${school.id}, Slug: ${schoolSlug})`);
    console.log(`📊 Supabase data:`, schoolImageData);
    console.log(`⏳ Loading:`, isLoading, `Error:`, error);
    
    // First priority: Use Supabase Storage image if available and loaded
    if (schoolImageData?.image_url && !isLoading) {
      console.log(`✅ SUPABASE IMAGE: ${school.name} -> ${schoolImageData.image_url}`);
      return schoolImageData.image_url;
    }
    
    // While loading, show local fallback
    if (isLoading) {
      const localImage = getSchoolImageUrl(school.id);
      if (localImage) {
        console.log(`⏳ LOADING - USANDO LOCAL: ${school.name} -> ${localImage}`);
        return localImage;
      }
    }
    
    // Second priority: Local image mapping
    const localImage = getSchoolImageUrl(school.id);
    if (localImage) {
      console.log(`📁 LOCAL IMAGE: ${school.name} -> ${localImage}`);
      return localImage;
    }
    
    // Final fallback: Unsplash
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    const fallbackUrl = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=400&h=300&fit=crop&auto=format`;
    console.log(`🌐 UNSPLASH FALLBACK: ${school.name} -> ${fallbackUrl}`);
    return fallbackUrl;
  }, [school.id, school.name, schoolImageData, schoolSlug, isLoading, error]);

  const getFallbackImageSource = useMemo(() => {
    return [
      getSchoolImageUrl(school.id),
      school.image && school.image !== '/api/placeholder/400/300' ? school.image : null,
      `https://images.unsplash.com/photo-1556909114-${parseInt(school.id).toString().padStart(8, '0')}?w=400&h=300&fit=crop&auto=format`
    ].filter(Boolean);
  }, [school.id, school.image]);

  return {
    imageSource, // FIXED: Now it's a direct string, not a function
    getFallbackImageSource,
    isSupabaseImageAvailable: !!schoolImageData?.image_url,
    altText: schoolImageData?.alt_text || `${school.name} - Culinary School Building`,
    schoolSlug,
    refetchImage: refetch // Add this to allow manual refresh
  };
};
