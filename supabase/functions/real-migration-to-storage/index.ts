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

    // Mapeo completo con URLs de Google, prompts de IA y fallback local
    const schoolMappings = [
      {
        schoolId: 'basque-culinary-center',
        schoolName: 'Basque Culinary Center',
        googleUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npy3N1vYxb6Ac8IvGj_cbA7HE5IDZY_21xU17dZPKonT8yiimlX4c53r_BLjwLnKo6KACUFV2a8ZAyOu4IehS4wmPNQnFwRO7TgZja7yMcMepJ4JtAtreWhaS249QPzNYUmbZ9j=w800-h500-k-no',
        aiPrompt: 'Modern Basque culinary university building, San Sebastian Spain, contemporary architecture, students and chefs walking, Basque Culinary Center signage, professional photography, ultra high resolution',
        localFileName: 'basque-culinary-center.jpg'
      },
      {
        schoolId: 'on-egin-academia-de-cocina',
        schoolName: 'On - Egin Academia De Cocina',
        googleUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrXzM11Jl5_VK9I2NrjRD5cmvJEs3wcyAF5rqqzvUlB3erzS67_7SPD2rSrGrrsWGJ-XFK5e8Vw1JCssawq1SL-9CCPUKQcpPfEsu3xk0MrESiQeEcoXJWV2QKGVEBi1KSaEzqkLA=w800-h500-k-no',
        aiPrompt: 'Modern cooking school building in Vitoria-Gasteiz, Basque Country, contemporary architecture, culinary education center, students learning cooking, professional photography, ultra high resolution',
        localFileName: 'on-egin-academia.jpg'
      },
      {
        schoolId: 'hazten-eta-jolasten',
        schoolName: 'Hazten eta Jolasten',
        googleUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqyVuj5lL6endDCU1Hjgoq2ibmNpEEEdMmKPy_UjknnDMQw46odyhB_H8Vraans4eI4B-crF3HMFj-727xJ-SxguY6dvQZEjtEUSX98pQJWw0hmmn1tyUipch15g0m0IIXaDIB6=w800-h500-k-no',
        aiPrompt: 'Cozy family cooking school building, Basque Country style architecture, intimate culinary education center, warm lighting, families learning to cook together, ultra high resolution',
        localFileName: 'hazten-eta-jolasten.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-aingeru-etxebarria',
        schoolName: 'Escuela de Cocina Aingeru Etxebarria',
        googleUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrcm1SRJN5Xj7IGKCBfZL3MvGw7JYiGqVfVuD1BvenNzuqM4tGmMWTgNPtefU5BybU9-q4AfNUeUpByxJS58CSoHE9YlypUYFl0hgls8y7UAYGgCG0RkvxbO5HIGHd_zltj_-ENtA=w800-h500-k-no',
        aiPrompt: 'Traditional Basque cooking school building in Bilbao, Spanish culinary institute, chef Aingeru Etxebarria style, professional kitchen training center, ultra high resolution',
        localFileName: 'aingeru-etxebarria.jpg'
      },
      {
        schoolId: 'escuela-de-hosteleria-de-gamarra',
        schoolName: 'Escuela de Hostelería de Gamarra',
        googleUrl: 'https://lh3.googleusercontent.com/p/AF1QipNTY40VIr5t29L5SHqYGIpW3jPgmjeyMWDDp7HP=w800-h500-k-no',
        aiPrompt: 'Professional hospitality school building in Vitoria-Gasteiz, modern Spanish architecture, culinary and hospitality training center, students in chef uniforms, ultra high resolution',
        localFileName: 'gamarra-hosteleria.jpg'
      },
      {
        schoolId: 'egibide-mendizorrotza',
        schoolName: 'Egibide - Mendizorrotza',
        googleUrl: 'https://lh3.googleusercontent.com/p/AF1QipNR59SQZpRy51NDzkHg7ty8wRK2YDh_rheYcDIE=w800-h500-k-no',
        aiPrompt: 'Modern vocational training center in Vitoria-Gasteiz, Egibide campus, contemporary educational architecture, culinary and hospitality students, ultra high resolution',
        localFileName: 'egibide-mendizorrotza.jpg'
      },
      {
        schoolId: 'sualai',
        schoolName: 'Sualai',
        googleUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqiFHcxFpyDek5lbmjXHAlGbh_NssDVSZHY4fIDIlV1WYu4LnvacXFBdgn0k2_VWbLerFrWfmJDuZqOCQXfNpGxX1RMca0qJ3kh2FgHO8zoBtoNcGB0EGHx4WlQMBpIcbMN_aqa=w800-h500-k-no',
        aiPrompt: 'Modern hospitality school building in Vitoria-Gasteiz, Sualai culinary institute, contemporary Spanish architecture, professional kitchen training, ultra high resolution',
        localFileName: 'sualai.jpg'
      },
      {
        schoolId: 'koilara-gastronomia',
        schoolName: 'Koilara Gastronomía',
        googleUrl: 'https://lh3.googleusercontent.com/p/AF1QipPm6fft_WXAJUaRAoQrXGy67fTtpH01mTbm4W7S=w800-h500-k-no',
        aiPrompt: 'Contemporary cooking school building in Bilbao, Koilara Gastronomía, modern Basque architecture, culinary arts center, chefs and students, ultra high resolution',
        localFileName: 'koilara-gastronomia.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-eshbi-ribera',
        schoolName: 'Escuela de cocina - ESHBI Ribera',
        googleUrl: 'https://lh3.googleusercontent.com/p/AF1QipMFyqy4dV-dD0BV4vEAk447_kpOhL-iraNNSRJp=w800-h500-k-no',
        aiPrompt: 'Professional cooking school building near Bilbao Ribera market, traditional Basque architecture meets modern culinary education, ESHBI signage, ultra high resolution',
        localFileName: 'eshbi-ribera.jpg'
      },
      {
        schoolId: 'instituto-europeo-design-madrid',
        schoolName: 'Instituto Europeo di Design - Madrid',
        googleUrl: null,
        aiPrompt: 'Modern design institute building in Madrid, Instituto Europeo di Design, creative architecture, culinary arts and design school, students with portfolios, contemporary Spanish architecture, ultra high resolution',
        localFileName: 'ied-madrid.jpg'
      },
      {
        schoolId: 'centro-culinario-ambrosia',
        schoolName: 'Centro Culinario Ambrosía',
        googleUrl: null,
        aiPrompt: 'Mexican culinary institute building in Mexico City, Centro Culinario Ambrosía, traditional Mexican architecture meets modern culinary education, cooking school atmosphere, ultra high resolution',
        localFileName: 'centro-culinario-ambrosia.jpg'
      },
      {
        schoolId: 'alma-colorno',
        schoolName: 'ALMA - La Scuola Internazionale di Cucina Italiana',
        googleUrl: null,
        aiPrompt: 'Historic Italian palazzo converted to culinary school in Colorno, ALMA cooking academy, Palazzo Ducale architecture, elegant Renaissance building, Italian culinary students, ultra high resolution',
        localFileName: 'alma-colorno.jpg'
      },
      {
        schoolId: 'institut-paul-bocuse',
        schoolName: 'Institut Paul Bocuse',
        googleUrl: null,
        aiPrompt: 'French culinary institute château building in Lyon, Institut Paul Bocuse, Château du Vivier, prestigious cooking school, elegant French architecture, culinary students and chefs, ultra high resolution',
        localFileName: 'institut-paul-bocuse.jpg'
      },
      {
        schoolId: 'le-cordon-bleu-paris',
        schoolName: 'Le Cordon Bleu Paris',
        googleUrl: null,
        aiPrompt: 'Prestigious culinary school building in Paris, Le Cordon Bleu, classic French Haussmann architecture, elegant culinary institute, students in white chef uniforms, ultra high resolution',
        localFileName: 'le-cordon-bleu-paris.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-bilbao-laratz',
        schoolName: 'Escuela de cocina Bilbao Laratz',
        googleUrl: null,
        aiPrompt: 'Modern cooking school in Bilbao, Laratz culinary institute, contemporary Basque architecture, professional kitchen facilities, culinary students learning, ultra high resolution',
        localFileName: 'escuela-de-cocina-bilbao-laratz.jpg'
      },
      {
        schoolId: 'escuela-superior-de-hosteleria-bilbao',
        schoolName: 'Escuela Superior de Hostelería de Bilbao',
        googleUrl: null,
        aiPrompt: 'Superior hospitality school building in Bilbao, modern Spanish educational architecture, professional culinary and hospitality training center, students in uniforms, ultra high resolution',
        localFileName: 'escuela-superior-de-hosteleria-bilbao.jpg'
      },
      {
        schoolId: 'escuela-de-cocina-malaespera',
        schoolName: 'Escuela de Cocina Malaespera',
        googleUrl: null,
        aiPrompt: 'Creative cooking school building in Bilbao, Malaespera culinary arts center, modern Basque architecture, innovative culinary education space, ultra high resolution',
        localFileName: 'escuela-de-cocina-malaespera.jpg'
      },
      {
        schoolId: 'aula-gastronomica-mercado-de-la-ribera',
        schoolName: 'Aula Gastronómica Mercado de La Ribera',
        googleUrl: null,
        aiPrompt: 'Gastronomic classroom inside Mercado de la Ribera Bilbao, traditional market architecture, culinary education space within historic market building, cooking classes, ultra high resolution',
        localFileName: 'aula-gastronomica-mercado-de-la-ribera.jpg'
      },
      {
        schoolId: 'bsc-formacion',
        schoolName: 'BSC FORMACIÓN',
        googleUrl: null,
        aiPrompt: 'Professional culinary training center BSC Formación, modern educational building, cooking and hospitality school, students in professional kitchens, ultra high resolution',
        localFileName: 'bsc-formacion.jpg'
      },
      {
        schoolId: 'farmacook',
        schoolName: 'Farmacook',
        googleUrl: null,
        aiPrompt: 'Innovative culinary school Farmacook, modern sustainable architecture, farm-to-table cooking education, organic garden and kitchen facilities, ultra high resolution',
        localFileName: 'farmacook.jpg'
      },
      {
        schoolId: 'hosteleria-de-leioa',
        schoolName: 'Hostelería de Leioa',
        googleUrl: null,
        aiPrompt: 'Hospitality school building in Leioa, Basque Country, modern educational architecture, professional culinary and hospitality training, students learning, ultra high resolution',
        localFileName: 'hosteleria-de-leioa.jpg'
      },
      {
        schoolId: 'keicook',
        schoolName: 'Keicook',
        googleUrl: null,
        aiPrompt: 'Contemporary cooking school Keicook, modern minimalist architecture, professional culinary education center, innovative kitchen design, culinary students, ultra high resolution',
        localFileName: 'keicook.jpg'
      },
      {
        schoolId: 'sukaldikas-escuela-de-cocina-macrobiotica',
        schoolName: 'Sukaldikas - Escuela de Cocina Macrobiótica',
        googleUrl: null,
        aiPrompt: 'Macrobiotic cooking school Sukaldikas, natural sustainable architecture, organic culinary education center, healthy cooking classes, zen-like atmosphere, ultra high resolution',
        localFileName: 'sukaldikas-escuela-de-cocina-macrobiotica.jpg'
      }
    ]

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const school of schoolMappings) {
      try {
        console.log(`🔄 Procesando ${school.schoolName} (${school.schoolId})...`)
        
        let imageBlob: Blob | null = null
        let imageSource = 'unknown'

        // PASO 1: Intentar descargar desde Google
        if (school.googleUrl) {
          try {
            console.log(`📥 Intentando descarga desde Google: ${school.googleUrl}`)
            const googleResponse = await fetch(school.googleUrl)
            if (googleResponse.ok) {
              imageBlob = await googleResponse.blob()
              imageSource = 'google'
              console.log(`✅ Imagen descargada de Google: ${imageBlob.size} bytes`)
            } else {
              console.log(`❌ Google falló: ${googleResponse.status} ${googleResponse.statusText}`)
            }
          } catch (error) {
            console.log(`❌ Error descargando de Google: ${error.message}`)
          }
        }

        // PASO 2: Si Google falló, generar con IA
        if (!imageBlob && school.aiPrompt) {
          try {
            console.log(`🎨 Generando imagen con IA: ${school.aiPrompt}`)
            
            const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-image-1',
                prompt: school.aiPrompt,
                size: '1024x1024',
                quality: 'high',
                output_format: 'jpeg',
                n: 1
              })
            })

            if (openaiResponse.ok) {
              const openaiData = await openaiResponse.json()
              const base64Image = openaiData.data[0].b64_json
              
              // Convertir base64 a blob
              const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0))
              imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' })
              imageSource = 'ai_generated'
              console.log(`✅ Imagen generada con IA: ${imageBlob.size} bytes`)
            } else {
              console.log(`❌ OpenAI falló: ${openaiResponse.status} ${openaiResponse.statusText}`)
            }
          } catch (error) {
            console.log(`❌ Error generando con IA: ${error.message}`)
          }
        }

        // PASO 3: Si todo falló, usar imagen local como último recurso
        if (!imageBlob && school.localFileName) {
          try {
            console.log(`📁 Usando imagen local: ${school.localFileName}`)
            const localResponse = await fetch(`https://a36f5b0b-a936-4882-9398-32a9cf8774a0.lovableproject.com/src/assets/schools/${school.localFileName}`)
            
            if (localResponse.ok) {
              imageBlob = await localResponse.blob()
              imageSource = 'local'
              console.log(`✅ Imagen local obtenida: ${imageBlob.size} bytes`)
            } else {
              console.log(`❌ Imagen local falló: ${localResponse.status}`)
            }
          } catch (error) {
            console.log(`❌ Error obteniendo imagen local: ${error.message}`)
          }
        }

        // Si no conseguimos ninguna imagen, lanzar error
        if (!imageBlob) {
          throw new Error('No se pudo obtener imagen de ninguna fuente (Google, IA o local)')
        }
        
        // Subir a Supabase Storage
        const fileName = `${school.schoolId}.jpg`
        console.log(`📤 Subiendo a Supabase Storage: ${fileName} (fuente: ${imageSource})`)
        
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
            image_type: imageSource,
            alt_text: `${school.schoolName} - Escuela de Cocina`,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'school_id'
          })

        if (upsertError) {
          throw upsertError
        }

        console.log(`✅ SUCCESS: ${school.schoolName} -> ${publicUrl} (${imageSource})`)
        results.push({
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          status: 'success',
          url: publicUrl,
          type: imageSource
        })
        successCount++

        // Pequeña pausa para no sobrecargar las APIs
        await new Promise(resolve => setTimeout(resolve, 500))

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

    console.log(`🎉 MIGRACIÓN INTELIGENTE COMPLETADA: ${successCount} éxitos, ${errorCount} errores`)

    return new Response(JSON.stringify({
      message: 'Migración inteligente completada - Imágenes obtenidas de Google, IA o archivos locales',
      summary: {
        total: schoolMappings.length,
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