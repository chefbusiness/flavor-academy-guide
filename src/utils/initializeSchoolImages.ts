import { supabase } from '@/integrations/supabase/client';
import { schoolImageMapping } from './imageMapping';

// Function to initialize school images in the database
export const initializeSchoolImages = async () => {
  try {
    const schoolImages = Object.entries(schoolImageMapping).map(([schoolId, imageUrl]) => ({
      school_id: schoolId,
      image_url: imageUrl,
      image_type: schoolId === 'basque-culinary-center' ? 'real' : 'ai_generated',
      alt_text: `${schoolId.replace(/-/g, ' ')} culinary school building`,
    }));

    const { data, error } = await supabase
      .from('school_images')
      .upsert(schoolImages, { onConflict: 'school_id' })
      .select();

    if (error) {
      console.error('Error initializing school images:', error);
      return { success: false, error };
    }

    console.log('School images initialized successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error initializing school images:', error);
    return { success: false, error };
  }
};

// Function to get school image from database or fallback to local
export const getSchoolImage = async (schoolId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('school_images')
      .select('image_url')
      .eq('school_id', schoolId)
      .maybeSingle();

    if (error || !data) {
      // Fallback to local image mapping
      return schoolImageMapping[schoolId] || '';
    }

    return data.image_url;
  } catch (error) {
    console.error('Error fetching school image:', error);
    // Fallback to local image mapping
    return schoolImageMapping[schoolId] || '';
  }
};