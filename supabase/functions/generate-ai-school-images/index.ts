
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { schoolId, schoolName, regenerate = false } = await req.json();

    console.log(`🎨 Generating AI image for: ${schoolName} (ID: ${schoolId})`);

    // Check if image already exists
    if (!regenerate) {
      const { data: existingImage } = await supabase
        .from('school_images')
        .select('*')
        .eq('school_id', schoolId)
        .eq('image_type', 'ai_generated')
        .single();

      if (existingImage) {
        console.log('✅ Image already exists, skipping generation');
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Image already exists',
          imageUrl: existingImage.image_url 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate image with OpenAI DALL-E
    const prompt = `Modern culinary school building for "${schoolName}", professional architectural photography, contemporary design, cooking facilities visible through windows, warm lighting, educational institution, high quality, realistic style`;

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }),
    });

    if (!imageResponse.ok) {
      throw new Error(`OpenAI API error: ${imageResponse.statusText}`);
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data[0].url;

    console.log(`🖼️ Generated image URL: ${imageUrl}`);

    // Download the image
    const downloadResponse = await fetch(imageUrl);
    if (!downloadResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBlob = await downloadResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Upload to Supabase Storage
    const fileName = `${schoolId}-ai-generated.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('school-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('school-images')
      .getPublicUrl(fileName);

    console.log(`📤 Uploaded to Storage: ${publicUrl}`);

    // Save to database
    const { error: dbError } = await supabase
      .from('school_images')
      .upsert({
        school_id: schoolId,
        image_url: publicUrl,
        image_type: 'ai_generated',
        alt_text: `${schoolName} - AI generated culinary school building`,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      throw new Error(`Database save failed: ${dbError.message}`);
    }

    // Update school's main image if it doesn't have one
    const { data: school } = await supabase
      .from('schools')
      .select('image')
      .eq('id', schoolId)
      .single();

    if (!school?.image) {
      await supabase
        .from('schools')
        .update({ image: publicUrl })
        .eq('id', schoolId);
    }

    console.log(`✅ Successfully generated and saved AI image for ${schoolName}`);

    return new Response(JSON.stringify({
      success: true,
      imageUrl: publicUrl,
      schoolName: schoolName
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
