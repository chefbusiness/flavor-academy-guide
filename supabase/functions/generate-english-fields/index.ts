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
    
    console.log('Starting English fields generation...');

    // Get all schools that don't have English fields yet
    const { data: schools, error: fetchError } = await supabase
      .from('schools')
      .select('id, name, specialties, features, accreditation, specialties_en, features_en, accreditation_en')
      .eq('is_active', true);

    if (fetchError) {
      console.error('Error fetching schools:', fetchError);
      throw new Error('Failed to fetch schools');
    }

    if (!schools || schools.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No schools found',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter schools that need translation
    const schoolsToTranslate = schools.filter(school => 
      !school.specialties_en || !school.features_en || !school.accreditation_en
    );

    if (schoolsToTranslate.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'All schools already have English translations',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${schoolsToTranslate.length} schools to translate`);

    let processed = 0;
    let errors = 0;

    // Process schools one by one
    for (const school of schoolsToTranslate) {
      try {
        console.log(`Translating fields for: ${school.name}`);

        const updates: any = {};

        // Translate specialties if needed
        if (!school.specialties_en && school.specialties) {
          const specialtiesArray = JSON.parse(school.specialties);
          if (specialtiesArray.length > 0) {
            const specialtiesResponse = await translateArray(specialtiesArray, 'culinary specialties');
            updates.specialties_en = JSON.stringify(specialtiesResponse);
          }
        }

        // Translate features if needed
        if (!school.features_en && school.features) {
          const featuresArray = JSON.parse(school.features);
          if (featuresArray.length > 0) {
            const featuresResponse = await translateArray(featuresArray, 'school features');
            updates.features_en = JSON.stringify(featuresResponse);
          }
        }

        // Translate accreditation if needed
        if (!school.accreditation_en && school.accreditation) {
          const accreditationArray = JSON.parse(school.accreditation);
          if (accreditationArray.length > 0) {
            const accreditationResponse = await translateArray(accreditationArray, 'accreditations');
            updates.accreditation_en = JSON.stringify(accreditationResponse);
          }
        }

        // Update the school only if there are changes
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('schools')
            .update(updates)
            .eq('id', school.id);

          if (updateError) {
            console.error(`Error updating school ${school.name}:`, updateError);
            errors++;
          } else {
            processed++;
            console.log(`Successfully translated fields for: ${school.name}`);
          }
        }

        // Add a small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error processing school ${school.name}:`, error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'English fields generation completed',
        processed,
        errors,
        total: schoolsToTranslate.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-english-fields function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function translateArray(items: string[], context: string): Promise<string[]> {
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
          content: `You are a professional translator specializing in culinary education. 
                   Translate the following Spanish ${context} to English.
                   Requirements:
                   - Maintain professional terminology
                   - Use industry-standard English terms
                   - Keep translations concise but accurate
                   - Return ONLY a JSON array of translated strings
                   - Do not include any explanation, just the JSON array`
        },
        {
          role: 'user',
          content: `Translate this array to English: ${JSON.stringify(items)}`
        }
      ],
      temperature: 0.2,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.choices[0].message.content.trim();
  
  try {
    return JSON.parse(translatedText);
  } catch (parseError) {
    console.error('Error parsing translation response:', translatedText);
    throw new Error('Failed to parse translation response');
  }
}