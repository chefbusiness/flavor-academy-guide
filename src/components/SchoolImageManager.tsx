import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSchoolImages, useUploadSchoolImage } from '@/hooks/useSchoolImages';
import { initializeSchoolImages } from '@/utils/initializeSchoolImages';
import { schools } from '@/data/schools';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';

export const SchoolImageManager = () => {
  const { data: schoolImages, isLoading, refetch } = useSchoolImages();
  const uploadMutation = useUploadSchoolImage();

  const handleInitializeImages = async () => {
    try {
      const result = await initializeSchoolImages();
      if (result.success) {
        toast({
          title: "Success",
          description: "School images initialized successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to initialize school images",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing images:', error);
      toast({
        title: "Error",
        description: "Failed to initialize school images",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading school images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            School Image Manager
          </CardTitle>
          <CardDescription>
            Manage images for culinary schools. Initialize images from local assets or upload new ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleInitializeImages} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Initialize Images from Assets
            </Button>
            <Badge variant="outline">
              {schoolImages?.length || 0} images stored
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => {
          const schoolImage = schoolImages?.find(img => img.school_id === school.id);
          
          return (
            <Card key={school.id}>
              <CardHeader className="p-0">
                <div className="relative">
                  {schoolImage ? (
                    <img
                      src={schoolImage.image_url}
                      alt={schoolImage.alt_text || school.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted flex items-center justify-center rounded-t-lg">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={schoolImage?.image_type === 'real' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {schoolImage?.image_type === 'real' ? 'Real' : 'AI Generated'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm">{school.name}</h3>
                <p className="text-xs text-muted-foreground">{school.city}, {school.country}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {school.id}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};