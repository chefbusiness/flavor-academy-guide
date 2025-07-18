import { useEffect } from 'react';
import { useSchoolImages } from '@/hooks/useSchoolImages';
import { schools } from '@/data/schools';

export const useImageMigrationDebug = () => {
  const { data: schoolImages, isLoading } = useSchoolImages();

  useEffect(() => {
    if (!isLoading && schoolImages) {
      console.log('📊 Estado de imágenes en Supabase Storage:');
      console.log('Total de imágenes en BD:', schoolImages.length);
      
      const schoolsWithImages = schools.map(school => {
        const hasSupabaseImage = schoolImages.some(img => 
          img.school_id.includes(school.id) || 
          img.school_id.includes(school.name.toLowerCase().replace(/\s+/g, '-'))
        );
        
        return {
          id: school.id,
          name: school.name,
          hasSupabaseImage,
          supabaseImage: schoolImages.find(img => 
            img.school_id.includes(school.id) || 
            img.school_id.includes(school.name.toLowerCase().replace(/\s+/g, '-'))
          )?.image_url
        };
      });
      
      console.table(schoolsWithImages);
      
      const withSupabase = schoolsWithImages.filter(s => s.hasSupabaseImage).length;
      const withoutSupabase = schoolsWithImages.length - withSupabase;
      
      console.log(`✅ Escuelas con imágenes en Supabase: ${withSupabase}`);
      console.log(`❌ Escuelas sin imágenes en Supabase: ${withoutSupabase}`);
    }
  }, [schoolImages, isLoading]);

  return { schoolImages, isLoading };
};