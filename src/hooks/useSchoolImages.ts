import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SchoolImage {
  id: string;
  school_id: string;
  image_url: string;
  image_type: string;
  alt_text?: string;
  image_category?: string;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

// Hook to get all school images
export const useSchoolImages = () => {
  return useQuery({
    queryKey: ['school-images'],
    queryFn: async (): Promise<SchoolImage[]> => {
      const { data, error } = await supabase
        .from('school_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
  });
};

// Hook to get a specific school's main image
export const useSchoolImage = (schoolId: string) => {
  return useQuery({
    queryKey: ['school-image', schoolId],
    queryFn: async (): Promise<SchoolImage | null> => {
      console.log(`🔍 Consultando Supabase para school_id: ${schoolId}`);
      
      const { data, error } = await supabase
        .from('school_images')
        .select('*')
        .eq('school_id', schoolId)
        .eq('image_category', 'main')
        .maybeSingle();

      console.log(`📊 Resultado de Supabase para ${schoolId}:`, { data, error });

      if (error) {
        console.error(`❌ Error en consulta Supabase para ${schoolId}:`, error);
        throw error;
      }
      return data;
    },
    enabled: !!schoolId,
  });
};

// Hook for managing gallery images by school
export const useSchoolGalleryImages = (schoolId: string) => {
  return useQuery({
    queryKey: ['school-gallery-images', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_images')
        .select('*')
        .eq('school_id', schoolId)
        .neq('image_category', 'main')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as SchoolImage[];
    },
    enabled: !!schoolId,
  });
};

// Hook to upload/update school image
export const useUploadSchoolImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      schoolId: string;
      imageUrl: string;
      imageType: 'real' | 'ai_generated';
      altText?: string;
      imageCategory?: string;
      displayOrder?: number;
    }) => {
      const { data, error } = await supabase
        .from('school_images')
        .upsert({
          school_id: params.schoolId,
          image_url: params.imageUrl,
          image_type: params.imageType,
          alt_text: params.altText || `${params.schoolId} culinary school`,
          image_category: params.imageCategory || 'main',
          display_order: params.displayOrder || 0,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-images'] });
      queryClient.invalidateQueries({ queryKey: ['school-image'] });
      queryClient.invalidateQueries({ queryKey: ['school-gallery-images'] });
    },
  });
};

// Hook for deleting gallery images
export const useDeleteSchoolImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('school_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-images'] });
      queryClient.invalidateQueries({ queryKey: ['school-image'] });
      queryClient.invalidateQueries({ queryKey: ['school-gallery-images'] });
    },
  });
};

// Hook for reordering gallery images
export const useReorderGalleryImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; display_order: number }[]) => {
      // Update each image's display_order individually
      for (const update of updates) {
        const { error } = await supabase
          .from('school_images')
          .update({ 
            display_order: update.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-gallery-images'] });
    },
  });
};

// Hook to delete main school image
export const useDeleteMainSchoolImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schoolId: string) => {
      // First, get the main image to delete the file from storage
      const { data: mainImage } = await supabase
        .from('school_images')
        .select('*')
        .eq('school_id', schoolId)
        .eq('image_category', 'main')
        .maybeSingle();

      // Delete from school_images table
      const { error: dbError } = await supabase
        .from('school_images')
        .delete()
        .eq('school_id', schoolId)
        .eq('image_category', 'main');

      if (dbError) throw dbError;

      // Delete from storage if there was an image
      if (mainImage?.image_url) {
        // Extract file path from URL
        const urlParts = mainImage.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        const { error: storageError } = await supabase.storage
          .from('school-images')
          .remove([fileName]);

        // Log storage error but don't throw (image might be external)
        if (storageError) {
          console.warn('Storage deletion warning:', storageError);
        }
      }

      // Update schools table to remove main image reference
      const { error: schoolError } = await supabase
        .from('schools')
        .update({ image: null })
        .eq('id', schoolId);

      if (schoolError) throw schoolError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-images'] });
      queryClient.invalidateQueries({ queryKey: ['school-image'] });
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};
