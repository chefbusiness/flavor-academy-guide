
-- Add new columns to school_images table for gallery management
ALTER TABLE public.school_images 
ADD COLUMN IF NOT EXISTS image_category text DEFAULT 'main',
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Create index for better performance when querying by school and category
CREATE INDEX IF NOT EXISTS idx_school_images_school_category 
ON public.school_images(school_id, image_category);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_school_images_display_order 
ON public.school_images(school_id, display_order);

-- Update existing records to have 'main' category
UPDATE public.school_images 
SET image_category = 'main' 
WHERE image_category IS NULL;
