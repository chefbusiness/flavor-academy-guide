import { supabase } from '@/integrations/supabase/client';
import { schools } from '@/data/schools';
import { generateSlug } from '@/utils/slugUtils';

// Función para generar descripción enriquecida de 400-500 caracteres
const generateEnhancedDescription = (school: any): string => {
  const baseDesc = school.description;
  const specialtiesMap: { [key: string]: string } = {
    'culinaryArts': 'artes culinarias',
    'pastry': 'pastelería',
    'wineGastronomy': 'enología y gastronomía',
    'hospitality': 'hostelería y gestión hotelera',
    'nutrition': 'nutrición culinaria',
    'molecular': 'cocina molecular',
    'traditional': 'cocina tradicional',
    'international': 'cocina internacional'
  };
  
  const specialtiesText = school.specialties
    .map((s: string) => specialtiesMap[s] || s)
    .join(', ');
    
  const foundedText = `Fundada en ${school.founded}, esta prestigiosa institución`;
  
  const methodologyText = 'combina técnicas tradicionales con innovación culinaria moderna, ofreciendo una formación integral que prepara a los estudiantes para destacar en la industria gastronómica internacional.';
  
  const facilitiesText = `Con más de ${school.studentsCount.toLocaleString()} estudiantes y ${school.programsCount} programas especializados, cuenta con instalaciones de última generación y un equipo docente de reconocidos profesionales del sector.`;
  
  const specialtyText = `Especializada en ${specialtiesText}, ofrece una experiencia educativa única que combina teoría y práctica en un entorno de excelencia académica.`;
  
  // Construir descripción enriquecida de ~400-500 caracteres
  const enhancedDescription = `${foundedText} ${methodologyText} ${facilitiesText} ${specialtyText}`;
  
  // Si es muy larga, usar versión más corta
  if (enhancedDescription.length > 500) {
    return `${foundedText} ${methodologyText} ${facilitiesText}`;
  }
  
  return enhancedDescription;
};

export const migrateStaticSchoolsData = async () => {
  console.log('🚀 Iniciando migración de datos estáticos a Supabase...');
  
  for (const school of schools) {
    try {
      console.log(`📝 Migrando escuela: ${school.name}`);
      
      // Preparar los datos para Supabase
      const schoolData = {
        name: school.name,
        description: generateEnhancedDescription(school),
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
        image: school.image,
        slug: school.slug || generateSlug(school.name),
        legacy_id: school.id,
        is_active: school.is_active !== false, // Por defecto true si no está definido
        updated_at: new Date().toISOString(),
      };

      // Verificar si ya existe (por legacy_id)
      const { data: existingSchool } = await supabase
        .from('schools')
        .select('id')
        .eq('legacy_id', school.id)
        .maybeSingle();

      if (existingSchool) {
        // Actualizar escuela existente
        const { error } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('legacy_id', school.id);

        if (error) {
          console.error(`❌ Error actualizando ${school.name}:`, error);
        } else {
          console.log(`✅ Escuela actualizada: ${school.name}`);
        }
      } else {
        // Crear nueva escuela
        const { error } = await supabase
          .from('schools')
          .insert(schoolData);

        if (error) {
          console.error(`❌ Error insertando ${school.name}:`, error);
        } else {
          console.log(`✅ Escuela creada: ${school.name}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error procesando ${school.name}:`, error);
    }
  }
  
  console.log('🎉 Migración completada!');
};

// Función para ejecutar la migración (solo para admin)
export const runMigrationIfAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ Usuario no autenticado');
      return;
    }

    // Verificar si es admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (userRole?.role === 'admin' || userRole?.role === 'super_admin') {
      await migrateStaticSchoolsData();
    } else {
      console.log('❌ Solo admins pueden ejecutar la migración');
    }
  } catch (error) {
    console.error('❌ Error en migración:', error);
  }
};