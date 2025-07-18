import { supabase } from '@/integrations/supabase/client';

// Function to populate school images in Supabase
export const populateSchoolImages = async () => {
  const schoolImagesData = [
    {
      school_id: 'basque-culinary-center',
      image_url: '/src/assets/schools/basque-culinary-center.jpg',
      image_type: 'real',
      alt_text: 'Basque Culinary Center - Modern culinary university building in San Sebastián'
    },
    {
      school_id: 'centro-culinario-ambrosia',
      image_url: '/src/assets/schools/centro-culinario-ambrosia.jpg',
      image_type: 'ai_generated',
      alt_text: 'Centro Culinario Ambrosía - Beautiful culinary institute in Mexico City'
    },
    {
      school_id: 'institut-paul-bocuse',
      image_url: '/src/assets/schools/institut-paul-bocuse.jpg',
      image_type: 'ai_generated',
      alt_text: 'Institut Paul Bocuse - Elegant French culinary school in Lyon'
    },
    {
      school_id: 'le-cordon-bleu-paris',
      image_url: '/src/assets/schools/le-cordon-bleu-paris.jpg',
      image_type: 'ai_generated',
      alt_text: 'Le Cordon Bleu Paris - Prestigious culinary school on Quai André Citroën'
    },
    {
      school_id: 'alma-colorno',
      image_url: '/src/assets/schools/alma-colorno.jpg',
      image_type: 'ai_generated',
      alt_text: 'ALMA - Historic Palazzo Ducale in Colorno, Italy'
    },
    {
      school_id: 'ied-madrid',
      image_url: '/src/assets/schools/ied-madrid.jpg',
      image_type: 'ai_generated',
      alt_text: 'Instituto Europeo di Design Madrid - Modern design school building'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('school_images')
      .upsert(schoolImagesData, { onConflict: 'school_id' })
      .select();

    if (error) {
      console.error('Error populating school images:', error);
      return { success: false, error };
    }

    console.log('School images populated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error populating school images:', error);
    return { success: false, error };
  }
};

// Auto-populate images when this module is imported (for development)
if (typeof window !== 'undefined') {
  populateSchoolImages().then(result => {
    if (result.success) {
      console.log('✅ School images auto-populated successfully');
    } else {
      console.log('❌ Failed to auto-populate school images');
    }
  });
}