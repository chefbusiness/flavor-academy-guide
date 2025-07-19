
-- Add English translation columns to schools table
ALTER TABLE public.schools 
ADD COLUMN features_en JSONB DEFAULT '[]'::jsonb,
ADD COLUMN accreditation_en JSONB DEFAULT '[]'::jsonb,
ADD COLUMN specialties_en JSONB DEFAULT '[]'::jsonb;

-- Add comments to explain the columns
COMMENT ON COLUMN public.schools.features_en IS 'School features translated to English';
COMMENT ON COLUMN public.schools.accreditation_en IS 'School accreditations translated to English';
COMMENT ON COLUMN public.schools.specialties_en IS 'School specialties translated to English';
