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
  '17': 'escuela-de-cocina-eshbi-ribera'
};

export const useSchoolImageIntegration = (school: School) => {
  const schoolSlug = schoolIdToSlug[school.id] || generateSlug(school.name);
  const { data: schoolImageData } = useSchoolImage(schoolSlug);

  const getImageSource = useMemo(() => {
    console.log(`🔍 DEBUG: Buscando imagen para: ${school.name} (ID: ${school.id})`);
    console.log(`🔍 DEBUG: Slug generado: ${schoolSlug}`);
    console.log(`🔍 DEBUG: Datos de imagen en Supabase:`, schoolImageData);
    
    // First priority: Use Supabase Storage image if available
    if (schoolImageData?.image_url) {
      console.log(`✅ DEBUG: Usando imagen de Supabase para ${school.name}: ${schoolImageData.image_url}`);
      return schoolImageData.image_url;
    }
    
    // Second priority: Use local image mapping
    const localImage = getSchoolImageUrl(school.id);
    if (localImage) {
      console.log(`📁 DEBUG: Usando imagen local para ${school.name}: ${localImage}`);
      return localImage;
    }
    
    // Third priority: Use school.image property
    if (school.image && school.image !== '/api/placeholder/400/300') {
      console.log(`🔗 DEBUG: Usando school.image para ${school.name}: ${school.image}`);
      return school.image;
    }
    
    // Finally, use Unsplash with a consistent seed based on school ID
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    const fallbackUrl = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=400&h=300&fit=crop&auto=format`;
    console.log(`🌐 DEBUG: Usando Unsplash fallback para ${school.name}: ${fallbackUrl}`);
    return fallbackUrl;
  }, [school.id, school.image, school.name, schoolImageData, schoolSlug]);

  const getFallbackImageSource = useMemo(() => {
    // For error handling, provide alternative sources
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