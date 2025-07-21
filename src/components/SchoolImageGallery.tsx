
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSchoolGalleryImages } from '@/hooks/useSchoolImages';

interface SchoolImageGalleryProps {
  schoolName: string;
  mainImage: string;
  schoolId: string;
}

export const SchoolImageGallery: React.FC<SchoolImageGalleryProps> = ({ 
  schoolName, 
  mainImage, 
  schoolId 
}) => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch gallery images from database
  const { data: galleryImages, isLoading } = useSchoolGalleryImages(schoolId);

  // Category translations
  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      'kitchen-facilities': language === 'es' ? 'Instalaciones de Cocina' : 'Kitchen Facilities',
      'classroom': language === 'es' ? 'Aulas' : 'Classrooms',
      'students-cooking': language === 'es' ? 'Estudiantes en Acción' : 'Students in Action',
      'dishes-created': language === 'es' ? 'Platos Creados' : 'Dishes Created',
      'exterior-building': language === 'es' ? 'Edificio' : 'Building',
      'dining-area': language === 'es' ? 'Área de Degustación' : 'Tasting Area'
    };
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  // Generate fallback images if no gallery images exist
  const generateFallbackImages = () => {
    const categories = [
      'kitchen-facilities',
      'classroom', 
      'students-cooking',
      'dishes-created',
      'exterior-building',
      'dining-area'
    ];
    
    return categories.map((category, index) => {
      const imageId = (parseInt(schoolId) + index).toString().padStart(8, '0');
      return {
        id: `fallback-${index}`,
        url: index === 0 ? mainImage : `https://images.unsplash.com/photo-1556909114-${imageId}?w=800&h=600&fit=crop&auto=format`,
        alt: `${schoolName} - ${category}`,
        category: getCategoryLabel(category),
        categoryCode: category,
        isFallback: true
      };
    });
  };

  // Process images: combine main image + real gallery images, or use fallback
  const processImages = () => {
    // Always include main image first
    const mainImageData = {
      id: 'main',
      url: mainImage,
      alt: `${schoolName} - ${language === 'es' ? 'Imagen Principal' : 'Main Image'}`,
      category: language === 'es' ? 'Imagen Principal' : 'Main Image',
      categoryCode: 'main',
      isFallback: false
    };

    if (galleryImages && galleryImages.length > 0) {
      // Use real gallery images
      const realGalleryImages = galleryImages.map((img, index) => ({
        id: img.id,
        url: img.image_url,
        alt: img.alt_text || `${schoolName} - ${img.image_category}`,
        category: getCategoryLabel(img.image_category || 'unknown'),
        categoryCode: img.image_category || 'unknown',
        isFallback: false
      }));
      
      return [mainImageData, ...realGalleryImages];
    } else {
      // Use fallback images (excluding main since we already have it)
      const fallbackImages = generateFallbackImages().slice(1);
      return [mainImageData, ...fallbackImages];
    }
  };

  const images = processImages();

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <Images className="w-5 h-5 mr-2 text-primary" />
        {language === 'es' ? 'Galería de Imágenes' : 'Image Gallery'}
      </h3>
      
      <Card>
        <CardContent className="p-4">
          {/* Main Image Display */}
          <div className="relative mb-4">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              className="w-full h-80 object-cover rounded-lg cursor-pointer"
              onClick={() => setShowModal(true)}
            />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
              {images[selectedImage].category}
            </div>
            
            {/* Navigation arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-primary shadow-lg' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-5xl p-0">
          <div className="relative">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setShowModal(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              <h4 className="font-medium">{images[selectedImage].category}</h4>
              <p className="text-sm opacity-90">{schoolName}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
