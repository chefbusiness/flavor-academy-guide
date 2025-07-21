
-- Remove the unique constraint that prevents multiple images per school
ALTER TABLE public.school_images 
DROP CONSTRAINT IF EXISTS school_images_school_id_key;

-- Add a composite unique constraint to prevent duplicate images of the same category and order for a school
-- This allows multiple images per school but prevents conflicts within categories
ALTER TABLE public.school_images 
ADD CONSTRAINT school_images_school_category_order_unique 
UNIQUE (school_id, image_category, display_order);

-- Update any records that might have conflicting display_order values
UPDATE public.school_images 
SET display_order = 
  CASE 
    WHEN image_category = 'main' THEN 0
    ELSE ROW_NUMBER() OVER (PARTITION BY school_id, image_category ORDER BY created_at)
  END
WHERE display_order IS NULL OR display_order = 0;
