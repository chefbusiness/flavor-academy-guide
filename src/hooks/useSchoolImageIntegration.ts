
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
  '26': 'bsc-formacion'
};

export const useSchoolImageIntegration = (school: School) => {
  const schoolSlug = schoolIdToSlug[school.id] || generateSlug(school.name);
  const { data: schoolImageData, isLoading, error } = useSchoolImage(schoolSlug);

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
    schoolSlug
  };
};
