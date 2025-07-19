
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from '@/utils/slugUtils';
import { useToast } from '@/hooks/use-toast';
import { Sync, Loader2 } from 'lucide-react';

export const SlugSyncButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const syncSlugs = async () => {
    try {
      setIsLoading(true);
      
      // Get all schools
      const { data: schools, error } = await supabase
        .from('schools')
        .select('id, name, slug');

      if (error) throw error;

      if (!schools) {
        toast({
          title: "No schools found",
          description: "No schools to update",
          variant: "destructive"
        });
        return;
      }

      let updatedCount = 0;
      const updates = [];

      for (const school of schools) {
        const generatedSlug = generateSlug(school.name);
        
        // Only update if slug is missing or different
        if (!school.slug || school.slug !== generatedSlug) {
          console.log(`🔄 Updating slug for "${school.name}": "${school.slug}" -> "${generatedSlug}"`);
          updates.push({
            id: school.id,
            slug: generatedSlug
          });
          updatedCount++;
        }
      }

      if (updates.length === 0) {
        toast({
          title: "All slugs are up to date",
          description: "No schools needed slug updates",
        });
        return;
      }

      // Update schools in batches
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('schools')
          .update({ slug: update.slug })
          .eq('id', update.id);

        if (updateError) {
          console.error('Error updating school slug:', updateError);
          throw updateError;
        }
      }

      toast({
        title: "Slugs synchronized successfully",
        description: `Updated ${updatedCount} school slugs`,
      });

      console.log(`✅ Successfully updated ${updatedCount} school slugs`);

    } catch (error) {
      console.error('Error syncing slugs:', error);
      toast({
        title: "Error syncing slugs",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={syncSlugs}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sync className="w-4 h-4" />
      )}
      {isLoading ? 'Syncing Slugs...' : 'Sync School Slugs'}
    </Button>
  );
};
