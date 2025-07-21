import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting gallery image generation...');
    
    const { schoolName, schoolId, category, description } = await req.json();
    
    if (!schoolName || !schoolId || !category) {
      throw new Error('Missing required fields: schoolName, schoolId, or category');
    }

    console.log(`📋 Generating image for: ${schoolName}, Category: ${category}`);

    // Category-specific prompts
    const categoryPrompts = {
      'kitchen-facilities': `Professional modern culinary kitchen facilities at ${schoolName}. Industrial-grade kitchen equipment, stainless steel surfaces, cooking stations, ovens, and culinary tools. Clean, bright, professional cooking environment. High-end culinary school kitchen.`,
      'classroom': `Modern culinary classroom at ${schoolName}. Students learning cooking techniques, chef instructor teaching, cooking demonstration, professional kitchen classroom setup. Educational culinary environment.`,
      'students-cooking': `Students actively cooking and learning at ${schoolName}. Young chefs in white uniforms and aprons practicing cooking techniques, collaborative learning, hands-on culinary education.`,
      'dishes-created': `Beautiful gourmet dishes and culinary creations made by students at ${schoolName}. Professional food plating, colorful ingredients, artistic food presentation, culinary masterpieces.`,
      'exterior-building': `Exterior view of ${schoolName} culinary school building. Modern educational architecture, professional signage, welcoming entrance, contemporary design.`,
      'dining-area': `Elegant dining area and tasting room at ${schoolName}. Professional restaurant-style dining space, tasteful table settings, comfortable seating for culinary tastings and events.`
    };

    const prompt = description || categoryPrompts[category as keyof typeof categoryPrompts] || 
      `Professional image related to culinary education at ${schoolName}, category: ${category}`;

    // Generate image with OpenAI
    console.log('🎨 Calling OpenAI DALL-E API...');
    const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const imageUrl = openAIData.data[0].url;

    console.log('✅ Image generated successfully:', imageUrl);

    // Download and upload to Supabase Storage
    console.log('📥 Downloading image...');
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${schoolId}-gallery-${category}-${timestamp}.jpg`;
    const filePath = `gallery/${filename}`;

    console.log('☁️ Uploading to Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('school-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('school-images')
      .getPublicUrl(filePath);

    const finalImageUrl = urlData.publicUrl;
    console.log('📎 Final image URL:', finalImageUrl);

    // Get next display order
    const { data: existingImages } = await supabase
      .from('school_images')
      .select('display_order')
      .eq('school_id', schoolId)
      .eq('image_category', category)
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = existingImages && existingImages.length > 0 
      ? (existingImages[0].display_order || 0) + 1 
      : 1;

    // Save to database
    console.log('💾 Saving to database...');
    const { data: dbData, error: dbError } = await supabase
      .from('school_images')
      .insert({
        school_id: schoolId,
        image_url: finalImageUrl,
        image_type: 'ai_generated',
        image_category: category,
        display_order: nextOrder,
        alt_text: `${schoolName} - ${category} (AI Generated)`,
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw dbError;
    }

    console.log('🎉 Gallery image generated successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: finalImageUrl,
        imageData: dbData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in generate-gallery-images:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});