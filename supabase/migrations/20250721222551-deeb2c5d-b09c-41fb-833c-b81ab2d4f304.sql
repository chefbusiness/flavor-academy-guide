-- Drop the unique constraint on school_id to allow multiple images per school
ALTER TABLE public.school_images DROP CONSTRAINT IF EXISTS school_images_school_id_key;

-- Create a unique constraint on school_id and image_category for main images only
-- This allows multiple gallery images but only one main image per school
ALTER TABLE public.school_images 
ADD CONSTRAINT school_images_main_unique 
UNIQUE (school_id, image_category) 
DEFERRABLE INITIALLY DEFERRED;