
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
    console.log(`🔍 PROCESANDO IMAGEN para ${school.name} (ID: ${school.id}, Slug correcto: ${schoolSlug})`);
    console.log(`📊 schoolImageData para slug "${schoolSlug}":`, schoolImageData);
    console.log(`⏳ isLoading:`, isLoading);
    console.log(`❌ error:`, error);
    
    // Don't process while loading
    if (isLoading) {
      console.log(`⏳ ESPERANDO CARGA para ${school.name}...`);
      const localImage = getSchoolImageUrl(school.id);
      return localImage || '/api/placeholder/400/300';
    }
    
    // First priority: Use Supabase Storage image if available
    if (schoolImageData?.image_url) {
      console.log(`✅ USANDO SUPABASE: ${school.name} -> ${schoolImageData.image_url}`);
      return schoolImageData.image_url;
    }
    
    console.log(`❌ NO HAY DATOS DE SUPABASE para ${school.name} (slug: ${schoolSlug})`);
    
    // Second priority: Use local image mapping (this is the main fallback now)
    const localImage = getSchoolImageUrl(school.id);
    if (localImage) {
      console.log(`📁 USANDO LOCAL: ${school.name} -> ${localImage}`);
      return localImage;
    }
    
    // Third priority: Use school.image property
    if (school.image && school.image !== '/api/placeholder/400/300') {
      console.log(`🔗 USANDO SCHOOL.IMAGE: ${school.name} -> ${school.image}`);
      return school.image;
    }
    
    // Finally, use Unsplash with a consistent seed based on school ID
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    const fallbackUrl = `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=400&h=300&fit=crop&auto=format`;
    console.log(`🌐 USANDO UNSPLASH: ${school.name} -> ${fallbackUrl}`);
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
