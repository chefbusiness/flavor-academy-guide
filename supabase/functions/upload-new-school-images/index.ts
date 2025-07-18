import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// New schools image data
const newSchoolsImages = [
  {
    id: '18',
    name: 'HOSTELERIA DE LEIOA',
    slug: 'hosteleria-de-leioa',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipNslF9GJrs2q0eAFBpPwP3DS5W49VzwNaWEfuFQ=w800-h500-k-no'
  },
  {
    id: '19',
    name: 'Escuela de cocina Bilbao Laratz',
    slug: 'escuela-de-cocina-bilbao-laratz',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npOK4dSsOkzPIlvF18qkPiLtil2Hpk5l2S9LmlWIL18TDLShciMLodp8_C6MQTAe7aPjfy3EPebf8iyxJQSX5HXI2WCS7-n2AqIhhLnsRs3qWQMyyotRP99MCy5WS8cwZxjPeXw=w1600-h1000-k-no'
  },
  {
    id: '20',
    name: 'FARMACOOK',
    slug: 'farmacook',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4np7MWi1nw2P1kfQCLPiPJ_yJqn2hhl4E4_vTcvJ9aAT46MNjvTqyw7op01EOIPrAeQuL5l0MuolBdkNCJKdbIAMrZin3P6ZQCmhG2GzBtPARrrm3g9ITxj5ZLTIEkYnmg0a1srBCQ=w800-h500-k-no'
  },
  {
    id: '21',
    name: 'Keicook',
    slug: 'keicook',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipOkBJ3t96nKKNFqqNMOpjqR_ub0qtyKY3BYbP-8=w800-h500-k-no'
  },
  {
    id: '22',
    name: 'Escuela Superior de Hostelería Bilbao',
    slug: 'escuela-superior-de-hosteleria-bilbao',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipObLzANJjm_F1pg8et_o7L2wR60COhmHzsbDmsg=w800-h500-k-no'
  },
  {
    id: '23',
    name: 'Aula Gastronómica Mercado de La Ribera',
    slug: 'aula-gastronomica-mercado-de-la-ribera',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nprI2MyBgRrPPFw_VQVFUMc86kr4uQnRbzI1TuaySU9FYioLoMws4sv8lhXp1JpV0f4C6ra7o6fbjyJsnZYJI2mnvnpWGcgcMHTl1hEnNozU4pDefpBuVGZY8SpQmd_R351Y3hWRQ=w800-h500-k-no'
  },
  {
    id: '24',
    name: 'Escuela de Cocina Malaespera',
    slug: 'escuela-de-cocina-malaespera',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipM5Pc1AP6vYcygtpXDmhPuwLRY8NNZ-d-WVSE2Q=w800-h500-k-no'
  },
  {
    id: '25',
    name: 'Sukaldikas Escuela de Cocina Macrobiótica y Saludable',
    slug: 'sukaldikas-escuela-de-cocina-macrobiotica',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMiet4mJ4vpjjM-cqxLmmoaPzfbxQSIGxb1xAZv=w800-h500-k-no'
  },
  {
    id: '26',
    name: 'BSC FORMACIÓN',
    slug: 'bsc-formacion',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipNT2SyyNCGE-ZkYXrhAV3q8hiTzG_488s70kRl8=w800-h500-k-no'
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando subida de imágenes de nuevas escuelas...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const school of newSchoolsImages) {
      try {
        console.log(`🔄 Procesando ${school.name} (${school.slug})...`);

        // Download image from Google
        console.log(`📥 Descargando imagen: ${school.imageUrl}`);
        const imageResponse = await fetch(school.imageUrl);
        
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const uint8Array = new Uint8Array(imageBuffer);
        
        console.log(`✅ Imagen descargada: ${uint8Array.length} bytes`);

        // Upload to Supabase Storage
        const fileName = `${school.slug}.jpg`;
        console.log(`📤 Subiendo a Supabase Storage: ${fileName}`);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('school-images')
          .upload(fileName, uint8Array, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('school-images')
          .getPublicUrl(fileName);

        console.log(`🔗 URL pública: ${publicUrl}`);

        // Save to database
        console.log(`💾 Guardando en base de datos...`);
        const { error: dbError } = await supabase
          .from('school_images')
          .upsert({
            school_id: school.slug,
            image_url: publicUrl,
            alt_text: `${school.name} - Escuela de Cocina`,
            image_type: 'main'
          });

        if (dbError) {
          console.log(`⚠️ Error en BD (puede ser duplicado): ${dbError.message}`);
        }

        console.log(`✅ ${school.name} procesado exitosamente`);
        successCount++;
        
        results.push({
          school: school.name,
          slug: school.slug,
          status: 'success',
          publicUrl: publicUrl
        });

      } catch (error) {
        console.error(`❌ ERROR: ${school.name}: ${error}`);
        errorCount++;
        
        results.push({
          school: school.name,
          slug: school.slug,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log(`🎉 PROCESO COMPLETADO: ${successCount} éxitos, ${errorCount} errores`);

    return new Response(JSON.stringify({
      success: true,
      message: `Proceso completado: ${successCount} éxitos, ${errorCount} errores`,
      results: results,
      summary: {
        total: newSchoolsImages.length,
        success: successCount,
        errors: errorCount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error general:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});