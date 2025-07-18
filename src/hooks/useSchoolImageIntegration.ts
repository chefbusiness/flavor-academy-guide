import { useMemo } from 'react';
import { useSchoolImage } from '@/hooks/useSchoolImages';
import { getSchoolImageUrl } from '@/utils/imageMapping';
import { generateSlug } from '@/utils/slugUtils';
import { School } from '@/types/school';

export const useSchoolImageIntegration = (school: School) => {
  const schoolSlug = generateSlug(school.name);
  const { data: schoolImageData } = useSchoolImage(schoolSlug);

  const getImageSource = useMemo(() => {
    // First priority: Use Supabase Storage image if available
    if (schoolImageData?.image_url) {
      return schoolImageData.image_url;
    }
    
    // Second priority: Use local image mapping
    const localImage = getSchoolImageUrl(school.id);
    if (localImage) {
      return localImage;
    }
    
    // Third priority: Use school.image property
    if (school.image && school.image !== '/api/placeholder/400/300') {
      return school.image;
    }
    
    // Finally, use Unsplash with a consistent seed based on school ID
    const unsplashId = parseInt(school.id).toString().padStart(8, '0');
    return `https://images.unsplash.com/photo-1556909114-${unsplashId}?w=400&h=300&fit=crop&auto=format`;
  }, [school.id, school.image, school.name, schoolImageData, schoolSlug]);

  const getFallbackImageSource = useMemo(() => {
    // For error handling, provide alternative sources
    return [
      school.image && school.image !== '/api/placeholder/400/300' ? school.image : null,
      getSchoolImageUrl(school.id),
      `https://images.unsplash.com/photo-1556909114-${parseInt(school.id).toString().padStart(8, '0')}?w=400&h=300&fit=crop&auto=format`
    ].filter(Boolean);
  }, [school.id, school.image]);

  return {
    getImageSource,
    getFallbackImageSource,
    isSupabaseImageAvailable: !!schoolImageData?.image_url,
    altText: schoolImageData?.alt_text || `${school.name} - Culinary School Building`
  };
};