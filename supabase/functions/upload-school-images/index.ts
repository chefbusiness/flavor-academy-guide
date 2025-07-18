import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting school images upload process...')

    // Mapping of school IDs to their image URLs (both local and external)
    const schoolImages = {
      'on-egin-academia-de-cocina': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrXzM11Jl5_VK9I2NrjRD5cmvJEs3wcyAF5rqqzvUlB3erzS67_7SPD2rSrGrrsWGJ-XFK5e8Vw1JCssawq1SL-9CCPUKQcpPfEsu3xk0MrESiQeEcoXJWV2QKGVEBi1KSaEzqkLA=w800-h500-k-no',
      'basque-culinary-center': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npy3N1vYxb6Ac8IvGj_cbA7HE5IDZY_21xU17dZPKonT8yiimlX4c53r_BLjwLnKo6KACUFV2a8ZAyOu4IehS4wmPNQnFwRO7TgZja7yMcMepJ4JtAtreWhaS249QPzNYUmbZ9j=w800-h500-k-no',
      'hazten-eta-jolasten': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqyVuj5lL6endDCU1Hjgoq2ibmNpEEEdMmKPy_UjknnDMQw46odyhB_H8Vraans4eI4B-crF3HMFj-727xJ-SxguY6dvQZEjtEUSX98pQJWw0hmmn1tyUipch15g0m0IIXaDIB6=w800-h500-k-no',
      'escuela-de-cocina-aingeru-etxebarria': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrcm1SRJN5Xj7IGKCBfZL3MvGw7JYiGqVfVuD1BvenNzuqM4tGmMWTgNPtefU5BybU9-q4AfNUeUpByxJS58CSoHE9YlypUYFl0hgls8y7UAYGgCG0RkvxbO5HIGHd_zltj_-ENtA=w800-h500-k-no',
      'escuela-de-hosteleria-de-gamarra': 'https://lh3.googleusercontent.com/p/AF1QipNTY40VIr5t29L5SHqYGIpW3jPgmjeyMWDDp7HP=w800-h500-k-no',
      'egibide-mendizorrotza': 'https://lh3.googleusercontent.com/p/AF1QipNR59SQZpRy51NDzkHg7ty8wRK2YDh_rheYcDIE=w800-h500-k-no',
      'sualai': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqiFHcxFpyDek5lbmjXHAlGbh_NssDVSZHY4fIDIlV1WYu4LnvacXFBdgn0k2_VWbLerFrWfmJDuZqOCQXfNpGxX1RMca0qJ3kh2FgHO8zoBtoNcGB0EGHx4WlQMBpIcbMN_aqa=w800-h500-k-no',
      'koilara-gastronomia': 'https://lh3.googleusercontent.com/p/AF1QipPm6fft_WXAJUaRAoQrXGy67fTtpH01mTbm4W7S=w800-h500-k-no',
      'escuela-de-cocina-eshbi-ribera': 'https://lh3.googleusercontent.com/p/AF1QipMFyqy4dV-dD0BV4vEAk447_kpOhL-iraNNSRJp=w800-h500-k-no'
    }

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const [schoolId, imageUrl] of Object.entries(schoolImages)) {
      try {
        console.log(`Processing ${schoolId}...`)
        
        // Download the image
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`)
        }
        
        const imageBlob = await response.blob()
        const fileName = `${schoolId}.jpg`
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('school-images')
          .upload(fileName, imageBlob, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          throw uploadError
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('school-images')
          .getPublicUrl(fileName)

        const publicUrl = publicUrlData.publicUrl

        // Update the database with the new URL
        const { error: updateError } = await supabase
          .from('school_images')
          .update({
            image_url: publicUrl,
            image_type: 'real',
            updated_at: new Date().toISOString()
          })
          .eq('school_id', schoolId)

        if (updateError) {
          throw updateError
        }

        console.log(`✅ Successfully processed ${schoolId}`)
        results.push({
          schoolId,
          status: 'success',
          url: publicUrl
        })
        successCount++

      } catch (error) {
        console.error(`❌ Error processing ${schoolId}:`, error)
        results.push({
          schoolId,
          status: 'error',
          error: error.message
        })
        errorCount++
      }
    }

    console.log(`Upload process completed: ${successCount} success, ${errorCount} errors`)

    return new Response(JSON.stringify({
      message: 'School images upload process completed',
      summary: {
        total: Object.keys(schoolImages).length,
        success: successCount,
        errors: errorCount
      },
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in upload process:', error)
    return new Response(JSON.stringify({ 
      error: 'Upload process failed', 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})