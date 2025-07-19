import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Starting English description generation...');

    // Get all schools that don't have English descriptions yet
    const { data: schools, error: fetchError } = await supabase
      .from('schools')
      .select('id, name, description, description_en')
      .is('description_en', null)
      .eq('is_active', true);

    if (fetchError) {
      console.error('Error fetching schools:', fetchError);
      throw new Error('Failed to fetch schools');
    }

    if (!schools || schools.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No schools need English descriptions - all are already translated',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${schools.length} schools to translate`);

    let processed = 0;
    let errors = 0;

    // Process schools in batches to avoid overwhelming OpenAI API
    for (const school of schools) {
      try {
        console.log(`Translating description for: ${school.name}`);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a professional translator specializing in educational content and SEO. 
                         Translate the following Spanish culinary school description to English. 
                         Requirements:
                         - Maintain professional, engaging tone
                         - Keep length between 400-500 characters
                         - Make it SEO-friendly
                         - Preserve key information about the school
                         - Use natural English that appeals to international students
                         - Don't translate the school name itself`
              },
              {
                role: 'user',
                content: `School name: ${school.name}\n\nSpanish description: ${school.description}`
              }
            ],
            temperature: 0.3,
            max_tokens: 200,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const englishDescription = data.choices[0].message.content.trim();

        // Update the school with the English description
        const { error: updateError } = await supabase
          .from('schools')
          .update({ description_en: englishDescription })
          .eq('id', school.id);

        if (updateError) {
          console.error(`Error updating school ${school.name}:`, updateError);
          errors++;
        } else {
          processed++;
          console.log(`Successfully translated: ${school.name}`);
        }

        // Add a small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing school ${school.name}:`, error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'English descriptions generation completed',
        processed,
        errors,
        total: schools.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-english-descriptions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});