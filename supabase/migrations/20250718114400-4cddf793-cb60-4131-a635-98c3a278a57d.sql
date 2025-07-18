
-- Crear bucket para almacenar imágenes de escuelas
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES (
  'school-images',
  'school-images', 
  true,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Crear tabla para gestionar metadatos de imágenes
CREATE TABLE public.school_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('real', 'ai_generated')),
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Políticas RLS para acceso público a las imágenes
ALTER TABLE public.school_images ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de imágenes
CREATE POLICY "Allow public read access to school images" 
ON public.school_images FOR SELECT 
USING (true);

-- Permitir inserción y actualización (para futuras funcionalidades de admin)
CREATE POLICY "Allow authenticated users to manage school images" 
ON public.school_images FOR ALL 
USING (auth.role() = 'authenticated');

-- Políticas para el bucket de storage
CREATE POLICY "Allow public read access to school images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-images');

CREATE POLICY "Allow authenticated users to upload school images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'school-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update school images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete school images"
ON storage.objects FOR DELETE
USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');
