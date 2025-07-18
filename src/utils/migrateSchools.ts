import { supabase } from '@/integrations/supabase/client';
import { schools } from '@/data/schools';
import { generateSlug } from '@/utils/slugUtils';

export const migrateSchoolsToDatabase = async () => {
  try {
    console.log('Iniciando migración de escuelas...');
    
    // Preparar datos para inserción con el formato correcto de la BD
    const schoolsData = schools.map(school => ({
      legacy_id: school.id,
      name: school.name,
      description: school.description,
      country: school.country,
      city: school.city,
      address: school.address,
      website: school.website,
      email: school.email,
      phone: school.phone,
      type: school.type,
      specialties: JSON.stringify(school.specialties),
      founded: school.founded,
      students_count: school.studentsCount,
      programs_count: school.programsCount,
      image: school.image,
      rating: school.rating,
      tuition_min: school.tuitionRange.min,
      tuition_max: school.tuitionRange.max,
      tuition_currency: school.tuitionRange.currency,
      languages: JSON.stringify(school.languages),
      accreditation: JSON.stringify(school.accreditation),
      features: JSON.stringify(school.features),
      coordinates_lat: school.coordinates?.lat || null,
      coordinates_lng: school.coordinates?.lng || null,
      programs: JSON.stringify(school.programs || []),
      gallery: JSON.stringify(school.gallery || []),
      slug: generateSlug(school.name),
      is_active: true
    }));

    // Verificar si ya existen escuelas
    const { data: existingSchools, error: checkError } = await supabase
      .from('schools')
      .select('legacy_id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingSchools && existingSchools.length > 0) {
      console.log('Las escuelas ya fueron migradas previamente');
      return { success: true, message: 'Las escuelas ya fueron migradas previamente' };
    }

    // Insertar escuelas en lotes para mejor rendimiento
    const batchSize = 10;
    let inserted = 0;
    
    for (let i = 0; i < schoolsData.length; i += batchSize) {
      const batch = schoolsData.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('schools')
        .insert(batch);

      if (insertError) {
        throw insertError;
      }
      
      inserted += batch.length;
      console.log(`Migradas ${inserted}/${schoolsData.length} escuelas...`);
    }

    console.log('Migración completada exitosamente');
    return { 
      success: true, 
      message: `Se migraron ${inserted} escuelas exitosamente` 
    };

  } catch (error) {
    console.error('Error en la migración:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};