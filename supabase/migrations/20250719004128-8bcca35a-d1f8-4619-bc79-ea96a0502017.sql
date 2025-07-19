
-- Add description_en column to schools table
ALTER TABLE public.schools 
ADD COLUMN description_en TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.schools.description_en IS 'School description in English, translated from Spanish description';
