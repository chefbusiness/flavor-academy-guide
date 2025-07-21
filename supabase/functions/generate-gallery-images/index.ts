
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
    
    // Validate environment variables
    if (!openAIApiKey) {
      console.error('❌ Missing OPENAI_API_KEY');
      throw new Error('OpenAI API key not configured');
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase configuration');
      throw new Error('Supabase configuration missing');
    }
    
    const { schoolName, schoolId, category, description } = await req.json();
    
    if (!schoolName || !schoolId || !category) {
      console.error('❌ Missing required fields:', { schoolName, schoolId, category });
      throw new Error('Missing required fields: schoolName, schoolId, or category');
    }

    console.log(`📋 Generating image for: ${schoolName} (ID: ${schoolId}), Category: ${category}`);

    // Realistic category-specific prompts
    const generateRealisticCategoryPrompt = (schoolName: string, category: string) => {
      const basePrompts = {
        'kitchen-facilities': `Functional cooking kitchen at ${schoolName}. Practical stainless steel equipment, basic professional ovens and cooktops, clean work surfaces, educational cooking stations. Simple and organized learning environment, natural lighting, no luxury elements. Authentic culinary school kitchen.`,
        
        'classroom': `Educational cooking classroom at ${schoolName}. Students learning basic cooking techniques, instructor demonstrating, simple kitchen classroom setup, practical learning environment. Real cooking education, natural lighting, functional space.`,
        
        'students-cooking': `Students practicing cooking at ${schoolName}. Young people in aprons learning basic culinary skills, hands-on cooking education, practical kitchen environment, authentic learning atmosphere. Educational cooking session.`,
        
        'dishes-created': `Simple dishes prepared by students at ${schoolName}. Basic but well-prepared food, practical cooking results, educational meal presentation, authentic student work. Real cooking school dishes, natural food photography.`,
        
        'exterior-building': `Exterior view of ${schoolName} culinary school. Simple educational building, practical architecture, welcoming entrance for a cooking school, functional design. Real educational institution, natural daylight.`,
        
        'dining-area': `Simple dining and tasting area at ${schoolName}. Basic tables and chairs for food tasting, practical dining space for culinary education, functional and clean environment. Educational dining area, natural lighting.`
      };

      return basePrompts[category as keyof typeof basePrompts] || 
        `Practical educational space at ${schoolName} related to culinary training, category: ${category}. Functional and authentic learning environment.`;
    };

    const prompt = description || generateRealisticCategoryPrompt(schoolName, category);

    console.log(`🎨 Using realistic prompt: ${prompt.substring(0, 100)}...`);

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
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image:', imageResponse.status);
      throw new Error('Failed to download generated image');
    }
    
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Generate unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `${schoolId}-gallery-${category}-${timestamp}-${randomSuffix}.jpg`;
    const filePath = `gallery/${filename}`;

    console.log('☁️ Uploading to Supabase Storage:', filePath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('school-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('school-images')
      .getPublicUrl(filePath);

    const finalImageUrl = urlData.publicUrl;
    console.log('📎 Final image URL:', finalImageUrl);

    // Get next display order for this category
    console.log('🔍 Getting next display order...');
    const { data: existingImages, error: queryError } = await supabase
      .from('school_images')
      .select('display_order')
      .eq('school_id', schoolId)
      .eq('image_category', category)
      .order('display_order', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('❌ Query error:', queryError);
      // Continue anyway with default order
    }

    const nextOrder = existingImages && existingImages.length > 0 
      ? (existingImages[0].display_order || 0) + 1 
      : 1;

    console.log(`📊 Next display order: ${nextOrder}`);

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
        alt_text: `${schoolName} - ${category} (AI Generated - Realistic)`,
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      
      // If it's a unique constraint error, provide more helpful message
      if (dbError.code === '23505') {
        throw new Error(`Image already exists for this category. Try a different category or delete existing images first.`);
      }
      
      throw new Error(`Database save failed: ${dbError.message}`);
    }

    console.log('🎉 Realistic gallery image generated successfully!', dbData);

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
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
