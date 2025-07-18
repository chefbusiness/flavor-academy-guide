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

    // Mapeo completo de todas las escuelas con sus imágenes
    const allSchools = [
      // Escuelas vascas (con imágenes reales existentes)
      {
        schoolId: 'basque-culinary-center',
        schoolName: 'Basque Culinary Center',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npy3N1vYxb6Ac8IvGj_cbA7HE5IDZY_21xU17dZPKonT8yiimlX4c53r_BLjwLnKo6KACUFV2a8ZAyOu4IehS4wmPNQnFwRO7TgZja7yMcMepJ4JtAtreWhaS249QPzNYUmbZ9j=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'on-egin-academia-de-cocina',
        schoolName: 'On - Egin Academia De Cocina',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrXzM11Jl5_VK9I2NrjRD5cmvJEs3wcyAF5rqqzvUlB3erzS67_7SPD2rSrGrrsWGJ-XFK5e8Vw1JCssawq1SL-9CCPUKQcpPfEsu3xk0MrESiQeEcoXJWV2QKGVEBi1KSaEzqkLA=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'hazten-eta-jolasten',
        schoolName: 'Hazten eta Jolasten',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqyVuj5lL6endDCU1Hjgoq2ibmNpEEEdMmKPy_UjknnDMQw46odyhB_H8Vraans4eI4B-crF3HMFj-727xJ-SxguY6dvQZEjtEUSX98pQJWw0hmmn1tyUipch15g0m0IIXaDIB6=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'escuela-de-cocina-aingeru-etxebarria',
        schoolName: 'Escuela de Cocina Aingeru Etxebarria',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrcm1SRJN5Xj7IGKCBfZL3MvGw7JYiGqVfVuD1BvenNzuqM4tGmMWTgNPtefU5BybU9-q4AfNUeUpByxJS58CSoHE9YlypUYFl0hgls8y7UAYGgCG0RkvxbO5HIGHd_zltj_-ENtA=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'escuela-de-hosteleria-de-gamarra',
        schoolName: 'Escuela de Hostelería de Gamarra',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipNTY40VIr5t29L5SHqYGIpW3jPgmjeyMWDDp7HP=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'egibide-mendizorrotza',
        schoolName: 'Egibide - Mendizorrotza',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipNR59SQZpRy51NDzkHg7ty8wRK2YDh_rheYcDIE=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'sualai',
        schoolName: 'Sualai',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqiFHcxFpyDek5lbmjXHAlGbh_NssDVSZHY4fIDIlV1WYu4LnvacXFBdgn0k2_VWbLerFrWfmJDuZqOCQXfNpGxX1RMca0qJ3kh2FgHO8zoBtoNcGB0EGHx4WlQMBpIcbMN_aqa=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'koilara-gastronomia',
        schoolName: 'Koilara Gastronomía',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipPm6fft_WXAJUaRAoQrXGy67fTtpH01mTbm4W7S=w800-h500-k-no',
        hasRealImage: true
      },
      {
        schoolId: 'escuela-de-cocina-eshbi-ribera',
        schoolName: 'Escuela de cocina - ESHBI Ribera',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMFyqy4dV-dD0BV4vEAk447_kpOhL-iraNNSRJp=w800-h500-k-no',
        hasRealImage: true
      },
      // Escuelas originales (necesitan imágenes AI)
      {
        schoolId: 'instituto-europeo-design-madrid',
        schoolName: 'Instituto Europeo di Design - Madrid',
        imageUrl: null,
        hasRealImage: false,
        prompt: 'Modern design institute building in Madrid, creative architecture, culinary arts school, students with design materials, contemporary Spanish architecture, ultra high resolution'
      },
      {
        schoolId: 'centro-culinario-ambrosia',
        schoolName: 'Centro Culinario Ambrosía',
        imageUrl: null,
        hasRealImage: false,
        prompt: 'Mexican culinary institute building, traditional meets modern architecture, Mexico City, cooking school atmosphere, students learning, ultra high resolution'
      },
      {
        schoolId: 'alma-colorno',
        schoolName: 'ALMA - La Scuola Internazionale di Cucina Italiana',
        imageUrl: null,
        hasRealImage: false,
        prompt: 'Historic Italian palazzo converted to culinary school, Colorno Italy, Palazzo Ducale, elegant Renaissance architecture, cooking academy, ultra high resolution'
      },
      {
        schoolId: 'institut-paul-bocuse',
        schoolName: 'Institut Paul Bocuse',
        imageUrl: null,
        hasRealImage: false,
        prompt: 'French culinary institute château building, Lyon France, Château du Vivier, prestigious cooking school, elegant French architecture, ultra high resolution'
      },
      {
        schoolId: 'le-cordon-bleu-paris',
        schoolName: 'Le Cordon Bleu Paris',
        imageUrl: null,
        hasRealImage: false,
        prompt: 'Prestigious culinary school building in Paris, classic French Haussmann architecture, Le Cordon Bleu signage, students and chefs, ultra high resolution'
      }
    ]

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const school of allSchools) {
      try {
        console.log(`🔄 Procesando ${school.schoolName} (${school.schoolId})...`)
        
        let imageBlob: Blob
        
        if (school.hasRealImage && school.imageUrl) {
          // Descargar imagen real desde URL externa
          console.log(`📥 Descargando imagen real: ${school.imageUrl}`)
          
          const response = await fetch(school.imageUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
          }
          
          imageBlob = await response.blob()
          console.log(`✅ Imagen descargada: ${imageBlob.size} bytes`)
          
        } else {
          // Generar imagen con OpenAI
          console.log(`🎨 Generando imagen AI con prompt: ${school.prompt}`)
          
          const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-image-1',
              prompt: school.prompt,
              size: '1024x1024',
              quality: 'high',
              output_format: 'jpeg',
              n: 1
            })
          })

          if (!openaiResponse.ok) {
            throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`)
          }

          const openaiData = await openaiResponse.json()
          const base64Image = openaiData.data[0].b64_json
          
          // Convertir base64 a blob
          const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0))
          imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' })
          console.log(`✅ Imagen AI generada: ${imageBlob.size} bytes`)
        }
        
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

        // Actualizar o insertar en la base de datos
        const { error: upsertError } = await supabase
          .from('school_images')
          .upsert({
            school_id: school.schoolId,
            image_url: publicUrl,
            image_type: school.hasRealImage ? 'real' : 'ai_generated',
            alt_text: `${school.schoolName} - Culinary School Building`,
            updated_at: new Date().toISOString()
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
          type: school.hasRealImage ? 'real' : 'ai_generated'
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
        total: allSchools.length,
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