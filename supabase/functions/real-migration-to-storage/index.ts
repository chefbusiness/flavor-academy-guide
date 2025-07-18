import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🚀 REAL MIGRATION: Iniciando migración REAL a Supabase Storage...')

    // Mapeo de escuelas con sus imágenes locales
    const localImageMappings = [
      {
        schoolId: 'basque-culinary-center',
        schoolName: 'Basque Culinary Center',
        fileName: 'basque-culinary-center.jpg'
      },
      {
        schoolId: 'on-egin-academia-de-cocina',
        schoolName: 'On - Egin Academia De Cocina',
        fileName: 'on-egin-academia.jpg'
      },
      {
        schoolId: 'hazten-eta-jolasten',
        schoolName: 'Hazten eta Jolasten',
        fileName: 'hazten-eta-jolasten.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-aingeru-etxebarria',
        schoolName: 'Escuela de Cocina Aingeru Etxebarria',
        fileName: 'aingeru-etxebarria.jpg'
      },
      {
        schoolId: 'escuela-de-hosteleria-de-gamarra',
        schoolName: 'Escuela de Hostelería de Gamarra',
        fileName: 'gamarra-hosteleria.jpg'
      },
      {
        schoolId: 'egibide-mendizorrotza',
        schoolName: 'Egibide - Mendizorrotza',
        fileName: 'egibide-mendizorrotza.jpg'
      },
      {
        schoolId: 'sualai',
        schoolName: 'Sualai',
        fileName: 'sualai.jpg'
      },
      {
        schoolId: 'koilara-gastronomia',
        schoolName: 'Koilara Gastronomía',
        fileName: 'koilara-gastronomia.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-eshbi-ribera',
        schoolName: 'Escuela de cocina - ESHBI Ribera',
        fileName: 'eshbi-ribera.jpg'
      },
      {
        schoolId: 'instituto-europeo-design-madrid',
        schoolName: 'Instituto Europeo di Design - Madrid',
        fileName: 'ied-madrid.jpg'
      },
      {
        schoolId: 'centro-culinario-ambrosia',
        schoolName: 'Centro Culinario Ambrosía',
        fileName: 'centro-culinario-ambrosia.jpg'
      },
      {
        schoolId: 'alma-colorno',
        schoolName: 'ALMA - La Scuola Internazionale di Cucina Italiana',
        fileName: 'alma-colorno.jpg'
      },
      {
        schoolId: 'institut-paul-bocuse',
        schoolName: 'Institut Paul Bocuse',
        fileName: 'institut-paul-bocuse.jpg'
      },
      {
        schoolId: 'le-cordon-bleu-paris',
        schoolName: 'Le Cordon Bleu Paris',
        fileName: 'le-cordon-bleu-paris.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-bilbao-laratz',
        schoolName: 'Escuela de cocina Bilbao Laratz',
        fileName: 'escuela-de-cocina-bilbao-laratz.jpg'
      },
      {
        schoolId: 'escuela-superior-de-hosteleria-bilbao',
        schoolName: 'Escuela Superior de Hostelería de Bilbao',
        fileName: 'escuela-superior-de-hosteleria-bilbao.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-malaespera',
        schoolName: 'Escuela de Cocina Malaespera',
        fileName: 'escuela-de-cocina-malaespera.jpg'
      },
      {
        schoolId: 'aula-gastronomica-mercado-de-la-ribera',
        schoolName: 'Aula Gastronómica Mercado de La Ribera',
        fileName: 'aula-gastronomica-mercado-de-la-ribera.jpg'
      },
      {
        schoolId: 'bsc-formacion',
        schoolName: 'BSC FORMACIÓN',
        fileName: 'bsc-formacion.jpg'
      },
      {
        schoolId: 'farmacook',
        schoolName: 'Farmacook',
        fileName: 'farmacook.jpg'
      },
      {
        schoolId: 'hosteleria-de-leioa',
        schoolName: 'Hostelería de Leioa',
        fileName: 'hosteleria-de-leioa.jpg'
      },
      {
        schoolId: 'keicook',
        schoolName: 'Keicook',
        fileName: 'keicook.jpg'
      },
      {
        schoolId: 'sukaldikas-escuela-de-cocina-macrobiotica',
        schoolName: 'Sukaldikas - Escuela de Cocina Macrobiótica',
        fileName: 'sukaldikas-escuela-de-cocina-macrobiotica.jpg'
      }
    ]

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const school of localImageMappings) {
      try {
        console.log(`🔄 Procesando ${school.schoolName} (${school.schoolId})...`)
        
        // Obtener la imagen local desde la carpeta assets/schools
        const imageResponse = await fetch(`https://a36f5b0b-a936-4882-9398-32a9cf8774a0.lovableproject.com/src/assets/schools/${school.fileName}`)
        
        if (!imageResponse.ok) {
          throw new Error(`No se pudo obtener la imagen local: ${school.fileName}`)
        }
        
        const imageBlob = await imageResponse.blob()
        console.log(`✅ Imagen local obtenida: ${imageBlob.size} bytes`)
        
        // Subir a Supabase Storage
        const fileName = `${school.schoolId}.jpg`
        console.log(`📤 Subiendo a Supabase Storage: ${fileName}`)
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('school-images')
          .upload(fileName, imageBlob, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          throw uploadError
        }

        // Obtener URL pública
        const { data: publicUrlData } = supabase.storage
          .from('school-images')
          .getPublicUrl(fileName)

        const publicUrl = publicUrlData.publicUrl
        console.log(`🔗 URL pública: ${publicUrl}`)

        // Actualizar o insertar en la base de datos usando upsert para evitar duplicados
        const { error: upsertError } = await supabase
          .from('school_images')
          .upsert({
            school_id: school.schoolId,
            image_url: publicUrl,
            image_type: 'local',
            alt_text: `${school.schoolName} - Escuela de Cocina`,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'school_id'
          })

        if (upsertError) {
          throw upsertError
        }

        console.log(`✅ SUCCESS: ${school.schoolName} -> ${publicUrl}`)
        results.push({
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          status: 'success',
          url: publicUrl,
          type: 'local'
        })
        successCount++

      } catch (error) {
        console.error(`❌ ERROR: ${school.schoolName}:`, error)
        results.push({
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          status: 'error',
          error: error.message
        })
        errorCount++
      }
    }

    console.log(`🎉 REAL MIGRATION COMPLETED: ${successCount} éxitos, ${errorCount} errores`)

    return new Response(JSON.stringify({
      message: 'Migración REAL completada - Imágenes ahora en Supabase Storage',
      summary: {
        total: localImageMappings.length,
        success: successCount,
        errors: errorCount
      },
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('💥 ERROR GENERAL:', error)
    return new Response(JSON.stringify({ 
      error: 'Error en migración real', 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})