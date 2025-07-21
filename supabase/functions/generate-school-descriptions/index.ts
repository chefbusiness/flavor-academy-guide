
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { schoolId, action } = await req.json();
    
    if (!schoolId || !action) {
      throw new Error('schoolId and action are required');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log(`Processing ${action} for school ${schoolId}`);

    // Get school data
    const { data: school, error: fetchError } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (fetchError || !school) {
      throw new Error('School not found');
    }

    let prompt = '';
    let systemPrompt = '';
    let updateField = '';

    switch (action) {
      case 'generate_spanish':
        systemPrompt = `Eres un redactor especializado en content marketing para escuelas culinarias. 
                       Crea descripciones profesionales, atractivas y optimizadas para SEO.`;
        prompt = `Crea una descripción profesional de 400-500 caracteres para esta escuela culinaria:

Nombre: ${school.name}
Tipo: ${school.type}
Ciudad: ${school.city}, ${school.country}
Año fundación: ${school.founded}
Especialidades: ${Array.isArray(school.specialties) ? school.specialties.join(', ') : 'Gastronomía general'}
Características: ${Array.isArray(school.features) ? school.features.join(', ') : 'Formación práctica'}

Requisitos:
- 400-500 caracteres exactos
- Menciona fortalezas específicas y metodología
- Tono profesional pero atractivo
- Optimizada para SEO
- Incluye información sobre instalaciones o programas destacados`;
        updateField = 'description';
        break;

      case 'regenerate_spanish':
        systemPrompt = `Eres un redactor especializado en mejorar contenido para escuelas culinarias.
                       Mejora y enriquece descripciones existentes manteniendo información clave.`;
        prompt = `Mejora esta descripción de escuela culinaria existente:

Descripción actual: "${school.description}"

Datos de la escuela:
Nombre: ${school.name}
Tipo: ${school.type}
Ciudad: ${school.city}, ${school.country}
Especialidades: ${Array.isArray(school.specialties) ? school.specialties.join(', ') : 'Gastronomía general'}
Características: ${Array.isArray(school.features) ? school.features.join(', ') : 'Formación práctica'}

Requisitos:
- Mantén 400-500 caracteres
- Mejora la redacción y estructura
- Añade información más específica sobre metodología o instalaciones
- Tono profesional y atractivo
- Optimizada para SEO`;
        updateField = 'description';
        break;

      case 'generate_english':
        if (!school.description) {
          throw new Error('Spanish description is required to generate English version');
        }
        systemPrompt = `You are a professional translator specializing in educational content and SEO.
                       Create engaging English descriptions for culinary schools.`;
        prompt = `Translate and adapt this Spanish culinary school description to English:

Spanish description: "${school.description}"

School details:
Name: ${school.name}
Type: ${school.type}
Location: ${school.city}, ${school.country}
Specialties: ${Array.isArray(school.specialties) ? school.specialties.join(', ') : 'General Gastronomy'}

Requirements:
- 400-500 characters in English
- Professional, engaging tone
- SEO-optimized for international students
- Maintain key information about methodology and facilities
- Natural English that appeals to global audience`;
        updateField = 'description_en';
        break;

      case 'regenerate_english':
        if (!school.description_en) {
          throw new Error('No English description exists to regenerate');
        }
        systemPrompt = `You are a professional content editor specializing in educational content.
                       Improve existing English descriptions for culinary schools.`;
        prompt = `Improve this existing English description for a culinary school:

Current English description: "${school.description_en}"
Spanish reference: "${school.description}"

School details:
Name: ${school.name}
Type: ${school.type}
Location: ${school.city}, ${school.country}

Requirements:
- Keep 400-500 characters
- Improve clarity and engagement
- Maintain professional tone
- SEO-optimized for international market
- Better structure and flow`;
        updateField = 'description_en';
        break;

      default:
        throw new Error('Invalid action');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedDescription = data.choices[0].message.content.trim();

    // Update the school in database
    const updateData = { [updateField]: generatedDescription };
    
    const { error: updateError } = await supabase
      .from('schools')
      .update(updateData)
      .eq('id', schoolId);

    if (updateError) {
      throw new Error(`Failed to update school: ${updateError.message}`);
    }

    console.log(`Successfully ${action} for school ${school.name}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        description: generatedDescription,
        action,
        field: updateField,
        length: generatedDescription.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-school-descriptions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
