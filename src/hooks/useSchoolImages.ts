import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SchoolImage {
  id: string;
  school_id: string;
  image_url: string;
  image_type: string;
  alt_text?: string;
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

// Hook to get a specific school image
export const useSchoolImage = (schoolId: string) => {
  return useQuery({
    queryKey: ['school-image', schoolId],
    queryFn: async (): Promise<SchoolImage | null> => {
      console.log(`🔍 Consultando Supabase para school_id: ${schoolId}`);
      
      const { data, error } = await supabase
        .from('school_images')
        .select('*')
        .eq('school_id', schoolId)
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

// Hook to upload/update school image
export const useUploadSchoolImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      schoolId: string;
      imageUrl: string;
      imageType: 'real' | 'ai_generated';
      altText?: string;
    }) => {
      const { data, error } = await supabase
        .from('school_images')
        .upsert({
          school_id: params.schoolId,
          image_url: params.imageUrl,
          image_type: params.imageType,
          alt_text: params.altText || `${params.schoolId} culinary school building`,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch school images
      queryClient.invalidateQueries({ queryKey: ['school-images'] });
      queryClient.invalidateQueries({ queryKey: ['school-image'] });
    },
  });
};