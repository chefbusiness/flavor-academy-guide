
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

  const getImageSource = useMemo(() => {
    console.log(`🔥 SCHOOL CARD INTEGRATION ${school.name} (ID: ${school.id})`);
    console.log(`🔥 schoolSlug: ${schoolSlug}`);
    console.log(`🔥 schoolImageData:`, schoolImageData);
    console.log(`🔥 isLoading: ${isLoading}, error:`, error);
    
    // First priority: Use Supabase Storage image if available
    if (schoolImageData?.image_url && !isLoading) {
      console.log(`🔥 ✅ USANDO SUPABASE: ${school.name}`);
      return schoolImageData.image_url;
    }
    
    console.log(`🔥 ❌ FALLBACK para ${school.name}`);
    
    // Fallback to local image mapping
    const localImage = getSchoolImageUrl(school.id);
    if (localImage) {
      console.log(`🔥 📁 USANDO LOCAL: ${school.name}`);
      return localImage;
    }
    
    // Final fallback to Unsplash
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    const fallbackUrl = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=400&h=300&fit=crop&auto=format`;
    console.log(`🔥 🌐 USANDO UNSPLASH: ${school.name}`);
    return fallbackUrl;
  }, [school.id, school.image, school.name, schoolImageData, schoolSlug, isLoading, error]);

  const getFallbackImageSource = useMemo(() => {
    return [
      getSchoolImageUrl(school.id),
      school.image && school.image !== '/api/placeholder/400/300' ? school.image : null,
      `https://images.unsplash.com/photo-1556909114-${parseInt(school.id).toString().padStart(8, '0')}?w=400&h=300&fit=crop&auto=format`
    ].filter(Boolean);
  }, [school.id, school.image]);

  return {
    getImageSource,
    getFallbackImageSource,
    isSupabaseImageAvailable: !!schoolImageData?.image_url,
    altText: schoolImageData?.alt_text || `${school.name} - Culinary School Building`,
    schoolSlug
  };
};
