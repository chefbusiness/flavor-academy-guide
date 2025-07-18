import { supabase } from '@/integrations/supabase/client'

export const uploadSchoolImagesToSupabase = async () => {
  try {
    console.log('Starting school images upload to Supabase...')
    
    const { data, error } = await supabase.functions.invoke('upload-school-images', {
      body: {}
    })

    if (error) {
      console.error('Error uploading school images:', error)
      throw error
    }

    console.log('Upload completed:', data)
    return data
    
  } catch (error) {
    console.error('Failed to upload school images:', error)
    throw error
  }
}