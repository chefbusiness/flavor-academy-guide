
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/school';
import { DatabaseSchool, convertDatabaseSchoolToSchool } from '@/hooks/useSchoolsDatabase';

export interface SchoolFormData {
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  type: 'university' | 'institute' | 'academy' | 'college';
  specialties: string[];
  founded: number;
  students_count: number;
  programs_count: number;
  rating: number;
  tuition_min: number;
  tuition_max: number;
  tuition_currency: string;
  languages: string[];
  accreditation: string[];
  features: string[];
  coordinates_lat?: number;
  coordinates_lng?: number;
  programs: string[];
  image?: string;
  gallery: string[];
  is_active: boolean;
}

export const useSchoolsPaginated = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['schools-paginated', page, pageSize],
    queryFn: async () => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from('schools')
        .select('*', { count: 'exact' })
        .order('name')
        .range(start, end);

      if (error) throw error;

      const schools = data.map(school => convertDatabaseSchoolToSchool(school as DatabaseSchool));
      
      return {
        schools,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        pageSize,
      };
    },
  });
};

export const useSchoolById = (id: string) => {
  return useQuery({
    queryKey: ['school', id],
    queryFn: async (): Promise<School | null> => {
      // Primero intentar buscar por UUID (id real)
      let { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      // Si no se encuentra y el ID no es un UUID válido, buscar por legacy_id
      if (!data && error?.message?.includes('invalid input syntax for type uuid')) {
        const { data: legacyData, error: legacyError } = await supabase
          .from('schools')
          .select('*')
          .eq('legacy_id', id)
          .maybeSingle();
        
        data = legacyData;
        error = legacyError;
      }

      if (error && !error.message?.includes('invalid input syntax for type uuid')) {
        throw error;
      }
      
      return data ? convertDatabaseSchoolToSchool(data as DatabaseSchool) : null;
    },
    enabled: !!id,
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SchoolFormData> }) => {
      const updateData = {
        ...data,
        specialties: JSON.stringify(data.specialties || []),
        languages: JSON.stringify(data.languages || []),
        accreditation: JSON.stringify(data.accreditation || []),
        features: JSON.stringify(data.features || []),
        programs: JSON.stringify(data.programs || []),
        gallery: JSON.stringify(data.gallery || []),
        updated_at: new Date().toISOString(),
      };

      // Primero intentar actualizar por UUID (id real)
      let { data: result, error } = await supabase
        .from('schools')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      // Si no se encuentra y el ID no es un UUID válido, actualizar por legacy_id
      if (error?.message?.includes('invalid input syntax for type uuid')) {
        const { data: legacyResult, error: legacyError } = await supabase
          .from('schools')
          .update(updateData)
          .eq('legacy_id', id)
          .select()
          .single();
        
        result = legacyResult;
        error = legacyError;
      }

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['school'] });
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

export const useToggleSchoolStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('schools')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};
